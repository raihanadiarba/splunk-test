"""
Splunk Deployment Server deploy command service
"""
import collections
import json
import logging
import time

from agent import ioc, wtransaction, NotFoundException
from agent.common.helpers import ABSENT
from agent.models import ServerclassFilteringGroup, Group
from agent.models.bundle import compute_bundle_name, BundleType
from agent.services.deploy_status_helpers import BUNDLE_FIELD_CHECKSUM, compute_application_status
from agent.services.deployment_lock import DeploymentLock
from agent.services.group_helpers import group_topology_role_name, builtin_name, builtin_id
from agent.services.stanzas_service import BinaryGroupBundlePrefix, make_bundle_folder_name

_logger = logging.getLogger(__name__)


FIELDS_NEEDED_FOR_CACHE = set(
    list(ServerclassFilteringGroup.LIST_FIELDS) +
    list(ServerclassFilteringGroup.MACHINE_TYPE_FIELDS) +
    ["instanceId", "topology", "applications"])


DSCache = collections.namedtuple(
    "DSCache",
    [
        "instances",
        "groups",
        "apps",
        "bundles",
        "group_instances_map",
        "server_application_up_to_date_count_map",
        "instance_server_applications_map",
        "flags"
    ])


AppCache = collections.namedtuple(
    "AppCache",
    [
        "app",
        "bundle",
        "server_checksum",
        "app_groups_instances_map"
    ])


GroupCache = collections.namedtuple(
    "GroupCache",
    [
        "group",
        "bundle",
        "filter",
        "server_checksum"
    ])


class Cache(object):  # pylint: disable=useless-object-inheritance
    """
    Cache copy
    """

    def __init__(self, cache):
        self._cache = cache

    def get_instances(self):
        """
        Get all instances
        """
        return self._cache.instances

    def get_group_instances(self, group_name):
        """
        :return: group instance id set
        """
        return self._cache.group_instances_map.get(group_name, set())

    def get_server_application_checksum(self, application_name):
        """
        Get checksum of a bundle at server
        """
        return self._cache.bundles.get(application_name)

    def has_server_application_for_instance(self, instance_id, application_name):
        """
        Return whether or not the application is assigned to the instance
        """
        applications_entry = self._cache.instance_server_applications_map.get(instance_id)
        if not applications_entry:
            return False

        return application_name in applications_entry

    def get_out_of_date_applications_for_instance(self, instance_id):
        """
        Return whether or not the application is assgined to the instance
        """
        applications_entry = self._cache.instance_server_applications_map.get(instance_id)
        if not applications_entry:
            return {}

        return [application for application, up_to_date in applications_entry.items() if up_to_date is False]

    def is_instance_up_to_date(self, instance_id):
        """
        Return application up to date status
        """
        applications_entry = self._cache.instance_server_applications_map.get(instance_id)
        if not applications_entry:
            return True

        if any(1 for up_to_date in applications_entry.values() if up_to_date is False):
            return False

        if any(1 for up_to_date in applications_entry.values() if up_to_date is None):
            return None

        return True

    def get_instance_application_up_to_date(self, instance_id, application_name):
        """
        Return application up to date status, True, False or None (i.e. Unknown) for the instance
        If application is not found, return ABSENT
        """
        applications_entry = self._cache.instance_server_applications_map.get(instance_id)
        if not applications_entry:
            return ABSENT

        return applications_entry.get(application_name, ABSENT)


# pylint: disable=too-many-instance-attributes
class DeployService(ioc.Component):
    """Handler of Splunk Deployment Server deploy command.
    """

    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)
        self._tasks_service = ioc.services.tasks_service()
        self._changelog_service = ioc.services.changelog_service()
        splunk_host = ioc.components.splunk_host()
        self._splunk_service = splunk_host.get_service(owner="nobody")
        self.transaction_manager = ioc.components.transaction_manager()
        self._instances_service = ioc.services.instances_service()
        self._groups_repository = ioc.repositories.groups_repository()
        self._instances_repository = ioc.repositories.instances_repository()
        self._apps_repository = ioc.repositories.apps_repository()
        self._deleted_instances = set()
        self._cache = None
        self._invalidated_cache = None
        self._lock = DeploymentLock(self)
        self._last_deploy_task_id = None

    def get_cache(self):
        """
        Get copy of the cache
        """
        return Cache(self._get_cache())

    def deploy(self):
        """Start deployment of the configuration,
        """
        assert not self.is_deploy_in_progress()

        deploy_task = self._tasks_service.new_task("deploy_workflow")
        self._last_deploy_task_id = deploy_task.taskid
        return deploy_task

    def get_last_deploy(self):
        """Get info about the last deploy task
        """
        task_id = None
        # deployment task is stored in changelog service with significant delay, try local storage first
        if self._last_deploy_task_id:
            task_id = self._last_deploy_task_id
        else:
            deploy = self._changelog_service.get_last_deploy_record()
            if deploy:
                task_id = deploy.get_value("key")["taskId"]

        return {"taskId": task_id}

    @wtransaction
    def invalidate_cache(self, instances_changed=True, groups_changed=True, apps_changed=True, ds_apps_changed=True):
        """
        Load server applications from DS
        """
        self._logger.debug(
            "Cache invalidated, instances=%s, groups=%s, apps=%s, ds_apps=%s",
            instances_changed, groups_changed, apps_changed, ds_apps_changed)
        self._invalidated_cache = self._cache
        if self._invalidated_cache:
            flags = self._invalidated_cache.flags
            flags["instances_changed"] = flags.get("instances_changed", False) or instances_changed
            flags["groups_changed"] = flags.get("groups_changed", False) or groups_changed
            flags["apps_changed"] = flags.get("apps_changed", False) or apps_changed
            flags["ds_apps_changed"] = flags.get("ds_apps_changed", False) or ds_apps_changed
        self._cache = None

    def record_instance_deletion(self, instance_id):
        """
        Record an instance deletion
        """
        self._deleted_instances.add(instance_id)

    def clear_instance_deletion_records(self):
        """
        Clear all instance deletion records
        """
        self._deleted_instances.clear()

    def is_instance_deleted(self, instance_id):
        """
        Return whether or not the instance has been deleted since the last time deletion records are
        cleared
        """
        return instance_id in self._deleted_instances

    def is_deploy_in_progress(self):
        """Checks whether there is a deployment workflow in new/running states
        """
        tasks = self._tasks_service.get_all({
            "$and": [
                {"$or": [{"state": "new"}, {"state": "running"}]},
                {"workflow": "deploy_workflow"},
            ]
        }, fields=["taskId"])
        return len(tasks) > 0

    def last_deploy_state(self):
        """Return the status of the last deploy task, None if one does not exist
        """
        try:
            task_id = self.get_last_deploy()["taskId"]
            if not task_id:
                return None
            task = self._tasks_service.get(task_id)
            return task.state
        except NotFoundException:
            return None

    @property
    def lock(self):
        """
        :return: DeploymentLock object
        """
        return self._lock

    @wtransaction
    def _get_cache(self):
        """
        Get cache, if empty - create new one
        """
        if not self._cache:
            self._logger.debug("Do not have cache, starting calculation.")
            before_cache_create = time.time()
            self._cache = self._create_cache()
            self._logger.debug("Took %s seconds to calculate the cache", time.time() - before_cache_create)
            self._invalidated_cache = None
        return self._cache

    def _calculate_groups_membership(self, groups, instances):
        """
        Calculate instances in groups map
        """
        group_instances_map = {}
        for group_name, group in groups.items():
            if group_name == builtin_name.forwarders:  # pylint: disable=comparison-with-callable
                group_instances_map[group_name] = {instance["instanceId"] for instance in instances}
            else:
                gfilter = group.filter
                if gfilter.has_filters():
                    group_instances_map[group_name] = {instance["instanceId"]
                                                       for instance
                                                       in instances
                                                       if gfilter.match_json(instance)}
                else:
                    group_instances_map[group_name] = set()
        return group_instances_map

    # pylint: disable=too-many-branches
    # pylint: disable=too-many-locals
    # ForPerformance: this code looks like that because of the performance optimization
    # If you will change it - compare the performance
    def _calculate_instances_apps_up_to_date(self, cache):
        """
        Calculate instances up to date statuses
        """
        instance_server_applications_map = cache.instance_server_applications_map
        server_application_up_to_date_count_map = cache.server_application_up_to_date_count_map
        apps = cache.apps
        group_instances_map = cache.group_instances_map
        groups = cache.groups
        instances = cache.instances
        bundles = cache.bundles
        iterate_all_instance_bundles = self._iterate_all_instance_bundles
        for instance in instances:
            instance_id = instance["instanceId"]

            client_apps = None
            try:
                client_apps = {app["name"]: app["content"] for app in instance["applications"]}
            except KeyError:
                client_apps = {}

            applications_entry = {}

            for bundle, server_checksum in iterate_all_instance_bundles(instance_id,
                                                                        apps,
                                                                        groups,
                                                                        bundles,
                                                                        group_instances_map):
                if server_checksum:
                    try:
                        application_content = client_apps[bundle]
                    except KeyError:
                        applications_entry[bundle] = False
                    else:
                        app_up_to_date, _, _ = compute_application_status(application_content, server_checksum)
                        if app_up_to_date:
                            server_application_up_to_date_count_map[bundle] += 1
                        applications_entry[bundle] = app_up_to_date
                else:
                    # We don't have client deployment metrics for the server application,
                    # app_up_to_date should be false.
                    applications_entry[bundle] = False

            instance_server_applications_map[instance_id] = applications_entry

    def _iterate_all_instance_bundles(self, instance_id, apps, groups, bundles, group_instances_map):
        """
        For giving instance id iterate through all possible bundles
        """
        for app in apps:
            if instance_id in app.app_groups_instances_map:
                yield (app.bundle, app.server_checksum)

        for group_name, group_instances in group_instances_map.items():
            if instance_id in group_instances:
                if groups[group_name].server_checksum:
                    yield (groups[group_name].bundle, groups[group_name].server_checksum)

        node_bundle_name = BinaryGroupBundlePrefix.node + instance_id
        if node_bundle_name in bundles:
            yield (node_bundle_name, bundles.get(node_bundle_name))

    def _create_cache(self):
        """
        Create new cache (with possible copy of old bundles, instances apps or groups)
        """
        bundles = self._get_bundles()
        instances = self._get_instances()
        groups = self._get_groups(bundles)
        # Only if instances or groups has changed we should recalculate memberships
        group_instances_map = None
        if (not self._invalidated_cache or
                self._invalidated_cache.flags.get("instances_changed", True) or
                self._invalidated_cache.flags.get("groups_changed", True)):
            group_instances_map = self._calculate_groups_membership(groups, instances)
        else:
            group_instances_map = self._invalidated_cache.group_instances_map
        apps = self._get_apps(bundles, group_instances_map)
        cache = DSCache(
            instances=instances,
            apps=apps,
            groups=groups,
            bundles=bundles,
            group_instances_map=group_instances_map,
            server_application_up_to_date_count_map={bundle: 0 for bundle in bundles.keys()},
            instance_server_applications_map={},
            flags={})
        self._calculate_instances_apps_up_to_date(cache)
        if self._logger.isEnabledFor(logging.DEBUG):
            self._logger.debug(
                "Cache: instances = %s", cache.instances)
            self._logger.debug(
                "Cache: apps = %s", cache.apps)
            self._logger.debug(
                "Cache: groups = %s", cache.groups)
            self._logger.debug(
                "Cache: bundles = %s", cache.bundles)
            self._logger.debug(
                "Cache: group_instances_map = %s", cache.group_instances_map)
            self._logger.debug(
                "Cache: server_application_up_to_date_count_map = %s", cache.server_application_up_to_date_count_map)
            self._logger.debug(
                "Cache: instance_server_applications_map = %s", cache.instance_server_applications_map)
        return cache

    def _get_bundles(self):
        """
        Load applications from DS
        """
        if not self._invalidated_cache or self._invalidated_cache.flags.get("ds_apps_changed", True):
            response = self._splunk_service.get(
                path_segment="/services/deployment/server/applications", output_mode="json", count=0)
            bundles = {
                entry["name"]: entry["content"][BUNDLE_FIELD_CHECKSUM]
                for entry
                in json.load(response.body)["entry"]
            }
        else:
            bundles = self._invalidated_cache.bundles
        return bundles

    def _get_instances(self):
        """
        Load instances from DMC
        """
        if not self._invalidated_cache or self._invalidated_cache.flags.get("instances_changed", True):
            instances = self._instances_repository.get_all(
                raw=True,
                query={"topology": group_topology_role_name[builtin_name.forwarders]},
                fields=FIELDS_NEEDED_FOR_CACHE)
        else:
            instances = self._invalidated_cache.instances
        return instances

    def _get_apps(self, bundles, group_instances_map):
        """
        Loads applications from DMC
        """
        # If instances or groups or ds apps have been changed - we will need to reload
        # apps, as we not only reload them, but also pre-calculate membership and bundle match
        if (not self._invalidated_cache or
                self._invalidated_cache.flags.get("instances_changed", True) or
                self._invalidated_cache.flags.get("apps_changed", True) or
                self._invalidated_cache.flags.get("groups_changed", True) or
                self._invalidated_cache.flags.get("ds_apps_changed", True)):
            raw_apps = self._apps_repository.get_all(raw=True)
            apps = []
            for app in raw_apps:
                if not app.get("groups"):
                    continue
                app_name = app["name"]
                bundle = make_bundle_folder_name(compute_bundle_name(BundleType.app, app_name))
                list_of_groups = [group_instances_map[group]
                                  for group in app["groups"]
                                  if group in group_instances_map]
                app_groups_instances_map = set.union(*list_of_groups) if list_of_groups else set()
                apps.append(AppCache(app, bundle, bundles.get(bundle), app_groups_instances_map))
        else:
            apps = self._invalidated_cache.apps
        return apps

    def _get_groups(self, bundles):
        """
        Load groups from DMC
        """
        # If groups or ds apps have been changed - we will need to reload
        # apps, as we not only reload them, but also pre-calculate membership and bundle match
        if (not self._invalidated_cache or
                self._invalidated_cache.flags.get("instances_changed", True) or
                self._invalidated_cache.flags.get("groups_changed", True) or
                self._invalidated_cache.flags.get("ds_apps_changed", True)):
            raw_groups = self._groups_repository.get_all(raw=True)
            groups = {}
            for group in raw_groups:
                bundle = make_bundle_folder_name(compute_bundle_name(BundleType.custom, group["name"]))
                groups[group["name"]] = GroupCache(
                    group,
                    bundle,
                    ServerclassFilteringGroup(Group(group)),
                    bundles.get(bundle)
                )

            # TODO: now only forwarders built in group
            forwarders_bundle = make_bundle_folder_name(compute_bundle_name(BundleType.builtin, builtin_id.forwarders))
            groups[builtin_name.forwarders] = GroupCache(
                {},
                forwarders_bundle,
                None,
                bundles.get(forwarders_bundle)
            )
        else:
            groups = self._invalidated_cache.groups
        return groups
