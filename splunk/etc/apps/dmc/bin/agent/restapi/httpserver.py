"""
HTTP Server
"""
# pylint: disable=import-outside-toplevel

import logging
import json

import bottle

from agent.restapi import url_helpers
from agent import ioc


class DMCCherryPyServer(bottle.ServerAdapter):
    """
    Copy pasted CherryPy server adapter which gives us access to the server
    """

    server = None

    def run(self, handler):
        assert not DMCCherryPyServer.server
        from cheroot.wsgi import Server as WSGIServer
        from cheroot.ssl.builtin import BuiltinSSLAdapter

        self.options['bind_addr'] = (self.host, self.port)
        self.options['wsgi_app'] = handler

        certfile = self.options.get('certfile', None)
        if certfile:
            del self.options['certfile']
        keyfile = self.options.get('keyfile', None)
        if keyfile:
            del self.options['keyfile']

        DMCCherryPyServer.server = WSGIServer(**self.options)
        if certfile or keyfile:
            ssl_adapter = BuiltinSSLAdapter(certificate=certfile, private_key=keyfile)
            DMCCherryPyServer.server.ssl_adapter = ssl_adapter

        try:
            DMCCherryPyServer.server.start()
        finally:
            if DMCCherryPyServer.server.socket:
                DMCCherryPyServer.server.stop()


class Server(ioc.Component):

    """Http Server
    """

    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)
        self.auth_plugin = ioc.restapi.auth_plugin()
        self.json_request_plugin = ioc.restapi.json_request_plugin()
        self.json_response_plugin = ioc.restapi.json_response_plugin()
        self.logging_plugin = ioc.restapi.logging_plugin()
        self.meta_plugin = ioc.restapi.meta_plugin()
        self.splunkd_endpoint = ioc.restapi.splunkd_endpoint()
        self.splunk_host = ioc.components.splunk_host()
        self._endpoints = []
        self._terminated = False

    def start(self):
        """Start HTTP Server
        """
        dmc_conf = self.splunk_host.get_dmc_settings()

        bind_ip = dmc_conf["bindAddress"]
        port = dmc_conf["port"]

        # TODO: Make it configurable
        bottle.debug(True)

        @bottle.hook('before_request')
        def strip_path():
            """Strip path
            Hook to allow using both urls /test and /test/
            """
            bottle.request.environ['PATH_INFO'] = \
                bottle.request.environ['PATH_INFO'].rstrip('/')

        assert strip_path

        # The order of installed plugins is significant, keep logging and then
        # json first
        bottle.install(self.logging_plugin)
        bottle.install(self.json_request_plugin)
        bottle.install(self.json_response_plugin)
        bottle.install(self.auth_plugin)
        bottle.install(self.meta_plugin)

        bottle.default_app().router.add_filter(
            'encoded',
            url_helpers.decode)

        self._endpoints = [
            self.splunkd_endpoint,
            ioc.restapi.tasks_endpoint(),
            ioc.restapi.apps_endpoint(),
            ioc.restapi.topologies_endpoint(),
            ioc.restapi.deploy_endpoint(),
            ioc.restapi.changelog_endpoint(),
            ioc.restapi.forwarder_setup_endpoint(),
            ioc.restapi.configuration_entry_endpoints(),
            ioc.restapi.info_endpoint(),
            ioc.restapi.audit_endpoint(),
            ioc.restapi.packages_endpoint()
        ]

        for endpoint in self._endpoints:
            # IoC typed feature has resolve() method which pylint can't infer
            # pylint: disable=no-member
            endpoint.resolve()
            # pylint: enable=no-member

        # Included as it is there in EAI
        bottle.route(
            "/<path:path>",
            method=['OPTIONS'],
            skip=[self.auth_plugin])(
                lambda path: None)

        # TODO: defailt bottle server is non-threading HTTP server, which
        #       can be replaced with paste or cherrypy
        # pylint: disable=bare-except
        try:
            bottle.run(host=bind_ip, port=port, quiet=True, server=DMCCherryPyServer)
        except:  # noqa: E722
            if not self._terminated:
                raise
        # pylint: enable=bare-except

    def stop(self):
        """Stop Http Server
        """
        self._terminated = True
        DMCCherryPyServer.server.stop()

    @staticmethod
    @bottle.error(404)
    @bottle.error(405)
    def _error(error):
        """Override the default bottle error handler by a custom one
        """
        error_data = {
            "error": {
                "message": error.body,
                "status": error.status_code
            }
        }
        bottle.response.content_type = "application/json"
        return json.dumps(error_data)
