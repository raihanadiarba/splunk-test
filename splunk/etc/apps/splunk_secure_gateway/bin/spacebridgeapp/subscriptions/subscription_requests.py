"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Module for subscription_requests used by ssg_subscription_modular_input
"""

import json
import logging
from http import HTTPStatus

from spacebridgeapp.data.search_type import SearchType
from spacebridgeapp.data.subscription_data import SubscriptionSearch, Subscription
from spacebridgeapp.exceptions.spacebridge_exceptions import SpacebridgeApiRequestError
from spacebridgeapp.messages.request_context import RequestContext
from spacebridgeapp.request.dashboard_request_processor import fetch_dashboard_description
from spacebridgeapp.util.constants import SEARCHES_COLLECTION_NAME, \
    SUBSCRIPTIONS_COLLECTION_NAME, QUERY, VERSION, SUBSCRIPTION_VERSION_2, \
    SEARCH, AND_OPERATOR, SUBSCRIPTION_TYPE, SUBSCRIPTION_KEY


async def fetch_searches(log: logging.Logger,
                         owner: str,
                         auth_header, async_kvstore_client):
    query = {VERSION: SUBSCRIPTION_VERSION_2}
    params = {QUERY: json.dumps(query)}

    log.debug("Querying for searches, params=%s", params)

    searches = await _fetch_searches(log,
                                     owner,
                                     auth_header=auth_header,
                                     params=params,
                                     async_kvstore_client=async_kvstore_client)

    log.debug("Found active searches count=%d for user %s", len(searches), owner)

    return searches


async def _fetch_searches(log: logging.Logger,
                          owner: str,
                          auth_header, params=None, async_kvstore_client=None) -> list[SubscriptionSearch]:
    """
    Fetch all search objects from kvstore collection [searches]
    :param auth_header:
    :param params:
    :param async_kvstore_client:
    :return:
    """

    # Get all Searches so no input params
    response = await async_kvstore_client.async_kvstore_get_request(
        collection=SEARCHES_COLLECTION_NAME,
        params=params,
        owner=owner,
        auth_header=auth_header)

    searches = []
    if response.code == HTTPStatus.OK:
        response_json = await response.json()
        if response_json:
            searches = [SubscriptionSearch.from_json(search) for search in response_json]
    else:
        error = await response.text()
        log.error("Unable to fetch_all_searches. status_code=%s, error=%s", response.code, error)

    return searches


async def fetch_subscriptions(log: logging.Logger,
                              request_context: RequestContext,
                              subscription_id=None, search_key=None, async_kvstore_client=None):
    """
    Fetch subscription objects from kvstore collection [subscription] with search_key
    """
    if search_key:
        query = {AND_OPERATOR: [{SUBSCRIPTION_KEY: search_key}, {SUBSCRIPTION_TYPE: SEARCH}]}
        params = {QUERY: json.dumps(query)}
    else:
        query = {SUBSCRIPTION_TYPE: SEARCH}
        params = {QUERY: json.dumps(query)}

    response = await async_kvstore_client.async_kvstore_get_request(
        collection=SUBSCRIPTIONS_COLLECTION_NAME,
        owner=request_context.current_user,
        key_id=subscription_id,
        params=params,
        auth_header=request_context.auth_header)

    subscriptions = []
    if response.code == HTTPStatus.OK:
        response_json = await response.json()
        if isinstance(response_json, list):
            subscriptions = [Subscription.from_json(subscription) for subscription in response_json]
        else:
            if response_json:
                subscriptions.append(Subscription.from_json(response_json))
    else:
        error = await response.text()
        log.error("Unable to fetch_subscriptions. status_code=%s, error=%s, search_key=%s",
                  response.code, error, search_key)

    return subscriptions


async def validate_dashboard_search(log: logging.Logger,
                                    request_context: RequestContext,
                                    dashboard_id=None,
                                    type_id=None,
                                    search_type=SearchType.VISUALIZATION,
                                    input_tokens=None,
                                    async_kvstore_client=None,
                                    async_splunk_client=None,
                                    async_itsi_client=None):
    """
    Validation method to validate a dashboard_id and visualization_id.  Will except a SpacebridgeApiRequestError if
    issues are detected and return a dashboard_description if valid

    :param request_context:
    :param dashboard_id:
    :param type_id:
    :param search_type:
    :param input_tokens:
    :param async_kvstore_client:
    :param async_splunk_client:
    :param async_itsi_client:
    :return:
    """
    # Validate params
    if not dashboard_id or not type_id:
        error_message = f"Invalid Request Params dashboard_id={dashboard_id}, search_type_id={type_id}, " \
                        f"search_type={search_type}"
        raise SpacebridgeApiRequestError(error_message, status_code=HTTPStatus.BAD_REQUEST)

    log.info(f"Validating request_id={request_context.request_id}, "
             f"search_type={search_type}, "
             f"dashboard_id={dashboard_id}, "
             f"type_id={type_id}")

    # fetch dashboard body
    dashboard_description = await fetch_dashboard_description(log,
                                                              request_context=request_context,
                                                              dashboard_id=dashboard_id,
                                                              async_splunk_client=async_splunk_client,
                                                              async_kvstore_client=async_kvstore_client,
                                                              async_itsi_client=async_itsi_client)

    search = None
    if search_type == SearchType.VISUALIZATION:
        visualization = dashboard_description.get_visualization(type_id)
        if not visualization:
            error_message = f"Dashboard visualization not found. " \
                            f"dashboard_id={dashboard_id}, visualization_id={type_id}"
            log.info(error_message)
            raise SpacebridgeApiRequestError(error_message, status_code=HTTPStatus.NOT_FOUND)
        search = visualization.search
    elif search_type == SearchType.INPUT:
        input_token = dashboard_description.get_input_token_by_query_id(type_id)
        if not input_token:
            error_message = f"Input Search not found. dashboard_id={dashboard_id}, query_id={type_id}"
            log.info(error_message)
            raise SpacebridgeApiRequestError(error_message, status_code=HTTPStatus.NOT_FOUND)
        search = input_token.input_type.dynamic_options.search
    elif search_type == SearchType.DATA_SOURCE:
        datasources = [d for d in dashboard_description.definition.udf_data_sources if d.name == type_id]
        if len(datasources) != 1:
            raise SpacebridgeApiRequestError(
                f"Unexpected number of matching datasources in dashboard. Expected 1 but found {len(datasources)}",
                status_code=HTTPStatus.CONFLICT)

    # validate depends
    if search and not search.are_render_tokens_defined(input_tokens):
        error_message = f"Search is waiting for input. depends={search.depends}, rejects={search.rejects}, " \
                        f"dashboard_id={dashboard_id}, type_id={type_id}, search_type={search_type}"
        log.info(error_message)
        raise SpacebridgeApiRequestError(error_message, status_code=HTTPStatus.NOT_FOUND)

    return dashboard_description
