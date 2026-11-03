from dataclasses import dataclass
from enum import Enum
from typing import Optional
from splunkupgrade.utils.types import JsonObject
from splunkupgrade.data.parsing import get_field, get_enum_field
from splunkupgrade.utils.constants import KvStoreIdxCurrentRecordKeys


# TODO: Remove KvIdxCurrentStatus and KvIdxPeersOverallStatus enums and reuse SummaryKvUpgradeProgress everywhere
class KvIdxCurrentStatus(Enum):
    IN_PROGRESS = "in_progress"
    FAILED = "failed"
    READY = "ready"
    UNKNOWN = "unknown"
    COMPLETED = "completed"


@dataclass
class KvUpgradeIdxCurrentProgress:
    timestamp: float
    upgrader_pid: int
    from_version: str
    to_version: str
    status: KvIdxCurrentStatus
    id: int
    _key: Optional[str] = None

    def get_key(self):
        return self._key


def to_kv_upgrade_idx_current_progress(
    json_idx_current_upgrade_progress: JsonObject,
) -> KvUpgradeIdxCurrentProgress:
    return KvUpgradeIdxCurrentProgress(
        get_field(json_idx_current_upgrade_progress, KvStoreIdxCurrentRecordKeys.TIMESTAMP, float),
        get_field(json_idx_current_upgrade_progress, KvStoreIdxCurrentRecordKeys.UPGRADER_PID, int),
        get_field(json_idx_current_upgrade_progress, KvStoreIdxCurrentRecordKeys.FROM_VERSION, str),
        get_field(json_idx_current_upgrade_progress, KvStoreIdxCurrentRecordKeys.TO_VERSION, str),
        get_enum_field(
            KvIdxCurrentStatus,
            get_field(json_idx_current_upgrade_progress, KvStoreIdxCurrentRecordKeys.STATUS, str),
            KvIdxCurrentStatus.UNKNOWN,
        ),
        get_field(json_idx_current_upgrade_progress, KvStoreIdxCurrentRecordKeys.ID, int),
        get_field(json_idx_current_upgrade_progress, KvStoreIdxCurrentRecordKeys.KEY, str),
    )
