import json
import os
import sys
import time
from http import HTTPStatus
import splunk
from splunk.clilib.bundle_paths import make_splunkhome_path

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))

from spacebridgeapp.util.constants import ALERT_TIMESTAMP_FIELD, AUTHTOKEN, CONFIGURATION, DEVICE_ID, QUERY, SESSION, \
    SESSION_KEY, SYSTEM_AUTHTOKEN, USER, REGISTERED_DEVICES_COLLECTION_NAME
from spacebridgeapp.rest.services.kvstore_service import KVStoreCollectionAccessObject as kvstore
from spacebridgeapp.rest import async_base_endpoint
from spacebridgeapp.rest.devices.alert_helper import build_alert, persist_alert, persist_recipient_devices, \
    send_push_notification
from spacebridgeapp.rest.services.splunk_service import user_is_splunk_mobile_administrator
from spacebridgeapp.messages.request_context import RequestContext
from spacebridgeapp.alerts.devices import DeviceUserPair
from spacebridgeapp.rest.util.utils import SplunkRequest

sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

TEST_ALERT_PAYLOAD = {
    "results_file": "/Applications/Splunk/var/run/splunk/dispatch"
                    "/rt_scheduler__admin__search__RMD59c5e27675a962a5d_at_1527626375_5.51/results.csv.gz",
    "server_uri": "https://fakehost:8089",
    "configuration": {
        "subject": "",
        "alert_call_to_action_label": "Lead to Splunk Mobile’s alerts tab.",
        "alert_call_to_action_url": "",
        "alert_subject": "Welcome to Splunk Mobile",
        "alert_message": "This is what an alert notification looks like in Splunk Mobile. View all your "
                         "alerts in the Alerts tab of the Splunk Mobile app.",
        "alert_id": "",
        "alert_dashboard_id": "",
        "alert_description": "",
        "alert_severity": "1",
        "result_fieldname": "",
        "dashboard_toggle": "0",
        "token_name": ""
    },
    "owner": "admin",
    "search_name": "Test Search Name",
    "app": "splunk_secure_gateway",
    "sid": "rt_scheduler__admin__search__RMD59c5e27675a962a5d_at_1527626375_5.51",
    "session_key": "",
    "results_link": "",
    "result": {}
}

class SendAlertHandler(async_base_endpoint.AsyncBaseRestHandler):
    """
    Main rest handler class for manually sending a push notification to a mobile device
    """

    def __init__(self, command_line, command_arg):
        super().__init__(command_line, command_arg, logname="send_alert")

    async def post(self, request):
        # Populating fields
        curr_time = time.time()
        TEST_ALERT_PAYLOAD[CONFIGURATION][ALERT_TIMESTAMP_FIELD] = str(curr_time)
        TEST_ALERT_PAYLOAD[SESSION_KEY] = request[SESSION][AUTHTOKEN]
        splunk_request = SplunkRequest.from_request(request)

        device_id = request[QUERY][DEVICE_ID]
        if not isinstance(device_id, str):
            return {
                'payload': {
                    'message': 'Invalid or no device id.'
                },
                'status': HTTPStatus.BAD_REQUEST
            }

        # Params needed for building the alert
        async_kvstore_client = self.async_client_factory.kvstore_client()
        async_splunk_client = self.async_client_factory.splunk_client()
        async_spacebridge_client = self.async_client_factory.spacebridge_client()
        request_context = RequestContext.from_rest_request(request)
        request_context.device_id = device_id
        request_context.is_alert = True

        if not _can_send_notification(auth_header=request[SESSION][AUTHTOKEN],
                                      user=request[SESSION][USER],
                                      device_id=device_id):
            return {
                'payload': {
                    'message': 'You are not allowed to send alerts to this device.'
                },
                'status': HTTPStatus.UNAUTHORIZED
            }

        recipient_devices = [DeviceUserPair(device_id, splunk_request.user)]

        alert = await build_alert(self.log,
                                  request_context, TEST_ALERT_PAYLOAD, async_splunk_client, async_kvstore_client)
        response = persist_alert(self.log, alert, request[SYSTEM_AUTHTOKEN], splunk_request.user)

        # Initialization required for unit tests
        [_, exceptions] = [[], []]
        if response and "_key" in response:
            alert_id = response["_key"]
            alert.notification.alert_id = alert_id

            # Persisting (recipient device, alert id) pairs and sending push notifications happens simultaneously via async
            await persist_recipient_devices(self.log,
                                            request_context,
                                            alert_id,
                                            recipient_devices,
                                            [],  # Empty set of snoozed devices
                                            TEST_ALERT_PAYLOAD,
                                            async_kvstore_client)
            [_, exceptions] = await send_push_notification(self.log,
                                                           request_context,
                                                           alert.notification,
                                                           recipient_devices,
                                                           async_kvstore_client,
                                                           async_spacebridge_client,
                                                           async_splunk_client)

        if len(exceptions) == 0:
            return {
                'payload': {
                    'message': 'Successfully sent sample alert to device %s' % device_id
                },
                'status': HTTPStatus.OK
            }
        else:
            return {
                'payload': {
                    'message': 'Failed to send sample alert to device ' + str(device_id)
                },
                'status': HTTPStatus.BAD_REQUEST
            }


def _can_send_notification(auth_header: str, user: str, device_id: str):
    if _is_current_user_device_owner(auth_header=auth_header, user=user, device_id=device_id):
        return True
    return user_is_splunk_mobile_administrator(auth_header)


def _is_current_user_device_owner(auth_header: str, user: str, device_id: str) -> bool:
    try:
        kvstore_service = kvstore(collection=REGISTERED_DEVICES_COLLECTION_NAME,
                                  session_key=auth_header,
                                  owner=user)
        _, content = kvstore_service.get_items_by_query({DEVICE_ID: device_id})
        return len(json.loads(content)) > 0
    except splunk.RESTException:
        return False
