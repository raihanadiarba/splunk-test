"""
Plugin for bottle
"""

import logging

import bottle

import agent
from agent import ioc


# pylint: disable=too-few-public-methods
class AuthPlugin(agent.ioc.Component):

    """BottlePy Auth Plugin based on Tokens

    This plugin expects to see a Header
    Authorization: TOKEN
    """

    name = "auth_plugin"
    api = 2

    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)
        self.splunk_host = ioc.components.splunk_host()

    def apply(self, callback, context):
        """Replaces registered callback with wrapper

        Wrapper just verifies existance of Authorization header and its value.
        """

        assert context or not context  # (void)context

        def wrapper(*args, **kwargs):
            """Wrapper
            """
            authvalue = bottle.request.get_header("Authorization")
            if authvalue != self.splunk_host.token:
                self._logger.warning("Authorization header does not match")
                raise bottle.HTTPError(401)
            return callback(*args, **kwargs)

        return wrapper
# pylint: enable=too-few-public-methods
