import logging.handlers

from splunkupgrade.utils.app_conf import get_logger_config, RollingUpgradeConfig
from splunkupgrade.utils.splunk_sdk_wrapper import splunkhome_path


def initialize_logger(log_base_file_name):
    # TODO: read the logger level from our config file
    log_file_name = splunkhome_path(["var", "log", "splunk", log_base_file_name])
    logger_handler = logging.handlers.RotatingFileHandler(
        log_file_name, maxBytes=10485760, backupCount=10
    )
    logging.basicConfig(
        level=get_logger_config(RollingUpgradeConfig.get()).log_level,
        handlers=[logger_handler],
        format="%(asctime)s | %(name)s | %(levelname)s | %(message)s",
    )


PROXY_ENDPOINTS_LOG_BASE_FILE_NAME = "splunk_proxy_rest_endpoints.log"

UPGRADER_SCRIPT_LOG_BASE_FILE_NAME = "splunk_shc_upgrade_upgrader_script.log"
REST_ENDPOINTS_LOG_BASE_FILE_NAME = "splunk_shc_upgrade_rest_endpoints.log"
COMPLETION_SCRIPT_LOG_BASE_FILE_NAME = "splunk_shc_upgrade_completion_script.log"

UPGRADER_SCRIPT_LOG_BASE_IDXC_FILE_NAME = "splunk_idxc_upgrade_upgrader_script.log"
REST_ENDPOINTS_LOG_BASE_IDXC_FILE_NAME = "splunk_idxc_upgrade_rest_endpoints.log"


def initialize_logger_for_upgrader():
    initialize_logger(UPGRADER_SCRIPT_LOG_BASE_FILE_NAME)


def initialize_logger_for_rest_endpoints():
    initialize_logger(REST_ENDPOINTS_LOG_BASE_FILE_NAME)


def initialize_logger_for_completion_script():
    initialize_logger(COMPLETION_SCRIPT_LOG_BASE_FILE_NAME)


def initialize_logger_for_idxc_upgrader():
    initialize_logger(UPGRADER_SCRIPT_LOG_BASE_IDXC_FILE_NAME)


def initialize_logger_for_idxc_rest_endpoints():
    initialize_logger(REST_ENDPOINTS_LOG_BASE_IDXC_FILE_NAME)


def initialize_logger_for_proxy_rest_endpoints():
    initialize_logger(PROXY_ENDPOINTS_LOG_BASE_FILE_NAME)


def log_handling_exception(logger: logging.Logger, e: Exception) -> None:
    logger.error(f"Exception when processing {e}")
