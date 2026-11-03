import logging
import os

from retry import retry

from packaging.version import Version
from splunkupgrade.utils.app_conf import KVStoreRetryConfig, ClusterRetryConfig
from splunkupgrade.data.shc.kv_store_status import KvStoreStatus
from splunkupgrade.data.shc.kv_upgrade_progress import SummaryKvUpgradeProgress
from splunkupgrade.data.shc.kv_upgrade_progress_peer import KvUpgradePeerStep
from splunkupgrade.upgrader.telemetry_utils import (
    TelemetryStatus,
    role_to_telemetry_deployment_type,
    telemetry_shc_log,
)
from splunkupgrade.upgrader.upgrader_utils import (
    StatusUpdater,
    UpgraderConfig,
)
from splunkupgrade.utils.constants import KV_STORE_NOT_READY
from splunkupgrade.utils.server_roles_mapper import ServerRolesMapper
from splunkupgrade.utils.splunk_service import SplunkService
from splunkupgrade.utils.status_utils import (
    are_all_peers_upgraded,
    find_next_peer_for_upgrade,
    is_cluster_ready_for_upgrade,
)

logger = logging.getLogger(__name__)


def wait_kv_store_ready(service: SplunkService, retry_config: KVStoreRetryConfig) -> bool:
    attempt = 0

    @retry(
        Exception,
        tries=retry_config.max_tries,
        delay=retry_config.initial_delay_after_each_retry,
    )
    def wait_for_kv_store():
        nonlocal attempt
        attempt += 1
        status = service.get_kv_store_status()
        if status != KvStoreStatus.READY:
            raise Exception(f"Kv store is still not ready after '{attempt}' attempt(s)")

    try:
        wait_for_kv_store()
    except Exception as e:
        logger.error(str(e))
        return False
    return True


def wait_cluster_readiness(service: SplunkService, retry_config: ClusterRetryConfig) -> bool:
    attempt = 0

    @retry(
        Exception,
        tries=retry_config.max_tries,
        delay=retry_config.initial_delay_after_each_retry,
    )
    def wait_for_cluster():
        nonlocal attempt
        attempt += 1
        status = service.get_shcluster_info()
        is_ready, reason = is_cluster_ready_for_upgrade(status)
        if not is_ready:
            raise Exception(
                f"Shc is still not ready after '{attempt}' attempt(s): reason='{reason}'"
            )

    try:
        wait_for_cluster()
    except Exception as e:
        logger.error(str(e))
        return False
    return True


class UpgradeCompletionBase:
    def __init__(self, service: SplunkService, config: UpgraderConfig):
        self._service = service
        self._config = config
        self._id = None

    def should_run(self) -> bool:
        logger.info("Waiting for kv store")
        if not wait_kv_store_ready(self._service, self._config.app_config.kv_store_retry_config):
            logger.error(KV_STORE_NOT_READY)
            return False
        logger.info("Kv store is back online")

        latest_upgrade = self._service.get_latest_upgrade()
        if not latest_upgrade or latest_upgrade.status != SummaryKvUpgradeProgress.IN_PROGRESS:
            logger.error("Rolling upgrade failed on earlier steps or does not exist")
            return False

        server_info = self._service.get_server_info()
        if Version(latest_upgrade.to_version) != server_info.version:
            logger.error(
                f"Expected to upgrade to {latest_upgrade.to_version}, but Splunk is at version {server_info.version}"
            )
            return False
        return True


class StandaloneUpgradeCompletion(UpgradeCompletionBase):
    def complete_upgrade(self) -> bool:
        logger.info("Running StandaloneUpgradeCompletion.complete_upgrade()")
        if not self.should_run():
            logger.info("Not running the upgrade")
            return False

        updater = StatusUpdater(self._service)
        updater.update_peer_completion_pid_to(self._config.peer_name, os.getpid())
        updater.update_peer_status_to(self._config.peer_name, KvUpgradePeerStep.UPGRADED)
        updater.update_upgrade_status_to(SummaryKvUpgradeProgress.COMPLETED)
        progress = updater.get_current_progress()
        logger.info(
            telemetry_shc_log(
                "SHC Rolling Upgrade done",
                progress.id,
                [p.name for p in progress.peers],
                TelemetryStatus.SUCCESS,
                role_to_telemetry_deployment_type(
                    ServerRolesMapper(self._service.get_server_roles())
                ),
                "No failure",
                progress.from_version,
                progress.to_version,
            )
        )
        logger.info("Deployer upgrade done")
        return True


class UpgradeCompletion(UpgradeCompletionBase):
    def complete_upgrade(self) -> bool:
        logger.info("Running UpgradeCompletion.complete_upgrade()")
        if not self.should_run():
            logger.info("Not running the upgrade")
            return False

        updater = StatusUpdater(self._service)
        updater.update_peer_completion_pid_to(self._config.peer_name, os.getpid())
        updater.update_peer_status_to(self._config.peer_name, KvUpgradePeerStep.SPLUNK_STARTED)
        self._service.set_shcluster_disable_detention_mode()

        logger.info("Waiting for cluster to be ready to continue the rolling upgrade")
        if not wait_cluster_readiness(self._service, self._config.app_config.cluster_retry_config):
            logger.error("Cluster is not ready")
            return False
        logger.info("SHC is ready to continue with the rolling upgrade")

        cluster_status = self._service.get_shcluster_info()
        if not cluster_status.captain.rolling_upgrade:
            logger.error("No rolling upgrade in progress")
            return False

        updater.update_peer_status_to(self._config.peer_name, KvUpgradePeerStep.UPGRADED)
        progress = updater.get_current_progress()
        if are_all_peers_upgraded(progress):
            self._service.finalize_upgrade()
            updater.update_upgrade_status_to(SummaryKvUpgradeProgress.COMPLETED)
            logger.info(
                telemetry_shc_log(
                    "SHC Rolling Upgrade done",
                    progress.id,
                    [p.name for p in progress.peers],
                    TelemetryStatus.SUCCESS,
                    role_to_telemetry_deployment_type(
                        ServerRolesMapper(self._service.get_server_roles())
                    ),
                    "No failure",
                    progress.from_version,
                    progress.to_version,
                )
            )
            logger.info("Upgrade done")
        else:
            next_peer = find_next_peer_for_upgrade(cluster_status, progress)
            logger.info(f"Next peer for upgrade is {next_peer}")
            self._service.upgrade_shc_member_by_name(next_peer)
        return True
