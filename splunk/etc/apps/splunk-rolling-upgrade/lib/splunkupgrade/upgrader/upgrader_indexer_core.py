import logging

from packaging.version import Version
from typing import Optional

from splunkupgrade.data.idxc.kv_idx_current_upgrade_progress import (
    KvIdxCurrentStatus,
    KvUpgradeIdxCurrentProgress,
)
from splunkupgrade.upgrader.upgrader_core import download_package, install_package
from splunkupgrade.upgrader.upgrader_indexer_utils import (
    IndexerCurrentStatusUpdater,
    fail_status,
    validate_package_version,
    log_single_instance_telemetry_start_upgrade,
    log_single_instance_telemetry_successful_upgrade,
    log_single_instance_telemetry_failed_upgrade,
    TelemetryData,
)
from splunkupgrade.upgrader.upgrader_utils import (
    IndexerUpgraderConfig,
    start_splunk,
    stop_splunk,
    splunk_offline,
)
from splunkupgrade.utils.constants import ExitCodes
from splunkupgrade.utils.server_roles_mapper import ServerRolesMapper
from splunkupgrade.utils.splunk_service import SplunkService


logger = logging.getLogger(__name__)


def execute_splunk_indexer_upgrade(
    service: SplunkService, config: IndexerUpgraderConfig, to_version: Optional[str]
) -> ExitCodes:
    mapper = ServerRolesMapper(service.get_server_roles())
    if (
        mapper.is_standalone_indexer()
        or mapper.is_cluster_manager()
        or mapper.is_isolated_license_manager()
    ):
        return execute_non_clustered_indexer_upgrade(service, config)
    elif mapper.is_cluster_peer():
        return execute_clustered_indexer_upgrade(config, to_version)
    else:
        logger.error(
            f"Peer='{config.peer_name}' does not support a rolling upgrade. Only indexers are allowed"
        )
        return ExitCodes.UNSUPPORTED_UPGRADE


def execute_non_clustered_indexer_upgrade(service: SplunkService, config: IndexerUpgraderConfig):
    def extract_telemetry_data(
        kv: KvUpgradeIdxCurrentProgress, srv: SplunkService
    ) -> TelemetryData:
        return TelemetryData(
            kv.id, TelemetryData.get_deployment_type(srv), kv.from_version, kv.to_version
        )

    telemetry = TelemetryData()

    try:
        logger.info(f"Starting upgrade for {config.peer_name}")
        status_updater = IndexerCurrentStatusUpdater(service)
        status_updater.update_pid()
        current_progress = status_updater.get_current_progress()

        package_info = download_package(config.app_config)
        logger.info(f"Package currently downloaded: {package_info}")
        if package_info.version != Version(current_progress.to_version):
            msg = (
                f"Expected to upgrade to '{current_progress.to_version}',"
                f"but current config specifies a package with version '{package_info.version}'"
            )
            raise Exception(msg)

        telemetry = extract_telemetry_data(current_progress, service)
        log_single_instance_telemetry_start_upgrade(telemetry)

        status_updater.update_upgrade_status_to(KvIdxCurrentStatus.IN_PROGRESS)

        stop_splunk(
            config.app_config.hook_config.control_script_path,
            config.app_config.proces_runner_config.timeout,
        )
        install_package(config.app_config, package_info)
        start_splunk(
            config.app_config.hook_config.control_script_path,
            config.app_config.proces_runner_config.timeout,
        )
        logger.info(f"Upgrade completed for {config.peer_name}")
        log_single_instance_telemetry_successful_upgrade(telemetry)
        return ExitCodes.OK
    except Exception as e:
        msg = f"Error when upgrading peer='{config.peer_name}', error='{e}'"
        logger.error(msg)
        fail_status(service)
        log_single_instance_telemetry_failed_upgrade("Error when upgrading peer", telemetry)
        return ExitCodes.ERROR_WHEN_UPGRADING


def execute_clustered_indexer_upgrade(config: IndexerUpgraderConfig, to_version: Optional[str]):
    try:
        logger.info(f"Starting upgrade for {config.peer_name}")
        package_info = download_package(config.app_config)
        logger.info(f"Package currently downloaded: {package_info}")
        validate_package_version(package_info.version, to_version)
        splunk_offline(
            config.app_config.hook_config.control_script_path,
            config.app_config.proces_runner_config.timeout,
            config.auth_token,
        )
        install_package(config.app_config, package_info)
        start_splunk(
            config.app_config.hook_config.control_script_path,
            config.app_config.proces_runner_config.timeout,
        )
        logger.info(f"Upgrade completed for {config.peer_name}")
        return ExitCodes.OK
    except Exception as e:
        msg = f"Error when upgrading peer='{config.peer_name}', error='{e}'"
        logger.error(msg)
        return ExitCodes.ERROR_WHEN_UPGRADING
