from http import HTTPStatus
from typing import Optional
import logging
import abc

from splunkupgrade.data.data_parse_exception import DataParseException
from splunkupgrade.utils.constants import SingleInstanceType
from splunkupgrade.utils.splunk_service import SplunkService
from splunkupgrade.utils.types import JsonObject
from splunkupgrade.utils.app_conf import RollingUpgradeConfig
from splunkupgrade.utils.server_roles_mapper import ServerRolesMapper
from splunkupgrade.processors.common import create_service_from_request
from splunkupgrade.processors.idxc.upgrade_cluster_standalone_rest_processor import (
    UpgradeClusterStandaloneRestProcessor,
)
from splunkupgrade.processors.idxc.upgrade_cluster_status_rest_processor import (
    UpgradeClusterStatusRestProcessor,
)
from splunkupgrade.processors.idxc.upgrade_cluster_recovery_rest_processor import (
    UpgradeClusterRecoveryRestProcessor,
)
from splunkupgrade.processors.shc.shc_upgrade_rest_processor import ShcUpgradeRestProcessor
from splunkupgrade.processors.shc.shc_upgrade_status_rest_processor import (
    ShcUpgradeStatusRestProcessor,
)
from splunkupgrade.processors.shc.shc_upgrade_recovery_rest_processor import (
    ShcUpgradeRecoveryRestProcessor,
)

logger = logging.getLogger(__name__)


class RestProxyProcessor(metaclass=abc.ABCMeta):
    @abc.abstractmethod
    def _call_indexer_processor(self, request: bytes, service: SplunkService) -> JsonObject:
        pass

    @abc.abstractmethod
    def _call_searchhead_processor(self, request: bytes, service: SplunkService) -> JsonObject:
        pass

    def handle(self, request: bytes, service: Optional[SplunkService] = None) -> JsonObject:
        try:
            if service is None:
                service = create_service_from_request(
                    request, RollingUpgradeConfig().requests_timeout_config
                )
            self.mapper = ServerRolesMapper(service.get_server_roles())

            if (
                self.mapper.is_shc_peer()
                or self.mapper.is_deployer_only()
                or self.mapper.is_standalone_search_head()
            ):
                return self._call_searchhead_processor(request, service)
            elif (
                self.mapper.is_cluster_manager()
                or self.mapper.is_standalone_indexer()
                or self.mapper.is_isolated_license_manager()
            ):
                return self._call_indexer_processor(request, service)
            else:
                return {
                    "payload": {"messages": [{"type": "ERROR", "text": "Unsupported instance"}]},
                    "status": HTTPStatus.NOT_IMPLEMENTED,
                }
        except DataParseException as e:
            logger.error(str(e))
            return {
                "payload": {"messages": [{"type": "ERROR", "text": "Parsing error"}]},
                "status": HTTPStatus.BAD_REQUEST,
            }


class RestProxyUpdateProcessor(RestProxyProcessor):
    def _call_cluster_processor(self, request: bytes, instance_type: SingleInstanceType):
        return UpgradeClusterStandaloneRestProcessor(instance_type).handle(request)

    def _call_indexer_processor(self, request: bytes, service: SplunkService) -> JsonObject:
        if self.mapper.is_cluster_manager():
            return self._call_cluster_processor(request, SingleInstanceType.CLUSTER_MANAGER)
        return self._call_cluster_processor(request, SingleInstanceType.STANDALONE)

    def _call_searchhead_processor(self, request: bytes, service: SplunkService) -> JsonObject:
        return ShcUpgradeRestProcessor(service).handle(request)


class RestProxyStatusProcessor(RestProxyProcessor):
    def _call_indexer_processor(self, request: bytes, service: SplunkService) -> JsonObject:
        return UpgradeClusterStatusRestProcessor(service).handle(request)

    def _call_searchhead_processor(self, request: bytes, service: SplunkService) -> JsonObject:
        return ShcUpgradeStatusRestProcessor(service).handle(request)


class RestProxyRecoveryProcessor(RestProxyProcessor):
    def _call_indexer_processor(self, request: bytes, service: SplunkService) -> JsonObject:
        return UpgradeClusterRecoveryRestProcessor(service).handle(request)

    def _call_searchhead_processor(self, request: bytes, service: SplunkService) -> JsonObject:
        return ShcUpgradeRecoveryRestProcessor(service).handle(request)
