import logging
import subprocess
import time
from dataclasses import dataclass
from typing import Callable, Optional
from typing import List

from splunkupgrade.data.shc.kv_upgrade_progress import KvUpgradeProgress
from splunkupgrade.data.shc.kv_upgrade_progress import SummaryKvUpgradeProgress
from splunkupgrade.data.shc.kv_upgrade_progress_peer import KvUpgradePeerStep, KvUpgradeProgressPeer
from splunkupgrade.utils.constants import GeneralConstants
from splunkupgrade.utils.exceptions import (
    NoUpgradeRecordFound,
    UndefinedEnvVariableException,
    UpgraderException,
)
from splunkupgrade.utils.server_roles_mapper import ServerRolesMapper
from splunkupgrade.utils.splunk_service import (
    SplunkService,
    SplunkServiceException,
)
from splunkupgrade.utils.utils import get_splunkd_path, get_env_variable
from splunkupgrade.utils.app_conf import (
    RollingUpgradeConfig,
)

logger = logging.getLogger(__name__)


@dataclass
class UpgraderConfig:
    peer_name: str
    trigger_file: str
    app_config: RollingUpgradeConfig


@dataclass
class IndexerUpgraderConfig:
    peer_name: str
    app_config: RollingUpgradeConfig
    auth_token: str


@dataclass
class CmdArg:
    argument: str
    sensitive: bool = False

    def __str__(self):
        return "*" * len(self.argument) if self.sensitive else self.argument

    def __repr__(self):
        return str(self)


def log_process_outputs(
    stdout: Optional[bytes], stderr: Optional[bytes], stdout_level: int
) -> None:
    if stdout:
        logger.log(stdout_level, f"Process output: {stdout.decode('utf-8')}")
    if stderr:
        logger.error(f"Process errors: {stderr.decode('utf-8')}")


class StatusUpdater:
    def __init__(
        self, service: SplunkService, upgrade_progress: Optional[KvUpgradeProgress] = None
    ):
        self._service = service
        if not upgrade_progress:
            upgrade_progress = service.get_latest_upgrade()
            if not upgrade_progress:
                raise NoUpgradeRecordFound("Upgrade records do not exist in kv store")
        self._current_progress = upgrade_progress

    def _get_peer_by_name(self, name: str) -> KvUpgradeProgressPeer:
        peer = next(
            (
                value
                for index, value in enumerate(self._current_progress.peers)
                if value.name == name
            ),
            None,
        )
        if not peer:
            raise SplunkServiceException(f"Error when upgrading peer='{name}'")
        return peer

    def _update_and_push(
        self, name: str, updater: Callable[[KvUpgradeProgressPeer], None]
    ) -> KvUpgradeProgress:
        peer = self._get_peer_by_name(name)
        updater(peer)
        peer.timestamp = time.time()
        self._service.update_upgrade_progress(self._current_progress)
        return self._current_progress

    def update_peer_upgrader_pid_to(self, name: str, pid: int) -> KvUpgradeProgress:
        logger.info(f"Setting upgrader_pid='{pid}' for peer='{name}'")

        def update_upgrader_pid(peer: KvUpgradeProgressPeer):
            peer.upgrader_pid = pid

        return self._update_and_push(name, update_upgrader_pid)

    def update_peer_completion_pid_to(self, name: str, pid: int) -> KvUpgradeProgress:
        logger.info(f"Setting completion_pid='{pid}' for peer='{name}'")

        def update_completion_pid(peer: KvUpgradeProgressPeer):
            peer.completion_pid = pid

        return self._update_and_push(name, update_completion_pid)

    def update_peer_status_to(self, name: str, status: KvUpgradePeerStep) -> KvUpgradeProgress:
        logger.info(f"Setting status='{status.value}' for peer='{name}'")

        def update_status(peer: KvUpgradeProgressPeer):
            peer.status = status

        return self._update_and_push(name, update_status)

    def get_current_progress(self) -> KvUpgradeProgress:
        return self._current_progress

    def update_upgrade_status_to(self, status: SummaryKvUpgradeProgress) -> KvUpgradeProgress:
        logger.info(f"Setting overall upgrade status='{status.value}'")
        self._current_progress.status = status
        self._service.update_upgrade_progress(self._current_progress)
        return self._current_progress


def execute_child_command(cmd: List[CmdArg], timeout: int) -> bytes:
    logger.info(f"Running {cmd}")
    try:
        result = subprocess.run(
            [arg.argument for arg in cmd],
            timeout=timeout,
            check=True,
            cwd=get_env_variable(GeneralConstants.SPLUNK_HOME),
            capture_output=True,
        )
        log_process_outputs(result.stdout, result.stderr, logging.DEBUG)
        logger.info(f"Finished running {cmd}")
        return result.stdout
    except TypeError as e:
        error = f"'{cmd}' has invalid type='{e}'"
        logger.error(error)
        raise UpgraderException(error)
    except FileNotFoundError as e:
        error = f"'{cmd}' does not exist: path='{e}'"
        logger.error(error)
        raise UpgraderException(error)
    except subprocess.CalledProcessError as e:
        log_process_outputs(e.stdout, e.stderr, logging.INFO)
        error = f"'{cmd}' exited with return code='{e.returncode}': error='{e}'"
        logger.error(error)
        raise UpgraderException(error)
    except subprocess.TimeoutExpired as e:
        log_process_outputs(e.stdout, e.stderr, logging.INFO)
        error = f"'{cmd}' timed out after '{timeout}' seconds: error='{e}'"
        logger.error(error)
        raise UpgraderException(error)
    except UndefinedEnvVariableException as e:
        raise UpgraderException(f"Can't run {cmd}. {str(e)}")


def stop_splunk(control_script: str, timeout: int) -> None:
    try:
        logger.info("Stopping splunk")
        execute_child_command(
            [CmdArg(control_script), CmdArg(get_splunkd_path()), CmdArg("stop")], timeout
        )
        logger.info("Splunk stopped successfully")
    except UndefinedEnvVariableException as e:
        raise UpgraderException(f"Cannot stop Splunk: {e}")


def splunk_offline(control_script: str, timeout: int, auth_token: str) -> None:
    try:
        logger.info("Splunk offline")
        execute_child_command(
            [
                CmdArg(control_script),
                CmdArg(get_splunkd_path()),
                CmdArg("offline"),
                CmdArg(auth_token, True),
            ],
            timeout,
        )
        logger.info("Splunk offline successfully executed")
    except UndefinedEnvVariableException as e:
        raise UpgraderException(f"Cannot stop Splunk: {e}")


def start_splunk(control_script: str, timeout: int) -> None:
    try:
        logger.info("Starting splunk")
        execute_child_command(
            [CmdArg(control_script), CmdArg(get_splunkd_path()), CmdArg("start")],
            timeout,
        )
        logger.info("Splunk started successfully")
    except UndefinedEnvVariableException as e:
        raise UpgraderException(f"Cannot start Splunk: {e}")


def try_fail_upgrade(service: SplunkService) -> None:
    try:
        status_updater = StatusUpdater(service)
        status_updater.update_upgrade_status_to(SummaryKvUpgradeProgress.FAILED)
    except (NoUpgradeRecordFound, SplunkServiceException) as e:
        logger.error(f"Failed to set the fail status: {e}")


# TODO: we might add more checks in here, and see if we need this function to be a full class.
def is_peer_upgradable(role_mapper: ServerRolesMapper) -> bool:
    return (
        role_mapper.is_standalone_search_head()
        or role_mapper.is_shc_peer()
        or role_mapper.is_deployer_only()
    )
