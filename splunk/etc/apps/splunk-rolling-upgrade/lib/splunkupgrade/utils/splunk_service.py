import copy
import json
import logging
import splunklib.client as client
from typing import Any, Callable, List, Optional
from dataclasses import dataclass
from enum import Enum
from pathlib import PurePosixPath
from splunklib.binding import ResponseReader, handler
from splunklib.client import Service
from splunkupgrade.utils.constants import IndexerPeerKeys
from splunkupgrade.data.data_parse_exception import DataParseException
from splunkupgrade.data.encoder import JsonWithEnumsEncoder
from splunkupgrade.data.idxc.cm_info import CmInfo, to_cm_info
from splunkupgrade.data.idxc.config import (
    Config,
    to_config,
)
from splunkupgrade.data.idxc.health import (
    Health,
    to_health,
)
from splunkupgrade.data.idxc.search_head import to_searchhead
from splunkupgrade.data.idxc.initiate_upgrade_response import (
    InitiateUpgradeResponse,
    to_initiate_upgrade_response as to_idxc_initiate_upgrade_response,
)
from splunkupgrade.data.idxc.peer import to_peer as to_idxc_peer, Peer as IdxcPeer
from splunkupgrade.data.idxc.search_head import SearchHead
from splunkupgrade.data.shc.initiate_upgrade_response import (
    to_finalize_upgrade_response,
    to_initiate_upgrade_response,
)
from splunkupgrade.data.shc.kv_store_status import KvStoreStatus, to_kv_store_status
from splunkupgrade.data.shc.kv_upgrade_progress import (
    KvUpgradeProgress,
    to_kv_upgrade_progress,
)
from splunkupgrade.data.parsing import get_field, get_object_list_field
from splunkupgrade.data.proxy_nodes import ProxyNode, to_proxy_node_list
from splunkupgrade.data.shc.searchhead_generation import (
    SearchHeadGeneration,
    to_searchhead_generation,
)
from splunkupgrade.data.server_info import ServerInfo, to_server_info
from splunkupgrade.data.server_roles import to_server_roles
from splunkupgrade.data.shc.shc_member_info import ShcMemberInfo, to_shc_member_info
from splunkupgrade.data.shc.shc_status import ShcStatus, to_shc_status
from splunkupgrade.data.upgrade_endpoints_response import (
    to_upgrade_endpoints_response,
    UpgradeEndpointsResponse,
)
from splunkupgrade.utils.app_conf import RequestConfig, RollingUpgradePermsConfigChecker
from splunkupgrade.utils.constants import (
    GeneralConstants,
    KvStoreUpgradeRecordKeys,
    ShcManualDetectionMode,
    KvStoreIdxCurrentRecordKeys,
)
from splunkupgrade.data.idxc.kv_idx_current_upgrade_progress import (
    KvUpgradeIdxCurrentProgress,
    to_kv_upgrade_idx_current_progress,
)

from splunkupgrade.data.idxc.kv_idx_peers_upgrade_progress import (
    KvUpgradeIdxPeersProgress,
    to_kv_upgrade_idx_peers_progress,
)
from splunkupgrade.utils.types import JsonObject
from splunkupgrade.utils.utils import does_path_exist
from uuid import UUID

logger = logging.getLogger(__name__)


@dataclass
class Rest:
    endpoint: str
    proxy: Optional[str] = None

    def add_to_path(self, part: str) -> "Rest":
        new_endpoint = str(PurePosixPath(self.endpoint, part))
        new_proxy = str(PurePosixPath(self.proxy, part)) if self.proxy else None
        return Rest(new_endpoint, new_proxy)


SHCLUSTER_STATUS = Rest("/services/shcluster/status")
SHCLUSTER_MEMBER_INFO = Rest("/services/shcluster/member/info")
SHCLUSTER_SET_MANUAL_DETENTION = Rest(
    "/services/shcluster/member/control/control/set_manual_detention"
)
KVSTORE_STATUS = Rest("/services/kvstore/status")
SERVER_ROLES_REST = Rest("/services/server/roles")
UPGRADE_INIT = Rest("/services/shcluster/captain/control/control/upgrade-init")
UPGRADE_FINALIZE = Rest("/services/shcluster/captain/control/control/upgrade-finalize")
PROXY_NODES = Rest("/services/remote-proxy/nodes")
PROXY_BASE = Rest("/services/remote-proxy")
UPGRADE_SHC_MEMBER = Rest(
    "/services/upgrade/shc/member_upgrade_internal",
    "/services/remote-proxy/upgrade/shc/member_upgrade_internal",
)
SERVER_INFO = Rest("/services/server/info")
SEARCHHEAD_GENERATION = Rest("/services/cluster/searchhead/generation")
IDXC_CONFIG = Rest("/services/cluster/config")
IDXC_HEALTH = Rest("/services/cluster/manager/health")
IDXC_UPGRADE_INIT = Rest("/services/cluster/manager/control/control/rolling_upgrade_init")
IDXC_UPGRADE_FINALIZE = Rest("/services/cluster/manager/control/control/rolling_upgrade_finalize")
IDXC_PEERS = Rest("/services/cluster/manager/peers")
IDXC_UPGRADE_PEER = Rest(
    "/services/upgrade/cluster/instance", "/services/remote-proxy/upgrade/cluster/instance"
)
CM_INFO = Rest("/services/cluster/manager/info")
CM_SEARCHHEADS = Rest("/services/cluster/manager/searchheads")


class SplunkServiceException(Exception):
    pass


class CallMethod(Enum):
    GET = 1
    POST = 2


def find_proxy_to_by_servername(proxy_nodes: List[ProxyNode], servername: str) -> str:
    node = next((x for x in proxy_nodes if x.servername == servername), None)
    if not node:
        raise SplunkServiceException(f"No proxy node was found for servername='{servername}'")
    return node.proxy_to


def is_valid_uuid(str_uuid: str) -> bool:
    try:
        UUID(str_uuid)
        return True
    except ValueError:
        return False


class SplunkService:
    def __init__(self, service: Service):
        self.service = service

    @classmethod
    def from_session_key(cls, host: str, port: int, session_key: str, config: RequestConfig):
        try:
            service = SplunkService._create_service(host, port, session_key, config)
            return cls(service)
        except Exception as e:
            raise SplunkServiceException(
                f"Failed to connect to host='{host}', port='{port}' when creating a splunk service: error='{e}'"
            )

    @classmethod
    def from_username_and_password(
        cls, host: str, port: int, username: str, password: str, config: RequestConfig
    ):
        try:
            service = SplunkService._create_service_with_username_password(
                host, port, username, password, config
            )
            return cls(service)
        except Exception as e:
            raise SplunkServiceException(
                f"Failed to connect to host='{host}', port='{port}' when creating a splunk service: error='{e}'"
            )

    @staticmethod
    def _create_service_with_username_password(
        host: str, port: int, username: str, password: str, config: RequestConfig
    ) -> Service:
        return client.connect(
            host=host,
            port=port,
            username=username,
            password=password,
            app=GeneralConstants.APP_NAME,
            handler=handler(
                key_file=None, cert_file=None, timeout=config.timeout, verify=False, context=None
            ),
            retries=config.retries,
            retryDelay=config.retry_delay,
        )

    @staticmethod
    def _create_service(host: str, port: int, session_key: str, config: RequestConfig) -> Service:
        return client.connect(
            host=host,
            port=port,
            token=session_key,
            app=GeneralConstants.APP_NAME,
            handler=handler(
                key_file=None, cert_file=None, timeout=config.timeout, verify=False, context=None
            ),
            retries=config.retries,
            retryDelay=config.retry_delay,
        )

    @staticmethod
    def _get_json_response(response_reader: ResponseReader) -> JsonObject:
        try:
            string_response = response_reader.body.read()
            return json.loads(string_response)
        except Exception as e:
            raise SplunkServiceException(f"Failed to get response content: {e}")

    @staticmethod
    def _get_entry_content_json_response(
        response_reader: ResponseReader,
    ) -> List[JsonObject]:
        json_response = SplunkService._get_json_response(response_reader)
        try:
            entry = get_field(json_response, "entry", list)
            return [get_field(element, "content", dict) for element in entry]
        except DataParseException as e:
            raise SplunkServiceException(
                f"Failed to get response content, [entry][<index>][content] path does not exist"
            ) from e

    @staticmethod
    def _get_entry_json_response(response_reader: ResponseReader) -> List[JsonObject]:
        json_response = SplunkService._get_json_response(response_reader)
        if not does_path_exist(json_response, "entry"):
            raise SplunkServiceException(
                f"Failed to get response content, [entry] path does not exist"
            )
        return json_response["entry"]

    @staticmethod
    def _json_to_object(json_dict: JsonObject, parse_method: Callable[[JsonObject], Any]) -> Any:
        try:
            parsed_object = parse_method(json_dict)
        except DataParseException as e:
            raise SplunkServiceException(f"Failed to parse response content: {e}") from e
        return parsed_object

    @staticmethod
    def _list_response_to_object(
        json_list: List[JsonObject], parse_method: Callable[[JsonObject], Any]
    ) -> Any:
        if len(json_list) == 0:
            raise SplunkServiceException(
                f"Failed to get response content. Expected data, found empty list."
            )
        if len(json_list) > 1:
            logger.error(f"Expected to see only one elements in the json, got {len(json_list)}")
        return SplunkService._json_to_object(json_list[0], parse_method)

    @staticmethod
    def _list_response_to_object_list(
        json_list: List[JsonObject], parse_method: Callable[[JsonObject], Any]
    ) -> List[Any]:
        return [SplunkService._json_to_object(element, parse_method) for element in json_list]

    def _call(self, endpoint: str, method: CallMethod = CallMethod.GET, **kwargs) -> ResponseReader:
        logger.info(f"Calling {endpoint} with arguments={kwargs}")
        try:
            if method == CallMethod.GET:
                return self.service.get(endpoint, output_mode="json", **kwargs)
            else:
                return self.service.post(endpoint, output_mode="json", **kwargs)
        except Exception as e:
            raise SplunkServiceException(
                f"Failed to get response from endpoint='{endpoint}': error='{e}'"
            ) from e

    def _shcluster_set_manual_detention_mode(self, mode: ShcManualDetectionMode) -> None:
        logger.info(f"Setting manual detention mode to '{mode}'")
        response_reader = self._call(
            SHCLUSTER_SET_MANUAL_DETENTION.endpoint, manual_detention=mode.value
        )
        logger.info(
            f"Set manual detention mode response='{SplunkService._get_entry_json_response(response_reader)}'"
        )

    def get_shcluster_info(self) -> ShcStatus:
        logger.info("Getting SHCluster status")
        response_reader = self._call(SHCLUSTER_STATUS.endpoint, advanced=1)
        json_response = SplunkService._get_entry_content_json_response(response_reader)
        logger.info(f"SHCluster status response='{json_response}'")
        return SplunkService._list_response_to_object(json_response, to_shc_status)

    def get_shcluster_member_info(self) -> ShcMemberInfo:
        logger.info("Getting SHCluster member info")
        response_reader = self._call(SHCLUSTER_MEMBER_INFO.endpoint)
        json_response = SplunkService._get_entry_content_json_response(response_reader)
        logger.info(f"SHCluster member info response='{json_response}'")
        return SplunkService._list_response_to_object(json_response, to_shc_member_info)

    def get_kv_store_status(self) -> KvStoreStatus:
        logger.info("Getting kv store status")
        response_reader = self._call(KVSTORE_STATUS.endpoint)
        json_response = SplunkService._get_entry_content_json_response(response_reader)
        logger.info(f"Kv store status response='{json_response}'")
        return SplunkService._list_response_to_object(json_response, to_kv_store_status)

    def get_server_roles(self) -> List[str]:
        logger.info("Getting server roles")
        response_reader = self._call(SERVER_ROLES_REST.endpoint)
        json_response = SplunkService._get_entry_content_json_response(response_reader)
        logger.info(f"Server roles response='{json_response}'")
        return SplunkService._list_response_to_object(json_response, to_server_roles)

    def get_host_name(self) -> str:
        return self.service.host

    def _get_latest_upgrade_common(
        self, collection_name: str, parse_method: Callable[[JsonObject], Any], sort_by_field: str
    ) -> Any:
        logger.info(f"Getting latest upgrade from collection = {collection_name}")
        try:
            data = self.service.kvstore[collection_name].data
            latest_upgrade = data.query(limit=1, sort=f"{sort_by_field}:-1")
            logger.debug(f"Latest upgrade='{latest_upgrade}'")
            if latest_upgrade:
                return SplunkService._json_to_object(latest_upgrade[0], parse_method)
            return None
        except Exception as e:
            raise SplunkServiceException(f"Failed to query the kv store: {e}")

    def get_latest_upgrade(self) -> Optional[KvUpgradeProgress]:
        return self._get_latest_upgrade_common(
            GeneralConstants.SHC_COLLECTION_NAME,
            to_kv_upgrade_progress,
            KvStoreUpgradeRecordKeys.ID,
        )

    def _add_upgrade_progress_record_common(self, upgrade_data: Any, collection_name: str) -> Any:
        logger.debug(
            f"Adding new upgrade record='{upgrade_data}' to collection='{collection_name}'"
        )
        if upgrade_data.get_key():
            raise SplunkServiceException("Upgrade record has _key field set")
        try:
            data_copy = copy.deepcopy(upgrade_data)
            del data_copy._key
            data_copy._key = self.service.kvstore[collection_name].data.insert(
                JsonWithEnumsEncoder().encode(data_copy)
            )
            return data_copy
        except Exception as e:
            raise SplunkServiceException(f"Failed to push new upgrade record to the kv store: {e}")

    def add_upgrade_progress(self, upgrade_data: KvUpgradeProgress) -> KvUpgradeProgress:
        return self._add_upgrade_progress_record_common(
            upgrade_data, GeneralConstants.SHC_COLLECTION_NAME
        )

    def _update_upgrade_progress_common(self, upgrade_data: Any, collection_name: str) -> None:
        logger.debug(f"Updating upgrade record='{upgrade_data}' in collection='{collection_name}'")
        try:
            self.service.kvstore[collection_name].data.update(
                upgrade_data.get_key(),
                JsonWithEnumsEncoder().encode(upgrade_data),
            )
        except Exception as e:
            raise SplunkServiceException(f"Failed to update upgrade record: {e}")

    def update_upgrade_progress(self, upgrade_data: KvUpgradeProgress) -> None:
        self._update_upgrade_progress_common(upgrade_data, GeneralConstants.SHC_COLLECTION_NAME)

    def initiate_upgrade(self) -> bool:
        logger.info("Initiating the SHC upgrade")
        response_reader = self._call(UPGRADE_INIT.endpoint, CallMethod.POST)
        json_response = SplunkService._get_entry_content_json_response(response_reader)
        logger.info(f"Initiate SHC upgrade response='{json_response}'")
        return SplunkService._list_response_to_object(json_response, to_initiate_upgrade_response)

    def finalize_upgrade(self) -> bool:
        logger.info("Finalizing the SHC upgrade")
        response_reader = self._call(UPGRADE_FINALIZE.endpoint, CallMethod.POST)
        json_response = SplunkService._get_entry_content_json_response(response_reader)
        logger.info(f"Finalize SHC upgrade response='{json_response}'")
        return SplunkService._list_response_to_object(json_response, to_finalize_upgrade_response)

    def get_proxy_nodes(self) -> List[ProxyNode]:
        logger.info("Getting available proxy nodes")
        response_reader = self._call(PROXY_NODES.endpoint)
        json_response = SplunkService._get_json_response(response_reader)
        logger.info(f"Proxy nodes response='{json_response}'")
        return SplunkService._json_to_object(json_response, to_proxy_node_list)

    def _proxy_call_to(
        self, rest: Rest, server_name: str, method: CallMethod = CallMethod.GET, **kwargs
    ) -> ResponseReader:
        proxy_nodes = self.get_proxy_nodes()
        proxy_to = find_proxy_to_by_servername(proxy_nodes, server_name)
        assert rest.proxy is not None
        return self._call(rest.proxy, method=method, proxy_to=proxy_to, **kwargs)

    def _upgrade_shc_member_common(self, server_name: str = None):
        logger.info(f"Upgrading SHC member with name='{server_name}'")
        if server_name:
            response_reader = self._proxy_call_to(
                UPGRADE_SHC_MEMBER, server_name, CallMethod.POST, body=""
            )
        else:
            response_reader = self._call(UPGRADE_SHC_MEMBER.endpoint, CallMethod.POST, body="")
        json_response = SplunkService._get_entry_content_json_response(response_reader)
        logger.info(f"Upgrade SHC member response='{json_response}'")
        return SplunkService._list_response_to_object(json_response, to_upgrade_endpoints_response)

    def upgrade_shc_member(self) -> UpgradeEndpointsResponse:
        return self._upgrade_shc_member_common()

    def upgrade_shc_member_by_name(self, name: str) -> UpgradeEndpointsResponse:
        return self._upgrade_shc_member_common(name)

    def set_shcluster_enable_detention_mode(self) -> None:
        self._shcluster_set_manual_detention_mode(ShcManualDetectionMode.ON)

    def set_shcluster_disable_detention_mode(self) -> None:
        self._shcluster_set_manual_detention_mode(ShcManualDetectionMode.OFF)

    def get_server_info(self) -> ServerInfo:
        logger.info("Getting server info")
        response_reader = self._call(SERVER_INFO.endpoint)
        json_response = SplunkService._get_entry_content_json_response(response_reader)
        logger.info(f"Server info response='{json_response}'")
        return SplunkService._list_response_to_object(json_response, to_server_info)

    def get_searchhead_generation(self) -> List[SearchHeadGeneration]:
        logger.info("Getting searchhead generation")
        response_reader = self._call(SEARCHHEAD_GENERATION.endpoint)
        json_response = SplunkService._get_entry_content_json_response(response_reader)
        logger.info(f"Searchhead generation response='{json_response}'")
        return SplunkService._list_response_to_object_list(json_response, to_searchhead_generation)

    def get_idxc_config(self) -> Config:
        logger.info("Getting indexer cluster config")
        response_reader = self._call(IDXC_CONFIG.endpoint)
        json_response = SplunkService._get_entry_content_json_response(response_reader)
        logger.info(f"Indexer cluster config response='{json_response}'")
        return SplunkService._list_response_to_object(json_response, to_config)

    def get_idxc_health(self) -> Health:
        logger.info("Getting indexer cluster health")
        response_reader = self._call(IDXC_HEALTH.endpoint)
        json_response = SplunkService._get_entry_content_json_response(response_reader)
        logger.info(f"Cluster health response='{json_response}'")
        return SplunkService._list_response_to_object(json_response, to_health)

    def _idxc_init_finalize_upgrade(self, action: str, rest: Rest) -> InitiateUpgradeResponse:
        logger.info(f"{action} the IDXC upgrade")
        response_reader = self._call(rest.endpoint, CallMethod.POST)
        json_response = SplunkService._get_json_response(response_reader)
        try:
            messages = get_field(json_response, "messages", list)
            logger.info(f"{action} IDXC upgrade response='{messages}'")
            return SplunkService._list_response_to_object(
                messages, to_idxc_initiate_upgrade_response
            )
        except DataParseException as e:
            raise SplunkServiceException(f"Failed to parse a response: {e}") from e

    def idxc_initiate_upgrade(self) -> InitiateUpgradeResponse:
        return self._idxc_init_finalize_upgrade("Initiating", IDXC_UPGRADE_INIT)

    def idxc_finalize_upgrade(self) -> InitiateUpgradeResponse:
        return self._idxc_init_finalize_upgrade("Finalizing", IDXC_UPGRADE_FINALIZE)

    def add_idx_current_upgrade(
        self, upgrade_data: KvUpgradeIdxCurrentProgress
    ) -> KvUpgradeIdxCurrentProgress:
        return self._add_upgrade_progress_record_common(
            upgrade_data, GeneralConstants.IDX_CURRENT_COLLECTION_NAME
        )

    def get_latest_idx_current_upgrade(self) -> Optional[KvUpgradeIdxCurrentProgress]:
        return self._get_latest_upgrade_common(
            GeneralConstants.IDX_CURRENT_COLLECTION_NAME,
            to_kv_upgrade_idx_current_progress,
            KvStoreIdxCurrentRecordKeys.ID,
        )

    def update_idx_current_upgrade_progress(
        self, upgrade_data: KvUpgradeIdxCurrentProgress
    ) -> None:
        self._update_upgrade_progress_common(
            upgrade_data, GeneralConstants.IDX_CURRENT_COLLECTION_NAME
        )

    def add_idx_peers_upgrade_progress(
        self, upgrade_data: KvUpgradeIdxPeersProgress
    ) -> KvUpgradeIdxPeersProgress:
        return self._add_upgrade_progress_record_common(
            upgrade_data, GeneralConstants.IDX_PEERS_COLLECTION_NAME
        )

    def get_latest_idx_peers_upgrade(self) -> Optional[KvUpgradeIdxPeersProgress]:
        return self._get_latest_upgrade_common(
            GeneralConstants.IDX_PEERS_COLLECTION_NAME,
            to_kv_upgrade_idx_peers_progress,
            KvStoreIdxCurrentRecordKeys.ID,
        )

    def update_idx_peers_upgrade_progress(self, upgrade_data: KvUpgradeIdxPeersProgress) -> None:
        self._update_upgrade_progress_common(
            upgrade_data, GeneralConstants.IDX_PEERS_COLLECTION_NAME
        )

    def get_idxc_peers(self) -> List[IdxcPeer]:
        logger.info("Getting indexer cluster peers")
        # https://docs.splunk.com/Documentation/Splunk/9.0.5/RESTREF/RESTcluster#cluster.2Fmanager.2Fpeers
        # has paging enabled by default with 30 elements. count=0 disable this and we get all the data
        # at once.
        response_reader = self._call(
            IDXC_PEERS.endpoint,
            CallMethod.GET,
            count=0,
            f=[
                IndexerPeerKeys.LABEL,
                IndexerPeerKeys.SPLUNK_VERSION,
                IndexerPeerKeys.STATUS,
                IndexerPeerKeys.SITE,
            ],
        )
        json_response = self._get_entry_json_response(response_reader)
        logger.info(f"Indexer cluster peers count='{len(json_response)}'")
        logger.debug(f"Indexer cluster peers response='{json_response}'")
        return get_object_list_field(json_response, to_idxc_peer)

    def get_idxc_peer(self, peer_id: str) -> Optional[IdxcPeer]:
        logger.info(f"Getting indexer cluster peer='{peer_id}'")
        if not is_valid_uuid(peer_id):
            raise SplunkServiceException(f"Invalid peer name specified='{peer_id}'")
        response_reader = self._call(IDXC_PEERS.add_to_path(peer_id).endpoint)
        json_response = self._get_entry_json_response(response_reader)
        logger.info(f"Indexer cluster peer response='{json_response}'")
        if not json_response:
            return None
        return self._list_response_to_object(json_response, to_idxc_peer)

    def _upgrade_idxc_peer_common(self, to_version: str, server_name: str = None):
        logger.info(
            "Upgrading cluster peer"
            if not server_name
            else f"Upgrading cluster peer with name='{server_name}'"
        )
        if server_name:
            response_reader = self._proxy_call_to(
                IDXC_UPGRADE_PEER,
                server_name,
                to_version=to_version,
                method=CallMethod.POST,
                body="",
            )
        else:
            response_reader = self._call(
                IDXC_UPGRADE_PEER.endpoint, method=CallMethod.POST, body=""
            )
        json_response = SplunkService._get_entry_content_json_response(response_reader)
        logger.info(f"Upgrade cluster peer response='{json_response}'")
        return SplunkService._list_response_to_object(json_response, to_upgrade_endpoints_response)

    def upgrade_idxc_peer_by_name(
        self, server_name: str, to_version: str
    ) -> UpgradeEndpointsResponse:
        return self._upgrade_idxc_peer_common(to_version, server_name)

    def get_cm_info(self) -> CmInfo:
        logger.info("Getting cm info")
        response_reader = self._call(CM_INFO.endpoint)
        json_response = SplunkService._get_entry_content_json_response(response_reader)
        logger.info(f"Cm info response='{json_response}'")
        return SplunkService._list_response_to_object(json_response, to_cm_info)

    def get_connected_search_heads(self) -> List[SearchHead]:
        logger.info("Getting searchheads")
        response_reader = self._call(
            CM_SEARCHHEADS.endpoint, CallMethod.GET, search="status=Connected", count=0
        )
        json_response = SplunkService._get_entry_content_json_response(response_reader)
        logger.info(f"Got {len(json_response)} searchhead records")
        return SplunkService._list_response_to_object_list(json_response, to_searchhead)

    def ensure_user_holds_write_permissions(self, request: bytes) -> None:
        RollingUpgradePermsConfigChecker(request, self.service.apps, self.service.users)
