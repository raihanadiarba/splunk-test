
"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.
"""
import json
import logging
import asyncio

from spacebridgeapp.data.subscription_data import SubscriptionCredential, Subscription
from spacebridgeapp.util import time_utils
from spacebridgeapp.rest.services.kvstore_service import KVStoreCollectionAccessObject
from spacebridgeapp.request.splunk_auth_header import SplunkAuthHeader
from spacebridgeapp.rest.services.splunk_service import get_all_mobile_users, fetch_sensitive_data
from spacebridgeapp.util.constants import SPACEBRIDGE_APP_NAME, VERSION, NOT_EQUAL, LAST_UPDATE_TIME, EXPIRED_TIME, \
    SEARCHES_COLLECTION_NAME, SUBSCRIPTIONS_COLLECTION_NAME, SEARCH_UPDATES_COLLECTION_NAME, \
    SUBSCRIPTION_CREDENTIALS_COLLECTION_NAME, KEY
from spacebridgeapp.util.kvstore import build_not_containedin_clause


def not_subscription_keys_query(valid_keys):
    if len(valid_keys):
        return build_not_containedin_clause(KEY, valid_keys)
    return {}


class SubscriptionCleanUp(object):
    STUCK_SEARCH_MULTIPLIER = 5

    def __init__(self, log: logging.Logger, session_key, clean_up_time, async_secret_management_client):
        """
        Subscription Clean Up constructor
        :param log:
        :param session_key: session key passed by modular input
        :param clean_up_time: configurable time given in days
        """
        self.log = log
        self.session_key = session_key
        self.clean_up_time = clean_up_time
        self.system_auth_header = SplunkAuthHeader(self.session_key)
        self.async_secret_management_client = async_secret_management_client

    def _clean_expired_subscriptions(self, collection):
        expired_time = time_utils.get_current_timestamp() - self.clean_up_time
        self.log.info(f"Deleting subscriptions older than expired_time={expired_time}")

        collection.delete_expired_items(expired_time=self.clean_up_time, expiration_attribute_name=EXPIRED_TIME)
        collection.delete_items_by_query({VERSION: {NOT_EQUAL: 2}})

    def _clean_expired_searches(self, users):
        for user in users:
            collection = KVStoreCollectionAccessObject(collection=SEARCHES_COLLECTION_NAME,
                                                       session_key=self.session_key,
                                                       owner=user)
            stuck_search_delete_time = self.clean_up_time * self.STUCK_SEARCH_MULTIPLIER
            timestamp_before = time_utils.get_current_timestamp() - stuck_search_delete_time
            self.log.info(f"Deleting searches older than last_update_time={timestamp_before}")

            collection.delete_expired_items(expired_time=stuck_search_delete_time,
                                            expiration_attribute_name=LAST_UPDATE_TIME)
            collection.delete_items_by_query({VERSION: {NOT_EQUAL: 2}})
            collection.delete_items_by_query({LAST_UPDATE_TIME: None})

    async def _clean_out_dated_subscription_credentials(self):
        timestamp_before = time_utils.get_current_timestamp() - self.clean_up_time
        self.log.debug(f'Deleting credentials older than last_update_time={timestamp_before}')
        credentials = await self.async_secret_management_client.fetch_all_sensitive_data(self.system_auth_header)
        for credential in credentials:
            subscription_credential = SubscriptionCredential.from_json(json.loads(credential))
            self.log.debug(
                f'find credential: {subscription_credential.user} {subscription_credential.last_update_time}')
            if subscription_credential and int(subscription_credential.last_update_time) <= int(timestamp_before):
                self.log.debug(
                    f'delete subscription credential: {subscription_credential.user} {subscription_credential.last_update_time}')
                await self.async_secret_management_client.delete_sensitive_data(
                    user_name=subscription_credential.user, system_auth_header=self.system_auth_header
                )

    def delete_subscriptions(self, users) -> list[str]:
        # clean all expired subscriptions
        valid_keys = []
        for user in users:
            access_object = KVStoreCollectionAccessObject(collection=SUBSCRIPTIONS_COLLECTION_NAME,
                                                          session_key=self.session_key,
                                                          owner=user)
            self._clean_expired_subscriptions(access_object)

            _, subscription_records = access_object.get_all_items()
            subscriptions = json.loads(subscription_records)
            keys = [subscription[KEY] for subscription in subscriptions]
            valid_keys.extend(keys)

        return valid_keys

    def delete_search_updates(self, users, not_keys_query):
        for user in users:
            access_object = KVStoreCollectionAccessObject(collection=SEARCH_UPDATES_COLLECTION_NAME,
                                                          session_key=self.session_key,
                                                          owner=user)
            access_object.delete_items_by_query(not_keys_query)



    def run(self):
        """
        Goes through each subscription and deletes items older than expiration_time + clean_up_time
        """
        self.log.info("Running Subscription Clean Up")

        users = get_all_mobile_users(self.session_key)

        # clean all expired subscriptions
        valid_keys = self.delete_subscriptions(users)

        # All subscriptions should be valid after above cleaning
        not_keys_query = not_subscription_keys_query(valid_keys)

        # Delete any search_updates, subscription_credentials that don't belong to valid subscriptions
        self.delete_search_updates(users, not_keys_query)

        asyncio.run(self._clean_out_dated_subscription_credentials())

        # Clean up any searches that have not been updated in a multiple of the clean_up time
        self._clean_expired_searches(users)

        self.log.info("Completed Subscription Clean up")
