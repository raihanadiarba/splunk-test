import os
import sys
from typing import Optional

current_path = os.path.dirname(os.path.realpath(__file__))
app_specific_lib_path = os.path.join(current_path, "..", "lib")
sys.path.insert(0, app_specific_lib_path)
import logging
from splunkupgrade.utils.logger_utils import (
    initialize_logger_for_rest_endpoints,
)

initialize_logger_for_rest_endpoints()

from splunkupgrade.processors.shc.shc_upgrade_status_rest_processor import (
    ShcUpgradeStatusRestProcessor,
)
from splunkupgrade.utils.types import JsonObject
from splunk.persistconn.application import PersistentServerConnectionApplication


logger = logging.getLogger(__name__)


class UpgradeShcStatusRestEndpoint(PersistentServerConnectionApplication):
    def __init__(
        self,
        _command_line: Optional[str] = None,
        _command_arg: Optional[str] = None,
    ):
        super(PersistentServerConnectionApplication, self).__init__()

    # Handle a synchronous from splunkd.
    def handle(self, in_string: bytes) -> JsonObject:
        return ShcUpgradeStatusRestProcessor().handle(in_string)

    def done(self):
        pass
