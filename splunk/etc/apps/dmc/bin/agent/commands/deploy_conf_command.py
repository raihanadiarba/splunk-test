"""
Deployment Server deploy configuration
"""
# pylint: disable=comparison-with-callable
import json
import logging
import os

from contextlib import contextmanager
from agent import ServerException
from agent import ioc
from agent.commands import CommandBase, CommandResult
from agent.commands.rest_command_base import get_remote_service_from_topology_info
from agent.common.helpers import to_bool
from agent.models.app import AfterInstallation
from agent.models.bundle import BundleType
from agent.models.change import EventType
from agent.services import group_helpers
from agent.services.topologies_service import IDXC_MASTER_FIELD, SEARCH_HEAD_FIELD
from agent.models import PersistentData
from agent.repositories.persistent_data_repository import REPOSITORY_DATA_ID_UNDEPLOYED_BUNDLES

_logger = logging.getLogger(__name__)


_COMMAND_RESULT_NO_APP = "No bundle found"
_COMMAND_RESULT_DEPLOYED = "Deployed"


def _make_after_installation_settings(after_installation):
    """
    Make afterInstallation settings, for example
    issueReload = true
    restartIfNeeded = true
    """
    settings = {after_installation: "true"}
    if after_installation == AfterInstallation.RELOAD:
        settings["restartIfNeeded"] = "true"
    return settings


_AUTO_RESTART_SETTINGS = _make_after_installation_settings(AfterInstallation.RELOAD)


def _fill_bool_from_json_entity(src, dest, key):
    """
    Fill stanza settings with string "true" or "false" from a JsonEntity.
    """
    if src.has_path(key):
        val = src.get_value(key)
        dest[key] = "true" if to_bool(val) else "false"


def _construct_bundle_association(server_class_stanza_name, bundle):
    """
    Construct stanza name for server class to bundle association
    """
    # client bundle path
    # <server_class_stanza_name>:app:<bundle>
    return "%s:app:%s" % (server_class_stanza_name, bundle)


def _construct_server_class_stanzas(server_class_name, server_class_settings, bundle=None, bundle_settings=None):
    """
    Construct a stanza for the server class, and a stanza for its association with a bundle if one specified.
    """
    ret = []

    # client whitelist and reload/reset settings
    # [serverClass:<name>]
    # <filters>
    server_class_stanza_name = "serverClass:" + server_class_name
    ret.append((server_class_stanza_name, server_class_settings))

    if bundle:
        # client bundle path
        # [serverClass:<name>:app:<bundle>]
        # <settings>
        bundle_stanza_name = _construct_bundle_association(server_class_stanza_name, bundle)
        bundle_stanza_value = bundle_settings
        ret.append((bundle_stanza_name, bundle_stanza_value))

    return ret


def server_class_stanza_equal(existing_stanza, new_stanza):
    """
    Compare server class stanza, ignoring infrastructure settings added automatically by Splunk
    """
    count_existing = 0
    for key in existing_stanza:
        # Skip settings that are added by Splunk
        # 'disabled' = '0'
        # 'eai:appName' = 'system'
        # 'eai:userName' = 'nobody'
        if key == "disabled" or ':' in key:
            continue
        count_existing += 1

        if key not in new_stanza:
            return False

        existing_value = existing_stanza[key]
        new_value = new_stanza[key]

        if existing_value == "1" and new_value.lower() == "true":
            continue

        if existing_value == "0" and new_value.lower() == "false":
            continue

        if new_value != existing_value:
            return False

    return count_existing == len(new_stanza)


def flush_server_class_stanzas(splunk_service, new_stanzas):
    """Reconcile with and flush to serverclass.conf
    """
    # TODO: investigate possibilities of batching this operation
    existing_stanzas = splunk_service.confs["serverclass"]

    # Preload serverclass stanzas in order to prevent HTTP calls on each iteration of the the loop below.
    # existing_stanzas[name] under the hood makes a REST call to splunkd.
    existing_stanzas_cache = {stanza.name: stanza for stanza in existing_stanzas}
    names = set(existing_stanzas_cache.keys())
    names.update(new_stanzas)

    for name in sorted(names):
        if name in existing_stanzas_cache and name in new_stanzas:
            existing_stanza = existing_stanzas_cache[name].content
            new_stanza = new_stanzas[name]
            if server_class_stanza_equal(existing_stanza, new_stanza):
                continue

        if name in existing_stanzas:
            # Splunk REST API update only support merge.
            # We need to delete settings that are no longer present
            # for example, whitelist.n
            if name.startswith("serverClass:"):
                existing_stanzas.delete(name)

        if name in new_stanzas:
            existing_stanzas.create(name, **new_stanzas[name])


def _get_client_name(splunk_host, secure_storage, node_info):
    """
    Get the client name for a node
    """
    service = get_remote_service_from_topology_info(splunk_host, secure_storage, node_info)
    response = service.get(path_segment="deployment/client", output_mode="json", count=0)
    res_json = json.load(response.body)
    client_name = res_json["entry"][0]["content"].get("clientName")
    if not client_name:
        raise ServerException(
            node_info["mgmtUri"],
            fmt="Deployment Client not configured for %s.")

    return client_name


def _add_repository_location(server_class_settings, cmd, group_name):
    """
    Make server class name and settings
    If location None, the server class is for group bundles. Otherwise, it is for app bundles
    """
    server_class_settings["repositoryLocation"] = os.path.join(cmd.splunk_home.deployment_apps(), group_name)


# pylint: disable=too-few-public-methods
class BundleTypeProcessor(BundleType):
    # pylint: disable=unused-argument
    """
    Enum with values being functions for processing different types of bundles
    """
    @staticmethod
    def _get_server_class_props_node(cmd, bundle_id, groups, apps, bundle=None, location=None, topology=None):
        """
        Process node bundle
        :param cmd: Command object
        :param bundle_id: instanceId
        :param groups: group entities
        :param apps: app entities
        :param bundle: group bundle path if any
        :param location: bundle repositoryLocation (None for default)
        :return one pair of server class name and client filter properties
        server class name can either be instanceId or client name
        filter properties will be a whitelist that matches a single client

        """
        # Get clientName of the node.
        node_id = group_helpers.get_node_id(bundle_id)

        if not node_id:
            # TODO When un-registering an instance, we should clean up its bundle in predeployment folder.
            _logger.warning("Instance not found for bundle_id %s. Skipping deployment.", bundle_id)
            return []

        server_class_settings = {"whitelist.0": node_id}
        group_name = group_helpers.make_node_group_name(bundle_id)

        _add_repository_location(server_class_settings, cmd, group_name)

        return _construct_server_class_stanzas(group_name,
                                               server_class_settings,
                                               bundle,
                                               _AUTO_RESTART_SETTINGS)

    @staticmethod
    def _get_server_class_props_custom(cmd, bundle_id, groups, apps, bundle=None, location=None, topology=None):
        """
        Process custom bundle
        :param cmd: Command object
        :param bundle_id: custom group name
        :param groups: group entities
        :param apps: app entities
        :param bundle: group bundle path if any
        :param location: bundle repositoryLocation (None for default)
        :return one pair of server class name and client filter properties
        server class name is the group name, and filter properties are those defined in the group
        """
        if bundle_id not in groups:
            # This should not happen normally in production, but can happen on dev machines where
            # $SPLUNK_HOME/etc/predeployment is not clean
            _logger.warning("Group not found for bundle_id %s. Skipping deployment.", bundle_id)
            return []

        group_name = bundle_id

        group = groups[bundle_id]
        server_class_settings = cmd.compute_custom_group_filter(group)

        _add_repository_location(server_class_settings, cmd, group_name)

        return _construct_server_class_stanzas(group_name,
                                               server_class_settings,
                                               bundle,
                                               _AUTO_RESTART_SETTINGS)

    # pylint: disable=too-many-locals
    @staticmethod
    def _get_server_class_props_app(cmd, bundle_id, groups, apps, bundle, location, topology=None):
        """
        Process custom bundle
        :param cmd: Command object
        :param bundle_id: app name
        :param groups: group entities
        :param apps: app entities
        :param bundle: app path
        :param location: bundle repositoryLocation (None for default)
        :return a list of pairs of server class names and their settings
        There's one entry in the list for each group associated with the app, and
        an entry for the app itself.
        The entries for groups have client filters in their settings while the entry for the app
        has restart/reload values.
        """
        if bundle_id not in apps:
            # This should not happen normally in production, but can happen on dev machines where
            # $SPLUNK_HOME/etc/predeployment is not clean
            _logger.warning("App not found for bundle_id %s. Skipping deployment.", bundle_id)
            return []

        app = apps[bundle_id]

        app_groups = apps[bundle_id].get_value("groups", [])

        # Slim apps are pre-split into locations for groups.
        if location not in app_groups:
            app_groups.append(location)

        # app local settings has to be excluded from update. Current implementation cannot merge of user and  default
        # settings and if app has new lookups they become ignored by update procedure. A more robust implementation
        # could try to actually merge the settings but this would be very complicate. Also we assume that this is not
        # a common scenario.
        bundle_settings = {"excludeFromUpdate": "$app_root$/local,$app_root$/lookups,$app_root$/metadata/local.meta"}

        # afterInstallation can be None, "issueReload" or "restartSplunkd"
        after_installation = app.get_value("afterInstallation", "")
        if after_installation:
            # This will end up in the stanza for server class to app bundle association
            # Below is an example:
            # [serverClass:_forwarders:app:splunk_imperva_audit]
            # issueReload = true
            # restartIfNeeded = true
            bundle_settings = _make_after_installation_settings(after_installation)

        ret = []
        for group_name in app_groups:
            _logger.debug("processing app %s for group %s", bundle_id, group_name)
            custom_group = groups.get(group_name)

            if custom_group:
                group_props = BundleTypeProcessor._get_server_class_props_custom(
                    cmd,
                    group_name,
                    groups,
                    apps,
                    bundle=None,
                    location=location
                )
            elif group_helpers.is_single_node(group_name):
                group_props = BundleTypeProcessor._get_server_class_props_node(
                    cmd,
                    group_helpers.get_instance_id(group_name),
                    groups,
                    apps,
                    location=location
                )
            else:
                assert group_helpers.is_builtin(group_name)
                builtin_id = group_helpers.builtin_name(group_name)
                group_props = BundleTypeProcessor._get_server_class_props_builtin(
                    cmd,
                    builtin_id,
                    groups,
                    apps,
                    location=location,
                    topology=topology
                )

            ret.extend(group_props)

            if group_props:
                stanza_name, _ = group_props[0]
                bundle_stanza_name = _construct_bundle_association(stanza_name, bundle)
                ret.append((bundle_stanza_name, bundle_settings))

        return ret
    # pylint: enable=too-many-locals

    @staticmethod
    def _get_server_class_props_builtin(cmd, builtin_id, groups, apps, bundle=None, location=None, topology=None):
        """
        Process builtin group bundle
        :param cmd: Command object
        :param builtin_id: Not used
        :param groups: group entities
        :param apps: app entities
        :param bundle: group bundle path if any
        :param location: bundle repositoryLocation (None for default)
        :return one pair of server class name and client filter properties
        server class name is the 'all' builtin group name and filter is a whitelist that matches everything
        """
        group_name = group_helpers.builtin_name[builtin_id]

        server_class_settings = {"whitelist.0": "*"}

        if builtin_id in (group_helpers.builtin_id.forwarders or builtin_id, group_helpers.builtin_id.all):

            class Blacklist(object):  # pylint: disable=useless-object-inheritance
                """
                A blacklist in the server class
                """
                def __init__(self):
                    """
                    Initialize with index to blacklist entry to be zero
                    """
                    self.index = 0

                def add(self, topology_field_name):
                    """
                    Add a blacklist entry for a node such as Search Head, or CM.
                    """
                    node_info = topology.get(topology_field_name)
                    if not node_info:
                        return

                    client_name = _get_client_name(cmd.splunk_host, cmd.secure_storage, node_info)
                    server_class_settings["blacklist." + str(self.index)] = client_name
                    self.index += 1

            black_list = Blacklist()

            black_list.add(IDXC_MASTER_FIELD)
            black_list.add(SEARCH_HEAD_FIELD)
        else:
            server_class_settings = {}
            if builtin_id == group_helpers.builtin_id.indexers:
                topology_field = IDXC_MASTER_FIELD
                server_class_settings["targetRepositoryLocation"] = "$SPLUNK_HOME/etc/master-apps"
                server_class_settings["stateOnClient"] = "noop"
            elif builtin_id == group_helpers.builtin_id.search_heads:
                topology_field = SEARCH_HEAD_FIELD
                server_class_settings.update(_AUTO_RESTART_SETTINGS)
            else:
                topology_field = None

            if not topology_field:
                return []

            server_info = topology.get(topology_field)
            if not server_info:
                return []

            client_name = _get_client_name(cmd.splunk_host, cmd.secure_storage, server_info)
            server_class_settings["whitelist.0"] = client_name

        _add_repository_location(server_class_settings, cmd, group_name)

        # server class name is group name, for example, _forwarders
        return _construct_server_class_stanzas(group_name,
                                               server_class_settings,
                                               bundle,
                                               _AUTO_RESTART_SETTINGS)

    # pylint: enable=unused-argument

    node = _get_server_class_props_node
    custom = _get_server_class_props_custom
    app = _get_server_class_props_app
    builtin = _get_server_class_props_builtin
# pylint: enable=too-few-public-methods


# pylint: disable=too-many-instance-attributes
class DeployConfCommand(CommandBase):
    """Deployment Server deploy configuration command
    """

    def __init__(self):
        self.splunk_host = ioc.components.splunk_host()
        self.splunk_home = ioc.components.splunk_home()
        self._deployment_apps = self.splunk_home.deployment_apps()
        self._stanzas_service = ioc.services.stanzas_service()
        self._cancel_pending_changes_service = ioc.services.cancel_pending_changes_service()
        self._groups_repository = ioc.repositories.groups_repository()
        self._apps_repository = ioc.repositories.apps_repository()
        self._changelog_service = ioc.services.changelog_service()
        self.transaction_manager = ioc.components.transaction_manager()
        self.user_context = ioc.components.user_context()
        self._tasks_service = ioc.services.tasks_service()
        self.secure_storage = ioc.services.secure_storage()
        self._persistent_data_repository = ioc.repositories.persistent_data_repository()
        self._pending_changelog_repository = ioc.repositories.pending_changelog_repository()

    def execute(self, command):
        """Execute deploy command
        """
        _logger.debug("deploy DS configuration")
        splunk_service = self.splunk_host.get_service(owner="nobody")

        # Prevent concurrent changes so that we know for sure
        # whether or not a change in the change log is deployed or not.
        with self.transaction_manager.transaction():
            group_entities = self._groups_repository.get_all(fields=[
                "name",
                "whitelist",
                "blacklist",
                "filterType",
                "machineTypesFilter"])
            groups = {group.get_value("name"): group for group in group_entities}

            app_entities = self._apps_repository.get_all()
            apps = {app.get_value("name"): app for app in app_entities}

            with self._changed_bundles_persistent_scope() as changed_bundles:
                # take a backup of predeployment-apps
                self._cancel_pending_changes_service.prepare_backup_state()

                payload = command.get_value("payload")

                self._changelog_service.record(
                    EventType.deploy,
                    self.user_context.user,
                    {"taskId": command.get_value("taskId")},
                    skip_audit=payload.get("skipAudit", False)
                )

                topology = command.get_value(("payload", "topology"), raise_error=False)

                deployed_total = self._sync_to_server_class(
                    splunk_service, groups, apps, changed_bundles, topology)

        _logger.debug("processed a total of %d bundles", deployed_total)
        result_description = _COMMAND_RESULT_DEPLOYED if deployed_total > 0 else _COMMAND_RESULT_NO_APP

        return CommandResult(
            True,  # completed
            False,  # failed
            result_description,
            None  # payload
        )

    @staticmethod
    def compute_custom_group_filter(group):
        """
        Compute client filters for custom group
        """
        filters = dict()
        # copy key-value "as is"
        for key in ["filterType", "machineTypesFilter"]:
            if group.has_path(key):
                filters[key] = group.get_value(key)
        # convert sequential filters from csv format to dictionary
        # "one, two, three" becomes "whitelist.0": "one", "whitelist.1": "two", "whitelist.2": "three"
        for key in ["whitelist", "blacklist"]:
            if not group.has_path(key):
                continue
            tag_n = 0  # filter tag count

            # The following is consistent with Splunk Forwarder management UI for splitting
            # text typed in by user. Refer to
            # mgmt-ui/web/search_mrsparkle/exposed/js/views/deploymentserver/editServerclass/addClients/AddClients.js
            values = group.get_value(key).replace("\n", "").split(",")  # read csv format

            for value in values:
                filters["%s.%d" % (key, tag_n)] = value.strip()
                tag_n += 1
        return filters

    # pylint: disable=too-many-locals
    def _sync_to_server_class(self, splunk_service, groups, apps, changed_bundles, topology):
        """
        Update serverclass.conf
        Return the number of bundles copied to the deployment folder
        :param changed_bundles: dict of changed bundles - OpType -> set of (BundleType, BundleName)
        """
        deployed_bundles_num = 0
        self._stanzas_service.sync_deployment_bundles(changed_bundles, topology)
        deployment_bundles = self._stanzas_service.list_deployment_bundles()

        stanzas = {}
        for bundle_type, bundle_id, bundle_folder, location in deployment_bundles:
            _logger.debug("process DS app, type=%s, id=%s, bundle=%s, location=%s",
                          bundle_type, bundle_id, bundle_folder, location)

            server_class_props_list = BundleTypeProcessor[bundle_type](
                self, bundle_id, groups, apps, bundle_folder, location, topology)

            for name, value in server_class_props_list:
                _logger.debug("Recorded serverclass stanza %s", name)

                stanzas[name] = value
                deployed_bundles_num += 1

        flush_server_class_stanzas(splunk_service, stanzas)
        return deployed_bundles_num
    # pylint: enable=too-many-locals

    def _update_persistent_changed_bundles(self, changed_bundles):
        """Update persistent storage of the changed deployment bundles. This function returns combined dict of changed
        bundles that the system tried to deploy previously (but failed for some reason) with the bundles staged for
        deployment now.
        """

        if not self._persistent_data_repository.exists(REPOSITORY_DATA_ID_UNDEPLOYED_BUNDLES):
            self._persistent_data_repository.insert(PersistentData({
                "name": REPOSITORY_DATA_ID_UNDEPLOYED_BUNDLES, "data": {}}))

        persistent_dict = \
            self._persistent_data_repository.get(REPOSITORY_DATA_ID_UNDEPLOYED_BUNDLES).data

        # deserialize persistent data: replace lists by tuples sets
        for op_type, bundles in persistent_dict.items():
            persistent_dict[op_type] = set((bundle[0], bundle[1]) for bundle in bundles)

        if changed_bundles:
            for op_type, bundles in changed_bundles.items():
                persistent_dict.setdefault(op_type, set())
                persistent_dict[op_type].update(bundles)

            # save serialized
            self._persistent_data_repository.update(PersistentData({
                "name": REPOSITORY_DATA_ID_UNDEPLOYED_BUNDLES,
                "data": {op_type: list(bundles) for op_type, bundles in persistent_dict.items()}
            }))

        return persistent_dict

    @contextmanager
    def _changed_bundles_persistent_scope(self):
        """Changed bundles scope. The changes are stored in an persistent storage.
        """
        # changed_bundles dict has form: OpType -> set of tuples (BundleType, BundleName)
        changed_bundles = dict()

        # compose bundles relevant to the update (stanza)
        changes = self._pending_changelog_repository.get_all(
            query={"$or": [{"type": EventType.app},
                           {"type": EventType.group},
                           {"type": EventType.stanza}]},
            fields=["key", "opType", "type"])

        for change in changes:
            change_type = change.get_value("type")
            key = change.get_value("key")

            if change_type == EventType.app:
                bundle = (BundleType.app, key["name"])
            elif change_type == EventType.group:
                bundle = (BundleType.custom, key["name"])
            elif change_type == EventType.stanza:
                bundle = (key["bundleType"], key["bundleId"])
            else:
                assert False  # unsupported change type, this should never happen

            op_type = change.get_value("opType")
            changed_bundles.setdefault(op_type, set())
            changed_bundles[op_type].add(bundle)

        yield self._update_persistent_changed_bundles(changed_bundles)

        # at this point all deployment bundles has been synchronized successfully and we can clear the storage
        self._persistent_data_repository.update(PersistentData({
            "name": REPOSITORY_DATA_ID_UNDEPLOYED_BUNDLES, "data": {}
        }))

# pylint: enable=too-many-instance-attributes
