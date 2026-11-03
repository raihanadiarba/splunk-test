"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.
"""
import logging

from spacebridgeapp.rest.services.kvstore_service import KVStoreCollectionAccessObject
from spacebridgeapp.rest.services.splunk_service import get_all_mobile_users
from spacebridgeapp.util import constants
from spacebridgeapp.util.constants import NOBODY
from spacebridgeapp.util.time_utils import day_to_seconds, get_current_timestamp


class AlertsTtlUtility(object):
    """
    Utility class to clean up alerts related KV Store table by deleting entries older than K days in the past
    """

    def __init__(self, log: logging.Logger, session_key, ttl_days, owner=NOBODY):
        """
        :param log:
        :param session_key: session key passed by modular input
        :param ttl_days: items older than ttl_days will be removed
        :param owner: owner of the collection
        """
        self.log = log
        self.session_key = session_key
        self.owner = owner

        users = get_all_mobile_users(self.session_key)

        self.log.info(f"clean mobile_alert resources from: {users}")
        self.ttl_resource_list = [
            KVStoreCollectionTTLResource(
                collection_name=constants.MOBILE_ALERTS_COLLECTION_NAME,
                time_attribute_name="created_at",
                ttl_num_days=ttl_days,
                owner=user)
            for user in users
        ]

        receient_devices_list = [
            KVStoreCollectionTTLResource(
                collection_name=constants.ALERTS_RECIPIENT_DEVICES_COLLECTION_NAME,
                time_attribute_name="timestamp",
                ttl_num_days=ttl_days,
                owner=user)
            for user in users
        ]
        self.ttl_resource_list.extend(receient_devices_list)

    def delete_invalid_entries(self, collection, collection_handler, timestamp_attribute_name):
        try:
            current_timestamp = get_current_timestamp()
            query = {timestamp_attribute_name: {constants.GREATER_THAN_OPERATOR: current_timestamp}}
            resp = collection_handler.delete_items_by_query(query)
            self.log.info("Successfully deleted invalid entries for collection=%s with response=%s",
                          collection, str(resp))
        except Exception:
            self.log.exception("Exception deleting invalid entries for collection=%s", collection)

    def run(self):
        """
        Goes through each alerts related collection and deletes items older than ttl_days
        """
        self.log.info("Running alerts ttl utility")

        try:
            for kvstore_ttl_resource in self.ttl_resource_list:

                timestamp_attribute_name = kvstore_ttl_resource.time_attribute_name
                collection = kvstore_ttl_resource.collection_name
                ttl_num_seconds = day_to_seconds(kvstore_ttl_resource.ttl_num_days)
                owner = kvstore_ttl_resource.owner

                collection_handler = KVStoreCollectionAccessObject(collection=kvstore_ttl_resource.collection_name,
                                                                   session_key=self.session_key,
                                                                   timestamp_attribute_name=timestamp_attribute_name,
                                                                   owner=owner)

                self.delete_invalid_entries(collection, collection_handler, timestamp_attribute_name)
                try:
                    collection_handler.delete_expired_items(expired_time=ttl_num_seconds)
                    self.log.debug("Successfully performed TTL for collection=%s with owner=%s" % (collection, owner))
                except Exception:
                    self.log.exception("Exception performing TTL for collection=%s" % collection)
        except Exception:
            self.log.exception("Failure encountered during Alerts TTL ")


class KVStoreCollectionTTLResource(object):
    """
    Helper class to store TTL configuration information
    """

    def __init__(self, collection_name, time_attribute_name, ttl_num_days=3, owner=NOBODY):
        self.collection_name = collection_name
        self.time_attribute_name = time_attribute_name
        self.ttl_num_days = ttl_num_days
        self.owner = owner
