import logging
import os
from dataclasses import dataclass
from typing import Tuple, Union, Optional
from urllib.parse import urlparse
from retry import retry

from splunkupgrade.cli.parser import UpgraderCommandLineParser
from splunkupgrade.data.shc.kv_upgrade_progress_peer import KvUpgradePeerStep
from splunkupgrade.downloader.downloader import (
    retrieve_new_splunk_package_path,
)
from splunkupgrade.upgrader.upgrader_utils import (
    CmdArg,
    StatusUpdater,
    UpgraderConfig,
    execute_child_command,
    start_splunk,
    stop_splunk,
    try_fail_upgrade,
    is_peer_upgradable,
)
from splunkupgrade.utils.app_conf import RequestConfig
from splunkupgrade.utils.constants import ExitCodes, GeneralConstants
from splunkupgrade.utils.exceptions import (
    ImportNotFoundException,
    InvalidDownloaderConfigError,
    UpgraderException,
)
from splunkupgrade.utils.server_roles_mapper import ServerRolesMapper
from splunkupgrade.utils.splunk_service import SplunkService, SplunkServiceException
from splunkupgrade.utils.version_extractor import get_version
from splunkupgrade.utils.utils import get_env_variable

from splunkupgrade.upgrader.telemetry_utils import (
    TelemetryStatus,
    telemetry_shc_log,
    role_to_telemetry_deployment_type,
    TELEMETRY_VERSION_UNKNOWN,
)
from packaging.version import Version
from splunkupgrade.utils.app_conf import (
    RollingUpgradeConfig,
)

logger = logging.getLogger(__name__)


@dataclass
class PackageInfo:
    version: Version
    local_path: str
    original_config_path: str


def parse_command_line() -> Tuple[str, str, str, Optional[str]]:
    cli = UpgraderCommandLineParser()
    peer_name = cli.peer_name()
    session_key = cli.session_key()
    rest_uri = cli.rest_uri()
    to_version = cli.to_version()
    logger.debug(f"Upgrading peer='{peer_name}' at uri='{rest_uri}'")
    return peer_name, session_key, rest_uri, to_version


def wait_for_peer_ready_to_upgrade(
    svc: SplunkService,
    config: UpgraderConfig,
) -> None:
    attempt = 0

    @retry(
        Exception,
        tries=config.app_config.peer_readiness_retry_config.max_tries,
        delay=config.app_config.peer_readiness_retry_config.initial_delay_after_each_retry,
    )
    def wait_for_running_searches():
        nonlocal attempt
        attempt += 1
        try:
            info = svc.get_shcluster_member_info()
            # NOTE: the official documentation for manual rolling upgrade says we should wait for real-time
            #       searches as well, however real-time searches don't really end, so we can safely ignore them.
            if info.active_historical_search_count > 0:
                raise Exception()
        except Exception:
            raise UpgraderException(
                f"Tried already '{attempt}' time(s), but we still have running searches"
            )

    wait_for_running_searches()
    logger.info(f"All searches completed for peer='{config.peer_name}'")


def create_splunk_service(
    session_key: str, rest_uri: str, config: RequestConfig
) -> Union[SplunkService, None]:
    try:
        parsed_uri = urlparse(rest_uri)
        if not parsed_uri.hostname or not parsed_uri.port:
            logger.error(f"Error when parsing rest_uri='{rest_uri}'")
            return None
        return SplunkService.from_session_key(
            parsed_uri.hostname, parsed_uri.port, session_key, config
        )
    except SplunkServiceException as e:
        logger.error(f"Error when creating a SplunkService object, error={e}")
        return None


def download_package(config: RollingUpgradeConfig) -> PackageInfo:
    local_path = retrieve_new_splunk_package_path(config.downloader_config)
    assert config.downloader_config.package_path and config.downloader_config.checksum
    version = get_version(local_path, config.proces_runner_config.timeout)
    return PackageInfo(version, local_path, config.downloader_config.package_path)


def update_kvstore_with_upgrader_pid(status_updater: StatusUpdater, peer: str) -> None:
    pid = os.getpid()
    status_updater.update_peer_upgrader_pid_to(peer, pid)


def install_package(config: RollingUpgradeConfig, package_info: PackageInfo) -> None:
    try:
        execute_child_command(
            [
                CmdArg(config.hook_config.install_script_path),
                CmdArg(package_info.local_path),
                CmdArg(get_env_variable(GeneralConstants.SPLUNK_HOME)),
            ],
            config.proces_runner_config.timeout,
        )
    except (ImportNotFoundException, InvalidDownloaderConfigError) as e:
        raise UpgraderException(e)


def create_trigger_file(config: UpgraderConfig) -> None:
    logger.info(f"Creating trigger file at path='{config.trigger_file}'")
    open(config.trigger_file, "a").close()


# Main routine implementing SHC rolling upgrade.
def execute_splunk_upgrade(service: SplunkService, config: UpgraderConfig) -> ExitCodes:
    status_updater = None
    peer = config.peer_name
    upgrade_id = -1
    from_version = TELEMETRY_VERSION_UNKNOWN
    to_version = TELEMETRY_VERSION_UNKNOWN
    mapper = None
    try:
        status_updater = StatusUpdater(service)
        current_progress = status_updater.get_current_progress()
        upgrade_id = current_progress.id
        from_version = current_progress.from_version
        to_version = current_progress.to_version
        update_kvstore_with_upgrader_pid(status_updater, peer)
        mapper = ServerRolesMapper(service.get_server_roles())
        if not is_peer_upgradable(mapper):
            logger.error(
                f"Peer='{peer}' does not support a rolling upgrade. Only SHC members and deployers allowed"
            )
            return ExitCodes.UNSUPPORTED_UPGRADE

        package_info = download_package(config.app_config)
        if package_info.version != Version(to_version):
            msg = (
                f"Expected to upgrade to '{to_version}',"
                f"but current config specifies a package with version '{package_info.version}'"
            )
            raise Exception(msg)

        if mapper.is_shc_peer():
            service.set_shcluster_enable_detention_mode()
            status_updater.update_peer_status_to(
                config.peer_name, KvUpgradePeerStep.MANUAL_DETENTION_ON
            )
            wait_for_peer_ready_to_upgrade(
                service,
                config,
            )
        status_updater.update_peer_status_to(config.peer_name, KvUpgradePeerStep.READY_FOR_INSTALL)

        stop_splunk(
            config.app_config.hook_config.control_script_path,
            config.app_config.proces_runner_config.timeout,
        )
        install_package(config.app_config, package_info)
        create_trigger_file(config)
        start_splunk(
            config.app_config.hook_config.control_script_path,
            config.app_config.proces_runner_config.timeout,
        )
    except Exception as e:
        msg = (
            f"Error when upgrading peer='{peer}', upgrade id='{upgrade_id}', error='{e}'"
            if status_updater
            else f"Error when upgrading peer='{peer}', error='{e}'"
        )
        logger.error(msg)
        logger.error(
            telemetry_shc_log(
                "SHC Rolling Upgrade failed",
                upgrade_id,
                [peer],
                TelemetryStatus.FAILED,
                role_to_telemetry_deployment_type(mapper),
                "Error when upgrading SHC peer",
                from_version,
                to_version,
            )
        )
        try_fail_upgrade(service)
        return ExitCodes.ERROR_WHEN_UPGRADING
    return ExitCodes.OK
