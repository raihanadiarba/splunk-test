from spacebridgeapp.rest.services import splunk_service

class ServerInfo:
    """
    This is a simplified version of solnlib.server_info.ServerInfo that only includes the methods we need.
    It doesn't use urllib3, only splunk.rest.
    The problem with original solnlib happens when it gets called from a rest handler.
    Splunk uses python process pooling in rest handlers, and a handler might have invalid lib version already loaded.
    """
    def __init__(self, session_key):
        self.session_key = session_key

    def is_cloud_instance(self) -> bool:
        """Determine if the Splunk instance is a cloud instance.

        Returns:
            True if the instance is a cloud instance, False otherwise.
        """
        try:
            server_info = splunk_service.get_server_info(session_key=self.session_key)
            return server_info["instance_type"] == "cloud"
        except KeyError:
            return False

    def is_kv_store_ready(self) -> bool:
        """Determine if the KV store is ready."""
        try:
            server_info = splunk_service.get_server_info(session_key=self.session_key)
            return server_info["kvStoreStatus"] == "ready"
        except KeyError:
            return False
