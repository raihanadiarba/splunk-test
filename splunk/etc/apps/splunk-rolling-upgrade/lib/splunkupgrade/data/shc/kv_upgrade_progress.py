from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional

from splunkupgrade.data.shc.kv_upgrade_progress_peer import (
    KvUpgradePeerStep,
    KvUpgradeProgressPeer,
    to_kv_upgrade_progress_peer,
)
from splunkupgrade.data.parsing import get_field, get_enum_field, get_object_list_field
from splunkupgrade.utils.constants import (
    KvStoreUpgradeRecordKeys,
    NO_UPGRADE,
    UPGRADE_STATUS_DATETIME_FORMAT,
    UpgradeShcStatusResponseOverallStatus as UpgradeStatus,
    UpgradeShcStatusResponsePeers as Peers,
    UpgradeStatusResponseStats as Stats,
    UpgradeStatusKeys,
)
from splunkupgrade.utils.types import JsonObject
from splunkupgrade.utils.utils import format_timestamp, generate_upgrade_statistic


class SummaryKvUpgradeProgress(Enum):
    IN_PROGRESS = "in_progress"
    FAILED = "failed"
    COMPLETED = "completed"
    UNKNOWN = "unknown"


@dataclass
class KvUpgradeProgress:
    status: SummaryKvUpgradeProgress
    id: int
    peers: List[KvUpgradeProgressPeer]
    from_version: str
    to_version: str
    _key: Optional[str] = None

    def get_key(self):
        return self._key


def to_kv_upgrade_progress(
    json_upgrade_progress: JsonObject,
) -> KvUpgradeProgress:
    return KvUpgradeProgress(
        get_enum_field(
            SummaryKvUpgradeProgress,
            get_field(json_upgrade_progress, KvStoreUpgradeRecordKeys.STATUS, str),
            SummaryKvUpgradeProgress.UNKNOWN,
        ),
        get_field(json_upgrade_progress, KvStoreUpgradeRecordKeys.ID, int),
        get_object_list_field(
            get_field(json_upgrade_progress, KvStoreUpgradeRecordKeys.PEERS, list),
            to_kv_upgrade_progress_peer,
        ),
        get_field(json_upgrade_progress, KvStoreUpgradeRecordKeys.FROM_VERSION, str),
        get_field(json_upgrade_progress, KvStoreUpgradeRecordKeys.TO_VERSION, str),
        get_field(json_upgrade_progress, KvStoreUpgradeRecordKeys.KEY, str),
    )


@dataclass
class PeerStatus:
    name: str
    status: str
    last_modified: str

    @classmethod
    def from_upgrade_progress_peer(cls, peer: KvUpgradeProgressPeer):
        timestamp_as_date = format_timestamp(peer.timestamp)
        return PeerStatus(peer.name, str(peer.status.value), timestamp_as_date)

    @classmethod
    def from_dict(cls, input_dict: Dict):
        return PeerStatus(input_dict[Peers.NAME], input_dict[Peers.STATUS], input_dict[Peers.DATE])


class UpgradeShcStatusResponse:
    def __init__(self, status: Optional[KvUpgradeProgress]):
        self._status = status
        self._response: Dict = dict()

    def _format_peer_list(self):
        if self._status:
            peers = [PeerStatus.from_upgrade_progress_peer(p) for p in self._status.peers]
            peers_as_list_of_dict = [
                {Peers.NAME: p.name, Peers.STATUS: p.status, Peers.DATE: p.last_modified}
                for p in peers
            ]
        else:
            peers_as_list_of_dict = []
        self._response[Peers.KEY] = peers_as_list_of_dict

    def _format_statistics(self):
        def total_upgraded_peers(peers: List[KvUpgradeProgressPeer]) -> int:
            upgraded_peers = [peer for peer in peers if peer.status == KvUpgradePeerStep.UPGRADED]
            return len(upgraded_peers)

        if self._status:
            self._response[Stats.KEY] = generate_upgrade_statistic(
                len(self._status.peers), total_upgraded_peers(self._status.peers)
            )
        else:
            self._response[Stats.KEY] = generate_upgrade_statistic(0, 0)

    def _format_overall_upgrade_status(self):
        if self._status:
            self._response[UpgradeStatus.KEY] = self._status.status.value
        else:
            self._response[UpgradeStatus.KEY] = NO_UPGRADE

    def format_response(self):
        self._format_overall_upgrade_status()
        self._format_statistics()
        self._format_peer_list()
        return self._response


def to_upgrade_shc_status_response(status: Optional[KvUpgradeProgress]) -> JsonObject:
    return {UpgradeStatusKeys.MESSAGE: UpgradeShcStatusResponse(status).format_response()}
