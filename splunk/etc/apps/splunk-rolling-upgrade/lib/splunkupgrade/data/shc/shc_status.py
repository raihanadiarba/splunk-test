from dataclasses import dataclass
from typing import Dict, List

from splunkupgrade.data.parsing import get_field
from splunkupgrade.data.shc.shc_status_captain import (
    ShcStatusCaptain,
    to_shc_status_captain,
)
from splunkupgrade.data.shc.shc_status_peer import ShcStatusPeer, to_shc_peers_list
from splunkupgrade.utils.constants import ShcStatusKeys
from splunkupgrade.utils.types import JsonObject


@dataclass
class ShcStatus:
    captain: ShcStatusCaptain
    peers: List[ShcStatusPeer]

    def __eq__(self, other):
        if not isinstance(other, ShcStatus):
            return False
        return self.captain == other.captain and sorted(
            self.peers, key=lambda x: x.label
        ) == sorted(other.peers, key=lambda x: x.label)


def to_shc_status(json_status: JsonObject) -> ShcStatus:
    return ShcStatus(
        to_shc_status_captain(get_field(json_status, ShcStatusKeys.CAPTAIN, Dict)),
        to_shc_peers_list(get_field(json_status, ShcStatusKeys.PEERS, Dict)),
    )
