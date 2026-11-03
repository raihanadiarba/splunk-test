"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.
"""
import logging
import json
from http import HTTPStatus
from spacebridgeapp.util.constants import ALERT_RECIPIENTS, CONFIGURATION, ALL_USERS
from spacebridgeapp.util import constants
from dataclasses import dataclass
from typing import List


@dataclass(frozen=True, eq=True)
class DeviceUserPair:
    device: str
    user: str


async def get_registered_devices(log: logging.Logger,
                                 request_context, async_kvstore_client, alert_payload):
    """
    Fetch all registered devices for all users asynchronously across users
    """
    configuration = alert_payload[CONFIGURATION]

    # If all users is selected
    if configuration and ALERT_RECIPIENTS in configuration.keys() and configuration[ALERT_RECIPIENTS] == ALL_USERS:
        log.info("getting devices for all users")
        users = await fetch_devices(log, request_context, async_kvstore_client)
        return users

    # if a specific role is selected
    elif configuration and ALERT_RECIPIENTS in configuration.keys():
        role = configuration[ALERT_RECIPIENTS]
        log.info("getting users for role=%s" % str(role))
        try:
            users = await fetch_devices(log, request_context, async_kvstore_client, role=role)
            return users
        except Exception:
            log.exception("Unexpected exception getting registered devices")

    # If nothing is selected, return an empty list
    else:
        return []


async def fetch_devices(log: logging.Logger, request_context, async_kvstore_client, role=None) -> List[DeviceUserPair]:
    """
    Given a role, fetch all devices reigstered to users belonging to given role. If no role is specified, fetch all
    devices
    """
    log.info("fetching devices by role=%s" % str(role))
    params = build_query_params(role)

    response = await async_kvstore_client.async_kvstore_get_request(constants.DEVICE_ROLES_COLLECTION_NAME,
                                                                    auth_header=request_context.auth_header,
                                                                    params=params)

    if response.code == HTTPStatus.OK:
        jsn = await response.json()
        if type(jsn) == list and len(jsn) > 0:
            most_recent_timestamp = jsn[0][constants.TIMESTAMP]
            result = [DeviceUserPair(row.get(constants.DEVICE_ID, ''), row.get(constants.USER, '')) for row in jsn if
                      row.get(constants.TIMESTAMP) == most_recent_timestamp]
            log.debug("fetch_devices complete, devices=%s", result)
            return result

    text = await response.text()
    log.info("Received empty or unsuccessful response from kvstore with response.code=%s, %s",
             str(response.code), str(text))
    return []


def build_query_params(role):
    params = {constants.SORT: "%s:%d" % (constants.TIMESTAMP, -1)}

    if role:
        query = {constants.ROLE: role}
        params[constants.QUERY] = json.dumps(query)

    return params
