"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

REST endpoint handler for accessing and setting opt-in signals
"""
import os
import sys
import json
import splunk
from http import HTTPStatus

from splunk.persistconn.application import PersistentServerConnectionApplication
from splunk.clilib.bundle_paths import make_splunkhome_path

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

from spacebridgeapp.rest.base_endpoint import BaseRestHandler, build_error_payload
from spacebridgeapp.util.constants import SESSION, USER, PAYLOAD, STATUS, SYSTEM_AUTHTOKEN
from spacebridgeapp.metrics.metrics_collector import OptInPageMetric

sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))
sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))

class OptInMetrics(BaseRestHandler, PersistentServerConnectionApplication):
    """
    Main class for handling the opt_in endpoint. Subclasses the spacebridge_app
    BaseRestHandler.
    """

    def __init__(self, command_line, command_arg):
        BaseRestHandler.__init__(self, logname="opt_in_metrics_handler")


    def post(self, request):
        """
        Post call to opt-in metrics by type.
        :param request:
        :return:
        """
        try:
            # system_auth token required to add key in nobody namespace
            system_authtoken = request[SYSTEM_AUTHTOKEN]
            user = request[SESSION][USER]
            post_data = json.loads(request['payload'])
            option = post_data['option']
            metric = OptInPageMetric(system_authtoken, self.log, user, option)
            self.log.debug('opt_in_metrics=%s', metric)
            metric.send_to_telemetry()
            return {
                PAYLOAD: {},
                STATUS: HTTPStatus.OK
            }
        except splunk.RESTException as e:
            return build_error_payload(e)



