"""
Contains implementation of the thread which polls dmc-server about
any forwarders which are not registered with the dmc-agent
"""
import json

import uuid
import traceback

from collections import namedtuple, OrderedDict

from agent import ioc, ControllerBase
from agent.services.deploy_status_helpers import DeploymentMetricAction
from agent.models import Instance
from agent.common.topology_helpers import topology_role_name
from agent.common.helpers import stringify_guid
from agent.repositories import RepositoryBatchCommand
from agent.services.deploy_service import FIELDS_NEEDED_FOR_CACHE


SyncContext = namedtuple(
    "SyncContext",
    ("registered_instances", "updated_instances", "new_instances", "flags"))

# A subset of bundle action fields which we process and record.
BUNDLE_FIELDS_SET = (
    "action",
    "checksum",
    "failedReason",
    "result",
)


def _process_instance_applications(client_instance_id, src_application_dict, dest_application_list):
    """
    Process DS applications and recorded ones. Return the result for recording.
    DS applications are in a dictionary. For example,
    {
        "_01000_forwarders": {
            "action": "Install",
            "archive": "/Users/ywu/splunkbuild/var/run/tmp/_forwarders/_01000_forwarders-1461194488.bundle",
            "checksum": "2643821199188759191",
            "excludeFromUpdate": "",
            "failedReason": "''",
            "issueReload": False,
            "restartIfNeeded": False,
            "restartSplunkWeb": False,
            "restartSplunkd": True,
            "result": "Ok",
            "serverclasses": [
                "_forwarders"
            ],
            "size": "10240",
            "stateOnClient": "noop",
            "timestamp": "Thu Apr 21 09:54:15 2016"
        }
    }
    Recorded ones and the return is a list. This is because they need to support KV store query, such as
    {"applications.name": "foo"}, and have fixed rather than random ordering. For example:
    [
        {
            'name': '_01000_forwarders',
            'content': {
                 'action': 'Install',
                 'result': 'Ok',
                 'checksum': '2643821199188759191',
                 'failedReason': "''"
            }
        }
    ]
    """
    # Converting the ordered list into an ordered dictionary
    dest_application_tuples = [(x["name"], x["content"]) for x in dest_application_list]
    dest_application_dict = OrderedDict(dest_application_tuples)

    # Converting the regular dictionary into an ordered dictionary by applying default sorting on key
    src_application_tuples = sorted(src_application_dict.items(), key=lambda t: t[0])
    src_application_dict = OrderedDict(src_application_tuples)

    _merge_instance_application_dict(client_instance_id, src_application_dict, dest_application_dict)

    # Converting the ordered dictionary into an order list for persisting into KV store in a format that can be
    # queried efficiently.
    return [{"name": name, "content": value} for name, value in dest_application_dict.items()]


def _merge_instance_application_dict(client_instance_id, src, dest):
    """
    Merge source applications into dest applications and update up to date status cache
    """
    instance_id = None
    for application_name in src:
        src_application = src[application_name]
        src_action = src_application["action"]
        dest_application = dest.get(application_name)
        dest_action = dest_application["action"] if dest_application else None

        # New deployment metric actions will always be recorded while
        # recorded non metric actions will always be overwritten
        if src_action in DeploymentMetricAction or dest_action not in DeploymentMetricAction:
            recorded_fields = {field_name: src_application[field_name] for field_name in BUNDLE_FIELDS_SET}
            dest[application_name] = recorded_fields
            if not instance_id:
                instance_id = stringify_guid(client_instance_id)

    for application_name in dest:
        if application_name not in src:
            # non existent bundle will be deleted
            # DS always returns full list of applications that the client is configured to receive.
            dest.pop(application_name, None)


class ForwardersController(ControllerBase):
    """Forwarders controller

    Polls dmc server about new forwarders registered using
    deployment server / client connection
    """

    CONTENT_FIELDS_MAPPING = {
        "guid": "guid",
        "clientName": "clientName",
        "hostname": "hostname",
        "dns": "dns",
        "ip": "ip",
        "splunkBuild": "build",
        "splunkPlatform": "utsname",
        "splunkVersion": "splunkVersion",
        "splunkPackage": "package",
        "splunkInstanceName": "instanceName",
        "lastPhoneHomeTime": "lastPhoneHomeTime"
    }

    def __init__(self):
        self._configuration = ioc.components.configuration()
        self._splunkhost = ioc.components.splunk_host()
        self._iservice = ioc.services.instances_service()
        self._tservice = ioc.services.topologies_service()
        self._deployservice = ioc.services.deploy_service()
        self._tmanager = ioc.components.transaction_manager()
        self._page_size = self._configuration.get_int("deployment_server_sync_pagesize", default=30)
        wait_timeout = self._configuration.get_int("deployment_server_sync_sec", default=60)
        super(ForwardersController, self).__init__(events=("PullForwarders",), wait_timeout=wait_timeout)

    def _background_iteration(self):
        self.sync_forwarders()

    # pylint: disable=too-many-locals
    def sync_forwarders(self):
        """Synchronize list of clients with list of
        known forwarders
        """

        self._logger.debug("Entering sync_forwarders")

        context = SyncContext(
            registered_instances={},
            updated_instances=[],
            new_instances=[],
            flags={}
        )

        for instance in self._iservice.get_all():
            context.registered_instances[uuid.UUID(instance.instanceid)] = instance

        service = self._splunkhost.get_service()
        try:
            self._logger.debug("Calling /services/deployment/server/clients")
            path_segment = "/services/deployment/server/clients"
            # TODO Paging slows things down so we don't do it for now. Refer to SPL-124934.
            response = service.get(path_segment=path_segment, output_mode="json", count=0)
            self._logger.debug("Get response from /services/deployment/server/clients")
            deployment_clients = json.load(response.body)
            self._logger.debug("Done parsing response from /services/deployment/server/clients")

            for deployment_client in deployment_clients["entry"]:
                try:
                    self._handle_deployment_client(context, deployment_client)
                # pylint: disable=bare-except
                except:  # noqa: E722
                    # pylint: enable=bare-except
                    self._logger.error("Failed to register %s. %s.", deployment_client["name"], traceback.format_exc())

            batch_command = RepositoryBatchCommand()

            def iter_instance(instances):
                """
                Iterate instances while skipping deleted ones
                """
                for client_instance_id, content in instances:
                    instance_id = stringify_guid(client_instance_id)

                    if self._deployservice.is_instance_deleted(instance_id):
                        continue

                    yield client_instance_id, instance_id, content

            with self._tmanager.transaction():
                for client_instance_id, _, content in iter_instance(context.updated_instances):
                    batch_command.add_update(client_instance_id, content)

                for _, instance_id, content in iter_instance(context.new_instances):
                    instance = Instance({
                        "instanceId": instance_id,
                        "topology": topology_role_name.forwarder_member
                        })
                    instance.set_values(content)
                    batch_command.add_insert(instance)

                if not batch_command.empty():
                    self._logger.debug("Saving forwarder changes")
                    self._iservice.batch(batch_command)
                    self._tservice.sync_topology_forwarders()
                    self._logger.debug("Done saving forwarder changes")

                self._deployservice.clear_instance_deletion_records()

            if context.new_instances or context.flags.get("invalidate_cache", False):
                self._deployservice.invalidate_cache(
                    instances_changed=True,
                    groups_changed=False,
                    apps_changed=False,
                    ds_apps_changed=False)
        # pylint: disable=broad-except
        except Exception as ex:
            self._logger.warning("Could not get list of clients. %s", str(ex))

        self._logger.debug("Exiting sync_forwarders")
        # pylint: enable=broad-except
        # pylint: enable=too-many-locals

    # pylint: disable=inconsistent-return-statements
    def _handle_deployment_client(self, context, deployment_client):
        """Handle deployment client

        If this is not registered instance, we check if this is an instance
        registered with DMC or forwarder.
        """
        content = deployment_client["content"]

        # For old forwarders we do not have instanceId, let's parse deployment client name as id
        try:
            if not content["instanceId"]:
                # Normalize name to id
                client_instance_id = uuid.UUID(deployment_client["name"])
            else:
                client_instance_id = uuid.UUID(content["instanceId"])
        except ValueError:
            self._logger.warning("Ignoring unidentified deployment client %s. Failed to parse id",
                                 deployment_client["name"])
            return False

        updated_content = self._parse_sync_content(content)

        instance = context.registered_instances.get(client_instance_id)

        dest_application_list = instance.make_application_list() if instance else []
        src_application_dict = content.get("applications", {})
        if src_application_dict is None:
            src_application_dict = {}

        updated_application_list = _process_instance_applications(
            client_instance_id,
            src_application_dict,
            dest_application_list)

        if updated_application_list:
            updated_content["applications"] = updated_application_list

        if instance:
            if not instance.match_values(updated_content):
                if not instance.match_values({key: value
                                              for key, value
                                              in updated_content.items()
                                              if key in FIELDS_NEEDED_FOR_CACHE}):
                    context.flags["invalidate_cache"] = True
                if updated_application_list:
                    self._logger.debug("%d applications will be recorded", len(updated_application_list))

                context.updated_instances.append((client_instance_id, updated_content))
                self._logger.debug("Deployment client content has been changed for instance %s. %s",
                                   client_instance_id, updated_content)
        else:
            context.new_instances.append((client_instance_id, updated_content))
            self._logger.debug("New deployment client content has been added for instance %s. %s",
                               client_instance_id, updated_content)

    def _parse_sync_content(self, content):
        """Parse all content which we are interested in
        """
        updated_content = {key: content[value]
                           for key, value
                           in self.CONTENT_FIELDS_MAPPING.items()
                           if key != "lastPhoneHomeTime"}
        updated_content["lastPhoneHomeTime"] = self._parse_last_phone_home_time(content)
        return updated_content

    def _parse_last_phone_home_time(self, content):
        """Parse lastPhoneHomeTime as int
        """
        try:
            return int(content["lastPhoneHomeTime"])
        except ValueError as err:
            self._logger.error("Failed to parse lastPhoneHomeTime from %s. %s",
                               content["lastPhoneHomeTime"], str(err))
        return None
