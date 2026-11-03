from typing import List, Optional
from packaging.version import Version
from splunkupgrade.data.idxc.kv_idx_current_upgrade_progress import (
    KvUpgradeIdxCurrentProgress,
    KvIdxCurrentStatus,
)
from splunkupgrade.data.idxc.kv_idx_peers_upgrade_progress import KvUpgradeIdxPeersProgress
from splunkupgrade.data.idxc.kv_upgrade_progress_idx_peer import (
    KvIdxPeerStatus,
    KvUpgradeProgressIdxPeer,
)
from splunkupgrade.data.parsing import to_version
from splunkupgrade.utils.constants import (
    AllPeersUpgradeStatus,
    CurrentInstanceUpgradeStatus,
    NO_UPGRADE,
    NOT_AVAILABLE,
)
from splunkupgrade.utils.types import JsonObject
from splunkupgrade.utils.utils import generate_upgrade_statistic, format_timestamp


def format_current_instance_status(
    current_peer_status: Optional[KvUpgradeIdxCurrentProgress], current_server_version: Version
) -> JsonObject:
    if not current_peer_status:
        return {
            CurrentInstanceUpgradeStatus.LAST_MODIFIED: NOT_AVAILABLE,
            CurrentInstanceUpgradeStatus.UPGRADER_PID: 0,
            CurrentInstanceUpgradeStatus.FROM_VERSION: NOT_AVAILABLE,
            CurrentInstanceUpgradeStatus.TO_VERSION: NOT_AVAILABLE,
            CurrentInstanceUpgradeStatus.STATUS: NO_UPGRADE,
        }
    status = (
        KvIdxCurrentStatus.COMPLETED
        if current_peer_status.status == KvIdxCurrentStatus.IN_PROGRESS
        and to_version(current_peer_status.to_version) <= current_server_version
        else current_peer_status.status
    )
    return {
        CurrentInstanceUpgradeStatus.UPGRADER_PID: current_peer_status.upgrader_pid,
        CurrentInstanceUpgradeStatus.FROM_VERSION: current_peer_status.from_version,
        CurrentInstanceUpgradeStatus.TO_VERSION: current_peer_status.to_version,
        CurrentInstanceUpgradeStatus.LAST_MODIFIED: format_timestamp(current_peer_status.timestamp),
        CurrentInstanceUpgradeStatus.STATUS: status.value,
    }


def format_peers(peers: List[KvUpgradeProgressIdxPeer]) -> List[JsonObject]:
    formatted_peers: List[JsonObject] = []
    for peer in peers:
        formatted_peer = {
            AllPeersUpgradeStatus.PEER_NAME: peer.name,
            AllPeersUpgradeStatus.LAST_MODIFIED: format_timestamp(peer.timestamp),
            AllPeersUpgradeStatus.PEER_STATUS: peer.status.value,
            AllPeersUpgradeStatus.PEER_UPGRADER_PID: peer.upgrader_pid,
        }
        formatted_peers.append(formatted_peer)
    return formatted_peers


def format_statistics(peers: List[KvUpgradeProgressIdxPeer]) -> JsonObject:
    number_of_upgraded_peers = sum(1 for peer in peers if peer.status == KvIdxPeerStatus.UPGRADED)
    return generate_upgrade_statistic(len(peers), number_of_upgraded_peers)


def format_empty_statistics() -> JsonObject:
    return generate_upgrade_statistic(0, 0)


def format_all_peers_status(status: Optional[KvUpgradeIdxPeersProgress]) -> JsonObject:
    if not status:
        return {
            AllPeersUpgradeStatus.ORCHESTRATOR_PID: 0,
            AllPeersUpgradeStatus.FROM_VERSION: NOT_AVAILABLE,
            AllPeersUpgradeStatus.TO_VERSION: NOT_AVAILABLE,
            AllPeersUpgradeStatus.OVERALL_STATUS: NO_UPGRADE,
            AllPeersUpgradeStatus.PEERS: [],
            AllPeersUpgradeStatus.STATISTICS: format_empty_statistics(),
        }
    return {
        AllPeersUpgradeStatus.ORCHESTRATOR_PID: status.orchestrator_pid,
        AllPeersUpgradeStatus.FROM_VERSION: status.from_version,
        AllPeersUpgradeStatus.TO_VERSION: status.to_version,
        AllPeersUpgradeStatus.OVERALL_STATUS: status.overall_status.value,
        AllPeersUpgradeStatus.PEERS: format_peers(status.peers),
        AllPeersUpgradeStatus.STATISTICS: format_statistics(status.peers),
    }


class ClusterUpgradeCurrentStatusFormatter:
    def __init__(
        self,
        current_peer_status: Optional[KvUpgradeIdxCurrentProgress],
        current_server_version: Version,
    ):
        self._current_peer_status = current_peer_status
        self._current_server_version = current_server_version

    def format(self) -> JsonObject:
        return {
            CurrentInstanceUpgradeStatus.KEY: format_current_instance_status(
                self._current_peer_status, self._current_server_version
            )
        }


class ClusterUpgradeFullStatusFormatter:
    def __init__(
        self,
        current_peer_status: Optional[KvUpgradeIdxCurrentProgress],
        all_peers_status: Optional[KvUpgradeIdxPeersProgress],
        current_server_version: Version,
    ):
        self._current_peer_status = current_peer_status
        self._all_peers_status = all_peers_status
        self._current_server_version = current_server_version

    def format(self) -> JsonObject:
        entire_format = ClusterUpgradeCurrentStatusFormatter(
            self._current_peer_status, self._current_server_version
        ).format()
        entire_format[AllPeersUpgradeStatus.KEY] = format_all_peers_status(self._all_peers_status)
        return entire_format
