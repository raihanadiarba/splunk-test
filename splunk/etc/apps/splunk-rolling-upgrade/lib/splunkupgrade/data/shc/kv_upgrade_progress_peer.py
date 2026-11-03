from dataclasses import dataclass
from enum import Enum
from typing import Optional

from splunkupgrade.data.parsing import get_field, get_optional_field, get_enum_field
from splunkupgrade.utils.constants import KvStoreUpgradeRecordKeys
from splunkupgrade.utils.types import JsonObject


class KvUpgradePeerStep(Enum):
    READY = "ready"
    RUNNING_UPGRADE_PROCESS = "running_upgrade_process"
    MANUAL_DETENTION_ON = "manual_detention_on"
    READY_FOR_INSTALL = "ready_for_install"
    SPLUNK_STOPPED = "splunk_stopped"
    PACKAGE_INSTALLED = "package_installed"
    SPLUNK_STARTED = "splunk_started"
    MANUAL_DETENTION_OFF = "manual_detention_off"
    UPGRADED = "upgraded"
    UNKNOWN = "unknown"


@dataclass
class KvUpgradeProgressPeer:
    name: str
    status: KvUpgradePeerStep
    timestamp: float
    upgrader_pid: Optional[int] = None
    completion_pid: Optional[int] = None


def to_kv_upgrade_progress_peer(json_peer: JsonObject) -> KvUpgradeProgressPeer:
    return KvUpgradeProgressPeer(
        get_field(json_peer, KvStoreUpgradeRecordKeys.PEER_NAME, str),
        get_enum_field(
            KvUpgradePeerStep,
            get_field(json_peer, KvStoreUpgradeRecordKeys.STATUS, str),
            KvUpgradePeerStep.UNKNOWN,
        ),
        get_field(json_peer, KvStoreUpgradeRecordKeys.PEER_TIMESTAMP, float),
        get_optional_field(json_peer, KvStoreUpgradeRecordKeys.PEER_UPGRADER_PID, int),
        get_optional_field(json_peer, KvStoreUpgradeRecordKeys.PEER_COMPLETION_PID, int),
    )
