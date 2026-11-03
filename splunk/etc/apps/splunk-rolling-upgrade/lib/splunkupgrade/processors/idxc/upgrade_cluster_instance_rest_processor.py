import logging
import os.path
from typing import Optional, Tuple
from http import HTTPStatus

from packaging.version import Version

from splunkupgrade.data.upgrade_endpoints_response import GenericResponse
from splunkupgrade.processors.base_processor import RestProcessorBase, get_field_from_list
from splunkupgrade.utils.types import JsonObject
from splunkupgrade.utils.constants import (
    GeneralConstants,
    KV_STORE_NOT_READY,
    UNSUPPORTED_INSTANCE,
    HTTPMethod,
)
from splunkupgrade.utils.exceptions import ResponseSafeToPrintException
from splunkupgrade.utils.pid_utils import is_process_running
from splunkupgrade.utils.server_roles_mapper import ServerRolesMapper
from splunkupgrade.utils.splunk_service import SplunkService
from splunkupgrade.data.idxc.kv_idx_current_upgrade_progress import (
    KvIdxCurrentStatus,
    KvUpgradeIdxCurrentProgress,
)
import time
import sys
from subprocess import DEVNULL, Popen
from splunkupgrade.processors.common import (
    get_auth_token,
    get_rest_uri,
    get_servername,
    create_generic_response_with_message_status_and_pid,
)
from splunkupgrade.utils.version_extractor import get_version
from splunkupgrade.downloader.downloader import (
    is_package_path_valid,
    retrieve_new_splunk_package_path,
)
from splunkupgrade.upgrader.upgrader_indexer_utils import fail_status
from splunkupgrade.data.shc.kv_store_status import KvStoreStatus
from splunkupgrade.data.parsing import to_version, DataParseException
from splunkupgrade.utils.exceptions import InvalidEndpointParameter

from splunkupgrade.utils.server_conf import ServerConfig, ManagerSwitchoverMode
from splunkupgrade.utils.utils import get_path_or_none

logger = logging.getLogger(__name__)


class UpgradeClusterInstanceRestProcessor(RestProcessorBase):
    def __init__(
        self,
        upgrader_path: Optional[str] = None,
        atom_prefix: str = "/upgrade/cluster/instance",
        service: Optional[SplunkService] = None,
    ):
        super().__init__(atom_prefix, "cluster", [HTTPMethod.POST.value], service)
        self._upgrader_path = upgrader_path
        if not self._upgrader_path and GeneralConstants.SPLUNK_HOME in os.environ:
            self._upgrader_path = os.path.join(
                os.environ[GeneralConstants.SPLUNK_HOME],
                GeneralConstants.IDX_UPGRADER_RELATIVE_PATH,
            )

    def _process(self, request: JsonObject) -> GenericResponse:
        assert self._splunk_service is not None
        assert self._config is not None
        assert self._config.downloader_config.package_path is not None
        kv_store_status = self._splunk_service.get_kv_store_status()
        if not kv_store_status == KvStoreStatus.READY:
            raise ResponseSafeToPrintException(KV_STORE_NOT_READY, HTTPStatus.SERVICE_UNAVAILABLE)

        mapper = ServerRolesMapper(self._splunk_service.get_server_roles())
        assert self._upgrader_path is not None
        error_code, msg = self._is_upgradable(mapper, self._upgrader_path)
        if error_code != HTTPStatus.OK:
            raise ResponseSafeToPrintException(msg, error_code)

        servername = get_servername(request)
        token = get_auth_token(request)
        uri = get_rest_uri(request)
        target_version = None
        requires_full_package_version_check = (
            mapper.is_cluster_manager()
            or mapper.is_standalone_indexer()
            or mapper.is_isolated_license_manager()
        )

        if requires_full_package_version_check:
            if is_upgrade_in_progress(self._splunk_service):
                msg = "Upgrade already in progress - failed to start a new one"
                raise ResponseSafeToPrintException(msg, HTTPStatus.SERVICE_UNAVAILABLE)

            version = self._get_version()
            if not is_upgrade_needed(self._splunk_service, version):
                msg = f"Upgrade not needed. Instance is already running a version higher than or equal to {version}"
                raise ResponseSafeToPrintException(msg, HTTPStatus.SERVICE_UNAVAILABLE)

            self._add_upgrade_record(version)
        else:
            # cluster peers
            if not is_package_path_valid(self._config.downloader_config.package_path):
                msg = f"Configuration error: Invalid package path='{self._config.downloader_config.package_path}' specified"
                raise ResponseSafeToPrintException(msg, HTTPStatus.SERVICE_UNAVAILABLE)
            target_version = get_to_version_from_request(request)
            if target_version:
                logger.info(f"Extracted to_version from request: {target_version}")
                if not is_upgrade_needed(self._splunk_service, target_version):
                    msg = (
                        f"Upgrade not needed. Instance is already running a version higher than or equal to "
                        f"{target_version}"
                    )
                    raise ResponseSafeToPrintException(msg, HTTPStatus.SERVICE_UNAVAILABLE)

        cmd = [
            sys.executable,
            self._upgrader_path,
            "--peer_name",
            servername,
            "--rest_uri",
            uri,
            "--session_key",
            token,
        ]
        if target_version is not None:
            cmd.extend(["--to_version", str(target_version)])
        logger.info(f"Running script='{self._upgrader_path}'")
        try:
            # Safe here: launches a fixed internal Python script with shell=False and no user-selected executable.
            proc = Popen(  # nosemgrep
                cmd, stdin=DEVNULL, stdout=DEVNULL, stderr=DEVNULL, close_fds=True
            )
        except OSError as e:
            logger.error(f"Failed to create process: {e}")
            if requires_full_package_version_check:
                fail_status(self._splunk_service)
            raise ResponseSafeToPrintException(
                "Failed to create indexer upgrader process", HTTPStatus.SERVICE_UNAVAILABLE
            )

        response = create_generic_response_with_message_status_and_pid(
            HTTPStatus.OK, proc.pid, f"Instance upgrade initiated"
        )
        return response

    def _add_upgrade_record(self, to_version: Version) -> None:
        assert self._splunk_service is not None
        server_info = self._splunk_service.get_server_info()
        upgrade_record = create_idx_current_record(
            self._splunk_service, str(server_info.version), str(to_version)
        )
        self._splunk_service.add_idx_current_upgrade(upgrade_record)

    def _get_version(self) -> Version:
        assert self._config is not None
        package = retrieve_new_splunk_package_path(self._config.downloader_config)
        return get_version(package, self._config.proces_runner_config.timeout)

    @staticmethod
    def _is_upgradable(mapper: ServerRolesMapper, upgrader_path: str) -> Tuple[HTTPStatus, str]:
        if GeneralConstants.SPLUNK_HOME not in os.environ:
            msg = "SPLUNK_HOME environmental variable is not set"
            return HTTPStatus.SERVICE_UNAVAILABLE, msg

        if not os.path.isfile(upgrader_path):
            msg = f"Upgrader script path='{upgrader_path}' does not exist"
            return HTTPStatus.SERVICE_UNAVAILABLE, msg

        if not is_idx_peer_upgradable(mapper):
            return HTTPStatus.SERVICE_UNAVAILABLE, UNSUPPORTED_INSTANCE
        if is_cluster_manager_redundancy_enabled(mapper):
            return HTTPStatus.SERVICE_UNAVAILABLE, "Upgrade not allowed - CM redundancy enabled"
        return HTTPStatus.OK, "Pre-checks passed"


def is_cluster_manager_redundancy_enabled(mapper) -> bool:
    if mapper.is_cluster_manager():
        server_config = ServerConfig()
        manager_switchover_mode = server_config.cm_redundancy_config.manager_switchover_mode
        return (
            manager_switchover_mode == ManagerSwitchoverMode.AUTO.value
            or manager_switchover_mode == ManagerSwitchoverMode.MANUAL.value
        )
    return False


def is_idx_peer_upgradable(role_mapper: ServerRolesMapper) -> bool:
    return (
        role_mapper.is_standalone_indexer()
        or role_mapper.is_cluster_manager()
        or role_mapper.is_cluster_peer()
        or role_mapper.is_isolated_license_manager()
    )


def create_idx_current_record(
    service: SplunkService, from_version: str, to_version: str
) -> KvUpgradeIdxCurrentProgress:
    last_upgrade = service.get_latest_idx_current_upgrade()
    next_upgrade_id = last_upgrade.id + 1 if last_upgrade else 0
    return KvUpgradeIdxCurrentProgress(
        time.time(),
        os.getpid(),
        from_version,
        to_version,
        KvIdxCurrentStatus.IN_PROGRESS,
        next_upgrade_id,
    )


def is_upgrade_in_progress(service: SplunkService) -> bool:
    latest_upgrade = service.get_latest_idx_current_upgrade()
    return (
        latest_upgrade is not None
        and latest_upgrade.status == KvIdxCurrentStatus.IN_PROGRESS
        and latest_upgrade.upgrader_pid != 0
        and is_process_running(latest_upgrade.upgrader_pid)
    )


def is_upgrade_needed(service: SplunkService, to_version: Version) -> bool:
    server_info = service.get_server_info()
    return server_info.version < to_version


def get_to_version_from_request(request: JsonObject) -> Optional[Version]:
    query = get_path_or_none(request, GeneralConstants.QUERY)
    if not query:
        return None
    str_to_version = get_field_from_list(query, GeneralConstants.TO_VERSION)
    if str_to_version is None:
        return None
    try:
        return to_version(str_to_version)
    except DataParseException as e:
        raise InvalidEndpointParameter(
            f"Invalid parameter to_version specified '{str_to_version}'"
        ) from e
