from dataclasses import dataclass
from enum import Enum
from typing import Optional

from splunkupgrade.data.parsing import get_field, get_enum_field, get_optional_field
from splunkupgrade.utils.constants import KvStoreIdxPeersRecordKeys
from splunkupgrade.utils.types import JsonObject


class KvIdxPeerStatus(Enum):
    READY = "ready"
    IN_PROGRESS = "in_progress"
    UPGRADED = "completed"
    FAILED = "failed"
    UNKNOWN = "unknown"


@dataclass
class KvUpgradeProgressIdxPeer:
    id: str
    name: str
    timestamp: float
    status: KvIdxPeerStatus
    site: str
    upgrader_pid: Optional[int] = None


def to_kv_upgrade_progress_idx_peer(json_peer: JsonObject) -> KvUpgradeProgressIdxPeer:
    return KvUpgradeProgressIdxPeer(
        get_field(json_peer, KvStoreIdxPeersRecordKeys.PEER_ID, str),
        get_field(json_peer, KvStoreIdxPeersRecordKeys.PEER_NAME, str),
        get_field(json_peer, KvStoreIdxPeersRecordKeys.PEER_TIMESTAMP, float),
        get_enum_field(
            KvIdxPeerStatus,
            get_field(json_peer, KvStoreIdxPeersRecordKeys.PEER_STATUS, str),
            KvIdxPeerStatus.UNKNOWN,
        ),
        get_field(json_peer, KvStoreIdxPeersRecordKeys.PEER_SITE, str),
        get_optional_field(json_peer, KvStoreIdxPeersRecordKeys.PEER_UPGRADER_PID, int),
    )
