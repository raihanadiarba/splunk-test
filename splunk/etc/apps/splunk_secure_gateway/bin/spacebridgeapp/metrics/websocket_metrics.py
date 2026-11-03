"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Methods for per message instrumentation beacons from the websocket side of things
"""
import logging


def send_websocket_metrics_to_telemetry(log: logging.Logger,
                                        message_type,
                                        request_context,
                                        async_telemetry_client,
                                        useragent=None,
                                        params=None):
    """
    Take a message type string and useragent string and log that information to telemetry
    :param log:
    :param message_type: String (e.g. DASHBOARD_LIST_REQUEST)
    :param request_context:
    :param async_telemetry_client:
    :param useragent: String representing the user's device meta information
    :return:
    """
    payload = {
        "messageType": message_type,
        "deviceId": request_context.device_id,
        "useragent": useragent
    }
    if params:
        payload.update(params)

    return async_telemetry_client.post_metrics(log, payload, request_context.system_auth_header)
