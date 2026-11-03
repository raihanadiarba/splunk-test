import os
from enum import Enum, IntEnum


def get_relative_path_to_app_executable(app_name: str, name: str) -> str:
    return os.path.join("etc", "apps", app_name, "bin", name)


class GeneralConstants:
    APP_NAME = "splunk-rolling-upgrade"
    ROLLING_UPGRADE_CONF = "rolling_upgrade"
    INPUTS_CONF = "inputs"
    SERVER_CONF = "server"
    SHC_COLLECTION_NAME = "shcupgrade"
    IDX_CURRENT_COLLECTION_NAME = "idxcurrent"
    IDX_PEERS_COLLECTION_NAME = "idxpeers"
    UPGRADER_NAME = "upgrader_script.py"
    ORCHESTRATOR_NAME = "orchestrator_script.py"
    IDX_UPGRADER_NAME = "indexer_upgrader_script.py"
    UPGRADER_RELATIVE_PATH = get_relative_path_to_app_executable(APP_NAME, UPGRADER_NAME)
    ORCHESTRATOR_RELATIVE_PATH = get_relative_path_to_app_executable(APP_NAME, ORCHESTRATOR_NAME)
    IDX_UPGRADER_RELATIVE_PATH = get_relative_path_to_app_executable(APP_NAME, IDX_UPGRADER_NAME)
    UPGRADE_FILE_RELATIVE_PATH = os.path.join("var", "run", "splunk", "trigger-rolling-upgrade")
    SPLUNK_HOME = "SPLUNK_HOME"
    DOWNLOADED_PACKAGE_PATH_ENV_VAR = "SPLUNK_NEW_PACKAGE_PATH"
    ARCHIVE_INSTALLER_NAME = "install_tgz.sh"
    ARCHIVE_INSTALLER_RELATIVE_PATH = os.path.join(
        "etc", "apps", APP_NAME, "hooks", ARCHIVE_INSTALLER_NAME
    )
    SPLUNK_CONTROLLER_NAME = "splunk_control.sh"
    SPLUNK_CONTROLLER_RELATIVE_PATH = os.path.join(
        "etc", "apps", APP_NAME, "hooks", SPLUNK_CONTROLLER_NAME
    )
    OUTPUT_MODE = "output_mode"
    TO_VERSION = "to_version"
    FORCE = "force"
    DEFAULT_FORCE_VALUE = "false"
    QUERY = "query"
    METHOD = "method"
    QUERY_MISSING_VALUE_IN_REQUEST = ""
    PAYLOAD = "payload"


class RequestsConfStanza:
    STANZA_NAME = "requests"
    RETRIES = "retries"
    RETRY_DELAY = "delay"
    TIMEOUT = "timeout"


class LoggerConfStanza:
    STANZA_NAME = "logging"
    LOG_LEVEL = "log_level"


class ProcessRunnerConfStanza:
    STANZA_NAME = "process_runner"
    TIMEOUT = "timeout"


class KVStoreRetryConfStanza:
    STANZA_NAME = "kvstore_retry"
    MAX_TRIES = "max_tries"
    INITIAL_DELAY_AFTER_EACH_RETRY = "initial_delay_after_each_retry"


class ClusterRetryConfStanza:
    STANZA_NAME = "cluster_retry"
    MAX_TRIES = "max_tries"
    INITIAL_DELAY_AFTER_EACH_RETRY = "initial_delay_after_each_retry"


class PeersReadinessRetryConfigStanza:
    STANZA_NAME = "shcluster_members_retry"
    MAX_TRIES = "max_tries"
    INITIAL_DELAY_AFTER_EACH_RETRY = "initial_delay_after_each_retry"


class OrchestratorStanza:
    STANZA_NAME = "orchestrator"
    UPGRADE_CHECK_MAX_TRIES = "upgrade_check_max_tries"
    CONCURRENCY = "concurrency"
    DELAY_AFTER_EACH_UPGRADE_CHECK = "delay_after_each_upgrade_check"
    ENABLE_MIDPOINT_STATUS_CHECK = "enable_midpoint_status_check"
    MIDPOINT_CHECK_MAX_TRIES = "midpoint_check_max_tries"
    MIDPOINT_CHECK_RETRY_DELAY = "midpoint_check_retry_delay"


class DownloadConfStanza:
    STANZA_NAME = "downloader"
    PACKAGE_PATH = "package_path"
    CHECKSUM_DEPRECATED = "md5_checksum"
    CHECKSUM = "sha256_checksum"


class HookStanza:
    STANZA_NAME = "hook"
    INSTALL_SCRIPT_PATH = "install_script_path"
    CONTROL_SCRIPT_PATH = "control_script_path"


class ClusteringConfStanza:
    STANZA_NAME = "clustering"
    MANAGER_SWITCHOVER_MODE = "manager_switchover_mode"


class RollingUpgradeInputsConfStanza:
    STANZA_NAME = "script://$SPLUNK_HOME/etc/apps/splunk-rolling-upgrade/bin/complete.py"
    PASS_AUTH = "passAuth"


class ShcStatusKeys:
    PEERS = "peers"
    DYNAMIC_CAPTAIN = "dynamic_captain"
    STABLE_CAPTAIN = "stable_captain"
    MAX_FAILURES_TO_KEEP_MAJORITY = "max_failures_to_keep_majority"
    SERVICE_READY_FLAG = "service_ready_flag"
    ROLLING_RESTART_FLAG = "rolling_restart_flag"
    ROLLING_UPGRADE_FLAG = "rolling_upgrade_flag"
    CAPTAIN = "captain"
    OUT_OF_SYNC_NODE = "out_of_sync_node"
    LABEL = "label"
    MANUAL_DETENTION = "manual_detention"
    MANAGEMENT_URI = "mgmt_uri"
    SPLUNK_VERSION = "splunk_version"
    STATUS = "status"


class KvStoreStatusKeys:
    CURRENT = "current"
    STATUS = "status"


class KvStoreUpgradeRecordKeys:
    ID = "id"
    STATUS = "status"
    PEERS = "peers"
    PEER_NAME = "name"
    PEER_STATUS = "status"
    PEER_TIMESTAMP = "timestamp"
    PEER_UPGRADER_PID = "upgrader_pid"
    PEER_COMPLETION_PID = "completion_pid"
    FROM_VERSION = "from_version"
    TO_VERSION = "to_version"
    KEY = "_key"


class KvStoreIdxCurrentRecordKeys:
    TIMESTAMP = "timestamp"
    ID = "id"
    UPGRADER_PID = "upgrader_pid"
    FROM_VERSION = "from_version"
    TO_VERSION = "to_version"
    STATUS = "status"
    KEY = "_key"


class KvStoreIdxPeersRecordKeys:
    ID = "id"
    PEERS = "peers"
    PEER_ID = "id"
    PEER_NAME = "name"
    PEER_TIMESTAMP = "timestamp"
    PEER_STATUS = "status"
    PEER_SITE = "site"
    ORCHESTRATOR_PID = "orchestrator_pid"
    FROM_VERSION = "from_version"
    TO_VERSION = "to_version"
    OVERALL_STATUS = "overall_status"
    KEY = "_key"
    PEER_UPGRADER_PID = "upgrader_pid"


class ServerRolesKeys:
    ROLE_LIST = "role_list"


class InitiateUpgradeResponseKeys:
    SUCCESS = "success"


class ProxyNodeKeys:
    PROXY_TO = "proxy_to"
    SERVERNAME = "servername"
    ROLE = "role"
    NODES = "nodes"


class UpgradeEnpointsResponseKeys:
    MESSAGE = "message"
    STATUS = "status"
    STATUS_CODE = "status_code"
    PAYLOAD = "payload"
    PID = "pid"


class ShcManualDetectionMode(Enum):
    ON = "on"
    OFF = "off"


class ExitCodes(IntEnum):
    OK = 0
    UNSUPPORTED_UPGRADE = 1
    ERROR_WHEN_UPGRADING = 2


class UpgradeShcStatusResponsePeers:
    KEY = "peers"
    NAME = "name"
    STATUS = "status"
    DATE = "last_modified"


class UpgradeStatusKeys:
    MESSAGE = "message"


class UpgradeStatusResponseStats:
    KEY = "statistics"
    PEERS_TO_UPGRADE = "peers_to_upgrade"
    OVERALL_UPGRADED = "overall_peers_upgraded"
    OVERALL_UPGRADED_PERC = "overall_peers_upgraded_percentage"


class UpgradeShcStatusResponseOverallStatus:
    KEY = "upgrade_status"


class ServerInfoKeys:
    SERVERNAME = "serverName"
    VERSION = "version"


# NOTE: This is almost the format used in shcluster-status, like for example:
#       Tue Aug 23 17:33:27 2022.
UPGRADE_STATUS_DATETIME_FORMAT = "%a %b %d %H:%M:%S %Y"


class SearchHeadGenerationKeys:
    CLUSTER_MANAGER_VERSION = "cluster_master_version"


SHC_UPGRADE_NOT_SUPPORTED_PEER = "Peer is not a SHC member/standalone SH/deployer"
KV_STORE_NOT_READY = "Kv store is not ready"
UNSUPPORTED_INSTANCE = "Unsupported instance"
NOT_AVAILABLE = "N/A"
NO_UPGRADE = "no_upgrade"
INTERNAL_ERROR = "Internal error"


class IndexerClusterConfigKeys:
    SITE_FACTOR_ORIGIN = "origin"
    SITE_FACTOR_TOTAL = "total"
    MULTISITE = "multisite"
    REPLICATION_FACTOR = "replication_factor"
    SEARCH_FACTOR = "search_factor"
    SITE_REPLICATION_FACTOR = "site_replication_factor"
    SITE_SEARCH_FACTOR = "site_search_factor"


class IndexerClusterHealthKeys:
    ALL_DATA_IS_SEARCHABLE = "all_data_is_searchable"
    ALL_PEERS_ARE_UP = "all_peers_are_up"
    MULTISITE = "multisite"
    NO_FIXUP_TASKS = "no_fixup_tasks_in_progress"
    PRE_FLIGHT_CHECK = "pre_flight_check"
    REPLICATION_FACTOR_MET = "replication_factor_met"
    SEARCH_FACTOR_MET = "search_factor_met"
    SITE_REPLICATION_FACTOR_MET = "site_replication_factor_met"
    SITE_SEARCH_FACTOR_MET = "site_search_factor_met"
    CM_VERSION_IS_COMPATIBLE = "cm_version_is_compatible"


class IndexerCluserInitiateUpgradeKeys:
    TYPE = "type"
    TEXT = "text"


class IndexerPeerKeys:
    NAME = "name"
    SITE = "site"
    SPLUNK_VERSION = "splunk_version"
    STATUS = "status"
    LABEL = "label"
    CONTENT = "content"


class SingleInstanceType(Enum):
    STANDALONE = "standalone"
    CLUSTER_MANAGER = "cluster_manager"


class CurrentInstanceUpgradeStatus:
    KEY = "current_instance_upgrade"
    UPGRADER_PID = KvStoreIdxCurrentRecordKeys.UPGRADER_PID
    FROM_VERSION = KvStoreIdxCurrentRecordKeys.FROM_VERSION
    TO_VERSION = KvStoreIdxCurrentRecordKeys.TO_VERSION
    STATUS = KvStoreIdxCurrentRecordKeys.STATUS
    LAST_MODIFIED = "last_modified"


class AllPeersUpgradeStatus:
    KEY = "peers_upgrade"
    ORCHESTRATOR_PID = KvStoreIdxPeersRecordKeys.ORCHESTRATOR_PID
    OVERALL_STATUS = KvStoreIdxPeersRecordKeys.OVERALL_STATUS
    PEER_NAME = KvStoreIdxPeersRecordKeys.PEER_NAME
    LAST_MODIFIED = "last_modified"
    PEER_STATUS = KvStoreIdxPeersRecordKeys.PEER_STATUS
    PEER_UPGRADER_PID = "upgrader_pid"
    FROM_VERSION = KvStoreIdxPeersRecordKeys.FROM_VERSION
    TO_VERSION = KvStoreIdxPeersRecordKeys.TO_VERSION
    PEERS = KvStoreIdxPeersRecordKeys.PEERS
    STATISTICS = "statistics"


class CmInfoKeys:
    MAINTENANCE_MODE = "maintenance_mode"
    ROLLING_RESTART_OR_UPGRADE = "rolling_restart_or_upgrade"


class SearchheadKeys:
    LABEL = "label"
    SPLUNK_VERSION = "splunk_version"


class HTTPMethod(Enum):
    GET = "GET"
    POST = "POST"
    CONNECT = "CONNECT"
    DELETE = "DELETE"
    HEAD = "HEAD"
    OPTIONS = "OPTIONS"
    PATCH = "PATCH"
    PUT = "PUT"
    TRACE = "TRACE"
