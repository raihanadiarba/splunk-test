from dataclasses import dataclass
from enum import Enum
from typing import Optional
from splunkupgrade.utils.types import JsonObject
from splunkupgrade.data.parsing import get_field, get_enum_field, get_object_list_field
from splunkupgrade.utils.constants import KvStoreIdxPeersRecordKeys
from typing import List
from splunkupgrade.data.idxc.kv_upgrade_progress_idx_peer import (
    KvUpgradeProgressIdxPeer,
    to_kv_upgrade_progress_idx_peer,
)


class KvIdxPeersOverallStatus(Enum):
    IN_PROGRESS = "in_progress"
    FAILED = "failed"
    COMPLETED = "completed"
    UNKNOWN = "unknown"


@dataclass
class KvUpgradeIdxPeersProgress:
    peers: List[KvUpgradeProgressIdxPeer]
    orchestrator_pid: int
    id: int
    from_version: str
    to_version: str
    overall_status: KvIdxPeersOverallStatus
    _key: Optional[str] = None

    def get_key(self):
        return self._key


def to_kv_upgrade_idx_peers_progress(
    json_idx_peers_upgrade_progress: JsonObject,
) -> KvUpgradeIdxPeersProgress:
    return KvUpgradeIdxPeersProgress(
        get_object_list_field(
            get_field(json_idx_peers_upgrade_progress, KvStoreIdxPeersRecordKeys.PEERS, list),
            to_kv_upgrade_progress_idx_peer,
        ),
        get_field(json_idx_peers_upgrade_progress, KvStoreIdxPeersRecordKeys.ORCHESTRATOR_PID, int),
        get_field(json_idx_peers_upgrade_progress, KvStoreIdxPeersRecordKeys.ID, int),
        get_field(json_idx_peers_upgrade_progress, KvStoreIdxPeersRecordKeys.FROM_VERSION, str),
        get_field(json_idx_peers_upgrade_progress, KvStoreIdxPeersRecordKeys.TO_VERSION, str),
        get_enum_field(
            KvIdxPeersOverallStatus,
            get_field(
                json_idx_peers_upgrade_progress, KvStoreIdxPeersRecordKeys.OVERALL_STATUS, str
            ),
            KvIdxPeersOverallStatus.UNKNOWN,
        ),
        get_field(json_idx_peers_upgrade_progress, KvStoreIdxPeersRecordKeys.KEY, str),
    )
