"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Module which handles updating the device role mapping kvstore table
"""

import json
import logging

from http import HTTPStatus
from spacebridgeapp.request.splunk_auth_header import SplunkAuthHeader
from spacebridgeapp.util import constants
from spacebridgeapp.util.time_utils import get_current_timestamp
from spacebridgeapp.util.app_info import appid_has_alert_support


async def update(log: logging.Logger,
                 session_token, async_kvstore_client, async_splunk_client):
    """
    Update the devices to role mapping collection in KV Store
    """
    timestamp = get_current_timestamp()
    splunk_auth_header = SplunkAuthHeader(session_token)

    # for each user, fetch user to roles mapping
    response_code, user_to_role_dict = await async_splunk_client.async_get_users_roles_mapping(splunk_auth_header)

    log.debug("Fetched user role mapping with response code=%s, %s" % (str(response_code), str(user_to_role_dict)))

    # For each user fetch devices registered to that user
    registered_devices_jsn = await get_registered_devices(log, splunk_auth_header, list(user_to_role_dict.keys()),
                                                          async_kvstore_client)

    # Construct kvstore payload
    batch_payload = create_payloads(log, registered_devices_jsn, user_to_role_dict, timestamp)
    batch_post_to_kvstore(log, session_token, batch_payload)
    await clean_up_old_entries(log, timestamp, async_kvstore_client, session_token)


async def clean_up_old_entries(log: logging.Logger,
                               timestamp, async_kvstore_client, session_token):
    """
    Delete entries in the devices to roles mapping collection older than input timestamp
    """
    try:
        query = {constants.OR_OPERATOR:
            [
                {constants.TIMESTAMP: {constants.LESS_THAN_OPERATOR: timestamp}},
                {constants.TIMESTAMP: {constants.GREATER_THAN_OPERATOR: timestamp}}
            ]
        }
        params = {constants.QUERY: json.dumps(query)}
        r = await async_kvstore_client.async_kvstore_delete_request(collection=constants.DEVICE_ROLES_COLLECTION_NAME,
                                                                    auth_header=SplunkAuthHeader(session_token),
                                                                    params=params)
        log.debug("finished deleting old entry with code=%s" % str(r.code))
    except Exception:
        log.exception("exception deleting old entries")


async def get_registered_devices(log: logging.Logger,
                                 auth_header, user_list, async_kvstore_client):
    """
    fetch list of devices for a list of users
    """
    devices = []
    log.info("fetching registered devices with user_list=%s", user_list)
    for user in user_list:
        log.debug("current_user, value=%s", user)
        r = await async_kvstore_client.async_kvstore_get_request(constants.REGISTERED_DEVICES_COLLECTION_NAME, owner=user,
                                                                 auth_header=auth_header)
        if r.code == HTTPStatus.OK:
            user_devices = await r.json()
            log.debug("current_user devices list, user=%s, len=%s", user, len(devices))
            for device in user_devices:
                app_id = device.get(constants.APP_ID, '')
                app_alert_support = appid_has_alert_support(device.get(constants.APP_ID, ''))
                legacy_app = device.get(constants.DEVICE_TYPE, None) == constants.ALERTS_IOS
                log.debug("device, owner=%s, id=%s, app_id=%s, app_alert_support=%s, legacy_app=%s", user,
                            device.get('device_id'), app_id, app_alert_support, legacy_app)
                if app_alert_support or legacy_app:
                    devices.append(device)
        else:
            log.warning("Failed to fetch devices for user=%s with status_code=%s", user, r.code)
    log.debug("get_registered_devices, value=%s", devices)
    return devices


def create_payloads(log: logging.Logger,
                    registered_devices, user_to_role_mapping, timestamp):
    """
    Given a list of devices and a mapping of user to roles, create the payload to be inserted in KV Store
    """
    payload = []
    log.debug("creating payloads for registered devices, value=%s", registered_devices)

    for device in registered_devices:
        user = device[constants.USER_KEY]
        if user not in user_to_role_mapping.keys():
            log.warning("user not in role mapping, user=%s, role_mapping_keys=%s", user, user_to_role_mapping.keys())
            continue

        for role in user_to_role_mapping[user]:
            payload.append({
                constants.USER: user,
                constants.ROLE: role,
                constants.DEVICE_ID: device[constants.DEVICE_ID],
                constants.TIMESTAMP: timestamp
            })

    log.debug("finished creating payloads, value=%s", payload)
    return payload


def batch_post_to_kvstore(log: logging.Logger, session_token, payload):
    try:
        from spacebridgeapp.util.kvstore import KVStoreBatchWriter
        KvBatchStorer = KVStoreBatchWriter(namespace=constants.SPACEBRIDGE_APP_NAME,
                                           collection=constants.DEVICE_ROLES_COLLECTION_NAME)
        r = KvBatchStorer.batch_save(session_token, constants.NOBODY, payload)
        log.debug("batch storer num_stored=%s" % str(len(r)))
    except Exception:
        log.exception("Exception during batch upload of role to device mapping")
