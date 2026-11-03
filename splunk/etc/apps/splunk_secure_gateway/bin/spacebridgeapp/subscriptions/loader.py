"""Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved."""
import json
import asyncio
import logging
from itertools import chain
from collections import defaultdict
from http import HTTPStatus
from typing import Optional

from spacebridgeapp.data.subscription_data import Subscription, SearchUpdate, SubscriptionCredential
from spacebridgeapp.exceptions.spacebridge_exceptions import SpacebridgeApiRequestError
from spacebridgeapp.request.splunk_auth_header import SplunkAuthHeader
from spacebridgeapp.rest.clients.async_kvstore_client import AsyncKvStoreClient
from spacebridgeapp.rest.clients.async_secret_management_client import AsyncSecretManagementClient
from spacebridgeapp.rest.services.splunk_service import get_all_mobile_users
from spacebridgeapp.subscriptions.subscription_requests import fetch_searches
from spacebridgeapp.util.constants import SUBSCRIPTION_KEY, KEY, QUERY, SPACEBRIDGE_APP_NAME, NOBODY, \
    SUBSCRIPTIONS_COLLECTION_NAME, SEARCH_UPDATES_COLLECTION_NAME
from spacebridgeapp.util.kvstore import build_containedin_clause
from splapp_protocol.common_pb2 import Error

def _noop(arg):
    return arg


def _collect(arr, grouping_key):
    grouped = defaultdict(list)
    for item in arr:
        value = getattr(item, grouping_key)
        grouped[value].append(item)
    return grouped


async def _load_many(log: logging.Logger,
                     system_auth_header, collection, params, async_kvstore_client,
                     mapper_fn=_noop, owner=NOBODY, app=SPACEBRIDGE_APP_NAME):
    """
    Queries a collection for many entries for the specified params.  It will
    marshal the result into a format you specify using mapper_fn.  The default
    behavior will return all items as python dict.
    :param system_auth_header: A splunk auth header used to authenticate the call
    :param collection: The name of the collection being queried
    :param params: JSON-ified query, see https://docs.splunk.com/Documentation/Splunk/8.0.2/RESTREF/RESTkvstore
    :param async_kvstore_client: An instance of the async kvstore client
    :param mapper_fn: A function that can convert a dict to something else.  Default to returning the dict.
    :param owner: The owner of the collection, defaults to nobody
    :param app: The app the collection is part of.  Default to cloud gateway.
    :return: A list of mapped entries from the collection.
    :raises: :class:`SpacebridgeApiRequestError` if the kvstore call failed
    """
    # Get all Searches so no input params
    response = await async_kvstore_client.async_kvstore_get_request(
        collection=collection,
        params=params,
        owner=owner,
        app=app,
        auth_header=system_auth_header)

    if response.code != HTTPStatus.OK:
        error = await response.text()
        message = "_load_many failed. status_code={}, error={}".format(response.code, error)
        log.error(message)
        raise SpacebridgeApiRequestError(message, status_code=response.code)

    response_json = await response.json()
    result_list = [mapper_fn(obj) for obj in response_json]

    return result_list


async def _load_subscriptions(log: logging.Logger,
                              system_auth_header, searches, async_kvstore_client):
    if len(searches) == 0:
        return defaultdict(list)

    condition = build_containedin_clause(SUBSCRIPTION_KEY, [search.key() for search in searches])
    owners: set[str] = {search.owner for search in searches}

    params = {QUERY: json.dumps(condition)}

    tasks = [_load_many(log,
                        system_auth_header, SUBSCRIPTIONS_COLLECTION_NAME, params, async_kvstore_client,
                        mapper_fn=Subscription.from_json,
                        owner=owner)
             for owner in owners]

    results = await asyncio.gather(*tasks)

    # Flatten the list of results into a single list
    return list(chain.from_iterable(results))


async def _load_subscription_credentials(system_auth_header, users, secret_management_client):
    loaded_credentials = {}
    for user in users:
        credential_str = await secret_management_client.fetch_sensitive_data(
            user_name=user, system_auth_header=system_auth_header
        )
        if credential_str is None:
            continue

        subscription_credential = SubscriptionCredential.from_json(json.loads(credential_str))
        if subscription_credential:
            loaded_credentials[subscription_credential.user] = subscription_credential

    return loaded_credentials


async def _load_search_updates(log: logging.Logger,
                               system_auth_header, subscriptions, async_kvstore_client):
    if len(subscriptions) == 0:
        return {}

    loaded_updates = {}
    condition = build_containedin_clause(KEY, [subscription.key() for subscription in subscriptions])

    params = {QUERY: json.dumps(condition)}
    owners: set[str] = {subscription.user for subscription in subscriptions}

    tasks = [_load_many(log,
                        system_auth_header, SEARCH_UPDATES_COLLECTION_NAME,
                        params, async_kvstore_client,
                        mapper_fn=SearchUpdate.from_json,
                        owner=owner)
             for owner in owners]

    results = await asyncio.gather(*tasks)
    search_updates = list(chain.from_iterable(results))
    # One search_update per subscription
    for search_update in search_updates:
        loaded_updates[search_update.key()] = search_update

    return loaded_updates


def _count_dependant_searches(searches_all):
    dependant_searches = defaultdict(int)

    for search in searches_all:
        parent_search_key = search.parent_search_key
        count = dependant_searches[parent_search_key]
        dependant_searches[parent_search_key] = count + 1

    return dependant_searches


async def load_search_bundle(log: logging.Logger,
                             system_auth_header: SplunkAuthHeader,
                             shard_id: str, async_kvstore_client: AsyncKvStoreClient,
                             secret_management_client: AsyncSecretManagementClient):
    owners = get_all_mobile_users(system_auth_header.session_token)
    tasks = [fetch_searches(log, owner, system_auth_header, async_kvstore_client)
             for owner in owners]
    results = await asyncio.gather(*tasks)
    searches_all = list(chain.from_iterable(results))
    searches_for_shard = [search for search in searches_all if search.shard_id == shard_id]

    dependant_search_counts = _count_dependant_searches(searches_all)

    subscriptions_list = await _load_subscriptions(log, system_auth_header, searches_for_shard, async_kvstore_client)
    subscriptions_map = _collect(subscriptions_list, SUBSCRIPTION_KEY)

    credential_users = {search.owner for search in searches_for_shard
                        if subscriptions_map[search.key()] or dependant_search_counts[search.key()]}
    subscription_credentials = await _load_subscription_credentials(system_auth_header, credential_users,
                                                                    secret_management_client)
    search_updates = await _load_search_updates(log, system_auth_header, subscriptions_list, async_kvstore_client)

    return SearchBundle(searches_for_shard,
                        subscriptions_map,
                        subscription_credentials,
                        search_updates,
                        dependant_search_counts)


class SearchContext(object):
    def __init__(self, search, subscriptions,
                 subscription_credential: Optional[SubscriptionCredential],
                 search_updates, dependant_search_counts):
        self.search = search
        self.subscriptions = subscriptions
        self.subscription_credential = subscription_credential
        self.search_updates = search_updates
        self.dependant_search_counts = dependant_search_counts


def _union_dependants_with_search_key(searches, search_key):
    search_keys = [search.key() for search in searches if search.parent_search_key == search_key]
    search_keys.append(search_key)
    return search_keys


def _find_all_subscriptions(subscriptions_map, search_keys):
    subscriptions = []
    for search_key in search_keys:
        search_subscriptions = subscriptions_map[search_key]
        for subscription in search_subscriptions:
            subscriptions.append(subscription)
    return subscriptions


class SearchBundle(object):
    def __init__(self, searches, subscription_map,
                 subscription_credential_map: dict[str, SubscriptionCredential],
                 search_update_map, dependant_search_counts):
        self.searches = searches
        self.subscriptions_map = subscription_map
        self.subscription_credentials_map = subscription_credential_map
        self.search_updates_map = search_update_map
        self.dependant_search_counts = dependant_search_counts

    def to_search_context(self, search_key):
        search = next(search for search in self.searches if search.key() == search_key)

        subscriptions = self.subscriptions_map[search_key]
        subscription_ids = {subscription.key() for subscription in subscriptions}

        subscription_credential = self.subscription_credentials_map.get(search.owner)

        search_updates = {key: update for (key, update)
                          in self.search_updates_map.items()
                          if key in subscription_ids}

        return SearchContext(search, subscriptions, subscription_credential, search_updates,
                             self.dependant_search_counts)

