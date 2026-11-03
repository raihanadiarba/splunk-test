"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Module to process Alerts Requests
"""

import json
import logging
from collections.abc import Iterable

from http import HTTPStatus
from typing import Dict, List
import hashlib
from spacebridgeapp.rest.clients.async_splunk_client import AsyncSplunkClient
from spacebridgeapp.util import py23
from spacebridgeapp.util.constants import OR_OPERATOR, LESS_THAN_OPERATOR, GREATER_THAN_OPERATOR, SORT, LIMIT, QUERY, \
    KEY, ALERT_ID, DEVICE_ID
from spacebridgeapp.messages.request_context import RequestContext
from spacebridgeapp.rest.clients.async_kvstore_client import AsyncKvStoreClient
from spacebridgeapp.util import constants
from spacebridgeapp.exceptions.spacebridge_exceptions import SpacebridgeApiRequestError
from splapp_protocol import request_pb2, common_pb2
from spacebridgeapp.util.time_utils import get_current_timestamp
from splapp_protocol.common_pb2 import AlertNotification, Snooze, SnoozeAll, SnoozeApp, SnoozeAlert, Alert
from dataclasses import dataclass


@dataclass
class AlertStatus:
    alert_id: str
    was_snoozed: bool


def _deserialize_alert_proto(alert_json: dict) -> common_pb2.Alert:
    from google.protobuf.json_format import Parse
    return Parse(alert_json["alert_pb_json"], common_pb2.Alert())


async def process_alerts_list_request(log: logging.Logger,
                                      request_context,
                                      client_single_request,
                                      server_single_response,
                                      async_kvstore_client):
    """
    This method will process alerts list requests
    """

    await populate_alerts_list_response(log,
                                        request_context,
                                        client_single_request,
                                        server_single_response,
                                        async_kvstore_client)


async def process_alert_get_request(log: logging.Logger,
                                    request_context,
                                    client_single_request,
                                    server_single_response,
                                    async_kvstore_client):
    """
    This method will process an alert get request to fetch a single alert
    :param log:
    :param request_context:
    :param client_single_request: clientSingleRequest proto with alertGetRequest field
    :param server_single_response: ServerSingleResponse opbject with alertGetResponse field
    :param async_kvstore_client:
    :return: void (modifies the server single response proto)
    """

    log.info("Fetching alert get for alert=%s", client_single_request.alertGetRequest.alertId)

    alert_id = client_single_request.alertGetRequest.alertId

    alert = await fetch_alert(request_context=request_context,
                              alert_id=alert_id,
                              async_kvstore_client=async_kvstore_client)
    server_single_response.alertGetResponse.alert.CopyFrom(alert)
    log.info("Finished processing alert get request")


async def process_alerts_delete_request(log: logging.Logger,
                                        request_context, client_single_request, server_single_response, async_kvstore_client):
    """
    This method will process alerts delete requests
    :param log:
    :param request_context:
    :param client_single_request: reference client request object
    :param server_single_response:  pass-by-reference return object
    :param async_kvstore_client:
    """
    log.info("Processing Alerts Delete Request")

    alert_ids = client_single_request.alertsDeleteRequest.alertIds

    await _delete_alerts_for_device(request_context, alert_ids, async_kvstore_client)

    server_single_response.alertsDeleteResponse.alertIds.extend(alert_ids)
    log.info("Finished processing Alerts Delete Request")


async def populate_alerts_list_response(log: logging.Logger,
                                        request_context,
                                        client_single_request,
                                        single_server_response,
                                        async_kvstore_client):
    """
    Takes a client_single_request object and a device id and fetches the corresponding alert ids from kv store
    the single_server_response input proto with the fetched alerts.
    :param request_context:
    :param client_single_request: proto of client_single_request provided by the client
    :param single_server_response: server_single_response proto to be returned by splapp
    :param async_kvstore_client: client to make requests to kv store
    :return: No return. Single Server Response input is mutated with return values
    """

    continuation_id = client_single_request.alertsListRequest.continuationId
    max_results = client_single_request.alertsListRequest.maxResults
    order = client_single_request.alertsListRequest.order

    log.info("Start populate_alerts_list_response")

    # fetch alert ids for device and then fetch corresponding alert bodies
    alert_status = await fetch_alert_status(log,
                                            request_context=request_context,
                                            order=order,
                                            continuation_id=continuation_id,
                                            num_results=max_results,
                                            async_kvstore_client=async_kvstore_client)

    log.debug("Fetched alert_status, alert_status=%s", alert_status)

    alert_bodies = await fetch_alert_bodies(log,
                                            request_context=request_context,
                                            alert_status=alert_status,
                                            async_kvstore_client=async_kvstore_client,
                                            order=order)

    log.debug("Fetched alert_bodies, size=%s", len(alert_bodies))

    alert_protos = []
    for alert_proto in alert_bodies:
        alert_proto.ClearField('detail')
        alert_protos.append(alert_proto)

    # populate server response proto
    single_server_response.alertsListResponse.continuationId = continuation_id

    # for some reason, direct assignment for repeated fields throws an error, so we do it manually. First delete
    # any elements in the list and then add the fields we want.
    del single_server_response.alertsListResponse.alerts[:]
    single_server_response.alertsListResponse.alerts.extend(alert_protos)
    single_server_response.alertsListResponse.order = order

    if len(alert_protos) > 0:
        single_server_response.alertsListResponse.nextContinuationId = alert_protos[-1].notification.createdAt

    log.info("Finished populating response for alerts list request with num_alerts=%d", len(alert_protos))


async def process_get_snoozeable_alerts_request(log: logging.Logger,
                                                request_context: RequestContext,
                                                client_single_request: request_pb2.ClientSingleRequest,
                                                server_single_response: request_pb2.ServerSingleResponse,
                                                async_splunk_client: AsyncSplunkClient):
    """
    Takes a client_single_request proto with a snoozeableAlertsGetRequest proto set, and queries the Splunk saved
    searches API using the supplied appName and pagination parameters. Returns a list of AlertNotification protos via
    the snoozeableAlertsGetResponse.

    :param log:
    :param request_context:
    :param client_single_request: proto of client_single_request provided by the client
    :param server_single_response: server_single_response proto to be returned by splapp
    :param async_splunk_client: AsyncSplunkClient object to make requests to Splunk
    :return: No return. Single Server Response input is mutated with return values
    """

    log.info(
        f'Processing get snoozeable alerts request app={client_single_request.snoozeableAlertsGetRequest.appName}')

    app_name = client_single_request.snoozeableAlertsGetRequest.appName
    if app_name is None or app_name == "":
        app_name = "-"

    count = client_single_request.snoozeableAlertsGetRequest.count
    offset = client_single_request.snoozeableAlertsGetRequest.offset

    # Has mobile alert action AND is an alert AND is visible
    search = "action.ssg_mobile_alert=1 " \
             "AND (is_scheduled=1 AND (alert_type != always OR alert.track=1)) " \
             "AND is_visible = 1"

    r = await async_splunk_client.async_get_namespaced_saved_searches(auth_header=request_context.auth_header,
                                                                      owner="-", app_name=app_name, ref="", count=count,
                                                                      offset=offset, search=search)

    if r.code != HTTPStatus.OK:
        message = await r.text()
        raise SpacebridgeApiRequestError(
            f'Failed to get snoozeable alerts with message={message}',
            status_code=r.code)

    jsn = await r.json()

    # Construct and add AlertNotification(s) to response if entries are present
    if 'entry' in jsn.keys() and isinstance(jsn['entry'], Iterable):
        for entry in jsn['entry']:
            content = entry['content']
            notification_message = content.get("action.ssg_mobile_alert.param.alert_message", "")
            notification_subject = content.get("action.ssg_mobile_alert.param.alert_subject", "")
            description = content.get("description", "")
            dashboard_id = content.get("action.ssg_mobile_alert.param.alert_dashboard_id", "")
            cta_label = content.get("action.ssg_mobile_alert.param.alert_call_to_action_label", "")
            cta_url = content.get("action.ssg_mobile_alert.param.alert_call_to_action_url", "")
            alert_app = entry['acl']['app']

            try:
                severity = int(content.get("action.ssg_mobile_alert.param.alert_severity", "0"))
            except(ValueError, TypeError):
                severity = 0  # Undefined

            alert_notification = AlertNotification(appName=alert_app, savedSearch=entry['name'],
                                                   notificationMessage=notification_message,
                                                   notificationSubject=notification_subject, description=description,
                                                   dashboardId=dashboard_id, severity=Alert.Severity.Name(severity),
                                                   callToAction=Alert.CallToAction(uri=cta_url, title=cta_label))
            server_single_response.snoozeableAlertsGetResponse.alerts.append(alert_notification)

    log.info('Finished processing get snoozeable alerts request')


async def process_snooze_request(log: logging.Logger,
                                 request_context: RequestContext,
                                 client_single_request: request_pb2.ClientSingleRequest,
                                 server_single_response: request_pb2.ServerSingleResponse,
                                 async_kvstore_client: AsyncKvStoreClient):
    """
    Takes a client_single_request proto with a snoozeRequest proto set, and creates a snooze internally
    for the user in the request_context. This snooze will prevent certain push notifications from being sent to
    the user or device until the endTime specified in the proto. The push notifications which are silenced are specified
    in the request, currently SnoozeAll, SnoozeApp and SnoozeAlert are supported.

    :param log:
    :param request_context: RequestContext object with device_id and auth_header to use for create the snooze
    :param client_single_request: proto of client_single_request provided by the client
    :param server_single_response: server_single_response proto to be returned by splapp
    :param async_kvstore_client: AsyncKVStoreClient object to make requests to kv store
    :return: No return. Single Server Response input is mutated with return values
    """

    log.debug('Processing snooze request')
    post_data = get_post_arguments_for_snooze(request=client_single_request.snoozeRequest, request_context=request_context)

    #TODO: Validate that app/alert exists before saving?

    kvstore_response = await async_kvstore_client.async_kvstore_post_or_update_request(
        collection=constants.USER_SNOOZES_COLLECTION_NAME,
        key_id=post_data[constants.KEY],
        data=json.dumps(post_data),
        auth_header=request_context.system_auth_header
    )
    if kvstore_response.code not in {HTTPStatus.OK, HTTPStatus.CREATED, HTTPStatus.CONFLICT}:
        message = await kvstore_response.text()
        raise SpacebridgeApiRequestError(
            f'Call to create snooze failed with message={message}',
            status_code=kvstore_response.code)
    server_single_response.snoozeResponse.snoozeID = post_data[KEY]
    log.debug('Finished processing snooze request')


async def process_unsnooze_request(log: logging.Logger,
                                   request_context: RequestContext,
                                   client_single_request: request_pb2.ClientSingleRequest,
                                   server_single_response: request_pb2.ServerSingleResponse,
                                   async_kvstore_client: AsyncKvStoreClient):
    """
    Takes a client_single_request proto with a unsnoozeRequest proto set, and deletes a snooze internally
    for the device_id in the request_context.
    :param log:
    :param request_context: RequestContext object with device_id and auth_header to use for deleting the snooze
    :param client_single_request: proto of client_single_request provided by the client
    :param server_single_response: server_single_response proto to be returned by splapp
    :param async_kvstore_client: AsyncKVStoreClient object to make requests to kv store
    :return: No return. Single Server Response input is mutated with return values
    """

    log.debug('Processing unsnooze request')
    snooze_type = client_single_request.unsnoozeRequest.WhichOneof(constants.SNOOZE_TYPE_ONEOF)

    if snooze_type is None or not client_single_request.unsnoozeRequest.HasField(snooze_type):
        raise SpacebridgeApiRequestError(
            'Need to provide valid snoozeType with unsnooze request',
            status_code=HTTPStatus.BAD_REQUEST)

    snooze_key = get_snooze_key(getattr(client_single_request.unsnoozeRequest, snooze_type), snooze_type, request_context)
    query = {KEY: snooze_key}
    snooze_delete = await async_kvstore_client.async_kvstore_delete_request(
            collection=constants.USER_SNOOZES_COLLECTION_NAME,
            params={QUERY: json.dumps(query)},
            auth_header=request_context.system_auth_header,
        )

    if snooze_delete.code != HTTPStatus.OK:
        message = await snooze_delete.text()
        raise SpacebridgeApiRequestError(
            f'Call to delete snooze failed with message={message}',
            status_code=snooze_delete.code)

    # KVStore doesn't tell us what ID we deleted, so we assume that KVStore worked properly and deleted
    server_single_response.unsnoozeResponse.snoozeIDs.extend([snooze_key])
    log.debug('Finished processing unsnooze request')


async def process_get_snooze_request(log: logging.Logger,
                                     request_context: RequestContext,
                                     client_single_request: request_pb2.ClientSingleRequest,
                                     server_single_response: request_pb2.ServerSingleResponse,
                                     async_kvstore_client: AsyncKvStoreClient):
    """
    Takes a client_single_request proto with a getSnoozeRequest proto set, and fetches
    a snooze for the device_id in the request_context.

    :param log:
    :param request_context: RequestContext object with device_id and auth_header to use for create the snooze
    :param client_single_request: proto of client_single_request provided by the client
    :param server_single_response: server_single_response proto to be returned by splapp
    :param async_kvstore_client: AsyncKVStoreClient object to make requests to kv store
    :return: No return. Single Server Response input is mutated with return values
    """

    log.debug('Processing get snooze request')
    snoozes = []

    current_timestamp = int(get_current_timestamp())
    json_snoozes = await fetch_snoozes_for_device(request_context, async_kvstore_client,
                                                  filter_timestamp=current_timestamp,
                                                  app_name=client_single_request.getSnoozeRequest.appName)

    for json_snooze in json_snoozes:
        snoozes.append(build_snooze_from_json(json_snooze))

    server_single_response.getSnoozeResponse.snoozes.extend(snoozes)
    log.debug('Finished processing get snooze request')

def build_snooze_from_json(json: Dict[str, str]) -> Snooze:
    """
    Consumes a dict containing the json representation of snooze and converts it into a Snooze proto
    """
    snooze_type = json.get(constants.SNOOZE_TYPE, None)
    is_device_specific = constants.DEVICE_ID in json.keys() and json[constants.DEVICE_ID] is not None

    if snooze_type is None:
        raise SpacebridgeApiRequestError(
            'Need to provide requestType with snooze request',
            status_code=HTTPStatus.BAD_REQUEST)
    elif snooze_type == constants.SNOOZE_ALL_TYPE:
        snooze_all = SnoozeAll(isDeviceSpecific=is_device_specific)
        return Snooze(snoozeId=json.get(constants.KEY), endTime=json.get(constants.END_TIME), snoozeAll=snooze_all)
    elif snooze_type == constants.SNOOZE_APP_TYPE:
        snooze_app = SnoozeApp(appName=json.get(constants.APP), isDeviceSpecific=is_device_specific)
        return Snooze(snoozeId=json.get(constants.KEY), endTime=json.get(constants.END_TIME), snoozeApp=snooze_app)
    elif snooze_type == constants.SNOOZE_ALERT_TYPE:
        snooze_alert = SnoozeAlert(savedSearch=json.get(constants.ALERT_ID), appName=json.get(constants.APP),
                                   isDeviceSpecific=is_device_specific)
        return Snooze(snoozeId=json.get(constants.KEY), endTime=json.get(constants.END_TIME), snoozeAlert=snooze_alert)
    else:
        raise SpacebridgeApiRequestError(
            f'Unable to process requestType {snooze_type}',
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR)


def get_post_arguments_for_snooze(request: request_pb2.SnoozeRequest, request_context: RequestContext) -> Dict[str, any]:
    """
    Creates a dict of post arguments for inserting a snooze based on the snooze request and request context
    mostly here to provide easily testable post arguments. User, device_id and raw_device_id of the RequestContext are
    used.

    :param request: The client snooze request
    :param request_context: The context of the request, containing user and device details

    :return: post arguments for a kvstore insert of the object, and a failure if unknown request type
    """

    snooze_type = request.WhichOneof(constants.SNOOZE_TYPE_ONEOF)
    device_id = request_context.device_id
    user = request_context.current_user

    if snooze_type is None:
        raise SpacebridgeApiRequestError(
            'Need to provide requestType with snooze request',
            status_code=HTTPStatus.BAD_REQUEST)
    elif snooze_type == constants.SNOOZE_ALL_TYPE:
        return {
            constants.KEY: get_snooze_key(request.snoozeAll, snooze_type, request_context),
            constants.END_TIME: request.endTime,
            constants.SNOOZE_TYPE: snooze_type,
            constants.USER: user,
            constants.DEVICE_ID: device_id if request.snoozeAll.isDeviceSpecific else None,
        }
    elif snooze_type == constants.SNOOZE_APP_TYPE:
        return {
            constants.KEY: get_snooze_key(request.snoozeApp, snooze_type, request_context),
            constants.END_TIME: request.endTime,
            constants.SNOOZE_TYPE: snooze_type,
            constants.USER: user,
            constants.APP: request.snoozeApp.appName,
            constants.DEVICE_ID: device_id if request.snoozeApp.isDeviceSpecific else None,
        }
    elif snooze_type == constants.SNOOZE_ALERT_TYPE:
        return {
            constants.KEY: get_snooze_key(request.snoozeAlert, snooze_type, request_context),
            constants.END_TIME: request.endTime,
            constants.SNOOZE_TYPE: snooze_type,
            constants.USER: user,
            constants.APP: request.snoozeAlert.appName,
            constants.ALERT_ID: request.snoozeAlert.savedSearch,
            constants.DEVICE_ID: device_id if request.snoozeAlert.isDeviceSpecific else None,
        }
    else:
        raise SpacebridgeApiRequestError(
            f'Unable to process requestType {snooze_type}',
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR)


def get_snooze_key(snooze: any, snooze_type: str, request_context: RequestContext) -> str:
    """
    Generates the kv store key of a snooze based on snooze details and the request context
    """
    encoded_device_id = py23.urlsafe_b64encode_to_str(request_context.raw_device_id)
    user = request_context.current_user

    if snooze_type == constants.SNOOZE_ALL_TYPE:
        key = f"{user}:{snooze_type}:device({encoded_device_id})" if snooze.isDeviceSpecific else f"{user}:{snooze_type}"
    elif snooze_type == constants.SNOOZE_APP_TYPE:
        key = f"{user}:{snooze_type}:{snooze.appName}:device({encoded_device_id})" if snooze.isDeviceSpecific else f"{user}:{snooze_type}:{snooze.appName}"
    elif snooze_type == constants.SNOOZE_ALERT_TYPE:
        key = f"{user}:{snooze_type}:{snooze.appName}:{snooze.savedSearch}:device({encoded_device_id})" if snooze.isDeviceSpecific else f"{user}:{snooze_type}:{snooze.appName}:{snooze.savedSearch}"
    else:
        raise SpacebridgeApiRequestError(
            f'Unable to process requestType {snooze_type}',
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR)

    return hashlib.sha256(key.encode('utf-8')).hexdigest()


async def fetch_snoozes_for_device(request_context: RequestContext,
                                   async_kvstore_client: AsyncKvStoreClient,
                                   filter_timestamp=None,
                                   app_name=None) -> Dict[str, str]:
    """
    Fetches a SnoozeAll object for a particular device_id (based on request_context). If the SnoozeAll object
    exists, it will be returned as a dict direct from kvstore, otherwise an empty dict will be returned

    :param request_context: RequestContext object, auth header, user, and device_id are used for fetching snooze
    :param async_kvstore_client: AsyncKVStoreClient used to fetch the snooze object
    :param filter_timestamp: return snoozes more recent than this timestamp. Return all if no timestamp provided
    :param app_name: return snoozes related to this app or all apps only. Returns all if not provided
    :return: A json array of snooze details
    """

    # Building query to fetch snoozes, we always fetch user snoozes for all devices or this device specifically
    query = {constants.AND_OPERATOR: [{constants.USER: request_context.current_user},
                                      {constants.OR_OPERATOR: [{constants.DEVICE_ID: request_context.device_id},
                                                               {constants.DEVICE_ID: None}]}]}

    # If filter_timestamp is supplied, add end_time > filter_timestamp condition. Used to filter expired snoozes
    if filter_timestamp:
        query[constants.AND_OPERATOR].append({constants.END_TIME: {constants.GREATER_THAN_OPERATOR: filter_timestamp}})

    # If app_name is supplied, add a condition to filter snoozes to those for that app or those that impact all apps
    if app_name:
        query[constants.AND_OPERATOR].append({constants.OR_OPERATOR: [{constants.APP: app_name},
                                                                      {constants.APP: None}]})

    snoozes_resp = await async_kvstore_client.async_kvstore_get_request(
        collection=constants.USER_SNOOZES_COLLECTION_NAME,
        params={QUERY: json.dumps(query)},
        auth_header=request_context.system_auth_header,
    )

    if snoozes_resp.code != HTTPStatus.OK:
        message = await snoozes_resp.text()
        raise SpacebridgeApiRequestError(
            f'Call to fetch all snoozes failed with message={message}',
            status_code=snoozes_resp.code)
    return await snoozes_resp.json()


async def fetch_alert_bodies(log: logging.Logger,
                             request_context,
                             alert_status: List[AlertStatus] = None,
                             async_kvstore_client=None,
                             order=None):
    """
    Takes a list of alert ids and returns a list of the corresponding alert data objects by fetching them from
    kv store
    :param log:
    :param request_context:
    :param alert_status: dict of AlertStatus
    :order: proto specifying whether to return results in ascending or descending order by timestamp
    :param async_kvstore_client: instance of AsyncKvStoreClient
    :param order:
    :return: ordered list of alert objects corresponding to the input alert ids
    """

    if alert_status is None or not alert_status:
        return []

    query = {OR_OPERATOR: [{KEY: status.alert_id} for status in alert_status]}
    sort_order = (1 if order == request_pb2.ASCENDING else -1)
    sort_param = "created_at:%d" % sort_order

    alert_bodies_response = await async_kvstore_client.async_kvstore_get_request(
        constants.MOBILE_ALERTS_COLLECTION_NAME,
        params={QUERY: json.dumps(query), SORT: sort_param},
        auth_header=request_context.system_auth_header,
        owner=request_context.current_user
    )

    if alert_bodies_response.code != HTTPStatus.OK:
        message = await alert_bodies_response.text()
        raise SpacebridgeApiRequestError(
            "Call to fetch alert bodies failed with message={}".format(message),
            status_code=alert_bodies_response.code)

    alert_bodies_response_json = await alert_bodies_response.json()
    alerts_list = []

    # Construct dict so that statuses only need to be iterated on once while determining snooze state
    status_dict = {status.alert_id: status for status in alert_status}

    # Deserialize each alert from its stored protobuf bytes and embed snooze status
    for alert_json in alert_bodies_response_json:
        try:
            alert_proto = _deserialize_alert_proto(alert_json)
            alert_proto.notification.alertId = alert_json[KEY]
            alert_proto.notification.wasSnoozed = status_dict[alert_json[KEY]].was_snoozed
            alerts_list.append(alert_proto)
        except Exception:
            log.exception("Exception in processing alert json=%s", alert_json)

    return alerts_list


async def _delete_alerts_for_device(request_context: RequestContext, alert_ids, async_kvstore_client):
    """
    Delete a list of alert ids for a given device from the alert_recipient_devices collection. This is so that the
    alert is not fetched for that particular device in the feature. The actual body of the alert still exists in KV Store
    :param request_context:
    :param alert_ids: [list[string]] list of alert ids to be deleted
    :param async_kvstore_client:
    :return:
    """
    query = {OR_OPERATOR: [{"alert_id": alert_id, "device_id": request_context.device_id} for alert_id in alert_ids]}
    response = await async_kvstore_client.async_kvstore_delete_request(collection=constants.ALERTS_RECIPIENT_DEVICES_COLLECTION_NAME,
                                                                       auth_header=request_context.system_auth_header,
                                                                       owner=request_context.current_user,
                                                                       params={QUERY: json.dumps(query)})
    if response.code != HTTPStatus.OK:
        message = await response.text()
        raise SpacebridgeApiRequestError(
            "Call to delete alert for user failed with message={}".format(message),
            status_code=response.code)


async def delete_all_alerts_for_device(request_context: RequestContext, async_kvstore_client):
    """
    Delete all alert ids for a given device from the alert_recipient_devices collection. This is so that the
    alert is not fetched for that particular device in the feature. The actual body of the alert still exists in KV Store
    :param request_context:
    :param device_id: [string] id of device for which to remove the alert ids
    :param async_kvstore_client:
    :return:
    """
    query = {"device_id": request_context.device_id}
    response = await async_kvstore_client.async_kvstore_delete_request(collection=constants.ALERTS_RECIPIENT_DEVICES_COLLECTION_NAME,
                                                                       auth_header=request_context.system_auth_header,
                                                                       owner=request_context.current_user,
                                                                       params={QUERY: json.dumps(query)})
    if response.code != HTTPStatus.OK:
        message = await response.text()
        raise SpacebridgeApiRequestError(
            "Call to delete all alert for user failed with message={}".format(message),
            status_code=response.code)


async def fetch_alert(request_context: RequestContext,
                      alert_id=None,
                      async_kvstore_client=None):
    """
    Retrieve a specific alert given the alert id, from KV Store

    :param request_context:
    :param alert_id:
    :param async_kvstore_client:
    :return:
    """

    query = {KEY: alert_id}
    response = await async_kvstore_client.async_kvstore_get_request(
        constants.MOBILE_ALERTS_COLLECTION_NAME,
        params={QUERY: json.dumps(query)},
        auth_header=request_context.system_auth_header,
        owner=request_context.current_user
    )

    if response.code != HTTPStatus.OK:
        message = await response.text()
        raise SpacebridgeApiRequestError(
            "Call to fetch alert by alert_id={} failed with message={}".format(alert_id, message),
            status_code=response.code)

    alert_json = await response.json()
    alert_proto = _deserialize_alert_proto(alert_json[0])
    alert_proto.notification.alertId = alert_id

    device_id = request_context.device_id
    status_query = {ALERT_ID: alert_id, DEVICE_ID: device_id}
    status_response = await async_kvstore_client.async_kvstore_get_request(collection=constants.ALERTS_RECIPIENT_DEVICES_COLLECTION_NAME,
                                                                           params={QUERY: json.dumps(status_query)},
                                                                           owner=request_context.current_user,
                                                                           auth_header=request_context.system_auth_header)

    if status_response.code != HTTPStatus.OK:
        message = await status_response.text()
        raise SpacebridgeApiRequestError(
            "Error fetching status for alerts for status_code={}, query={}, error={}"
            .format(status_response.code, json.dumps(query), message),
            status_code=status_response.code)

    status_json = await status_response.json()
    alert_proto.notification.wasSnoozed = status_json[0].get("was_snoozed", False)

    return alert_proto




async def fetch_alert_status(log: logging.Logger,
                             request_context: RequestContext,
                             order=None,
                             continuation_id=None,
                             num_results=0,  # 0 works as unlimited with kvstore API
                             async_kvstore_client=None) -> List[AlertStatus]:

    """
    Fetches the ids and snooze statusof alerts for a particular device_id based on the order (ascending, descending) and
    the continuation id (which allows for pagination)
    :param log:
    :param request_context:
    :param order: order of alerts
    :param continuation_id: timestamp of last alert to paginatine on. "" if no pagination to be done.
    :param num_results: max number of results
    :param async_kvstore_client: handler for making http requests to kv store
    :return: deferred list of alert ids for the given device id
    """
    sort_order = (1 if order == request_pb2.ASCENDING else -1)
    device_id = request_context.device_id

    log.debug("fetch_alert_ids started")

    if continuation_id is None or not continuation_id:
        # If the client provides no continuation id, then we fetch all alerts
        # belonging to the particular device id, sorted by the order provided by the client and then we take the top
        # K results.
        query = {QUERY: json.dumps({DEVICE_ID: device_id}),
                 SORT: "timestamp:%d" % sort_order,
                 LIMIT: num_results}
    else:
        # If the user provides a continuation id, which is a timestamp, we build a query to get the next K alerts
        # that happened after or before the timestamp (depending on which ordering is specified by the client)
        query = paginated_alert_query(sort_order, continuation_id, num_results, device_id)

    response = await async_kvstore_client.async_kvstore_get_request(collection=constants.ALERTS_RECIPIENT_DEVICES_COLLECTION_NAME,
                                                                    params=query,
                                                                    owner=request_context.current_user,
                                                                    auth_header=request_context.system_auth_header)

    if response.code != HTTPStatus.OK:
        message = await response.text()
        raise SpacebridgeApiRequestError(
            "Error fetching status for paginated alerts for status_code={}, query={}, error={}"
            .format(response.code, json.dumps(query), message),
            status_code=response.code)

    response_json = await response.json()
    alert_statuses = [AlertStatus(alert[ALERT_ID], alert.get("was_snoozed", False)) for alert in response_json]

    log.debug("fetch_alert_status result, alert_statuses=%s", alert_statuses)

    return alert_statuses


def paginated_alert_query(order, alert_timestamp, num_results, device_id):
    """
    Given an ordering and timestamp, returns a KV store query for getting the next or previous K results
    (depending on order) occurring after (or before)  the given  timestamp
    """
    if order == -1:
        query = {"timestamp": {LESS_THAN_OPERATOR: alert_timestamp}, "device_id": device_id}
    else:
        query = {"timestamp": {GREATER_THAN_OPERATOR: alert_timestamp}, "device_id": device_id}

    return {QUERY: json.dumps(query),
            SORT: "timestamp:%d" % order,
            LIMIT: num_results}


async def process_alerts_clear_request(log: logging.Logger,
                                       request_context, _client_single_request, server_single_response,
                                       async_kvstore_client):
    """
    Will find all alerts for the provided device, and remove the alert mappings for that device.  Does not affect
    the underlying alert bodies.
    :param log:
    :param request_context: A request context containing the device_id
    :param _client_single_request: ignored for now, a AlertsClearRequest protobuf message
    :param server_single_response: A ServerSingleResponse protobuf message
    :param async_kvstore_client:
    :return:
    """

    log.debug("process_alerts_clear_request started")

    await delete_all_alerts_for_device(request_context, async_kvstore_client)

    server_single_response.alertsClearResponse.SetInParent()
