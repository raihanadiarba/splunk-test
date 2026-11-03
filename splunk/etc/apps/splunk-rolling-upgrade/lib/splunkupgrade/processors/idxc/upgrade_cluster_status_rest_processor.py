import logging
from http import HTTPStatus
from typing import Union, Optional

from splunkupgrade.data.shc.kv_store_status import KvStoreStatus
from splunkupgrade.data.shc.kv_upgrade_progress import UpgradeStatusKeys
from splunkupgrade.data.upgrade_endpoints_response import GenericResponse
from splunkupgrade.processors.base_processor import RestProcessorBase
from splunkupgrade.utils.splunk_service import SplunkService
from splunkupgrade.utils.app_conf import RollingUpgradeConfig
from splunkupgrade.utils.server_roles_mapper import ServerRolesMapper
from splunkupgrade.utils.types import JsonObject
from splunkupgrade.utils.constants import KV_STORE_NOT_READY, UNSUPPORTED_INSTANCE, HTTPMethod
from splunkupgrade.utils.exceptions import ResponseSafeToPrintException
from splunkupgrade.utils.cluster_upgrade_status_formatter import (
    ClusterUpgradeCurrentStatusFormatter,
    ClusterUpgradeFullStatusFormatter,
)


logger = logging.getLogger(__name__)


class UpgradeClusterStatusRestProcessor(RestProcessorBase):
    def __init__(self, service: Optional[SplunkService] = None):
        super().__init__("/upgrade/cluster/status", "cluster", [HTTPMethod.GET.value], service)

    def _allow_deprecated_checksum(self) -> bool:
        return True

    def _get_status_formatter(
        self, roles_mapper: ServerRolesMapper
    ) -> Union[ClusterUpgradeCurrentStatusFormatter, ClusterUpgradeFullStatusFormatter]:
        assert self._splunk_service is not None
        current_instance_upgrade_record = self._splunk_service.get_latest_idx_current_upgrade()
        server_info = self._splunk_service.get_server_info()
        if roles_mapper.is_standalone_indexer() or roles_mapper.is_isolated_license_manager():
            return ClusterUpgradeCurrentStatusFormatter(
                current_instance_upgrade_record, server_info.version
            )
        else:
            all_peers_upgrade_record = self._splunk_service.get_latest_idx_peers_upgrade()
            return ClusterUpgradeFullStatusFormatter(
                current_instance_upgrade_record, all_peers_upgrade_record, server_info.version
            )

    def _process(self, request: JsonObject) -> GenericResponse:
        assert self._splunk_service is not None
        roles_mapper = ServerRolesMapper(self._splunk_service.get_server_roles())
        if (
            not roles_mapper.is_cluster_manager()
            and not roles_mapper.is_standalone_indexer()
            and not roles_mapper.is_isolated_license_manager()
        ):
            raise ResponseSafeToPrintException(UNSUPPORTED_INSTANCE, HTTPStatus.NOT_IMPLEMENTED)
        if self._splunk_service.get_kv_store_status() != KvStoreStatus.READY:
            raise ResponseSafeToPrintException(KV_STORE_NOT_READY, HTTPStatus.SERVICE_UNAVAILABLE)
        formatter = self._get_status_formatter(roles_mapper)
        return GenericResponse(HTTPStatus.OK, {UpgradeStatusKeys.MESSAGE: formatter.format()})

    def _validate_config(self, config: RollingUpgradeConfig) -> None:
        pass
