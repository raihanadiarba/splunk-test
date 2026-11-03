import os
import sys
from typing import Optional
import logging

current_path = os.path.dirname(os.path.realpath(__file__))
app_specific_lib_path = os.path.join(current_path, "..", "lib")
sys.path.insert(0, app_specific_lib_path)

from splunkupgrade.utils.logger_utils import initialize_logger_for_proxy_rest_endpoints
from splunk.persistconn.application import PersistentServerConnectionApplication
from splunkupgrade.utils.types import JsonObject
from splunkupgrade.processors.rest_proxy_processors import RestProxyUpdateProcessor


initialize_logger_for_proxy_rest_endpoints()
logger = logging.getLogger(__name__)


class UpgradeRestEndpoint(PersistentServerConnectionApplication):
    def __init__(
        self,
        _command_line: Optional[str] = None,
        _command_arg: Optional[str] = None,
    ):
        super(PersistentServerConnectionApplication, self).__init__()

    def handle(self, in_string: bytes) -> JsonObject:
        return RestProxyUpdateProcessor().handle(in_string)

    def done(self):
        pass
