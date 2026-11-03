# pylint: disable=missing-docstring
# pylint: disable=invalid-name
# pylint: disable=no-init
# pylint: disable=no-self-use
# pylint: disable=attribute-defined-outside-init
# pylint: disable=too-many-public-methods
# pylint: disable=too-many-arguments
# pylint: disable=too-many-lines
# pylint: disable=comparison-with-callable, useless-object-inheritance

from contextlib import contextmanager
from collections import OrderedDict

import logging
import tarfile
import os
import re
import shutil
import tempfile
import six

from splunk.clilib import cli_common

from agent import ioc, InvalidUserInputException
from agent.models.app import AppProperty
from agent.models.bundle import BundleType, compute_bundle_name
from agent.models.change import EventType
from agent.services import group_helpers
from agent.common.helpers import Enum, mkdir_p, serialize_stanza_ordered, is_dir_nonempty, to_bool, make_temp, \
    remove_file_or_dir, merge_tree
from agent.services.group_helpers import builtin_id
from agent.common.access_control import Capability
from agent.services.topologies_service import SEARCH_HEAD_FIELD


_logger = logging.getLogger(__name__)


ALL_BUNDLES_WILDCARD = "-"


def is_group(bundle):
    return bundle[0] == '_'


def get_group_name(bundle):
    assert is_group(bundle)
    return bundle[1:]


def is_valid_group(bundle):
    group = bundle[1:]
    return group_helpers.is_valid(group)


class DSTopologyFieldByBuiltinId(group_helpers.builtin_id):

    indexers = None
    search_heads = SEARCH_HEAD_FIELD
    forwarders = None
    all = None


def compute_bundle_type_and_id(bundle):
    """
    Returns:
        a. The type of the bundle, i.e. node, group, app etc.
        b. The id of the bundle of a particular type. Examples are clientName, instanceId, serverClass name
           and app name.
    Examples:

        bundle: __search_heads
        Return: builtin, search_heads

        bundle: ___dc1-client-1
        Return: node, dc1-client-1

        bundle: _my-server-class
        Return: custom, my-server-class

        bundle: myApp
        Return: app, myApp
    """
    if is_group(bundle):
        group_name = get_group_name(bundle)
        if group_helpers.is_internal(group_name):
            if group_helpers.is_single_node(group_name):
                bundle_type = BundleType.node
                bundle_id = group_helpers.get_instance_id(group_name)
            else:
                bundle_type = BundleType.builtin
                bundle_id = group_helpers.builtin_name(group_name)
        else:
            bundle_type = BundleType.custom
            bundle_id = group_name
    else:
        bundle_type = BundleType.app
        bundle_id = bundle

    return bundle_type, bundle_id


def get_node_bundle_id(key):
    """
    Get node bundle id which is instance id
    """
    ret = None

    if key["bundleType"] == BundleType.node:
        ret = key["bundleId"]

    return ret


def get_bundle_access_control_capability(method, bundle, capability_format):
    """Get bundle RBAC capability that corresponds to a method (get/edit), capability format is a "*%s*%s*" format
    string that becomes translated to actual capability instance.
    """
    bundle_type, bundle_id = compute_bundle_type_and_id(bundle)
    if bundle_type == BundleType.node:
        tag = "node"
    elif bundle_type == BundleType.app:
        tag = "apps"
    elif bundle_type == BundleType.custom:
        tag = "serverclasses"
    elif bundle_type == BundleType.builtin:
        tag = bundle_id
    else:
        raise NotImplementedError("Not supported %s" % bundle)
    return Capability.parse(capability_format % (method, tag))


def _is_stanza_pending(stanza_map, bundle, stanza_type, name):
    if bundle not in stanza_map:
        return False

    if stanza_type not in stanza_map[bundle]:
        return False

    return name in stanza_map[bundle][stanza_type]


def _get_app_version(type_accessor, app_name):
    app_version = _get_effective_setting_from_stanza(type_accessor, "id", "version")
    if app_version is None:
        app_version = _get_effective_setting_from_stanza(type_accessor, "launcher", "version")
    # In case when app version is an empty string, return default app version
    if app_version is not None and not app_version.strip():
        from agent.services.apps_service import DEFAULT_APP_VERSION  # pylint: disable=import-outside-toplevel
        _logger.info("App %s has an empty version specified, assuming  default version=%s",
                     app_name, DEFAULT_APP_VERSION)
        app_version = DEFAULT_APP_VERSION
    return app_version


def _get_check_for_updates(type_accessor):
    check_for_updates_str = _get_effective_setting_from_stanza(type_accessor, "package", "check_for_updates")
    if check_for_updates_str is None:
        check_for_updates = True  # global default of 'check_for_updates' is true
    else:
        check_for_updates = to_bool(check_for_updates_str)
    return check_for_updates


def _get_effective_setting_from_stanza(type_accessor, stanza_name, setting_name):
    stanza = type_accessor.read_stanza(stanza_name)
    if stanza is None:
        return None
    ext, default, local = stanza
    assert ext is None
    return _get_effective_setting(default, local, setting_name)


def _get_effective_setting(default, local, setting_name):
    """
    Return effective (i.e. local overwrite default) setting value
    """
    if local and setting_name in local:
        return local[setting_name]

    if default and setting_name in default:
        return default[setting_name]

    return None


@six.add_metaclass(Enum)
class BinaryGroupBundlePrefix(object):  # pylint: disable=useless-object-inheritance

    node = "_00010_"
    custom = "_00100_"
    topo = "_01000_"
    all = "_10000_"


class _builtin_group_bundle_folder_name(group_helpers.builtin_name):
    @staticmethod
    def _get_for_search_heads():
        return BinaryGroupBundlePrefix.topo + builtin_id.search_heads

    @staticmethod
    def _get_for_indexers():
        return BinaryGroupBundlePrefix.topo + builtin_id.indexers

    @staticmethod
    def _get_for_forwarders():
        return BinaryGroupBundlePrefix.topo + builtin_id.forwarders

    @staticmethod
    def _get_for_all():
        return BinaryGroupBundlePrefix.all + builtin_id.all

    indexers = _get_for_indexers
    search_heads = _get_for_search_heads
    forwarders = _get_for_forwarders
    all = _get_for_all


def make_bundle_folder_name(bundle):
    """Return bundle folder name
    """
    if not is_group(bundle):
        return bundle

    # internal group name is group name with leading '_' removed.
    group_name = bundle[1:]

    ret = None

    if group_name in group_helpers.builtin_name:
        ret = _builtin_group_bundle_folder_name[group_name]()
    elif group_helpers.is_single_node(group_name):
        instance_id = group_helpers.get_instance_id(group_name)
        ret = BinaryGroupBundlePrefix.node + instance_id
    else:
        ret = BinaryGroupBundlePrefix.custom + group_helpers.encode_to_folder_name(group_name)

    return ret


class _builtin_group_bundle_target_locator(group_helpers.builtin_name):
    @staticmethod
    def _get_target_path_indexers(splunk_home):
        return splunk_home.master_apps()

    @staticmethod
    def _get_target_path_search_heads(splunk_home):
        return splunk_home.shdeployer_apps()

    @staticmethod
    def _get_target_path_forwarders(splunk_home):
        return splunk_home.deployment_apps()

    @staticmethod
    def _get_target_path_all(splunk_home):
        return splunk_home.deployment_apps()

    indexers = _get_target_path_indexers
    search_heads = _get_target_path_search_heads
    forwarders = _get_target_path_forwarders
    all = _get_target_path_all


class _bundle_prefix_type_map(BinaryGroupBundlePrefix):
    node = BundleType.node
    custom = BundleType.custom
    all = BundleType.builtin
    # TODO Support topo roles. Map everything to "all" for now
    topo = BundleType.builtin


def _add_if_not_none(stanza_value, key, value):
    """
    Add 'key', 'value' to 'stanza_value' if 'value' is not None, and return it.

    This function is used to record 'before' and 'after' values in change log properly.
    A None 'value' will not be added to 'stanza_value'. For example, a None 'default' indicates that default
    stanza does not exist, thus it will not be in 'before' or 'after' values. Moreover, a None 'default'
    would not make 'stanza_value' changes from None to not None. This is important since None is equivalent to
    non existence which is used to derive 'op_type' (i.e. 'insert', 'update', or 'delete').
    """
    if value is None:
        return stanza_value

    if stanza_value is None:
        stanza_value = {}

    stanza_value[key] = value
    return stanza_value


def get_bundle_type_and_id(bundle_folder_name):
    # Get bundle properties (a tuple of type and id) by its folder name. For example:
    # demo_app -> (BundleType.app, "demo_app")
    # _00010_<guid> -> (BundleType.node, "<guid>")
    # _01000_forwarders -> (BundleType.builtin, "forwarders")

    # by default we assume that bundle is an app
    bundle_type = BundleType.app
    bundle_id = bundle_folder_name

    # detect bundle type by its prefix
    for prefix in BinaryGroupBundlePrefix:
        if bundle_folder_name.startswith(prefix):
            bundle_type = _bundle_prefix_type_map[prefix]
            bundle_id = bundle_folder_name.split(prefix)[1]
            if bundle_type == BundleType.builtin:
                bundle_id = group_helpers.builtin_id(bundle_id)
            elif bundle_type == BundleType.custom:
                bundle_id = group_helpers.decode_from_folder_name(bundle_id)
            break
    return (bundle_type, bundle_id)


def _capture(ext, default, local):
    ret = None
    ret = _add_if_not_none(ret, "fileExt", ext)
    ret = _add_if_not_none(ret, "local", serialize_stanza_ordered(local))
    ret = _add_if_not_none(ret, "default", serialize_stanza_ordered(default))
    return ret


class BundleExtractor(object):
    """
    Helper class that is used to extract bundles atomically
    """

    def __init__(self, stanzas_service):
        super(BundleExtractor, self).__init__()
        self._stanzas_service = stanzas_service

    @contextmanager
    def create(self, bundle_path):
        """
        Context manager that helps apply changes made in the pre-deployment bundle
        """
        splunk_home = ioc.components.splunk_home()
        temp_root = splunk_home.predeployment_apps_temp()
        with make_temp(temp_root=temp_root) as temp_folder_path:
            temp_bundle_path = os.path.join(temp_folder_path, os.path.basename(bundle_path))

            yield temp_bundle_path

            if os.path.exists(bundle_path):
                merge_tree(temp_bundle_path, bundle_path)
            else:
                shutil.copytree(temp_bundle_path, bundle_path)

            if os.path.dirname(bundle_path) in [splunk_home.master_apps(), splunk_home.shdeployer_apps()]:
                # Merge settings in 'local' dir of an pre-deployment bundle
                # to the bundle deployed through master-apps or shdeployer to
                # set enable/disable status.
                self._stanzas_service.merge_local_settings(bundle_path)


class StanzasService(ioc.Component):
    """Service to work with stanzas
    """
    class TypeWriter(object):
        def __init__(self, service, accessor, bundle, stanza_type, log_change):
            self._changelog_service = ioc.services.changelog_service() if log_change else None
            self._user_context = ioc.components.user_context()
            self._accessor = accessor
            self._service = service
            self._bundle = bundle
            self._stanza_type = stanza_type

        def set(self, name, ext, local):
            if self._changelog_service:
                self._record_change(ext, local, name)
            self._accessor.set(name, ext, local)

        def read_stanza(self, name):
            return self._accessor.read_stanza(name)

        def get_stanza_default(self, stanza):
            return self._accessor.get_stanza_default(stanza)

        def _get_changelog_key(self, name):
            """
            Compose change log key for a stanza change. The key consists of:
            1. bundle info
                a. The type of the bundle, i.e. node, group, app etc.
                b. The id of the bundle of a particular type. Examples are clientName, instanceId, serverclass name
                   and app name.
            2. type name
            3. stanza name
            """
            bundle_type, bundle_id = compute_bundle_type_and_id(self._bundle)

            return {
                "bundleType": bundle_type,
                "bundleId": bundle_id,
                "type": self._stanza_type,
                "name": name
            }

        def _record_change(self, after_ext, after_local, name):
            key = self._get_changelog_key(name)

            default = None
            before_local = None
            before_ext = None
            before_stanza = self._accessor.read_stanza(name)
            if before_stanza:
                (before_ext, default, before_local) = before_stanza

            before = _capture(before_ext, default, before_local)
            after = _capture(after_ext, default, after_local)

            if before != after:
                user = self._user_context.user
                self._changelog_service.record(EventType.stanza, user, key, before, after)

    def __init__(self):
        self._repository = ioc.repositories.stanzas_repository()
        self._logger = logging.getLogger(self.__class__.__name__)
        self._internal_types = None
        self._splunk_home = ioc.components.splunk_home()
        self._instances_service = ioc.services.instances_service()
        self._apps_service = ioc.services.apps_service()
        self._apps_repository = ioc.repositories.apps_repository()
        self._slim_service = ioc.services.slim_service()
        self._pending_changelog_repository = ioc.repositories.pending_changelog_repository()
        self._bundle_extractor = BundleExtractor(self)

    def read_type(self, bundles, bundle_type, offset, count, reverse, sort_key, req_query):
        """Get stanzas
        """
        assert sort_key is None or sort_key == "name"
        if bundles is None:
            # query all bundles
            bundles = [
                compute_bundle_name(_type, _id)
                for _type, _id, _, _ in self.list_predeployment_bundles()
            ]

        return self._truncate_bundles_list(
            bundles,
            bundle_type,
            offset,
            count,
            reverse,
            req_query
        )

    def read_instance(self, instance, bundle_type, offset, count, reverse, sort_key, req_query):
        """Get stanzas related to an instance
        """
        assert sort_key is None or sort_key == "name"
        # bundles related to the instance
        bundles = self._instances_service.get(instance, related_bundles=True)\
            .get_value("@relatedBundles")\
            .keys()
        return self._truncate_bundles_list(
            bundles,
            bundle_type,
            offset,
            count,
            reverse,
            req_query
        )

    def read_stanza(self, bundle, bundle_type, name):
        """Get stanzas
        """
        type_accessor = self._get_repository_type_accessor(bundle, bundle_type)
        return type_accessor.read_stanza(name)

    def get_stanza_file_location(self, bundle, bundle_type, name, is_default):
        typeAccessor = self._get_repository_type_accessor(bundle, bundle_type)
        return typeAccessor.get_file_stanza_location(name, is_default)

    def parse_stanza_text(self, iostream):
        """
        Parse stanza text
        """
        lines = cli_common.bom_aware_readlines(iostream)
        return cli_common.readConfLines(lines, ordered=True)

    def parse_stanza_dict_to_text(self, stanza_dict):
        return cli_common.writeConfString(stanza_dict, ordered=False)

    @contextmanager
    def create_type_writer(self, bundle, stanza_type, log_change=True):
        accessor = self._get_repository_type_accessor(bundle, stanza_type)
        accessor.ensure_loaded()
        yield StanzasService.TypeWriter(self, accessor, bundle, stanza_type, log_change)
        # No flush will be done if there's an exception on yield above
        accessor.flush()

    def delete_bundle(self, bundle):
        self._repository.delete_bundle(self._bundle_root(bundle))

    def existing_types(self, bundle):
        """Return type name and stanza count pairs
        """

        bundle_dir = self._bundle_root(bundle)
        return self._repository.existing_types(bundle_dir)

    def list_internal_types(self):
        if self._internal_types is None:
            self._internal_types = self._repository.list_internal_types(self._splunk_home.system())
        return self._internal_types

    def list_predeployment_bundles(self):
        """Return list of DMC predeployment bundles. This method returns tuples
           (bundle_type, bundle_id, bundle)
        """
        bundles = []
        bundles_folder = self._splunk_home.predeployment_apps()
        for bundle in os.listdir(bundles_folder) if os.path.isdir(bundles_folder) else []:
            bundle_type, bundle_id = get_bundle_type_and_id(bundle)
            bundles.append((bundle_type, bundle_id, bundle, None))

        return bundles

    def list_deployment_bundles(self):
        """Return list of tuples (bundle_type, bundle_id, bundle, location) associated all bundles
        """
        bundles_folder = self._splunk_home.deployment_apps()
        bundles = []

        # slim bundles are located inside deployment-apps/_apps/<serverclass id>/<app bundle>
        for subfolder in os.listdir(bundles_folder):

            # Skip it if it is a file and not a dir.
            # This will avoid a spurious warning message about "README" file in
            # deployment-apps folder.
            if os.path.isfile(os.path.join(bundles_folder, subfolder)):
                continue

            for bundle in os.listdir(os.path.join(bundles_folder, subfolder)):
                bundle_type, bundle_id = get_bundle_type_and_id(bundle)

                # This can happen with a builtin group bundle that have an invalid name, such as
                # '_01000_sh' rather than the correct '_01000_search_heads'
                if not bundle_id:
                    continue

                bundles.append((bundle_type, bundle_id, bundle, subfolder))

        return bundles

    def sync_deployment_bundles(self, changed_bundles, topology):
        """Sync predeployment bundles to deployment-apps
        :param changed_bundles: dict of changed bundles - OpType -> set of (BundleType, BundleName)
        """
        # TODO The implementation is simple but it isn't ideal and theoretically has
        # race condition problem. A deployment client may try to read DS
        # configuration during syncing and this operation will fail. We have
        # plans to change the location of DMC DS configuration and for now
        # decided to leave this implementation "as is".

        # init bundles list and make sure that all folders exist
        mkdir_p(self._splunk_home.predeployment_apps())
        bundles = os.listdir(self._splunk_home.predeployment_apps())
        for location in [self._splunk_home.predeployment_apps(),
                         self._splunk_home.deployment_apps(),
                         self._splunk_home.master_apps(),
                         self._splunk_home.shdeployer_apps()]:
            mkdir_p(location)

        # all changed bundles  regardless their "op type"
        all_changed_bundles = set.union(*changed_bundles.values()) if changed_bundles else set()

        self._clear_deployment_bundles(bundles, changed_bundles, all_changed_bundles)

        for bundle in bundles:
            predeployment_bundle_path = os.path.join(self._splunk_home.predeployment_apps(), bundle)

            bundle_type, bundle_id = get_bundle_type_and_id(bundle)
            if (bundle_type, bundle_id) not in all_changed_bundles and \
               os.path.isdir(predeployment_bundle_path):
                # This bundle did not change since the last deployment, and it is not deleted either,
                # no action needed
                # A custom group deletion will not show up in changed_bundles, although the bundle is deleted from
                # the predeployment folder.
                continue

            if not is_dir_nonempty(predeployment_bundle_path):
                self._logger.debug("Skipping empty predeployment bundle: %s", bundle)
                continue

            if bundle_type is BundleType.app:
                self._logger.debug("Partitioning predeployment bundle: %s", bundle)
                self._sync_app_bundle(bundle, predeployment_bundle_path, topology)
            else:
                self._logger.debug("Copying predeployment bundle: %s", bundle)

                if bundle_type == BundleType.custom:
                    server_class = bundle_id
                elif bundle_type == BundleType.builtin:
                    server_class = group_helpers.builtin_name[bundle_id]
                elif bundle_type == BundleType.node:
                    server_class = group_helpers.make_node_group_name(bundle_id)

                if server_class is None:
                    # This can happen with a builtin group bundle that have an invalid name, such as
                    # '_01000_sh' rather than the correct '_01000_search_heads'
                    self._logger.warning("Skipping invalid predeployment bundle: %s", bundle)
                    continue

                deployment_bundle_path = self._get_server_class_bundle_target_path(
                    bundle, server_class, topology)

                # Allow copying/deployment of new changes in case of updated bundle
                if not ((bundle_type, bundle_id) in changed_bundles.get("update", []) or
                        (bundle_type, bundle_id) in changed_bundles.get("upgrade", [])) and \
                        os.path.isdir(deployment_bundle_path):
                    # this bundle hasn't been installed by DMC
                    self._logger.warning("Bundle creation operation: bundle %s not installed by DMC. "
                                         "Skipping non DMC bundle.", bundle)
                    continue

                with self._bundle_extractor.create(deployment_bundle_path) as tracker_bundle_path:
                    shutil.copytree(src=predeployment_bundle_path, dst=tracker_bundle_path)

        # Mark the current installation graph as committed
        self._slim_service.commit_installation()

        # Commit the current repository by clearing the staged add/remove packages
        staged_packages = [
            app.get_value(AppProperty.PACKAGE)
            for app in self._apps_service.read_all(query={AppProperty.STAGED: True})
        ]
        self._slim_service.commit_repository(skip=staged_packages)

    def _sync_app_bundle(self, bundle, predeployment_bundle_path, topology):
        """ Sync an app bundle that has changed since that last deployment
        """

        # Partition the new repository app into deployment packages
        with make_temp() as output_dir:

            payload = self._slim_service.partition(predeployment_bundle_path, output_dir)
            status = payload["status"]
            if status != 0:
                self._logger.warning(
                    "Partition failed for predeployment bundle %s with status: %d. Skipping.", bundle, status)
                return  # SLIM-TODO: error handling with partition fails

            installation_actions = payload.get("installation_actions")
            if installation_actions is None:
                self._logger.warning(
                    "Partition failed for redeployment bundle %s: 'installation_actions' is missing.", bundle)
                return  # SLIM-TODO: error handling with partition fails

            for action in installation_actions:
                deployment_package = action["add"]
                deployment_package_type = action["serverClass"]

                # This can happen when we have action["remove"]
                if deployment_package is None:
                    self._logger.warning(
                        "Skipping processing for %s due to package remove", deployment_package_type)
                    continue

                # Determine if we need to save this forwarder package
                if deployment_package_type == group_helpers.builtin_name.forwarders:
                    self._slim_service.add_package(deployment_package)

                # Determine where this package should go
                deployment_bundle_path = self._get_server_class_bundle_target_path(
                    bundle, deployment_package_type, topology)

                with self._bundle_extractor.create(deployment_bundle_path) as tracker_bundle_path:
                    with tarfile.open(deployment_package) as tar:
                        self._logger.debug("Extracting app bundle: %s", deployment_bundle_path)
                        tar.extractall(os.path.dirname(tracker_bundle_path))

    def _get_server_class_bundle_target_path(self, bundle, server_class, topology):
        """ Get the target path for a bundle given the target server class
        """
        if group_helpers.is_standlone(server_class):
            target_folder = self._splunk_home.deployment_apps()
        else:
            if server_class in group_helpers.builtin_name:
                builtin_group_id = group_helpers.builtin_name(server_class)

                if (topology and DSTopologyFieldByBuiltinId[builtin_group_id] in topology) or \
                        builtin_group_id == group_helpers.builtin_id.forwarders or \
                        builtin_group_id == group_helpers.builtin_id.all:
                    target_folder = os.path.join(
                        self._splunk_home.deployment_apps(),
                        server_class)
                else:
                    target_folder = _builtin_group_bundle_target_locator[server_class](self._splunk_home)
            else:
                target_folder = os.path.join(
                    self._splunk_home.deployment_apps(),
                    server_class)

            mkdir_p(target_folder)

        return os.path.join(target_folder, bundle)

    def _clear_deployment_bundles(self, predeployment_bundles, changed_bundles_dict, all_changed_bundles):
        """Clear that bundles that has been already deployed previously
        """
        for location in [self._splunk_home.deployment_apps(),
                         self._splunk_home.master_apps(),
                         self._splunk_home.shdeployer_apps()]:
            for folder in os.listdir(location):
                if folder.startswith("__dmc_"):
                    # don't delete DMC auxiliary bundles (see initialize_dmc_server_command.py for details)
                    self._logger.debug("Skip DMC aux bundle: %s", folder)
                    continue

                path = os.path.join(location, folder)
                if not os.path.isdir(path):
                    self._logger.debug("Skip non dir path: %s", path)
                    continue

                def delete_inputs_conf(path):
                    """ Check if inputs.conf exist in path and remove it
                    """
                    for local_item in os.listdir(path):
                        if local_item == "inputs.conf":
                            inputs_path = os.path.join(path, local_item)
                            if os.path.isfile(inputs_path):
                                self._logger.warning("Removing %s", inputs_path)
                                os.remove(inputs_path)

                def delete_bundle(bundle_path, bundle):
                    if not os.path.isdir(bundle_path):
                        return

                    bundle_type_and_id = get_bundle_type_and_id(bundle)

                    if bundle_type_and_id in changed_bundles_dict.get("update", []) and \
                        bundle_path == os.path.join(self._splunk_home.deployment_apps(),
                                                    group_helpers.builtin_name.search_heads, bundle):
                        # a search head application is updated by making a REST call to SH apps/local, no need
                        # to replace its bundle
                        self._logger.debug("Skip SH updated app bundle: %s", bundle_path)
                        return

                    # a bundle may become updated as a result of "update" or "upgrade" operation
                    is_updated_bundle = \
                        bundle_type_and_id in changed_bundles_dict.get("update", []) or \
                        bundle_type_and_id in changed_bundles_dict.get("upgrade", [])

                    bundle_type, _ = bundle_type_and_id
                    is_changed_builtin_bundle = \
                        bundle_type_and_id in all_changed_bundles and bundle_type == BundleType.builtin

                    if is_updated_bundle or \
                            is_changed_builtin_bundle or \
                            (bundle_type_and_id in all_changed_bundles and bundle not in predeployment_bundles):
                        self._logger.debug("Delete deployment bundle: %s", bundle_path)

                        if os.path.isfile(bundle_path):
                            self._logger.warning("Removing file %s as it has the same name as a bundle folder.",
                                                 bundle_path)
                            os.remove(bundle_path)
                            return

                        if not is_updated_bundle:
                            shutil.rmtree(bundle_path)
                            return

                        # Remove everything except local folder and local.meta in metadata dir
                        # Remove inputs.conf in case of updated bundle to allow
                        # copying/deployment of new changes
                        for bundle_item in os.listdir(bundle_path):
                            if bundle_item == 'local':
                                delete_inputs_conf(os.path.join(bundle_path, bundle_item))
                                continue
                            if bundle_item == 'metadata':
                                metadata_path = os.path.join(bundle_path, 'metadata')
                                for metadata_item in os.listdir(metadata_path):
                                    if metadata_item == 'local.meta':
                                        continue
                                    remove_file_or_dir(os.path.join(metadata_path, metadata_item))
                                continue
                            remove_file_or_dir(os.path.join(bundle_path, bundle_item))

                if location == self._splunk_home.deployment_apps():
                    # <folder> is a group container and it has bundles as subfolders.
                    for subfolder in os.listdir(path):
                        bundle_path = os.path.join(path, subfolder)
                        delete_bundle(bundle_path, subfolder)
                    if not is_dir_nonempty(path):
                        self._logger.debug("Delete empty %s", path)
                        shutil.rmtree(path)
                else:
                    # <folder> is a bundle
                    delete_bundle(path, folder)

    def install_app_from_path(self, name, path):
        """
        Install the app to pre-deployment
        """
        self._repository.install_from_path(name, path, self._splunk_home.predeployment_apps())

    def create_app_archive(self, app_name, ofile):
        """
        Create app archive
        """
        self._repository.create_bundle_archive(app_name, ofile, self._splunk_home.predeployment_apps())

    def export_app_archive(self, app_name, package_dest):
        """
        Export an app archive to the given destination
        """
        temp_package_file = tempfile.NamedTemporaryFile()
        self.create_app_archive(app_name, temp_package_file)
        temp_package_file.flush()
        shutil.copyfile(temp_package_file.name, package_dest)

    @contextmanager
    def create_temp_app(self, app_name):
        """
        Create new empty application that will be deleted automatically
        """
        try:
            self.create_new_app(app_name)
            yield
        finally:
            self.delete_app(app_name)

    def create_new_app(self, app_name):
        """
        Create new empty application
        """
        self._repository.create_empty(app_name, self._splunk_home.predeployment_apps())

    def delete_app(self, name):
        """
        Delete the app from pre-deployment
        """
        bundle_root = self._get_predeployment_path(name)
        self._repository.delete_bundle(bundle_root)

    def get_app_version(self, name):
        """
        Get the application version
        """
        type_accessor = self._get_repository_type_accessor(name, "app")
        return _get_app_version(type_accessor, name)

    def get_app_label(self, name):
        """
        Get the application label
        """
        type_accessor = self._get_repository_type_accessor(name, "app")
        return _get_effective_setting_from_stanza(type_accessor, "ui", "label")

    def get_app_check_for_updates(self, name):
        """
        Get the application check_for_updates setting
        """
        type_accessor = self._get_repository_type_accessor(name, "app")
        return _get_check_for_updates(type_accessor)

    def get_app_id_from_package(self, package_path):
        """
        Get the app id from the package, which is the root directory name
        """
        # we assume that app id is the name of the first folder
        app_id = None
        with tarfile.open(package_path) as tar:
            for file_info in tar.getmembers():
                file_path = file_info.path.split("/")
                if file_path[0] == ".":
                    # a path can start with "current folder" (.) - skip it
                    file_path = file_path[1:]

                assert len(file_path) > 0  # file or empty folder?

                folder_name = file_path[0]
                if not folder_name.startswith("."):  # check whether the folder isn't some metadata (starts with dot)
                    app_id = folder_name
                    break
        return app_id

    def get_app_property_from_package(self, name, package_path, app_property):
        """
        Get the application property (version, label) from a package
        """
        with make_temp() as temp_package_dir:
            bundle_root = os.path.join(temp_package_dir, name)
            self._repository.install_from_path(name, package_path, temp_package_dir)
            type_accessor = self._repository.get_type_accessor(bundle_root, "app")
            if app_property == AppProperty.VERSION:
                result = _get_app_version(type_accessor, name)
            elif app_property == AppProperty.LABEL:
                result = _get_effective_setting_from_stanza(type_accessor, "ui", "label")
            elif app_property == AppProperty.CHECK_FOR_UPDATES:
                result = _get_check_for_updates(type_accessor)
            else:
                result = None  # Unsupported property
        return result

    def get_app_state(self, name):
        """
        Get the application version
        """
        type_accessor = self._get_repository_type_accessor(name, "app")
        return _get_effective_setting_from_stanza(type_accessor, "install", "state")

    def is_bundle_valid(self, bundle):
        """Check if bundle exists in the system
        """
        is_valid = True
        if is_group(bundle):
            is_valid = is_valid_group(bundle)
        else:
            is_valid = self._apps_service.exists(bundle)
        return is_valid

    def get_bundle_uploads_path(self, bundle, folder):
        return os.path.join(self._splunk_home.predeployment_apps(),
                            make_bundle_folder_name(bundle),
                            folder)

    def _bundle_root(self, bundle):
        """Return bundle root
        """
        bundle_folder_name = make_bundle_folder_name(bundle)
        return os.path.join(self._splunk_home.predeployment_apps(), bundle_folder_name)

    def _truncate_bundles_list(
            self,
            bundles,
            bundle_type,
            offset,
            count,
            reverse,
            req_query):
        """
        From stanzas, return a subset according to offset and count after
        sorting.
        """

        if not bundles:  # there is nothing to list
            return [], 0

        # return sorted and paginated result
        sorted_name_ext_settings_list = sorted(
            self._get_all_stanzas(bundles, bundle_type),
            key=lambda tuple: tuple[0].lower(),
            reverse=reverse)

        if req_query:
            name_filter = None
            try:
                name_filter = re.compile(req_query.get('name'), re.I)
            except:  # noqa: E722
                err_msg = "Name filter '%s' is invalid regular expression." % req_query.get('name')
                raise InvalidUserInputException(fmt=err_msg)
            if name_filter:
                sorted_name_ext_settings_list = [stanza for stanza in sorted_name_ext_settings_list
                                                 if name_filter.search(stanza[0])]

        total = len(sorted_name_ext_settings_list)
        end = total if count == 0 else offset + count
        return sorted_name_ext_settings_list[offset:end], total

    def _get_all_stanzas(self, bundles, stanza_type):
        stanza_map = self.get_pending_stanza_map(bundles)
        name_ext_settings_list = []
        for bundle in bundles:
            stanzas = self._get_repository_type_accessor(bundle, stanza_type).read()
            for (name, ext, default, local) in stanzas:
                pending = _is_stanza_pending(stanza_map, bundle, stanza_type, name)
                name_ext_settings_list.append((name, ext, default, local, bundle, pending))
        return name_ext_settings_list

    def _get_repository_type_accessor(self, bundle, stanza_type):
        return self._repository.get_type_accessor(
            self._bundle_root(bundle), stanza_type)

    def _get_predeployment_path(self, bundle):
        return os.path.join(self._splunk_home.predeployment_apps(), bundle)

    def get_pending_stanza_map(self, bundles):
        """
        Returns a map of stanzas with changes that have not been deployed yet.
        The map has multiple levels:
            Level 1: Dict keyed on bundle name (i.e. __search_heads)
            Level 2: Dict keyed on stanza type (i.e. indexes)
            Level 3: Set keyed on stanza name
        """
        if not bundles:
            # KV store can't handle empty $or query so return early to avoid it.
            return {}

        # Compute bundleType and bundleId from bundle name, and record a map
        # Examples of map entries:
        # ("builtin", "forwarders) : "___forwarders"
        # ("custom", "serverClass1"): "_serveClass1"
        bundle_map = {compute_bundle_type_and_id(bundle): bundle for bundle in bundles}

        def make_and_clause(bundle_type, bundle_id):
            return {"$and": [
                {"key.bundleType": bundle_type},
                {"key.bundleId": bundle_id}]}

        # Construct a query. Below is an example:
        # {'$and': [{'type': 'stanza'}, {'$or': [
        #         {'$and': [{'key.bundleType': 'custom'}, {'key.bundleId': 'mygroup'}]},
        #         {'$and': [{'key.bundleType': 'app'}, {'key.bundleId': 'myapp'}]}]}]}

        or_clause = {"$or": [make_and_clause(bundle_type, bundle_id) for bundle_type, bundle_id in bundle_map]}
        query = {"$and": [{"type": EventType.stanza}, or_clause]}

        fields = ["key"]
        changes = self._pending_changelog_repository.get_all(
            query=query,
            fields=fields
        )
        stanza_map = {}
        for change in changes:
            key = change.get_value("key")

            bundle_id = key["bundleId"]
            bundle_type = key["bundleType"]
            bundle = bundle_map[bundle_type, bundle_id]
            if bundle not in stanza_map:
                stanza_map[bundle] = {}

            stanza_type = key["type"]
            if stanza_type not in stanza_map[bundle]:
                stanza_map[bundle][stanza_type] = set()

            stanza_map[bundle][stanza_type].add(key["name"])

        return stanza_map

    def merge_local_settings(self, bundle_path):
        """
        Merge some pre-deployment local settings into the bundle.
        """
        merge_settings = [
            {"file": "app", "stanza": "install", "setting": "state"}
        ]

        bundle_id = os.path.basename(bundle_path)

        for setting in merge_settings:
            predeployment_settings = self.read_stanza(bundle_id, setting["file"], setting["stanza"])
            if predeployment_settings is not None:
                _, _, local = predeployment_settings
                if local and setting["setting"] in local:
                    value = local[setting["setting"]]
                    self._logger.info("merge value %s into %s.conf [%s] %s",
                                      value, setting["file"], setting["stanza"], setting["setting"])

                    bundle_accessor = self._repository.get_type_accessor(bundle_path, setting["file"])
                    bundle_settings = bundle_accessor.read_stanza(setting["stanza"])

                    local_settings = bundle_settings[2] if bundle_settings and bundle_settings[2] is not None \
                        else OrderedDict({})
                    local_settings[setting["setting"]] = value
                    bundle_accessor.set_local(setting["stanza"], local_settings)
