from dataclasses import dataclass
from typing import List

from splunkupgrade.data.data_parse_exception import DataParseException
from splunkupgrade.data.parsing import get_field
from splunkupgrade.utils.constants import ShcStatusKeys
from splunkupgrade.utils.types import JsonObject


@dataclass
class ShcStatusPeer:
    label: str
    mgmt_uri: str
    out_of_sync_node: bool
    splunk_version: str
    status: str
    is_in_manual_detention: bool


def to_bool_manual_detention(manual_detention_status: str) -> bool:
    if manual_detention_status == "off":
        return False
    if manual_detention_status == "on":
        return True
    raise DataParseException(
        f"Unexpected value '{manual_detention_status}' for the manual detention"
    )


def to_shc_status_peer(json_peer: JsonObject) -> ShcStatusPeer:
    return ShcStatusPeer(
        get_field(json_peer, ShcStatusKeys.LABEL, str),
        get_field(json_peer, ShcStatusKeys.MANAGEMENT_URI, str),
        get_field(json_peer, ShcStatusKeys.OUT_OF_SYNC_NODE, bool),
        get_field(json_peer, ShcStatusKeys.SPLUNK_VERSION, str),
        get_field(json_peer, ShcStatusKeys.STATUS, str),
        to_bool_manual_detention(get_field(json_peer, ShcStatusKeys.MANUAL_DETENTION, str)),
    )


def to_shc_peers_list(peers_object: JsonObject) -> List[ShcStatusPeer]:
    return [to_shc_status_peer(peer) for peer in peers_object.values()]
