"""
Service for apps installed onto DMC for deployment
"""

# pylint: disable=too-many-lines, unsupported-membership-test, unsubscriptable-object

import json
import logging
import os
import re
import tarfile
import shutil
import time
from collections import namedtuple, OrderedDict

import semantic_version
import splunk.appbuilder as appbuilder
from splunk.clilib.bundle_paths import get_app_name_from_tarball
from splunk import InternalServerError as SplunkInternalServerError
from splunk.admin import AlreadyExistsException, ArgValidationException
from slim.utils import SlimStatus

from bottle import HTTPError

import agent
from agent import ioc, wtransaction
import agent.splunklib.binding
from agent.common.helpers import compare_versions, splunk_bool, generate_guid, make_temp, is_string, trace
from agent.models import App, PersistentData
from agent.models.app import AppProperty, AppPackageType
from agent.models.change import EventType
from agent.services import group_helpers, slim_service
from agent.services.changelog_service import OpType
from agent.services.slim_service import rename_app_package, copy_app_package
from agent.services.topologies_service import SHC_DEPLOYER_FIELD
from agent.splunklib.data import load as xml_load
from agent.common.json_schema import validate_schema
from agent.repositories.persistent_data_repository import REPOSITORY_DATA_ID_SYNC_APPS
from agent.repositories.base_repository import Collection


# SLIM requires an app version for dependency management, while some external apps don't have app version property,
# DEFAULT_APP_VERSION is used instead
DEFAULT_APP_VERSION = "0.0.0"


_logger = logging.getLogger(__name__)


def _make_version(version):
    """
    Make version element for change log
    """
    return {"@version": version}


def _get_downloaded_path_from_response(response):
    """
    Get downloaded path from response and verify that it exists.
    """
    response_json = json.load(response.body)
    downloaded = response_json["downloaded"]
    if not os.path.isfile(downloaded):
        raise agent.ServerException(downloaded, fmt="Downloaded file %s does not exists")
    return downloaded


def _validate_groups(properties):
    """Validate groups existence
    """
    # TODO We should use json_schema to validate this once it
    # supports array
    groups = properties.get("groups")
    if not groups:
        return

    if not isinstance(groups, list):
        msg = "Invalid format for 'groups': '%s'" % groups
        _logger.warning(msg)
        raise agent.ServerException(fmt=msg)

    if len(groups) != len(set(groups)):
        msg = "Duplicate(s) in 'groups': '%s'" % groups
        _logger.warning(msg)
        raise agent.ServerException(fmt=msg)

    for group in groups:
        if not group:
            msg = "Group cannot be empty string"
            _logger.warning(msg)
            raise agent.ServerException(fmt=msg)
        if not is_string(group):
            msg = "Invalid format of group: '%s'" % group
            _logger.warning(msg)
            raise agent.ServerException(fmt=msg)
        if group_helpers.is_single_node(group):
            msg = "Single node group is disallowed: '%s'" % group
            _logger.warning(msg)
            raise agent.ServerException(fmt=msg)
        if not group_helpers.is_valid(group):
            msg = "Invalid group: '%s'" % group
            _logger.warning(msg)
            raise agent.ServerException(fmt=msg)


# Schema we expect from the /services/apps/remote/entriesbyid endpoint
# Note that the entry field may be an array of objects or a single object,
# so it is validated separately by _ENTRIES_BY_ID_ENTRY_SCHEMA
_ENTRIES_BY_ID_SCHEMA = {
    "type": "object",
    "properties": {
        "feed": {
            "type": "object",
            "properties": {
                "entry": {
                    "type": ["array", "object"]
                }
            },
            "required": ["entry"],
            "additionalProperties": False
        }
    },
    "required": ["feed"],
    "additionalProperties": False
}


# Schema we expect for each entry defined by the /services/apps/remote/entriesbyid endpoint
_ENTRIES_BY_ID_ENTRY_SCHEMA = {
    "type": "object",
    "properties": {
        "content": {
            "type": "object",
            "properties": {
                "appName": {"type": "string"},
                "license": {"type": "string"},
                "licenseUrl": {"type": "string"}
            },
            "required": ["appName", "license", "licenseUrl"],
            "additionalProperties": True
        }
    },
    "required": ["content"],
    "additionalProperties": True
}


# Describes an app package to be installed
AppPackageInfo = namedtuple('InstallPackageInfo', 'package, properties, name, is_upgrade')


# pylint: disable=too-many-public-methods
class AppsService(ioc.Component):

    """Service to work with apps
    """

    def __init__(self):
        self._splunk_home = ioc.components.splunk_home()
        self._stanzas_service = ioc.services.stanzas_service()
        self._instances_service = ioc.services.instances_service()
        self._deploy_service = ioc.services.deploy_service()
        self._apps_repository = ioc.repositories.apps_repository()
        self._user_context = ioc.components.user_context()
        self._changelog_service = ioc.services.changelog_service()
        self._splunk_home = ioc.components.splunk_home()
        self._slim_service = ioc.services.slim_service()
        self._splunk_service = ioc.components.splunk_host().get_service(owner="nobody")
        self._topologies_service = ioc.services.topologies_service()
        self._persistent_data_repository = ioc.repositories.persistent_data_repository()
        self._packages_service = ioc.services.packages_service()
        self._configuration = ioc.components.configuration()

    @trace
    @wtransaction
    def create(self, app, path, log_change=True):
        """
        Create an app
        """
        result = self._apps_repository.insert(app, log_change=log_change)
        name = app.get_value("name")
        self._stanzas_service.install_app_from_path(name, path)
        if log_change:
            version = self._stanzas_service.get_app_version(name)
            self._log_after_version(version)
        self._deploy_service.invalidate_cache(
            instances_changed=False,
            groups_changed=False,
            apps_changed=True,
            ds_apps_changed=False)
        return result

    @trace
    @wtransaction
    def install(self, app):
        """
        Officially install an app, which means it is ready for deployment. Log the app and update the versions.
        """
        name = app.get_value("name")
        self._apps_repository.update(app, log_change=False)
        self._apps_repository.log_change(app, insert=True)
        version = self._stanzas_service.get_app_version(name)
        self._log_after_version(version)

    @trace
    def upgrade(self, name, path, new_properties=None):
        """
        Upgrade an existing app on disk, optionally update app entity properties
        """
        user = self._user_context.user
        before_version = self._stanzas_service.get_app_version(name)

        # log before applying the app bundle so that there will be a log record even if
        # a crash happens during or right after applying.
        key_obj = self._apps_repository.make_log_key(name)
        self._changelog_service.record(
            EventType.app,
            user,
            # "key.name" field is used across all entity types.
            key=key_obj,
            op_type=OpType.upgrade,
            before=_make_version(before_version))

        if new_properties is not None:
            app = self._apps_repository.get(name)
            app.set_values(new_properties)
            # no need to log update changes because this operation is a part of app upgrade
            self._apps_repository.update(app, log_change=False)

        self._stanzas_service.install_app_from_path(name, path)
        after_version = self._stanzas_service.get_app_version(name)
        self._log_after_version(after_version)

    def read(self, name, add_info=False):
        """
        Read properties of an app
        """
        app = self._apps_repository.get(name)

        version = self.version(name)
        app.set_value("@version", version if version != DEFAULT_APP_VERSION else None)

        types = self._stanzas_service.existing_types(name)
        app.set_value(
            "@existingTypes",
            [{"name": ttype, "count": count} for ttype, count in types])

        if add_info:
            self._decorate_app_properties(app)
            self._add_update_info([app])

        return app

    @trace
    def delete(self, name, log_change=True):
        """
        Delete an installed app
        """
        version = self._stanzas_service.get_app_version(name)
        label_obj = self._apps_repository.make_log_label(name)
        self._stanzas_service.delete_app(name)
        self._apps_repository.delete(name, log_change=log_change)
        if log_change:
            self._log_before_version(version)
            self._log_key_label(label_obj)
        self._deploy_service.invalidate_cache(
            instances_changed=False,
            groups_changed=False,
            apps_changed=True,
            ds_apps_changed=False)

    def read_all(self, query=None):
        """
        Fetch the custom list of apps
        """
        return self._apps_repository.get_all(query=query)

    # pylint: disable=too-many-arguments
    def read_all_with_total(
            self,
            req_query=None,
            count=None,
            offset=None,
            sort_key=None,
            reverse=None):
        """
        Fetch the custom apps along with the total
        :return {tuple} (results, total):
        """

        name_query = req_query.get("name") if req_query else None
        pattern = None
        if name_query and "$regex" in name_query:
            pattern = re.compile(name_query["$regex"].encode('unicode-escape').decode(), re.IGNORECASE)
            del req_query["name"]

        # query all apps matching given filter parameters
        apps = self._apps_repository.get_all_with_total(
            query=req_query,
            limit=0 if pattern else count,
            skip=0 if pattern else offset,
            sort=((sort_key,
                   -1 if reverse
                   else 1),))

        # now compute temporary fields for every app
        # iterate over a copy of the apps listing in case we need to modify it
        for app in list(apps.results):
            version = self.version(app.get_value("name"))
            app.set_value("@version", version if version != DEFAULT_APP_VERSION else None)

            label = self.label(app.get_value("name"))
            app.set_value("@label", label)

            # filter out apps that don't match the (optional) name query
            if pattern and not pattern.search(label or app.objid):
                apps.results.remove(app)
                continue

            self._decorate_app_properties(app)

        self._add_update_info(apps.results)

        if pattern:
            # compute the offset and count after name query filter is applied
            return Collection(results=apps.results[offset:len(apps.results) if count == 0 else offset + count],
                              total=len(apps.results))

        return apps

    def read_all_names(self,
                       req_query=None,
                       count=None,
                       offset=None,
                       sort_key=None,
                       reverse=None):
        """
        Fetch identities of apps
        """
        name_query = req_query.get("name") if req_query else None
        pattern = None
        if name_query and "$regex" in name_query:
            pattern = re.compile(name_query["$regex"].encode('unicode-escape').decode(), re.IGNORECASE)
            del req_query["name"]

        # query all apps matching given filter parameters
        sort = ((sort_key, -1 if reverse else 1),) if sort_key else None
        apps = self._apps_repository.get_all_with_total(
            query=req_query,
            limit=0 if pattern else count,
            skip=0 if pattern else offset,
            sort=sort,
            fields=("name",),
            add_auxiliary_info=False)

        # now compute temporary fields for every app
        # iterate over a copy of the apps listing in case we need to modify it
        for app in list(apps.results):
            label = self.label(app.get_value("name"))
            app.set_value("@label", label)

            # filter out apps that don't match the (optional) name query
            if pattern and not pattern.search(label or app.objid):
                apps.results.remove(app)
                continue

        if pattern:
            # compute the offset and count after name query filter is applied
            return Collection(results=apps.results[offset:len(apps.results) if count == 0 else offset + count],
                              total=len(apps.results))
        return apps

    def exists(self, name):
        """
        Return if the app with the same name is already installed.
        """
        try:
            self._apps_repository.get(name)
            return True
        except agent.NotFoundException:
            return False

    def external(self, name):
        """
        Return if the app is external.
        """
        try:
            app = self._apps_repository.get(name)
            return app.external
        except agent.NotFoundException:
            return False

    def is_staged(self, name):
        """
        Return if the app is staged.
        """
        try:
            app = self._apps_repository.get(name)
            return app.staged
        except agent.NotFoundException:
            # Exception may come from _apps_repository.get()
            return False

    def is_a_dependency(self, name):
        """
        Return if this app was installed as a dependency
        """
        try:
            app = self._apps_repository.get(name)
            return app.get_value(AppProperty.PACKAGE_TYPE, AppPackageType.NONE) == AppPackageType.DEPENDENCY
        except agent.NotFoundException:
            # Exception may come from _apps_repository.get()
            return False

    def transaction_id(self, name):
        """
        Return the apps transaction id.
        """
        try:
            app = self._apps_repository.get(name)
            # Default transactionID is None do we have to check for key first
            if app.has_path(AppProperty.TRANSACTION_ID):
                return app.get_value(AppProperty.TRANSACTION_ID)
            return None
        except agent.NotFoundException:
            # Exception may come from _apps_repository.get()
            return False

    def version(self, name):
        """
        Return the app version
        """
        app = self._apps_repository.get(name)
        if app.external:
            package = os.path.join(self._splunk_home.repository(), app.package)
            return self._stanzas_service.get_app_property_from_package(name, package, AppProperty.VERSION)
        return self._stanzas_service.get_app_version(name)

    def label(self, name):
        """
        Return the app label
        """
        app = self._apps_repository.get(name)
        if app.external:
            package = os.path.join(self._splunk_home.repository(), app.package)
            return self._stanzas_service.get_app_property_from_package(name, package, AppProperty.LABEL)
        return self._stanzas_service.get_app_label(name)

    def check_for_updates(self, name):
        """
        Return the app check_for_updates setting
        """
        app = self._apps_repository.get(name)
        if app.private:
            return False  # do not check for updates on private apps
        if app.external:
            package = os.path.join(self._splunk_home.repository(), app.package)
            return self._stanzas_service.get_app_property_from_package(name, package, AppProperty.CHECK_FOR_UPDATES)
        return self._stanzas_service.get_app_check_for_updates(name)

    def create_app_archive(self, app_name, ofile):
        """
        Create app archive
        """
        self._stanzas_service.create_app_archive(app_name, ofile)

    def get_app_info_from_splunkbase(self, app_id):
        """
        Get app info (title, license) from Splunkbase using App ID
        """

        try:
            path_segment = "/services/apps/remote/entriesbyid/%s" % app_id
            response = self._splunk_service.get(path_segment)
            if response.status == 200:
                result = xml_load(str(response.body))

                # Validate the response is what we expect so we can find the app title and license
                validate_schema(result, _ENTRIES_BY_ID_SCHEMA)

                if isinstance(result["feed"]["entry"], list):
                    entry = result["feed"]["entry"][0]
                else:
                    entry = result["feed"]["entry"]
                validate_schema(entry, _ENTRIES_BY_ID_ENTRY_SCHEMA)

                # Take the current entry and return the app info
                return {
                    "app_id": app_id,
                    "app_title": entry["content"]["appName"],
                    "license": entry["content"]["license"],
                    "license_url": entry["content"]["licenseUrl"]
                }
        # ignore possible errors
        except agent.splunklib.binding.HTTPError as exc:
            _logger.error("get app info failed, http status=%d, %s", exc.status, exc.reason)
        except agent.ServerException as exc:
            _logger.error("incorrect app info %s", str(exc))

        # if cannot get a valid reply from splunkbase then return "dummy" app info
        return {
            "app_id": app_id,
            "app_title": app_id,
            "license": None,
            "license_url": None
        }

    def get_from_splunkbase_by_app_id(self, app_id, auth,
                                      rename_package=False, app_version=None):
        """
        Get app package from Splunkbase using App ID
        """
        path_segment = "/services/apps/remote/entriesbyid/%s" % app_id
        if app_version:
            path_segment += "/%s" % app_version
        query = {
            "action": "download",
            "auth": auth
        }
        headers = [("Content-Type", "application/x-www-form-urlencoded")]
        response = self.retry_splunkbase_ops(
            method="POST",
            path_segment=path_segment,
            headers=headers,
            **query)

        downloaded = _get_downloaded_path_from_response(response)
        if rename_package:
            # Do not use the temp filename, name the package after the app_id
            app_version = self._stanzas_service.get_app_property_from_package(app_id, downloaded, AppProperty.VERSION)
            dest_downloaded = rename_app_package(downloaded, os.path.dirname(downloaded), app_id, app_version)
            downloaded = dest_downloaded
        return downloaded

    def retry_splunkbase_ops(self, method, path_segment, headers=None, **query):
        """
            SPL-237852: retry splunkbase operations if there was a server exception raised on splunkbase
        """
        splunkbase_retry_enabled = self._configuration.get_boolean("splunkbase_retry_enabled", default=True)
        splunkbase_max_retry = self._configuration.get_int("splunkbase_retry_limit", default=1)
        splunkbase_retry_delay = self._configuration.get_int("splunkbase_retry_interval", default=10)

        if method == "GET":
            attempt = 1
            while True:
                response = self._splunk_service.get(
                    path_segment, **query)
                attempt += 1
                if splunkbase_retry_enabled and attempt <= splunkbase_max_retry and \
                        response.status >= 500 and response.status < 600:
                    time.sleep(splunkbase_retry_delay)
                else:
                    break

        elif method == "POST":
            attempt = 1
            while True:
                response = self._splunk_service.post(
                    headers=headers, path_segment=path_segment, **query)
                attempt += 1
                if splunkbase_retry_enabled and attempt <= splunkbase_max_retry and \
                        response.status >= 500 and response.status < 600:
                    time.sleep(splunkbase_retry_delay)
                else:
                    break

        return response

    def get_from_splunkbase_by_uri(self, uri, auth):
        """
        Get app package from Splunkbase using Uri
        """
        path_segment = "/services/splunkbase/download"
        download_info = {
            "uri": uri,
            "auth": auth
        }
        response = self._splunk_service.post(
            path_segment=path_segment,
            output_mode="json",
            body=json.dumps(download_info))
        return _get_downloaded_path_from_response(response)

    def check_app_id_conflict(self, app_id):
        """
        Check if this app_id already exists on Splunkbase
        Return True if there is a conflict
        """
        try:
            path_segment = "/services/apps/remote/entriesbyid/%s" % app_id
            response = self._splunk_service.get(path_segment)
            if response.status == 200:
                return True  # app_id exists on Splunkbase, we have a conflict
            _logger.warning("Unknown response while checking for app id conflicts, status %d", response.status)
            return False  # unknown response code, assume no conflict
        except agent.splunklib.binding.HTTPError as exc:
            if exc.status == 404:
                return False  # app_id does not exist on Splunkbase, no conflict
            _logger.warning("Unknown response while checking for app id conflicts, status %d", exc.status)
            return False  # unknown response code, assume no conflict

    def check_app_compatibility(self, app_id):
        """
        Check that app has install_method_distributed == appmgmt_phase.
        """

        if not self._filter_compatible_apps([app_id]):
            raise agent.ServerException(
                fmt="Application is not compatible with the system.")

    def _filter_compatible_apps(self, apps):
        """Get apps that have install_method_distributed==appmgmt_phase
        :param apps: list of app ids
        :return: dict of "compatible apps" app_id => app update properties
        The implementation queries /services/appsbrowser/v1/app/ which goes through the SplunkBaseProxy. This brings
        only the apps that have required install_method_distributed.
        """

        if not apps:
            return {}

        splunkbase_api_uri = "/services/appsbrowser/v1/app/"

        response = self.retry_splunkbase_ops(
            method="GET",
            path_segment=splunkbase_api_uri,
            appid=",".join(apps),
            install_method_distributed="appmgmt_phase",
            limit=100)

        if response.status != 200:
            _logger.error("Cannot read data from %s. Status code %d.", splunkbase_api_uri, response.status)
            return []

        try:
            return {app["appid"]: app for app in json.load(response.body)["results"]}
        except ValueError as ex:
            _logger.error("Cannot parse apps properties. %s.", str(ex))

        return {}

    def check_app_supported_deployment(self, package):
        """
        Check if app supports SHC
        """

        topology = self._topologies_service.get_default_topology().json()
        shc_deployer = topology.get(SHC_DEPLOYER_FIELD)

        if not shc_deployer:
            return None

        payload = self._slim_service.describe(package)
        if payload["status"] != SlimStatus.STATUS_OK:
            _logger.error("cannot describe app package, %d", payload["status"])
            raise agent.ApiErrorException("AppInstall_BadPackage")
        manifest = payload["manifest"]
        supported_deployments = manifest.get("supported_deployments")

        # Allow installation if app.manifest doesn't present or has schema version < 2.0.0
        skip_validation = manifest.get("generated") or compare_versions(manifest.get("schema_version"), "2.0.0") < 0

        if not skip_validation and supported_deployments and (
                "_search_head_clustering" not in supported_deployments and "*" not in supported_deployments):
            _logger.error("Package %s does not support SHC deployment.", package)
            raise agent.ApiErrorException("AppInstall_UnsupportedDeployment",
                                          dict(deployment="_search_head_clustering"))

        return manifest

    def _log_after_version(self, version):
        """
        Update the last logged record to include the after version
        """
        self._changelog_service.add_to_after_value(_make_version(version))

    def _log_before_version(self, version):
        """
        Update the last logged record to include the before version
        """
        self._changelog_service.add_to_before_value(_make_version(version))

    def _log_key_label(self, label_obj):
        """
        Update the last logged record to include the key label
        """
        self._changelog_service.add_to_key_value(label_obj)

    def _add_update_info(self, apps):
        """Check availability of apps update and set @updateAvailable flag depending on the update status
        """

        # query splunkbase for apps update
        installed_apps_info = []
        for app in apps:
            check_for_updates = self.check_for_updates(app.objid)
            if not check_for_updates:
                continue  # do not check this app for updates
            version = self.version(app.objid)
            if version is None:
                continue  # we cannot check this app for updates without a version
            installed_apps_info.append({"id": app.objid, "version": version})
        try:
            response = self._splunk_service.post(
                path_segment="/services/splunkbase/list-updates",
                output_mode="json",
                body=json.dumps(installed_apps_info))
        except agent.splunklib.binding.HTTPError as ex:
            # log error and return, inability to query updates status isn't a critical issue
            _logger.warning("cannot get apps update info, http status=%d, %s", ex.status, ex.reason)
            return

        # set @updateAvailable
        updated_apps = {update["id"] for update in json.load(response.body)}
        updated_apps = self._filter_compatible_apps(updated_apps)
        for app in apps:
            app.set_value("@updateAvailable",
                          updated_apps[app.objid] if app.objid in updated_apps else None)

    @trace
    def install_deployment_app(self, app_props, options):
        """Single step install deployment app
        :param app_props: app properties: name (id)
        :param options: additional installation flags
                            (auth, disableAutomaticResolution,
                             installDependencies, appVersion)
        :return: install payload
        """
        try:
            installed = []  # list of the apps installed by this call

            if self.exists(app_props["id"]):
                raise agent.ServerException(fmt="%s is already installed." % app_props["id"])

            def download_and_install(props, app_type="Application"):
                """try to download app from remote server and install/update it"""
                app_id = props["id"]

                if os.path.exists(os.path.join(self._splunk_home.master_apps(), app_id)):
                    raise agent.ServerException(fmt="%s is already installed." % app_type)

                app = self._create_from_remote(
                    app_id,
                    options["auth"],
                    app_version=options["appVersion"]
                )[0]
                installed.append(app_id)

                return (app.package,
                        self._map_app_package(app.package, options["mappings"], options["disableAutomaticResolution"]))

            app_package, payload = download_and_install(app_props)

            if payload["status"] != SlimStatus.STATUS_OK:
                if payload["status"] == SlimStatus.STATUS_ERROR_MISSING_DEPENDENCIES and \
                        options["installDependencies"]:
                    # download and install missing dependencies
                    for dependency in payload["missing_dependencies"]:
                        _, payload = download_and_install({"id": dependency["app_id"]},
                                                          "Dependency %s" % dependency["app_title"])
                        if payload["status"] != SlimStatus.STATUS_OK:
                            raise HTTPError(400, payload["messages"])

                    # map app package again with installed dependencies
                    payload = self._map_app_package(
                        app_package, options["mappings"], options["disableAutomaticResolution"])

                if payload["status"] != SlimStatus.STATUS_OK:
                    # apps have been created but mapping failed - rollback
                    for name in installed:
                        self.delete_installed_app(name)
                    return payload

            return None
        except:  # noqa: E722
            # apps have been created but install or delete failed - rollback the apps
            for name in installed:
                self.delete_installed_app(name)
            raise

    def get_compatible_app_update_version(self, app_id):
        """ Retrieves Compatible APP version from app_id

        :param app_id
        :return: app_version
        """

        if not self.exists(app_id):
            _logger.error("app with app_id %s is not installed and can't be updated", app_id)
            return None

        # query splunkbase for apps updated version
        apps_info = []
        apps_info.append({"id": app_id, "version": self.version(app_id)})

        response = self._splunk_service.post(
            path_segment="/services/splunkbase/list-updates",
            output_mode="json",
            body=json.dumps(apps_info))

        data = json.load(response.body)
        if data:
            _logger.info("app with app_id: %s has update with app_version: %s",
                         app_id, data[0]["version"] if "version" in data[0] else "VERSION MISSING")
            return data[0]["version"] if "version" in data[0] else None

        # Failed to fetch version
        _logger.warning("Unable to find update for app with app_id %s and version %s",
                        app_id, self.version(app_id))
        return None

    @trace
    def update_deployment_app(self, app_props, options):
        """Single step update deployment app
        :param app_props: app properties: name (appId)
        :param options: additional installation flags
                            (auth, installDependencies, appVersion)
        :return: install payload
        """

        app_id = app_props["id"]
        app = self.read(app_id, add_info=True)
        if not app.get_value("@updateAvailable"):
            raise agent.ServerException(fmt="%s is up to date." % app_id)

        app_update_version = ""
        if options["appVersion"]:
            app_update_version = options["appVersion"]
        else:
            try:
                app_update_version = self.get_compatible_app_update_version(app_id)
            except:  # noqa: E722
                raise HTTPError(400, "Unable to Fetch Valid updated app_version for app_id :  " + app_id)

        self.check_app_compatibility(app_id)
        downloaded = self.get_from_splunkbase_by_app_id(
            app_props["id"],
            options["auth"],
            rename_package=True,
            app_version=app_update_version)
        try:
            self._update_app_package(app_id, downloaded)
        except agent.ApiErrorException as ex:
            raise HTTPError(400, ex.payload["messages"])

    @trace
    def _update_app_package(self, app_id, package, properties=None, delete_old_package=False):
        """Update app using its newer package
        """
        self.check_app_supported_deployment(package)
        app = self.read(app_id)
        old_package_id = app.get_value(AppProperty.PACKAGE_ID)
        payload = self._slim_service.update_app(package)
        if payload["status"] == SlimStatus.STATUS_OK:
            # all apps with their properties in the installation graph
            installed_apps = {
                app_id: app_props
                for target in payload["installation_graph"].values()
                for app_id, app_props in target["apps"].items()
            }

            def get_installed_changes(action):
                """Compose list of apps changed by an action (add/remove/update)"""
                return set(sum([
                    list(changes[action].keys()) if action == "update" else changes[action]
                    for changes in payload["installation_graph_updates"].values()
                ], []))

            self._update_changed_apps(
                installed_apps,
                {action: get_installed_changes(action) for action in ["add", "remove", "update"]})

            self._slim_service.remove_package(app.package)  # remove "old" package

            if properties:
                # update app properties
                app = self.read(app_id)
                app.set_values(properties)
                # no need to log update changes because this operation is a part of app upgrade
                self._apps_repository.update(app, log_change=False)
                if delete_old_package:
                    self._packages_service.delete(old_package_id)
        else:
            raise agent.ApiErrorException("AppInstall_UpdateFailed", dict(messages=payload["messages"]))

    def _update_changed_apps(self, installed_apps, updates):
        """Update apps changed by SLIM
        :param installed_apps: dictionary of the installed apps: app id -> app properties
        :param updates: dictionary that describes the change: action -> list of changed apps. Supported actions are
        add, remove, update
        """
        if all(not update for update in updates.values()):
            raise agent.ServerException(fmt="There is no installable content.")

        for action, apps in updates.items():
            for app_id in apps:
                if action == "add":
                    app_package = installed_apps[app_id].get("source")
                    self.create(App({AppProperty.NAME: app_id,
                                     AppProperty.PACKAGE_TYPE: AppPackageType.DEFAULT,
                                     AppProperty.PACKAGE: app_package},
                                    use_defaults=True),
                                os.path.join(self._splunk_home.repository(), app_package))
                elif action == "update":
                    app_package = installed_apps[app_id].get("source")
                    self.upgrade(
                        app_id,
                        os.path.join(self._splunk_home.repository(), app_package),
                        new_properties={AppProperty.PACKAGE: app_package}
                    )
                elif action == "remove":
                    self.delete(app_id)
                else:
                    assert False  # unknown action

    def _create_from_remote(self, app_id, auth, app_version=None):
        """Create app from the remote provider (splunkbase)
        :param app_id: app id (name)
        :param auth: splunkbase authorization token
        """
        downloaded = None
        try:
            self.check_app_compatibility(app_id)
            downloaded = self.get_from_splunkbase_by_app_id(
                app_id,
                auth,
                rename_package=True,
                app_version=app_version
            )
            return self._install_app_from_package(downloaded, app_id)
        finally:
            # cleanup the downloaded file
            if downloaded and os.path.exists(downloaded):
                os.remove(downloaded)

    @trace
    def _install_app_from_package(self, package, app_id, app_properties=None):
        """Install app from its package
        """

        # assign app the default package type and mark it as staged (not yet deployable), create a transactionId for
        # all apps affected by this install
        if not app_properties:
            app_properties = {}
        app_properties.update({
            AppProperty.PACKAGE_TYPE: AppPackageType.DEFAULT,
            AppProperty.STAGED: True,
            AppProperty.TRANSACTION_ID: generate_guid()
        })

        package_list = [
            AppPackageInfo(package, app_properties.copy(), name=app_id, is_upgrade=self.exists(app_id))
        ]

        installed = []

        # the remaining packages will be dependencies, update the package type
        app_properties.update({
            AppProperty.PACKAGE_TYPE: AppPackageType.DEPENDENCY
        })

        while len(package_list) > 0:
            try:
                install = package_list.pop(0)
                # validate app package name
                install = install._replace(name=self._validate_package_name(install))
                if install.name is None:
                    continue  # this might happen for already-installed-dependencies

                # validate the app package contents
                messages = self._validate_package_contents(install)

                # check if app is supported on shc
                self.check_app_supported_deployment(install.package)

                # install the app package and record the app entity with validation messages
                app = self._install_package(install)
                app.set_value("messages", messages)
                self.describe_app(app)
                installed.append(app)

                # extract and setup the packaged dependencies for installation
                dependencies = slim_service.extract_packaged_dependencies(
                    install.package,
                    target_dir=os.path.dirname(install.package))
                for dependency in dependencies:
                    package_list.append(AppPackageInfo(dependency, app_properties, name=None, is_upgrade=False))

            except HTTPError:
                # Delete apps and packages installed by this request (existing apps and packages are not touched)
                # App updates are not included here because they have not been added to the entity list yet
                for app in installed:
                    self._slim_service.remove_package(app.get_value(AppProperty.PACKAGE))
                    self.delete(app.get_value(AppProperty.NAME))
                raise

        return installed

    @trace
    def _install_package(self, install):
        """Install the package
        :param install: AppPackageInfo tuple
        """
        graph_updated = False
        try:
            if install.is_upgrade:
                # Apps being upgraded cannot be staged, they must have already been installed. This is to prevent
                # updating an app to another version that will not work with existing apps
                if self.is_staged(install.name):
                    msg = "App '%s' is staged and cannot be upgraded without being installed first" % install.name
                    _logger.warning(msg)
                    raise agent.ServerException(fmt=msg)

                # Update the installation graph with the new app package information
                # SLIM will validate if the version changes and we have a dependency conflict
                payload = self._slim_service.update_app(install.package)
                if payload["status"] != 0:
                    raise HTTPError(400, payload["messages"])
                graph_updated = True

                if not self.exists(install.name):
                    raise agent.ServerException(fmt="%s does not exist." % install.name)
                properties = {
                    AppProperty.PACKAGE: os.path.basename(install.package)
                }
                self.upgrade(install.name, install.package, new_properties=properties)
                ret = self.read(install.name)
            else:
                # update the app properties with app-specific settings
                install.properties[AppProperty.NAME] = install.name
                install.properties[AppProperty.PACKAGE] = os.path.basename(install.package)
                app = App(install.properties, use_defaults=True)
                if install.properties["template"] == "barebones_cloud":
                    install.properties["private"] = True
                _validate_groups(install.properties)
                ret = self.create(app, install.package, log_change=False)

            # install the app package to the repository
            self._slim_service.add_package(install.package)
            return ret

        except HTTPError:
            if graph_updated:
                # rollback the previous installation if we made changes
                self._slim_service.rollback_installation()
            raise

        except agent.UniqueItemException as exp:
            _logger.warning(exp)
            raise HTTPError(409, str(exp))

    @trace
    def _map_app_package(self, app_package, mappings, disable_automatic_resolution):
        """Install an existing app to the mapping
        """

        # validate the server class groups before we use them
        if mappings is not None:
            for group_list in mappings.values():
                _validate_groups({"groups": group_list})

        # install the app package to the requested mappings
        payload = self._slim_service.install_app(
            app_package,
            mappings,
            disable_automatic_resolution=disable_automatic_resolution)
        if payload["status"] != SlimStatus.STATUS_OK:
            # pylint: disable=no-else-return
            if payload["status"] == SlimStatus.STATUS_ERROR_RESOLVABLE_CONFLICT:
                return {"status": payload["status"], "messages": payload["messages"]}
            elif payload["status"] == SlimStatus.STATUS_ERROR_MISSING_DEPENDENCIES:
                missing_dependencies = [self.get_app_info_from_splunkbase(app_id)
                                        for app_id in payload["missing_dependencies"]]
                return {
                    "status": payload["status"],
                    "messages": payload["messages"],
                    "missing_dependencies": missing_dependencies
                }
            raise HTTPError(400, payload["messages"])

        changed_entities = {}
        changed_sources = {}

        # update all the apps that have been installed, they are ready to deploy
        for group, updates in payload["installation_graph_updates"].items():

            # process all apps (and dependencies) that have been added to the installation
            changed_entities = self._process_graph_additions(group, updates["add"], changed_entities)

            # process all apps (and dependencies) that have been removed from the installation
            changed_entities = self._process_graph_removals(group, updates["remove"], changed_entities)

            # process which existing apps have been automatically updated to fix dependency conflicts
            changed_sources = self._process_graph_updates(updates["update"].items(), changed_sources)

        # since apps may appear in more than one group/server class, we want to only perform an update once
        for app_name, _app_package in changed_sources.items():
            self._install_app_from_package(_app_package, app_name)

        # since apps may appear in more than one group/server class, we want to only perform a write/install once
        for entity in changed_entities.values():
            self.install(entity)

        self._validate_installation_graph(payload["installation_graph"], app_package)

        return payload

    def _validate_package_name(self, install):
        """Validate the name of a package before installation.
        :param install: install package
        :return: app name to install
        """
        # Peek inside the package to discover the root folder (which should be the app)
        # Each tarball is allowed to have at most one app inside for installation - this
        # does not include the packaged dependencies (which are within a hidden folder).
        try:
            name_from_package = get_app_name_from_tarball(install.package, raise_error_if_multiple_apps=True)
        except Exception as ex:
            # str(e) of SplunkInternalServerError includes http error code text. Use get_message_text instead.
            # pylint: disable=no-member
            e_msg = ex.get_message_text() if isinstance(ex, SplunkInternalServerError) else str(ex)
            msg = "Error reading app package as a tar file: %s" % e_msg
            _logger.warning(msg)
            raise agent.ServerException(fmt=msg)

        # We don't allow app name with leading underscore, which might result in app bundle name conflicts
        # with group bundle names, and app folder name conflicts with group (custom, builtin, or node) bundle
        # folder names.
        if name_from_package.startswith('_'):
            msg = "App names cannot start with '_'."
            _logger.warning(msg)
            raise agent.ServerException(fmt=msg)

        # Only the root app can be "upgraded" at this point, dependencies are either installed or not installed
        # Any version conflicts that may exist will be discovered during validation and/or installation time
        if install.is_upgrade:
            if install.name != name_from_package:
                msg = "App name '%s' in the package does not match expected name '%s'" \
                      % (name_from_package, install.name)
                _logger.warning(msg)
                raise agent.ServerException(fmt=msg)
        elif self.exists(name_from_package):
            msg = "App '%s' already exists" % name_from_package
            if install.properties[AppProperty.PACKAGE_TYPE] == AppPackageType.DEPENDENCY:
                _logger.warning("%s, skipping installation of this dependency", msg)
                return None
            _logger.warning(msg)
            raise agent.ServerException(fmt=msg)

        return name_from_package

    def _validate_package_contents(self, install):
        """Validate the package contents before installation. Return any validation messages
        """
        if install.is_upgrade:
            # Apps being upgraded cannot contain a local folder or packaged dependencies
            with tarfile.open(install.package) as tar:
                for i in tar.getmembers():
                    _logger.debug("Examining file to upgrade: %s", i.name)
                    path = i.name.split('/')  # tar files always use '/' as the separator, irrespective of platform
                    if len(path) == 2 and path[0] == install.name and path[1].lower() == "local":
                        msg = "App '%s' contains 'local' folder so can't be used for upgrade." % install.name
                        _logger.warning(msg)
                        raise agent.ServerException(fmt=msg)

                # Apps being upgraded cannot have packaged dependencies, since we only permit a single app upgrade
                if slim_service.count_packaged_dependencies_from_tar(tar) > 0:
                    msg = "App '%s' cannot contain packaged dependencies during upgrade" % install.name
                    _logger.warning(msg)
                    raise agent.ServerException(fmt=msg)

        # Validate this package before we install the contents and any dependencies
        # If there are no packaged dependencies, then dependencies are required to
        # be available via previous package installations and in the repository
        payload = self._slim_service.validate_package(install.package)
        if payload["status"] != 0:
            raise HTTPError(400, payload["messages"])

        return payload["messages"]

    def describe_app(self, entity):
        """Describe the app and append the manifest to the app entity
        :param entity: app entity
        :return: a list of messages, if any
        """
        manifest = None
        if not entity.package:
            msg = "Failed to describe app %s, app package is blank" % entity.objid
            _logger.warning(msg)
            messages = [msg]
        else:
            app_source = os.path.join(self._splunk_home.repository(), entity.package)
            if not os.path.isfile(app_source):
                msg = "Failed to describe app %s, missing app package %s" % (entity.objid, entity.package)
                _logger.warning(msg)
                messages = [msg]
            else:
                payload = self._slim_service.describe(app_source)
                if payload["status"] == SlimStatus.STATUS_OK:
                    manifest = payload["manifest"]

                    # add the app label for each dependency (version already included by SLIM)
                    if "dependencies" in manifest:
                        for app_id in manifest["dependencies"].keys():
                            app_label = self.label(app_id) if self.exists(app_id) else app_id
                            manifest["dependencies"][app_id]["label"] = app_label
                messages = payload["messages"]

        # any messages from the slim_service are logged already, do not duplicate
        entity.set_value("manifest", manifest)
        return messages

    def _process_graph_additions(self, group, additions, changed_entities):
        """Given the list of app additions to the group's installation graph, update the staged property to indicate
        they are ready for deployment (staged=False). Also, add this group to the app's group property.
        """

        # process all apps (and dependencies) that have been added to the installation
        for app_id in additions:
            if app_id not in changed_entities:
                changed_entities[app_id] = self.read(app_id)
            entity = changed_entities[app_id]

            # This app is ready for deployment, update the staged property
            entity.staged = False

            entity.add_value(AppProperty.GROUPS, group)

            changed_entities[app_id] = entity

        return changed_entities

    def _process_graph_removals(self, group, removals, changed_entities):
        """Given the list of app removals to the group's installation graph, update the app's group property.
        """

        # process all apps (and dependencies) that have been added to the installation
        for app_id in removals:
            if app_id not in changed_entities:
                changed_entities[app_id] = self.read(app_id)
            entity = changed_entities[app_id]

            # remove this target group (workload or server class) from the app
            entity.remove_value(AppProperty.GROUPS, group)

            changed_entities[app_id] = entity

        return changed_entities

    def _process_graph_updates(self, updates, changed_sources):
        """Given the list of apps that have been updated to a new package version, verify this version matches
        previously updated versions.
        """

        # process which existing apps have been automatically updated to fix dependency conflicts
        for app_id, app_package in updates:
            app_package = os.path.join(self._splunk_home.repository(), app_package)
            if app_id in changed_sources and changed_sources[app_id] != app_package:
                self._slim_service.rollback_installation()
                raise agent.ServerException(fmt="Different versions of '%s' is not yet supported!" % app_id)
            changed_sources[app_id] = app_package

        return changed_sources

    def _validate_installation_graph(self, installation_graph, app_package):
        """Validate installation graph vs. installing package. It's expected that package should appear somewhere
        in the graph.
        """
        source = os.path.basename(app_package)
        for topo in installation_graph.values():
            if any(app.get("source") == source for app in topo.get("apps", {}).values()):
                return
        raise agent.ServerException(fmt="Nothing to install, app package has no installable content.")

    @trace
    def delete_installed_app(self, name, check_payload=False, delete_package=False):
        """Delete an app that has been installed into slim
        """

        # do not permit deleting a dependency, we know this operation will fail
        if self.is_a_dependency(name):
            msg = "Deleting the dependency '%s' not permitted." % name
            _logger.warning(msg)
            raise agent.ServerException(fmt=msg)

        # compute a list of apps that need to be deleted, default to the requested app
        remove_list = set([name])
        # if the app is still staged, it has not been added to the installation graph, and we need to delete the apps
        # installed as linked by the same transaction id
        if self.is_staged(name):
            transaction_id = self.transaction_id(name)

            # Read all apps that are linked with the same transaction id
            apps = self.read_all(query={AppProperty.TRANSACTION_ID: transaction_id})
            for app in apps:
                remove_list.add(app.get_value("name"))
        else:
            # uninstall this app from the system, or report conflicts
            payload = self._slim_service.uninstall_app(name)
            if payload["status"] != SlimStatus.STATUS_OK:
                if check_payload and payload["status"] == SlimStatus.STATUS_ERROR_DEPENDENCY_REQUIRED:
                    required_apps = [self.get_app_info_from_splunkbase(app_id) for app_id in payload["required_apps"]]
                    return {
                        "status": payload["status"],
                        "messages": payload["messages"],
                        "required_apps": required_apps
                    }
                raise HTTPError(400, payload["messages"])

            # compute the list of apps to delete
            if "installation_graph_updates" in payload:
                for updates in payload["installation_graph_updates"].values():
                    remove_list.update(updates["remove"])

        # process the list of apps to delete, including the package in the repository
        for app_id in remove_list:
            app = self.read(app_id)
            if app.has_path(AppProperty.PACKAGE) and app.get_value(AppProperty.PACKAGE):
                self._slim_service.remove_package(app.get_value(AppProperty.PACKAGE))
            # do not log a delete change if this is a staged app (it was never installed)
            self.delete(app_id, log_change=(not app.staged))
            if delete_package:
                app_package_id = app.get_value(AppProperty.PACKAGE_ID)
                self._packages_service.delete(app_package_id)
        return []

    @trace
    def change_app_state(self, name, enable):
        """Change app state
        :param name: app name
        :param enable: state (enable/disable)
        """

        app = self.read(name)

        if app.external:
            raise agent.ServerException(fmt="Cannot change state of an external app")

        state = "enabled" if enable else "disabled"

        if self._stanzas_service.get_app_state(name) == state:
            raise agent.ServerException(fmt="App is already '%s'" % state)

        with self._stanzas_service.create_type_writer(name, "app", log_change=False) as writer:
            install_local_settings = None

            settings = install_local_settings = writer.read_stanza("install")
            if settings:
                _, _, install_local_settings = settings

            # clone stanza containers because they need to be updated
            install_local_settings = OrderedDict(install_local_settings or {})
            install_local_settings["state"] = state

            writer.set("install", None, install_local_settings)

        # record app state update
        key_obj = self._apps_repository.make_log_key(name)
        self._changelog_service.record(
            EventType.app,
            self._user_context.user,
            key=key_obj,
            op_type=OpType.update,
            before={"state": "disabled" if enable else "enabled"},
            after={"state": state})

        # update persistent storage of apps that need additional synchronization
        self._persistent_data_repository.upsert(PersistentData({"name": REPOSITORY_DATA_ID_SYNC_APPS, "data": []}))

        sync_apps = self._persistent_data_repository.get(REPOSITORY_DATA_ID_SYNC_APPS).data
        if name not in sync_apps:
            self._persistent_data_repository.update(PersistentData({
                "name": REPOSITORY_DATA_ID_SYNC_APPS,
                "data": sync_apps + [name]
            }))

    # pylint: disable=too-many-branches
    @trace
    def install_uploaded_app_package(self, app_package, app_id, app_version, package_id, delete_old_package=False):
        """Install uploaded app package. This is a very simple installation that doesn't try to "fix" missing
        dependencies. In the future we probably will need to unify this function with install_deployment_app.
        :param app_package: app package tar
        :param app_id: app id
        :param app_version: app version
        :param package_id: uploaded package id
        """
        app = None
        if self.exists(app_id):
            _logger.info("App already exists with the version %s and the version being installed is %s",
                         self.version(app_id), app_version)
            if compare_versions(app_version, self.version(app_id)) < 0:
                raise agent.ApiErrorException("AppUpdate_AlreadyUpToDate",
                                              payload=dict(name=app_id, label=self.label(app_id)))
            app = self.read(app_id)
            if not app.private:
                raise agent.ApiErrorException("AppInstall_AlreadyExists",
                                              payload=dict(name=app_id, label=self.label(app_id)))

        # copy the package to a temp folder in the correct named format (without package id prefix)
        # this is required before the package is installed into the repository
        with make_temp() as temp_dir:
            try:
                semantic_version.Version(app_version or DEFAULT_APP_VERSION)
            except ValueError as ex:
                raise agent.ApiErrorException("AppInstall_InvalidVersionException", dict(message=str(ex)))
            temp_package = copy_app_package(app_package, temp_dir, app_id, app_version or DEFAULT_APP_VERSION)

            if app:
                # the app already exists - let's update it
                _logger.info("update app %s", app_id)
                try:
                    self._update_app_package(app_id, temp_package, properties={AppProperty.PACKAGE_ID: package_id},
                                             delete_old_package=delete_old_package)
                except agent.ServerException as ex:
                    raise agent.ApiErrorException("AppInstall_ServerException", dict(message=str(ex)))
            else:
                _logger.info("install app %s", app_id)
                installed_app = None
                try:
                    installed_apps = self._install_app_from_package(
                        temp_package, app_id, {AppProperty.PRIVATE: True, AppProperty.PACKAGE_ID: package_id})

                    installed_app = app_id
                    installed_package = installed_apps[0].package  # we do not support dependencies

                    result = self._map_app_package(
                        installed_package, mappings=None, disable_automatic_resolution=False)
                    if result["status"] is not SlimStatus.STATUS_OK:
                        _logger.error("app install failed, status=%d, messages=%s",
                                      result["status"], result["messages"])
                        raise agent.ApiErrorException("AppInstall_SlimError", result)
                except agent.ApiErrorException as ex:
                    if installed_app:
                        self.delete_installed_app(installed_app)
                    raise ex
                except agent.ServerException as ex:
                    if installed_app:
                        self.delete_installed_app(installed_app)
                    # convert ServerExceptions for private apps, because public apps cannot handle ApiErrorExceptions
                    raise agent.ApiErrorException("AppInstall_ServerException", dict(message=str(ex)))
                except:  # noqa: E722
                    if installed_app:
                        self.delete_installed_app(installed_app)
                    raise
    # pylint: enable=too-many-branches

    def _decorate_app_properties(self, app):
        """Add app "dynamic" properties
        """
        if not app.external:
            app.set_value("@disabled", self._stanzas_service.get_app_state(app.objid) == "disabled")

            deployment = self._changelog_service.get_deployment_properties(app.objid)
            if not deployment:
                _logger.warning("App %s has not been deployed yet", app.objid)
            else:
                app.set_value("@deployedBy", deployment.get_value("deployedBy"))
                app.set_value("@deployedOn", deployment.get_value("deployedOn"))

    @trace
    def create_app_from_template(self, app_properties):
        """Create a new app from template
        """
        app_id = app_properties["name"]
        app_version = app_properties.get("version", DEFAULT_APP_VERSION)

        if not semantic_version.validate(app_version):
            raise agent.ApiErrorException("AppCreateFromTemplate_BadVersion",
                                          payload=dict(name=app_id, version=app_version))

        if not all(c.isalnum() or c in "_-" for c in app_id):
            raise agent.ApiErrorException("AppCreateFromTemplate_BadName",
                                          payload=dict(name=app_id))

        template = app_properties["template"]

        appbuilder.TEMPLATES_PATH = os.path.join(self._splunk_home.apps(), "dmc", "bin", "agent", "app_templates")

        if template not in os.listdir(appbuilder.TEMPLATES_PATH):
            raise agent.ApiErrorException("AppCreateFromTemplate_NoTemplate",
                                          payload=dict(name=app_id, template=template))

        if self.exists(app_id):
            _logger.warning("app %s already exists", app_id)
            raise agent.ApiErrorException("AppCreateFromTemplate_AlreadyExists",
                                          payload=dict(name=app_id, label=self.label(app_id)))

        # check if app_id has a conflict with a public splunkbase one
        if self.check_app_id_conflict(app_id):
            raise agent.ApiErrorException("AppCreateFromTemplate_AppIDConflict", payload=dict(name=app_id))

        try:
            _logger.info("creating an app %s from template %s", app_id, template)
            current_directory = os.getcwd()  # preserve current dir that could be changed by createApp
            appbuilder.createApp(app_id, template, **dict(
                id=app_id,
                label=app_properties.get("label", app_id),
                visible=splunk_bool(app_properties.get("visible", True)),
                version=app_version,
                author=app_properties.get("author", ""),
                description=app_properties.get("description", ""),
                configured=splunk_bool(app_properties.get("configured", False))
            ))
        except AlreadyExistsException:
            # looks like etc/apps already includes an app_id folder
            _logger.warning("app %s folder already exists", app_id)
            raise agent.ApiErrorException("AppCreateFromTemplate_AlreadyExists",
                                          payload=dict(name=app_id, label=app_id))
        except ArgValidationException as ex:
            raise agent.ApiErrorException("AppCreateFromTemplate_Fail", payload=dict(name=app_id, message=str(ex)))
        finally:
            os.chdir(current_directory)  # restore current dir changed by createApp

        # generate app package
        with make_temp(filename="%s-%s.tar.gz" % (app_id, app_version)) as package:
            with tarfile.open(package, mode="w:gz") as tar:
                tar.add(os.path.join(self._splunk_home.apps(), app_id), arcname=app_id)

            # remove app folder created by createApp
            shutil.rmtree(os.path.join(self._splunk_home.apps(), app_id))

            # install
            installed_apps = self._install_app_from_package(package, app_id, {AppProperty.TEMPLATE: template})
            result = self._map_app_package(
                installed_apps[0].package, mappings=None, disable_automatic_resolution=False)

            if result["status"] is not SlimStatus.STATUS_OK:
                _logger.error("app install failed, status=%d, messages=%s",
                              result["status"], result["messages"])
                raise agent.ApiErrorException("AppInstall_SlimError", result)
