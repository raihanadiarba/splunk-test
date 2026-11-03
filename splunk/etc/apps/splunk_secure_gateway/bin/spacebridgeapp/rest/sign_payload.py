"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

REST endpoint handler for fetching public and private keys necessary for signing cloud gateway messages
"""
import os
import sys
import base64
from splunk.persistconn.application import PersistentServerConnectionApplication
from splunk.clilib.bundle_paths import make_splunkhome_path

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

from http import HTTPStatus
from spacebridgeapp.util import constants
from spacebridgeapp.rest.base_endpoint import BaseRestHandler
from spacebridgeapp.util.constants import SYSTEM_AUTHTOKEN
from cloudgateway.splunk.encryption import SplunkEncryptionContext
from cloudgateway.private.encryption.encryption_handler import sign_detached
from spacebridgeapp.rest.util import errors as Errors

sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))
sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))


class SignPayloadHandler(BaseRestHandler, PersistentServerConnectionApplication):
    """ Rest handler which accepts binary payload and returns signature for that payload using SSG sign private key """

    encryption_ctx = None

    def __init__(self, command_line, command_arg):
        BaseRestHandler.__init__(self, logname="sign_payload")


    def post(self, request):
        self.log.info(f'Received request to sign payload')
        payload = base64.b64decode(request[constants.PAYLOAD_B64])

        system_authtoken = request[SYSTEM_AUTHTOKEN]

        # fetch private keys lazily and cache them
        if not self.encryption_ctx:
            self.encryption_ctx = SplunkEncryptionContext(system_authtoken, constants.SPACEBRIDGE_APP_NAME)

        signature = sign_detached(self.encryption_ctx.sodium_client, self.encryption_ctx.sign_private_key(), payload)

        self.log.info('Successfully created signature. Returning response.')
        return {'binary': signature, 'status': 200}


