# pylint: disable=missing-docstring
# pylint: disable=invalid-name
# pylint: disable=no-init
# pylint: disable=no-self-use
# pylint: disable=attribute-defined-outside-init
# pylint: disable=too-few-public-methods
# pylint: disable=too-many-arguments
# pylint: disable=no-member,unsubscriptable-object,comparison-with-callable

import logging
import tempfile
import traceback
from functools import wraps

import bottle
from bottle import request, HTTPError

from slim.utils import SlimStatus

import agent
from agent import ioc
from agent.restapi import eai_helpers, JSONRequestPlugin, JSONResponsePlugin
from agent.restapi.helpers import must_exist, reject_external, json_validate_request, deployment_scope
from agent.models import View
from agent.services import group_helpers
from agent.common.access_control import Capability
from agent.restapi import access_control_helpers

_logger = logging.getLogger(__name__)


def access_control(service):
    """Access control wrapper
    1. Edit is controlled by EDIT_APPS
    2. Apps with @updateAvailable flag have /update action link
    """

    def access_control_decorator(func):
        @wraps(func)
        @access_control_helpers.links(service, ["create"], ["edit"], Capability.EDIT_APPS)
        @access_control_helpers.rights(Capability.EDIT_APPS)
        @access_control_helpers.edit(Capability.EDIT_APPS)
        def wrapper(*args, **kwargs):
            result = func(*args, **kwargs)
            for entry in result.get("entry", []):
                content = entry.get("content")

                # update available link
                if content and content.get("@updateAvailable") and content.get("external", False) is False:
                    entry.setdefault("links", {})["update"] = \
                        "/services/dmc/apps-install/%s/update" % entry.get("name")

                # enable/disable links
                if content and content.get("external") is False:
                    if content and content.get("@disabled"):
                        entry.setdefault("links", {})["enable"] = \
                            "/services/dmc/apps-install/%s/enable" % entry.get("name")
                    else:
                        entry.setdefault("links", {})["disable"] = \
                            "/services/dmc/apps-install/%s/disable" % entry.get("name")

            return result

        return wrapper

    return access_control_decorator


def deployment_app(func):
    """Generic wrapper for "end to end" API methods
    """

    @wraps(func)
    @access_control_helpers.edit(Capability.DEPLOY_APPS)
    @eai_helpers.response_formatted
    @eai_helpers.messages_formatted
    @eai_helpers.make_name("taskId")
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)

    return wrapper


class AppsEndpoint(ioc.Component):

    """Apps endpoint.
    """

    def __init__(self):
        self.service = ioc.services.apps_service()
        self.splunk_home = ioc.components.splunk_home()
        self.slim_service = ioc.services.slim_service()
        self.external_apps_service = ioc.services.external_apps_service()
        self.deploy_service = ioc.services.deploy_service()
        self.transaction_manager = ioc.components.transaction_manager()
        self.graph_repository = ioc.repositories.installation_graph_repository()

        # read all apps
        bottle.get("/apps")(self.read_apps)

        # read a specific app
        bottle.get("/apps/<name>")(self.read_app)

        # discover external apps
        bottle.post("/apps-discover")(self.discover_apps)

        # set apps "manageability"
        bottle.post("/apps-manageable")(self.manageable_apps)

        # download a specific app
        bottle.get("/apps-download/<name>.tar.gz",
                   skip=[JSONRequestPlugin.name, JSONResponsePlugin.name])(self.download_app)

        # describe the installation deployment graph
        bottle.get("/apps-meta/installation_graph")(self.get_installation_graph)
        # delete app from installation graph
        bottle.delete("/apps-meta/installation_graph/<name>")(self.delete_app_from_installation_graph)

        # "end-to-end single step" APIs that combine app operation with immediate deploy
        bottle.post("/apps-install")(self.install_deployment_app)
        bottle.post("/apps-install/<name>/update")(self.update_deployment_app)
        bottle.post("/apps-install/<name>/enable")(self.enable_deployment_app)
        bottle.post("/apps-install/<name>/disable")(self.disable_deployment_app)
        bottle.delete("/apps-install/<name>")(self.uninstall_deployment_app)

        # create a new app from template
        bottle.post("/apps-create")(self.create_app_from_template)

    @must_exist
    @access_control("/apps")
    @eai_helpers.response_formatted
    @eai_helpers.extract_name
    def read_app(self, name):
        with self.transaction_manager.transaction():
            entity = self.service.read(name, add_info=True)
            messages = self.service.describe_app(entity)
            entity.set_value("messages", messages)
            entity.set_default_values()  # Add any missing defaults to return a FULL app entity
            return entity.json(View.RestView)

    @access_control_helpers.edit(Capability.EDIT_APPS)
    @eai_helpers.response_formatted
    def discover_apps(self):
        """Initiate a discovery of external apps, and return its task
        """
        task = self.external_apps_service.update_apps()
        return eai_helpers.eai_result([task.json(View.RestView)], 1)

    @access_control_helpers.edit(Capability.EDIT_APPS, Capability.MANAGE_TOPOLOGY)
    @json_validate_request({
        "type": "object",
        "repeat": {
            "type": "boolean"
        }
    })
    @eai_helpers.response_formatted
    def manageable_apps(self):
        """Change apps manageability state
        """
        try:
            updated_apps = self.external_apps_service.set_manageable_state(request.json)
        except agent.ServerException as ex:
            raise HTTPError(400, str(ex))
        return eai_helpers.eai_result([app.json(View.RestView) for app in updated_apps], len(updated_apps))

    @eai_helpers.filtered
    @eai_helpers.paginated
    @access_control("/apps")
    @eai_helpers.response_formatted
    @eai_helpers.extract_name
    def read_apps(self, **kwargs):
        """
        Handles request for app list
        """
        with self.transaction_manager.transaction():
            if request.query.get("names_only"):
                entity_list, total = self.service.read_all_names(**kwargs)
            else:
                entity_list, total = self.service.read_all_with_total(**kwargs)

            for entity in entity_list:
                messages = self.service.describe_app(entity)
                entity.set_value("messages", messages)
                entity.set_default_values()  # Add any missing defaults to return a FULL app entity

            json_list = [x.json(View.RestView) for x in entity_list]
            return json_list, total

    @deployment_app
    @json_validate_request({
        "type": "object",
        "properties": {
            "appId": {"type": "string"},
            "uid": {"type": "number"},
            "auth": {"type": "string"},
            "appVersion": {"type": ["string", "null"]},
            "inputGroupMapping": {
                "type": ["object", "null"],
                "repeat": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            },
            "disableAutomaticResolution": {"type": "boolean"},
            "installDependencies": {"type": "boolean"}
        },
        "required": ["appId", "auth"],
        "additionalProperties": False
    })
    def install_deployment_app(self):
        """Download an app from splunkbase, install and deploy it immediately
        """
        return self._install_deployment_app_internal(
            app={"id": request.json["appId"]},
            options={"auth": request.json.get("auth"),
                     "mappings": request.json.get("inputGroupMapping", None),
                     "disableAutomaticResolution": request.json.get("disableAutomaticResolution", False),
                     "installDependencies": request.json.get("installDependencies", False),
                     "appVersion": request.json.get("appVersion", None)},
            update=False)

    @deployment_app
    @must_exist
    @reject_external
    @json_validate_request({
        "type": "object",
        "properties": {
            "uid": {"type": "number"},
            "auth": {"type": "string"},
            "disableAutomaticResolution": {"type": "boolean"},
            "installDependencies": {"type": "boolean"},
            "appVersion": {"type": ["string", "null"]}
        },
        "required": ["auth"],
        "additionalProperties": False
    })
    def update_deployment_app(self, name):
        """Update an app from splunkbase, install and deploy it immediately
        """
        return self._install_deployment_app_internal(
            app={"id": name},
            options={"auth": request.json.get("auth"),
                     "mappings": request.json.get("inputGroupMapping", None),
                     "disableAutomaticResolution": request.json.get("disableAutomaticResolution", False),
                     "installDependencies": request.json.get("installDependencies", False),
                     "appVersion": request.json.get("appVersion", None)},
            update=True)

    def _install_deployment_app_internal(self, app, options, update):
        """Actual install or update deployment app
        :param app: app properties: name (appId)
        :param options: additional installation options (auth token, disableAutomaticResolution and
                        installDependencies)
        :param update: True if updating an app
        :return: deployment task or error message
        """
        error_message_prefix = "Application cannot be installed"
        with deployment_scope(self.deploy_service, self.external_apps_service, error_message_prefix):
            try:
                payload = self.service.update_deployment_app(app, options) if update else \
                    self.service.install_deployment_app(app, options)

                if isinstance(payload, dict):
                    return payload

                # deploy changes
                deploy_task = self.deploy_service.deploy()
                return eai_helpers.eai_result([deploy_task.json(View.RestView)], 1)

            except agent.ServerException as ex:
                raise HTTPError(400, str(ex))

            except agent.splunklib.binding.HTTPError as ex:
                # cast splunklib.binding.HTTPError to bottle.HTTPError
                raise HTTPError(ex.status, ex.reason)

    @deployment_app
    @must_exist
    @reject_external
    def uninstall_deployment_app(self, name):
        # prevent race condition with apps install/deploy
        error_message_prefix = "Application cannot be uninstalled"
        with deployment_scope(self.deploy_service, self.external_apps_service, error_message_prefix):
            try:
                # delete app
                payload = self.service.delete_installed_app(name=name, check_payload=True,
                                                            delete_package=self._is_delete_package())
                if isinstance(payload, dict):
                    return payload
            except agent.ServerException as ex:
                raise HTTPError(400, str(ex))
            # deploy changes
            deploy_task = self.deploy_service.deploy()
            return eai_helpers.eai_result([deploy_task.json(View.RestView)], 1)

    @deployment_app
    @must_exist
    def enable_deployment_app(self, name):
        """Enable an app and deploy changes immediately
        :param name: app name
        """
        return self._change_app_state(name, enable=True)

    @deployment_app
    @must_exist
    def disable_deployment_app(self, name):
        """Disable an app and deploy changes immediately
        :param name: app name
        """
        return self._change_app_state(name, enable=False)

    def _is_delete_package(self):
        """Check if the request parameter has delete_package
        """
        delete_package = request.query.get("delete_package")
        if delete_package == 'true':
            return True
        return False

    def _change_app_state(self, name, enable):
        """Change application state and trigger deployment
        """
        error_message_prefix = "Application state cannot be changed"
        with deployment_scope(self.deploy_service, self.external_apps_service, error_message_prefix):
            try:
                self.service.change_app_state(name, enable)
            except agent.ServerException as ex:
                raise HTTPError(400, str(ex))

            # deploy changes
            deploy_task = self.deploy_service.deploy()
            return eai_helpers.eai_result([deploy_task.json(View.RestView)], 1)

    def download_app(self, name):
        """
        Download application as tar.gz, or a specific workload.
        """
        archivetype = request.query.get("type")

        # We do not support downloading external app packages
        if self.service.external(name):
            msg = "Operation not permitted on external app '%s'" % name
            return bottle.HTTPResponse(body=msg, status=403)

        # We only support downloading the forwarder package type, if a type is specified
        if archivetype and archivetype != group_helpers.builtin_name.forwarders:
            msg = "Downloading package type %s is not supported." % archivetype
            return bottle.HTTPResponse(body=msg, status=500)

        # pylint: disable=bare-except
        try:
            archivefile = tempfile.TemporaryFile()
            if archivetype == group_helpers.builtin_name.forwarders:
                archivefilename = "%s-forwarder.tar.gz" % name
                versionname = '%s-%s' % (name, self.service.version(name))
                self.slim_service.copy_app_archive(versionname, archivefile, archivetype)
            else:
                archivefilename = "%s.tar.gz" % name
                self.service.create_app_archive(name, archivefile)
            archivefile.flush()
            headers = {
                "Content-Length": archivefile.tell(),
                "Content-Type": "application/x-gzip",
                "Content-Disposition": "attachment; filename=\"%s\"" % archivefilename
            }
            archivefile.seek(0)
            return bottle.HTTPResponse(body=archivefile, status=200, **headers)
        except agent.NotFoundException:
            return bottle.HTTPResponse(status=404)
        except:  # noqa: E722
            _logger.warning(traceback.format_exc())
            return bottle.HTTPResponse(status=500)
        # pylint: enable=bare-except

    @access_control("/apps")
    def delete_app_from_installation_graph(self, name):
        try:
            payload = self.slim_service.uninstall_app(name)
            if payload["status"] != SlimStatus.STATUS_OK:
                _logger.error("Failed to remove %s app from Installation graph", name)
        except agent.ServerException as ex:
            raise HTTPError(400, str(ex))
        graph_obj = self.graph_repository.get_current()
        return graph_obj.json(View.RestView)

    @access_control("/apps")
    def get_installation_graph(self):
        """
        Handles request for installation graph. By default the latest graph will be returned, even if it is staged.
        Otherwise if committed=true then the current committed state will be returned.
        """
        try:
            if request.query.get("committed"):
                graph_obj = self.graph_repository.get_committed()
            elif request.query.get("version"):
                version = int(request.query.get("version"))
                graph_obj = self.graph_repository.find_version(version)
            else:
                graph_obj = self.graph_repository.get_current()
        except agent.NotFoundException as ex:
            raise HTTPError(400, str(ex))

        return graph_obj.json(View.RestView)

    @deployment_app
    @json_validate_request({
        "type": "object",
        "properties": {
            "name": {"type": "string"},
            "template": {"type": "string"},
            "version": {"type": "string"},
            "label": {"type": "string"},
            "author": {"type": "string"},
            "description": {"type": "string"},
            "visible": {"type": "boolean"},
            "configured": {"type": "boolean"}
        },
        "required": ["name", "template", "version"],
        "additionalProperties": False
    })
    def create_app_from_template(self):
        """Create a new app from a template
        """

        with deployment_scope(self.deploy_service, self.external_apps_service, "Application cannot be created"):
            self.service.create_app_from_template(request.json)

            # deploy changes
            return eai_helpers.eai_result([self.deploy_service.deploy().json(View.RestView)], 1)

    def exists(self, name):
        """Return whether or not the app exists
        """
        return self.service.exists(name)

    def external(self, name):
        """
        Return whether or not the app is external
        """
        return self.service.external(name)
