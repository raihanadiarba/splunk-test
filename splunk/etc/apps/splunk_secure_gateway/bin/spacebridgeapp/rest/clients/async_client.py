"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Base class for AsyncClient
"""
import logging
import sys
import time
from typing import Awaitable

from cloudgateway.private.asyncio.clients.aio_client import AioHttpClient

from spacebridgeapp.ssl.splunk_mtls_support import get_splunk_mtls_bundle
from spacebridgeapp.util.config import SecureGatewayConfig
from spacebridgeapp.util.constants import HEADER_AUTHORIZATION, \
    HEADER_CONTENT_TYPE, APPLICATION_JSON
from spacebridgeapp.util.string_utils import encode_whitespace


async def _instrument(operation: Awaitable, log: logging.Logger, method, uri):
    start_time = time.time()
    try:
        result = await operation
    finally:
        time_taken = time.time() - start_time
        log.info("%s uri=%s, time_taken=%s", method, uri, time_taken)

    return result


class AsyncClient(object):
    auth_header_name = HEADER_AUTHORIZATION

    """
    Client for handling asynchronous requests to KV Store
    """

    def __init__(self, log: logging.Logger, config: SecureGatewayConfig, client=None):
        """
        Our client wraps the  asyncio aiohttp client. This is so we can provide different implementations such as providing
        a mocked implementation to make testing easier.
        :param client: instance of AioHTTPClient or mock instance
        """
        self.log = log
        self.client = client if client else AioHttpClient()
        self.config = config

    def initialize_splunk_mtls(self):
        key_bundle = get_splunk_mtls_bundle()
        if key_bundle:
            self.client.key_bundle = key_bundle
            self.log.debug("Using Splunk TLS key bundle")

    def async_get_request(self, uri, auth_header, params=None, headers=None, timeout=None, verify_ssl=None):
        """
        Makes a asynchronous get request to a given uri
        :param uri: string representing uri to make request to
        :param params: Optional parameters to be append as the query string to the URL
        :param auth_header: A value to supply for the Authorization header
        :param headers: Optional request headers
        :param timeout: Optional timeout
        :return: result of get request
        """

        timeout = timeout or self.config.get_async_timeout_secs()

        uri = encode_whitespace(uri)

        if not headers:
            headers = {HEADER_CONTENT_TYPE: APPLICATION_JSON}

        if auth_header is not None:
                headers[self.auth_header_name] = repr(auth_header)

        self.log.debug('GET uri=%s, params=%s' % (uri, str(params)))

        kwargs = {'uri': uri, 'headers': headers, 'params': params, 'timeout': timeout}

        if verify_ssl:
            kwargs['verify_ssl'] = verify_ssl

        return _instrument(self.client.get(**kwargs), self.log, 'GET', uri)

    def async_delete_request(self, uri, auth_header, params=None, data=None, headers=None, timeout=None,
                             verify_ssl=None):
        """
        :param uri:
        :param params:
        :param data:
        :param headers:
        :param auth_header: A value to supply for the Authorization header
        :param timeout: Optional timeout
        :return:
        """

        timeout = timeout or self.config.get_async_timeout_secs()

        if not headers:
            headers = {
                HEADER_CONTENT_TYPE: APPLICATION_JSON,
                self.auth_header_name: repr(auth_header)
            }

        # In python 3 Treq requires post data to be bytes not string so we need to explicitly encode it
        # https://github.com/twisted/treq/issues/151
        if sys.version_info >= (3,0) and isinstance(data, str):
            data = data.encode('utf-8')

        self.log.debug('DELETE uri=%s, params=%s' % (uri, str(params)))

        kwargs = {'uri': uri, 'headers': headers, 'params': params, 'timeout': timeout}

        if verify_ssl:
            kwargs['verify_ssl'] = verify_ssl

        if data:
            kwargs['data'] = data

        return _instrument(self.client.delete(**kwargs), self.log, 'DELETE', uri)

    def async_post_request(self, uri, auth_header, params=None, data=None, headers=None, timeout=None,
                           verify_ssl=None):
        """
        Makes a asynchronous post request to a given uri
        :param uri: string representing uri to make request to
        :param params: Optional parameters to be append as the query string to the URL
        :param data: Request body
        :param auth_header: A value to supply for the Authorization header
        :param headers: header to send with post request.
        :param timeout: Optional timeout
        :return:
        """

        timeout = timeout or self.config.get_async_timeout_secs()

        uri = encode_whitespace(uri)

        if not headers:
            headers = {HEADER_CONTENT_TYPE: APPLICATION_JSON}

        if auth_header is not None:
            headers[self.auth_header_name] = repr(auth_header)

        # In python 3 Treq requires post data to be bytes not string so we need to explicitly encode it
        # https://github.com/twisted/treq/issues/151
        if sys.version_info >= (3,0) and isinstance(data, str):
            data = data.encode('utf-8')

        # don't log request data as username and passwords can be leaked in plaintext MSB-846
        self.log.debug('POST uri=%s, params=%s', uri, params)

        kwargs = {'uri': uri, 'headers': headers, 'params': params, 'data': data, 'timeout': timeout}

        if verify_ssl:
            kwargs['verify_ssl'] = verify_ssl

        return _instrument(self.client.post(**kwargs), self.log, 'POST', uri)

