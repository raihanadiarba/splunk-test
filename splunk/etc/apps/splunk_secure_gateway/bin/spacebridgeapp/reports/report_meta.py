import logging
from typing import Optional

import json
from http import HTTPStatus
from spacebridgeapp.exceptions.spacebridge_exceptions import SpacebridgeApiRequestError
from spacebridgeapp.util.constants import REPORT_META_COLLECTION_NAME
from spacebridgeapp.data.report_data import ReportMeta
from spacebridgeapp.rest.clients.async_kvstore_client import AsyncKvStoreClient
from spacebridgeapp.messages.request_context import RequestContext
from spacebridgeapp.util.constants import KEY, QUERY
from spacebridgeapp.util.kvstore import build_containedin_clause


async def fetch_report_meta(request_context: RequestContext,
                            key_id: str,
                            async_kvstore_client: AsyncKvStoreClient = None) -> Optional[ReportMeta]:
    """
    Helper to fetch report_meta
    :param request_context:
    :param report_id:
    :param async_kvstore_client:
    :return: ReportMeta
    """

    response = await async_kvstore_client.async_kvstore_get_request(collection=REPORT_META_COLLECTION_NAME,
                                                                    auth_header=request_context.auth_header,
                                                                    owner=request_context.current_user,
                                                                    key_id=key_id)
    if response.code == HTTPStatus.OK:
        response_json = await response.json()
        if response_json and key_id:
            report_meta = ReportMeta.from_json(response_json)
            return report_meta
    elif response.code != HTTPStatus.NOT_FOUND:
        error = await response.text()
        error_message = "Failed to fetch Report Meta. status_code={}, error={}".format(response.code, error)
        raise SpacebridgeApiRequestError(message=error_message, status_code=response.code)

    return None


async def fetch_report_meta_list(request_context: RequestContext,
                                 report_ids: [str],
                                 async_kvstore_client: AsyncKvStoreClient = None,
                                 ) -> [ReportMeta]:
    """
    Helper to fetch report_meta list by report_ids list
    :param request_context:
    :param report_ids: specify report_id_keys to search for, defaults to all reports
    :param async_kvstore_client:
    :return: List of ReportMeta
    """

    if not report_ids:
        params = None
    else: 
        query = build_containedin_clause(KEY, report_ids)
        params = {QUERY: json.dumps(query)}

    response = await async_kvstore_client.async_kvstore_get_request(collection=REPORT_META_COLLECTION_NAME,
                                                                    auth_header=request_context.auth_header,
                                                                    owner=request_context.current_user,
                                                                    params=params)
    if response.code == HTTPStatus.OK:
        response_json = await response.json()
        return [ReportMeta.from_json(report_json) for report_json in response_json]
    elif response.code != HTTPStatus.NOT_FOUND:
        error = await response.text()
        error_message = f'Failed to fetch Report Meta. status_code={response.code}, error={error}'
        raise SpacebridgeApiRequestError(message=error_message, status_code=response.code)

    return []


async def set_report_meta(log: logging.Logger,
                          request_context: RequestContext,
                          report_meta: ReportMeta = None,
                          async_kvstore_client: AsyncKvStoreClient = None) -> None:
    """
    Helper to set report_meta object
    """
    # Get report_meta collection if key exists
    key_id = report_meta.key()
    response = await fetch_report_meta(request_context=request_context,
                                       key_id=key_id,
                                       async_kvstore_client=async_kvstore_client)

    # if key doesn't exist we create new key, otherwise update existing one
    if response is None:
        # Create new report_meta collection
        response = await async_kvstore_client.async_kvstore_post_request(
            collection=REPORT_META_COLLECTION_NAME,
            data=report_meta.to_json(),
            owner=request_context.current_user,
            auth_header=request_context.system_auth_header)
    else:
        # Update existing collection
        response = await async_kvstore_client.async_kvstore_post_request(
            collection=REPORT_META_COLLECTION_NAME,
            data=report_meta.to_json(),
            key_id=key_id,  # To update a collection we need to specify the key
            owner=request_context.current_user,
            auth_header=request_context.system_auth_header)

    # Report any errors
    if response.code != HTTPStatus.OK and response.code != HTTPStatus.CREATED:
        error = await response.text()
        error_message = "Failed Report Set Request. status_code={}, error={}".format(response.code, error)
        raise SpacebridgeApiRequestError(message=error_message, status_code=response.code)

    response_json = await response.json()
    report_id = response_json.get(KEY)
    log.info("Successful Report Set Request. report_id={}".format(report_id))
    return report_id
