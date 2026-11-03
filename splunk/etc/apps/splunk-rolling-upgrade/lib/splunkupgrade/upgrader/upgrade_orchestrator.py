import logging
import os
import time

from retry import retry

from typing import Callable, Dict, List, Tuple
from dataclasses import dataclass
from packaging.version import Version
from splunkupgrade.data.upgrade_endpoints_response import EndpointResponseStatus
from splunkupgrade.data.idxc.config import Config
from splunkupgrade.data.idxc.peer import PeerStatus
from splunkupgrade.data.idxc.kv_upgrade_progress_idx_peer import (
    KvIdxPeerStatus,
    KvUpgradeProgressIdxPeer,
)
from splunkupgrade.data.idxc.kv_idx_peers_upgrade_progress import KvUpgradeIdxPeersProgress
from splunkupgrade.data.idxc.kv_idx_peers_upgrade_progress import KvIdxPeersOverallStatus
from splunkupgrade.utils.app_conf import OrchestratorConfig
from splunkupgrade.utils.constants import ExitCodes, OrchestratorStanza
from splunkupgrade.utils.exceptions import BadSearchFactor, NoUpgradeRecordFound, UpgraderException
from splunkupgrade.utils.splunk_service import SplunkService
from splunkupgrade.upgrader.upgrader_indexer_utils import (
    log_cluster_telemetry_start_upgrade,
    log_cluster_telemetry_successful_upgrade,
    log_cluster_telemetry_failed_upgrade,
    PeersForUpgrade,
    InProgressPeer,
)

logger = logging.getLogger(__name__)


class CheckpointFailed(Exception):
    pass


def get_search_factor(cluster_config: Config) -> int:
    if not cluster_config.multisite:
        return cluster_config.search_factor
    if cluster_config.total_site_search_factor is None:
        raise BadSearchFactor("Total site search factor is unknown")
    return cluster_config.total_site_search_factor


def get_concurrency(
    cluster_config: Config, orchestrator_config: OrchestratorConfig, total_peers: int
) -> int:
    concurrency = min(get_search_factor(cluster_config) - 1, (total_peers - 1) // 2)
    if concurrency < 1:
        raise BadSearchFactor(
            "Search factor is too low to allow any peer restart without losing searchability"
        )
    if orchestrator_config.concurrency and orchestrator_config.concurrency > concurrency:
        raise BadSearchFactor(
            f"Concurrency config '{OrchestratorStanza.CONCURRENCY}' in '{OrchestratorStanza.STANZA_NAME}' stanza is higher than the cluster search factor allows"
        )
    return orchestrator_config.concurrency if orchestrator_config.concurrency else concurrency


def was_peer_upgraded(
    peer: KvUpgradeProgressIdxPeer, target_version: Version, service: SplunkService
) -> bool:
    status = service.get_idxc_peer(peer.id)
    return (
        status is not None and status.status == PeerStatus.UP and status.version == target_version
    )


def filter_peers(
    peer_list: List[InProgressPeer], predicate: Callable[[InProgressPeer], bool]
) -> Tuple[List[InProgressPeer], List[InProgressPeer]]:
    passed: List[InProgressPeer] = []
    rejected: List[InProgressPeer] = []
    for peer in peer_list:
        (passed if predicate(peer) else rejected).append(peer)
    return passed, rejected


def separate_upgraded_unupgraded_peers(
    in_progress_list: List[InProgressPeer], target_version: Version, service: SplunkService
) -> Tuple[List[InProgressPeer], List[InProgressPeer]]:
    return filter_peers(
        in_progress_list, lambda peer: was_peer_upgraded(peer.peer, target_version, service)
    )


def was_retries_limit_reached(in_progress_list: List[InProgressPeer], limit: int) -> bool:
    return any(peer.status_check_counter >= limit for peer in in_progress_list)


def increment_retries_count(in_progress_list: List[InProgressPeer]) -> None:
    for peer in in_progress_list:
        peer.status_check_counter += 1


def next_peers_for_upgrade(
    upgrade_list: List[KvUpgradeProgressIdxPeer], peers_to_upgrade: int
) -> Tuple[List[KvUpgradeProgressIdxPeer], List[InProgressPeer]]:
    if peers_to_upgrade == 0:
        return upgrade_list, []
    new_upgrade_list = upgrade_list[peers_to_upgrade:]
    new_in_progress_peers = [InProgressPeer(peer) for peer in upgrade_list[:peers_to_upgrade]]
    return new_upgrade_list, new_in_progress_peers


def separate_failed_unupgraded_peers(
    in_progress_list: List[InProgressPeer], retry_limit: int
) -> Tuple[List[InProgressPeer], List[InProgressPeer]]:
    return filter_peers(in_progress_list, lambda peer: peer.status_check_counter >= retry_limit)


def prepare_peers_for_upgrade(total_list: List[KvUpgradeProgressIdxPeer]) -> PeersForUpgrade:
    @dataclass
    class PeersCount:
        upgraded_peers: int = 0
        total_peers: int = 0

    unupgraded_list = [peer for peer in total_list if peer.status != KvIdxPeerStatus.UPGRADED]
    peer_map: Dict[str, List[KvUpgradeProgressIdxPeer]] = {}
    for peer in unupgraded_list:
        list_for_site = peer_map.setdefault(peer.site, [])
        list_for_site.append(peer)

    counts_by_site: Dict[str, PeersCount] = {}
    for peer in total_list:
        counts = counts_by_site.setdefault(peer.site, PeersCount())
        counts.total_peers += 1
        if peer.status == KvIdxPeerStatus.UPGRADED:
            counts.upgraded_peers += 1

    upgrade_order: List[str] = []
    for site, counts in counts_by_site.items():
        all_peers_upgraded = counts.upgraded_peers == counts.total_peers
        all_peers_waiting_for_upgrade = counts.upgraded_peers == 0
        has_unupgraded_peers = not all_peers_upgraded and not all_peers_waiting_for_upgrade
        if all_peers_upgraded:
            continue  # skip site from upgrade list
        elif has_unupgraded_peers:
            upgrade_order.insert(
                0, site
            )  # start the upgrade from the site that has unupgraded peers
        else:
            upgrade_order.append(site)  # we don't care about the order of other sites

    return PeersForUpgrade(peer_map, upgrade_order)


def try_fail_upgrade(upgrade_record: KvUpgradeIdxPeersProgress, service: SplunkService):
    try:
        upgrade_record.overall_status = KvIdxPeersOverallStatus.FAILED
        service.update_idx_peers_upgrade_progress(upgrade_record)
    except Exception as e:
        logger.error(f"Unable to set the failed status, reason='{e}'")


class UpgradeOrchestrator:
    def __init__(
        self,
        service: SplunkService,
        orchestrator_config: OrchestratorConfig,
        skip_status_check: bool,
    ):
        self._service = service
        self._orchestrator_config = orchestrator_config
        self._skip_status_check = skip_status_check
        upgrade_record = service.get_latest_idx_peers_upgrade()
        if not upgrade_record:
            raise NoUpgradeRecordFound("Upgrade records do not exist in kv store")
        self._upgrade_record = upgrade_record

    def _report_succeeded_peers(self, succeeded_list: List[InProgressPeer]):
        for peer in succeeded_list:
            logger.info(f"Upgrade of peer={peer.peer.name} is finished")
            peer.peer.status = KvIdxPeerStatus.UPGRADED
            peer.peer.timestamp = time.time()
        if succeeded_list:
            self._service.update_idx_peers_upgrade_progress(self._upgrade_record)

    def _report_failed_peers(self, peers: List[InProgressPeer]):
        for peer in peers:
            logger.error(
                f"Peer={peer.peer.name} has reached the timeout and retry limit, but still wasn't upgraded"
            )
            peer.peer.status = KvIdxPeerStatus.FAILED
            peer.peer.timestamp = time.time()
        if peers:
            self._service.update_idx_peers_upgrade_progress(self._upgrade_record)

    def _start_upgrade_of_new_peers(
        self,
        upgrade_list: List[InProgressPeer],
    ) -> None:
        for pending_peer in upgrade_list:
            result = self._service.upgrade_idxc_peer_by_name(
                pending_peer.peer.name, self._upgrade_record.to_version
            )
            if result.status != EndpointResponseStatus.SUCCEEDED:
                raise UpgraderException(
                    f"Failed to initiate upgrade of peer={pending_peer.peer.name}"
                )
            pending_peer.peer.status = KvIdxPeerStatus.IN_PROGRESS
            pending_peer.peer.timestamp = time.time()
            pending_peer.peer.upgrader_pid = result.pid
        if upgrade_list:
            self._service.update_idx_peers_upgrade_progress(self._upgrade_record)

    def _wait_remaining_peers_to_complete(self, in_progress_list: List[InProgressPeer]) -> None:
        while in_progress_list:
            failed, in_progress_list = separate_failed_unupgraded_peers(
                in_progress_list, self._orchestrator_config.max_tries
            )
            self._report_failed_peers(failed)
            logger.info("Waiting for remaining peers to complete before failing the upgrade")
            time.sleep(self._orchestrator_config.delay_after_each_retry)
            succeeded_list, in_progress_list = separate_upgraded_unupgraded_peers(
                in_progress_list, Version(self._upgrade_record.to_version), self._service
            )
            self._report_succeeded_peers(succeeded_list)
            increment_retries_count(in_progress_list)

    def _orchestrate_for_site(
        self, upgrade_list: List[KvUpgradeProgressIdxPeer], concurrency: int
    ) -> bool:
        if (
            not self._orchestrator_config.enable_midpoint_status_check
            or len(upgrade_list) <= 1
            or self._skip_status_check
        ):
            return self._orchestrate_for_peers(upgrade_list, concurrency)

        half_of_peers = len(upgrade_list) // 2
        if not self._orchestrate_for_peers(upgrade_list[0:half_of_peers], concurrency):
            return False

        @retry(
            CheckpointFailed,
            tries=self._orchestrator_config.midpoint_check_max_tries,
            delay=self._orchestrator_config.midpoint_check_retry_delay,
        )
        def wait_for_searchability():
            status = self._service.get_idxc_health()
            if not status.all_data_is_searchable or not status.all_peers_are_up:
                logger.error(
                    "Mid upgrade check failed. Cluster lost data searchability or some peers are down"
                )
                raise CheckpointFailed("Mid upgrade check failed")

        wait_for_searchability()

        return self._orchestrate_for_peers(
            upgrade_list[half_of_peers : len(upgrade_list)], concurrency
        )

    def _orchestrate_for_peers(
        self, upgrade_list: List[KvUpgradeProgressIdxPeer], concurrency: int
    ) -> bool:
        in_progress_list: List[InProgressPeer] = []
        while upgrade_list or in_progress_list:
            upgrade_list, new_in_progress_batch = next_peers_for_upgrade(
                upgrade_list, concurrency - len(in_progress_list)
            )
            self._start_upgrade_of_new_peers(new_in_progress_batch)
            in_progress_list.extend(new_in_progress_batch)
            logger.info("Waiting for peers upgrade to complete")
            time.sleep(self._orchestrator_config.delay_after_each_retry)
            succeeded_list, in_progress_list = separate_upgraded_unupgraded_peers(
                in_progress_list, Version(self._upgrade_record.to_version), self._service
            )
            self._report_succeeded_peers(succeeded_list)
            increment_retries_count(in_progress_list)
            if was_retries_limit_reached(in_progress_list, self._orchestrator_config.max_tries):
                break

        if in_progress_list:
            self._wait_remaining_peers_to_complete(in_progress_list)
            return False
        return True

    def run_orchestrator(self) -> ExitCodes:
        try:
            logger.info("Starting the orchestrator")
            self._upgrade_record.orchestrator_pid = os.getpid()
            self._service.update_idx_peers_upgrade_progress(self._upgrade_record)
            cluster_config = self._service.get_idxc_config()
            concurrency = get_concurrency(
                cluster_config, self._orchestrator_config, len(self._upgrade_record.peers)
            )
            logger.info(f"Number of peers that will be upgraded simultaneously {concurrency}")

            peers_to_upgrade_by_site = prepare_peers_for_upgrade(self._upgrade_record.peers)
            log_cluster_telemetry_start_upgrade(peers_to_upgrade_by_site, self._upgrade_record)
            for site in peers_to_upgrade_by_site.site_upgrade_order:
                tot_peers = len(peers_to_upgrade_by_site.site_to_peers[site])
                if self._orchestrate_for_site(
                    peers_to_upgrade_by_site.site_to_peers[site], concurrency
                ):
                    log_cluster_telemetry_successful_upgrade(site, tot_peers, self._upgrade_record)
                    continue
                self._upgrade_record.overall_status = KvIdxPeersOverallStatus.FAILED
                self._service.update_idx_peers_upgrade_progress(self._upgrade_record)
                logger.error("Upgrade of peers failed")
                log_cluster_telemetry_failed_upgrade(
                    site, tot_peers, "Failed", self._upgrade_record
                )
                return ExitCodes.ERROR_WHEN_UPGRADING
            self._service.idxc_finalize_upgrade()
            self._upgrade_record.overall_status = KvIdxPeersOverallStatus.COMPLETED
            self._service.update_idx_peers_upgrade_progress(self._upgrade_record)
            logger.info("All indexer peers upgraded successfully")
            return ExitCodes.OK
        except Exception as e:
            logger.error(f"Error when upgrading, error='{e}'")
            log_cluster_telemetry_failed_upgrade(
                "default", 0, "Error when upgrading all indexer peers", self._upgrade_record
            )
            try_fail_upgrade(self._upgrade_record, self._service)
            return ExitCodes.ERROR_WHEN_UPGRADING
