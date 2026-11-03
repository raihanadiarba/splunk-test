"""
    Forwarder setup helper endpoint
"""

import logging
from functools import wraps

import bottle
from bottle import HTTPError

import agent
from agent import ioc
from agent.restapi import eai_helpers
from agent.common.access_control import Capability
from agent.restapi import access_control_helpers


def response_decorator(component):
    """A wrapper for service errors and decorate output
    """

    def func_wrapper(func):
        """A wrapper for service errors
        """
        @wraps(func)
        @access_control_helpers.filtered(None, Capability.GET_FORWARDER_SETUP)
        @eai_helpers.response_formatted
        def wrapper(service, **kwargs):
            """Wrap service exceptions
            """
            try:
                return component, func(service, **kwargs)
            except agent.ServerException as exp:
                ForwarderSetupEndpoint.logger.warning(exp)
                raise HTTPError(500, str(exp))
        return wrapper

    return func_wrapper


class ForwarderSetupEndpoint(ioc.Component):
    """
        Forwarder setup endpoint
    """

    logger = logging.getLogger("ForwarderSetupEndpoint")

    def __init__(self):
        bottle.get("/forwardersetup")(self.forwarder_setup_info)
        self._forwardersetup_service = ioc.services.forwarder_setup_service()

    @response_decorator("forwarderSetup")
    def forwarder_setup_info(self):
        """
        Return the forwarder setup info
        """
        return self._forwardersetup_service.get_forwarder_setup_info()
