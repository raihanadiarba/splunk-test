import logging
from typing import Optional, Dict, List
import time
import os

from splunkupgrade.data.idxc.kv_idx_current_upgrade_progress import (
    KvIdxCurrentStatus,
    KvUpgradeIdxCurrentProgress,
)
from splunkupgrade.data.idxc.kv_upgrade_progress_idx_peer import KvUpgradeProgressIdxPeer
from splunkupgrade.data.idxc.kv_idx_peers_upgrade_progress import KvUpgradeIdxPeersProgress
from splunkupgrade.data.parsing import to_version
from dataclasses import dataclass
from splunkupgrade.utils.constants import GeneralConstants
from splunkupgrade.utils.exceptions import NoUpgradeRecordFound
from splunkupgrade.utils.server_roles_mapper import ServerRolesMapper
from splunkupgrade.utils.splunk_service import (
    SplunkService,
    SplunkServiceException,
)
from packaging.version import Version

from splunkupgrade.upgrader.telemetry_utils import (
    telemetry_idx_log,
    TelemetryStatus,
    TelemetryDeploymentType,
    TELEMETRY_VERSION_UNKNOWN,
)

logger = logging.getLogger(__name__)


class IndexerCurrentStatusUpdater:
    def __init__(
        self, service: SplunkService, current: Optional[KvUpgradeIdxCurrentProgress] = None
    ):
        self._service = service
        current_progress = current if current else service.get_latest_idx_current_upgrade()
        if not current_progress:
            raise NoUpgradeRecordFound(
                f"Upgrade records do not exist in kv store for {GeneralConstants.IDX_CURRENT_COLLECTION_NAME}"
            )
        self._current_progress = current_progress

    def get_current_progress(self):
        return self._current_progress

    def update_upgrade_status_to(self, status: KvIdxCurrentStatus):
        self._current_progress.status = status
        self._service.update_idx_current_upgrade_progress(self._current_progress)

    def update_pid(self):
        self._current_progress.upgrader_pid = os.getpid()
        self._service.update_idx_current_upgrade_progress(self._current_progress)


def fail_status(service: SplunkService) -> bool:
    try:
        status_updater = IndexerCurrentStatusUpdater(service)
        status_updater.update_upgrade_status_to(KvIdxCurrentStatus.FAILED)
        return True
    except (NoUpgradeRecordFound, SplunkServiceException) as e:
        logger.error(f"Failed to set the fail status: {e}")
        return False


# TODO: fake method only for testing. The initial record should be added in the REST implementation
def create_current_record(service: SplunkService) -> KvUpgradeIdxCurrentProgress:
    last_upgrade = service.get_latest_idx_current_upgrade()
    next_upgrade_id = last_upgrade.id + 1 if last_upgrade else 0
    return KvUpgradeIdxCurrentProgress(
        time.time(), os.getpid(), "9.0.1", "9.0.2", KvIdxCurrentStatus.READY, next_upgrade_id
    )


def validate_package_version(package_version: Version, str_target_version: Optional[str]):
    if str_target_version is None:
        return  # to_version is optional when upgrade was not started by the orchestrator
    target_version = to_version(str_target_version)
    if target_version != package_version:
        raise SplunkServiceException(
            f"Package version: '{package_version}' does not match the expected target version for upgrade "
            f"{target_version}"
        )


@dataclass
class InProgressPeer:
    peer: KvUpgradeProgressIdxPeer
    status_check_counter: int = 0


@dataclass
class PeersForUpgrade:
    site_to_peers: Dict[str, List[KvUpgradeProgressIdxPeer]]
    site_upgrade_order: List[str]


@dataclass
class TelemetryData:
    upgrade_id: int = -1
    deployment_type: str = TelemetryDeploymentType.UNKNOWN
    from_version: str = TELEMETRY_VERSION_UNKNOWN
    to_version: str = TELEMETRY_VERSION_UNKNOWN

    @staticmethod
    def get_deployment_type(service: SplunkService):
        mapper = ServerRolesMapper(service.get_server_roles())
        if mapper.is_standalone_indexer():
            return TelemetryDeploymentType.INDEXER_STANDALONE
        elif mapper.is_cluster_manager():
            return TelemetryDeploymentType.CLUSTER_MANAGER
        elif mapper.is_isolated_license_manager():
            return TelemetryDeploymentType.LICENSE_MANAGER
        else:
            return TelemetryDeploymentType.UNKNOWN


def _log_single_instance_telemetry_upgrade(
    message: str, status: str, reason: str, telemetry: TelemetryData
):
    return telemetry_idx_log(
        message,
        telemetry.upgrade_id,
        1,
        status,
        telemetry.deployment_type,
        "default",
        reason,
        telemetry.from_version,
        telemetry.to_version,
    )


def log_single_instance_telemetry_start_upgrade(telemetry: TelemetryData):
    telemetry_log = _log_single_instance_telemetry_upgrade(
        "Single instance upgrade started",
        TelemetryStatus.IN_PROGRESS,
        "No failure",
        telemetry,
    )
    logger.info(telemetry_log)


def log_single_instance_telemetry_successful_upgrade(telemetry: TelemetryData):
    telemetry_log = _log_single_instance_telemetry_upgrade(
        "Single instance upgrade ended",
        TelemetryStatus.SUCCESS,
        "Finished with success",
        telemetry,
    )
    logger.info(telemetry_log)


def log_single_instance_telemetry_failed_upgrade(reason: str, telemetry: TelemetryData):
    telemetry_log = _log_single_instance_telemetry_upgrade(
        "Single instance upgrade failed", TelemetryStatus.FAILED, reason, telemetry
    )
    logger.info(telemetry_log)


def log_cluster_telemetry_start_upgrade(
    peers_by_site: PeersForUpgrade, all_peers_kv_record: KvUpgradeIdxPeersProgress
):
    for site in peers_by_site.site_upgrade_order:
        telemetry_log = telemetry_idx_log(
            "Indexer cluster upgrade started",
            all_peers_kv_record.id,
            len(peers_by_site.site_to_peers[site]),
            TelemetryStatus.IN_PROGRESS,
            TelemetryDeploymentType.INDEXER_CLUSTER,
            site,
            "No failure",
            all_peers_kv_record.from_version,
            all_peers_kv_record.to_version,
        )
        logger.info(telemetry_log)


def log_cluster_telemetry_failed_upgrade(
    site: str, tot_peers: int, reason: str, all_peers_kv_record: Optional[KvUpgradeIdxPeersProgress]
):
    upgrade_id = all_peers_kv_record.id if all_peers_kv_record else -1
    from_version = all_peers_kv_record.from_version if all_peers_kv_record else "unknown"
    to_version = all_peers_kv_record.to_version if all_peers_kv_record else "unknown"
    telemetry_log = telemetry_idx_log(
        "Indexer cluster upgrade failed",
        upgrade_id,
        tot_peers,
        TelemetryStatus.FAILED,
        TelemetryDeploymentType.INDEXER_CLUSTER,
        site,
        reason,
        from_version,
        to_version,
    )
    logger.info(telemetry_log)


def log_cluster_telemetry_successful_upgrade(
    site: str, tot_peers: int, all_peers_kv_record: KvUpgradeIdxPeersProgress
):
    telemetry_log = telemetry_idx_log(
        "Indexer cluster upgrade finished",
        all_peers_kv_record.id,
        tot_peers,
        TelemetryStatus.SUCCESS,
        TelemetryDeploymentType.INDEXER_CLUSTER,
        site,
        "Finished with success",
        all_peers_kv_record.from_version,
        all_peers_kv_record.to_version,
    )
    logger.info(telemetry_log)
