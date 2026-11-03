import logging
import time
from typing import List, Optional
from http import HTTPStatus

from packaging.version import Version

from splunkupgrade.data.shc.kv_store_status import KvStoreStatus
from splunkupgrade.data.shc.kv_upgrade_progress import (
    KvUpgradeProgress,
    SummaryKvUpgradeProgress,
)
from splunkupgrade.data.shc.kv_upgrade_progress_peer import KvUpgradePeerStep, KvUpgradeProgressPeer
from splunkupgrade.data.server_info import ServerInfo, to_version
from splunkupgrade.data.shc.shc_status_peer import ShcStatusPeer
from splunkupgrade.data.upgrade_endpoints_response import (
    EndpointResponseStatus,
    GenericResponse,
)
from splunkupgrade.processors.base_processor import RestProcessorBase
from splunkupgrade.processors.common import (
    create_generic_response_with_message_and_status,
)
from splunkupgrade.utils.app_conf import RollingUpgradeConfig
from splunkupgrade.utils.constants import (
    SHC_UPGRADE_NOT_SUPPORTED_PEER,
    KV_STORE_NOT_READY,
    HTTPMethod,
)
from splunkupgrade.utils.exceptions import (
    UpgradeToHigherVersionThanCM,
    ResponseSafeToPrintException,
)
from splunkupgrade.utils.inputs_conf import InputsConfig
from splunkupgrade.utils.version_extractor import get_version
from splunkupgrade.upgrader.telemetry_utils import (
    TelemetryDeploymentType,
    TelemetryStatus,
    role_to_telemetry_deployment_type,
    telemetry_shc_log,
)
from splunkupgrade.downloader.downloader import (
    retrieve_new_splunk_package_path,
)
from splunkupgrade.utils.server_roles_mapper import ServerRolesMapper
from splunkupgrade.utils.splunk_service import SplunkService
from splunkupgrade.utils.status_utils import (
    are_all_peers_upgraded,
    find_next_peer_for_upgrade,
    is_cluster_ready_for_upgrade,
)
from splunkupgrade.utils.types import JsonObject

logger = logging.getLogger(__name__)


def create_kv_peer_content(peer: ServerInfo, new_version: Version) -> KvUpgradeProgressPeer:
    status = KvUpgradePeerStep.READY if new_version > peer.version else KvUpgradePeerStep.UPGRADED
    return KvUpgradeProgressPeer(name=peer.server_name, status=status, timestamp=time.time())


def create_kv_upgrade_content(
    peers: List[ServerInfo], upgrade_id: int, version: Version
) -> KvUpgradeProgress:
    transformed_peers = [create_kv_peer_content(peer, version) for peer in peers]
    from_version = min([peer.version for peer in peers])
    return KvUpgradeProgress(
        SummaryKvUpgradeProgress.IN_PROGRESS,
        upgrade_id,
        transformed_peers,
        str(from_version),
        str(version),
    )


def to_server_info_list(cluster_status_peers: List[ShcStatusPeer]) -> List[ServerInfo]:
    return [
        ServerInfo(to_version(status_peer.splunk_version), status_peer.label)
        for status_peer in cluster_status_peers
    ]


def get_upgrade_progress(
    service: SplunkService, version: Version, peers: List[ServerInfo]
) -> KvUpgradeProgress:
    latest_upgrade = service.get_latest_upgrade()
    upgrade_id = latest_upgrade.id + 1 if latest_upgrade else 0
    return create_kv_upgrade_content(peers, upgrade_id, version)


def is_upgrade_running(service: SplunkService) -> bool:
    latest_upgrade = service.get_latest_upgrade()
    status = latest_upgrade.status if latest_upgrade else None
    logger.info(f"Latest upgrade status='{status}'")
    logger.debug(f"Latest upgrade='{latest_upgrade}'")
    return status == SummaryKvUpgradeProgress.IN_PROGRESS


def determine_package_version(config: RollingUpgradeConfig) -> Version:
    package = retrieve_new_splunk_package_path(config.downloader_config)
    return get_version(package, config.proces_runner_config.timeout)


def process_for_standalone(
    service: SplunkService, config: RollingUpgradeConfig, roles: ServerRolesMapper
) -> GenericResponse:
    if is_upgrade_running(service):
        raise ResponseSafeToPrintException("Upgrade is already running", HTTPStatus.FORBIDDEN)

    version = determine_package_version(config)
    throw_if_higher_than_cm_version(service, roles, version)

    server_info = service.get_server_info()
    upgrade = get_upgrade_progress(service, version, [server_info])
    if are_all_peers_upgraded(upgrade):
        raise ResponseSafeToPrintException("No upgrade is needed", HTTPStatus.FORBIDDEN)
    logger.info(
        telemetry_shc_log(
            "Upgrading",
            upgrade.id,
            [p.name for p in upgrade.peers],
            TelemetryStatus.IN_PROGRESS,
            role_to_telemetry_deployment_type(roles),
            "No failure",
            upgrade.from_version,
            upgrade.to_version,
        )
    )

    service.add_upgrade_progress(upgrade)
    upgrade_member_response = service.upgrade_shc_member()
    if upgrade_member_response.status != EndpointResponseStatus.SUCCEEDED:
        raise ResponseSafeToPrintException(
            "Failed to initiate instance upgrade", HTTPStatus.INTERNAL_SERVER_ERROR
        )
    return create_generic_response_with_message_and_status(HTTPStatus.OK, "Upgrade initiated")


def process_for_shc_member(
    service: SplunkService, config: RollingUpgradeConfig, roles: ServerRolesMapper
) -> GenericResponse:
    cluster_status = service.get_shcluster_info()
    if cluster_status.captain.rolling_upgrade:
        message = "SHC has already begun rolling upgrade. Please wait for it to finish"
        raise ResponseSafeToPrintException(message, HTTPStatus.FORBIDDEN)

    is_cluster_ready, failure_reason = is_cluster_ready_for_upgrade(cluster_status)
    if not is_cluster_ready:
        message = f"SHC is not ready for the upgrade: reason='{failure_reason}'"
        raise ResponseSafeToPrintException(message, HTTPStatus.FORBIDDEN)

    version = determine_package_version(config)
    throw_if_higher_than_cm_version(service, roles, version)

    upgrade_progress = get_upgrade_progress(
        service, version, to_server_info_list(cluster_status.peers)
    )
    if are_all_peers_upgraded(upgrade_progress):
        raise ResponseSafeToPrintException("No upgrade is needed", HTTPStatus.FORBIDDEN)
    logger.info(
        telemetry_shc_log(
            "Upgrading",
            upgrade_progress.id,
            [p.name for p in upgrade_progress.peers],
            TelemetryStatus.IN_PROGRESS,
            TelemetryDeploymentType.SHC,
            "No failure",
            upgrade_progress.from_version,
            upgrade_progress.to_version,
        )
    )

    initiate_upgrade_response = service.initiate_upgrade()
    if not initiate_upgrade_response:
        raise ResponseSafeToPrintException(
            "Failed to initiate a rolling upgrade", HTTPStatus.INTERNAL_SERVER_ERROR
        )

    next_peer = find_next_peer_for_upgrade(cluster_status, upgrade_progress)
    service.add_upgrade_progress(upgrade_progress)
    upgrade_member_response = service.upgrade_shc_member_by_name(next_peer)
    if upgrade_member_response.status != EndpointResponseStatus.SUCCEEDED:
        raise ResponseSafeToPrintException(
            "Failed to initiate member upgrade", HTTPStatus.INTERNAL_SERVER_ERROR
        )
    return create_generic_response_with_message_and_status(HTTPStatus.OK, "Upgrade initiated")


def throw_if_higher_than_cm_version(
    service: SplunkService, role_mapper: ServerRolesMapper, upgrade_to: Version
):
    if role_mapper.is_search_head_for_indexer_cluster():
        lowest_cm_version = min(
            generation.cluster_manager_version for generation in service.get_searchhead_generation()
        )
        if lowest_cm_version < upgrade_to:
            raise UpgradeToHigherVersionThanCM(
                f"Attempting to upgrade to version '{upgrade_to}' while indexer cluster manager is at older version '{lowest_cm_version}'"
            )


class ShcUpgradeRestProcessor(RestProcessorBase):
    def __init__(self, service: Optional[SplunkService] = None):
        super().__init__("/upgrade/shc/upgrade", "shc", [HTTPMethod.POST.value], service)

    def _pre_process(self, in_request: bytes):
        self._inputs_config = InputsConfig()
        return super()._pre_process(in_request)

    def _process(self, request: JsonObject) -> GenericResponse:
        # this assert is here to make mypy happy
        assert self._config and self._splunk_service
        kv_store_status = self._splunk_service.get_kv_store_status()
        if not kv_store_status == KvStoreStatus.READY:
            raise ResponseSafeToPrintException(KV_STORE_NOT_READY, HTTPStatus.SERVICE_UNAVAILABLE)

        role_mapper = ServerRolesMapper(self._splunk_service.get_server_roles())
        if role_mapper.is_deployer_only() or role_mapper.is_standalone_search_head():
            return process_for_standalone(self._splunk_service, self._config, role_mapper)
        elif role_mapper.is_shc_peer():
            return process_for_shc_member(self._splunk_service, self._config, role_mapper)
        else:
            raise ResponseSafeToPrintException(
                SHC_UPGRADE_NOT_SUPPORTED_PEER, HTTPStatus.NOT_IMPLEMENTED
            )
