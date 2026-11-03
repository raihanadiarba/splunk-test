"""
Module which defined topology endpoint
"""

import logging
import traceback
import re

import bottle
from bottle import HTTPError, request

import agent
from agent import ioc
from agent.restapi import eai_helpers, helpers
from agent.models import View
from agent.common.access_control import Capability
from agent.restapi.access_control_helpers import require_capability_format


def _cluster_item_capability(item_type, required):
    """Special validation for cluster items. Access capabilities has to be validated only after checking an item type,
    otherwise the system can validate capability of an item that has wrong type.
    """
    def check_item(json):
        """Capability checking callback
        """
        if json.get("type") == item_type:
            require_capability_format(required)(json)
        return True

    return check_item


# validate if all characters are "*"
SECURITY_KEY_REGEX = re.compile(r"^(\*)\1*$")


def _is_security_key_valid(data):
    """Validate the security key
    """
    for field in data:
        # Validate secret field in first level field values, such as values
        # of DeploymentServer and SHCDeployer
        value = data[field]
        secret = value.get("secret")
        if secret:
            return not bool(SECURITY_KEY_REGEX.match(secret))
    return True


TOPOLOGY_JSON_SCHEMA = {
    "type": "object",
    "properties": {
        "deploymentServer": {
            "type": "object",
            "format": require_capability_format(Capability.EDIT_FORWARDER_SETUP, Capability.MANAGE_TOPOLOGY),
            "properties": {
                "requireAuthentication": {
                    "type": "boolean",
                    "format": require_capability_format(Capability.EDIT_REQUIRE_AUTHENTICATION)
                },
                "secret": {"type": "string", "minLength": 1}
            },
            "additionalProperties": False
        },
        "SHCDeployer": {
            "type": "object",
            "format": require_capability_format(Capability.MANAGE_TOPOLOGY),
            "properties": {
                "targets": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties":
                        {
                            "mgmtUri": {"type": "string"},
                        },
                        "required": ["mgmtUri"],
                        "additionalProperties": False
                    }
                },
                "secret": {"type": "string", "minLength": 1}
            },
            "required": ["targets", "secret"],
            "additionalProperties": False
        },
        "IDXCMaster": {
            "type": "object",
            "format": require_capability_format(Capability.EDIT_IDXC_MASTER),
            "properties": {
                "mgmtUri": {"type": "string"},
                "secret": {"type": "string", "minLength": 1}
            },
            "additionalProperties": False
        },
        "searchHead": {
            "type": "object",
            "format": require_capability_format(Capability.MANAGE_TOPOLOGY),
            "properties": {
                "mgmtUri": {"type": "string"},
                "secret": {"type": "string", "minLength": 1}
            },
            "required": ["mgmtUri", "secret"],
            "additionalProperties": False
        },
        "bootstrap": {
            "type": "boolean",
            "format": require_capability_format(Capability.EDIT_FORWARDER_SETUP)
        },
        "interactive": {"type": "boolean"}
    },
    "additionalProperties": False
}


class TopologiesEndpoint(ioc.Component):
    """Topologies endpoint

    Handles:
        GET /topologies/{id}
        POST /topologies/{id}
    """

    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)
        self._service = ioc.services.topologies_service()

        bottle.get("/topologies")(self.get_all_topologies)
        bottle.post("/topologies")(self.create_or_update_topology)
        bottle.get("/topologies/<topologyid>")(self.get_topology)
        bottle.post("/topologies/<topologyid>")(self.update_topology)

    @eai_helpers.response_formatted
    @eai_helpers.make_name('topologyId')
    def get_topology(self, topologyid):
        """Get topology by id
        """
        try:
            data = self._service.get(topologyid).json(View.RestView)
            return eai_helpers.eai_result([data], 1)
        except agent.NotFoundException as exp:
            self._logger.warning(exp)
            raise HTTPError(404, str(exp))

    @eai_helpers.response_formatted
    @eai_helpers.make_name('topologyId')
    def get_all_topologies(self):
        """Get all registered topologies
        """
        data = list(x.json(View.RestView) for x in self._service.get_all())
        return eai_helpers.eai_result(data, len(data))

    @eai_helpers.response_formatted
    @eai_helpers.make_name('topologyId')
    @helpers.json_validate_request(TOPOLOGY_JSON_SCHEMA)
    def create_or_update_topology(self):
        """Add new topology if it does not exist else update the topology
        """
        try:
            body = request.json
            topology = self._service.create_or_update(body)
            data = topology.json(View.RestView)
            return eai_helpers.eai_result([data], 1)
        except agent.WorkflowException as exp:
            self._logger.warning(traceback.format_exc())
            raise HTTPError(400, str(exp))
        except agent.SchemaValidationException as exp:
            self._logger.warning(traceback.format_exc())
            raise HTTPError(400, str(exp))
        except agent.NotFoundException as exp:
            self._logger.warning(exp)
            raise HTTPError(400, str(exp))

    @eai_helpers.response_formatted
    @eai_helpers.make_name('topologyId')
    @helpers.json_validate_request(TOPOLOGY_JSON_SCHEMA)
    def update_topology(self, topologyid):
        """Update topology
        """
        assert topologyid

        try:
            body = request.json
            if not _is_security_key_valid(body):
                raise HTTPError(400, "Invalid security key")
            topology = self._service.update(topologyid, body)
            data = topology.json(View.RestView)
            return eai_helpers.eai_result([data], 1)
        except agent.WorkflowException as exp:
            self._logger.warning(traceback.format_exc())
            raise HTTPError(400, str(exp))
