""" Asyncio based HTTP client"""
import aiohttp

from cloudgateway.key_bundle import KeyBundle, asyncio_ssl_context
from cloudgateway.private.util.constants import HEADER_AUTHORIZATION, \
    HEADER_CONTENT_TYPE, APPLICATION_JSON


class AioHttpClient(object):
    auth_header_name = HEADER_AUTHORIZATION

    def __init__(self, proxy=None, verify_ssl: bool = True, key_bundle: KeyBundle = None):
        self.proxy = proxy
        self.verify_ssl = verify_ssl
        self.key_bundle = key_bundle

    def get(self, uri, **kwargs):
        return self._async_request('GET', uri, **kwargs)

    def post(self, uri, **kwargs):
        return self._async_request('POST', uri, **kwargs)

    def delete(self, uri, **kwargs):
        return self._async_request('DELETE', uri, **kwargs)

    async def _async_request(self, method, uri, **kwargs):
        with asyncio_ssl_context(self.key_bundle, self.verify_ssl) as context:
            connector = aiohttp.TCPConnector(ssl=context)

            if self.proxy and 'proxy' not in kwargs:
                kwargs['proxy'] = self.proxy

            # We don't want it here, as we handle it in asyncio_ssl_context
            # if 'verify_ssl' not in kwargs:
            #     kwargs['ssl'] = self.verify_ssl

            if 'headers' not in kwargs:
                kwargs['headers'] = {HEADER_CONTENT_TYPE: APPLICATION_JSON}

            if 'auth_header' in kwargs:
                if kwargs['auth_header']:
                    kwargs['headers'][self.auth_header_name] = repr(kwargs['auth_header'])
                del kwargs['auth_header']

            async with aiohttp.ClientSession(connector=connector) as session:
                async with session.request(method, uri, **kwargs) as response:
                    await response.read()
                    response.code = response.status
                    return response
