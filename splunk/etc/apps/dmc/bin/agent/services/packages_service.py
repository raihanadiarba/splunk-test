"""
App packages service
"""
# pylint: disable=useless-object-inheritance, redefined-builtin, no-else-raise

import os
import time
import logging
import json
import six

from requests import ConnectionError
from requests.exceptions import MissingSchema

from slim.utils import SlimStatus

import agent

from agent.appinspect_apiclient.auth import DEFAULT_AUTH_ENDPOINT, Auth
from agent.appinspect_apiclient.exceptions import AppInspectClientAuthenticationException
from agent.models import Package
from agent import ioc, ApiErrorException, NotFoundException
from agent.common.helpers import generate_guid, mkdir_p, Enum
from agent.models.app import AppProperty
from agent.models.package import PackageProperty, PackageStatus
from agent.services.slim_service import count_packaged_dependencies
from agent.common.helpers import compare_versions


_logger = logging.getLogger(__name__)

# Maximum upload size for AppInspect is 512MB
MAX_APP_INSPECT_SIZE = (512 * 1024 * 1024)
# Maximium retry times to wait for prevetted app inpection workflow to finish
PREVETTED_MAX_RETRY_LIMIT = 8
PREVETTED_MAX_RETRY_TIMEOUT = "System times out because prevetted app inpect workflow takes too long."

APP_INSPECT_WORKFLOW_NAME = "appinspect_workflow"


@six.add_metaclass(Enum)
class PackageAction(object):
    """
    App package possible actions
    """

    NONE = "none"
    INSTALL = "install"
    UPDATE = "update"


def can_delete_package(status):
    """Determines whether package can be deleted
    """
    return status not in (PackageStatus.INSTALLED, PackageStatus.VETTING, PackageStatus.IN_MANUAL_REVIEW)


class PackagesService(ioc.Component):
    """App packages service
    """

    def __init__(self):
        self._splunk_home = ioc.components.splunk_home()
        self._apps_service = ioc.services.apps_service()
        self._stanzas_service = ioc.services.stanzas_service()
        self._tasks_service = ioc.services.tasks_service()
        self._tasks_repository = ioc.repositories.tasks_repository()
        self._slim_service = ioc.services.slim_service()
        self._deploy_service = ioc.services.deploy_service()
        self._splunk_host = agent.ioc.components.splunk_host()
        self._user_context = ioc.components.user_context()

        configuration = ioc.components.configuration()
        self._app_inspect_auth_endpoint = configuration.get_string("app_inspect_auth_endpoint",
                                                                   default=DEFAULT_AUTH_ENDPOINT)
        self.enable_upload_apps_pagination = configuration.get_boolean(
            "enable_upload_apps_pagination", default=True)

    def post_audit_trail(self, audit_info):
        """ Post to audit trail
        """

        path_segment = "/services/admin/audit-trail"
        dmc_audit_action = "dmc_operation"
        splunk_service = self._splunk_host.get_service()
        user = self._user_context.user

        body = []
        event = {
            "user": user,
            "action": dmc_audit_action,
            "info": audit_info
        }
        body.append(event)

        splunk_service.post(
            path_segment=path_segment,
            # The REST handler requires output_mode to be set to json, even though an output is always empty.
            output_mode="json",
            body=json.dumps(body))
        return json.dumps(body)

    def accept_risk(self, package_id):
        """ Accept risk for a previously uploaded app package
        :param package_id: uploaded package id
        """

        _, _, app_id, app_version = self._get_app_package_info(package_id)
        accept_info = "Risk assessment for %s:%s accepted" % (app_id, app_version)
        return self.post_audit_trail(accept_info)

    def reject_risk(self, package_id):
        """ Accept risk for a previously uploaded app package
        :param package_id: uploaded package id
        """

        _, _, app_id, app_version = self._get_app_package_info(package_id)
        reject_info = "Risk assessment for %s:%s rejected" % (app_id, app_version)
        return self.post_audit_trail(reject_info)

    def upload_login(self, username, password):
        """
        :param username: user name
        :param password: password
        :return: auth token for upload
        """
        auth = Auth(self._app_inspect_auth_endpoint)
        try:
            auth.authenticate(username, password)
        except AppInspectClientAuthenticationException as ex:
            raise ApiErrorException("AppUpload_InspectAuthentication", dict(message=str(ex)))
        except (ConnectionError, MissingSchema) as ex:
            raise ApiErrorException("AppUpload_InspectConnection", dict(message=str(ex)))
        return auth.token

    def upload(self, file_upload, token=None):
        """Upload private app package
        :param file_upload: FileUpload instance
        """
        return self._upload_internal(False, file_upload, token)

    def prevetted_upload(self, file_upload, token=None):
        """Upload prevetted private app package
        :param file_upload: FileUpload instance
        """
        return self._upload_internal(True, file_upload, token)

    def _upload_internal(self, prevetted_mode, file_upload, token=None):
        """Upload private app package
        :param prevetted_mode: True for prevetted upload
        :param file_upload: FileUpload instance
        """
        package_guid = generate_guid()
        package_name = "%s_%s" % (package_guid, file_upload.filename)
        app_package = os.path.join(self._splunk_home.unvetted_apps(), package_name)
        mkdir_p(self._splunk_home.unvetted_apps())
        file_upload.save(app_package)

        try:
            # Basic package checking before app inspect validation
            if os.path.getsize(app_package) == 0:
                _logger.warning("app package %s is empty", file_upload.filename)
                raise ApiErrorException("AppUpload_EmptyPackage", dict(name=file_upload.filename))
            elif os.path.getsize(app_package) > MAX_APP_INSPECT_SIZE:
                _logger.warning("app package %s is too large, must be less than 512MB", file_upload.filename)
                raise ApiErrorException("AppUpload_LargePackage", dict(name=file_upload.filename))
        except ApiErrorException as ex:
            os.remove(app_package)
            raise ex

        _logger.info("Uploaded package %s to %s", file_upload.filename, app_package)

        # Start app inspect validation
        task = self._tasks_service.new_task(
            APP_INSPECT_WORKFLOW_NAME, package=package_name, token=token, prevetted_mode=prevetted_mode)
        _logger.info("Started validation with taskId %s", task.taskid)

        if prevetted_mode:
            app_id = self._stanzas_service.get_app_id_from_package(app_package)
            package_id = task.taskid  # package_id is actually guid of the task that verifies it
            retries = 0
            retry_delay = 1
            while True:
                try:
                    task = self._tasks_service.get(package_id)
                    task.set_value("app_id", app_id)
                except NotFoundException:
                    _logger.error("Cannot find task with package id %s", package_id)
                    raise ApiErrorException("AppInstall_NoPackage", dict(id=package_id))

                # There might be optional errors
                errors = next((self._get_errors(s) for s in task.stages if self._get_errors(s)),
                              None)

                if task.state in ["new", "running"]:
                    if retries > PREVETTED_MAX_RETRY_LIMIT:
                        _logger.error(PREVETTED_MAX_RETRY_TIMEOUT)
                        task.add_error(PREVETTED_MAX_RETRY_TIMEOUT)
                        break
                    _logger.info("Waiting for prevetted app inspect workflow to finish for %d seconds", retry_delay)
                    time.sleep(retry_delay)
                    retry_delay *= 2
                    retries += 1
                elif task.state == "completed":
                    package_status = task.payload.get("packageStatus")
                    if package_status == PackageStatus.APPROVED and (not errors):
                        task.set_value("do_install", True)
                    elif errors:
                        task.add_error(errors)
                    break
                else:
                    break
        return task

    def _get_errors(self, stage):
        """
        :return: errors in stage payload. If none, errors in stage itself
        """
        return stage.get("payload", {}).get("errors") or stage.get("errors")

    def _get_app_package_info(self, package_id):
        """Method to get app package info
        :param package_id: uploaded package id
        """

        try:
            task = self._tasks_service.get(package_id)
        except NotFoundException:
            _logger.warning("Cannot find task with id %s", package_id)
            raise ApiErrorException("AppInstall_NoPackage", dict(id=package_id))

        package_name = task.get_value(("payload", "package"))
        app_package = os.path.join(self._splunk_home.vetted_apps(), package_name)
        if not os.path.isfile(app_package):
            _logger.warning("Cannot find application package %s", package_name)
            raise ApiErrorException("AppInstall_NoPackage", dict(id=package_id))

        # extract app id and version from the package
        try:
            # app id is name of the first folder in the package. In case of any ambiguity the package will be
            # rejected by SLIM during install
            app_id = self._stanzas_service.get_app_id_from_package(app_package)
            if not app_id:
                raise KeyError("no app folder")

            app_version = self._stanzas_service.get_app_property_from_package(
                app_id, app_package, AppProperty.VERSION)
            if not app_version:
                raise KeyError("no app version")

        except Exception as ex:
            _logger.error("cannot extract app details, %s", ex)
            raise ApiErrorException("AppInstall_BadPackage")

        return package_name, app_package, app_id, app_version

    def install(self, package_id, delete_old_package=False):
        """Install a previously uploaded app package
        :param package_id: uploaded package id
        """

        package_name, app_package, app_id, app_version = self._get_app_package_info(package_id)

        # check if app_id has a conflict with a public Splunkbase app_id
        if self._apps_service.check_app_id_conflict(app_id):
            raise ApiErrorException("AppInstall_SplunkbaseAppIDConflict")

        # check to see if this app has dependencies - static/packaged dependencies not supported
        payload = self._slim_service.describe(app_package)
        if payload["status"] != SlimStatus.STATUS_OK:
            _logger.error("cannot describe app package, %d", payload["status"])
            raise ApiErrorException("AppInstall_BadPackage")
        manifest = payload["manifest"]

        packaged_dependencies = count_packaged_dependencies(app_package)
        static_dependencies = 0 if "dependencies" not in manifest \
            else sum([1 for app in manifest["dependencies"].values() if "package" in app and app["package"]])

        if packaged_dependencies + static_dependencies > 0:
            _logger.error("cannot install package with dependencies (%d packaged, %d statically declared)",
                          packaged_dependencies, static_dependencies)
            raise ApiErrorException("AppInstall_UnsupportedStaticDependencies")

        # install the app
        self._apps_service.install_uploaded_app_package(app_package, app_id, app_version,
                                                        package_id, delete_old_package)

    def get_package(self, package_id):
        """ Get package detail
        """
        task = self._tasks_service.get(package_id)
        package = self._get_task_package(task)
        return package

    def get_packages(
            self,
            req_query=None,
            count=None,
            offset=None,
            sort_key=None,
            reverse=False):
        """Get uploaded packages
           SPL-183885: Implemented Pagination in the Backend
        """
        req_query = {"workflow": APP_INSPECT_WORKFLOW_NAME}

        if self.enable_upload_apps_pagination:
            # SPL-217837: specify fields to get from tasks collection to accelerate our query
            fields = [
                '_key',
                '_user',
                'createdAt',
                'state',
                'messages',
                'payload',
                'app_manifest',
                'references',
                'taskId',
                'workflow',
                'stages.description',
                'stages.state',
                'stages.type',
                'stages.stageId',
                'stages.errors',
                'stages.payload.errors'
            ]
            _logger.info("get_packages called with query=%s, count=%s, offset=%s, sort_key=%s, reverse=%s fields=%s",
                         req_query, count, offset, sort_key, reverse, fields)

            # SPL-219136: sorting is supported only on createdAt and packageStatus field as it is the only
            # key that can be sorted on as everything else shown on the UI are derived fields
            if sort_key and sort_key not in ("createdAt", "payload.packageStatus"):
                raise NotImplementedError("Sort key %s isn't supported" % sort_key)

            app_inspect_tasks = self._tasks_service.get_all(query=req_query, count=count, offset=offset,
                                                            sort_key=sort_key, reverse=reverse, fields=fields)
        else:
            app_inspect_tasks = self._tasks_service.get_all(query=req_query)

        return [self._get_task_package(task, True) for task in app_inspect_tasks]

    def get_uploaded_apps_count(self):
        """Get count of tasks collection where,
        workflow: APP_INSPECT_WORKFLOW_NAME
        """
        return self._tasks_repository.get_count(
            query={"workflow": APP_INSPECT_WORKFLOW_NAME})

    def _get_task_package(self, task, use_cached_manifest=False):
        """Get uploaded package from its vetting task
        """
        app_info = None
        package_manifest = None

        def get_errors(stage):
            """
            :return: errors in stage payload. If none, errors in stage itself
            """
            return stage.get("payload", {}).get("errors") or stage.get("errors")

        # There might be optional errors
        errors = next((get_errors(s) for s in task.stages if get_errors(s)),
                      None)

        if task.state in ["new", "running"]:
            package_status = PackageStatus.VETTING
        elif task.state == "completed":
            package_status = task.payload.get("packageStatus")
        elif errors:
            package_status = PackageStatus.FAILED
        else:
            package_status = PackageStatus.UNKNOWN

        if package_status == PackageStatus.APPROVED:
            # the package is approved, let's check whether it's also installed
            # AppProperty.PACKAGE_ID is actually guid of the task that verifies it
            apps = self._apps_service.read_all({AppProperty.PACKAGE_ID: task.taskid})
            if apps and not apps[0].staged:
                # App that are already Installed
                package_status = PackageStatus.INSTALLED
                app_id = apps[0].objid
                app_label = self._apps_service.label(apps[0].objid)
                app_version = self._apps_service.version(apps[0].objid)
            else:
                if apps and apps[0].staged:
                    # App that is gettign installed
                    # if we find a staged app this might mean we failed to cleanup after a bad install
                    # however, only cleanup staged apps if an install is not currently in progress
                    # in either case, mark this app as "approved" and not "installed"
                    with self._deploy_service.lock.get_runtime_scope() as granted:
                        if granted:
                            _logger.warning("_get_task_package deleting a staged APP with app_id %s, \
                                as this could be stale APP ", apps[0].objid)
                            self._apps_service.delete_installed_app(apps[0].objid)
                app_package = os.path.join(self._splunk_home.vetted_apps(),
                                           task.get_value(("payload", "package")))
                # App that's uploaded and not installed yet
                # extract app id, label, and version from package
                app_id = self._stanzas_service.get_app_id_from_package(app_package)
                app_label = self._stanzas_service.get_app_property_from_package(
                    app_id, app_package, AppProperty.LABEL)
                app_version = self._stanzas_service.get_app_property_from_package(
                    app_id, app_package, AppProperty.VERSION)

                package_manifest = self.get_package_manifest(task,
                                                             app_id,
                                                             app_package,
                                                             use_cached_manifest)

            action = PackageAction.INSTALL
            if self._apps_service.exists(app_id) and self._apps_service.read(app_id).private:
                # SPL-180013: Make sure app_version is set
                if not app_version:
                    _logger.warning("Cannot find the version of the app %s."
                                    " This app may have been installed incorrectly", app_id)
                    action = PackageAction.NONE
                else:
                    action = PackageAction.UPDATE \
                        if compare_versions(self._apps_service.version(app_id), app_version) < 0 \
                        else PackageAction.NONE

            # return app id, label, and version of the app
            app_info = {
                AppProperty.NAME: app_id,
                AppProperty.LABEL: app_label if app_label else app_id,
                AppProperty.VERSION: app_version,
                "action": action
            }

        return Package({
            PackageProperty.PACKAGE_ID: task.taskid,
            PackageProperty.UPLOADED_FILE: task.get_value(("payload", "package")).split("_", 1)[-1],
            PackageProperty.STATUS: package_status,
            PackageProperty.SUBMITTED_AT: task.get_value("createdAt"),
            "@app": app_info,
            "@errors": errors,
            "@manifest": package_manifest
        })

    def get_package_manifest(self, task, app_id, app_package, use_cached_manifest):
        """ Get Cached App Manifest
        :param package_id: uploaded package id
        """
        package_manifest = None
        if use_cached_manifest:
            # Case for newly uploaded APP we find MANIFEST in task payload
            package_manifest = task.get_value(("payload", "app_manifest"), default=False)
            if package_manifest:
                _logger.info("Found app manifest In Task Payload, for APP %s ", app_id)

            if not package_manifest:
                # Case where we have APP's uploaded before code changes to cache
                # but not installed yet .Use Manifest from SLIM Cache if present
                package_manifest = \
                    self._slim_service.get_app_manifest_from_cache(app_id,
                                                                   task.get_value(("payload", "package")))
            if not package_manifest:
                # Couldnt find manifest from cache , no option but to do SLIM describe.
                # This will happen only for first time after  DMC process start.
                package_manifest = (self._slim_service.describe(app_package) or {}).get("manifest")
        else:
            package_manifest = (self._slim_service.describe(app_package) or {}).get("manifest")

        return package_manifest

    def delete(self, package_id):
        """Delete a previously uploaded app package
        :param package_id: uploaded package id
        """
        try:
            task = self._tasks_service.get(package_id)
        except NotFoundException:
            _logger.warning("Cannot find task with id %s", package_id)
            raise ApiErrorException("AppDelete_NoPackage", dict(id=package_id))

        if task.workflow != APP_INSPECT_WORKFLOW_NAME:
            _logger.warning("Task with id %s is not an app_inspect workflow.", package_id)
            raise ApiErrorException("AppDelete_NoPackage", dict(id=package_id))

        package = self._get_task_package(task)
        if not can_delete_package(package.status):
            raise ApiErrorException("AppDelete_PackageInUse", dict(status=package.status))

        package_name = task.get_value(("payload", "package"))

        vetted_app_package = os.path.join(self._splunk_home.vetted_apps(), package_name)
        if os.path.isfile(vetted_app_package):
            os.remove(vetted_app_package)

        unvetted_app_package = os.path.join(self._splunk_home.unvetted_apps(), package_name)
        if os.path.isfile(unvetted_app_package):
            os.remove(unvetted_app_package)

        self._tasks_service.delete(package_id)

    def get_report(self, package_id):
        """Get package app inspect report
        """
        try:
            task = self._tasks_service.get(package_id)
        except NotFoundException:
            _logger.warning("Cannot find task with id %s", package_id)
            raise ApiErrorException("AppInstall_NoPackage", dict(id=package_id))
        report = task.stages[0]["payload"].get("htmlReportData")
        if report is None:
            raise ApiErrorException("AppInspect_NoReport", dict(id=package_id))

        return report
