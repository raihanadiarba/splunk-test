"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Module to manage Subscriptions
"""
import logging
import time
import asyncio
import contextvars
from collections import defaultdict
from typing import Callable, Awaitable

from spacebridgeapp.request.splunk_auth_header import SplunkAuthHeader
from spacebridgeapp.rest.clients.async_kvstore_client import AsyncKvStoreClient
from spacebridgeapp.rest.clients.async_secret_management_client import AsyncSecretManagementClient
from spacebridgeapp.subscriptions.loader import SearchBundle
from spacebridgeapp.subscriptions.subscription_search_requests import update_searches
from spacebridgeapp.util.constants import REQUEST_CONTEXT
from spacebridgeapp.util.config import SecureGatewayConfig
from spacebridgeapp.subscriptions.process_manager import subprocess_subscription
from spacebridgeapp.messages.request_context import RequestContext
from spacebridgeapp.util.time_utils import get_current_timestamp


SEARCH_CATEGORY_STANDALONE = 'standalone'
SEARCH_CATEGORY_REF = 'ref'
SEARCH_CATEGORY_BASE = 'base'

PROCESS_CATEGORY_ORDER = [SEARCH_CATEGORY_STANDALONE, SEARCH_CATEGORY_REF, SEARCH_CATEGORY_BASE]


def _categorize_searches(search_bundle):
    categorized = defaultdict(list)
    for search in search_bundle.searches:
        cat = None
        if search.parent_search_key is None:
            cat = SEARCH_CATEGORY_STANDALONE
        elif search.ref:
            cat = SEARCH_CATEGORY_REF
        elif search.base:
            cat = SEARCH_CATEGORY_BASE
        categorized[cat].append(search_bundle.to_search_context(search.key()))
    return categorized


SearchLoader = Callable[[logging.Logger, SplunkAuthHeader, str, AsyncKvStoreClient, AsyncSecretManagementClient], Awaitable[SearchBundle],]

class SubscriptionManager(object):

    def __init__(self, log: logging.Logger, config: SecureGatewayConfig,
                 input_config, encryption_context,
                 auth_header: SplunkAuthHeader,
                 minimum_iteration_time_seconds,
                 search_loader: SearchLoader,
                 job_context,
                 async_kvstore_client,
                 async_secret_management_client,
                 warn_threshold_seconds=None,
                 shard_id=None,):

        self.log = log
        self.config = config
        self.input_config = input_config
        self.encryption_context = encryption_context
        self.async_kvstore_client = async_kvstore_client
        self.async_secret_management_client = async_secret_management_client
        self.system_auth_header: SplunkAuthHeader = auth_header
        self.minimum_iteration_time_seconds = minimum_iteration_time_seconds
        self.warn_threshold_seconds = warn_threshold_seconds
        self.shard_id = shard_id
        self.base_job_context = job_context
        self.load_searches = search_loader
        self.subscription_updates = {}
        self.shutdown_event = asyncio.Event()

    def shutdown(self):
        """Signal the subscription manager to shut down gracefully"""
        self.log.info("Shutdown signal received")
        self.shutdown_event.set()

    async def _run_post_job_updates(self, job_results):
        searches = [result.search.__dict__ for result in job_results if result.completed]

        times = [result.search.last_update_time for result in job_results if result.completed]
        self.log.debug("count=%s, last_update_times=%s", len(times), times)

        updated_ids_search = await update_searches(self.system_auth_header, searches, self.async_kvstore_client)
        self.log.debug("Updated searches count=%s, successes=%s", len(searches), len(updated_ids_search))

        subscription_updates = {}
        for result in job_results:
            if not result.completed:
                self.log.debug('skipping incomplete job')
                continue

            subscription_updates = {**subscription_updates, **result.subscription_updates}

        return subscription_updates

    async def _process(self):
        search_bundle = await self.load_searches(self.log,
                                                 self.system_auth_header, self.shard_id, self.async_kvstore_client,
                                                 self.async_secret_management_client)

        self.log.info(f"Found active searches count={len(search_bundle.searches)}")

        search_contexts = _categorize_searches(search_bundle)

        self.log.debug(f'Active searches count by categorizes search_counts={[(c, len(search_contexts[c])) for c in search_contexts]}')

        job_results = []

        for category in PROCESS_CATEGORY_ORDER:
            job_contexts = [self.base_job_context.with_search(search_context, self.subscription_updates)
                            for search_context in search_contexts[category]]

            task_list = [asyncio.create_task(subprocess_subscription(self.log, self.config, job_context))
                         for job_context in job_contexts]

            category_result = [await task for task in task_list]

            job_results = job_results + category_result

        self.subscription_updates = await self._run_post_job_updates(job_results)

    async def _loop(self):
        """
        Main Execute loop for Subscription Manager
        :return:
        """
        self.log.debug("Starting iteration of SSG subscriptions")
        start_time_seconds = time.time()

        await self._process()

        time_taken_seconds = time.time() - start_time_seconds

        if self.warn_threshold_seconds and self.warn_threshold_seconds < time_taken_seconds:
            self.log.warning("Subscription processing took time_seconds=%s, warn_threshold_seconds=%s",
                        time_taken_seconds, self.warn_threshold_seconds)

        self.log.debug(f"Subscriptions processed, time_taken={time_taken_seconds}")

        # if we've taken longer than the minimum, schedule immediately
        raw_delay_required = self.minimum_iteration_time_seconds - time_taken_seconds
        delay_required_seconds = max(raw_delay_required, 0)

        self.log.debug(f"Subscription loop will sleep for delay_seconds={delay_required_seconds}")
        await asyncio.sleep(delay_required_seconds)

    async def run(self):
        """ Executes subscriptions processing loop which processes subscriptions, sleeps for the set interval time and then repeats in a loop """
        try:
            while not self.shutdown_event.is_set():
                if self.config.has_changed():
                    self.log.info("Detected config change, terminating.")
                    return
                ctx = RequestContext(self.system_auth_header, request_id="subscription-iteration-{}".format(get_current_timestamp()))
                request_ctx_var = contextvars.ContextVar(REQUEST_CONTEXT)
                token = request_ctx_var.set(ctx)
                try:
                    await self._loop()
                finally:
                    request_ctx_var.reset(token)
        except Exception:
            # if something has made its way up here, the only safe thing to do is shut down and wait for
            # Splunk to restart the process
            self.log.exception("Unexpected Error while processing subscriptions!")

        self.log.debug("Subscription manager terminating")

