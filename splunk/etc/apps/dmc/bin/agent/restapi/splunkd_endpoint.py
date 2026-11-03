"""
Splunkd proxy endpoint
"""

import bottle
from bottle import request

from agent.splunklib.binding import HTTPError
from agent.common.access_control import Capability
from agent import ioc
from agent.restapi import JSONResponsePlugin, access_control_helpers
from agent.server_exceptions import UserContextMissingException


_DEPLOYMENT_SERVER_PATH = "deployment/server"
_ALLOWED_DEPLOYMENT_SERVER_PATH = "deployment/server/clients"


# pylint: disable=too-few-public-methods
class SplunkdEndpoint(ioc.Component):
    """Endpoint for proxy to splunkd REST API
    """

    def __init__(self):
        # This is only used by tag client preview UI. It should go away after we move that logic
        # from ds to dmc server
        # It should be replaced by filtering on '/instances'
        splunk_host = ioc.components.splunk_host()
        self._proxy_service = splunk_host.get_service(owner="nobody")
        bottle.get("/_splunkd/<path_segment:path>", skip=[JSONResponsePlugin.name])(
            self.get)

    def get(self, path_segment):
        """
        Proxy GET to Splunkd
        :param path_segment: relative path to splunkd services endpoint
        """

        self._require_deployment_server_access(path_segment)

        # '_' is used by browser to avoid web server caching.
        # It is not allowed by DS client handler (and many other Splunk handlers)
        # It is removed by splunkd UI proxy before sending the parsed http arguments to the handlers
        # however DMC proxy copies the entire URL segment from the original request.
        cache_bust = '_'
        if cache_bust in request.query:  # pylint: disable=unsupported-membership-test
            del request.query[cache_bust]  # pylint: disable=unsupported-delete-operation

        try:
            response = self._proxy_service.get(path_segment=path_segment,
                                               app="system", **request.query)  # pylint: disable=not-a-mapping
            return response.body
        except HTTPError as ex:
            # we are not using the jsonPulugin for this endpoint so manually setting the status and the
            # content type for the response. Returning the exception body as the UI can parse the splunkD
            # exception format.
            bottle.response.status = ex.status
            bottle.response.content_type = "application/json"
            return ex.body

    @staticmethod
    def _require_deployment_server_access(path_segment):
        required = [Capability.EDIT_SERVERCLASSES]
        if path_segment.startswith("/"):
            access_control_helpers.raise_access_denied_error(required)
        if path_segment != _DEPLOYMENT_SERVER_PATH and \
                not path_segment.startswith(_DEPLOYMENT_SERVER_PATH + "/"):
            return
        allowed_path = path_segment == _ALLOWED_DEPLOYMENT_SERVER_PATH or \
            path_segment.startswith(_ALLOWED_DEPLOYMENT_SERVER_PATH + "/")
        if not allowed_path:
            access_control_helpers.raise_access_denied_error(required)

        try:
            insufficient_capabilities = access_control_helpers.match_access_capabilities(required)
        except UserContextMissingException:
            insufficient_capabilities = required

        if insufficient_capabilities:
            access_control_helpers.raise_access_denied_error(insufficient_capabilities)
# pylint: enable=too-few-public-methods
