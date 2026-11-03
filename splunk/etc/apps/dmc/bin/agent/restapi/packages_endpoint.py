"""Private app packages endpoint
"""

import logging
import bottle
from bottle import request
from agent import ioc, ApiErrorException, NotFoundException
from agent.restapi import eai_helpers, JSONRequestPlugin, JSONResponsePlugin
from agent.restapi.helpers import deployment_scope, json_validate_request
from agent.models import View
from agent.common.access_control import Capability
from agent.restapi import access_control_helpers
from agent.models.package import PackageProperty, PackageStatus
from agent.services.packages_service import PackageAction, can_delete_package

_logger = logging.getLogger(__name__)


def _links_decorator(func):
    """Add action links to the packages
    """
    def wrapper(*args, **kwargs):
        """decorator wrapper"""
        result = func(*args, **kwargs)
        for item in result.get("entry", []):
            links = item.setdefault("links", {})

            # approved, rejected, or installed packages will have various link options
            content = item.get("content")
            status = content.get(PackageProperty.STATUS)
            if status in [PackageStatus.APPROVED, PackageStatus.REJECTED, PackageStatus.INSTALLED]:
                links["report"] = "/services/dmc/packages/%s/report" % item["name"]

                action = (content.get("@app") or {}).get("action")
                if action == PackageAction.INSTALL:
                    links["install"] = "/services/dmc/packages/%s/install" % item["name"]
                if action == PackageAction.UPDATE:
                    links["update"] = "/services/dmc/packages/%s/install" % item["name"]

            if can_delete_package(status):
                links["delete"] = "/services/dmc/packages/%s" % item["name"]

        return result

    return wrapper


class PackagesEndpoint(ioc.Component):
    """Packages endpoint
    """

    def __init__(self):
        self._service = ioc.services.packages_service()
        self._deploy_service = ioc.services.deploy_service()
        self._external_apps_service = ioc.services.external_apps_service()
        configuration = ioc.components.configuration()
        self.private_app_vetting_global = configuration.get_boolean("private_app_vetting_global", default=False)
        self.enable_upload_apps_pagination = configuration.get_boolean("enable_upload_apps_pagination", default=True)

        # obtain a token for app inspect API, needed for uploading a package
        bottle.post("/packages-upload\\:login")(self.upload_login)

        # upload an app package
        bottle.post("/packages-upload", skip=[JSONRequestPlugin.name])(self.upload)

        # install previously uploaded app package
        bottle.post("/packages/<package_id>/install")(self.install)

        # acknowledge user action for previously uploaded app package
        if self.private_app_vetting_global:
            bottle.post("/packages/<package_id>/ack")(self.ack)

        # list uploaded packages
        bottle.get("/packages")(self.get_packages)

        # list uploaded packages - paginated
        bottle.get("/packages-paginate")(self.get_packages_paginated)

        # Return provided uploaded package detail
        bottle.get("/packages/<package_id>")(self.get_package_by_id)

        # get package report
        bottle.get(
            "/packages/<package_id>/report", skip=[JSONRequestPlugin.name, JSONResponsePlugin.name])(self.get_report)

        # delete a package
        bottle.delete("/packages/<package_id>")(self.delete)

        # upload and install an app package
        bottle.post("/packages-prevetted-install", skip=[JSONRequestPlugin.name])(self.prevetted_install)

    @_links_decorator
    @eai_helpers.response_formatted
    def get_packages(self):
        """Get all uploaded packages
        """
        packages = self._service.get_packages()
        return eai_helpers.eai_result([(package.objid, package.json(View.RestView))
                                       for package in packages], len(packages))

    @_links_decorator
    @eai_helpers.paginated
    @eai_helpers.response_formatted
    def get_packages_paginated(self, **kwargs):
        """Get uploaded packages - paginated
        """
        packages = self._service.get_packages(**kwargs)
        return eai_helpers.eai_result([(package.objid, package.json(View.RestView))
                                       for package in packages], len(packages))

    @_links_decorator
    @eai_helpers.response_formatted
    def get_package_by_id(self, package_id, **kwargs):
        """Get Package details based on the provided package_id
        """
        try:
            package = self._service.get_package(package_id)
            return eai_helpers.eai_result([(package.objid, package.json(View.RestView))], 1)
        except NotFoundException as exp:
            raise bottle.HTTPError(404, str(exp))

    @access_control_helpers.edit_with_api_error('AppUpload', Capability.DEPLOY_APPS)
    @eai_helpers.response_formatted
    @eai_helpers.make_name('taskId')
    def upload(self):
        # pylint: disable=no-member
        """Upload a private app
        """
        token = request.forms.get("token")
        file_upload = request.files.get("data")
        if not file_upload:
            _logger.warning("app package is missing")
            raise ApiErrorException("AppUpload_NoPackage")
        validation_task = self._service.upload(file_upload, token)
        data = validation_task.json(View.RestView)
        return eai_helpers.eai_result([data], 1)

    @access_control_helpers.edit_with_api_error('AppUpload', Capability.DEPLOY_APPS)
    @eai_helpers.response_formatted
    @eai_helpers.make_name('taskId')
    def prevetted_install(self):
        # pylint: disable=no-member
        """ an endpoint to upload a prevetted private app and install in one shot
            First it performs a similar workflow as upload endpoint,
            except in the asynchronous app_inpect workflow: do not do vetting but only check if the app is prevetted
            if the app is prevetted and approved then
                go direct to run install service
            else
                return the upload result
        """
        token = request.forms.get("token")
        file_upload = request.files.get("data")
        if not file_upload:
            _logger.warning("app package is missing")
            raise ApiErrorException("AppUpload_NoPackage")
        validation_task = self._service.prevetted_upload(file_upload, token)
        data = validation_task.json(View.RestView)
        if data.get("do_install", False):
            app_id = data.get("app_id")
            _logger.info("Installing prevetted app: %s", app_id)
            with self._deployment_scope():
                self._service.install(data.get("taskId"), delete_old_package=True)
                # deploy changes
                deploy_task = self._deploy_service.deploy()
                deploy_task.set_value("app_id", app_id)
                return eai_helpers.eai_result([deploy_task.json(View.RestView)], 1)

        return eai_helpers.eai_result([data], 1)

    @access_control_helpers.edit_with_api_error('AppInstall', Capability.DEPLOY_APPS)
    @json_validate_request({
        "type": "object",
        "properties": {
            "accept": {"type": "boolean"}
        },
        "required": ["accept"],
        "additionalProperties": False
    })
    def ack(self, package_id):
        # pylint: disable=no-member
        """Acknowledge user action for a private app
        """
        status = 200
        accept = request.json.get("accept", False)
        try:
            if accept:
                report = self._service.accept_risk(package_id)
            else:
                report = self._service.reject_risk(package_id)
        except ApiErrorException as ex:
            status = 400
            report = str(ex)
        return bottle.HTTPResponse(body=report, status=status, headers={"Content-Type": "text/html"})

    @access_control_helpers.edit_with_api_error('AppInstall', Capability.DEPLOY_APPS)
    @eai_helpers.response_formatted
    @eai_helpers.messages_formatted
    @eai_helpers.make_name("taskId")
    def install(self, package_id):
        """Install an app package uploaded previously through upload_app
        """
        with self._deployment_scope():
            self._service.install(package_id)

            # deploy changes
            deploy_task = self._deploy_service.deploy()
            return eai_helpers.eai_result([deploy_task.json(View.RestView)], 1)

    def get_report(self, package_id):
        """Get package app inspect report in html format. Replay of this method is displayed by browser "as is" and
        nothing on UI side can catch ApiErrorException errors. We convert exceptions to plain text manually. A normal
        user should never see these errors.
        """
        status = 200
        try:
            report = self._service.get_report(package_id)
        except ApiErrorException as ex:
            if ex.type == "AppInstall_NoPackage":
                status = 404
                report = "Cannot find package %s." % package_id
            elif ex.type == "AppInspect_NoReport":
                status = 404  # no content
                report = "No report found."
            else:
                status = 400
                report = str(ex)
        return bottle.HTTPResponse(body=report, status=status, headers={"Content-Type": "text/html"})

    @access_control_helpers.edit_with_api_error('AppUpload', Capability.DEPLOY_APPS)
    @eai_helpers.response_formatted
    def upload_login(self):
        # pylint: disable=no-member
        """Get app inspect auth token for upload
        """
        username = request.json.get("username")
        password = request.json.get("password")
        token = self._service.upload_login(username, password)
        return "token", token

    @access_control_helpers.edit_with_api_error('AppDelete', Capability.DEPLOY_APPS)
    @eai_helpers.response_formatted
    def delete(self, package_id):
        """Delete a private app
        """
        with self._deployment_scope():
            self._service.delete(package_id)
            return eai_helpers.eai_result([dict(name=package_id)], 1)

    def _deployment_scope(self):
        """
        Return a deployment scope
        """
        return deployment_scope(self._deploy_service, self._external_apps_service)
