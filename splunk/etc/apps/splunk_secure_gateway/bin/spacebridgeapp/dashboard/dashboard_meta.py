"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Module to retrieve dashboard_meta
"""
import logging

import json
import sys
import urllib.parse as urllib
from http import HTTPStatus
from spacebridgeapp.data.dashboard_data import UserDashboardMeta
from spacebridgeapp.rest.clients.async_kvstore_client import AsyncKvStoreClient
from spacebridgeapp.exceptions.spacebridge_exceptions import SpacebridgeApiRequestError
from spacebridgeapp.util.constants import DASHBOARD_META_COLLECTION_NAME, KEY, QUERY
from spacebridgeapp.util.kvstore import build_containedin_clause



async def fetch_dashboard_meta(request_context,
                               dashboard_id=None,
                               async_kvstore_client=None):
    """
    Helper to fetch dashboard_meta
    :param request_context:
    :param dashboard_id:
    :param async_kvstore_client:
    :return:
    """
    # Only set the key_id if a dashboard_id is provided
    key_id = urllib.quote_plus(dashboard_id) if dashboard_id else None
    response = await async_kvstore_client.async_kvstore_get_request(collection=DASHBOARD_META_COLLECTION_NAME,
                                                                    auth_header=request_context.auth_header,
                                                                    owner=request_context.current_user,
                                                                    key_id=key_id)
    if response.code == HTTPStatus.OK:
        response_json = await response.json()
        if response_json and dashboard_id:
            dashboard_meta = UserDashboardMeta.from_json(response_json)
            return dashboard_meta
        # If the response is the whole meta collection, return a list of dashboard metas
        elif response_json and dashboard_id is None:
            dashboard_meta = {}
            for meta in response_json:
                meta_obj = UserDashboardMeta.from_json(meta)
                dashboard_meta[meta_obj.dashboard_id()] = meta_obj
            return dashboard_meta
    elif response.code != HTTPStatus.NOT_FOUND:
        error = await response.text()
        error_message = f'Failed to fetch Dashboard Meta. status_code={response.code}, error={error}'
        raise SpacebridgeApiRequestError(message=error_message, status_code=response.code)

    # Return None no data if meta isn't available
    return None

async def fetch_dashboard_meta_list(request_context,
                                    dashboard_ids: [str],
                                    async_kvstore_client: AsyncKvStoreClient = None) -> [UserDashboardMeta]:
    """
    Helper to fetch dashboard_meta list by dashboard_ids key list
    :param request_context:
    :param dashboard_ids: specify dashboard_id keys to search for, defaults to all reports
    :param async_kvstore_client:
    :return: List of UserDashboardMeta
    """

    if not dashboard_ids:
        params = None
    else:
        query = build_containedin_clause(KEY, dashboard_ids)
        params = {QUERY: json.dumps(query)}

    response = await async_kvstore_client.async_kvstore_get_request(collection=DASHBOARD_META_COLLECTION_NAME,
                                                                    auth_header=request_context.auth_header,
                                                                    owner=request_context.current_user,
                                                                    params=params)
    if response.code == HTTPStatus.OK:
        response_json = await response.json()
        return [UserDashboardMeta.from_json(report_json) for report_json in response_json]
    elif response.code != HTTPStatus.NOT_FOUND:
        error = await response.text()
        error_message = f'Failed to fetch Dashboard Meta List. status_code={response.code}, error={error}'
        raise SpacebridgeApiRequestError(message=error_message, status_code=response.code)

    return []


async def set_dashboard_meta(log: logging.Logger,
                             request_context, dashboard_meta: UserDashboardMeta, async_kvstore_client):
    """
    Helper to set dashboard_meta object
    """
    # Get dashboard_meta collection if key exists
    dashboard_id = dashboard_meta.dashboard_id()
    response = await fetch_dashboard_meta(request_context=request_context,
                                          dashboard_id=dashboard_id,
                                          async_kvstore_client=async_kvstore_client)

    # if key doesn't exist we create new key, otherwise update existing one
    if response is None:
        # Create new dashboard_meta collection
        response = await async_kvstore_client.async_kvstore_post_request(
            collection=DASHBOARD_META_COLLECTION_NAME,
            data=dashboard_meta.to_json(),
            owner=request_context.current_user,
            auth_header=request_context.system_auth_header)
    else:
        # Update existing collection
        response = await async_kvstore_client.async_kvstore_post_request(
            collection=DASHBOARD_META_COLLECTION_NAME,
            data=dashboard_meta.to_json(),
            key_id=urllib.quote_plus(dashboard_id),  # To update a collection we need to specify the key
            owner=request_context.current_user,
            auth_header=request_context.system_auth_header)

    # Report any errors
    if response.code != HTTPStatus.OK and response.code != HTTPStatus.CREATED:
        error = await response.text()
        error_message = "Failed Dashboard Set Request. status_code={}, error={}".format(response.code, error)
        raise SpacebridgeApiRequestError(message=error_message, status_code=response.code)

    response_json = await response.json()
    dashboard_id = response_json.get('_key')
    log.info("Successful Dashboard Set Request. dashboard_id=%s", dashboard_id)
    return dashboard_id
