import logging
from http import HTTPStatus
from typing import Optional

from splunkupgrade.data.upgrade_endpoints_response import GenericResponse
from splunkupgrade.processors.idxc.upgrade_cluster_instance_rest_processor import (
    UpgradeClusterInstanceRestProcessor,
)
from splunkupgrade.utils.constants import SingleInstanceType, UNSUPPORTED_INSTANCE
from splunkupgrade.utils.exceptions import ResponseSafeToPrintException
from splunkupgrade.utils.server_roles_mapper import ServerRolesMapper
from splunkupgrade.utils.types import JsonObject
from splunkupgrade.utils.splunk_service import SplunkService

logger = logging.getLogger(__name__)


class UpgradeClusterStandaloneRestProcessor(UpgradeClusterInstanceRestProcessor):
    def __init__(
        self,
        single_instance_type: SingleInstanceType,
        upgrader_path: Optional[str] = None,
        service: Optional[SplunkService] = None,
    ):
        super().__init__(
            upgrader_path,
            "/upgrade/standalone"
            if single_instance_type == SingleInstanceType.STANDALONE
            else "/upgrade/cluster/manager",
            service,
        )
        self._single_instance_type = single_instance_type

    def _process(self, request: JsonObject) -> GenericResponse:
        assert self._splunk_service is not None
        mapper = ServerRolesMapper(self._splunk_service.get_server_roles())
        has_proper_role = (
            mapper.is_standalone_indexer() or mapper.is_isolated_license_manager()
            if self._single_instance_type == SingleInstanceType.STANDALONE
            else mapper.is_cluster_manager()
        )
        if has_proper_role:
            return super()._process(request)
        else:
            raise ResponseSafeToPrintException(UNSUPPORTED_INSTANCE, HTTPStatus.SERVICE_UNAVAILABLE)
