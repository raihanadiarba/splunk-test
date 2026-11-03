"""
JSON Plugin
"""

import datetime
import logging
from calendar import month_abbr
import time

import splunk.util

import bottle

import agent.ioc


# pylint: disable=protected-access
def _access_time(req_time):
    """
    Provide a timezone-aware date string to go in the access log
    """
    now = datetime.datetime.fromtimestamp(req_time)
    month = month_abbr[now.month].capitalize()
    return ('[%02d/%s/%04d:%02d:%02d:%02d.%03d %s]' %
            (now.day, month, now.year, now.hour, now.minute, now.second,
             now.microsecond/1000,
             splunk.util.format_local_tzoffset(req_time)))


# pylint: disable=too-few-public-methods
class LoggingPlugin(agent.ioc.Component):

    """Logging Plugin

    Logs all requests to our configured log file
    """

    name = "logging_plugin"
    api = 2

    def __init__(self):
        self._access_logger = logging.getLogger("dmc_agent_access")

    def apply(self, callback, context):
        """Replaces registered callback with wrapper

        Wrapper calls callback and logs the request
        """

        assert context or not context  # (void)context

        # pylint: disable=logging-not-lazy
        def wrapper(*args, **kwargs):
            """
            Wrapper
            """
            request = bottle.request
            response = bottle.response
            start_time = time.time()
            actual_response = callback(*args, **kwargs)
            end_time = time.time()

            request_path = "%s%s" % (
                request.path,
                ("?%s" % request.query_string if request.query_string else ""))

            self._access_logger.info("%s - %s \"%s %s\" %s - %sms" % (
                request.remote_addr,
                _access_time(start_time),
                request.method,
                request_path,
                response.status_code,
                round((end_time - start_time)*1000)))

            return actual_response

        return wrapper
# pylint: enable=too-few-public-methods
