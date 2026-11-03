"""
JSON Plugin
"""

import json
import logging
import traceback

import bottle

import agent
import agent.ioc


# pylint: disable=too-few-public-methods
class JSONResponsePlugin(agent.ioc.Component):

    """JSON Plugin

    Fixes all return values and makes JSON:
        - Catches HTTPError and provide JSON response
        - Adds support for lists and tuples and sends them as arrays
    """

    name = "json_response_plugin"
    api = 2

    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)

    # pylint: disable=no-self-use
    def apply(self, callback, context):
        """Replaces registered callback with wrapper

        Wrapper calls callback and fixes return value.
        """

        assert context or not context  # (void)context

        def wrapper(*args, **kwargs):
            """
            Wrapper
            """
            bottle.response.content_type = "application/json"
            try:
                result = callback(*args, **kwargs)
            except bottle.HTTPError as ex:
                self._logger.warning(traceback.format_exc())
                bottle.response.status = ex.status_code
                message = ex.body if ex.body \
                    else bottle.HTTP_CODES[ex.status_code]
                result = {
                    "error": {
                        "status": ex.status_code,
                        "message": message
                    }
                }
            except agent.InvalidUserInputException as ex:
                self._logger.warning(traceback.format_exc())
                bottle.response.status = 400
                result = {
                    "error": {
                        "status": 400,
                        "message": str(ex)
                    }
                }
            except agent.ApiErrorException as ex:
                self._logger.warning(traceback.format_exc())
                bottle.response.status = 400
                result = {
                    "type": ex.type,
                    "payload": ex.payload
                }
            # pylint: disable=bare-except
            except:  # noqa: E722
                # pylint: enable=bare-except
                # In case of any unhandled errors - don't show trace, just standard error and log everything
                self._logger.error(traceback.format_exc())
                bottle.response.status = 500
                result = {
                    "error": {
                        "status": 500,
                        "message": "Internal error. Check server logs for details."
                    }
                }
            else:
                if isinstance(result, (list, tuple)):
                    result = json.dumps(result)
            return result

        return wrapper
    # pylint: enable=no-self-use
# pylint: enable=too-few-public-methods
