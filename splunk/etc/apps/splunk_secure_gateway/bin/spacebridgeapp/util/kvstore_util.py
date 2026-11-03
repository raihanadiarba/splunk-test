import time

from spacebridgeapp.solnlib.server_info import ServerInfo


def wait_until_ready(auth_header: str, timeout_seconds: float = 20, interval_seconds: float = 2):
    """Waits until KV store is ready to accept requests for up to timeout_seconds seconds."""
    start = time.time()
    while time.time() - start < timeout_seconds:
        if is_ready(auth_header):
            return
        time.sleep(interval_seconds)

    raise TimeoutError('Timed out waiting for KV store to be ready.')


def is_ready(auth_header: str) -> bool:
    """
    Returns whether KV store is ready to accept requests.

    :param auth_header: The splunk authorization header
    :return: Whether KV store is ready to accept requests
    """
    try:
        return ServerInfo(session_key=auth_header).is_kv_store_ready()
    except Exception:
        return False
