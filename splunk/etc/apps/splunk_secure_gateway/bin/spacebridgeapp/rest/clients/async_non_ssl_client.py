"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Module providing client for making non-ssl asynchronous requests
"""
import logging

from cloudgateway.private.asyncio.clients.aio_client import AioHttpClient
from spacebridgeapp.rest.clients.async_client import AsyncClient
from spacebridgeapp.util.config import SecureGatewayConfig


class AsyncNonSslClient(AsyncClient):
    """
    This is an intermediate class that disables SSL verification
    It intended to be used with localhost splunk management service
    Additionally, it should load mtls certificates, if splunkd (management) require client certificates
    """

    def __init__(self, log: logging.Logger, config: SecureGatewayConfig):
        super(AsyncNonSslClient, self).__init__(log, config, client=AioHttpClient(verify_ssl=False))
        self.initialize_splunk_mtls()
