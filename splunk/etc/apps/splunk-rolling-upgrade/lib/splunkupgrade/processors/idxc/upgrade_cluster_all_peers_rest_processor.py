import logging
import os
import sys
import time
from http import HTTPStatus
from packaging.version import Version
from subprocess import DEVNULL, Popen
from typing import List, Optional, Tuple

from splunkupgrade.data.upgrade_endpoints_response import GenericResponse
from splunkupgrade.data.idxc.kv_idx_peers_upgrade_progress import (
    KvUpgradeIdxPeersProgress,
    KvIdxPeersOverallStatus,
)
from splunkupgrade.data.idxc.kv_upgrade_progress_idx_peer import (
    KvUpgradeProgressIdxPeer,
    KvIdxPeerStatus,
)
from splunkupgrade.data.idxc.peer import Peer as IdxcPeer
from splunkupgrade.data.idxc.search_head import SearchHead
from splunkupgrade.data.idxc.health import Health
from splunkupgrade.data.shc.kv_store_status import KvStoreStatus
from splunkupgrade.downloader.downloader import (
    retrieve_new_splunk_package_path,
)
from splunkupgrade.upgrader.upgrade_orchestrator import get_concurrency
from splunkupgrade.processors.common import (
    get_auth_token,
    get_rest_uri,
    create_generic_response_with_message_and_status,
)
from splunkupgrade.processors.base_processor import (
    RestProcessorBase,
    get_field_from_list,
    split_payload,
)
from splunkupgrade.upgrader.upgrade_orchestrator import try_fail_upgrade
from splunkupgrade.utils.constants import (
    GeneralConstants,
    KV_STORE_NOT_READY,
    UNSUPPORTED_INSTANCE,
    HTTPMethod,
)
from splunkupgrade.utils.exceptions import ResponseSafeToPrintException
from splunkupgrade.utils.server_roles_mapper import ServerRolesMapper
from splunkupgrade.utils.version_extractor import get_version
from splunkupgrade.utils.types import JsonObject
from splunkupgrade.utils.utils import get_path_or_none
from splunkupgrade.data.parsing import to_bool, DataParseException
from splunkupgrade.utils.exceptions import InvalidEndpointParameter
from splunkupgrade.utils.splunk_service import SplunkService

logger = logging.getLogger(__name__)


def create_upgrade_progress(
    id: int, target_version: Version, cluster_peers: List[IdxcPeer]
) -> tuple[KvUpgradeIdxPeersProgress, Version]:
    assert len(cluster_peers) != 0
    first_peer_version = cluster_peers[0].version
    if first_peer_version is None:
        raise ResponseSafeToPrintException(
            f"Can not determine version for peer='{cluster_peers[0].name}'. "
            f"Peer is in state='{cluster_peers[0].status.value}'",
            HTTPStatus.SERVICE_UNAVAILABLE,
        )
    min_version = first_peer_version
    progress_peers = []
    for peer in cluster_peers:

        # Splunkd returns a response where splunk version is not set if the peer is in Starting state.
        # Normally we should not get to this code path because pre flight check would catch this.
        # But if we are running in a 'force' mode, and we do get here, we fail the upgrade at this stage.
        if peer.version is None:
            raise ResponseSafeToPrintException(
                f"Can not determine version for peer='{peer.name}'. Peer is in state='{peer.status.value}'",
                HTTPStatus.SERVICE_UNAVAILABLE,
            )
        status = (
            KvIdxPeerStatus.READY if peer.version < target_version else KvIdxPeerStatus.UPGRADED
        )
        progress_peers.append(
            KvUpgradeProgressIdxPeer(peer.id, peer.name, time.time(), status, peer.site, None)
        )
        if peer.version < min_version:
            min_version = peer.version
    return (
        KvUpgradeIdxPeersProgress(
            progress_peers,
            0,
            id,
            str(min_version),
            str(target_version),
            KvIdxPeersOverallStatus.IN_PROGRESS,
        ),
        min_version,
    )


def is_upgrade_in_progress(last_record: Optional[KvUpgradeIdxPeersProgress]) -> bool:
    return (
        last_record is not None
        and last_record.overall_status == KvIdxPeersOverallStatus.IN_PROGRESS
    )


def is_force_mode_enabled(request: JsonObject) -> bool:
    payload = get_path_or_none(request, GeneralConstants.PAYLOAD)
    if not payload:
        return False

    force_mode = split_payload(payload).get(GeneralConstants.FORCE)
    if force_mode is None or len(force_mode) > 1:
        return False

    try:
        return to_bool(force_mode[0])
    except DataParseException as e:
        raise InvalidEndpointParameter(
            f"Invalid {GeneralConstants.FORCE} parameter specified."
        ) from e


def find_searchhead_with_lower_version(
    searchheads: List[SearchHead], version: Version
) -> Optional[SearchHead]:
    def is_version_lower(sh_version: Optional[Version]):
        return sh_version and sh_version < version

    return next((sh for sh in searchheads if is_version_lower(sh.get_parsed_version())), None)


def throw_on_bad_pre_flight_check(cluster_health: Health) -> None:
    pre_flight_failed = "Upgrade pre-flight check failed."
    reason = ""
    if not cluster_health.all_peers_are_up:
        reason += f" Some peers are down."
    if not cluster_health.all_data_is_searchable:
        reason += " Not all data is searchable."
    if not cluster_health.search_factor_met:
        reason += " Search factor is not met."
    if not cluster_health.site_search_factor_met:
        reason += " Site search factor is not met."
    if not cluster_health.replication_factor_met:
        reason += " Replication factor is not met."
    if not cluster_health.site_replication_factor_met:
        reason += " Site replication factor is not met."
    if not cluster_health.no_fixup_tasks_in_progress:
        reason += " Fixup tasks are in progress."
    if not cluster_health.pre_flight_check:
        raise ResponseSafeToPrintException(f"{pre_flight_failed}{reason}", HTTPStatus.FORBIDDEN)


class UpgradeClusterAllPeersRestProcessor(RestProcessorBase):
    def __init__(
        self, orchestrator_path: Optional[str] = None, service: Optional[SplunkService] = None
    ):
        super().__init__("/upgrade/cluster/all_peers", "cluster", [HTTPMethod.POST.value], service)
        self._orchestrator_path = orchestrator_path

    def _verify_orchestrator_path(self) -> Tuple[bool, str]:
        if not self._orchestrator_path:
            if GeneralConstants.SPLUNK_HOME not in os.environ:
                return False, "SPLUNK_HOME environmental variable is not set"
            self._orchestrator_path = os.path.join(
                os.environ[GeneralConstants.SPLUNK_HOME],
                GeneralConstants.ORCHESTRATOR_RELATIVE_PATH,
            )
        if not os.path.isfile(self._orchestrator_path):
            return False, f"Orchestrator script at path='{self._orchestrator_path}' does not exist"
        return True, ""

    def _process(self, request: JsonObject) -> GenericResponse:
        assert self._splunk_service is not None
        assert self._config is not None
        role_mapper = ServerRolesMapper(self._splunk_service.get_server_roles())
        if not role_mapper.is_cluster_manager():
            raise ResponseSafeToPrintException(UNSUPPORTED_INSTANCE, HTTPStatus.NOT_IMPLEMENTED)

        is_path_ok, error_message = self._verify_orchestrator_path()
        if not is_path_ok:
            raise ResponseSafeToPrintException(error_message, HTTPStatus.SERVICE_UNAVAILABLE)

        kv_store_status = self._splunk_service.get_kv_store_status()
        if not kv_store_status == KvStoreStatus.READY:
            raise ResponseSafeToPrintException(KV_STORE_NOT_READY, HTTPStatus.SERVICE_UNAVAILABLE)

        is_force_mode = is_force_mode_enabled(request)
        if is_force_mode:
            logger.info("Skipping pre-flight check because force mode was used")
        else:
            health = self._splunk_service.get_idxc_health()
            throw_on_bad_pre_flight_check(health)

        peers = self._splunk_service.get_idxc_peers()
        if len(peers) == 0:
            raise ResponseSafeToPrintException(
                "Cluster does not have any peers", HTTPStatus.FORBIDDEN
            )

        # This method will throw is there is an issue with the search factor
        get_concurrency(
            self._splunk_service.get_idxc_config(), self._config.orchestrator_config, len(peers)
        )

        package = retrieve_new_splunk_package_path(self._config.downloader_config)
        target_version = get_version(package, self._config.proces_runner_config.timeout)
        server_info = self._splunk_service.get_server_info()
        if server_info.version < target_version:
            raise ResponseSafeToPrintException(
                "Can not upgrade cluster peers to a higher version than cluster manager",
                HTTPStatus.FORBIDDEN,
            )

        search_heads_info = self._splunk_service.get_connected_search_heads()
        older_search_head = find_searchhead_with_lower_version(search_heads_info, target_version)
        if older_search_head:
            raise ResponseSafeToPrintException(
                f"All search heads have to be upgraded before cluster peers. Detected at least one "
                f"search head='{older_search_head.label}' that has older version='{older_search_head.str_splunk_version}'",
                HTTPStatus.FORBIDDEN,
            )

        last_upgrade_record = self._splunk_service.get_latest_idx_peers_upgrade()
        next_id = last_upgrade_record.id + 1 if last_upgrade_record else 0
        current_upgrade_record, min_peer_version = create_upgrade_progress(
            next_id, target_version, peers
        )
        are_all_peers_upgraded = min_peer_version >= target_version
        if are_all_peers_upgraded:
            raise ResponseSafeToPrintException(
                "All cluster peers are already at a higher version", HTTPStatus.FORBIDDEN
            )

        if is_upgrade_in_progress(last_upgrade_record):
            raise ResponseSafeToPrintException(
                "Cluster has already begun rolling upgrade. Please wait for it to finish",
                HTTPStatus.FORBIDDEN,
            )

        cm_info = self._splunk_service.get_cm_info()
        if not cm_info.rolling_restart_or_upgrade or not cm_info.maintenance_mode:
            if not self._splunk_service.idxc_initiate_upgrade().is_ok():
                raise ResponseSafeToPrintException(
                    "Failed to initiate an upgrade", HTTPStatus.INTERNAL_SERVER_ERROR
                )

        current_upgrade_record = self._splunk_service.add_idx_peers_upgrade_progress(
            current_upgrade_record
        )
        assert self._orchestrator_path is not None
        cmd = [
            sys.executable,
            self._orchestrator_path,
            "--peer_name",
            server_info.server_name,
            "--rest_uri",
            get_rest_uri(request),
            "--session_key",
            get_auth_token(request),
            "--skip_checkpoint",
            "true" if is_force_mode else "false",
        ]
        logger.info(f"Running script='{self._orchestrator_path}'")
        try:
            # Safe here: launches a fixed internal Python script with shell=False and no user-selected executable.
            proc = Popen(  # nosemgrep
                cmd, stdin=DEVNULL, stdout=DEVNULL, stderr=DEVNULL, close_fds=True
            )
        except OSError as e:
            try_fail_upgrade(current_upgrade_record, self._splunk_service)
            raise ResponseSafeToPrintException(
                "Failed to create orchestrator process", HTTPStatus.SERVICE_UNAVAILABLE
            )

        return create_generic_response_with_message_and_status(
            HTTPStatus.OK, "Cluster upgrade initiated"
        )
