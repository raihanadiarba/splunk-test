"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

REST endpoint handler for getting spacebridge server metadata
"""
import os
import http
import sys

from splunk.persistconn.application import PersistentServerConnectionApplication
from splunk.clilib.bundle_paths import make_splunkhome_path

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

from http import HTTPStatus
from urllib.parse import urlparse
from spacebridge_protocol.metadata_pb2 import GetSpacebridgeMetadataResponse
from spacebridge_protocol.discovery_pb2 import SpacebridgeInstance
from cloudgateway.private.sodium_client import SodiumClient
from cloudgateway.splunk.encryption import SplunkEncryptionContext
from spacebridgeapp.request.request_processor import SpacebridgeAuthHeader
from spacebridgeapp.rest import async_base_endpoint
from spacebridgeapp.rest.clients.async_spacebridge_client import AsyncSpacebridgeClient
from spacebridgeapp.rest.util.errors import SpacebridgeRestError
from spacebridgeapp.util.constants import SPACEBRIDGE_APP_NAME, STATUS, PAYLOAD, SPACEBRIDGE_SERVER, MESSAGE, \
    SESSION, AUTHTOKEN, QUERY, TIMEOUT_SECONDS

sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))
sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))


class SpacebridgeServerMetadata(async_base_endpoint.AsyncBaseRestHandler):
    """
    Main class for handling the spacebridge_server_metadata endpoint.

    This method will query a specific Spacebridge Server's metadata endpoint.
    This endpoint currently returns the http_domain, grpc_domain and the instance_id
    """

    def __init__(self, command_line, command_arg):
        super().__init__(command_line, command_arg, logname="rest_spacebridge_server_metadata")
        self.sodium_client = SodiumClient()

    async def get(self, request):
        """
          This will return a payload containing all the metadata from Spacebridge's metadata endpoint,
          currently this is http_domain, grpc_domain and instance_id

          :param request
          :return json response with metadata from Spacebridge:
          """

        session_token = request[SESSION][AUTHTOKEN]
        sodium_client = SodiumClient(self.log.getChild('sodium_client'))
        encryption_context = SplunkEncryptionContext(session_token, SPACEBRIDGE_APP_NAME, sodium_client)
        client_id = encryption_context.sign_public_key(transform=encryption_context.generichash_raw)

        spacebridge_server = request[QUERY].get(SPACEBRIDGE_SERVER)

        if not spacebridge_server:
            return {STATUS: HTTPStatus.BAD_REQUEST,
                    PAYLOAD: {MESSAGE: "Please provide a Spacebridge server."}}

        try:
            if invalid_private_spacebridge_url(spacebridge_server):
                raise SpacebridgeRestError(message="Invalid URL provided.", status=http.HTTPStatus.BAD_REQUEST)

            spacebridge_client: AsyncSpacebridgeClient = self.async_client_factory.spacebridge_client()
            metadata = await spacebridge_client.async_metadata(SpacebridgeAuthHeader(device_id=client_id),
                                                                  spacebridge_url=spacebridge_server,
                                                                  timeout=TIMEOUT_SECONDS)
            instance = SpacebridgeInstance()
            instance.ParseFromString(metadata.instance)

            return {STATUS: HTTPStatus.OK,
                    PAYLOAD: {"http_domain": instance.httpDomain,
                              "grpc_domain": instance.grpcDomain,
                              "instance_id": instance.instanceId}}

        except Exception:
            self.log.exception("Error getting spacebridge metadata")
            return {STATUS: HTTPStatus.NOT_FOUND,
                    PAYLOAD: {MESSAGE: "Please enter a valid Spacebridge Server."}}


def invalid_private_spacebridge_url(spacebridge_server):
    """
    Validate that a private spacebridge URL does not contain a blacklisted domain as a substring
    """
    # IPV4 and IPV6 loopback domains and ip prefixes
    BLACKLIST_DOMAINS = ['localhost', '127.0.0.1', '0.0.0.0', '0:0:0:0:0:0:0:1']
    IP_PREFIX = ["127.", "0.", "::1"]

    spacebridge_server = spacebridge_server if "://" in spacebridge_server else f"https://{spacebridge_server}"

    psb_url = urlparse(spacebridge_server).netloc.strip().lower()
    blacklist_validate = [domain in psb_url for domain in BLACKLIST_DOMAINS]
    prefix_validate = [psb_url.startswith(prefix) for prefix in IP_PREFIX]
    return any(blacklist_validate) or any(prefix_validate)
