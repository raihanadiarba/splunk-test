"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

REST endpoint handler for fetching public and private keys necessary for signing cloud gateway messages
"""
import os
import logging
import sys
import json
from splunk.persistconn.application import PersistentServerConnectionApplication
from splunk.clilib.bundle_paths import make_splunkhome_path

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

from spacebridgeapp.rest.base_endpoint import BaseRestHandler
from spacebridgeapp.rest.services import splunk_service
from spacebridgeapp.util.constants import MTLS_KEY, MTLS_CERT, SYSTEM_AUTHTOKEN

sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))
sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))

_ALLOWED_SECRETS = [MTLS_KEY, MTLS_CERT]

class SecretsStore(BaseRestHandler, PersistentServerConnectionApplication):

    def __init__(self, command_line, command_arg):
        BaseRestHandler.__init__(self, logname="secrets_handler")

    def post(self, request):
        """
        Fetch public and private keys for signing messages from the passwords endpoint
        :param request:
        :return:
        """

        user_token = request['session']['authtoken']
        secret_name = request['path_info']
        secret_value = request['payload']

        if secret_name not in _ALLOWED_SECRETS:
            return _error(400, 'invalid secret_name, not in allowed values')

        self.log.debug('Received request for storing secrets %s', secret_name)
        return _store_secret(self.log, user_token, secret_name, secret_value)


def _error(status_code, message):
    return {
        'payload': {
            'result': 'error',
            'error': message
        },
        'status': status_code
    }


def _store_secret(log: logging.Logger, user_authtoken, secret_name, secret_value):
    splunk_service.update_or_create_sensitive_data(log, user_authtoken, secret_name, secret_value)

    return {
        'payload': {
            'result': 'ok'
        },
        'status': 200,
    }
