import logging
import os
import json
from dataclasses import dataclass
from dataclasses import field
from typing import Any, Optional
from splunklib.client import Collection
from splunkupgrade.data.parsing import (
    DataParseException,
    ensure_valid,
    get_field_with_default,
    get_optional_field,
    get_optional_valid_int_config,
    get_valid_int_config_or_default,
    is_positive,
    is_positive_or_zero,
    to_bool,
    throw_for_deprecated,
)
from splunkupgrade.utils.constants import (
    DownloadConfStanza,
    GeneralConstants,
    OrchestratorStanza,
    RequestsConfStanza,
    LoggerConfStanza,
    HookStanza,
    ProcessRunnerConfStanza,
    KVStoreRetryConfStanza,
    ClusterRetryConfStanza,
    PeersReadinessRetryConfigStanza,
)
from splunkupgrade.utils.splunk_sdk_wrapper import get_app_conf
from splunkupgrade.utils.types import JsonObject
from splunkupgrade.utils.utils import (
    get_env_variable,
    get_path_or_none,
)
from splunkupgrade.utils.exceptions import ConfigurationError, PermissionError

logger = logging.getLogger(__name__)


def prepare_hook_path(raw_path: str) -> str:
    path = os.path.expandvars(raw_path)
    if not os.path.isabs(path):
        raise DataParseException(
            f"Fields {HookStanza.INSTALL_SCRIPT_PATH} and {HookStanza.CONTROL_SCRIPT_PATH} must both be absolute paths"
        )
    return path


def get_default_script_path() -> str:
    return os.path.join(
        get_env_variable(GeneralConstants.SPLUNK_HOME),
        GeneralConstants.ARCHIVE_INSTALLER_RELATIVE_PATH,
    )


def get_default_splunk_control_script_path() -> str:
    return os.path.join(
        get_env_variable(GeneralConstants.SPLUNK_HOME),
        GeneralConstants.SPLUNK_CONTROLLER_RELATIVE_PATH,
    )


@dataclass
class HookConfig:
    install_script_path: str = field(default_factory=get_default_script_path)
    control_script_path: str = field(default_factory=get_default_splunk_control_script_path)

    @staticmethod
    def from_dict(config_stanza: dict) -> "HookConfig":
        path_raw = get_field_with_default(
            config_stanza, HookStanza.INSTALL_SCRIPT_PATH, str, get_default_script_path()
        )
        path = prepare_hook_path(path_raw)
        if not os.path.isfile(path):
            raise DataParseException(
                f"Field '{HookStanza.INSTALL_SCRIPT_PATH}' must point to an existing file"
            )

        control_path_raw = get_field_with_default(
            config_stanza,
            HookStanza.CONTROL_SCRIPT_PATH,
            str,
            get_default_splunk_control_script_path(),
        )
        control_path = prepare_hook_path(control_path_raw)
        if not os.path.isfile(control_path):
            raise DataParseException(
                f"Field '{HookStanza.CONTROL_SCRIPT_PATH}' must point to an existing file"
            )
        return HookConfig(path, control_path)


@dataclass
class KVStoreRetryConfig:
    DEFAULT_MAX_TRIES = 10
    DEFAULT_INITIAL_DELAY_AFTER_EACH_RETRY = 20

    max_tries: int = DEFAULT_MAX_TRIES
    initial_delay_after_each_retry: int = DEFAULT_INITIAL_DELAY_AFTER_EACH_RETRY

    def __post_init__(self):
        ensure_valid(self.max_tries, is_positive)
        ensure_valid(self.initial_delay_after_each_retry, is_positive_or_zero)

    @staticmethod
    def from_dict(config_stanza: dict) -> "KVStoreRetryConfig":
        max_tries = get_valid_int_config_or_default(
            config_stanza,
            KVStoreRetryConfStanza.MAX_TRIES,
            KVStoreRetryConfig.DEFAULT_MAX_TRIES,
            is_positive,
        )
        initial_delay = get_valid_int_config_or_default(
            config_stanza,
            KVStoreRetryConfStanza.INITIAL_DELAY_AFTER_EACH_RETRY,
            KVStoreRetryConfig.DEFAULT_INITIAL_DELAY_AFTER_EACH_RETRY,
            is_positive_or_zero,
        )
        return KVStoreRetryConfig(max_tries, initial_delay)


@dataclass
class ClusterRetryConfig:
    DEFAULT_MAX_TRIES = 10
    DEFAULT_INITIAL_DELAY_AFTER_EACH_RETRY = 20

    max_tries: int = DEFAULT_MAX_TRIES
    initial_delay_after_each_retry: int = DEFAULT_INITIAL_DELAY_AFTER_EACH_RETRY

    def __post_init__(self):
        ensure_valid(self.max_tries, is_positive)
        ensure_valid(self.initial_delay_after_each_retry, is_positive_or_zero)

    @staticmethod
    def from_dict(config_stanza: dict) -> "ClusterRetryConfig":
        max_tries = get_valid_int_config_or_default(
            config_stanza,
            ClusterRetryConfStanza.MAX_TRIES,
            ClusterRetryConfig.DEFAULT_MAX_TRIES,
            is_positive,
        )
        initial_delay = get_valid_int_config_or_default(
            config_stanza,
            ClusterRetryConfStanza.INITIAL_DELAY_AFTER_EACH_RETRY,
            ClusterRetryConfig.DEFAULT_INITIAL_DELAY_AFTER_EACH_RETRY,
            is_positive_or_zero,
        )
        return ClusterRetryConfig(max_tries, initial_delay)


@dataclass
class PeersReadinessRetryConfig:
    DEFAULT_MAX_TRIES = 20
    DEFAULT_INITIAL_DELAY_AFTER_EACH_RETRY = 20

    max_tries: int = DEFAULT_MAX_TRIES
    initial_delay_after_each_retry: int = DEFAULT_INITIAL_DELAY_AFTER_EACH_RETRY

    def __post_init__(self):
        ensure_valid(self.max_tries, is_positive)
        ensure_valid(self.initial_delay_after_each_retry, is_positive_or_zero)

    @staticmethod
    def from_dict(config_stanza: dict) -> "PeersReadinessRetryConfig":
        max_tries = get_valid_int_config_or_default(
            config_stanza,
            PeersReadinessRetryConfigStanza.MAX_TRIES,
            PeersReadinessRetryConfig.DEFAULT_MAX_TRIES,
            is_positive,
        )
        initial_delay = get_valid_int_config_or_default(
            config_stanza,
            PeersReadinessRetryConfigStanza.INITIAL_DELAY_AFTER_EACH_RETRY,
            PeersReadinessRetryConfig.DEFAULT_INITIAL_DELAY_AFTER_EACH_RETRY,
            is_positive_or_zero,
        )
        return PeersReadinessRetryConfig(max_tries, initial_delay)


@dataclass
class ProcessRunnerConfig:
    DEFAULT_PROCESS_RUNNER_TIMEOUT = 600

    timeout: int = DEFAULT_PROCESS_RUNNER_TIMEOUT

    @staticmethod
    def from_dict(config_stanza: dict) -> "ProcessRunnerConfig":
        parsed_timeout = get_valid_int_config_or_default(
            config_stanza,
            ProcessRunnerConfStanza.TIMEOUT,
            ProcessRunnerConfig.DEFAULT_PROCESS_RUNNER_TIMEOUT,
            is_positive,
        )
        return ProcessRunnerConfig(parsed_timeout)


@dataclass
class LoggerConfig:
    DEFAULT_LOGGER_LEVEL = "INFO"

    log_level: str = DEFAULT_LOGGER_LEVEL

    @staticmethod
    def from_dict(config_stanza: dict) -> "LoggerConfig":
        # NOTE: This weird implementation is based on logging::getLevelName() behavior, in particular
        # Python claims "If no matching numeric or string value is passed in, the string ‘Level %s’ % level is returned".
        #
        # See: https://docs.python.org/3/library/logging.html
        def is_valid_logger_level(logger_level_name_from_conf: str) -> bool:
            level_name = logging.getLevelName(logger_level_name_from_conf)
            return not level_name == f"Level {logger_level_name_from_conf}"

        str_value = get_field_with_default(
            config_stanza, LoggerConfStanza.LOG_LEVEL, str, LoggerConfig.DEFAULT_LOGGER_LEVEL
        )
        logger_level = (
            str_value if is_valid_logger_level(str_value) else LoggerConfig.DEFAULT_LOGGER_LEVEL
        )
        return LoggerConfig(logger_level)


@dataclass
class RequestConfig:
    DEFAULT_RETRIES = 2
    DEFAULT_DELAY = 1
    DEFAULT_REQUEST_TIMEOUT = 30

    retries: int = DEFAULT_RETRIES
    retry_delay: int = DEFAULT_DELAY
    timeout: int = DEFAULT_REQUEST_TIMEOUT

    def __post_init__(self):
        ensure_valid(self.retries, is_positive)
        ensure_valid(self.retry_delay, is_positive_or_zero)
        ensure_valid(self.timeout, is_positive)

    @staticmethod
    def from_dict(config_stanza: dict) -> "RequestConfig":
        retries = get_valid_int_config_or_default(
            config_stanza, RequestsConfStanza.RETRIES, RequestConfig.DEFAULT_RETRIES, is_positive
        )
        retry_delay = get_valid_int_config_or_default(
            config_stanza,
            RequestsConfStanza.RETRY_DELAY,
            RequestConfig.DEFAULT_DELAY,
            is_positive_or_zero,
        )
        timeout = get_valid_int_config_or_default(
            config_stanza,
            RequestsConfStanza.TIMEOUT,
            RequestConfig.DEFAULT_REQUEST_TIMEOUT,
            is_positive,
        )
        return RequestConfig(retries, retry_delay, timeout)


@dataclass
class DownloaderConfig:
    package_path: Optional[str] = None
    checksum: Optional[str] = None
    checksum_deprecated: Optional[str] = None

    @staticmethod
    def from_dict(config_stanza: dict) -> "DownloaderConfig":
        package_path = get_optional_field(config_stanza, DownloadConfStanza.PACKAGE_PATH, str)
        checksum_deprecated = get_optional_field(
            config_stanza, DownloadConfStanza.CHECKSUM_DEPRECATED, str
        )
        checksum = get_optional_field(config_stanza, DownloadConfStanza.CHECKSUM, str)

        return DownloaderConfig(package_path, checksum, checksum_deprecated)


@dataclass
class OrchestratorConfig:
    DEFAULT_MAX_TRIES = 30
    DEFAULT_DELAY_AFTER_EACH_RETRY = 20
    DEFAULT_USE_CHECKPOINT = True
    DEFAULT_CHECKPOINT_MAX_TRIES = 3
    DEFAULT_CHECKPOINT_RETRY_DELAY = 20

    max_tries: int = DEFAULT_MAX_TRIES
    delay_after_each_retry: int = DEFAULT_DELAY_AFTER_EACH_RETRY
    concurrency: Optional[int] = None

    enable_midpoint_status_check: bool = DEFAULT_USE_CHECKPOINT
    midpoint_check_max_tries: int = DEFAULT_CHECKPOINT_MAX_TRIES
    midpoint_check_retry_delay: int = DEFAULT_CHECKPOINT_RETRY_DELAY

    def __post_init__(self):
        ensure_valid(self.max_tries, is_positive)
        ensure_valid(self.delay_after_each_retry, is_positive_or_zero)
        ensure_valid(self.midpoint_check_max_tries, is_positive)
        ensure_valid(self.midpoint_check_retry_delay, is_positive_or_zero)

    @staticmethod
    def from_dict(config_stanza: dict) -> "OrchestratorConfig":
        max_tries = get_valid_int_config_or_default(
            config_stanza,
            OrchestratorStanza.UPGRADE_CHECK_MAX_TRIES,
            OrchestratorConfig.DEFAULT_MAX_TRIES,
            is_positive,
        )
        initial_delay = get_valid_int_config_or_default(
            config_stanza,
            OrchestratorStanza.DELAY_AFTER_EACH_UPGRADE_CHECK,
            OrchestratorConfig.DEFAULT_DELAY_AFTER_EACH_RETRY,
            is_positive_or_zero,
        )
        concurrency = get_optional_valid_int_config(
            config_stanza, OrchestratorStanza.CONCURRENCY, is_positive
        )
        enable_midupgrade_check = to_bool(
            get_field_with_default(
                config_stanza,
                OrchestratorStanza.ENABLE_MIDPOINT_STATUS_CHECK,
                str,
                str(OrchestratorConfig.DEFAULT_USE_CHECKPOINT),
            )
        )
        midupgrade_check_retries = get_valid_int_config_or_default(
            config_stanza,
            OrchestratorStanza.MIDPOINT_CHECK_MAX_TRIES,
            OrchestratorConfig.DEFAULT_CHECKPOINT_MAX_TRIES,
            is_positive,
        )
        midupgrade_check_delay = get_valid_int_config_or_default(
            config_stanza,
            OrchestratorStanza.MIDPOINT_CHECK_RETRY_DELAY,
            OrchestratorConfig.DEFAULT_CHECKPOINT_RETRY_DELAY,
            is_positive_or_zero,
        )
        return OrchestratorConfig(
            max_tries,
            initial_delay,
            concurrency,
            enable_midupgrade_check,
            midupgrade_check_retries,
            midupgrade_check_delay,
        )


def get_config_stanza(config: JsonObject, stanza_name: str, returned_type: type) -> Any:
    generic_config = get_path_or_none(config, stanza_name)
    rt = returned_type()
    return rt if not generic_config else rt.from_dict(generic_config)


# separate from RollingUpgradeConfig because it's used in logger_utils.py
def get_logger_config(config: JsonObject) -> LoggerConfig:
    return get_config_stanza(config, LoggerConfStanza.STANZA_NAME, LoggerConfig)


class RollingUpgradeConfig:
    def __init__(
        self, config: Optional[JsonObject] = None, allow_deprecated_checksum: bool = False
    ):
        try:
            json_config = self.get() if config is None else config
            self.requests_timeout_config = RollingUpgradeConfig._get_request_config(json_config)
            self.proces_runner_config = RollingUpgradeConfig._get_process_runner_config(json_config)
            self.kv_store_retry_config = RollingUpgradeConfig._get_kvstore_retry_config(json_config)
            self.cluster_retry_config = RollingUpgradeConfig._get_cluster_retry_config(json_config)
            self.peer_readiness_retry_config = (
                RollingUpgradeConfig._get_peers_readiness_retry_config(json_config)
            )
            self.orchestrator_config = RollingUpgradeConfig._get_orchestrator_config(json_config)
            self.downloader_config = RollingUpgradeConfig._get_downloader_config(
                json_config, allow_deprecated_checksum
            )
            self.hook_config = RollingUpgradeConfig._get_hook_config(json_config)
            self.logger_config = get_logger_config(json_config)
        except DataParseException as e:
            raise ConfigurationError(str(e))

    @staticmethod
    def get() -> dict:
        return get_app_conf(GeneralConstants.ROLLING_UPGRADE_CONF)

    # TODO: not sure if this will be generic enough to change everything, however it might be a good
    #       candidate to it. Once all the configs are changed/refactored we'll see if we should move
    #       it directly to RollingUpgradeConfig() as RollingUpgradeConfig::get(stanza_name), and probably
    #       move the RollingUpgradeConfig() construction outside gen_config_stanza() in order to call only
    #       once btool.

    @staticmethod
    def _get_hook_config(config: JsonObject) -> HookConfig:
        return get_config_stanza(config, HookStanza.STANZA_NAME, HookConfig)

    @staticmethod
    def _get_process_runner_config(config: JsonObject) -> ProcessRunnerConfig:
        return get_config_stanza(config, ProcessRunnerConfStanza.STANZA_NAME, ProcessRunnerConfig)

    @staticmethod
    def _get_kvstore_retry_config(config: JsonObject) -> KVStoreRetryConfig:
        return get_config_stanza(config, KVStoreRetryConfStanza.STANZA_NAME, KVStoreRetryConfig)

    @staticmethod
    def _get_cluster_retry_config(config: JsonObject) -> ClusterRetryConfig:
        return get_config_stanza(config, ClusterRetryConfStanza.STANZA_NAME, ClusterRetryConfig)

    @staticmethod
    def _get_peers_readiness_retry_config(config: JsonObject) -> PeersReadinessRetryConfig:
        return get_config_stanza(
            config, PeersReadinessRetryConfigStanza.STANZA_NAME, PeersReadinessRetryConfig
        )

    @staticmethod
    def _get_orchestrator_config(config: JsonObject) -> OrchestratorConfig:
        return get_config_stanza(config, OrchestratorStanza.STANZA_NAME, OrchestratorConfig)

    @staticmethod
    def _get_request_config(config: JsonObject) -> RequestConfig:
        return get_config_stanza(config, RequestsConfStanza.STANZA_NAME, RequestConfig)

    @staticmethod
    def _get_downloader_config(
        config: JsonObject, allow_deprecated_checksum: bool = False
    ) -> DownloaderConfig:
        downloader_config = get_config_stanza(
            config, DownloadConfStanza.STANZA_NAME, DownloaderConfig
        )

        if allow_deprecated_checksum:
            if downloader_config.checksum_deprecated is not None:
                logger.warning(
                    f"Field '{DownloadConfStanza.CHECKSUM_DEPRECATED}' is deprecated; use '{DownloadConfStanza.CHECKSUM}' instead.",
                )
                if downloader_config.checksum is None:
                    downloader_config.checksum = downloader_config.checksum_deprecated
        else:
            throw_for_deprecated(
                DownloadConfStanza.CHECKSUM_DEPRECATED,
                downloader_config.checksum_deprecated,
                DownloadConfStanza.CHECKSUM,
            )
        return downloader_config


class RollingUpgradePermsConfigChecker:
    def __init__(self, request: bytes, apps: Collection, users: Collection):
        self._app_write_roles = self._get_roles_that_can_write_with_app_or_raise(apps)
        self._user = self._get_username_or_raise(request)
        self._user_roles = self._get_user_roles_or_raise(self._user, users)
        self._ensure_user_holds_required_role_or_raise()

    def _ensure_user_holds_required_role_or_raise(self) -> None:
        if not any(user_role in self._app_write_roles for user_role in self._user_roles):
            raise PermissionError(
                f"User {self._user} does not have role required to perform rolling upgrade. User roles: {self._user_roles}, required roles: {self._app_write_roles}"
            )

    @staticmethod
    def _get_roles_that_can_write_with_app_or_raise(apps: Collection) -> list[str]:
        perms = get_path_or_none(apps, GeneralConstants.APP_NAME, "access", "perms", "write")
        if perms is None:
            raise PermissionError(
                f"Couldn't fetch permissions needed to use the {GeneralConstants.APP_NAME} app"
            )
        return perms

    @staticmethod
    def _get_username_or_raise(request: bytes) -> str:
        json_request = json.loads(request.decode("utf-8"))
        user = get_path_or_none(json_request, "session", "user")
        if user is None:
            raise PermissionError("Couldn't fetch name of the current user")
        return user

    @staticmethod
    def _get_user_roles_or_raise(user: str, users: Collection) -> list[str]:
        user_roles = get_path_or_none(users, user, "roles")
        if user_roles is None:
            raise PermissionError(f"Couldn't fetch roles of the current user: {user}")
        return user_roles
