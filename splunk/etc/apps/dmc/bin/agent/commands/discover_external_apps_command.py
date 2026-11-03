"""
Discover and install external applications
"""

import json
import os
import logging
import shutil
from collections import OrderedDict

from slim.utils import SlimStatus

from agent import ioc, wtransaction
from agent.commands.rest_command_base import get_remote_service_from_topology_info
from agent.commands import CommandBase, CommandResult
from agent.services.topologies_service import SEARCH_HEAD_FIELD, SHC_DEPLOYER_FIELD
from agent.services.apps_service import DEFAULT_APP_VERSION
from agent.common.helpers import splunk_bool
from agent.services.group_helpers import builtin_name
from agent.models.app import AppProperty


_logger = logging.getLogger(__name__)


"""
This contants means that the an external app was discovered
but it's version is same as version of the app discovered
in previous run of external apps discovery.
It is used to incdicate that don't need to trigger any
change in the app info in SSAI (app model or installation graph model)
"""
CURRENT_NEW_VERSIONS_SAME = "CURRENT_NEW_VERSIONS_SAME"


class DiscoverExternalAppsCommand(CommandBase):
    """Command to discover and install external apps
    """

    def __init__(self):
        super(DiscoverExternalAppsCommand, self).__init__()

        self._splunk_home = ioc.components.splunk_home()
        self._splunk_host = ioc.components.splunk_host()
        self._secure_storage = ioc.services.secure_storage()
        self._apps_service = ioc.services.apps_service()
        self._external_apps_service = ioc.services.external_apps_service()
        self._stanzas_service = ioc.services.stanzas_service()
        self._slim_service = ioc.services.slim_service()

    # pylint: disable=too-many-locals
    @wtransaction
    def execute(self, command):
        _logger.info("status=start")
        topology = command.get_value(("payload", "topology"))

        all_dmc_apps = self._apps_service.read_all()

        # All the apps that are in SSAI but that were not discovered externally
        dmc_internal_apps = [app.objid for app in all_dmc_apps if not app.external]

        # All the apps that are in SSAI but that were discovered externally
        dmc_external_apps = [app.objid for app in all_dmc_apps if app.external]

        sh_external_apps = self._sh_external_apps(topology, dmc_internal_apps)
        idx_external_apps = self._indexer_external_apps(dmc_internal_apps)

        # This is set of all the apps that are in SH  or Indexer but not in SSAI
        # internal apps list
        discovered_external_apps = set(sh_external_apps) | set(idx_external_apps)

        # Go through all the external apps in the SSAI currently
        for app in dmc_external_apps:
            if app not in discovered_external_apps:
                # app no longer exists, it must have been externally uninstalled
                _logger.info("Uninstall external app '%s'", app)
                payload = self._external_apps_service.uninstall_app(app)
                if payload["status"] != SlimStatus.STATUS_OK:
                    return CommandResult(
                        failed=True,
                        description="Failed to uninstall external app %s" % app,
                        payload={"error": payload["messages"]})
            else:
                # the app has been already discovered - check for updates
                package_creator = self._package_creator(app, idx_external_apps, sh_external_apps)
                package = package_creator(app, topology, update_only=True)
                if not package:
                    _logger.warning("cannot create a dummy package for app %s", app)
                else:
                    self._external_apps_service.update_app(app, package)

                # update app location if it has changed
                discovered_groups = self._construct_app_groups(app, idx_external_apps, sh_external_apps)
                if set(self._apps_service.read(app).make_group_list()) != set(discovered_groups):
                    _logger.info("Update %s groups to %s", app, discovered_groups)
                    self._external_apps_service.update_app_properties(app, {AppProperty.GROUPS: discovered_groups})

                discovered_external_apps.remove(app)

        # we have covered the deleted apps and updated ones so now only
        # left ones are to install
        for app in discovered_external_apps:
            _logger.info("Install external app '%s'", app)
            try:
                groups = self._construct_app_groups(app, idx_external_apps, sh_external_apps)
                package = self._package_creator(app, idx_external_apps, sh_external_apps)(app, topology)
                if not package:
                    _logger.warning("cannot create a dummy package for app %s", app)
                else:
                    self._external_apps_service.install_app(app, package, groups)

            # pylint: disable=broad-except
            except Exception as ex:
                # pylint: enable=broad-except
                _logger.warning("cannot handle app  %s %s", app, str(ex))

        # SPL-185397 -Remove older graphs to prevent graphs continue to grow
        # In cloud stacks most of the stacks run external apps discovery every
        # hour or so and some apps discoveries may continue to keep adding graphs.
        # So we want to keep cap of number of entries in the graph kvstore db.
        self._slim_service.clean_older_installation_graphs()
        _logger.info("status=success")
        return CommandResult(True, False, None)
    # pylint: enable=too-many-locals

    def _construct_app_groups(self, app, idx_external_apps, sh_external_apps):
        """Return a list of app groups
        """
        groups = []
        if app in idx_external_apps:
            groups.append(builtin_name.indexers)
        if app in sh_external_apps:
            groups.append(builtin_name.search_heads)
        return groups

    # Explore the apps that are in the etc/shcluster/apps folder or in the SH itself but not in the
    # dmc internal apps yet.
    def _sh_external_apps(self, topology, dmc_internal_apps):
        """Detect new apps installed on SH
        """
        sh_external_apps = []

        shc_deployer = topology.get(SHC_DEPLOYER_FIELD)
        if shc_deployer:
            sh_external_apps += \
                self._external_apps_from_local_folder(dmc_internal_apps, self._splunk_home.shdeployer_apps())

        sh_node = self._get_sh_node(topology)
        if sh_node:
            sh_external_apps += self._get_sh_apps(sh_node, dmc_internal_apps + sh_external_apps)

        return sh_external_apps

    def _get_sh_apps(self, sh_node, exclude):
        """Retrieve the apps installed on a SH node excluding the apps that have been already discovered"""

        client_service = get_remote_service_from_topology_info(
            self._splunk_host, self._secure_storage, sh_node)
        response = client_service.get("/services/apps/local", output_mode="json", count=0)
        return [
            entry["name"] for entry in json.load(response.body)["entry"]
            if entry["name"] not in exclude
        ]

    def _get_sh_node(self, topology):
        """Get a SH node. In case of SHC we assume that all SH nodes are "equal", i.e., have the same availability
        status and have got identical set of installed apps.
        """
        shc_deployer = topology.get(SHC_DEPLOYER_FIELD)
        if shc_deployer and shc_deployer.get("targets"):
            node = {"mgmtUri": shc_deployer["targets"][0]["mgmtUri"],
                    "secret": shc_deployer["secret"]}
        else:
            node = topology.get(SEARCH_HEAD_FIELD)
        return node

    def _indexer_external_apps(self, dmc_internal_apps):
        """Detect new apps on the indexers
        """
        return self._external_apps_from_local_folder(dmc_internal_apps, self._splunk_home.master_apps())

    def _external_apps_from_local_folder(self, dmc_internal_apps, local_folder_path):
        """
        Discover apps in a folder
        """
        if not os.path.isdir(local_folder_path):
            _logger.debug("%s is missing.", local_folder_path)
            return []
        contents = os.listdir(local_folder_path)
        return [
            name for name in contents
            if (name not in dmc_internal_apps and
                not name.startswith("_") and
                os.path.isdir(os.path.join(local_folder_path, name)))
            ]

    def _create_sh_package_from_remote_sh(self, app_id, topology, update_only):
        """Create a dummy package for an app from a remote SH
        """
        app_conf = self._read_sh_app_conf(app_id, topology)

        if not app_conf:
            return None

        if update_only:
            package_name = self._apps_service.read(app_id).package

            current_version = self._stanzas_service.get_app_property_from_package(
                app_id, os.path.join(self._splunk_home.repository(), package_name), AppProperty.VERSION)
            new_version = app_conf["launcher"]["version"]
            _logger.info("Current_version: %s, new version: %s", current_version, new_version)

            if new_version == current_version:
                return CURRENT_NEW_VERSIONS_SAME  # same version of the app, no need to update package

            if new_version is None or new_version == DEFAULT_APP_VERSION:
                _logger.error("Failed to update app %s. Version number in app.conf must be set", app_id)
                return None

        with self._stanzas_service.create_temp_app(app_id):
            # write the app.conf contents to the new app source, this is a temp bundle so no change log is required
            with self._stanzas_service.create_type_writer(app_id, "app", log_change=False) as writer:
                for stanza, content in app_conf.items():
                    writer.set(stanza, None, OrderedDict(content))

            _logger.info("calling slim_server export with app_id %s", app_id)
            # Export this app source as a package to the SLIM repository
            return self._slim_service.export_app_archive(app_id)

    def _create_package_from_local_folder(self, app_id, topology, folder, update_only):
        """Create a dummy package from an app in local folder.
        """
        app_conf_file = os.path.join(folder, app_id, "default", "app.conf")
        if not os.path.isfile(app_conf_file):
            _logger.warning("App %s doesn't have app.conf file, skipping the app", app_id)
            return None

        # create a predeployment_apps folder
        with self._stanzas_service.create_temp_app(app_id):

            # Copy the app.conf contents to the new app source
            os.mkdir(os.path.join(self._splunk_home.predeployment_apps(), app_id, "local"))
            new_app_conf_file = os.path.join(self._splunk_home.predeployment_apps(), app_id, "local", "app.conf")
            shutil.copyfile(app_conf_file, new_app_conf_file)

            new_version = self._stanzas_service.get_app_version(app_id)

            if update_only:
                package_name = self._apps_service.read(app_id).package
                current_version = self._stanzas_service.get_app_property_from_package(
                    app_id, os.path.join(self._splunk_home.repository(), package_name), AppProperty.VERSION)
                if new_version == current_version:
                    _logger.info("App version did not change. No update needed. App Id: %s", app_id)
                    return CURRENT_NEW_VERSIONS_SAME  # same version of the app, no need to update package

                if new_version is None or new_version is DEFAULT_APP_VERSION:
                    _logger.error("Failed to update app %s. Version number in app.conf must be set", app_id)
                    return None

            if new_version is None:
                _logger.warning("App %s doesn't have version, setting the default one", app_id)
                with self._stanzas_service.create_type_writer(app_id, "app", log_change=False) as writer:
                    # read dummy app conf that is in the local folder
                    conf = writer.read_stanza("launcher")
                    launcher_stanza = conf[2] if conf else {}
                    launcher_stanza.setdefault("version", DEFAULT_APP_VERSION)
                    writer.set("launcher", None, OrderedDict(launcher_stanza))

            # Export this app source as a package to the SLIM repository
            return self._slim_service.export_app_archive(app_id)

    def _create_sh_package(self, app_id, topology, update_only=False):
        """Create a dummy package from a SH app to represent the external app in our repository.
        """
        package = None
        if SHC_DEPLOYER_FIELD in topology:
            # try to make a pseudo app package from shcluster/apps
            package = self._create_package_from_local_folder(
                app_id, topology, self._splunk_home.shdeployer_apps(), update_only)

        if package == CURRENT_NEW_VERSIONS_SAME:
            # same version of the app, no need to update package
            return None

        if not package:
            # if no package found try to create it by querying the SH
            package = self._create_sh_package_from_remote_sh(app_id, topology, update_only)

        if package == CURRENT_NEW_VERSIONS_SAME:
            # same version of the app, no need to update package
            _logger.info("Remote SH App: App version did not change. No update needed. App Id: %s", app_id)
            return None

        if not package:
            _logger.warning("Package for %s has not been found neither in local folder nor at SH", app_id)

        return package

    def _create_indexer_package(self, app_id, topology, update_only=False):
        """Create a dummy package from a CM app to represent the external app in our repository.
        """

        package = self._create_package_from_local_folder(
            app_id, topology, self._splunk_home.master_apps(), update_only)

        if package == CURRENT_NEW_VERSIONS_SAME:
            return None

        return package

    def _create_indexer_and_sh_package(self, app_id, topology, update_only=False):
        """Create a dummy package from its CM app or in case of any failure query SH
        """

        package = self._create_package_from_local_folder(
            app_id, topology, self._splunk_home.master_apps(), update_only)

        if package == CURRENT_NEW_VERSIONS_SAME:
            return None

        if not package:
            # if app package is invalid try to create it by querying the SH
            package = self._create_sh_package_from_remote_sh(app_id, topology, update_only)

        if package == CURRENT_NEW_VERSIONS_SAME:
            return None

        return package

    def _package_creator(self, app, idx_external_apps, sh_external_apps):
        """Return a function that construct package depending on app location
        """
        ret = None
        if app in idx_external_apps and app in sh_external_apps:
            ret = self._create_indexer_and_sh_package
        elif app in idx_external_apps:
            ret = self._create_indexer_package
        elif app in sh_external_apps:
            ret = self._create_sh_package
        else:
            assert False  # strange, we shouldn't be here

        return ret

    # why do we read the /services/apps/local and not /services/apps/default
    def _read_sh_app_conf(self, app, topology):
        """Read an app installed on SH and return its dummy configuration
        """
        client_service = get_remote_service_from_topology_info(
            self._splunk_host, self._secure_storage, self._get_sh_node(topology))
        entry = json.load(client_service.get("/services/apps/local/%s" % app, output_mode="json").body)["entry"]
        if not entry:
            return None

        app_info = entry[0]
        content = app_info.get("content", {})

        # SPL-180633: only exception - even if version is set,
        # but it's either an empty string, or only contains spaces
        # it should be set to default version in scope of SSAI app
        if "version" in content.keys() and not content.get("version").strip():
            content["version"] = DEFAULT_APP_VERSION

        return {
            "package": {
                "id": app_info.get("name", ""),
                "check_for_updates": splunk_bool(content.get("check_for_updates"))
            },
            "install": {
                "state": "disabled" if content.get("disabled") is True else "enabled",
                "is_configured": splunk_bool(content.get("configured"))
            },
            "launcher": {
                "author": content.get("author", ""),
                "description": content.get("description", ""),
                "version": content.get("version", DEFAULT_APP_VERSION)
            },
            "ui": {
                "label": content.get("label", ""),
                "is_visible": splunk_bool(content.get("visible"))
            }
        }
