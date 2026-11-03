"""
JSON Plugin
"""

import logging

import bottle

import agent.ioc


# pylint: disable=too-few-public-methods
class JSONRequestPlugin(agent.ioc.Component):

    """JSON Plugin

    Fixes all return values and makes JSON:
        - Catches HTTPError and provide JSON response
        - Adds support for lists and tuples and sends them as arrays
    """

    name = "json_request_plugin"
    api = 2

    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)

    def apply(self, callback, context):
        """Replaces registered callback with wrapper

        Wrapper calls callback and fixes return value.
        """

        assert context or not context  # (void)context

        def wrapper(*args, **kwargs):
            """
            Wrapper
            """
            if bottle.request.method == "POST" \
                    and "application/json" not in bottle.request.content_type:
                err_msg = "\"Content-Type: application/json\" is expected"
                self._logger.warning(err_msg)
                raise bottle.HTTPError(400, err_msg)
            return callback(*args, **kwargs)

        return wrapper
# pylint: enable=too-few-public-methods
