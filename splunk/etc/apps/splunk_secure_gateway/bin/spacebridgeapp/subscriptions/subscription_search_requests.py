"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Module to process search subscriptions
"""
import hashlib

import asyncio
import logging
from collections import defaultdict

from itertools import chain
from http import HTTPStatus
from cloudgateway.private.sodium_client.errors import SodiumOperationError
from spacebridgeapp.dashboard.dashboard_helpers import parse_dashboard_id
from spacebridgeapp.dashboard.parse_search import get_string_field
from spacebridgeapp.subscriptions.process_trellis import process_trellis_format
from spacebridgeapp.util.constants import SEARCHES_COLLECTION_NAME, EXEC_MODE_NORMAL, \
    SUBSCRIPTIONS_COLLECTION_NAME, ITSI, ITSI_GLASS_TABLE
from spacebridgeapp.util.time_utils import get_expiration_timestamp_str
from spacebridgeapp.data.dispatch_state import DispatchState
from spacebridgeapp.data.dashboard_data import DashboardVisualizationId, Search
from spacebridgeapp.data.subscription_data import ServerDashboardVisualizationEvent, ServerDashboardInputSearchEvent, \
    ServerSavedSearchEvent, ServerUdfDatasourceEvent, SubscriptionSearch, TrellisDashboardVisualizationEvent, \
    TrellisSavedSearchEvent
from spacebridgeapp.data.search_type import SearchType
from spacebridgeapp.request.dashboard_request_processor import fetch_search_job_results_visualization_data, \
    get_search_job_content
from spacebridgeapp.subscriptions.subscription_update_message import build_send_subscription_update_request, \
    build_splapp_subscription_update
from cloudgateway.private.encryption.encryption_handler import encrypt_for_send, sign_detached
from cloudgateway.private.util.constants import HEADER_CONTENT_TYPE, APPLICATION_PROTOBUF
from spacebridgeapp.util.guid_generator import get_guid
from spacebridgeapp.util.string_utils import is_not_blank
from spacebridgeapp.request.request_processor import SpacebridgeAuthHeader
from spacebridgeapp.exceptions.key_not_found_exception import KeyNotFoundError
from spacebridgeapp.exceptions.error_message_helper import format_splunk_error
from spacebridgeapp.search.search_job_params import get_search_job_request_params, get_dispatch_job_request_params
from spacebridgeapp.search.input_token_support import inject_tokens_into_string, inject_time_tokens
from spacebridgeapp.search.saved_search_requests import fetch_saved_search, fetch_saved_search_history, \
    dispatch_saved_search
from spacebridgeapp.exceptions.spacebridge_exceptions import SpacebridgeApiRequestError
from functools import partial
from base64 import b64decode
from spacebridgeapp.rest.devices.util import public_keys_for_device
from spacebridgeapp.util.guid_generator import create_mobile_specific_sid

import urllib.parse as urllib

DEFAULT_SEND_DATA_POLL_INTERVAL = 2
DEFAULT_SEND_DATA_TIMEOUT = 600

DEFAULT_JOB_RESULTS_POLL_INTERVAL = 1
DEFAULT_JOB_RESULTS_TIMEOUT = 60


async def start_job_and_update_search(log: logging.Logger,
                                      auth_header, subscription_search, input_tokens,
                                      async_splunk_client, async_kvstore_client):
    if subscription_search.parent_search_key:
        parent_search = await fetch_search(auth_header, subscription_search.owner,
                                           subscription_search.parent_search_key, async_kvstore_client)
        sid = parent_search.sid
        log.debug("Updating sid from parent search_key=%s, sid=%s",
                  subscription_search.key(), sid)
    else:
        owner, app_name, dashboard_name = parse_dashboard_id(subscription_search.dashboard_id)
        sid = await spawn_search_job(log, auth_header, app_name, subscription_search, input_tokens, async_splunk_client)
        log.debug("Updating sid from job search_key=%s, sid=%s",
                  subscription_search.key(), sid)

    subscription_search.sid = sid
    subscription_search.dispatch_state = DispatchState.NONE.value
    subscription_search.done_progress = 0

    if subscription_search.refresh_interval_seconds:
        subscription_search.next_update_time = \
            get_expiration_timestamp_str(ttl_seconds=subscription_search.refresh_interval_seconds)

    log.debug("Updated subscription_search search_key=%s, sid=%s, data=%s",
              subscription_search.key(), sid, subscription_search)
    return True


def update_job_status(subscription_search, job_status):
    subscription_search.done_progress = job_status.done_progress
    subscription_search.dispatch_state = job_status.dispatch_state

async def spawn_search_job(log: logging.Logger,
                           auth_header, app_name, search, input_tokens, async_splunk_client):
    log.debug("Search starting job, search_key=%s", search.key())
    sid = await create_job_from_search(log,
                                       auth_header, search, app_name,
                                       search.owner, input_tokens, async_splunk_client)
    log.debug("Search created, search_key=%s, sid=%s", search.key(), sid)
    return sid


async def update_searches(system_auth_header, searches: list[dict] = None, async_kvstore_client=None):
    """
    Update search in kvstore collection [searches]
    :param system_auth_header:
    :param searches:
    :param async_kvstore_client:
    :return:
    """

    if not searches:
        return []

    searches_grouped_by_owner = await _group_searches_by_owner(searches)

    tasks = [async_kvstore_client.async_batch_save_request(
        auth_header=system_auth_header,
        collection=SEARCHES_COLLECTION_NAME,
        owner=owner,
        entries=searches_grouped_by_owner[owner])
        for owner in searches_grouped_by_owner.keys()]

    results = await asyncio.gather(*tasks)

    updated_ids = list(chain.from_iterable(results))

    return updated_ids


async def _group_searches_by_owner(searches) -> dict[str, list[dict]]:
    grouped = defaultdict(list)
    for search in searches:
        grouped[search["owner"]].append(search)
    return dict(grouped)


def build_subscription_update(log: logging.Logger, search, visualization_data, job_status=None):
    """
    Build Subscription update based on search type
    :param search:
    :param visualization_data:
    :param job_status
    :return:
    """
    # Return different Subscription updates based on search type
    search_type = SearchType.from_value(search.search_type)
    dashboard_visualization_id = DashboardVisualizationId(
        dashboard_id=search.dashboard_id, visualization_id=search.search_type_id)
    search_job_done_progress = job_status.done_progress if job_status else search.done_progress
    search_job_dispatch_state = job_status.dispatch_state if job_status else search.dispatch_state
    if search.trellis_enabled:
        # build server payload
        trellis_visualization_data = process_trellis_format(log, search=search, visualization_data=visualization_data)
        if search_type == SearchType.SAVED_SEARCH:
            subscription_update = TrellisSavedSearchEvent(
                saved_search_id=search.search_type_id, trellis_visualization_data=trellis_visualization_data,
                dispatch_state=search_job_dispatch_state, done_progress=search_job_done_progress)
        else:
            subscription_update = TrellisDashboardVisualizationEvent(
                dashboard_visualization_id=dashboard_visualization_id,
                trellis_visualization_data=trellis_visualization_data,
                dispatch_state=search_job_dispatch_state, done_progress=search_job_done_progress,
                search_job_properties=job_status)
    elif search_type == SearchType.INPUT:
        subscription_update = ServerDashboardInputSearchEvent(
            dashboard_id=search.dashboard_id, query_id=search.search_type_id, visualization_data=visualization_data,
            dispatch_state=search_job_dispatch_state, done_progress=search_job_done_progress,
            search_job_properties=job_status)
    elif search_type == SearchType.SAVED_SEARCH:
        subscription_update = ServerSavedSearchEvent(
            saved_search_id=search.search_type_id, visualization_data=visualization_data,
            dispatch_state=search_job_dispatch_state, done_progress=search_job_done_progress)
    elif search_type == SearchType.DATA_SOURCE:
        subscription_update = ServerUdfDatasourceEvent(
            dashboard_id=search.dashboard_id, datasource_id=search.search_type_id,
            visualization_data=visualization_data, dispatch_state=search_job_dispatch_state,
            done_progress=search_job_done_progress, search_job_properties=job_status)
    else:
        # build server payload
        subscription_update = ServerDashboardVisualizationEvent(
            dashboard_visualization_id=dashboard_visualization_id, visualization_data=visualization_data,
            dispatch_state=search_job_dispatch_state, done_progress=search_job_done_progress,
            search_job_properties=job_status)

    return subscription_update


# TODO: deprecated, remove me
def is_search_job_complete(search):
    """
    Helper method to determine if a search job is complete
    :param search:
    :return:
    """
    return ((DispatchState.from_value(search.dispatch_state) == DispatchState.DONE)
            and (search.done_progress and float(search.done_progress) >= 1.0))


async def create_job_from_search(log: logging.Logger,
                                 auth_header, subscription_search: SubscriptionSearch = None,
                                 app_name=None, owner='-', input_tokens=None,
                                 async_splunk_client=None, sid=None):
    """
    Helper method used to create job on Splunk from search object
    :param log:
    :param auth_header:
    :param subscription_search:
    :param app_name:
    :param owner:
    :param input_tokens:
    :param async_splunk_client:
    :param sid: if creating a search job for a query, allows you to override the sid value
    :return:
    """

    if not input_tokens:
        input_tokens = {}

    if not sid:
        sid = create_mobile_specific_sid()

    # itsi_glass_table is a special case app name in a dashboard_id so we need to convert when creating subscriptions
    if app_name == ITSI_GLASS_TABLE:
        app_name = ITSI

    # If search.ref then used saved search
    if subscription_search.ref:
        log.debug("Creating search job from ref search=%s, input_tokens=%s", subscription_search, input_tokens)
        sid = await get_sid_from_ref(log,
                                     auth_header=auth_header,
                                     search=subscription_search,
                                     input_tokens=input_tokens,
                                     owner=owner,
                                     app_name=app_name,
                                     async_splunk_client=async_splunk_client)
        log.debug("Created search job from ref, sid=%s", sid)
    else:
        log.debug("Creating search job from query search=%s, input_tokens=%s", subscription_search, input_tokens)
        sid = await get_sid_from_query(log,
                                       auth_header=auth_header,
                                       search=subscription_search,
                                       input_tokens=input_tokens,
                                       owner=owner,
                                       app_name=app_name,
                                       async_splunk_client=async_splunk_client,
                                       sid=sid)
        log.debug("Created search job from query, sid=%s", sid)
    return sid


async def get_sid_from_ref(log: logging.Logger,
                           auth_header, search: SubscriptionSearch = None, input_tokens=None, owner=None, app_name=None,
                           async_splunk_client=None):
    """
    This will create a search job based off a saved search 'ref' attribute
    """
    # If app not defined in search we will default to the app_name from dashboard_id
    app = search.app if search.app else app_name
    # First query saved/searches/{ref}, then see if is_scheduled, will raise exception if fails
    saved_search = await fetch_saved_search(log,
                                            auth_header=auth_header,
                                            owner=owner,
                                            ref=search.ref,
                                            app=app,
                                            async_splunk_client=async_splunk_client)

    if saved_search.is_scheduled:
        # If saved search is scheduled then use /history to get last generated sid, will raise exception if fails
        saved_search_history = await fetch_saved_search_history(log,
                                                                auth_header=auth_header,
                                                                owner=owner,
                                                                ref=search.ref,
                                                                app=app,
                                                                async_splunk_client=async_splunk_client)

        # Return the sid from the saved search history name
        return saved_search_history.name
    else:
        # If interval is not specified then by-pass the injection so that savedSearch dispatch will use the interval
        # specified by original savedSearch
        if is_not_blank(search.earliest_time) or is_not_blank(search.latest_time):
            search.earliest_time, search.latest_time = inject_time_tokens(input_tokens=input_tokens,
                                                                          input_earliest=search.earliest_time,
                                                                          input_latest=search.latest_time)
        # If saved search is not scheduled then dispatch the job
        data = get_dispatch_job_request_params(earliest_time=search.earliest_time, latest_time=search.latest_time,
                                               input_tokens=input_tokens)
        sid = await dispatch_saved_search(log,
                                          auth_header=auth_header,
                                          owner=owner,
                                          ref=search.ref,
                                          app=app,
                                          data=urllib.urlencode(data),
                                          async_splunk_client=async_splunk_client)
        return sid


async def get_sid_from_query(log: logging.Logger,
                             auth_header, search=None, input_tokens=None, owner=None, app_name=None,
                             async_splunk_client=None, sid=None):
    """
    This will create a search job based of a regular search query
    :param log:
    :param auth_header:
    :param search:
    :param input_tokens:
    :param owner:
    :param app_name:
    :param async_splunk_client:
    :param sid: Optional override for a search job id
    :return:
    """

    # inject methods can handle the empty input_tokens
    search.query = inject_tokens_into_string(input_tokens, search.query)
    search.earliest_time, search.latest_time = inject_time_tokens(input_tokens,
                                                                  search.earliest_time,
                                                                  search.latest_time)

    params = get_search_job_request_params(query=search.query,
                                           earliest_time=search.earliest_time,
                                           latest_time=search.latest_time,
                                           sample_ratio=search.sample_ratio,
                                           exec_mode=EXEC_MODE_NORMAL,
                                           max_time='0',  # max_time=0 will allow search to run until complete
                                           sid=sid)

    if not params:
        log.error("Failed to get search job params %s", search)
        raise SpacebridgeApiRequestError("Missing search query.", status_code=HTTPStatus.NOT_FOUND)

    response = await async_splunk_client.async_get_search_data_request(auth_header=auth_header,
                                                                       owner=owner,
                                                                       app_name=app_name,
                                                                       data=urllib.urlencode(params))
    if response.code not in {HTTPStatus.OK, HTTPStatus.CREATED}:
        error = await response.text()
        log.error("Failed to create search job status_code=%s, error=%s, %s", response.code, error, search)
        raise SpacebridgeApiRequestError(format_splunk_error(response.code, error), status_code=response.code)

    response_json = await response.json()
    sid = response_json.get("sid")
    log.info("Created search job with sid=%s", response_json)
    return sid


async def fetch_visualization_data(log: logging.Logger,
                                   auth_header,
                                   owner,
                                   app_name,
                                   subscription_search,
                                   input_tokens,
                                   async_splunk_client,
                                   map_post_search=None,
                                   async_kvstore_client=None):
    """
    This method will loop until job is complete.  After job is complete it will return visualization data
    """
    from spacebridgeapp.udf.udf_subscriptions import build_cumulative_post_search

    post_search = None
    # Add post_search if search is dependent (i.e. defines a base)
    sid = subscription_search.sid
    if subscription_search.base:
        # For UDF data sources, build cumulative post_search to handle chained searches correctly
        if subscription_search.search_type == SearchType.DATA_SOURCE.value:
            post_search = await build_cumulative_post_search(log, auth_header, owner, subscription_search,
                                                             input_tokens, async_kvstore_client)
        else:
            # For non-UDF searches, use the standard behavior
            post_search = inject_tokens_into_string(input_tokens, subscription_search.query)

    # If we have a base search and a post_search_map update then we must append the two in this order
    if map_post_search and post_search:
        post_search += " " + map_post_search
    elif map_post_search:
        post_search = map_post_search

    # when done get data results from search
    visualization_data = await fetch_search_job_results_visualization_data(log,
                                                                           auth_header=auth_header,
                                                                           owner=owner,
                                                                           app_name=app_name,
                                                                           search_id=sid,
                                                                           post_search=post_search,
                                                                           async_splunk_client=async_splunk_client)

    if not visualization_data:
        raise SpacebridgeApiRequestError("Unable to get visualization data for search. {}".format(subscription_search),
                                         status_code=HTTPStatus.NOT_FOUND)

    return visualization_data


async def get_running_search_job_metadata(log: logging.Logger,
                                          auth_header, owner=None, app_name=None, sid=None, async_splunk_client=None):
    """
    Method to get the search_job_metadata only if job is running or done, otherwise return None
    """
    search_job_content = await get_search_job_content(log,
                                                      auth_header=auth_header,
                                                      owner=owner,
                                                      app_name=app_name,
                                                      search_id=sid,
                                                      async_splunk_client=async_splunk_client)

    # When we are done, return the search_job_content
    if search_job_content and \
        DispatchState.from_string(get_string_field('dispatchState',
                                                   search_job_content.properties)) \
        in [DispatchState.RUNNING, DispatchState.DONE, DispatchState.FAILED]:
        return search_job_content

    return None


async def fetch_search(auth_header,
                       owner,
                       search_key=None,
                       async_kvstore_client=None,
                       none_if_not_found=False):
    """
    Fetch a object from kvstore collection [searches] with search _key, searches stored in nobody namespace
    :param auth_header:
    :param owner:
    :param search_key:
    :param async_kvstore_client:
    :param none_if_not_found:
    :return:
    """

    response = await async_kvstore_client.async_kvstore_get_request(
        collection=SEARCHES_COLLECTION_NAME,
        key_id=search_key,
        owner=owner,
        auth_header=auth_header)

    if response.code == HTTPStatus.OK:
        response_json = await response.json()
        if not response_json:
            # No Search found with search_key
            return None

        # Create SubscriptionSearch from json
        search = SubscriptionSearch.from_json(response_json)
        return search

    # Special case here to return None if not found
    if response.code == HTTPStatus.NOT_FOUND and none_if_not_found:
        return None

    # Return error in case of unsuccessful response
    error = await response.text()
    error_message = f"Failed to fetch searches. status_code={response.code}, error={error}, " \
                    f"search_key={search_key}, auth_header={auth_header}"
    raise SpacebridgeApiRequestError(error_message, status_code=response.code)


async def send_subscription_updates(log: logging.Logger,
                                    auth_header,
                                    subscriptions,
                                    subscription_update,
                                    encryption_context,
                                    async_spacebridge_client,
                                    async_kvstore_client,
                                    subscriber_update_ids):
    """
    This method will query for all subscriptions to this search and then will send update events to subscribers.  After
    update event is send, the expiration time for subscription is updated
    """
    sender_id = encryption_context.sign_public_key(transform=encryption_context.generichash_raw)
    headers = {HEADER_CONTENT_TYPE: APPLICATION_PROTOBUF}
    deferred_responses = []
    subscription_ids = []

    # Create signer using private key
    signer = partial(sign_detached, encryption_context.sodium_client, encryption_context.sign_private_key())

    # Generate a unique update_id for each group of updates
    digest = hashlib.sha256()
    digest.update(subscription_update.to_protobuf().SerializeToString())

    update_id = digest.hexdigest()

    new_subscriber_update_ids = {}

    log.debug("subscriber_update_ids=%s", subscriber_update_ids)

    for subscription in subscriptions:
        new_subscriber_update_ids[subscription.key()] = update_id

        if update_id == subscriber_update_ids.get(subscription.key()):
            log.info("Skipping subscription update search_key=%s, subscription_id=%s, update_id=%s, type=%s, "
                     "done_progress=%s, dispatch_state=%s", subscription.subscription_key, subscription.key(),
                     update_id, type(subscription_update).__name__, subscription_update.done_progress,
                     subscription_update.dispatch_state)
            continue

        log.info("Sending subscription update, search_key=%s, subscription_id=%s, update_id=%s, type=%s, "
                 "done_progress=%s, dispatch_state=%s", subscription.subscription_key, subscription.key(),
                 update_id, type(subscription_update).__name__, subscription_update.done_progress,
                 subscription_update.dispatch_state)

        try:
            # Get device_id
            device_id_raw = b64decode(subscription.device_id)
            _, receiver_encrypt_public_key = await public_keys_for_device(device_id_raw, auth_header,
                                                                          async_kvstore_client)

            # create encryptor based on receiver public key
            encryptor = partial(encrypt_for_send, encryption_context.sodium_client, receiver_encrypt_public_key)

            # generate unique request_id for each payload sent
            request_id = get_guid()

            splapp_update = build_splapp_subscription_update(request_id,
                                                             subscription.key(),
                                                             update_id,
                                                             subscription_update)
            # build message to send through spacebridge send_message api
            send_message_request = build_send_subscription_update_request(
                device_id_raw, sender_id, request_id, splapp_update,
                encryptor, signer)

            # For logging purposes add subscription id of this iteration
            subscription_ids.append(subscription.key())

            # Send post request asynchronously
            deferred_responses.append(async_spacebridge_client.async_send_message_request(
                auth_header=SpacebridgeAuthHeader(sender_id),
                data=send_message_request.SerializeToString(),
                headers=headers))

            log.info("Subscription Update Sent. size_bytes=%s, subscription_id=%s, search_key=%s, "
                     "type=%s, request_id=%s, update_id=%s", send_message_request.ByteSize(), subscription.key(),
                     subscription.subscription_key, type(subscription_update).__name__, request_id, update_id)
        except KeyNotFoundError:
            log.error("Public key not found for device_id=%s, subscription_id=%s",
                      subscription.device_id, subscription.key())
        except SodiumOperationError:
            log.error("Sodium operation failed! device_id=%s, subscription_id=%s",
                      subscription.device_id, subscription.key())

    # Wait until all the post requests have returned
    # TODO check if gather works as expected
    responses = await asyncio.gather(*deferred_responses)
    ok_results = []
    error_results = []
    for i in range(len(responses)):
        # If we don't get an OK log it as an error
        response_text = await responses[i].text()
        i_response = (subscription_ids[i], responses[i].code, response_text)
        error_results.append(i_response) if responses[i].code != HTTPStatus.OK else ok_results.append(i_response)

    # Group OK results
    if ok_results:
        log.info("Finished sending subscription updates with responses=%s, subscription_id=%s",
                 ok_results, subscription.key())

    # Group Error Results
    if error_results:
        log.error("Error sending subscription updates with responses=%s, subscription_id=%s",
                  error_results, subscription.key())

    return new_subscriber_update_ids
