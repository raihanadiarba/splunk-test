"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Hosts APIs for CRUD operations on telemetry
"""
import os
import sys
import json
from http import HTTPStatus

from splunk.persistconn.application import PersistentServerConnectionApplication
from splunk.clilib.bundle_paths import make_splunkhome_path

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

from spacebridgeapp.rest.base_endpoint import BaseRestHandler
from spacebridgeapp.util.constants import PAYLOAD, STATUS, SESSION, AUTHTOKEN
from spacebridgeapp.metrics.telemetry_client import post_event
from spacebridgeapp.request.splunk_auth_header import SplunkAuthHeader

sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))
sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))

EVENTS = "events"


class UITelemetry(BaseRestHandler, PersistentServerConnectionApplication):

    def __init__(self, command_line, command_arg):
        BaseRestHandler.__init__(self, logname="rest_ui_telemetry")

    def post(self, request):
        session_token = request[SESSION][AUTHTOKEN]
        auth_header = SplunkAuthHeader(session_token)

        body = json.loads(request[PAYLOAD])
        for event in body[EVENTS]:
            try:
                post_event(self.log, event, session_token)
            except Exception:
                self.log.warn("Storing UI Telemetry Event Failed")

        return {
            PAYLOAD: "All telemetry events stored",
            STATUS: HTTPStatus.OK
        }
