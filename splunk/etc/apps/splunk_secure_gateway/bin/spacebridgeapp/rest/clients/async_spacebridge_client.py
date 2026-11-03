"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Module providing client for making asynchronous requests to Spacebridge API
"""
import logging
from http import HTTPStatus

from cloudgateway.key_bundle import KeyBundle
from cloudgateway.private.asyncio.clients.aio_client import AioHttpClient
from cloudgateway.private.util.constants import HEADER_SPACEBRIDGE_CLIENT_ID
from spacebridgeapp.exceptions.spacebridge_exceptions import SpacebridgeApiRequestError
from spacebridgeapp.request.request_processor import SpacebridgeAuthHeader
from spacebridgeapp.rest.clients.async_client import AsyncClient
from spacebridgeapp.util.config import SecureGatewayConfig
from spacebridge_protocol.discovery_pb2 import GetSpacebridgeInstancesResponse
from spacebridge_protocol.metadata_pb2 import GetSpacebridgeMetadataResponse

class AsyncSpacebridgeClient(AsyncClient):
    auth_header_name = HEADER_SPACEBRIDGE_CLIENT_ID

    def __init__(self, log: logging.Logger, config: SecureGatewayConfig, key_bundle: KeyBundle = None):
        self.https_proxy = config.get_https_proxy_settings()
        proxy_url = 'http://{}:{}'.format(self.https_proxy["host"],
                                          self.https_proxy["port"]) if self.https_proxy else None
        AsyncClient.__init__(self, log, config, client=AioHttpClient(proxy=proxy_url, key_bundle=key_bundle))

    def async_send_request(self, api, auth_header, data='', headers=None, method='POST'):
        """
        Generic Async send request
        :param api:
        :param auth_header:
        :param data:
        :param headers:
        :return:
        """
        if headers is None:
            headers = {}
        if self.https_proxy and self.https_proxy['auth']:
            headers['Proxy-Authorization'] = 'Basic ' + self.https_proxy['auth']

        rest_uri = f"https://{self.config.get_spacebridge_server() + api}"

        if method == 'GET':
            return self.async_get_request(uri=rest_uri,
                                          auth_header=auth_header,
                                          headers=headers)
        elif method == 'POST':
            return self.async_post_request(uri=rest_uri,
                                           auth_header=auth_header,
                                           data=data,
                                           headers=headers)

    def async_send_delete_request(self, api, auth_header, data='', headers=None):
        """
        Generic Async send request
        :param api:
        :param auth_header:
        :param data:
        :param headers:
        :return:
        """
        if headers is None:
            headers = {}

        if self.https_proxy and self.https_proxy['auth']:
            headers['Proxy-Authorization'] = 'Basic ' + self.https_proxy['auth']

        rest_uri = f"https://{self.config.get_spacebridge_server() + api}"

        return self.async_delete_request(uri=rest_uri,
                                         auth_header=auth_header,
                                         data=data,
                                         headers=headers)

    def async_send_notification_request(self, auth_header, data='', headers=None):
        """
        API to send notifications
        :param auth_header:
        :param data:
        :param headers:
        :return:
        """
        if headers is None:
            headers = {}

        return self.async_send_request('/api/notifications', auth_header, data, headers)

    def async_send_message_request(self, auth_header, data='', headers=None):
        """
        API to send messages
        :param auth_header:
        :param data:
        :param headers:
        :return:
        """
        if headers is None:
            headers = {}
        return self.async_send_request('/api/deployments/messages', auth_header, data, headers)

    def async_send_storage_request(self, payload, content_type, signature, auth_header, request_id):
        """
        API to store resources on spacebridge
        :param payload: Bytes
        :param content_type: MIME type
        :param signature:
        :param auth_header:
        :param request_id:
        :return:
        """

        headers = {
            'x-amz-meta-signature': signature.hex(),
            'content-type': "application/octet-stream",
            'x-amz-meta-content-type': content_type,
            'X-B3-TraceId': request_id
        }

        return self.async_send_request('/storage/assets', auth_header, data=payload, headers=headers)

    async def async_query_discovery_instances(self,
                                              auth_header: SpacebridgeAuthHeader,
                                              timeout: int = None) -> GetSpacebridgeInstancesResponse:
        """
        Trigger Spacebridge discovery API to get a list of spacebridge instances
        :param auth_header: SpacebridgeAuthHeader with ClientId
        :param timeout: optional timeout
        :return: GetSpacebridgeInstancesResponse protobuf
        """
        uri = f'https://{self.config.get_spacebridge_discovery_server()}/api/discovery/instances'
        response = await self.async_get_request(uri=uri,
                                                auth_header=auth_header,
                                                timeout=timeout)
        if response.code != HTTPStatus.OK:
            text = await response.text()
            raise SpacebridgeApiRequestError(message=f"Spacebridge discovery: {text}",
                                             status_code=response.code)

        response_pb = GetSpacebridgeInstancesResponse()
        response_pb.ParseFromString(response._body)
        if response_pb.HasField('error'):
            raise SpacebridgeApiRequestError(message=f"Spacebridge discovery: {response_pb.error.message}",
                                             code=response_pb.error.code)
        return response_pb

    async def async_health_check(self, spacebridge_url: str = None, timeout: int = None):
        """
        The method calls spacebirdge health check API and verifies response code (should be 200)
        :param spacebridge_url: Spacebridge URL without http prefix
        :param timeout: Optional timeout. If not present - uses from config
        :return: none
        """
        if spacebridge_url is None:
            uri = f'https://{self.config.get_spacebridge_server()}/health_check'
        else:
            uri = f'https://{spacebridge_url}/health_check'

        response = await self.async_get_request(uri=uri, auth_header=None, timeout=timeout)
        if response.code != HTTPStatus.OK:
            text = await response.text()
            raise SpacebridgeApiRequestError(message=f"Spacebridge health: {text}",
                                             status_code=response.code)

    async def async_metadata(self,
                             auth_header: SpacebridgeAuthHeader,
                             spacebridge_url: str,
                             timeout: int = None) -> GetSpacebridgeMetadataResponse:
        """
        Query Spacebridge metadata. Could be used only with Private Spacebridge
        :param auth_header:
        :param spacebridge_url: Spacebridge URL without http prefix
        :param timeout:
        :return: GetSpacebridgeMetadataResponse
        """
        uri = f'https://{spacebridge_url}/api/metadata'

        response = await self.async_get_request(uri=uri, auth_header=auth_header, timeout=timeout)
        if response.code != HTTPStatus.OK:
            text = await response.text()
            raise SpacebridgeApiRequestError(message=f"Spacebridge metadata: {text}",
                                             status_code=response.code)

        meta = GetSpacebridgeMetadataResponse()
        meta.ParseFromString(response._body)
        if meta.HasField('error'):
            raise SpacebridgeApiRequestError(message=f"Spacebridge metadata: {meta.error.message}",
                                             code=meta.error.code)
        return meta
