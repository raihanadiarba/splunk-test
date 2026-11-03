"""Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved."""
import asyncio
import logging
from http import HTTPStatus
import json

from spacebridgeapp.data.subscription_data import Subscription, SubscriptionCredential
from spacebridgeapp.exceptions.spacebridge_exceptions import SpacebridgeError
from spacebridgeapp.messages.request_context import RequestContext
from spacebridgeapp.request.request_processor import get_splunk_cookie
from spacebridgeapp.rest.clients.async_kvstore_client import AsyncKvStoreClient
from spacebridgeapp.rest.clients.async_secret_management_client import AsyncSecretManagementClient
from spacebridgeapp.rest.clients.async_splunk_client import AsyncSplunkClient
from spacebridgeapp.util import constants
from spacebridgeapp.util.kvstore import build_containedin_clause
from spacebridgeapp.util.time_utils import get_expiration_timestamp_str, get_current_timestamp_str

async def _ensure_valid_response(log: logging.Logger,
                                 response, expected_codes, error):
    if response.code not in expected_codes:
        raw_error = await response.text()
        log.warning("http request_failed error=", raw_error)
        formatted_error = "{} status_code={} error={}".format(error, response.code, raw_error)
        raise SpacebridgeError(formatted_error, status_code=response.code)


class SubscriptionClient(object):
    def __init__(self,
                 log: logging.Logger,
                 kvstore_client: AsyncKvStoreClient,
                 splunk_client: AsyncSplunkClient,
                 secret_client: AsyncSecretManagementClient):
        """
        :param kvstore_client:
        :param splunk_client:
        """
        self.log = log
        self.kvstore_client = kvstore_client
        self.splunk_client = splunk_client
        self.secret_client = secret_client
        self._reset()

    def on_ping(self, username, user_auth_header, subscription_id: str):
        self.log.debug("Recording ping for user=%s, subscription_id=%s", username, subscription_id)
        self.user_credentials[username] = user_auth_header
        self.user_subscriptions.add(subscription_id)

    def _reset(self):
        self.user_credentials = {}
        self.user_subscriptions = set()

    async def flush(self, system_auth_header):
        try:
            await self._flush(system_auth_header)
        except Exception:
            self.log.exception("Failed to flush subscription cache")

    async def _flush(self, system_auth_header):
        self.log.debug("Flushing subscription cache credentials=%s, subscriptions=%s",
                       len(self.user_credentials),
                       len(self.user_subscriptions))
        tmp_credentials = self.user_credentials
        tmp_subscriptions = self.user_subscriptions
        self._reset()
        valid_users = []
        for username, token in tmp_credentials.items():
            is_valid = await self._validate(token)
            if is_valid:
                valid_users.append(username)

        await asyncio.gather(self._batch_extend_subs(system_auth_header, tmp_subscriptions, tmp_credentials),
                             self._batch_update_credentials(tmp_credentials, system_auth_header))
        self.log.debug("Flush complete, subscriptions=%s, credentials=%s", len(tmp_subscriptions), len(valid_users))

    async def _validate(self, auth_token):
        response = await self.splunk_client.async_get_current_context(auth_header=auth_token)
        if response.code == HTTPStatus.OK:
            return True

        return False

    async def _batch_extend_subs(self, auth_header, subscription_ids, credentials: dict):

        self.log.debug("Updating subscriptions=%s", len(subscription_ids))

        if not subscription_ids:
            return

        containedin = build_containedin_clause(constants.KEY, list(subscription_ids))
        params = {constants.QUERY: json.dumps(containedin)}

        for owner in credentials.keys():
            await self._batch_extend_subs_by_owner(auth_header, params, owner)

    async def _batch_extend_subs_by_owner(self, auth_header, params, owner):
        response = await self.kvstore_client.async_kvstore_get_request(
            collection=constants.SUBSCRIPTIONS_COLLECTION_NAME,
            params=params,
            owner=owner,
            auth_header=auth_header
        )

        await _ensure_valid_response(self.log, response, [HTTPStatus.OK], "Failed to retrieve subscriptions")

        subscriptions = await response.json()

        subscriptions = [Subscription.from_json(subscription_json) for subscription_json in subscriptions]

        if len(subscriptions) == 0:
            return

        for subscription in subscriptions:
            subscription.expired_time = get_expiration_timestamp_str(ttl_seconds=subscription.ttl_seconds)
            subscription.last_update_time = get_current_timestamp_str()

        subscriptions = [subscription.__dict__ for subscription in subscriptions]

        await self.kvstore_client.async_batch_save_request(
            auth_header=auth_header,
            collection=constants.SUBSCRIPTIONS_COLLECTION_NAME,
            owner=owner,
            entries=subscriptions)

    async def _update_credential(self, user, auth_header, system_auth_header):
        ctx = RequestContext(auth_header, current_user=user)
        credential = await self.secret_client.fetch_sensitive_data(
            user_name=ctx.current_user, system_auth_header=system_auth_header
        )

        if credential is None:
            # Sometimes it's okay as we don't generate subscription-credentials for CLIENT_SUBSCRIBE_GENERIC_MESSAGE messages
            # e.g. EdgeHub subscriptions for config updates
            raise SpacebridgeError("Failed to refresh session token")

        subscription_credential = SubscriptionCredential.from_json(json.loads(credential))
        if subscription_credential.session_type == constants.SPLUNK_SESSION_TOKEN_TYPE:
            temporary_session_key = await get_splunk_cookie(request_context=ctx,
                                                            async_splunk_client=self.splunk_client,
                                                            username=ctx.auth_header.username,
                                                            password=ctx.auth_header.password)

            subscription_credential.session_key = temporary_session_key

        subscription_credential.last_update_time = get_current_timestamp_str()

        await self.secret_client.update_sensitive_data(
            user_name=ctx.current_user, data=subscription_credential, system_auth_header=system_auth_header
        )
        self.log.debug("Updated credentials for username=%s", user)

    async def _batch_update_credentials(self, credentials, system_auth_header):
        self.log.debug("Updating credentials=%s", len(credentials))
        for user, auth_header in credentials.items():
            try:
                await self._update_credential(user, auth_header, system_auth_header)
            except SpacebridgeError as e:
                self.log.warning("Failed to update credential user=%s, error=%s, status_code=%s", user, str(e), e.status_code)
