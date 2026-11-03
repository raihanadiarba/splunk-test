"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

REST endpoint handler for sending notifications for scheduled reports
"""
import os

import sys
import base64
import json
from dataclasses import dataclass, fields
from splunk.clilib.bundle_paths import make_splunkhome_path

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

import logging
from spacebridgeapp.util import py23
from spacebridgeapp.util import constants
from spacebridgeapp.rest import async_base_endpoint
from spacebridgeapp.rest.util.helper import enforce_required_parameters
from spacebridgeapp.rest.services.splunk_service import get_saved_search_from_uri, get_devices_for_user, \
    get_saved_search
from spacebridgeapp.alerts.alert_action import MobileAlertAction
from spacebridgeapp.rest.util.utils import SplunkRequest
from spacebridgeapp.rest.services.kvstore_service import KVStoreCollectionAccessObject as KvStoreHelper
from spacebridgeapp.data.base import SpacebridgeAppBase
from typing import Dict, Any
from cloudgateway.private.sodium_client.sharedlib_sodium_client import SodiumClient
from http import HTTPStatus
from spacebridgeapp.rest.util.errors import SsgHttpError
from spacebridgeapp.data.alert_data import Notification
from spacebridgeapp.alerts import notifications
from cloudgateway.private.encryption.encryption_handler import encrypt_for_send, sign_detached
from functools import partial
from cloudgateway.encryption_context import EncryptionContext
from cloudgateway.splunk.encryption import SplunkEncryptionContext
from spacebridgeapp.rest.services import spacebridge_service
from splapp_protocol import common_pb2
from spacebridgeapp.reports.report_helper import ParsedReportId
from spacebridgeapp.util.app_info import appid_has_alert_support

sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))
sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))


@dataclass(frozen=True)
class ReportNotificationRequest:
    """Data class for managing send notification subscription request"""
    search_uri: str

@dataclass(frozen=True)
class SignCredentials(SpacebridgeAppBase):
    """Helper data class to manage signing keys"""
    sign_private_key: str
    sign_public_key: str

    @staticmethod
    def from_json(dict: Dict[str, str]):
        return SignCredentials(dict['sign_private_key'], dict['sign_public_key'])

@dataclass(frozen=True)
class Device(SpacebridgeAppBase):
    """Helper data class to handle device information"""
    encrypt_public_key: bytes
    device_id: str
    device_id_raw: bytes

@dataclass(frozen=True)
class SenderInfo(SpacebridgeAppBase):
    """ Helper data class to manage sender information for notifications"""
    sender_id: bytes
    sender_id_hex: str
    signer: Any

    @staticmethod
    def from_encryption_ctx(encryption_ctx: EncryptionContext):
        sender_id = encryption_ctx.sign_public_key(transform=encryption_ctx.generichash_raw)
        sender_id_hex = sender_id.hex()
        signer = partial(sign_detached, encryption_ctx.sodium_client, encryption_ctx.sign_private_key())

        return SenderInfo(sender_id, sender_id_hex, signer)



def fetch_public_keys_for_device(device_id: str, session_key: str) -> Device:
    """ Fetch encryption public key for a given device id """
    kv_client = KvStoreHelper(constants.DEVICE_PUBLIC_KEYS_COLLECTION_NAME, session_key=session_key)
    device_id_raw = base64.b64decode(device_id)
    safe_key = py23.urlsafe_b64encode_to_str(device_id_raw)

    response, content = kv_client.get_item_by_key(safe_key)
    if response.status != HTTPStatus.OK:
        raise SsgHttpError(content, response.status)

    jsn = json.loads(content)

    return Device(base64.b64decode(jsn['encrypt_public_key']), device_id, device_id_raw)


def make_ssg_encryption_ctx(log: logging.Logger, system_session_token: str) -> SplunkEncryptionContext:
    """ Create encryption context for SSG used to sign requests """
    sodium_client = SodiumClient(log.getChild('sodium_client'))
    return SplunkEncryptionContext(system_session_token, constants.SPACEBRIDGE_APP_NAME, sodium_client)

def send_notification_to_device(log: logging.Logger,
                                notification: Notification,
                                device_id: str,
                                system_session_token: str,
                                ssg_encryption_ctx: EncryptionContext,
                                sender_info: SenderInfo) -> None:
    """ Send notification to a single device """
    try:
        device_keys = fetch_public_keys_for_device(device_id, system_session_token)
        encryptor = partial(encrypt_for_send,
                        ssg_encryption_ctx.sodium_client,
                        device_keys.encrypt_public_key)

        notification_request = notifications.build_notification_request(log, device_keys.device_id, device_keys.device_id_raw, sender_info.sender_id,
                                                                    notification,
                                                                    encryptor, sender_info.signer)
        response = spacebridge_service.send_notification_request(system_session_token, sender_info.sender_id_hex, notification_request)
        log.info(f"sent notification request to spacebridge with response={response.status_code}")
    except Exception as e:
        log.warn(f"Failed to send notification to device with error={str(e)}")

class ReportNotificationHandler(async_base_endpoint.AsyncBaseRestHandler):

    def __init__(self, command_line, command_arg):
         super().__init__(self, command_line, command_arg, logname="report_notification_send")

    async def post(self, request):
        """ Send a notification to all devices subscribed to a given report """
        self.log.info('Starting request to send scheduled report notifications')
        splunk_request = SplunkRequest.from_request(request)
        enforce_required_parameters([field.name for field in fields(ReportNotificationRequest)], splunk_request.body)
        report_notification_request = ReportNotificationRequest(splunk_request.body['search_uri'])
        self.log.info(f'Successfully parsed request={report_notification_request}')

        name, search_id, saved_search_meta = get_saved_search_from_uri(splunk_request.user_session_token, report_notification_request.search_uri)
        alert_action = MobileAlertAction.parse_saved_search_response(saved_search_meta)

        parsed_id = ParsedReportId.__parse_from_url__(search_id)
        app = parsed_id.app_name
        search_name = parsed_id.report_name

        self.log.info(f"Building notifications for recipient_users={alert_action.recipient_users}")
        encryption_context = make_ssg_encryption_ctx(self.log, splunk_request.system_session_token)
        sender_info = SenderInfo.from_encryption_ctx(encryption_context)
        notification = Notification(alert_id=parsed_id.id_str,
                                    title=name,
                                    description=saved_search_meta['description'],
                                    notification_type=common_pb2.Alert.Notification.NotificationType.SCHEDULED_REPORT)

        for user in alert_action.recipient_users:
            try:
                # Check if target user can access report
                get_saved_search(splunk_request.system_session_token, user, app, search_name)

                # Send notification for user devices
                self._send(user, splunk_request.system_session_token, notification, encryption_context, sender_info)
            except SsgHttpError:
                self.log.warning(f"Failed to send notification to devices belonging to user={user}, check permissions")
            except Exception:
                self.log.exception(f"Failed to send notification to devices belonging to user={user}")

        return self.render(HTTPStatus.OK, {'result': 'ok'})

    def _send(self, user: str, system_session_token, notification, ctx, sender_info):
        devices = get_devices_for_user(self.log, user, system_session_token)
        device_ids = [d.get('device_id') for d in devices if
                      d.get('device_id') and appid_has_alert_support(d.get('app_id'))]

        for id in device_ids:
            send_notification_to_device(self.log, notification, id, system_session_token, ctx, sender_info)
