
"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Module to process notification management requests
"""
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
from spacebridgeapp.messages.request_context import RequestContext
from spacebridgeapp.exceptions.spacebridge_exceptions import SpacebridgeApiRequestError
from splapp_protocol import request_pb2
import urllib.parse as urllib


async def process_notification_management_request(log: logging.Logger,
                                                  request_context: RequestContext,
                                                  client_single_request,
                                                  server_single_response,
                                                  async_splunk_client: AsyncSplunkClient):
    """ Process NotificationManagementRequests """

    log.info('Processing notification management request. Routing to handler for notification type...')
    if client_single_request.notificationManagementRequest.HasField("scheduledReportNotification"):
        await process_scheduled_report_notification_management_request(log, 
                                                                       request_context,
                                                                       client_single_request,
                                                                       server_single_response,
                                                                       async_splunk_client)


async def process_scheduled_report_notification_management_request(log: logging.Logger, 
                                                                   request_context: RequestContext,
                                                                   client_single_request,
                                                                   server_single_response,
                                                                   async_splunk_client: AsyncSplunkClient):
    """ Process notification management request for Scheduled Reports """

    log.info('Processing notification management request for scheduled report')
    report_id = client_single_request.notificationManagementRequest.scheduledReportNotification.reportId

    if client_single_request.notificationManagementRequest.action == request_pb2.NotificationManagementRequest.ENABLE:
        r = await async_splunk_client.subscribe_report_notification(request_context.auth_header, report_id, log)
        if r.code != HTTPStatus.OK:
            message = await r.text()
            raise SpacebridgeApiRequestError(
            f'Failed to enable notification for scheduled report with message={message}',
            status_code=r.code)

        server_single_response.notificationManagementResponse.result = request_pb2.NotificationManagementResponse.ENABLED
        log.info('Sucessfully enabled notification for scheduled report')

    elif client_single_request.notificationManagementRequest.action == request_pb2.NotificationManagementRequest.DISABLE:
        r = await async_splunk_client.unsubscribe_report_notification(request_context.auth_header, report_id, log)
        if r.code != HTTPStatus.OK:
            message = await r.text()
            raise SpacebridgeApiRequestError(
            f'Failed to disable notification for scheduled report with message={message}',
            status_code=r.code)

        server_single_response.notificationManagementResponse.result = request_pb2.NotificationManagementResponse.DISABLED
        log.info('Sucessfully disabled notification for scheduled report')