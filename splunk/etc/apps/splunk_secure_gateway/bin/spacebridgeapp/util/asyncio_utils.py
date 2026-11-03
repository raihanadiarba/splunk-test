import asyncio
from spacebridgeapp.util.config import SecureGatewayConfig

def create_semaphore(config: SecureGatewayConfig) -> asyncio.Semaphore:
    """
    Helper to create a semaphore based on the config.
    We want to limit the number of concurrent requests to the Splunk API to avoid overwhelming the server.
    By default, we set the semaphore to 5.
    This can be overridden by the support team in the instance config (kvstore).
    :param config: SecureGatewayConfig
    :return: asyncio.Semaphore
    """
    if config is None:
        raise ValueError("SecureGatewayConfig config is None")

    max_concurrent_requests = config.get_async_semaphore() or 5
    max_concurrent_requests = max(1, min(max_concurrent_requests, 10))
    return asyncio.Semaphore(max_concurrent_requests)
