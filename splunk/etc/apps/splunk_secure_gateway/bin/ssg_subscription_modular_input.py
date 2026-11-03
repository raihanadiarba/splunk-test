"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Modular Input for processing publish and subscription process
"""
import warnings
import logging
warnings.filterwarnings('ignore', '.*service_identity.*', UserWarning)
from spacebridgeapp.util import py23
py23.setup_environment_for_modular_input()

import asyncio
from spacebridgeapp.rest.clients.async_secret_management_client import AsyncSecretManagementClient
from spacebridgeapp.rest.clients.async_kvstore_client import AsyncKvStoreClient
from cloudgateway.splunk.auth import SplunkAuthHeader
from spacebridgeapp.subscriptions import loader
from spacebridgeapp.subscriptions.process_manager import JobContext
from spacebridgeapp.util.shard import default_shard_id
from cloudgateway.private.sodium_client.sharedlib_sodium_client import SodiumClient
from cloudgateway.splunk.encryption import SplunkEncryptionContext
from solnlib import modular_input
from spacebridgeapp.util.base_modular_input import BaseModularInput
from spacebridgeapp.util.constants import SPACEBRIDGE_APP_NAME
from spacebridgeapp.subscriptions.subscription_manager import SubscriptionManager
from spacebridgeapp.rest.load_balancer_verification import get_uri

class SubscriptionModularInput(BaseModularInput):
    """
    Main entry for processing Search Subscriptions
    """
    title = 'Splunk Secure Gateway Subscription Processor'
    description = 'Process subscriptions and send visualization data to subscribed devices.'
    app = 'Splunk Secure Gateway'
    name = 'splunk_secure_gateway'
    use_kvstore_checkpointer = False
    use_hec_event_writer = False

    input_config_key = "ssg_subscription_modular_input://default"
    minimum_iteration_time_seconds = "minimum_iteration_time_seconds"
    warn_threshold_seconds = "maximum_iteration_time_warn_threshold_seconds"
    log_mod_input_name = "ssg_subscription_modular_input.app"
    monitor_parent_process = True
    subscription_manager = None

    def extra_arguments(self):
        """
        Override extra_arguments list for modular_input scheme
        :return:
        """
        return [
            {
                'name': 'minimum_iteration_time_seconds',
                'title': 'Minimum Iteration Time in Seconds',
                'description': 'The minimum time an iteration of the subscription processor will run for.  If an '
                               'iteration takes longer than the minimum, the next iteration is scheduled immediately.',
                'data_type': modular_input.Argument.data_type_number
            },
            {
                'name': 'maximum_iteration_time_warn_threshold_seconds',
                'title': 'Minimum Iteration Time Warning Threshold in Seconds',
                'description': 'If processing jobs takes longer than this value, a warning will be logged',
                'data_type': modular_input.Argument.data_type_number
            },
        ]

    def do_run(self, input_config):
        """
        Execute the modular_input
        :param input_config:
        :return:
        """
        if not super(SubscriptionModularInput, self).do_run(input_config):
            return

        config, logger = self.config, self.logger

        try:
            config.ensure_spacebridge_server()
        except ValueError as e:
            config.sleep_and_terminate_process(sleep_interval=300)

        shard_id = default_shard_id()

        logger.info("Starting libsodium child process")
        sodium_logger = logger.getChild('sodium_client')
        sodium_logger.setLevel(logging.WARN)
        sodium_client = SodiumClient(sodium_logger)
        logger.info("Loading encryption context")
        encryption_context = SplunkEncryptionContext(self.session_key, SPACEBRIDGE_APP_NAME, sodium_client)

        logger.info("Running Subscription Manager modular input on search head, shard_id=%s", shard_id)

        # Fetch load balancer address if configured, otherwise use default URI
        try:
            uri = get_uri(logger, self.session_key)
            logger.debug("Successfully verified load_balancer_address={}".format(uri))
        except Exception as e:
            logger.exception("Failed to verify load_balancer_address. {}".format(e))

        if not uri:
            return

        try:
            minimum_iteration_time_seconds = float(input_config[self.input_config_key][self.minimum_iteration_time_seconds])
            warn_threshold_seconds = float(input_config[self.input_config_key][self.warn_threshold_seconds])
        except Exception:
            logger.exception("Failed to load required configuration values")
            return

        try:
            auth_header = SplunkAuthHeader(self.session_key)

            job_context = JobContext(auth_header,
                                     uri,
                                     encryption_context)

            kvstore_client = AsyncKvStoreClient(logger, config)
            secret_management_client = AsyncSecretManagementClient(logger, config)

            self.subscription_manager = SubscriptionManager(logger,
                                                       config,
                                                       input_config=input_config,
                                                       encryption_context=encryption_context,
                                                       auth_header=auth_header,
                                                       shard_id=shard_id,
                                                       job_context=job_context,
                                                       search_loader=loader.load_search_bundle,
                                                       minimum_iteration_time_seconds=minimum_iteration_time_seconds,
                                                       warn_threshold_seconds=warn_threshold_seconds,
                                                       async_kvstore_client=kvstore_client,
                                                       async_secret_management_client=secret_management_client,
                                                       )

            asyncio.run(self.subscription_manager.run())
        except Exception:
            logger.exception("Unhandled exception during subscription processing")

    def on_process_is_orphan(self):
        self.logger.info("Process is orphaned, initiating graceful shutdown")
        if self.subscription_manager:
            self.subscription_manager.shutdown()

if __name__ == "__main__":
    worker = SubscriptionModularInput()
    worker.execute()
