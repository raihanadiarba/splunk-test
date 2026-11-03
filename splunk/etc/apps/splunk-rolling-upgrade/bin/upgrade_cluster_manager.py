import os
import sys
from typing import Optional

current_path = os.path.dirname(os.path.realpath(__file__))
app_specific_lib_path = os.path.join(current_path, "..", "lib")
sys.path.insert(0, app_specific_lib_path)

import logging
from splunkupgrade.utils.logger_utils import initialize_logger_for_idxc_rest_endpoints

initialize_logger_for_idxc_rest_endpoints()

from splunkupgrade.utils.types import JsonObject
from splunkupgrade.utils.constants import SingleInstanceType
from splunkupgrade.processors.idxc.upgrade_cluster_standalone_rest_processor import (
    UpgradeClusterStandaloneRestProcessor,
)
from splunk.persistconn.application import PersistentServerConnectionApplication

logger = logging.getLogger(__name__)


class UpgradeClusterManagerRestEndpoint(PersistentServerConnectionApplication):
    def __init__(
        self,
        _command_line: Optional[str] = None,
        _command_arg: Optional[str] = None,
    ):
        super(PersistentServerConnectionApplication, self).__init__()

    def handle(self, in_string: bytes) -> JsonObject:
        return UpgradeClusterStandaloneRestProcessor(SingleInstanceType.CLUSTER_MANAGER).handle(
            in_string
        )

    def done(self):
        pass
