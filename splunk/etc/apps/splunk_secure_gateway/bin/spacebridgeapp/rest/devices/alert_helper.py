"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Helper methods for mobile alerts.
"""
import logging
import os
import warnings
from base64 import b64decode
from google.protobuf.json_format import MessageToJson

from spacebridgeapp.dashboard.generate_dashboard import create_dashboard_description_table
from spacebridgeapp.dashboard.parse_search import get_string_field
from spacebridgeapp.data.dashboard_data import DashboardVisualizationId
from spacebridgeapp.request.dashboard_request_processor import fetch_dashboard_description, get_list_dashboard_data, \
    get_search_job_content, get_search_job_dashboard_data
from spacebridgeapp.search.input_token_support import set_default_token_values

warnings.filterwarnings('ignore', '.*service_identity.*', UserWarning)

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'

import json
import asyncio

from cloudgateway.device import EncryptionKeys
from cloudgateway.encryption_context import EncryptionContext
from cloudgateway.private.sodium_client.sharedlib_sodium_client import SodiumClient, SodiumOperationError
from http import HTTPStatus
from spacebridgeapp.util import constants
from spacebridgeapp.data.alert_data import CallToAction, Notification, Alert, Detail, RecipientDevice, ScopedSnooze
from spacebridgeapp.util.app_info import fetch_display_app_name
from spacebridgeapp.alerts import notifications
from spacebridgeapp.rest.services.kvstore_service import KVStoreCollectionAccessObject as KvStoreAccessor
from spacebridgeapp.messages.request_context import RequestContext
from spacebridgeapp.request.request_processor import SpacebridgeAuthHeader
from cloudgateway.private.encryption.encryption_handler import encrypt_for_send, sign_detached
from cloudgateway.private.util.constants import HEADER_CONTENT_TYPE, APPLICATION_PROTOBUF
from functools import partial
from spacebridgeapp.rest.devices.util import public_keys_for_device
from spacebridgeapp.exceptions.key_not_found_exception import KeyNotFoundError
from spacebridgeapp.exceptions.splunk_api_exceptions import EncryptionKeyError
from spacebridgeapp.util.constants import SUBJECT, SEVERITY, CALL_TO_ACTION_URL, CALL_TO_ACTION_LABEL, \
    ALERT_TIMESTAMP_FIELD, ALERT_ID, ALERT_MESSAGE, CONFIGURATION, SAVED_SEARCH_RESULT, RESULTS_LINK, \
    SEARCH_ID, OWNER, APP, SEARCH_NAME, TOKEN, FIELDNAME, ALERT_SUBJECT, DASHBOARD_TOGGLE, ATTACH_DASHBOARD_TOGGLE, \
    ALERT_DASHBOARD_ID, RESULT, ATTACH_TABLE_TOGGLE, SIGN_PUBLIC_KEY, SNOOZE_ALERT_TYPE, SNOOZE_ALL_TYPE, SNOOZE_APP_TYPE, \
    SNOOZE_TYPE

from spacebridgeapp.rest.clients.async_kvstore_client import AsyncKvStoreClient
from spacebridgeapp.util.time_utils import get_current_timestamp
from typing import List
from spacebridgeapp.alerts.devices import DeviceUserPair


def preprocess_payload(alert_payload):
    """
    If our custom fields are not populated by the user, splunk will not send them in the payload. So we just populate those
    fields as empty string for simplicity.
    :param alert_payload:
    :return:

    """
    if SUBJECT not in alert_payload[CONFIGURATION].keys():
        alert_payload[CONFIGURATION][SUBJECT] = ""

    if ALERT_MESSAGE not in alert_payload[CONFIGURATION].keys():
        alert_payload[CONFIGURATION][ALERT_MESSAGE] = ""

    if CALL_TO_ACTION_LABEL not in alert_payload[CONFIGURATION].keys():
        alert_payload[CONFIGURATION][CALL_TO_ACTION_LABEL] = ""

    if CALL_TO_ACTION_URL not in alert_payload[CONFIGURATION].keys():
        alert_payload[CONFIGURATION][CALL_TO_ACTION_URL] = ""

    if TOKEN not in alert_payload[CONFIGURATION].keys():
        alert_payload[CONFIGURATION][TOKEN] = ""

    if FIELDNAME not in alert_payload[CONFIGURATION].keys():
        alert_payload[CONFIGURATION][FIELDNAME] = ""

def persist_alert(log: logging.Logger, alert: Alert, session_key, user):
    """
    Takes an alert (json object), a server uri and a splunk session key and posts each
    alert into KV Store.

    Currently does it synchronously but we should optimize by making each post request async.

    Arguments:
        server_uri {string} -- uri of the server
        alert {Alert} -- Alert object to be persisted to KV store
        session_key {string} -- session key given by Splunk. Used for auth.
        user {string} -- the username of the current Splunk user performing the action
    """

    mobile_alerts_accessor = KvStoreAccessor(collection=constants.MOBILE_ALERTS_COLLECTION_NAME,
                                             owner=user,
                                             session_key=session_key)

    try:
        kv_doc = {
            "created_at": alert.notification.created_at,
            "alert_pb_json": MessageToJson(alert.to_protobuf(), indent=None),
        }
        r, response = mobile_alerts_accessor.insert_single_item(kv_doc)

        log.debug("Response from KV Store: " + response.decode('ascii'))
        return json.loads(response)

    except Exception as e:
        log.exception(f"Error writing alert to KV Store, error={e}")
        return {}


async def persist_recipient_devices(log: logging.Logger, request_context, key, active_devices: List[DeviceUserPair],
                                    snoozed_devices: List[DeviceUserPair], alert_payload, async_client):
    """Given an alert payload generated by splunk and an alert id of the alert as it is
       stored in KV store, creates a RecipientDevice record in KV Store for each device that
       should receive the alert and persists that device in KV Store. Each post request for
       each device is handled asynchronously.

       Arguments:
           key {string} -- key of alert in KV Store
           active_devices {List of DeviceUserPair} -- List of devices that will receive a notification
           snoozed_devices {List of DeviceUserPair} -- List of devices that will not receive a notification
           alert_payload {json} -- Alert payload generated by splunk
           session_key {string} -- Session key given by the alert
           async_client {AsyncKvStoreClient} -- instance of kv store client to perform async requests
       """

    successes = []
    exceptions = []

    for device_user_pair in active_devices:
        try:
            payload = RecipientDevice(alert_id=key, device_id=device_user_pair.device,
                                      timestamp=alert_payload[CONFIGURATION][ALERT_TIMESTAMP_FIELD], was_snoozed=False)
            response = await async_client.async_kvstore_post_request(
                collection=constants.ALERTS_RECIPIENT_DEVICES_COLLECTION_NAME,
                data=payload.to_json(),
                owner=device_user_pair.user,
                auth_header=request_context.system_auth_header)
            successes.append(response)
        except Exception as e:
            exceptions.append(e)

    for device_user_pair in snoozed_devices:
        try:
            payload = RecipientDevice(alert_id=key, device_id=device_user_pair.device,
                                      timestamp=alert_payload[CONFIGURATION][ALERT_TIMESTAMP_FIELD], was_snoozed=True)
            response = await async_client.async_kvstore_post_request(
                collection=constants.ALERTS_RECIPIENT_DEVICES_COLLECTION_NAME,
                data=payload.to_json(),
                owner=device_user_pair.user,
                auth_header=request_context.system_auth_header)
            successes.append(response)
        except Exception as e:
            exceptions.append(e)

    if exceptions:
        log.error("Encountered exceptions persisting recipient devices, e=%s", str(exceptions))


async def should_user_receive_notification(log: logging.Logger,
                          request_context: RequestContext,
                          async_kvstore_client:AsyncKvStoreClient,
                          notification: Notification,
                          user: str,
                          current_timestamp: int) -> bool:

    """ Determine if user should receive a notification for the alert by taking into account user's snoozes """

    log.debug(f'Determining if user={user} should receive notification for alert={notification.saved_search}')
    query = {constants.AND_OPERATOR: [{constants.USER: user},
                                      {constants.END_TIME: {constants.GREATER_THAN_OPERATOR: current_timestamp}}]}


    params = {constants.QUERY: json.dumps(query)}

    snoozes_by_user = await async_kvstore_client.async_kvstore_get_request(
        collection=constants.USER_SNOOZES_COLLECTION_NAME,
        auth_header=request_context.auth_header,
        params=params
    )
    if snoozes_by_user.code != HTTPStatus.OK:
        err_text = await snoozes_by_user.text()
        log.debug('Failed to fetch snoozes while sending notifications with message %s', err_text)
        return True

    snoozes_by_user_jsn = await snoozes_by_user.json()
    log.debug(f'found {len(snoozes_by_user_jsn)} active snoozes for user={user}. Proceeding to check if any relevant snoozes apply. ')
    for snooze in snoozes_by_user_jsn:

        # Snooze All: Check if current time is less than end time. If it is, snooze is still valid so return true
        if snooze.get(constants.SNOOZE_TYPE) == constants.SNOOZE_ALL_TYPE:

            log.debug(f'user={user} has currently snoozed all notifications and will not receive this notification')
            return False

        # Snooze App: Check if current alert's app is same as snoozed app and check time condition
        if snooze.get(constants.SNOOZE_TYPE) == constants.SNOOZE_APP_TYPE and \
            snooze.get(constants.APP) == notification.app_name:

            log.debug(f'user={user} has current snoozed notifications for app={snooze.get(constants.APP)} and will not receive this notification')
            return False

        # Snooze Alert: Check if current alert's name and app is same as snoozed alert and check time condition
        if snooze.get(constants.SNOOZE_TYPE) == constants.SNOOZE_ALERT_TYPE  and  \
            snooze.get(constants.ALERT_ID) == notification.saved_search and \
            snooze.get(constants.APP) == notification.app_name:

            log.debug(f'user={user} has current snoozed notifications for alert={snooze.get("alert_id")} and will not receive this notification')
            return False

    log.debug(f'found no relevant snoozes, proceeding to allow notification for user={user}')
    return True


async def determine_recipient_status(log: logging.Logger,
                                     request_context,
                                     notification,
                                     recipient_devices: List[DeviceUserPair],
                                     async_kvstore_client) -> (List[DeviceUserPair], List[DeviceUserPair]):

    """ Sorts the supplied recipient_devices into two lists, the first list contains devices that have snoozed the
    alert, the second list contains the devices that will receive the alert """

    snoozed_users = set()
    snoozed_devices = set()
    active_devices = set()
    for alert_recipient in recipient_devices:
        device_id_str = alert_recipient.device
        user = alert_recipient.user
        current_time = get_current_timestamp()

        if user and user in snoozed_users:
            log.debug(
                f'user={user} has snoozed notifications, skipping sending notification for device={device_id_str}')
            snoozed_devices.add(alert_recipient)
            continue

        if user and user not in snoozed_users and not \
            await should_user_receive_notification(log, request_context, async_kvstore_client, notification, user,
                                                   current_time):
            # If user is snoozed, add to cache so that we don't need to check other devices for the same user
            log.debug(
                f'user={user} has snoozed notifications, skipping sending notification for device={device_id_str} and adding user to snooze cache')
            snoozed_users.add(user)
            snoozed_devices.add(alert_recipient)
            continue

        active_devices.add(alert_recipient)

    return snoozed_devices, active_devices


async def send_push_notification(log: logging.Logger,
                                 request_context,
                                 notification,
                                 recipient_devices: List[DeviceUserPair],
                                 async_kvstore_client,
                                 async_spacebridge_client,
                                 async_splunk_client):
    """
    Given a notification object and a list of device ids, sends a post request to the Spacebridge notif API
    for each device id
    :param log:
    :param request_context:
    :param notification: notification object to be sent
    :param recipient_devices: list of device id strings
    :param async_kvstore_client: AsyncKVStoreClient
    :param async_spacebridge_client: AsyncSpacebridgeClient
    :param async_splunk_client: AsyncSpacebridgeClient
    :return:
    """

    sodium_client = SodiumClient(log.getChild('sodium_client'))
    deployment_info = await async_splunk_client.async_get_deployment_info(request_context.system_auth_header)

    # fetch sign public key from deployment info endpoint
    if deployment_info.code == HTTPStatus.OK:
        response = await deployment_info.json()
        sign_public_key = b64decode(response.get(SIGN_PUBLIC_KEY, ""))
        encryption_keys = EncryptionKeys(sign_public_key, None, None, None)
        encryption_context = EncryptionContext(encryption_keys)

    else:
        error = await deployment_info.text()
        log.exception("Unable to fetch signing public key with error_code=%s", str(deployment_info.code))
        raise EncryptionKeyError(error, deployment_info.code)

    sender_id = encryption_context.sign_public_key(transform=encryption_context.generichash_raw)
    headers = {HEADER_CONTENT_TYPE: APPLICATION_PROTOBUF}
    async_sign_payload = partial(async_splunk_client.sign_payload, request_context.system_auth_header)

    successes = []
    exceptions = []

    for device_user_pair in recipient_devices:

        try:
            device_id_str = device_user_pair.device
            device_id = device_id_str.encode('utf-8')
            device_id_raw = b64decode(device_id)

            _, receiver_encrypt_public_key = await public_keys_for_device(device_id_raw,
                                                                          request_context.system_auth_header,
                                                                          async_kvstore_client)

            encryptor = partial(encrypt_for_send,
                                sodium_client,
                                receiver_encrypt_public_key)

            notification_request = await notifications.async_build_notification_request(log,
                                                                            device_id, device_id_raw, sender_id,
                                                                            notification,
                                                                            encryptor, async_sign_payload)

            # Send post request asynchronously
            r = await async_spacebridge_client.async_send_notification_request(
                auth_header=SpacebridgeAuthHeader(sender_id),
                data=notification_request.SerializeToString(),
                headers=headers)
            successes.append({"Recipient device id": device_id_str, "Status": r.code })

        except KeyNotFoundError:
            log.info("Public key not found for device_id=%s", device_id)
            exceptions.append({"Recipient device id": device_id_str, "Response": "n/a"})

        except SodiumOperationError:
            log.warning("Sodium operation failed! device_id=%s", device_id)
            exceptions.append({"Recipient device id": device_id_str, "Response": r.code})
        except Exception as e:
            log.exception(f'unexpected error when sending push notification for device_id={device_id}, error={e}')
            exceptions.append({"Recipient device id": device_id_str, "Response": r.code})

    log.info("Finished sending push notifications with responses=%s", str(successes))

    if exceptions:
        log.error("Encountered exceptions sending pushing notifications to devices=%s", str(exceptions))

    return [successes, exceptions]

# Helper object for Dashboard objects which can be returned in deferred
class DashboardTuple(object):
    """
    Helper object to pass around dashboard objects in deferred
    """

    def __init__(self, dashboard_description=None, list_dashboard_data=None):
        self.dashboard_description = dashboard_description
        self.list_dashboard_data = list_dashboard_data


async def fetch_dashboard_url_dashboard_tuple(log: logging.Logger,
                                              request_context,
                                              dashboard_url=None,
                                              async_splunk_client=None,
                                              async_kvstore_client=None,
                                              input_tokens=None):
    """
    Helper method which fetches dashboard objects from a dashboard_url
    """
    # Fetch Dashboard Description, for alerts don't return params
    try:
        dashboard_description = await fetch_dashboard_description(log,
                                                                  request_context,
                                                                  dashboard_id=dashboard_url,
                                                                  show_refresh=False,
                                                                  async_splunk_client=async_splunk_client,
                                                                  async_kvstore_client=async_kvstore_client)

        set_default_token_values(input_tokens, dashboard_description.input_tokens)
        # Find all the visualizations in the dashboard and get the data
        if dashboard_description.is_udf:
            list_dashboard_data = []
        else:
            list_dashboard_data = await get_list_dashboard_data(log,
                                                            request_context,
                                                            dashboard_description=dashboard_description,
                                                            input_tokens=input_tokens,
                                                            async_splunk_client=async_splunk_client)

        log.info("DashboardData List Size len=%d", len(list_dashboard_data))
        return DashboardTuple(dashboard_description, list_dashboard_data)
    except Exception as e:
        log.exception("Exception fetching dashboard=%s, error=%s", str(dashboard_url), str(e))
        return DashboardTuple()


async def fetch_search_job_dashboard_tuple(log: logging.Logger,
                                           request_context, alert_payload, async_splunk_client=None):
    """
    Helper method to fetch dashboard objects from a search_job
    """
    app_name = alert_payload[APP]
    owner = alert_payload[OWNER]
    search_id = alert_payload[SEARCH_ID]
    configuration = alert_payload[CONFIGURATION]
    alert_message = configuration[ALERT_MESSAGE]
    alert_subject = configuration[ALERT_SUBJECT]
    list_dashboard_data = []

    # Get search_content_when_done, function will retry until search job is_done
    search_job_content = await get_search_job_content(log,
                                                      auth_header=request_context.auth_header,
                                                      owner=owner,
                                                      app_name=app_name,
                                                      search_id=search_id,
                                                      async_splunk_client=async_splunk_client)

    if not search_job_content:
        return DashboardTuple()

    # Create fake dashboard_description
    display_app_name = await fetch_display_app_name(log,request_context, app_name, async_splunk_client)
    dashboard_description = create_dashboard_description_table(log,
                                                               owner=owner,
                                                               app_name=app_name,
                                                               display_app_name=display_app_name,
                                                               description=alert_message,
                                                               visualization_title=alert_subject,
                                                               query=get_string_field('reportSearch',
                                                                                      search_job_content.properties))

    # Pluck out the visualization to retrieve the visualization_id
    dashboard_visualization = dashboard_description.get_first_visualization()

    # Create the fake dashboard_visualization_id
    dashboard_visualization_id = DashboardVisualizationId(dashboard_id=dashboard_description.dashboard_id,
                                                          visualization_id=dashboard_visualization.id)

    # Append dashboard_data based on search_id with fake dashboard_visualization_id
    dashboard_data = await get_search_job_dashboard_data(log,
                                                         request_context,
                                                         owner=owner,
                                                         app_name=app_name,
                                                         search_id=search_id,
                                                         dashboard_visualization_id=dashboard_visualization_id,
                                                         async_splunk_client=async_splunk_client)
    list_dashboard_data.append(dashboard_data)

    return DashboardTuple(dashboard_description, list_dashboard_data)


async def build_alert(log: logging.Logger,
                      request_context, alert_payload=None, async_splunk_client=None, async_kvstore_client=None):
    """
    Takes an alert payload and a session key and creates an Alert object
    which is to be persisted into KV Store. The session key is required
    because a network call needs to be made to fetch the attached dashboard's
    metadata.

    :param log:
    :param request_context:
    :param alert_payload: {json} -- payload of alert sent by Splunk on alert trigger
    :param async_splunk_client:
    :param async_kvstore_client:
    :return: Alert -- alert object which contains all the necessary information for the alert,
        which is to be persisted into KV Store.
    """

    configuration = alert_payload[CONFIGURATION]
    dashboard_url = None
    dashboard_tuple = DashboardTuple()

    if configuration[DASHBOARD_TOGGLE] == ATTACH_DASHBOARD_TOGGLE and ALERT_DASHBOARD_ID in configuration.keys():
        dashboard_url = configuration[ALERT_DASHBOARD_ID]
        if alert_payload[RESULT] and configuration[FIELDNAME] in alert_payload[RESULT].keys():
            input_tokens = {configuration[TOKEN]: alert_payload[RESULT][configuration[FIELDNAME]]}
        else:
            input_tokens = {}

        # Fetch Dashboard Description, for alerts don't return params
        dashboard_tuple = await fetch_dashboard_url_dashboard_tuple(log,
                                                                    request_context,
                                                                    dashboard_url,
                                                                    async_splunk_client,
                                                                    async_kvstore_client,
                                                                    input_tokens=input_tokens)

    elif configuration[DASHBOARD_TOGGLE] == ATTACH_TABLE_TOGGLE:
        dashboard_tuple = await fetch_search_job_dashboard_tuple(log,
                                                                 request_context,
                                                                 alert_payload,
                                                                 async_splunk_client)

    call_to_action = CallToAction(uri=configuration[CALL_TO_ACTION_URL],
                                  title=configuration[CALL_TO_ACTION_LABEL])

    display_app_name = await fetch_display_app_name(log, request_context, alert_payload[APP], async_splunk_client)
    notification = Notification(alert_id=configuration[ALERT_ID],
                                severity=configuration[SEVERITY],
                                description=configuration[ALERT_MESSAGE],
                                title=configuration[SUBJECT],
                                created_at=configuration[ALERT_TIMESTAMP_FIELD],
                                call_to_action=call_to_action,
                                app_name=alert_payload[APP],
                                display_app_name=display_app_name,
                                saved_search=alert_payload.get(SEARCH_NAME))

    detail = Detail(results_link=alert_payload[RESULTS_LINK],
                    search_id=alert_payload[SEARCH_ID],
                    owner=alert_payload[OWNER],
                    dashboard_id=dashboard_url,
                    dashboard_description=dashboard_tuple.dashboard_description,
                    list_dashboard_data=dashboard_tuple.list_dashboard_data,
                    search_name=alert_payload[SEARCH_NAME],
                    result_json=alert_payload[SAVED_SEARCH_RESULT])

    alert = Alert(notification=notification, detail=detail)
    return alert


