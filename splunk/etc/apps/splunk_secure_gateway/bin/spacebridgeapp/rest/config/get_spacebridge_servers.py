"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

REST endpoint handler for getting spacebridge regions
"""
import asyncio
import json
import logging
import sys
import time
import os


import splunk
from splunk.clilib.bundle_paths import make_splunkhome_path

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

from http import HTTPStatus
from cloudgateway.splunk.encryption import SplunkEncryptionContext
from cloudgateway.private.sodium_client import SodiumClient
from spacebridgeapp.util.constants import SPACEBRIDGE_APP_NAME, AUTHTOKEN, SESSION, STATUS, PAYLOAD, SPACEBRIDGE_SERVER, \
    HTTP_DOMAIN, INSTANCE_CONFIG_COLLECTION_NAME, SERVER, RT
from spacebridge_protocol import discovery_pb2
from spacebridgeapp.exceptions.spacebridge_exceptions import SpacebridgeError
from spacebridgeapp.util.config import SecureGatewayConfig
from spacebridgeapp.request.request_processor import SpacebridgeAuthHeader
from spacebridgeapp.rest import async_base_endpoint
from spacebridgeapp.rest.services.kvstore_service import KVStoreCollectionAccessObject as kvstore
from spacebridgeapp.rest.clients.async_spacebridge_client import AsyncSpacebridgeClient

sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))
sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))

SPACEBRIDGE_REQ_TIMEOUT = 5
SPACEBRIDGE_TOTAL_TIMEOUT = 30


class SpacebridgeServers(async_base_endpoint.AsyncBaseRestHandler):
    """
    Main class for handling the spacebridge_servers endpoint. Subclasses the spacebridge_app
    BaseRestHandler.
    """

    def __init__(self, command_line, command_arg):
        super().__init__(command_line, command_arg, logname="rest_spacebridge_servers")
        self.sodium_client = SodiumClient()

    async def get(self, request):
        """
          This will return the list of spacebridge servers from spacebridge discovery.

          :param request
          :return:
          """

        # Setup
        system_authtoken = request['system_authtoken']
        config = self.config
        session_token = request[SESSION][AUTHTOKEN]
        encryption_context = SplunkEncryptionContext(system_authtoken, SPACEBRIDGE_APP_NAME, SodiumClient(self.log))

        # Get spacebridge server
        current_spacebridge_server_url = get_current_spacebridge_server(config, self.log, session_token)

        # Get all possible spacebridge servers from discovery
        spacebridge_client = self.async_client_factory.spacebridge_client()
        spacebridge_instances = await self.get_spacebridge_instances(encryption_context, spacebridge_client)

        # Get spacebridge response times
        response_times = await get_spacebridge_response_times(self.log,
                                                              spacebridge_client,
                                                              spacebridge_instances.instances)

        # Construct all spacebridge instance objects from discovery
        spacebridge_instances_array = [{'http_domain': x.httpDomain,
                                        'grpc_domain': x.grpcDomain,
                                        'region': x.region,
                                        'label': x.regionLabel,
                                        'description': x.regionDescription,
                                        'instance_id': x.instanceId,
                                        'id': x.id,
                                        'current': x.httpDomain == current_spacebridge_server_url,
                                        'response_time': response_times.get(x.httpDomain)}
                                       for x in spacebridge_instances.instances]

        return {
            STATUS: HTTPStatus.OK,
            PAYLOAD: {'result': 'ok', 'payload': spacebridge_instances_array}
        }

    async def get_spacebridge_instances(self,
                                        encryption_context: SplunkEncryptionContext,
                                        spacebridge_client: AsyncSpacebridgeClient):
        client_id = encryption_context.sign_public_key(transform=encryption_context.generichash_raw)
        auth_header = SpacebridgeAuthHeader(client_id)

        try:
            response = await spacebridge_client.async_query_discovery_instances(auth_header, SPACEBRIDGE_REQ_TIMEOUT)
            instances = discovery_pb2.SpacebridgeInstancesResponse()
            instances.ParseFromString(response.instances)
            return instances
        except asyncio.TimeoutError:
            raise SpacebridgeError(message="Discovery request timed out",
                                   status_code=HTTPStatus.REQUEST_TIMEOUT)

def get_current_spacebridge_server(config: SecureGatewayConfig, log: logging.Logger, session_token: str) -> str:

    default_spacebridge_server = config.get_spacebridge_server()

    try:
        spacebridge_bundle = get_current_spacebridge_server_bundle(log, session_token)
        spacebridge_server_url = spacebridge_bundle.get(HTTP_DOMAIN, default_spacebridge_server)
    except Exception as e:
        log.debug(str(e))
        spacebridge_server_url = default_spacebridge_server

    return spacebridge_server_url

def get_current_spacebridge_server_bundle(log: logging.Logger, session_token: str) -> dict:
    try:
        kvstore_service = kvstore(collection=INSTANCE_CONFIG_COLLECTION_NAME,
                                  session_key=session_token)
        _, result = kvstore_service.get_item_by_key(SPACEBRIDGE_SERVER)
        result_json = json.loads(result)

        return result_json

    # it's OK when kv store doesn't have spacebridge_server item: probably ssg app is not onboarded yet
    except splunk.ResourceNotFound as e:
        log.debug("Unable to fetch current spacebridge bundle, error: {}".format(str(e)))
    except splunk.RESTException as e:
        log.error("Unable to fetch current spacebridge bundle, error: {}".format(str(e)))

    return {STATUS: HTTPStatus.INTERNAL_SERVER_ERROR}


async def get_spacebridge_response_times(log, client, spacebridge_instances) -> dict:
    if not spacebridge_instances:
        return {}

    # Create and track tasks using asyncio.create_task
    task_objects = [
        asyncio.create_task(
            get_spacebridge_response_time(log, client, instance.httpDomain)
        )
        for instance in spacebridge_instances
    ]

    try:
        await asyncio.wait_for(
            asyncio.gather(*task_objects),
            timeout=SPACEBRIDGE_TOTAL_TIMEOUT
        )
    except asyncio.TimeoutError:
        log.exception("Timed out waiting for response from some of spacebridge instances")

    # Collect results from completed tasks
    all_response_times = [task.result() for task in task_objects if task.done()]

    # Get average response times for each server
    avg_response_times = {
        result[SERVER]: result[RT]
        for result in all_response_times
        if result.get(RT) is not None
    }

    return avg_response_times


async def get_spacebridge_response_time(log: logging.Logger, client: AsyncSpacebridgeClient, domain: str) -> dict:
    url = f'https://{domain}/health_check'
    response_time = None
    start_time = time.time()
    try:
        # Perform GET request to spacebridge server health endpoint
        await client.async_health_check(domain, timeout=SPACEBRIDGE_REQ_TIMEOUT)
        response_time = time.time() - start_time
    except Exception as err:
        log.info("Error reaching {}: {}".format(url, err))

    return {SERVER: domain, RT: response_time}
