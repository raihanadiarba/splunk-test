"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

REST endpoint handler for enabling splunk tokens
"""

import os
import sys
import splunk
import json

from splunk.persistconn.application import PersistentServerConnectionApplication
from splunk.clilib.bundle_paths import make_splunkhome_path

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

from http import HTTPStatus
from spacebridgeapp.rest.base_endpoint import BaseRestHandler, build_error_payload
from spacebridgeapp.rest.util.helper import extract_parameter
from spacebridgeapp.util.constants import STATUS, PAYLOAD, SESSION, AUTHTOKEN, BODY, MESSAGE
from spacebridgeapp.rest.services.splunk_service import enable_splunk_tokens

sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))
sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))

class EnableTokensHandler(BaseRestHandler, PersistentServerConnectionApplication):
    """
        Main class for handling REST enabling tokens endpoint. Subclasses the spacebridge_app
        BaseRestHandler. This multiple inheritance is an unfortunate neccesity based on the way
        Splunk searches for PersistentServerConnectionApplications
    """

    def __init__(self, command_line, command_arg):
        BaseRestHandler.__init__(self, logname="enable_tokens")


    def post(self, request):
        """
          This will return a string if tokens were enabled or disabled

          :param request
          :return:
        """
        try:
            session_token = request[SESSION][AUTHTOKEN]
            body = json.loads(request[PAYLOAD])
            value = extract_parameter(body, "enabled", BODY)

            if not isinstance(value, bool):
                return {STATUS: HTTPStatus.BAD_REQUEST,
                        PAYLOAD: {MESSAGE: "INVALID PARAMETER: ENABLED"}}

            """
                Value is a boolean flag for enable/disable splunk tokens where enable = True and disable = False
                Splunk rest end point for enable/disable tokens accepts disabled arg where
                disabled = False means tokens are enabled and vice versa.
                To accommodate this, we flip the value boolean flag using not before making the splunk rest call
            """
            enable_tokens = enable_splunk_tokens(self.log, session_token, value=(not value))

            return {STATUS: HTTPStatus.OK,
                    PAYLOAD: {'tokens_enabled': (not enable_tokens)}}
        except splunk.RESTException as e:
            return build_error_payload(e)

