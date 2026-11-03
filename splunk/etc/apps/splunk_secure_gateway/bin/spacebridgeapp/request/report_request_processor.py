import logging
from typing import Any

import aiohttp
from http import HTTPStatus
from spacebridgeapp.reports.report_helper import NextScheduledTimeParser

from spacebridgeapp.data.report_data import ReportDetail, ReportScheduled, ReportMeta, ReportVisualization
from spacebridgeapp.reports.report_meta import set_report_meta, fetch_report_meta_list
from spacebridgeapp.reports.report_helper import ParsedReportId
from spacebridgeapp.util import constants
from spacebridgeapp.rest.clients.async_splunk_client import AsyncSplunkClient
from spacebridgeapp.rest.clients.async_kvstore_client import AsyncKvStoreClient
from spacebridgeapp.messages.request_context import RequestContext
from spacebridgeapp.exceptions.spacebridge_exceptions import SpacebridgeApiRequestError
from spacebridgeapp.util.app_info import fetch_display_app_name
from spacebridgeapp.alerts.alert_action import MobileAlertAction

REPORTS_TRELLIS_IMPLEMENTED = True
REPORTS_MAP_IMPLEMENTED = True

######################
# Main API Functions #
######################

async def process_report_get_request(log: logging.Logger,
                                     request_context: RequestContext,
                                     client_single_request,
                                     server_single_response,
                                     async_splunk_client: AsyncSplunkClient,
                                     async_kvstore_client: AsyncKvStoreClient):
    """
    Process reportGetRequest
    """

    log.info("Processing reports get request")
    parsed_report_id = ParsedReportId(client_single_request.reportGetRequest.reportId)

    report_json = await _fetch_single_report(request_context, parsed_report_id, async_splunk_client)

    # Populate ReportDescription
    next_scheduled_time_parser = await _async_get_next_scheduled_time_parser(request_context, async_splunk_client)
    report_detail = _parse_single_report_entry(report_json, next_scheduled_time_parser, request_context.current_user)
    await _populate_display_appname(log, request_context, [report_detail], async_splunk_client)
    await _populate_is_favorite(request_context, [report_detail], async_kvstore_client)
    report_detail.set_proto(server_single_response.reportGetResponse.reportDescription)

    # Populate ReportVisualization
    report_visualization = _parse_single_report_visualization(report_json)
    report_visualization.set_proto(server_single_response.reportGetResponse.reportVisualization)

    # Populate lastRunTime
    last_run_time = await _fetch_last_run_time(log,
                                               request_context, parsed_report_id, async_splunk_client)
    if last_run_time > 0:
        server_single_response.reportGetResponse.lastRunTime = last_run_time

    log.info("Completed processing report get request successfully.")

async def process_reports_list_request(log: logging.Logger,
                                       request_context: RequestContext,
                                       client_single_request,
                                       server_single_response,
                                       async_splunk_client: AsyncSplunkClient,
                                       async_kvstore_client: AsyncKvStoreClient):
    """
    Process reportListRequest
    """

    log.info("Processing reports list request")
    max_results = client_single_request.reportListRequest.maxResults
    offset = client_single_request.reportListRequest.offset

    response: aiohttp.ClientResponse = await async_splunk_client.async_get_reports(request_context.auth_header,
                                                                                    request_context.current_user,
                                                                                    max_results=max_results,
                                                                                    offset=offset)

    if response.code != HTTPStatus.OK:
        message = await response.text()
        raise SpacebridgeApiRequestError(
            "Failed to fetch report list with error={}".format(message),
            status_code=response.code)

    jsn = await response.json()
    next_scheduled_time_parser = await _async_get_next_scheduled_time_parser(request_context, async_splunk_client)
    report_details = _parse_reports_response(jsn, next_scheduled_time_parser, request_context.current_user)
    await _populate_display_appname(log, request_context, report_details, async_splunk_client)
    await _populate_is_favorite(request_context, report_details, async_kvstore_client)

    total_results = jsn["paging"]["total"]
    server_single_response.reportListResponse.reportDescriptions.extend([r.to_protobuf() for r in report_details])
    server_single_response.reportListResponse.maxResults = max_results
    server_single_response.reportListResponse.total = total_results
    server_single_response.reportListResponse.count = len(report_details)
    server_single_response.reportListResponse.continuation.hasNextPage = offset + len(report_details) < total_results
    server_single_response.reportListResponse.continuation.nextOffset = offset + len(report_details)

    log.info("Completed processing report list request successfully. Returning {} reports".format(len(report_details)))


async def process_reports_list_request_v2(log: logging.Logger,
                                       request_context: RequestContext,
                                       client_single_request,
                                       server_single_response,
                                       async_splunk_client: AsyncSplunkClient,
                                       async_kvstore_client: AsyncKvStoreClient):
    """
    Process reportListRequestV2
    """

    log.info("Processing reports list request v2")
    max_results = client_single_request.reportListRequestV2.maxResults
    offset = client_single_request.reportListRequestV2.offset
    report_ids = client_single_request.reportListRequestV2.reportIds
    app_name = client_single_request.reportListRequestV2.appName
    search_term = client_single_request.reportListRequestV2.searchTerm
    is_favorite = client_single_request.reportListRequestV2.isFavorite

    search_report_ids = report_ids
    if is_favorite:
        favorite_report_ids = await _fetch_favorite_report_ids(request_context=request_context, 
                                                            report_ids=report_ids, 
                                                            async_kvstore_client=async_kvstore_client)
        
        log.debug(f'Fetched favorite report ids: {favorite_report_ids}')

        # if no favorites were found
        if len(favorite_report_ids) <= 0:  
            _populate_report_list_request_v2(log=log, server_single_response=server_single_response,
                                             report_details=[], max_results=max_results,
                                             total=0, offset=offset)
            return

        search_report_ids = favorite_report_ids


    response: aiohttp.ClientResponse = await async_splunk_client.async_get_reports(request_context.auth_header,
                                                                                    request_context.current_user,
                                                                                    max_results=max_results,
                                                                                    offset=offset,
                                                                                    app_name=app_name,
                                                                                    report_ids=search_report_ids,
                                                                                    search_term=search_term)

    if response.code != HTTPStatus.OK:
        message = await response.text()
        raise SpacebridgeApiRequestError(
            f'Failed to fetch report list with error={message}',
            status_code=response.code)

    jsn = await response.json()
    next_scheduled_time_parser = await _async_get_next_scheduled_time_parser(request_context, async_splunk_client)
    report_details = _parse_reports_response(jsn, next_scheduled_time_parser, request_context.current_user)
    await _populate_display_appname(log, request_context, report_details, async_splunk_client)
    await _populate_is_favorite(request_context, report_details, async_kvstore_client)

    # add response fields? 
    total_results = jsn["paging"]["total"]
    _populate_report_list_request_v2(log=log, server_single_response=server_single_response,
                                     report_details=report_details, max_results=max_results,
                                     total=total_results, offset=offset)



async def process_report_set_request(log: logging.Logger,
                                     request_context: RequestContext,
                                     client_single_request,
                                     server_single_response,
                                     async_kvstore_client: AsyncKvStoreClient):
    """
    This method will process single report set requests
    """

    await _populate_report_set_response(log,
                                        request_context,
                                        client_single_request,
                                        server_single_response,
                                        async_kvstore_client)



####################
# Helper Functions #
####################

def _populate_report_list_request_v2(log: logging.Logger,
                                     server_single_response,
                                     report_details: [ReportDetail],
                                     max_results: int,
                                     total: int,
                                     offset: int) -> None:
    
    server_single_response.reportListResponseV2.reportDescriptions.extend([r.to_protobuf() for r in report_details])
    server_single_response.reportListResponseV2.maxResults = max_results
    server_single_response.reportListResponseV2.total = total
    server_single_response.reportListResponseV2.count = len(report_details)
    server_single_response.reportListResponseV2.continuation.hasNextPage = offset + len(report_details) < total
    server_single_response.reportListResponseV2.continuation.nextOffset = offset + len(report_details)
    log.info(f'Completed processing report list request v2 successfully. Returning {len(report_details)} reports')

async def _fetch_single_report(request_context: RequestContext,
                               report_id: ParsedReportId,
                               async_splunk_client: AsyncSplunkClient) -> Any:
    """
    Fetch single report and return a json object
    """
    response: aiohttp.ClientResponse = await async_splunk_client.async_get_saved_searches(request_context.auth_header,
                                                                                          request_context.current_user,
                                                                                          report_id.app_name,
                                                                                          report_id.report_name)

    if response.code != HTTPStatus.OK:
        message = await response.text()
        raise SpacebridgeApiRequestError(
            "Failed to fetch report details with error={}".format(message),
            status_code=response.code)

    jsn = await response.json()

    entry_json_list = jsn.get('entry')

    if not entry_json_list:
        # log result in the event the reportId is not valid
        raise SpacebridgeApiRequestError(
            f"No Entries found for report_id={report_id.id_str}",

            status_code=HTTPStatus.NOT_FOUND)

    return entry_json_list[0]

async def _populate_display_appname(log: logging.Logger,
                                    request_context: RequestContext,
                                    report_details: [ReportDetail],
                                    async_splunk_client: AsyncSplunkClient) -> None:
    """
    Fetch display app names for a list of reports
    """

    mapping = {}
    for report in report_details:
        app_name = report.app_name

        # check Cache first to see if we have already fetched display app name
        if app_name in mapping:
            display_name = mapping[app_name]
        else:
            display_name = await fetch_display_app_name(log,
                                                        request_context, app_name, async_splunk_client)
            mapping[app_name] = display_name

        report.display_app_name = display_name

async def _populate_is_favorite(request_context: RequestContext,
                                report_details: [ReportDetail],
                                async_kvstore_client: AsyncKvStoreClient) -> None:
    """
    Fetch is_favorite for a list of reports
    """

    report_ids = [report.report_id.generate_report_key_id() for report in report_details]
    reports_meta = await fetch_report_meta_list(request_context=request_context,
                                                report_ids=report_ids,
                                                async_kvstore_client=async_kvstore_client)

    reports_favorite_dict = {report_meta.report_id : report_meta.is_favorite for report_meta in reports_meta}

    for report in report_details:
        report.is_favorite = reports_favorite_dict.get(report.report_id.id_str, False)

async def _fetch_favorite_report_ids(request_context: RequestContext,
                                     report_ids = None,
                                     async_kvstore_client: AsyncKvStoreClient = None) -> [str]:
    """
    Fetch list of favorite report_ids 
    :param request_context:
    :param report_ids: specify specific reports to search for, defaults to all reports
    :param async_kvstore_client:
    """
    if report_ids is None:
        report_ids = []

    report_keys = [ParsedReportId(report_id).generate_report_key_id() for report_id in report_ids]
    reports_meta = await fetch_report_meta_list(request_context=request_context,
                                                report_ids=report_keys,
                                                async_kvstore_client=async_kvstore_client)
    
    favorite_report_ids = [report_meta.report_id for report_meta in reports_meta if report_meta.is_favorite is True]
    return favorite_report_ids
    

def _parse_reports_response(jsn, next_scheduled_time_parser, user) -> [ReportDetail]:
    """
    Parse json object returned by Splunk and returns a ReportDetail object
    """
    response = []

    for entry in jsn["entry"]:
        report = _parse_single_report_entry(entry, next_scheduled_time_parser, user)
        
        response.append(report)

    return response

def _parse_single_report_entry(jsn, next_scheduled_time_parser, user) -> ReportDetail:
    """
    Parse json object returned by Splunk and returns a ReportDetail object
    """
    content = jsn.get("content", {})
    acl = jsn.get("acl")
    report_schedule = ReportScheduled(
        content.get("cron_schedule", ""),
        next_scheduled_time_parser.parse_to_localized_timestamp( content.get("next_scheduled_time", "")),
        content.get("next_scheduled_time", "")
    )
    parsed_response = MobileAlertAction.parse_saved_search_response(content)
    subscribed_to_notifications = True if user in parsed_response.recipient_users else False
    report = ReportDetail(
        report_id=ParsedReportId.__parse_from_url__(jsn.get("id", "")),
        report_name=jsn.get("name", ""),
        description=content.get("description", ""),
        app_name=acl.get("app", ""),
        search=content.get("search", ""),
        is_scheduled=content.get("is_scheduled", ""),
        earliest=content.get("dispatch.earliest_time"),
        latest=content.get("dispatch.latest_time"),
        show_time_picker=bool(int(content.get("display.general.timeRangePicker.show"), 0)),
        schedule=report_schedule,
        subscribed_to_notifications=subscribed_to_notifications
    )

    return report

def _parse_single_report_visualization(jsn) -> ReportVisualization:
    """
    Parse json object returned by Splunk and returns a ReportVisualization object
    """
    content = jsn.get("content", {})
    options = {}
    for key, value in content.items():
        if key.startswith("display."):
            options[key] = value

    visualization = ReportVisualization(
        options_map=options,
        trellis_supported=REPORTS_TRELLIS_IMPLEMENTED,
        map_supported=REPORTS_MAP_IMPLEMENTED
    )

    return visualization

async def _fetch_last_run_time(log: logging.Logger,
                               request_context: RequestContext,
                               report_id: ParsedReportId,
                               async_splunk_client: AsyncSplunkClient) -> int:
    """
    Fetch job history for single report and determine last run time
    """
    job_history_response: aiohttp.ClientResponse = await async_splunk_client.async_get_saved_searches_history(
        request_context.auth_header,
        request_context.current_user,
        report_id.app_name, report_id.report_name)

    if job_history_response.code != HTTPStatus.OK:
        message = await job_history_response.text()
        log.error("Failed to fetch report history with error={}".format(message))
        return -1
    else:
        jsn = await job_history_response.json()
        last_run_time = 0

        for entry in jsn["entry"]:
            content = entry.get("content", {})
            if not content:
                continue
            start_time = content.get("start")
            if isinstance(start_time, int) and start_time > last_run_time:
                last_run_time = start_time

        return last_run_time

async def _populate_report_set_response(log: logging.Logger,
                                        request_context: RequestContext,
                                        client_single_request,
                                        server_single_response,
                                        async_kvstore_client: AsyncKvStoreClient):

    log.info("Start populating response for report set request")
    report_id = ParsedReportId(client_single_request.reportSetRequest.reportId)
    report_meta = ReportMeta(key_id=report_id.generate_report_key_id(),
                             report_id=client_single_request.reportSetRequest.reportId,
                             is_favorite=client_single_request.reportSetRequest.isFavorite)

    await set_report_meta(log,
                          request_context=request_context,
                          report_meta=report_meta,
                          async_kvstore_client=async_kvstore_client)

    # Populate Server Response
    server_single_response.reportSetResponse.reportId = client_single_request.reportSetRequest.reportId
    server_single_response.reportSetResponse.isFavorite = client_single_request.reportSetRequest.isFavorite
    log.info("Finished populating response for report set request")


async def _async_get_next_scheduled_time_parser(request_context: RequestContext,
                                                async_splunk_client: AsyncSplunkClient) -> NextScheduledTimeParser:
    """
    Method to create next_scheduled_time_parser based on user preferences timezone
    :param request_context: RequestContext
    :param async_splunk_client: AsyncSplunkClient
    :return: NextScheduledTimeParser
    """
    response = await async_splunk_client.async_get_current_context(request_context.auth_header)
    if not response.code == HTTPStatus.OK:
        raise SpacebridgeApiRequestError(
            "Error fetching current context info from with code={}".format(response.code), status_code=response.code)

    response_json = await response.json()
    timezone = response_json[constants.ENTRY][0][constants.CONTENT][constants.TIMEZONE]
    return NextScheduledTimeParser(timezone)
