"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Script for custom mobile alert action which is called when
a mobile alert is triggered.

Splunk Dev Docs: https://dev.splunk.com/enterprise/docs/devtools/customalertactions/writescriptcaa
"""

import logging
import sys
import warnings

warnings.filterwarnings('ignore', '.*service_identity.*', UserWarning)

from spacebridgeapp.util import py23
py23.setup_environment_for_modular_input()

import splunk.rest as rest
import json
import asyncio

from spacebridgeapp.rest.devices.alert_helper import preprocess_payload, build_alert, persist_alert, \
    persist_recipient_devices, send_push_notification, determine_recipient_status
from spacebridgeapp.util import constants
from spacebridgeapp.util.config import load_config, SecureGatewayConfig
from spacebridgeapp.rest.clients.async_client_factory import AsyncClientFactory
from spacebridgeapp.messages.request_context import RequestContext
from spacebridgeapp.rest.services.splunk_service import get_saved_search
from spacebridgeapp.request.splunk_auth_header import SplunkAuthHeader
from spacebridgeapp.alerts.devices import get_registered_devices
from spacebridgeapp.util.mtls import build_mtls_spacebridge_client
from spacebridgeapp.util.constants import SESSION_KEY, SEARCH_ID, CONFIGURATION, APP, SEARCH_NAME, SYSTEM_AUTHTOKEN
from spacebridgeapp.alerts.alert_action import NotificationType
from spacebridgeapp.logging import setup_logging
from spacebridgeapp.rest.services import splunk_service
from typing import Dict, Any


async def trigger(config: SecureGatewayConfig, log: logging.Logger, alert_payload):
    """
    Entry path for the mobile alert which is called from the main method of this module.
    This function does the following:
        1. extracts the server_uri from the payload
        2. Get's all registered devices from the KV Store and
        3. Build an alert for each registered device
        4. Post each created alert to KV Store

    Arguments:
        :param log:
        :param alert_payload {json} -- json object of the payload sent by splunk on the alert trigger
    """
    log.info("Alert triggered")
    try:
        await do_trigger(config, log, alert_payload)
    except Exception:
        log.exception("Alert unhandled error")


async def do_trigger(config: SecureGatewayConfig, log: logging.Logger, alert_payload):
    log.info("do_trigger: using system_authtoken for KV Store writes")
    auth_header = SplunkAuthHeader(alert_payload[SYSTEM_AUTHTOKEN])

    # Use default URI for alerts
    try:
        uri = rest.makeSplunkdUri()
    except Exception:
        log.exception("Failed to generate default URI")
        return

    mtls_spacebridge_client = None
    mtls_enabled = config.get_mtls_enabled()
    if mtls_enabled:
        mtls_spacebridge_client = build_mtls_spacebridge_client(log, alert_payload[SYSTEM_AUTHTOKEN])

    async_client_factory = AsyncClientFactory(log, config, uri, spacebridge_client=mtls_spacebridge_client)
    async_kvstore_client = async_client_factory.kvstore_client()
    async_splunk_client = async_client_factory.splunk_client()
    async_spacebridge_client = async_client_factory.spacebridge_client()

    alert_sid = alert_payload[SEARCH_ID]
    app = alert_payload[APP]
    search_name = alert_payload[SEARCH_NAME]
    preprocess_payload(alert_payload)

    request_context = RequestContext(auth_header=auth_header, system_auth_header=auth_header, is_alert=True)

    log.info("get_registered_devices alert_sid=%s", alert_sid)
    registered_devices = await get_registered_devices(log, request_context, async_kvstore_client, alert_payload)
    log.info("get_registered_devices ok alert_sid=%s", alert_sid)

    alert = await build_alert(log,
                              request_context, alert_payload, async_splunk_client, async_kvstore_client)
    log.info("persist_alert alert_id=%s", alert_sid)

    user_group = {registered_device.user for registered_device in registered_devices}

    for user in user_group:
        try:
            get_saved_search(auth_header.session_token, user, app, search_name)
        except Exception:
            log.warning(f"Failed to send alert notification to devices belonging to user={user}, check permissions")
            continue

        user_registered_devices = [device for device in registered_devices if device.user == user]
        response = persist_alert(log, alert, auth_header.session_token, user)
        log.info("persist_alert ok succeeded alert_id=%s", alert_sid)

        # If we get a proper response from KV Store, then we get the key of the stored alert
        # and create a (device_id, alert_id, timestamp) triplet for each device that should
        # receive the alert

        if response and "_key" in response:
            alert_id = response["_key"]
            alert.notification.alert_id = alert_id

            # Determine which devices in registered_devices have snoozed this notification
            (snoozed_devices, active_devices) = await determine_recipient_status(log, request_context, alert.notification,
                                                                                 user_registered_devices, async_kvstore_client)

            # Persisting (recipient device, alert id, is snoozed) tuples and sending push notifications happens
            # simultaneously via async
            log.info("persist_recipient_devices started alert_id=%s, active devices=%s, snoozed devices=%s", alert_id,
                     len(active_devices), len(snoozed_devices))

            await persist_recipient_devices(log,
                                            request_context, alert_id, active_devices, snoozed_devices, alert_payload,
                                            async_kvstore_client)

            log.info("persist_recipient_devices ok alert_id=%s, active devices=%s, snoozed devices=%s", alert_id,
                     len(active_devices), len(snoozed_devices))

            log.info("send_push_notifications starting devices=%s", len(active_devices))
            await send_push_notification(log,
                                         request_context,
                                         alert.notification,
                                         active_devices,
                                         async_kvstore_client,
                                         async_spacebridge_client,
                                         async_splunk_client)



def send_report_notifications(log: logging.Logger, payload: Dict[str, Any]) -> None:
    """ Call notifications endpoint to send report notifications to subscribed users  """
    search_uri = payload.get('search_uri')
    session_key = payload.get(SYSTEM_AUTHTOKEN)
    log.info(f"Triggering notifications for scheduled_report={search_uri}")
    r = splunk_service.send_report_notifications(session_key, search_uri)
    log.info(f"Completed sending notifications with response_code={r}")


def run() -> None:
    PAYLOAD = json.loads(sys.stdin.read())
    config = load_config(PAYLOAD[SESSION_KEY])
    log = setup_logging(constants.SPACEBRIDGE_APP_NAME + '_mobile_alert.log', 'ssg_mobile_alert', config=config)

    try:
        log.debug("Alert payload: %s", {k: '***' if k in (SESSION_KEY, SYSTEM_AUTHTOKEN) else v for k, v in PAYLOAD.items()})
        if PAYLOAD[CONFIGURATION].get('notification_type') == NotificationType.REPORT:
            send_report_notifications(log, PAYLOAD)
        else:
            # Run a one off asynchronous coroutine using asyncio
            asyncio.run(trigger(config, log, PAYLOAD))
    except Exception:
        log.exception("Encountered unexpected error while triggering mobile alert")

if __name__ == "__main__":
    run()
