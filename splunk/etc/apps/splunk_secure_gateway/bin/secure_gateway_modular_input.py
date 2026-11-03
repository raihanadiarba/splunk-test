"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Modular input for the Spacebridge app which brings up
a web socket server to talk to Spacebridge
"""

# Suppress warnings to pass AppInspect when calling --scheme
import warnings
import logging
import asyncio

from spacebridgeapp.util import py23
py23.setup_environment_for_modular_input()

from splunk.clilib import cli_common as cli
from splunk.clilib.bundle_paths import get_base_path
import splunk.rest as rest

from spacebridgeapp.util.mtls import build_mtls_spacebridge_client, build_key_bundle

warnings.filterwarnings('ignore', '.*service_identity.*', UserWarning)

from cloudgateway.websocket import CloudGatewayWsClient, WebsocketMode, AbstractWebsocketContext
from cloudgateway.private.sodium_client.sharedlib_sodium_client import SodiumClient
from cloudgateway.splunk.encryption import SplunkEncryptionContext
from spacebridgeapp.rest.clients.async_client_factory import AsyncClientFactory
from spacebridgeapp.rest.opt_in.opt_in_handler import get_opt_in, DEFAULT_OPT_IN, USER, TIMESTAMP
from spacebridgeapp.util.shard import default_shard_id
from spacebridgeapp.util.base_modular_input import BaseModularInput
from spacebridgeapp.access.access_control import allow_access
from spacebridgeapp.messages.message_handler import CloudgatewayMessageHandler
from spacebridgeapp.util import constants
from spacebridgeapp.rest.config.deployment_info import ensure_deployment_friendly_name
from spacebridgeapp.rest.load_balancer_verification import get_uri
from spacebridgeapp.rest.services import splunk_service
from spacebridgeapp.util.test_state import get_test_state
from spacebridgeapp.util.config import SecureGatewayConfig
from cloudgateway.splunk.asyncio.auth import SplunkAuthHeader
from cloudgateway.device import DeviceInfo
from spacebridgeapp.versioning import app_version


async def _periodic_spacebridge_server_update(websocket,
                                              auth_header,
                                              logger,
                                              config: SecureGatewayConfig,
                                              websocketContext: AbstractWebsocketContext,
                                              app_name=constants.SPACEBRIDGE_APP_NAME,
                                              conf_filename=constants.SECUREGATEWAY,
                                              sleep_interval=constants.SPACEBRIDGE_SERVER_UPDATE_INTERVAL
                                             ):
    while not websocket.closed:
        # Restart if config has been updated
        if config.has_changed():
            logger.info("Detected config change, terminating.")
            websocketContext.RETRY_INTERVAL_SECONDS = -1
            await websocket.close()
            return
        await asyncio.sleep(sleep_interval)


async def _periodic_flush(websocket, subscription_client, request_client, auth_header, logger):
    time_lapsed_seconds = 0
    while not websocket.closed:
        if time_lapsed_seconds >= 30:
            logger.debug("flush starting")
            # Make sure that children functions don't throw an exception, otherwise, entire process will stop
            await subscription_client.flush(auth_header)
            await request_client.flush(auth_header)
            logger.debug("flush complete")
            logger.debug("flush sleep")
            time_lapsed_seconds = 0
        await asyncio.sleep(1)
        time_lapsed_seconds += 1


async def _get_ssg_device_info(async_telemetry_client, auth_headers):
    telemetry_instance_id = await async_telemetry_client.get_telemetry_instance_id(auth_header=auth_headers)
    splunk_version = await async_telemetry_client.get_splunk_version(auth_header=auth_headers)
    ssg_version = str(app_version())
    return DeviceInfo(None, None, app_id="com.splunk.mobile.ssg",
                      user_agent=f"SSG Client (Splunk/{splunk_version}, SSG/{ssg_version})",
                      tenant_id=telemetry_instance_id)


class SpacebridgeModularInput(BaseModularInput):
    """ Main entry path for launching the Spacebridge Application
    Modular Input
    Arguments:
        modular_input {[type]} -- [description]
    """
    title = 'Splunk Secure Gateway'
    description = 'Initializes the Splunk Secure Gateway application to talk to mobile clients over websockets'
    app = 'Splunk Secure Gateway'
    name = 'splunksecuregateway'
    use_kvstore_checkpointer = False
    use_hec_event_writer = False
    log_mod_input_name = 'secure_gateway_modular_input.app'

    def extra_arguments(self):
        """
        Override extra_arguments list for modular_input scheme
        :return:
        """
        return [
            {
                'name': 'param1',
                'description': 'No params required'
            }
        ]

    def do_run(self, input_config):
        """ Spins up a websocket connection Spacebridge and begins
        the reactor loops
        """
        if not super(SpacebridgeModularInput, self).do_run(input_config):
            return

        config, logger = self.config, self.logger

        try:
            config.ensure_spacebridge_server()
        except ValueError as e:
            config.sleep_and_terminate_process(sleep_interval=300)

        # Determine if we should allow_access to Spacebridge based on env and opt_in
        if not allow_access(self.session_key):
            logger.debug('Acknowledgement of Spacebridge non-compliance is pending.  Modular Input will NOT run.')
            return

        # Log opt-in response on startup
        opt_in = get_opt_in(DEFAULT_OPT_IN, self.session_key)
        if opt_in:
            logger.info(f'Spacebridge non-compliance was acknowledged by '
                             f'user={opt_in[USER]}, timestamp={opt_in[TIMESTAMP]}.  Modular Input is running.')

        shard_id = default_shard_id()

        logger.info("Starting libsodium child process")
        sodium_logger = logger.getChild('sodium_client')
        sodium_logger.setLevel(logging.WARN)

        sodium_client = SodiumClient(sodium_logger)
        encryption_context = SplunkEncryptionContext(self.session_key,
                                                     constants.SPACEBRIDGE_APP_NAME,
                                                     sodium_client)

        logger.info("Running Splunk Secure Gateway modular input on search head, shard_id=%s", shard_id)

        # Fetch load balancer address if configured, otherwise use default URI
        try:
            uri = get_uri(logger, self.session_key)
            logger.debug("Successfully verified load_balancer_address={}".format(uri))
        except Exception as e:
            logger.exception("Failed to verify load_balancer_address. {}".format(e))

        if not uri:
            return

        try:
            spacebridge_client = None
            key_bundle = None
            if config.get_mtls_enabled():
                key_bundle = build_key_bundle(self.session_key)
                spacebridge_client = build_mtls_spacebridge_client(logger, self.session_key)

            ensure_deployment_friendly_name(logger, self.session_key)
            async_client_factory = AsyncClientFactory(logger, config, uri, spacebridge_client=spacebridge_client)

            subscription_client = async_client_factory.subscription_client()
            request_client = async_client_factory.request_client()

            auth_header = SplunkAuthHeader(self.session_key)

            cloudgateway_message_handler = CloudgatewayMessageHandler(SplunkAuthHeader(self.session_key),
                                                                      logger=logger,
                                                                      encryption_context=encryption_context,
                                                                      async_client_factory=async_client_factory,
                                                                      shard_id=shard_id)

            ssg_device_info = asyncio.run(_get_ssg_device_info(async_client_factory.telemetry_client(), auth_header))

            client = CloudGatewayWsClient(encryption_context, message_handler=cloudgateway_message_handler,
                                          mode=WebsocketMode.ASYNC,
                                          logger=logger,
                                          config=config,
                                          shard_id=shard_id,
                                          key_bundle=key_bundle,
                                          device_info=ssg_device_info,
                                          websocket_context=WebsocketContext(subscription_client, request_client,
                                                                             auth_header, logger, config))

            client.connect()
        except Exception as e:
            logger.exception("Exception connecting to spacebridge={0}".format(e))

    def on_invalid_server_role_mode(self):
        try:
            logger = self.setup_logging(None)
            logger.warning("Modular input: %s can't be run due to Splunk role/mode or missing configs", self.name)
        except Exception:
            return

class WebsocketContext(AbstractWebsocketContext):
    def __init__(self, subscription_client, request_client, auth_header, logger, config):
        self.RETRY_INTERVAL_SECONDS = 2
        self.subscription_client = subscription_client
        self.request_client = request_client
        self.auth_header = auth_header
        self.logger = logger
        self.config = config

    async def on_open(self, protocol):
        self.logger.info("Creating flush task")
        asyncio.create_task(_periodic_flush(protocol, self.subscription_client, self.request_client,
                                            self.auth_header, self.logger))
        self.logger.info("Creating spacebridge_server update task")
        asyncio.create_task(_periodic_spacebridge_server_update(protocol, self.auth_header, self.logger, self.config, self))

    async def on_ping(self, payload, protocol):
        pass

    async def on_pong(self, payload, protocol):
        pass

    async def on_close(self, wasClean, code, reason, protocol):
        pass


if __name__ == "__main__":
    worker = SpacebridgeModularInput()
    worker.execute()
