import os
import sys
from typing import Optional

current_path = os.path.dirname(os.path.realpath(__file__))
app_specific_lib_path = os.path.join(current_path, "..", "lib")
sys.path.insert(0, app_specific_lib_path)
import logging
from splunkupgrade.utils.logger_utils import (
    initialize_logger_for_idxc_rest_endpoints,
)

initialize_logger_for_idxc_rest_endpoints()

from splunkupgrade.processors.idxc.upgrade_cluster_all_peers_rest_processor import (
    UpgradeClusterAllPeersRestProcessor,
)
from splunkupgrade.utils.types import JsonObject
from splunk.persistconn.application import PersistentServerConnectionApplication


logger = logging.getLogger(__name__)


class UpgradeClusterAllPeersRestEndpoint(PersistentServerConnectionApplication):
    def __init__(
        self,
        _command_line: Optional[str] = None,
        _command_arg: Optional[str] = None,
    ):
        super(PersistentServerConnectionApplication, self).__init__()

    # Handle a syncronous from splunkd.
    def handle(self, in_string: bytes) -> JsonObject:
        """
        Called for a simple synchronous request.
        @param in_string: request data passed in
        @rtype: string or dict
        @return: String to return in response.  If a dict was passed in,
                 it will automatically be JSON encoded before being returned.
        """
        return UpgradeClusterAllPeersRestProcessor().handle(in_string)

    def done(self):
        """
        Virtual method which can be optionally overridden to receive a
        callback after the request completes.
        """
        pass
