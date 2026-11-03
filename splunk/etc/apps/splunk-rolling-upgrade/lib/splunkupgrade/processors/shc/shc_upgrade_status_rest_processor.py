import logging
from http import HTTPStatus
from typing import Optional

from splunkupgrade.data.shc.kv_upgrade_progress import to_upgrade_shc_status_response
from splunkupgrade.data.shc.kv_store_status import KvStoreStatus
from splunkupgrade.data.upgrade_endpoints_response import GenericResponse
from splunkupgrade.processors.base_processor import RestProcessorBase
from splunkupgrade.upgrader.upgrader_utils import is_peer_upgradable
from splunkupgrade.utils.splunk_service import SplunkService
from splunkupgrade.utils.app_conf import RollingUpgradeConfig
from splunkupgrade.utils.constants import (
    SHC_UPGRADE_NOT_SUPPORTED_PEER,
    KV_STORE_NOT_READY,
    HTTPMethod,
)
from splunkupgrade.utils.exceptions import ResponseSafeToPrintException
from splunkupgrade.utils.inputs_conf import InputsConfig
from splunkupgrade.utils.server_roles_mapper import ServerRolesMapper
from splunkupgrade.utils.types import JsonObject


logger = logging.getLogger(__name__)


class ShcUpgradeStatusRestProcessor(RestProcessorBase):
    def __init__(self, service: Optional[SplunkService] = None):
        super().__init__("/upgrade/shc/status", "shc", [HTTPMethod.GET.value], service)

    def _allow_deprecated_checksum(self) -> bool:
        return True

    def _pre_process(self, in_request: bytes):
        self._inputs_config = InputsConfig()
        return super()._pre_process(in_request)

    def _process(self, request: JsonObject) -> GenericResponse:
        # this assert is here to make mypy happy
        assert self._config and self._splunk_service
        role_mapper = ServerRolesMapper(self._splunk_service.get_server_roles())
        if not is_peer_upgradable(role_mapper):
            raise ResponseSafeToPrintException(
                SHC_UPGRADE_NOT_SUPPORTED_PEER, HTTPStatus.NOT_IMPLEMENTED
            )

        kv_store_status = self._splunk_service.get_kv_store_status()
        if kv_store_status != KvStoreStatus.READY:
            raise ResponseSafeToPrintException(KV_STORE_NOT_READY, HTTPStatus.SERVICE_UNAVAILABLE)
        latest_upgrade = self._splunk_service.get_latest_upgrade()
        if latest_upgrade is None:
            logger.info("No upgrade records exist in kv store")
            return GenericResponse(HTTPStatus.OK, to_upgrade_shc_status_response(None))
        return GenericResponse(HTTPStatus.OK, to_upgrade_shc_status_response(latest_upgrade))

    def _validate_config(self, config: RollingUpgradeConfig) -> None:
        pass
