"""
Plugin for bottle
"""

import logging
import json

import bottle

import agent.ioc
_logger = logging.getLogger(__name__)


# pylint: disable=too-few-public-methods
class MetaPlugin(agent.ioc.Component):

    """BottlePy  Plugin to parse Splunk request meta data
    """

    name = "meta_plugin"
    api = 2

    def __init__(self):
        self._user_context = agent.ioc.components.user_context()

    def apply(self, callback, context):
        """Replaces registered callback with wrapper

        Wrapper just parses splunk header and save meta data into our own context object
        """

        assert self  # (void)self
        assert context or not context  # (void)context

        def wrapper(*args, **kwargs):
            """Wrapper
            """
            json_string = bottle.request.get_header("x-splunk-dmc-user-capabilities")

            if json_string:
                user_capabilities = json.loads(json_string)
            else:
                user_capabilities = None

            with self._user_context.scope(user_capabilities):
                return callback(*args, **kwargs)

        return wrapper

# pylint: enable=too-few-public-methods
