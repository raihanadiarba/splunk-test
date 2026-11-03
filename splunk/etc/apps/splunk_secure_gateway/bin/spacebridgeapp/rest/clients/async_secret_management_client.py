"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Module providing client for making asynchronous requests to Splunk Secret Management
"""
import logging
import os
os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'

from http import HTTPStatus
from splunk import rest
from asyncache import cachedmethod
from cachetools import TTLCache
from spacebridgeapp.data.subscription_data import SubscriptionCredential
from spacebridgeapp.util.config import SecureGatewayConfig
from spacebridgeapp.util.constants import SPACEBRIDGE_APP_NAME, SUBSCRIPTION_CREDENTIALS_COLLECTION_NAME, NAME, PASSWORD \
    , REALM
from spacebridgeapp.rest.clients.async_non_ssl_client import AsyncNonSslClient


def _get_realm():
    return SUBSCRIPTION_CREDENTIALS_COLLECTION_NAME


def _make_secret_management_uri():
    return f'{rest.makeSplunkdUri()}servicesNS/nobody/{SPACEBRIDGE_APP_NAME}/storage/passwords'


class AsyncSecretManagementClient(AsyncNonSslClient):
    """
    Client for handling asynchronous requests to Splunk secret management. As it requires the capability to edit
    secret management, ensure that the system authentication header (admin) is used when calling the functions.
    """

    def __init__(self, log: logging.Logger, config: SecureGatewayConfig):
        super(AsyncSecretManagementClient, self).__init__(log, config)
        self._cache = TTLCache(maxsize=10, ttl=60)

    async def _handle_exceptions(self, async_task):
        try:
            return await async_task
        except Exception as e:
            self.log.error(f'Exception occurred in AsyncSecretManagementClient: {str(e)}')
            return None

    @cachedmethod(cache=lambda self: self._cache, key=lambda self, user_name, system_auth_header: user_name)
    async def fetch_sensitive_data(self, user_name: str, system_auth_header):
        async def task():
            uri = f"{_make_secret_management_uri()}/{_get_realm()}:{user_name}"
            params = {'output_mode': 'json'}
            response = await self.async_get_request(uri=uri, params=params, auth_header=system_auth_header)
            if response.code == HTTPStatus.OK:
                self.log.debug(
                    f'Succeed to fetch sensitive data user_name = {user_name}'
                )
                parsed = await response.json()
                credential_str = parsed['entry'][0]['content']['clear_password']
                return credential_str
            else:
                self.log.debug(
                    f'Failed to fetch sensitive data user_name = {user_name}: {await response.text()}'
                )
                return None
        return await self._handle_exceptions(task())

    async def fetch_all_sensitive_data(self, system_auth_header):
        async def task():
            uri = _make_secret_management_uri()
            credentials = []
            params = {'output_mode': 'json'}
            response = await self.async_get_request(uri=uri, params=params, auth_header=system_auth_header)
            if response.code == HTTPStatus.OK:
                parsed = await response.json()
                for element in parsed['entry']:
                    if element['name'].startswith(SUBSCRIPTION_CREDENTIALS_COLLECTION_NAME):
                        credentials.append(element['content']['clear_password'])
                return credentials
            else:
                self.log.error(
                    f'Failed to fetch all sensitive data: {await response.text()}'
                )
                return credentials
        return await self._handle_exceptions(task())

    async def create_sensitive_data(self, user_name: str, data: SubscriptionCredential, system_auth_header):
        self._cache[user_name] = data.to_json()
        async def task():
            uri = _make_secret_management_uri()
            form_data = {NAME: user_name, PASSWORD: data, REALM: _get_realm()}
            response = await self.async_post_request(uri=uri, data=form_data, auth_header=system_auth_header)
            if response.status != HTTPStatus.CREATED:
                self.log.debug(
                    f'Failed to create sensitive data user_name = {user_name}: {await response.text()}',
                )
        return await self._handle_exceptions(task())

    async def update_sensitive_data(self, user_name: str, data: SubscriptionCredential, system_auth_header):
        self._cache[user_name] = data.to_json()
        async def task():
            uri = f"{_make_secret_management_uri()}/{_get_realm()}:{user_name}"
            form_data = {PASSWORD: data}
            response = await self.async_post_request(uri=uri, data=form_data, auth_header=system_auth_header)
            if response.status == HTTPStatus.NOT_FOUND:
                self.log.debug(
                    f'Failed to update sensitive data user_name = {user_name}: {await response.text()}',
                )

        return await self._handle_exceptions(task())

    async def delete_sensitive_data(self, user_name: str, system_auth_header):
        self.evict_from_cache(user_name)
        async def task():
            uri = f"{_make_secret_management_uri()}/{_get_realm()}:{user_name}"
            response = await self.async_delete_request(uri=uri, auth_header=system_auth_header)
            if response.status == HTTPStatus.OK:
                self.log.debug(
                    f'Succeed to delete sensitive data user_name = {user_name}'
                )
            else:
                self.log.debug(
                    f'Failed to delete sensitive data user_name = {user_name}: {await response.text()}'
                )
        return await self._handle_exceptions(task())

    def evict_from_cache(self, user_name: str):
        try:
            self._cache.pop(user_name)
        except KeyError:
            pass
