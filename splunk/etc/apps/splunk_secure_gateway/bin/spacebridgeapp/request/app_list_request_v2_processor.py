"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Module to process App List V2 Requests
"""
import asyncio
import logging
from typing import List, Tuple

import aiohttp
from http import HTTPStatus
from spacebridgeapp.data.app_list_data import App, AppV2
from spacebridgeapp.messages.request_context import RequestContext
from spacebridgeapp.rest.clients.async_client_factory import AsyncClientFactory
from spacebridgeapp.rest.clients.async_splunk_client import AsyncSplunkClient
from spacebridgeapp.rest.clients.async_kvstore_client import AsyncKvStoreClient
from spacebridgeapp.rest.clients.async_itsi_client import AsyncITSIClient
from spacebridgeapp.request.app_list_request_processor import fetch_dashboard_app_list_with_default
from spacebridgeapp.exceptions.spacebridge_exceptions import SpacebridgeApiRequestError
from spacebridgeapp.util.config import load_config
from spacebridgeapp.util.asyncio_utils import create_semaphore
from spacebridgeapp.request.dashboard_request_v2_processor import fetch_dashboard_list_json_v2
from spacebridgeapp.glass_table.glass_table_request_processor import get_glass_table_api_params

# Search constants
DEFAULT_COUNT = 1000

async def process_app_list_request_v2(log: logging.Logger,
                                   request_context: RequestContext,
                                   client_single_request,
                                   server_single_response,
                                   async_client_factory: AsyncClientFactory):
    """
    This method will create an async http request to splunk api and returns a list of app names and their corresponding
    display app names, dashboard tagging status, dashboard count (optional), and report count (optional)
    in a single_server_response object

    :param log:
    :param request_context:
    :param client_single_request: incoming request
    :param single_server_response: outgoing response
    :param async_client_factory: async client used to make https request
    :return:
    """
    log.info("Start populating response for app list request v2")

    include_dashboard_count = client_single_request.appListRequestV2.includeDashboardCount
    include_report_count = client_single_request.appListRequestV2.includeReportCount
    offset = client_single_request.appListRequestV2.offset
    max_results = client_single_request.appListRequestV2.maxResults

    if max_results == 0:
        max_results = DEFAULT_COUNT

    # fetch app lists
    (total, app_list, continuation_available) = await fetch_apps_v2(log=log,
                                                            request_context=request_context,
                                                            include_dashboard_count=include_dashboard_count,
                                                            include_report_count=include_report_count,
                                                            offset=offset, max_results=max_results,
                                                            async_client_factory=async_client_factory)

    app_protos = [app.to_protobuf() for app in app_list]

    # populate app list response
    server_single_response.appListResponseV2.apps.extend(app_protos)
    server_single_response.appListResponseV2.offset = offset
    server_single_response.appListResponseV2.maxResults = max_results
    server_single_response.appListResponseV2.count = len(app_protos)
    server_single_response.appListResponseV2.total = total


    server_single_response.appListResponseV2.continuation.SetInParent()
    server_single_response.appListResponseV2.continuation.nextOffset = offset + len(app_protos)
    server_single_response.appListResponseV2.continuation.hasNextPage = continuation_available

    log.info("Finished populating response for app list request v2")


async def fetch_apps_v2(log: logging.Logger,
                        request_context: RequestContext,
                        include_dashboard_count: bool,
                        include_report_count: bool,
                        offset: int,
                        max_results: int,
                        async_client_factory: AsyncClientFactory,
                        app_id=None) -> Tuple[int, List[App], bool]:
    """
    Method makes async http call to get app list and returns their app names, display app names,
    dashboard tagging status, dashboard count (optiona), and report count (optional)
    :param log:
    :param request_context:
    :param app_id: Use if you only want to fetch details for a specific app
    :param async_splunk_client:
    :return:
    """
    log.info('fetch_apps_v2 for app list request v2')

    # async clients
    async_splunk_client = async_client_factory.splunk_client()
    async_kvstore_client = async_client_factory.kvstore_client()

    # retrieve all apps accessible to the user
    params = {'output_mode': 'json',
              'search': '(visible = true AND disabled = false)',
              'count': max_results,
              'offset': offset}

    response = await async_splunk_client.async_get_app_list_request(auth_header=request_context.auth_header,
                                                                    app_id=app_id,
                                                                    params=params)

    if response.code != HTTPStatus.OK:
        response_text = await response.text()
        raise SpacebridgeApiRequestError(
            f'Failed fetch_apps_v2 response.code={response.code}, response.text={response_text}',
            status_code=response.code)

    # convert to json object
    response_json = await response.json()
    total = response_json.get('paging', {}).get('total')
    entry_json_list = response_json.get('entry', [])
    log.debug(f'fetch_apps_v2 response={[app.get("name") for app in entry_json_list]}, total={total}, code={response.code}')

    # retrieve all apps shown on the dashboard tab
    dashboard_app_list = await fetch_dashboard_app_list_with_default(log=log,
                                                                     request_context=request_context,
                                                                     async_kvstore_client=async_kvstore_client,
                                                                     async_splunk_client=async_splunk_client)

    # Create async tasks for all apps
    config = load_config(request_context.system_auth_header.session_token)
    semaphore = create_semaphore(config)

    # Create tasks for concurrent processing
    tasks = []
    for entry_json in entry_json_list:
        task = _fetch_counters_for_app(semaphore,
                                       entry_json,
                                       include_dashboard_count,
                                       include_report_count,
                                       async_client_factory,
                                       request_context,
                                       log,
                                       dashboard_app_list)
        tasks.append(task)

    # Execute all tasks concurrently and collect results
    app_list = await asyncio.gather(*tasks)

    continuation_available = offset + len(app_list) < total

    return (total, app_list, continuation_available)


async def _fetch_counters_for_app(semaphore: asyncio.Semaphore,
                                  entry_json: dict,
                                  include_dashboard_count: bool,
                                  include_report_count: bool,
                                  async_client_factory: AsyncClientFactory,
                                  request_context: RequestContext,
                                  log: logging.Logger,
                                  dashboard_app_list: list[str]) -> AppV2:
    async with semaphore:
        app_name = entry_json.get('name')
        content = entry_json.get('content')
        label = content.get('label')
        author = content.get('author')
        dashboard_count = 0
        total_report_count = 0
        scheduled_report_count = 0

        is_dashboard_hidden = app_name not in dashboard_app_list

        # async rest clients
        async_splunk_client = async_client_factory.splunk_client()
        async_kvstore_client = async_client_factory.kvstore_client()
        async_itsi_client = async_client_factory.itsi_client()

        # retrieve dashboard count
        if include_dashboard_count:
            dashboard_count = await fetch_dashboard_count_for_app(log,
                                                                  request_context=request_context,
                                                                  app_name=app_name,
                                                                  async_splunk_client=async_splunk_client,
                                                                  async_kvstore_client=async_kvstore_client,
                                                                  async_itsi_client=async_itsi_client)

        # retrieve report counts
        if include_report_count:
            total_report_count = await fetch_report_count_for_app(log,
                                                                  request_context=request_context,
                                                                  app_name=app_name,
                                                                  scheduled=False,
                                                                  async_splunk_client=async_splunk_client)

            scheduled_report_count = await fetch_report_count_for_app(log,
                                                                      request_context=request_context,
                                                                      app_name=app_name,
                                                                      scheduled=True,
                                                                      async_splunk_client=async_splunk_client)

        app = AppV2(app_name=app_name,
                    display_app_name=label,
                    author=author,
                    is_dashboard_hidden=is_dashboard_hidden,
                    dashboard_count=dashboard_count,
                    total_report_count=total_report_count,
                    scheduled_report_count=scheduled_report_count)
        return app


async def fetch_dashboard_count_for_app(log: logging.Logger,
                                        request_context: RequestContext,
                                        app_name: str,
                                        async_splunk_client: AsyncSplunkClient,
                                        async_kvstore_client: AsyncKvStoreClient,
                                        async_itsi_client: AsyncITSIClient) -> int:
    """
    Method returns total dashboard count for specified app
    :param log:
    :param request_context:
    :param app_name:
    :param async_splunk_client:
    :return:
    """
    # get dashboard count
    total, dashboards, continuation_available = await fetch_dashboard_list_json_v2(log,
                                                                                    request_context=request_context,
                                                                                    max_results=1,
                                                                                    app_names=[app_name],
                                                                                    async_splunk_client=async_splunk_client,
                                                                                    async_kvstore_client=async_kvstore_client)

    # get glass table count
    params = get_glass_table_api_params()
    glass_table_count = await async_itsi_client.async_get_glass_table_count(auth_header=request_context.auth_header,
                                                                            params=params)

    total += glass_table_count
    log.debug(f'fetch_dashboard_count_for_app app_name={app_name}, total={total}')

    return total


async def fetch_report_count_for_app(log: logging.Logger,
                                    request_context: RequestContext,
                                    app_name: str,
                                    async_splunk_client: AsyncSplunkClient,
                                    scheduled: bool = False) -> int:
    """
    Method returns report count for specified app
    :param log:
    :param request_context:
    :param app_name:
    :param async_splunk_client:
    :param scheduled: set to True to find count of scheduled reports only
    :return:
    """

    log.debug("Processing fetch report count request")

    response: aiohttp.ClientResponse = await async_splunk_client.async_get_reports(request_context.auth_header,
                                                                                    request_context.current_user,
                                                                                    max_results=1,
                                                                                    app_name=app_name,
                                                                                    scheduled=scheduled)

    if response.code != HTTPStatus.OK:
        message = await response.text()
        raise SpacebridgeApiRequestError(
            f'Failed to fetch report list with error={message}',
            status_code=response.code)

    jsn = await response.json()
    total = jsn["paging"]["total"]

    return total
