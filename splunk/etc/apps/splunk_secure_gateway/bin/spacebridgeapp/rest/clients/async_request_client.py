"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Module providing client for tracking incoming requests
"""
import logging
from typing import Optional

from cloudgateway.splunk.auth import SplunkAuthHeader
from spacebridgeapp.request.request_processor import JWTAuthHeader
from spacebridgeapp.rest.clients.async_kvstore_client import AsyncKvStoreClient
from spacebridgeapp.util import constants
from spacebridgeapp.util.time_utils import get_current_timestamp

class AsyncRequestClient(object):
    def __init__(self, log: logging.Logger, kvstore_client: AsyncKvStoreClient):
        """
        Client for tracking incoming requests
        """
        self.log = log
        self.kvstore_client = kvstore_client
        self.device_metadata: dict[str, Optional[int]] = {}
        super(AsyncRequestClient, self).__init__()

    def on_request(self, device_key: str, auth_header):
        """
        Function to trigger whenever there is a new request from a client device. Caches the provided
        device_key to indicate that that device has had activity.

        :param device_key: the key in the Registered Devices Collection that corresponds to
                           the device making the request
        :param auth_header: Authentication header (BasicAuthHeader or JWTAuthHeader)
        """
        self.log.debug("Recording request for device with key=%s", device_key)

        # Ensure device is tracked (will be None if no JWT expiration is set)
        if device_key not in self.device_metadata:
            self.device_metadata[device_key] = None

        self._process_jwt_token(device_key, auth_header)

    def _process_jwt_token(self, device_key: str, auth_header):
        """
        Processes JWT token from auth header and extracts expiration information.

        :param device_key: the key in the Registered Devices Collection
        :param auth_header: Authentication header that may contain JWT token
        """

        try:
            if isinstance(auth_header, JWTAuthHeader):
                jwt_expiration = auth_header.get_expiration()
                self.device_metadata[device_key] = jwt_expiration
            else:
                self.log.debug("Non-JWT auth header for device_key=%s, skipping JWT expiration tracking", device_key)
        except Exception as e:
            self.log.warning("Failed to extract JWT expiration for device_key=%s, error=%s", device_key, str(e))

    async def flush(self, auth_header: SplunkAuthHeader):
        """
        Flushes the cache to KV Store, updating timestamp information for all devices that
        have had activity.

        :param auth_header: A system auth header to authenticate KV Store calls
        """
        try:
            await self._flush(auth_header)
        except Exception:
            self.log.error("Failed to flush request cache")

    async def _flush(self, auth_header: SplunkAuthHeader):
        if not self.device_metadata:
            return
        self.log.debug("Flushing request cache, size=%s", len(self.device_metadata))

        # Capture current state and reset cache
        cache_snapshot = self._capture_and_reset_cache()

        # Create KV Store payload with updated meta data
        current_timestamp = get_current_timestamp()
        meta_data = []
        for key, token_expiration in cache_snapshot.items():
            meta_data.append({
                constants.KEY: key,
                constants.LAST_SEEN_TIMESTAMP: current_timestamp,
                constants.TOKEN_EXPIRATION_TIMESTAMP: token_expiration
            })

        # Save payload to KV Store
        await self.kvstore_client.async_batch_save_request(
            auth_header=auth_header,
            collection=constants.REGISTERED_DEVICES_META_COLLECTION_NAME,
            entries=meta_data)

        self.log.debug("Request flush complete, size=%s", len(meta_data))

    def _capture_and_reset_cache(self):
        """
        Captures the current cache state and resets the internal cache.

        :return: Dictionary containing captured cache data
        """
        cache_snapshot = self.device_metadata.copy()
        self.device_metadata = {}
        return cache_snapshot
