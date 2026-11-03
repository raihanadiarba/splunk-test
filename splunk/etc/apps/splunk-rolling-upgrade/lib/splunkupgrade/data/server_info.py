import logging
from dataclasses import dataclass

from packaging.version import Version

from splunkupgrade.data.parsing import get_field, to_version
from splunkupgrade.utils.constants import ServerInfoKeys
from splunkupgrade.utils.types import JsonObject

logger = logging.getLogger(__name__)


@dataclass
class ServerInfo:
    version: Version
    server_name: str


def to_server_info(info_json: JsonObject) -> ServerInfo:
    return ServerInfo(
        to_version(get_field(info_json, ServerInfoKeys.VERSION, str)),
        get_field(info_json, ServerInfoKeys.SERVERNAME, str),
    )
