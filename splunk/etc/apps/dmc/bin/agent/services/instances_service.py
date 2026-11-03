"""
Instances service
"""
import logging
import copy

from agent import ioc, wtransaction
from agent import ServerException
from agent.common.helpers import ABSENT
from agent.common.topology_helpers import topology_role_name
from agent.repositories.base_repository import Collection
from agent.services import group_helpers
from agent.services.deploy_status_helpers import compute_bundle_status
from agent.services.group_helpers import make_bundle_name, group_topology_role_name, builtin_name
from agent.services.stanzas_service import make_bundle_folder_name
from agent.models.serverclass_filtering_group import ServerclassFilteringGroup
from agent.models import Group


FIELD_RELATED_BUNDLES = "@relatedBundles"
_FIELD_UP_TO_DATE = "@upToDate"
_FIELD_BUNDLES = "@bundles"


def _add_bundle_filter_to_query(req_query, bundle):
    """
    Add bundle filter to req_query and return it.
    """
    bundle_folder_name = make_bundle_folder_name(bundle)
    bundle_query = {"applications.name": bundle_folder_name}
    req_query = {"$and": [req_query, bundle_query]} if req_query else bundle_query
    return req_query


def _make_deploy_status_filters(cache, deploy_status_query, req_query):
    """
    Parse deploy_status_query and return a runtime filter and a repository query
    Examples:
        Inputs:
            deploy_status_query: {"bundle": "__forwarders", "upToDate":<up_to_date_value>}
            req_query: {"topology": "forwarder:member"}
        Return:
            1. a function with instance entity as input and returning a boolean indicating
               if the instance has passed the filter or not.

            2. a repository query: {"application": "_01000_forwarders"}
    """
    bundle = None
    deploy_status_filter = None
    if deploy_status_query is not None:
        bundle = deploy_status_query.get("bundle")

        up_to_date_filter = deploy_status_query.get("upToDate", ABSENT)

        if bundle:
            if up_to_date_filter is True:
                # Add deploy status query. Note that this needs to be done after the logic to pull out
                # serverclass query, which looks for a narrow fixed pattern.
                req_query = _add_bundle_filter_to_query(req_query, bundle)

            def bundle_filter(instance):
                """
                Select instances that have expected bundle up_to_date value.
                """
                application_name = make_bundle_folder_name(bundle)
                application_up_to_date = cache.get_instance_application_up_to_date(
                    instance["instanceId"],
                    application_name)

                if application_up_to_date is ABSENT:
                    # This might be a new bundle that has not been deployed
                    # In this case, we filter out the instance
                    # (regardless of the up_to_date portion of the deploy_status_query)
                    # even if the instance is configured to receive the bundle
                    return False

                if up_to_date_filter is ABSENT:
                    return True

                return up_to_date_filter == application_up_to_date

            deploy_status_filter = bundle_filter
        elif up_to_date_filter is not ABSENT:
            def instance_filter(instance):
                """
                Select instances that have expected up_to_date_value
                """
                return up_to_date_filter == cache.is_instance_up_to_date(instance["instanceId"])

            deploy_status_filter = instance_filter
    return deploy_status_filter, req_query


class InstancesService(ioc.Component):

    """Service to work with instances

    Allow to register/deregister instances
    """

    VALID_TOPOLOGIES_TO_DELETE = [topology_role_name.unassigned,
                                  topology_role_name.removed,
                                  topology_role_name.forwarder_member]

    def __init__(self):
        self._repository = ioc.repositories.instances_repository()
        self._tasks_service = ioc.services.tasks_service()
        # lazy binding to avoid circular dependency
        self._deploy_service = ioc.services.deploy_service()
        self._groups_service = ioc.services.groups_service()
        self._stanzas_service = ioc.services.stanzas_service()
        self._secure_storage = ioc.services.secure_storage()
        self._transaction_manager = ioc.components.transaction_manager()
        self._logger = logging.getLogger(self.__class__.__name__)

    @wtransaction
    def create_instance_workflow(self, instance):
        """Create new instance workflow.
        """
        self._logger.debug("Registering instance with id %s", instance.instanceid)
        if instance.has_path("splunkAdminPassword"):
            instance.splunk_admin_password = self._secure_storage.encrypt(instance.splunk_admin_password)
        if instance.has_path("splunkPassKey"):
            instance.splunk_pass_key = self._secure_storage.encrypt(instance.splunk_pass_key)
        if instance.has_path(("ssh", "keyString")):
            ssh = instance.get_value("ssh")
            ssh["keyString"] = self._secure_storage.encrypt(ssh["keyString"])
        if not self._repository.exists(instance.instanceid):
            saved_instance = self._repository.insert(instance)
        else:
            saved_instance = self._repository.update(instance)
        saved_instance.set_value("@migration", instance.get_value("@migration", default=False))
        self._tasks_service.new_task("instance_workflow", instance=saved_instance)
        return saved_instance

    @wtransaction
    def insert(self, instance):
        """Directly insert instance without creating the task.
        We use this method to register/insert forwarders
        """
        instance = self._repository.insert(instance)
        return instance

    # pylint: disable=too-many-arguments
    def get_all(self,
                req_query=None,
                count=None,
                offset=None,
                sort_key=None,
                reverse=False):
        """Get list of registered instances
        """
        sort = ((sort_key, -1 if reverse else 1),) if sort_key else None
        result = self._repository.get_all(query=req_query,
                                          limit=count,
                                          skip=offset,
                                          sort=sort)
        return result

    # pylint: disable=too-many-locals
    def get_all_with_total(self,
                           req_query=None,
                           count=None,
                           offset=None,
                           sort_key=None,
                           reverse=False,
                           deploy_status_query=None):
        """
        Fetch the results along with the total
        :return {tuple} (results, total):
        """
        groups = None
        if req_query:
            # extract serverclasses query, it should be in $and->?->$or->serverclass
            and_clauses = req_query.get("$and") or []
            for and_clause in and_clauses:
                or_clauses = and_clause.get("$or")
                if or_clauses and all(or_clause.get("serverClass") for or_clause in or_clauses):
                    # server class are custom groups
                    groups = [sc["serverClass"] for sc in and_clause["$or"]]
                    # remove serverclasses subquery from request
                    req_query = copy.deepcopy(req_query)  # clone req_query, we don't want to change the arg object
                    req_query["$and"].remove(and_clause)
                    if not req_query["$and"]:
                        req_query = None
                    break
            self._logger.debug("req_query=%s, serverclasses_query=%s", req_query, groups)

        cache = self._deploy_service.get_cache()
        deploy_status_filter, req_query = _make_deploy_status_filters(
            cache,
            deploy_status_query,
            req_query)

        if groups or deploy_status_filter:
            result = self.get_all_by_post_filters(req_query=req_query,
                                                  groups=groups,
                                                  deploy_status_filter=deploy_status_filter,
                                                  count=count,
                                                  offset=offset,
                                                  sort_key=sort_key,
                                                  reverse=reverse)
        else:
            result = self._repository.get_all_with_total(query=req_query,
                                                         limit=count,
                                                         skip=offset,
                                                         sort=((sort_key, -1 if reverse else 1),)
                                                         if sort_key else None)

        if deploy_status_query is not None:
            for instance in result.results:
                self._fill_deploy_status(instance, cache)

        return result

    def get_all_names(self,
                      req_query=None,
                      count=None,
                      offset=None,
                      sort_key=None,
                      reverse=False):
        """
        Fetch identities of instances
        """
        sort = ((sort_key, -1 if reverse else 1),) if sort_key else None
        return self._repository.get_all_with_total(
            query=req_query,
            limit=count,
            skip=offset,
            sort=sort,
            fields=("instanceId", "clientName"),
            add_auxiliary_info=False)
    # pylint: enable=too-many-arguments

    def get_count(self, query=None):
        """Get number of instances satisfied to specified query
        """
        return self._repository.get_count(query=query)

    def get_by_name(self, instance_name):
        """Get one instance by instance name
        """

        return self._repository.get_by_name(instance_name)

    def get(self, instance_id, related_bundles=False):
        """Get an instance by its id.
        Args:
            instance_id:
            related_bundles: query additional instance info that should be added to the result
        """
        instance = self._repository.get(instance_id)
        if related_bundles:
            # add bundles information
            instance.set_value(FIELD_RELATED_BUNDLES, self.get_related_bundles(instance))

        self._fill_deploy_status(instance, self._deploy_service.get_cache())
        return instance

    # pylint: disable=too-many-arguments
    # pylint: disable=too-many-locals
    def get_all_by_post_filters(self,
                                groups,
                                deploy_status_filter,
                                req_query,
                                count,
                                offset,
                                sort_key,
                                reverse):
        """Get all instances that match serverclasses. Due to KV store limitations (it's unable to query
        $not -> $regex, that's vital for serverclass filtering) the current implementation does "manual", in-memory
        filtering.
        TODO we may consider to improve this implementation and to do filtering on KV store side
        """

        # raw unfiltered instances
        raw_instances = self._repository.get_all(
            query=req_query,
            sort=((sort_key, -1 if reverse else 1),) if sort_key else None,
            fields=("instanceId",),
            raw=True)
        if not raw_instances:
            return Collection([], 0)

        # do actual filtering - an instance is matched if it satisfies at least one serverclass, the result remains
        # sorted, when serverclasses_query is absent - use raw_instances as is
        filtered_instances = list(self.filter_instances_with_group_instances(
            raw_instances,
            groups,
            deploy_status_filter
        )) if groups or deploy_status_filter else raw_instances

        # return paginated result
        start = offset if offset else 0
        end = start + count if count else len(filtered_instances)

        page = filtered_instances[start:end]

        if page:
            query = {"$or": [{"_key": instance["instanceId"]} for instance in page]}
            instances = self._repository.get_all(query=query)

            instance_map = {instance.objid: instance for instance in instances}
            result = [instance_map[instance["instanceId"]] for instance in page]
        else:
            assert not filtered_instances
            result = []

        return Collection(result, len(filtered_instances))
    # pylint: enable=too-many-locals
    # pylint: enable=too-many-arguments

    def filter_instances_with_group_instances(self, instances, groups, deploy_status_filter):
        """Filter instances by serverclasses, using pre-computed group instances map
        """
        cache = self._deploy_service.get_cache()
        for instance in instances:
            instance_id = instance["instanceId"]
            if groups and not any(instance_id in cache.get_group_instances(group) for group in groups):
                continue
            if deploy_status_filter and not deploy_status_filter(instance):
                continue
            yield instance

    def get_related_bundles(self, instance):
        """Get bundles related to an instance
        """
        related_groups = dict()  # group name -> group type dictionary

        related_groups[group_helpers.builtin_name.all] = "builtin"  # _all group

        # instance node group
        related_groups[group_helpers.make_node_group_name(instance.instanceid)] = "node"

        # topology
        if instance.has_topology:
            role_group_name = group_helpers.topology_role_group_name[instance.topology]
            if role_group_name:
                related_groups[role_group_name] = "builtin"

        # custom groups
        filters = self._groups_service.make_serverclass_filtering_groups()

        for fltr in filters:
            if fltr.match(instance):
                related_groups[fltr.get_group_name()] = "custom"

        # compose related bundles structure
        related_bundles = dict()
        for group, group_type in related_groups.items():
            related_bundles[make_bundle_name(group)] = dict(type=group_type, name=group)
            # applications
            for app in self._groups_service.get_app_names_for_group(group):
                app_bundle = related_bundles.get(app)
                if not app_bundle:  # create app bundle description if it doesn't exist
                    app_label = self._stanzas_service.get_app_label(app)
                    app_bundle = related_bundles[app] = dict(
                        type="app",
                        label=app_label,
                        groups=dict())
                app_bundle["groups"][group] = dict(type=group_type)

        return related_bundles

    @wtransaction
    def update_instance_properties(self, instance_id, properties):
        """
            Update the properties on existing instance
        """
        instance = self._repository.get(instance_id)
        task_state = instance.get_value(("task", "state"))
        if task_state not in ('failed', 'completed'):
            raise ServerException(fmt="Cannot update when a instance has a running task")
        instance.set_values(properties)
        return self.create_instance_workflow(instance)

    @wtransaction
    def update(self, instance):
        """Update instance
        """
        return self._repository.update(instance)

    @wtransaction
    def delete_instance(self, instanceid):
        """
        Check if instance has a topology unassigned, removed or
        forwarder before deleting. We only delete instances with those labels
        :param instanceid:
        """
        instance = self.get(instanceid)
        self._tasks_service.new_task("instance_delete_workflow", instance=instance)
        return instance

    @wtransaction
    def batch(self, batch_command):
        """Update all last phone home timestamps
        """
        result = self._repository.batch(batch_command)
        if not result:
            self._logger.warning("Not all last phone timestamps were updated")

    def _fill_deploy_status(self, instance, cache):
        """
        Fill the instance with deploy status
        """
        bundles = self.compute_deploy_status(instance)
        instance.set_value("@bundles", bundles)
        instance.set_value("@upToDate", cache.is_instance_up_to_date(instance.instanceid))

    def compute_deploy_status(self, instance):
        """
        Return computed deploy_status
        """
        client_applications = {client_application["name"]: client_application["content"]
                               for client_application in instance.make_application_list()}
        instance_id = instance.instanceid

        bundles = {}
        cache = self._deploy_service.get_cache()
        for application_name in client_applications:
            client_application = client_applications[application_name]
            if not cache.has_server_application_for_instance(instance.instanceid, application_name):
                # The Application was captured into the instance in forwarder controller, however
                # it has since been deleted or unassigned from the instance.
                self._logger.debug("Application %s is skipped for instance %s (clientName %s) "
                                   "because it is not reported by DS.",
                                   application_name, instance_id, instance.get_value("clientName", ""))
                continue
            server_checksum = cache.get_server_application_checksum(application_name)
            bundle_status = compute_bundle_status(application_name, client_application, server_checksum)
            bundles.update(bundle_status)

        for application_name in cache.get_out_of_date_applications_for_instance(instance.instanceid):
            if application_name not in client_applications:
                # The Application is newly configured to be deployed to the client, however, there has been
                # no client message since then.
                bundle_status = compute_bundle_status(application_name, None, None)
                bundles.update(bundle_status)
                self._logger.debug("Application %s is added for instance %s (clientName %s) "
                                   "because it is not reported by DS.",
                                   application_name, instance_id, instance.get_value("clientName", ""))
                continue
        return bundles

    def get_instances_platform_counts(self):
        """Get platform counts for all DS clients
        """
        counts = {}
        for instance in self._deploy_service.get_cache().get_instances():
            platform = instance.get("splunkPlatform", None)
            if platform:
                counts[platform] = counts.get(platform, 0) + 1
        return counts

    # pylint: disable=too-many-arguments
    def get_instances_preview(self, filters, complement, selection_as_attribute,
                              count, offset, sort_key, reverse):
        """Get instances preview filtered by white/blacklists and platforms
        """
        # Get raw instances. We cannot use cached instances here because the result should include lastPhoneHomeTime
        instances = self._repository.get_all(
            query={"topology": group_topology_role_name[builtin_name.forwarders]},
            fields=("instanceId", "clientName", "instanceName", "hostname",
                    "dns", "ip", "splunkPlatform", "lastPhoneHomeTime"),
            raw=True
        )

        instances = self._filter_instances_preview(instances, filters, complement, selection_as_attribute)

        # self.get_all() cannot apply sort to all instances due to limitations of the kv store therefore we have to
        # order instances "manually"
        if sort_key:
            if sort_key == "utsname":  # "utsname" is the splunk analogue of DMC splunkPlatform
                sort_key = "splunkPlatform"
            instances = sorted(instances, key=lambda instance: instance.get(sort_key, ""), reverse=reverse)

        # return paginated result
        total = len(instances)
        end = total if count == 0 else offset + count
        page = instances[offset:end]
        for instance in page:
            # copy splunkPlatform to utsname to make the reply compatible with splunkd API
            instance["utsname"] = instance.get("splunkPlatform", "")
        return page, total
    # pylint: enable=too-many-arguments

    def _filter_instances_preview(self, instances, filters, complement, selection_as_attribute):
        """Filter instances list by whitelist, blacklist and platforms. The implementation is based on
        DSClientsAdminHandler::filter
        """
        sc_filtering = ServerclassFilteringGroup(Group(filters))

        filtered_instances = []

        for instance in instances:
            # decide whether to keep instance in the list
            keep = sc_filtering.match_json(instance)

            if complement:
                keep = not keep

            if selection_as_attribute:
                # set selected flag and keep the instance
                instance["selected"] = keep
                filtered_instances.append(instance)
            elif keep:
                # just keep the instance as is
                filtered_instances.append(instance)

        return filtered_instances
