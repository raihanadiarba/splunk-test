"""
DMC endpoints for configuration UI
"""
# pylint: disable=comparison-with-callable, no-member, unsubscriptable-object

import copy
import json
from functools import wraps

import bottle
from bottle import request

from agent import ioc
from agent import NotFoundException, UniqueItemException, SchemaValidationException
from agent.restapi import eai_helpers
from agent.restapi.helpers import json_validate_request, deployment_scope
from agent.models import View
from agent.models.bundle import BundleType
from agent.common.access_control import Capability
from agent.restapi import access_control_helpers
from agent.services.stanzas_service import get_bundle_access_control_capability, ALL_BUNDLES_WILDCARD

_GROUP_EDIT_CAPABILITY = {
    "inputs": Capability.EDIT_INPUTS,
    "outputs": Capability.EDIT_OUTPUTS
}
_COMPONENT_EDIT_CAPABILITY = {
    "inputs:http": Capability.EDIT_INPUT_TOKEN_HTTP,
}
_COMPONENT_LIST_CAPABILITY = {
    # HTTP inputs need EDIT permissions for reading
    "inputs:http": Capability.EDIT_INPUT_TOKEN_HTTP,
}


def _get_component_edit_capability(group, component):
    """
    getter for edit capability
    """
    return _COMPONENT_EDIT_CAPABILITY.get("%s:%s" % (group, component))


def _get_component_list_capability(group, component):
    """
    getter for list capability
    """
    return _COMPONENT_LIST_CAPABILITY.get("%s:%s" % (group, component))


def _response_decorator(func):
    """A wrapper for service errors
    """

    @wraps(func)
    @eai_helpers.response_formatted
    def wrapper(service, **kwargs):
        """Wrap request handler exceptions
        """
        try:
            entries, total = func(service, **kwargs)
            view = list(entry.json(View.RestView) for entry in entries)
            return eai_helpers.eai_result(view, total)
        except UniqueItemException as ex:
            raise bottle.HTTPError(409, str(ex))
        except NotFoundException as ex:
            raise bottle.HTTPError(404, str(ex))
        except NotImplementedError as ex:
            raise bottle.HTTPError(400, str(ex))
        except SchemaValidationException as ex:
            raise bottle.HTTPError(400, str(ex))
        except TypeError as ex:
            raise bottle.HTTPError(400, str(ex))
        except ValueError as ex:
            raise bottle.HTTPError(400, str(ex))
    return wrapper


def _get_insufficient_capabilities(group, bundle, component):
    """Get access capabilities required to change group, bundle and component
    """
    if not _GROUP_EDIT_CAPABILITY.get(group):
        raise bottle.HTTPError(404, "Configuration group %s not found" % group)

    if not _get_component_edit_capability(group, component):
        raise bottle.HTTPError(404, "Configuration component %s not found" % component)

    required = [
        _GROUP_EDIT_CAPABILITY.get(group),
        _get_component_edit_capability(group, component),
        # required for editing deploy queue
        Capability.EDIT_DEPLOY_QUEUE
    ]

    get_capability = _get_component_list_capability(group, component)
    if get_capability and get_capability not in required:
        required.append(get_capability)

    # bundle access capability
    bundle_access_capability = get_bundle_access_control_capability(
        "edit", bundle, Capability.DMC_ACCESS_CAPABILITY_FORMAT)
    if bundle_access_capability:
        required.append(bundle_access_capability)

    return access_control_helpers.match_access_capabilities(required)


def _show_create_link(group, bundle, component, insufficient_capabilities):
    """Decide whether to show create link.
    1. If bundle is specified (i.e., it isn't the wildcard "-") then create link is shown when all required
       capabilities are granted.
    2. If bundle is replaced by the wildcard then create link isn't shown when group edit capability is missing.
    3. "outputs" group require EDIT_FORWARDERS capability to show create link.
    4. "inputs" group needs at least one bundle edit capability to show create link.
    """
    show_link = False

    granted_capabilities = [Capability.parse(capability)
                            for capability in ioc.components.user_context().context["capabilities"]]

    if bundle != ALL_BUNDLES_WILDCARD:
        show_link = len(insufficient_capabilities) == 0
    elif (_GROUP_EDIT_CAPABILITY.get(group) not in granted_capabilities or
          _COMPONENT_EDIT_CAPABILITY.get("%s:%s" % (group, component)) not in granted_capabilities or
          Capability.EDIT_DEPLOY_QUEUE not in granted_capabilities):
        show_link = False
    elif group == "outputs":
        show_link = Capability.EDIT_FORWARDERS in granted_capabilities
    elif group == "inputs":
        show_link = (
            Capability.EDIT_APPS in granted_capabilities or
            Capability.EDIT_SERVERCLASSES in granted_capabilities or
            Capability.EDIT_FORWARDERS in granted_capabilities
        )
    else:
        assert False  # unknown group

    return show_link


def _hide_move_link(bundle_type):  # pragma: no cover
    """Special logic for the "move" link:
    1. If entry bundle is a node and all other bundles (app, sc, forwarders) aren't granted then there is no target
       bundle for the entry.
    2. Similarly if entry bundle is forwarders then "move" link is hidden when apps or sc capabilities aren't granted.
    """
    hide_link = False

    granted_capabilities = [Capability.parse(capability)
                            for capability in ioc.components.user_context().context["capabilities"]]

    if bundle_type == BundleType.node:
        hide_link = not (
            Capability.EDIT_APPS in granted_capabilities or
            Capability.EDIT_SERVERCLASSES in granted_capabilities or
            Capability.EDIT_FORWARDERS in granted_capabilities
        )
    elif bundle_type == BundleType.builtin:
        hide_link = not (
            Capability.EDIT_APPS in granted_capabilities or
            Capability.EDIT_SERVERCLASSES in granted_capabilities
        )

    return hide_link


def _access_control(func):
    """A custom access control decorator
    """

    @wraps(func)
    def wrapper(*args, **kwargs):
        """Request wrapper. POST/DELETE methods are controlled by dmc_edit_inputs/outputs and bundle access capability.
        GET method  filters out access denied links.
        """
        group = kwargs["group"].lower()
        bundle = kwargs["bundle"].lower()
        component = kwargs["component"].lower()

        insufficient_capabilities = _get_insufficient_capabilities(group, bundle, component)

        is_edit = request.method in ["POST", "DELETE"]

        if insufficient_capabilities:
            access_control_helpers.raise_access_denied_error(insufficient_capabilities)

        reply = func(*args, **kwargs)

        if not is_edit:  # get operation - update links
            service_path = "/services/dmc/config/%s/%s/%s" % (group, bundle, component)

            # add create link if access is allowed
            reply.setdefault("links", {})
            if _show_create_link(group, bundle, component, insufficient_capabilities):
                reply["links"] = {
                    "create": service_path
                }

        # enumerate all entries and remove "edit like" capabilities
        # Should happen irrespective of GET/POST/DELETE
        for entry in reply.get("entry") or []:
            links = entry.get("links", {})
            if links and _get_insufficient_capabilities(group, entry["acl"]["app"], component):
                for key in ["delete", "reset", "enable", "disable", "edit"]:
                    if key in links:
                        del links[key]
            # Stopgap measures. For this release we do not want to display move/revert functionality
            # However, these will be required for sourcetypes and indexes
            if links:
                for key in ["move", "revert"]:
                    if key in links:
                        del links[key]

        return reply

    return wrapper


def _single_step_action(action=None):
    """
    Decorate endpoint function which makes changes and the changes need to be deployed.
    :param action: <String> Will be printed in the error message if cannot be deployed.
    :return:
    """
    def decorator(func):
        """decorator wrapper
        """
        @wraps(func)
        def wrapper(*args, **kwargs):
            """
                Acquires deployment scope lock, services the config, calls deploy and
                appends the @taskid to the response
            """
            config_deploy_service = ioc.services.deploy_service()
            external_apps_service = ioc.services.external_apps_service()
            with deployment_scope(config_deploy_service, external_apps_service, 'Configuration cannot be %s' % action):
                reply = func(*args, **kwargs)
                deploy_task = config_deploy_service.deploy()
                reply["@taskId"] = deploy_task.taskid
                return reply

        return wrapper
    return decorator


# pylint: disable=too-few-public-methods
class ConfigurationEntryEndpoints(ioc.Component):
    """Configuration endpoints
    Handles:
        GET /config/<group>/<bundle>/<component>
        POST /config/<group>/<bundle>/<component>
        POST /config/<group>/<bundle>/<component>/<name>
        POST /config/<group>/<bundle>/<component>/<name>/enable
        POST /config/<group>/<bundle>/<component>/<name>/disable
        DELETE /config/<group>/<bundle>/<component>/<name>
    """

    def __init__(self):
        self._init_services()

        # setup routes
        # global input component configuration
        bottle.get("/config/<group>/<bundle>/<component>")(self._list)
        bottle.get("/config/<group>/<bundle>/<component>/_new")(self._new)

        # single item configuration
        bottle.post("/config/<group>/<bundle>/<component>")(self._create)
        bottle.post("/config/<group>/<bundle>/<component>/<name:encoded>")(self._edit)
        bottle.post("/config/<group>/<bundle>/<component>/<name:encoded>/enable")(self._enable)
        bottle.post("/config/<group>/<bundle>/<component>/<name:encoded>/disable")(self._disable)
        bottle.delete("/config/<group>/<bundle>/<component>/<name:encoded>")(self._delete)
        bottle.get("/config/<group>/<bundle>/<component>/<name:encoded>")(self._get)

    def _init_services(self):
        """Init services for configuration groups
        """

        self._services = {}

        def add_service(name):
            """Add service to the services dictionary"""
            service = ioc.RequiredFeature("services/" + name).result
            self._services[service.group()] = service

        for service_name in ["InputsConfigurationService", "OutputsConfigurationService"]:
            add_service(service_name)

    @_access_control
    @_single_step_action("created")
    @_response_decorator
    def _create(self, group, component, bundle):
        """Create a new item
        """
        name = request.json.get("name")
        content = copy.deepcopy(request.json)
        del content["name"]
        return self._service(group).create(component, bundle, name, content)

    @_access_control
    @_single_step_action("edited")
    @_response_decorator
    def _edit(self, group, component, bundle, name):
        """Edit an item
        """
        return self._service(group).edit(component, bundle, name, request.json)

    @_access_control
    @_single_step_action("enabled")
    @_response_decorator
    def _enable(self, group, component, bundle, name):
        """Enable an item
        """
        return self._service(group).enable(component, bundle, name)

    @_access_control
    @_single_step_action("disabled")
    @_response_decorator
    def _disable(self, group, component, bundle, name):
        """Disable an item
        """
        return self._service(group).disable(component, bundle, name)

    @_access_control
    @_single_step_action("enabled")
    @_response_decorator
    def _enable_global(self, group, component, bundle):
        """Enable on global stanza level
        """
        return self._service(group).enable(component, bundle, None)

    @_access_control
    @_single_step_action("disabled")
    @_response_decorator
    def _disable_global(self, group, component, bundle):
        """Disable on global stanza level
        """
        return self._service(group).disable(component, bundle, None)

    @_access_control
    @_single_step_action("deleted")
    @_response_decorator
    def _delete(self, group, component, bundle, name):
        """Delete an item
        """
        return self._service(group).delete(component, bundle, name)

    @_access_control
    @eai_helpers.paginated
    @_response_decorator
    def _list(self, group, component, bundle, **paging):
        """List items
        """
        query = None
        json_query = request.params.get("query")
        if json_query:
            query = json.loads(json_query)
        return self._service(group).list(component, bundle, query=query, **paging)

    @_access_control
    @_response_decorator
    def _get(self, group, component, bundle, name):
        """Get an item
        """
        return self._service(group).get(component, bundle, name)

    @_access_control
    @_single_step_action("moved")
    @_response_decorator
    @json_validate_request(schema={
        "type": "object",
        "properties": {"bundle": {"type": "string"}},
        "required": ["bundle"]
    })
    def _move(self, group, component, bundle, name):
        """Move an item to the target bundle
        """
        destination_bundle = request.json["bundle"]

        # check destination bundle access control
        dest_insufficient_capabilities = _get_insufficient_capabilities(group, destination_bundle, component)
        if dest_insufficient_capabilities:
            access_control_helpers.raise_access_denied_error(dest_insufficient_capabilities)

        return self._service(group).move(component, bundle, name, destination_bundle)

    @_access_control
    @_single_step_action("reverted")
    @_response_decorator
    def _revert(self, group, component, bundle, name):
        """Revert an item to the default settings
        """
        return self._service(group).revert(component, bundle, name)

    @eai_helpers.paginated
    @eai_helpers.response_formatted
    def _summary(self, bundle, **paging):
        """Summary information for conf entries
        """
        return self._service("inputs").summary(bundle, **paging)

    @eai_helpers.paginated
    @eai_helpers.response_formatted
    def _summary_all(self, **paging):
        """Summary information for all conf entries
        """
        return self._service("inputs").summary(**paging)

    @_access_control
    @eai_helpers.response_formatted
    def _new(self, group, component, bundle):
        """Get component info
        """
        return self._service(group).component_info(component, bundle)

    def _service(self, group):
        """Get group service
        """
        service = self._services.get(group)
        if service is None:
            raise NotFoundException(fmt="Unsupported group %s" % group)
        return service
