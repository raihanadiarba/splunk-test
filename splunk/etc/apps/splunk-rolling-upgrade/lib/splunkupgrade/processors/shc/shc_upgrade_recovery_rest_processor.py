import logging
from http import HTTPStatus
from typing import List, Optional

from splunkupgrade.data.upgrade_endpoints_response import (
    GenericResponse,
)
from splunkupgrade.processors.base_processor import RestProcessorBase
from splunkupgrade.processors.common import create_generic_response_with_message_and_status
from splunkupgrade.utils.app_conf import RollingUpgradeConfig
from splunkupgrade.utils.constants import HTTPMethod
from splunkupgrade.utils.exceptions import ResponseSafeToPrintException
from splunkupgrade.utils.inputs_conf import InputsConfig
from splunkupgrade.utils.types import JsonObject
from splunkupgrade.utils.server_roles_mapper import ServerRolesMapper
from splunkupgrade.utils.splunk_service import SplunkService
from splunkupgrade.upgrader.upgrader_utils import StatusUpdater
from splunkupgrade.data.shc.kv_upgrade_progress import SummaryKvUpgradeProgress, KvUpgradeProgress

logger = logging.getLogger(__name__)


def is_not_completed(last_status: KvUpgradeProgress) -> bool:
    return last_status.status != SummaryKvUpgradeProgress.COMPLETED


def set_global_failed(updater: StatusUpdater) -> None:
    updater.update_upgrade_status_to(SummaryKvUpgradeProgress.FAILED)


def handle_shc_recovery(service: SplunkService) -> bool:
    upgrade_progress = service.get_latest_upgrade()
    if upgrade_progress is None:
        logger.info("No upgrade records exist in kv store")
        return False
    updater = StatusUpdater(service, upgrade_progress)
    if is_not_completed(updater.get_current_progress()):
        set_global_failed(updater)
        service.finalize_upgrade()
        logger.info(f"Upgrade id='{updater.get_current_progress().id}' manually failed")
        return True

    logger.info(
        f"Upgrade id='{updater.get_current_progress().id}' was already completed with success"
    )
    return False


def handle_standalone_recovery(service: SplunkService) -> bool:
    upgrade_progress = service.get_latest_upgrade()
    if upgrade_progress is None:
        logger.info("No upgrade records exist in kv store")
        return False
    updater = StatusUpdater(service, upgrade_progress)
    if is_not_completed(updater.get_current_progress()):
        set_global_failed(updater)
        logger.info(f"Upgrade id='{updater.get_current_progress().id}' manually failed")
        return True

    logger.info(
        f"Upgrade id='{updater.get_current_progress().id}' was already completed with success"
    )
    return False


def peers_in_detention_mode(service: SplunkService) -> List[str]:
    shc_status = service.get_shcluster_info()
    return [p.label for p in shc_status.peers if p.is_in_manual_detention]


class ShcUpgradeRecoveryRestProcessor(RestProcessorBase):
    SHC_RECOVERED = "SHC recovered successfully"
    STANDALONE_RECOVERED = "Instance recovered successfully"
    RECOVERY_NOT_REQUIRED = "Recovery is not required"
    UNSUPPORTED_INSTANCE_TYPE = "Unsupported instance type"
    SHC_PARTIAL_RECOVER = (
        "SHC partially recovered. Please turn off manual detention mode on the following peers"
    )

    def __init__(self, service: Optional[SplunkService] = None):
        super().__init__("/upgrade/shc/recovery", "shc", [HTTPMethod.POST.value], service)

    def _allow_deprecated_checksum(self) -> bool:
        return True

    def _pre_process(self, in_request: bytes):
        self._inputs_config = InputsConfig()
        return super()._pre_process(in_request)

    def _format_message_for_shc_recovery(self) -> str:
        # this assert is here to make mypy happy
        assert self._config and self._splunk_service
        in_detention_mode = peers_in_detention_mode(self._splunk_service)
        if len(in_detention_mode) > 0:
            return f"{ShcUpgradeRecoveryRestProcessor.SHC_PARTIAL_RECOVER}: {in_detention_mode}"
        else:
            return ShcUpgradeRecoveryRestProcessor.SHC_RECOVERED

    def _process(self, request: JsonObject) -> GenericResponse:
        # this assert is here to make mypy happy
        assert self._config and self._splunk_service

        role_mapper = ServerRolesMapper(self._splunk_service.get_server_roles())
        message = ShcUpgradeRecoveryRestProcessor.RECOVERY_NOT_REQUIRED
        if role_mapper.is_shc_peer():
            if handle_shc_recovery(self._splunk_service):
                message = self._format_message_for_shc_recovery()
        elif role_mapper.is_standalone_search_head() or role_mapper.is_deployer_only():
            if handle_standalone_recovery(self._splunk_service):
                message = ShcUpgradeRecoveryRestProcessor.STANDALONE_RECOVERED
        else:
            raise ResponseSafeToPrintException(
                ShcUpgradeRecoveryRestProcessor.UNSUPPORTED_INSTANCE_TYPE,
                HTTPStatus.NOT_IMPLEMENTED,
            )
        return create_generic_response_with_message_and_status(HTTPStatus.OK, message)

    def _validate_config(self, config: RollingUpgradeConfig) -> None:
        pass
