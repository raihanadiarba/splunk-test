"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

REST endpoint handler for deep link dashboards
"""
import os
import logging
import sys
import splunk
from splunk.clilib.bundle_paths import make_splunkhome_path

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

from cloudgateway.discovery import query_discovery_instances
from cloudgateway.private.sodium_client import SodiumClient
from cloudgateway.private.sodium_client.pysodium import crypto_generichash
from cloudgateway.registration_v2 import start_registration
from cloudgateway.splunk.encryption import SplunkEncryptionContext
from spacebridgeapp.exceptions.spacebridge_exceptions import SpacebridgeApiRequestError
from spacebridge_protocol.discovery_pb2 import SpacebridgeInstancesResponse
from spacebridgeapp.rest.registration.util import AuthMethod
from spacebridgeapp.request.splunk_auth_header import SplunkAuthHeader
from spacebridgeapp.request.version_request_processor import async_get_meta_info, build_version_get_response
from spacebridgeapp.rest import async_base_endpoint
from spacebridgeapp.rest.clients.async_kvstore_client import AsyncKvStoreClient
from spacebridgeapp.rest.opt_in.opt_in_handler import is_opt_in, DEFAULT_OPT_IN
from spacebridgeapp.rest.registration.util import generate_jwt_token
from spacebridgeapp.util.config import SecureGatewayConfig
from spacebridgeapp.util.constants import SPACEBRIDGE_APP_NAME, AUTH_CODE, AUTHTOKEN, SESSION, USER, SYSTEM_AUTHTOKEN, \
    DASHBOARD_ID, DEPLOYMENT_INFO, DEPLOYMENT_FRIENDLY_NAME, STATUS, PAYLOAD, ASSET_ID, ASSET_TYPE, \
    REGISTRATION_TYPE, REGISTRATION_METHOD, DEEPLINK_DASHBOARD_COLLECTION_NAME, AUTH_METHOD, EXPIRES_IN, \
    REGISTRATION_TIMESTAMP, REGISTRATION_EXPIRY, RUNNING, REDIRECT, DEEPLINK, SPACEBRIDGE_ID, SPACEBRIDGE_URL, DASHBOARD
from spacebridge_protocol.http_pb2 import EnvironmentMetadata
from splapp_protocol.request_pb2 import VersionGetResponse
from urllib.parse import urlencode, quote
import base58
import http
import json
import time

sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))
sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))

# Default TTL for each registration job is 300s
REGISTRATION_LIFETIME = 300


class DeepLinkDashboardHandler(async_base_endpoint.AsyncBaseRestHandler):

    def __init__(self, command_line, command_arg):
        super().__init__(command_line, command_arg, logname="rest_deep_link")

    """
    Main class for handling the dashboard deeplink request.
    This endpoint will create a registration job in the deeplink dashboard kvstore collection and return a urlencoded deeplink.
    """

    async def post(self, request):
        """
        This will return a urlencoded deeplink, and create an entry in the dashboard deeplink kvstore collection

        :param request
        :return:
        """

        # Extract Params
        session_token = request[SESSION][AUTHTOKEN]
        system_authtoken = request[SYSTEM_AUTHTOKEN]
        user = request[SESSION][USER]

        config = self.config

        # Dashboard_id
        body = json.loads(request[PAYLOAD])
        dashboard_id = body.get(DASHBOARD_ID)

        self.log.info(f"Requested deeplink dashboard registration for user={user}, dashboard={dashboard_id}")

        opt_in = is_opt_in(DEFAULT_OPT_IN, system_authtoken)

        if not opt_in:
            return {STATUS: http.HTTPStatus.FORBIDDEN,
                    PAYLOAD: {REDIRECT: "app/splunk_secure_gateway/home"}}

        # Setup
        auth_header = SplunkAuthHeader(system_authtoken)
        sodium_client = SodiumClient(self.log.getChild('sodium_client'))
        async_kvstore_client = self.async_client_factory.kvstore_client()
        encryption_context = SplunkEncryptionContext(system_authtoken, SPACEBRIDGE_APP_NAME, sodium_client)
        sign_pub_key = encryption_context.sign_public_key()

        try:
            credentials = generate_jwt_token(config, self.log, user, system_authtoken)
        except Exception as e:
            self.log.error("Failed to fetch jwt token for user={} with message={}".format(user, str(e)))

            return {STATUS: http.HTTPStatus.UNAUTHORIZED,
                    PAYLOAD: {REDIRECT: "manager/launcher/authorization/tokens"}}

        version_get_response = VersionGetResponse()
        registration_info = {
            REGISTRATION_TYPE: VersionGetResponse.SAML,
            REGISTRATION_METHOD: VersionGetResponse.IN_APP
        }
        try:
            version_get_response = await build_version_get_response(self.log,
                                                                    session_token=session_token,
                                                                    system_authtoken=system_authtoken,
                                                                    app_id="",
                                                                    device_name="",
                                                                    async_client_factory=self.async_client_factory,
                                                                    registration_info=registration_info)
        except Exception as e:
            self.log.exception(f"exception fetching environment metadata, error={e}")

        env_metadata = EnvironmentMetadata(serializedMetadata=version_get_response.SerializeToString())

        self.log.debug("Starting registration for user={}".format(user))

        auth_code = start_registration(encryption_context, credentials, env_metadata, config)

        registration_time = int(time.time())
        serialized_data = build_deep_link_dashboard_payload(auth_code=auth_code,
                                                            dashboard_id=dashboard_id,
                                                            user=user,
                                                            auth_method=AuthMethod.LOCAL_LDAP.value,
                                                            registration_time=registration_time,
                                                            registration_lifetime=config.get_deep_link_reg_timeout(),
                                                            status=RUNNING)

        response = await async_kvstore_client.async_kvstore_post_request(collection=DEEPLINK_DASHBOARD_COLLECTION_NAME,
                                                                         data=serialized_data,
                                                                         auth_header=auth_header)

        if response.code != http.HTTPStatus.OK and response.code != http.HTTPStatus.CREATED:
            error = await response.text()
            error_message = "Failed when posting to KVStore. status_code={}, error={}".format(response.code, error)
            raise SpacebridgeApiRequestError(message=error_message, status_code=response.code)

        # Instance Public Key Hash (Server_id)
        server_id = hash_b58_encrypt(sign_pub_key)

        # Construct deeplink query params that will be urlencoded
        deep_link_query_params = build_dashboard_deep_link_query_params(config=config,
                                                                        encryption_context=encryption_context,
                                                                        user=user,
                                                                        asset_type=DASHBOARD,
                                                                        asset_id=dashboard_id)

        # Generate Deep Link
        deep_link = generate_deep_link(server_id=server_id,
                                       auth_code=auth_code,
                                       query_params=deep_link_query_params)

        return {STATUS: http.HTTPStatus.OK,
                PAYLOAD: {DEEPLINK: deep_link, EXPIRES_IN: config.get_deep_link_reg_timeout()}}


def build_dashboard_deep_link_query_params(config: SecureGatewayConfig,
                                           encryption_context: SplunkEncryptionContext,
                                           user: str,
                                           asset_type: str,
                                           asset_id: str = None) -> dict:
    '''
    Helper method that builds the query params for the construction of the deeplink.
    '''

    # Init query params dict
    deep_link_query_params = {USER: user, ASSET_TYPE: asset_type}

    # Insert asset_id if not None, no asset_id means the client app will redirect to asset_type homepage
    if asset_id:
        deep_link_query_params[ASSET_ID] = asset_id

    # Insert spacebridge_url if SSG is on a private spacebridge, else insert spacebridge_id
    spacebridge_server = config.get_spacebridge_server()

    if config.get_is_private_spacebridge():
        deep_link_query_params[SPACEBRIDGE_URL] = "https://" + spacebridge_server
    else:
        discovery_instances = query_discovery_instances(encryption_context=encryption_context, config=config)
        instances_response = SpacebridgeInstancesResponse()
        instances_response.ParseFromString(discovery_instances.instances)
        for instance in instances_response.instances:
            if instance.httpDomain == spacebridge_server:
                deep_link_query_params[SPACEBRIDGE_ID] = instance.instanceId

    return deep_link_query_params


def build_deep_link_dashboard_payload(auth_code: str,
                                      dashboard_id: str,
                                      user: str,
                                      auth_method: str,
                                      registration_time: int,
                                      registration_lifetime: int,
                                      status: str):
    data = {AUTH_CODE: auth_code,
            DASHBOARD_ID: dashboard_id,
            USER: user,
            AUTH_METHOD: auth_method,
            REGISTRATION_TIMESTAMP: registration_time,
            REGISTRATION_EXPIRY: registration_time + registration_lifetime,
            STATUS: status}

    return json.dumps(data)


async def _fetch_instance_name(log: logging.Logger,
                               auth_header: SplunkAuthHeader, async_kvstore_client: AsyncKvStoreClient) -> str:
    meta_info = await async_get_meta_info(log, auth_header, async_kvstore_client)
    return meta_info[DEPLOYMENT_INFO][DEPLOYMENT_FRIENDLY_NAME]


def hash_b58_encrypt(message: bytes) -> str:
    return base58.b58encode(crypto_generichash(message)).decode("utf-8")


def generate_deep_link(server_id: str, auth_code: str, query_params: dict = None) -> str:
    deeplink = f"https://spl.mobi/register/{server_id}/auth_code/{auth_code}?"
    params = urlencode(query_params, quote_via=quote) if query_params else ''

    return deeplink + params
