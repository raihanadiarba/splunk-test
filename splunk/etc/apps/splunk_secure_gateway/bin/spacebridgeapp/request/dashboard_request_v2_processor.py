"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Module to process Dashboard Requests
"""
import json
import logging
import time
import urllib.parse as urllib
from typing import List

import spacebridgeapp.dashboard.parse_data as parse
from spacebridgeapp.data.dashboard_data import DashboardDescription
from spacebridgeapp.exceptions.spacebridge_exceptions import SpacebridgeApiRequestError
from spacebridgeapp.util import constants
from spacebridgeapp.dashboard.dashboard_meta import fetch_dashboard_meta, fetch_dashboard_meta_list
from spacebridgeapp.dashboard.dashboard_request_json import fetch_dashboard_list_for_app
from spacebridgeapp.util.config import load_config
from spacebridgeapp.metrics.dashboard_request_metrics import send_dashboard_list_request_metrics_to_telemetry
from spacebridgeapp.request.app_list_request_processor import fetch_dashboard_app_list_with_default
from spacebridgeapp.glass_table.glass_table_request_processor import append_glass_table_descriptions
from spacebridgeapp.tags.dashboard_tag_util import get_dashboard_tags, get_tagging_config_map
from spacebridgeapp.search.search_job_params import create_dashboard_report_search_query
from spacebridgeapp.messages.request_context import RequestContext
from spacebridgeapp.rest.clients.async_kvstore_client import AsyncKvStoreClient
from spacebridgeapp.rest.clients.async_splunk_client import AsyncSplunkClient
from spacebridgeapp.rest.clients.async_itsi_client import AsyncITSIClient
from spacebridgeapp.rest.clients.async_client_factory import AsyncClientFactory
from spacebridgeapp.metrics.telemetry_client import AsyncTelemetryClient


# API Name Constants
DASHBOARD_LIST_REQUEST_V2 = "DASHBOARD_LIST_REQUEST_V2"
GLOBAL_APP_SEARCH = '-'

async def process_dashboard_list_request_v2(log: logging.Logger,
                                         request_context: RequestContext,
                                         client_single_request,
                                         server_single_response,
                                         async_client_factory: AsyncClientFactory):
    """
    This method will process dashboardListRequestV2, creating an async http request
    to splunk api data/ui/views and returning a list of DashboardDescription
    protos in a single_server_response object.

    :param log:
    :param request_context:
    :param client_single_request: incoming request
    :param single_server_response: outgoing response
    :param async_client_factory: async client used to make https request
    :return:
    """

    log.info("Start populating response for dashboard list request v2")
    offset = client_single_request.dashboardListRequestV2.offset
    max_results = client_single_request.dashboardListRequestV2.maxResults
    dashboard_ids = client_single_request.dashboardListRequestV2.dashboardIds
    minimal_list = client_single_request.dashboardListRequestV2.minimalList
    is_ar = client_single_request.dashboardListRequestV2.isAR
    app_name = client_single_request.dashboardListRequestV2.appName
    search_term = client_single_request.dashboardListRequestV2.searchTerm
    is_favorite = client_single_request.dashboardListRequestV2.isFavorite
    useragent = client_single_request.userAgent

    # async clients
    async_splunk_client = async_client_factory.splunk_client()
    async_kvstore_client = async_client_factory.kvstore_client()
    async_telemetry_client = async_client_factory.telemetry_client()
    async_itsi_client = async_client_factory.itsi_client()

    # Measure time taken to execute dashboard list request
    time_before = time.time()

    # retrieve favorite dashboard_ids
    search_dashboard_ids = dashboard_ids
    if is_favorite:
        favorite_dashboard_ids = await _fetch_favorite_dashboard_ids(request_context=request_context,
                                                                     dashboard_ids=dashboard_ids,
                                                                     async_kvstore_client=async_kvstore_client)

        log.debug(f'Fetched favorite dashboard ids: {favorite_dashboard_ids}')

        # if no favorites were found
        if len(favorite_dashboard_ids) <= 0:
            # telemetry metrics
            time_after = time.time()
            await send_metrics(log, request_context, async_telemetry_client, useragent,
                                time_before, time_after)

            _populate_dashboard_list_response_v2(log=log, server_single_response=server_single_response,
                                                 dashboards=[], dashboard_ids=dashboard_ids,
                                                 max_results=max_results, total=0, offset=offset,
                                                 minimal_list=minimal_list, is_ar=is_ar,
                                                 continuation_available=False)
            return

        search_dashboard_ids = favorite_dashboard_ids

    # fetch dashboard bodies
    dashboard_bodies, total, continuation_available = await fetch_dashboard_descriptions_v2(log, request_context=request_context,
                                                                                        offset=offset, max_results=max_results,
                                                                                        dashboard_ids=search_dashboard_ids,
                                                                                        minimal_list=minimal_list, is_ar=is_ar,
                                                                                        app_name=app_name, search_term=search_term,
                                                                                        async_splunk_client=async_splunk_client,
                                                                                        async_kvstore_client=async_kvstore_client,
                                                                                        async_itsi_client=async_itsi_client)

    # telemetry metrics
    time_after = time.time()
    await send_metrics(log, request_context, async_telemetry_client, useragent,
                       time_before, time_after)

    log.info(f'Fetch dashboard list size={len(dashboard_bodies)}')

    # populate dashboard list response
    _populate_dashboard_list_response_v2(log=log,
                                         server_single_response=server_single_response,
                                         dashboards=dashboard_bodies, dashboard_ids=dashboard_ids,
                                         max_results=max_results, total=total, offset=offset,
                                         minimal_list=minimal_list,is_ar=is_ar,
                                         continuation_available=continuation_available)


async def send_metrics(log: logging.Logger, request_context: RequestContext,
                       async_telemetry_client: AsyncTelemetryClient, useragent,
                       time_before: int, time_after: int):

    latency = (time_after - time_before) * 1000.0
    log.info(f'Time taken to execute dashboard list request v2: {latency:0.3f}ms')
    await send_dashboard_list_request_metrics_to_telemetry(log, DASHBOARD_LIST_REQUEST_V2, latency, request_context,
                                                           async_telemetry_client, useragent=useragent)


def _populate_dashboard_list_response_v2(log: logging.Logger,
                                         server_single_response,
                                         dashboards: [DashboardDescription],
                                         dashboard_ids: [str],
                                         max_results: int,
                                         total: int,
                                         offset: int,
                                         minimal_list: bool,
                                         is_ar: bool,
                                         continuation_available: bool) -> None:

    """
    Populate dashboard list response v2
    """
    server_single_response.dashboardListResponseV2.dashboards.extend([dashboard.to_protobuf() for dashboard in dashboards])
    server_single_response.dashboardListResponseV2.offset = offset
    server_single_response.dashboardListResponseV2.maxResults = max_results
    server_single_response.dashboardListResponseV2.count = len(dashboards)
    server_single_response.dashboardListResponseV2.dashboardIds.extend(dashboard_ids)
    server_single_response.dashboardListResponseV2.total = total
    server_single_response.dashboardListResponseV2.minimalList = minimal_list
    server_single_response.dashboardListResponseV2.isAR = is_ar

    server_single_response.dashboardListResponseV2.continuation.SetInParent()
    server_single_response.dashboardListResponseV2.continuation.nextOffset = offset + len(dashboards)
    server_single_response.dashboardListResponseV2.continuation.hasNextPage = continuation_available

    log.info("Finished populating response for dashboard list request v2")


async def fetch_dashboard_descriptions_v2(log: logging.Logger,
                                       request_context: RequestContext,
                                       offset: int = 0,
                                       max_results: int = 0,
                                       dashboard_ids: [str] = None,
                                       minimal_list: bool = False,
                                       is_ar: bool = False,
                                       app_name: str = None,
                                       search_term: str = None,
                                       default_app_names: [str] = None,
                                       async_splunk_client: AsyncSplunkClient = None,
                                       async_kvstore_client: AsyncKvStoreClient = None,
                                       async_itsi_client: AsyncITSIClient = None):
    """
    Method makes async http call to get dashboard list and return a list of DashboardDescription objects.

    :param log:
    :param request_context:
    :param offset: starting position to retrieve dashboards
    :param max_results: maximum number of dashboards per page
    :param dashboard_ids: set of dashboard IDs to retrieve
    :param minimal_list: return light dashboard descriptions if true (exclude dashboard definition)
    :param is_ar: only fetch dashboard description if dashboard is AR compatible
    :param app_name: if specified, only fetch dashboards from app_name, defaults to all apps
    :param search_term: if specified, only fetches dashboards whose names match search_term
    :param default_app_names: A default list app_names to filter if none is found in kvstore
    :param async_splunk_client:
    :param async_kvstore_client:
    :param async_itsi_client:
    :return:
    """

    if dashboard_ids is None:
        dashboard_ids = []

    if default_app_names is None:
        default_app_names = []

    config = load_config(request_context.system_auth_header.session_token)

    # Set max_results to dashboard_list_max_count if specified in securegateway.conf
    max_results = max_results if max_results != 0 else config.get_dashboard_list_max_count()

    # Fetch dashboard_app_list, default is [] if list not found or not specified
    app_names = [app_name] if app_name else await fetch_dashboard_app_list_with_default(log,
                                                                                        request_context=request_context,
                                                                                        default_app_names=default_app_names,
                                                                                        async_kvstore_client=async_kvstore_client,
                                                                                        async_splunk_client=async_splunk_client)

    total, dashboards_result, continuation_available = await fetch_dashboard_list_json_v2(log=log,
                                                                                            request_context=request_context,
                                                                                            offset=offset,
                                                                                            max_results=max_results,
                                                                                            dashboard_ids=dashboard_ids,
                                                                                            minimal_list=minimal_list,
                                                                                            search_term=search_term,
                                                                                            app_names=app_names,
                                                                                            async_splunk_client=async_splunk_client,
                                                                                            async_kvstore_client=async_kvstore_client)

    log.debug(f'fetch_dashboard_list_json_v2 total_length={total}, is_ar={is_ar}, minimal_list={minimal_list}, offset={offset}, ' \
        f'max_results={max_results}, dashboard_ids={dashboard_ids}, default_app_names={default_app_names}')

    dashboard_list = []

    # Process Dashboards from regular Splunk views endpoint
    for entry_json in dashboards_result:
        try:
            dashboard_description = await parse.to_dashboard_description(log,
                                                                        entry_json,
                                                                        is_ar=is_ar,
                                                                        request_context=request_context,
                                                                        async_splunk_client=async_splunk_client,
                                                                        minimal=minimal_list)
            if dashboard_description:
                dashboard_list.append(dashboard_description)
        except Exception as e:
            log.warning(f'Unable to parse dashboard description dashboard_id={entry_json["id"]}, exception={e}')

    # Append ITSI Glass Tables if available, will append descriptions to dashboard_list and update metadata
    dashboard_list, total, continuation_available = await append_glass_table_descriptions(log,
                                                                                          request_context=request_context,
                                                                                          dashboard_list=dashboard_list,
                                                                                          total=total,
                                                                                          continuation_available=continuation_available,
                                                                                          offset=offset,
                                                                                          max_results=max_results,
                                                                                          app_names=app_names,
                                                                                          dashboard_ids=dashboard_ids,
                                                                                          async_itsi_client=async_itsi_client,
                                                                                          minimal=minimal_list)

    # Fetch dictionary of dashboard metas
    if async_kvstore_client is not None:
        dashboard_meta_dict = await fetch_dashboard_meta(request_context=request_context,
                                                         async_kvstore_client=async_kvstore_client)
        if dashboard_meta_dict:
            for description in dashboard_list:
                if description.dashboard_id in dashboard_meta_dict:
                    description.is_favorite = dashboard_meta_dict[description.dashboard_id].is_favorite

    return_tuple = (dashboard_list, total, continuation_available)
    return return_tuple


async def fetch_dashboard_list_json_v2(log: logging.Logger,
                                    request_context: RequestContext,
                                    offset: int = 0,
                                    max_results: int = 0,
                                    app_names: List[str] = None,
                                    dashboard_ids: List[str] = None,
                                    search_term: str = None,
                                    async_splunk_client: AsyncSplunkClient = None,
                                    async_kvstore_client: AsyncKvStoreClient = None,
                                    minimal_list: bool = False):
    """
    Fetch the dashboard list json Splunk api /data/ui/views
    :param log:
    :param request_context:
    :param offset:
    :param max_results:
    :param app_names:
    :param dashboard_ids:
    :param search_term:
    :param dashboard_tags:
    :param tagging_config_map:
    :param async_splunk_client:
    :param async_kvstore_client:
    :param minimal_list: Causes the API to be called with digest=1, should be used if dashboard structure is not needed
    :return:
    """

    if app_names is None or len(app_names) == 0:
        app_names = [GLOBAL_APP_SEARCH]
        continuation_available = True

    # Fetch the tags associated with the requesting client device
    dashboard_tags = await get_dashboard_tags(log,
                                            request_context=request_context,
                                            async_splunk_client=async_splunk_client,
                                            async_kvstore_client=async_kvstore_client)

    log.debug(f'fetch_dashboard_list_json_v2 fetched dashboard_tags: {dashboard_tags}')

    # Fetch the 'enable' status of tagging feature by app_id
    tagging_config_map = await get_tagging_config_map(request_context=request_context,
                                                    async_kvstore_client=async_kvstore_client)

    log.debug("Fetching dashboards for apps=%s", app_names)

    params_app = _generate_params_v2(app_names=app_names, search_term=search_term, dashboard_tags=dashboard_tags,
                                     dashboard_ids=dashboard_ids, tagging_config_map=tagging_config_map,
                                     minimal_list=minimal_list, offset=offset, max_results=max_results)

    app_name = app_names[0] if len(app_names) == 1 else '-'
    total, dashboards = await fetch_dashboard_list_for_app(log,
                                                            request_context=request_context,
                                                            app_name=app_name,
                                                            params=params_app,
                                                            async_splunk_client=async_splunk_client)

    continuation_available = offset + len(dashboards) < total

    return total, dashboards, continuation_available


def _generate_params_v2(app_names: [str], search_term: int, dashboard_ids: [str], dashboard_tags: [str],
                        tagging_config_map: dict = None, minimal_list: bool = True, offset: int = 0,
                        max_results:int = 0) -> dict:
    """
    Helper method to generate params object for DashboardList API call
    :param app_names:
    :param search_term:
    :param dashboard_ids:
    :param dashboard_tags:
    :param tagging_config_map:
    :param minimal_list:
    :param offset:
    :param max_results:
    :return:
    """

    if not tagging_config_map:
        tagging_config_map = {}

    search_app_names = [] if app_names == [GLOBAL_APP_SEARCH] else app_names

    query = create_dashboard_report_search_query(app_names=search_app_names,
                                                 search_term=search_term,
                                                 is_dashboard=True,
                                                 ids=dashboard_ids,
                                                 dashboard_tags=dashboard_tags,
                                                 tagging_config_map=tagging_config_map)

    search_str = f'({constants.DASHBOARD_SEARCH_QUERY}{query})'

    params = {'output_mode': 'json',
              'search': search_str,
              'sort_dir': 'asc',
              'sort_key': 'label',
              'sort_mode': 'alpha',
              'count': max_results,
              'offset': offset,
              'digest': int(minimal_list)}

    return params

async def _fetch_favorite_dashboard_ids(request_context: RequestContext,
                                        dashboard_ids = None,
                                        async_kvstore_client: AsyncKvStoreClient = None) -> [str]:
    """
    Fetch list of favorite dashboard_ids
    :param request_context:
    :param dashboard_ids: specify specific dashboards to search for, defaults to all dashboards
    :param async_kvstore_client:
    """
    if dashboard_ids is None:
        dashboard_ids = []

    dashboard_id_keys = [urllib.quote(dashboard_id) for dashboard_id in dashboard_ids]
    dashboards_meta = await fetch_dashboard_meta_list(request_context=request_context,
                                                dashboard_ids=dashboard_id_keys,
                                                async_kvstore_client=async_kvstore_client)

    favorite_dashboard_ids = [dashboard_meta.dashboard_id() for dashboard_meta in dashboards_meta if dashboard_meta.is_favorite is True]
    return favorite_dashboard_ids
