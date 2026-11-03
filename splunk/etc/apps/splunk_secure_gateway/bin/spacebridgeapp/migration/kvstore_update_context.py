from logging import Logger

from spacebridgeapp.request.splunk_auth_header import SplunkAuthHeader
from spacebridgeapp.rest.clients.async_kvstore_client import AsyncKvStoreClient


class KVStoreUpdateContext(object):
    def __init__(self, logger: Logger, client: AsyncKvStoreClient, header: SplunkAuthHeader):
        self.log: Logger = logger
        self.client: AsyncKvStoreClient = client
        self.auth_header: SplunkAuthHeader = header
