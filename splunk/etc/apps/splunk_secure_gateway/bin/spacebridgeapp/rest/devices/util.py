"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Utilities for devices handlers
"""

import base64

from http import HTTPStatus
from spacebridgeapp.util import py23
from spacebridgeapp.util.constants import KEY, LAST_SEEN_TIMESTAMP, TOKEN_EXPIRATION_TIMESTAMP, DEVICE_REGISTERED_TIMESTAMP, DEVICE_PUBLIC_KEYS_COLLECTION_NAME
from spacebridgeapp.exceptions.key_not_found_exception import KeyNotFoundError

def augment_device_with_metadata(devices, devices_meta):
    """
    Augments the provided devices list with timestamp metadata in the provided devices_meta list.
    Entries in the two lists are related via their '_key' property. If there is no timestamp metadata,
    use the registration timestamp from the device.

    
    For example:
        param devices:      [{'_key': '1', 'device_name': 'a'}, {'_key': '2', 'device_name': 'b'}]
        param devices_meta: [{'_key': '1', 'last_seen_timestamp': 10, 'token_expiration_timestamp': 1234567890}, {'_key': '3', 'last_seen_timestamp': 15}]
        updated devices:    [{'_key': '1', 'device_name': 'a', 'last_seen_timestamp': 10, 'token_expiration_timestamp': 1234567890}, {'_key': '2', 'device_name': 'b'}]
    
    :param devices: List of devices
    :param devices_meta: List of devices metadata
    """
    # Convert devices_meta into dictionaries for O(1) access
    last_seen_dict = {meta_entry[KEY]: meta_entry[LAST_SEEN_TIMESTAMP] for meta_entry in devices_meta if LAST_SEEN_TIMESTAMP in meta_entry}
    token_expiration_dict = {meta_entry[KEY]: meta_entry[TOKEN_EXPIRATION_TIMESTAMP] for meta_entry in devices_meta if TOKEN_EXPIRATION_TIMESTAMP in meta_entry}
    
    for device in devices:
        # Add last_seen_timestamp
        if device[KEY] in last_seen_dict:
            device[LAST_SEEN_TIMESTAMP] = last_seen_dict[device[KEY]]
        elif DEVICE_REGISTERED_TIMESTAMP in device:
            device[LAST_SEEN_TIMESTAMP] = device[DEVICE_REGISTERED_TIMESTAMP]
        
        # Add token_expiration_timestamp
        if device[KEY] in token_expiration_dict:
            device[TOKEN_EXPIRATION_TIMESTAMP] = token_expiration_dict[device[KEY]]

__public_key_cache = {}

async def public_keys_for_device(device_id, auth_header, async_kvstore_client):
    """
    Fetch the public keys for a given device, which can be then used to verify signatures or encrypt messages before
    sending.
    :param device_id: An un-encoded device id of the device
    :param auth_header: A valid splunk header, e.g. SplunkAuthHeader, BasicAuthHeader or JWTAuthHeader
    :param async_kvstore_client: AsyncKvStoreClient
    :return: A tuple of (signing_public_key, encryption_public_key), un-encoded
    """

    key_id = py23.urlsafe_b64encode_to_str(device_id)

    if key_id in __public_key_cache:
        return __public_key_cache[key_id]

    response = await async_kvstore_client.async_kvstore_get_request(DEVICE_PUBLIC_KEYS_COLLECTION_NAME,
                                                                    auth_header=auth_header,
                                                                    key_id=key_id)

    if response.code == HTTPStatus.OK:
        parsed = await response.json()
        result = (
            base64.b64decode(parsed['sign_public_key']),
            base64.b64decode(parsed['encrypt_public_key']))

        __public_key_cache[key_id] = result
        return result
    else:
        raise KeyNotFoundError(key_id, response.code)
