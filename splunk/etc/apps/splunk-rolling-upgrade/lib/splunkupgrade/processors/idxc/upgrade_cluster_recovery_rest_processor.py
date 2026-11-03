import logging
from http import HTTPStatus

from splunkupgrade.data.idxc.kv_idx_current_upgrade_progress import KvIdxCurrentStatus
from splunkupgrade.data.idxc.kv_idx_peers_upgrade_progress import KvIdxPeersOverallStatus
from splunkupgrade.data.upgrade_endpoints_response import GenericResponse
from splunkupgrade.processors.base_processor import RestProcessorBase
from splunkupgrade.processors.common import create_generic_response_with_message_and_status
from splunkupgrade.upgrader.upgrader_indexer_utils import IndexerCurrentStatusUpdater
from splunkupgrade.utils.app_conf import RollingUpgradeConfig
from splunkupgrade.utils.constants import HTTPMethod
from splunkupgrade.utils.exceptions import ResponseSafeToPrintException
from splunkupgrade.utils.pid_utils import is_process_running
from splunkupgrade.utils.server_roles_mapper import ServerRolesMapper
from splunkupgrade.utils.splunk_service import SplunkService
from splunkupgrade.utils.types import JsonObject
from typing import Tuple, Optional

logger = logging.getLogger(__name__)


def handle_standalone_instance(service: SplunkService) -> Tuple[str, bool]:
    current = service.get_latest_idx_current_upgrade()
    if not current:
        return "No upgrade historical record found during standalone recovery", False
    if current.status != KvIdxCurrentStatus.IN_PROGRESS:
        return f"No upgrade record currently in progress: latest status = '{current.status}'", False
    if is_process_running(current.upgrader_pid):
        return (
            f"Pid = '{current.upgrader_pid}' is currently performing an upgrade from "
            f"version = '{current.from_version}' to version = '{current.to_version}'"
        ), True
    curr_server_version = str(service.get_server_info().version)
    if current.to_version == curr_server_version:
        return (
            f"We upgraded already to the right version. " f"server = '{curr_server_version}'"
        ), False
    IndexerCurrentStatusUpdater(service).update_upgrade_status_to(KvIdxCurrentStatus.FAILED)
    return "Recovery done", True


def handle_indexer_cluster_peers(service: SplunkService) -> str:
    current = service.get_latest_idx_peers_upgrade()
    if not current:
        return "No upgrade historical record found during cluster peers recovery"
    if current.overall_status != KvIdxPeersOverallStatus.IN_PROGRESS:
        return (
            f"No upgrade record currently in progress: latest status = '{current.overall_status}'"
        )
    if is_process_running(current.orchestrator_pid):
        return (
            f"Pid = '{current.orchestrator_pid}' is currently upgrading peers from "
            f"version = '{current.from_version}' to version = '{current.to_version}'"
        )
    current.overall_status = KvIdxPeersOverallStatus.FAILED
    service.update_idx_peers_upgrade_progress(current)
    return "Recovery done for all peers"


def handle_indexer_cluster(service: SplunkService) -> str:
    standalone_resp_message, should_not_recovery_peers = handle_standalone_instance(service)
    if should_not_recovery_peers:
        return standalone_resp_message

    logger.info(standalone_resp_message)
    return handle_indexer_cluster_peers(service)


class UpgradeClusterRecoveryRestProcessor(RestProcessorBase):
    UNSUPPORTED_INSTANCE_TYPE = "Unsupported instance type"

    def __init__(self, service: Optional[SplunkService] = None):
        super().__init__("/upgrade/cluster/recovery", "cluster", [HTTPMethod.POST.value], service)

    def _allow_deprecated_checksum(self) -> bool:
        return True

    def _process(self, request: JsonObject) -> GenericResponse:
        assert self._splunk_service is not None
        role_mapper = ServerRolesMapper(self._splunk_service.get_server_roles())
        if role_mapper.is_standalone_indexer() or role_mapper.is_isolated_license_manager():
            message, _ = handle_standalone_instance(self._splunk_service)
        elif role_mapper.is_cluster_manager():
            message = handle_indexer_cluster(self._splunk_service)
        else:
            message = UpgradeClusterRecoveryRestProcessor.UNSUPPORTED_INSTANCE_TYPE
            raise ResponseSafeToPrintException(message, HTTPStatus.NOT_IMPLEMENTED)
        return create_generic_response_with_message_and_status(HTTPStatus.OK, message)

    def _validate_config(self, config: RollingUpgradeConfig) -> None:
        pass
