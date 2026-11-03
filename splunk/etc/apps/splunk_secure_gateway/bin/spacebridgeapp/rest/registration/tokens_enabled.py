"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

REST endpoint handler for checking if tokens are enabled
"""

import os
import sys

from splunk.persistconn.application import PersistentServerConnectionApplication
from splunk.clilib.bundle_paths import make_splunkhome_path

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

from http import HTTPStatus
from spacebridgeapp.rest.base_endpoint import BaseRestHandler
from spacebridgeapp.rest.services.splunk_service import get_tokens_enabled

sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))
sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))


class TokensEnabledHandler(BaseRestHandler, PersistentServerConnectionApplication):
    """
        Main class for handling REST tokens enabled endpoint. Subclasses the spacebridge_app
        BaseRestHandler. This multiple inheritance is an unfortunate neccesity based on the way
        Splunk searches for PersistentServerConnectionApplications
    """

    def __init__(self, command_line, command_arg):
        BaseRestHandler.__init__(self, logname="rest_subscription_handler")

    def get(self, request):
        system_authtoken = request['system_authtoken']
        tokens_enabled = get_tokens_enabled(self.log, system_authtoken)

        return {
            'payload': {
                'tokens_enabled': tokens_enabled
            },
            'status': HTTPStatus.OK
        }

