"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

REST endpoint handler for testing websocket connectivity
"""

import os
import sys
import json
from splunk.persistconn.application import PersistentServerConnectionApplication
from splunk.clilib.bundle_paths import make_splunkhome_path

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

import splunk.rest as rest
import requests
from cloudgateway import registration_v2, discovery
from cloudgateway.splunk.auth import SplunkJWTCredentials
from cloudgateway.splunk.encryption import SplunkEncryptionContext
from cloudgateway.encryption_context import EncryptionContext, generate_keys
from cloudgateway.device import DeviceInfo
from cloudgateway.private.registration.registration_utils import derive_auth_params
from cloudgateway.private.sodium_client.sharedlib_sodium_client import SodiumClient
from spacebridgeapp.util import constants
from spacebridgeapp.rest.base_endpoint import BaseRestHandler
from spacebridgeapp.rest.debug.e2e_test import wss
from spacebridgeapp.util.guid_generator import get_guid
from spacebridgeapp.rest.debug.util import create_splunk_resp

sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))
sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))

# Module level constants
CLIENT_VERSION = "1.0.0"
APP_ID = "com.splunk.mobile.Stargate"
DEFAULT_REQUEST_MODE = "clientSingleRequest"
DEFAULT_REQUEST_TYPE = "versionGetRequest"
TEST_DEVICE_NAME = "ssg_e2e_test"
AUTH_CODE_STATUS = 'auth_code_status'
SERVER_REGISTRATION_STATUS = 'server_registration_status'
COMPLETED_CLIENT_REGISTRATION = 'completed_client_registration'
WSS_RID = 'wss_rid'
WSS_RESPONSE = 'wss_response'
ERROR = 'error'

SSG_STATUS_DASHBOARD = "nobody/splunk_secure_gateway/secure_gateway_status_dashboard"
SSG_STATUS_VIZ_ID = "41cf0df3785e27534660e0cb5c55e55959f847d6563675484c99e3c348e84607/0/0"

REQUEST_TYPE_PAYLOADS = {
    "versionGetRequest": {"versionGetRequest": {}},
    "appListRequest": {"appListRequest": {}},
    "minimalDashboardListRequest": {"dashboardListRequest": {"minimalList": True}},
    "alertsListRequest": {"alertsListRequest": {}},
    "genericMessageRequest": {"genericMessage": {"namespace": "com.splunk.app.tv", "message": "hello world"}},
    "dashboardListRequest": {"dashboardListRequest": {"dashboardIds": [SSG_STATUS_DASHBOARD]}},
    "clientSubscribeRequest": {"clientSubscribeRequest": {"ttlSeconds": 120, "dashboardVisualizationSubscribe": {"dashboardVisualizationId": {"dashboardId": SSG_STATUS_DASHBOARD, "visualizationId": SSG_STATUS_VIZ_ID}}}},
}

VALID_REQUEST_MODES = {constants.CLIENT_SINGLE_REQUEST, constants.CLIENT_SUBSCRIPTION_MESSAGE}



def create_encryption_ctx():
    """Create new encryption context"""
    return EncryptionContext(generate_keys())

class TestWebsocketHandler(BaseRestHandler, PersistentServerConnectionApplication):
    def __init__(self, command_line, command_arg):
        BaseRestHandler.__init__(self, logname="e2e_wss_test")
        self.base_uri = rest.makeSplunkdUri()

    def get(self, request):
        """
        Perform a test registration and websocket message
        """
        self.log.info("Received request to run a test end-to-end request")

        response = {
            AUTH_CODE_STATUS: False,
            SERVER_REGISTRATION_STATUS: False,
            COMPLETED_CLIENT_REGISTRATION: False,
            WSS_RESPONSE: False,
            ERROR: False,
        }

        user_token = request['session']['authtoken']
        system_authtoken = request['system_authtoken']
        user = request['session']['user']

        try:
            ## Init by cleaning up test device if it wasn't cleaned up for whatever reason from last run
            self.delete_device(user, TEST_DEVICE_NAME, user_token)

            request_type_key = request['query']['request_type']
            request_type = REQUEST_TYPE_PAYLOADS.get(request_type_key)
            if request_type is None:
                response[ERROR] = f"Invalid request_type: {request_type_key!r}"
                return {'raw_payload': json.dumps(create_splunk_resp(response)), 'status': 400}

            request_mode = request['query']['request_mode']
            if request_mode not in VALID_REQUEST_MODES:
                response[ERROR] = f"Invalid request_mode: {request_mode!r}"
                return {'raw_payload': json.dumps(create_splunk_resp(response)), 'status': 400}

            credentials = SplunkJWTCredentials(user)
            credentials.create_jwt_token(system_authtoken, jwt_expiration="+1h")

            client_encryption_ctx = create_encryption_ctx()

            # Initiate client registration by sending auth_code to spacebridge
            self.log.info("Starting registration process by sending auth code")
            auth_code = registration_v2.start_registration(client_encryption_ctx,
                                                           environment_metadata=None,
                                                           jwt=credentials,
                                                           config=self.config)

            # Send hashcode to enable discovery
            self.log.info("Sending auth code hash to discovery, auth code: %s", auth_code)
            _, auth_id, _ = derive_auth_params(client_encryption_ctx, auth_code)
            hashed_auth = client_encryption_ctx.generichash_raw(auth_id)
            discovery.initiate_hashcode(hashed_auth, client_encryption_ctx, self.config)

            self.log.info("Check if splunk see registration request")
            r1 = requests.get(f"{self.base_uri}services/ssg/registration/query",
                              params={"auth_code": auth_code, "device_name": TEST_DEVICE_NAME},
                              verify=False,
                              headers={'Authorization': f'Splunk {user_token}'})

            response[AUTH_CODE_STATUS] = r1.status_code

            if r1.status_code != 200:
                response[ERROR] = r1.text
                return { 'raw_payload': json.dumps(create_splunk_resp(response)), 'status':200}

            response_jsn = json.loads(r1.text)
            temp_key = response_jsn['temp_key']

            self.log.info("Confirm auth-code registration (auth code: %s) with temp key: %s", auth_code, temp_key)
            r2 = requests.post(
                f"{self.base_uri}services/ssg/registration/confirmation?&auth_code={auth_code}"
                "&self_register=False&auth_method=saml",
                json={'temp_key': temp_key},
                verify=False,
                headers={'Authorization': f'Splunk {user_token}',
                        'Content-Type': 'application/json'})

            response['server_registration_status'] = r2.status_code
            self.log.info("completed registration with response={}".format(r2.text))
            token_id = r2.json().get('token_id')

            if r2.status_code != 201:
                response[ERROR] = r2.text
                return { 'raw_payload': json.dumps(create_splunk_resp(response)), 'status':200}

            registration_device_info: registration_v2.DeviceInfo = registration_v2.complete_registration(auth_id,
                                                                                            client_encryption_ctx,
                                                                                            self.config)

            if not registration_device_info:
                response[ERROR] = "Failed to complete client side registration"
                return { 'raw_payload': json.dumps(create_splunk_resp(response)), 'status':200}

            response['completed_client_registration'] = True
            self.log.info("Completed client side registration")

            jwt_token = self.encrypt_jwt(credentials, system_authtoken)

            device_info = DeviceInfo(
                registration_device_info.encryption_public_key,
                registration_device_info.signing_public_key,
                registration_device_info.client_id(client_encryption_ctx),
                app_id=APP_ID,
                client_version=CLIENT_VERSION
            )

            self.log.info("Device info: %s", device_info)

            # Websocket test
            rid = get_guid()
            response[WSS_RID] = rid
            wss_response = wss.run_wss_test(self.log,
                                            request_type,
                                            jwt_token,
                                            client_encryption_ctx,
                                            device_info,
                                            rid,
                                            config=self.config,
                                            type=request_mode)
            self.log.info("Completed websocket test")
            response[WSS_RESPONSE] = str(wss_response)
            # Clean up
            self.delete_device(user, TEST_DEVICE_NAME, user_token)
            if token_id:
                self.delete_token(system_authtoken, token_id, user)

        except Exception as e:
            self.log.exception(e)
            response[ERROR] = str(e)


        return {
            'raw_payload': json.dumps(create_splunk_resp(response)),
            'status': 200
        }

    def encrypt_jwt(self, credentials, system_authtoken):
        sodium_client = SodiumClient(self.log)
        splunk_encryption_ctx = SplunkEncryptionContext(system_authtoken,
                                                        constants.SPACEBRIDGE_APP_NAME,
                                                        sodium_client)
        jwt_token = credentials.get_credentials().encode()
        jwt_token = splunk_encryption_ctx.secure_session_token(jwt_token).decode('ascii')
        return jwt_token

    def delete_device(self, user, device_name, user_token):
        """ delete our fake device once we are done with the test"""
        r = requests.get(f"{self.base_uri}services/ssg/kvstore/user_devices",
                         headers={'Authorization': f'Splunk {user_token}'},
                         verify=False)

        devices = [d for d in r.json() if d.get('device_name') == device_name]
        device_id = devices[0]['_key'] if devices else ""

        if device_id:
            r = requests.post(f"{self.base_uri}services/ssg/kvstore/delete_device", verify=False,
                               params={'device_owner': user, 'device_key': device_id},
                               headers={'Authorization': 'Splunk {}'.format(user_token)})
            self.log.info("deleting device with response={}, code={}".format(r.text, r.status_code))
        else:
            self.log.info("device id not found so skipping deletion")

    def delete_token(self, system_token, token_id, user):
        """ Delete JWT token with given id """
        r = requests.delete(f'{rest.makeSplunkdUri()}services/authorization/tokens/{user}',
                            verify=False,
                            data={'id': token_id},
                            headers={'Authorization': f'Splunk {system_token}'})

        self.log.info("deleted token={} with response={}".format(token_id, r.text))


