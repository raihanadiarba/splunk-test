import logging
import os
import sys

current_path = os.path.dirname(os.path.realpath(__file__))
app_specific_lib_path = os.path.join(current_path, "..", "lib")
sys.path.insert(0, app_specific_lib_path)

from splunkupgrade.utils.logger_utils import (
    initialize_logger_for_completion_script,
)

initialize_logger_for_completion_script()

import splunk.entity as entity
from splunkupgrade.utils.app_conf import RollingUpgradeConfig
from splunkupgrade.utils.complete_upgrade import StandaloneUpgradeCompletion, UpgradeCompletion
from splunkupgrade.utils.splunk_service import SplunkService
from splunkupgrade.upgrader.upgrader_utils import try_fail_upgrade, UpgraderConfig, StatusUpdater
from collections import namedtuple
from typing import Tuple, Optional
from splunkupgrade.data.parsing import get_field, DataParseException
from splunkupgrade.utils.constants import GeneralConstants, SHC_UPGRADE_NOT_SUPPORTED_PEER
from splunkupgrade.utils.server_roles_mapper import ServerRolesMapper
from splunkupgrade.utils.utils import get_env_variable
from splunkupgrade.upgrader.telemetry_utils import (
    TelemetryStatus,
    telemetry_shc_log,
    role_to_telemetry_deployment_type,
    TELEMETRY_VERSION_UNKNOWN,
)


HostPortServername = namedtuple("HostPortServername", ["host", "port", "servername"])
logger = logging.getLogger(__name__)


def get_host_settings(session_key: str) -> HostPortServername:
    logger.info("Getting server settings")
    ent = entity.getEntity("/server", "settings", sessionKey=session_key, namespace="-", owner="-")
    host = get_field(ent, "host", str)
    port = get_field(ent, "mgmtHostPort", str)
    server_name = get_field(ent, "serverName", str)
    try:
        int_port = int(port)
    except ValueError:
        raise DataParseException("Failed to convert management port field to int")
    logger.info(f"Host='{host}', port='{int_port}', servername='{server_name}'")
    return HostPortServername(host, int_port, server_name)


def try_getting_versions(service: SplunkService) -> Tuple[str, str]:
    from_version = TELEMETRY_VERSION_UNKNOWN
    to_version = TELEMETRY_VERSION_UNKNOWN
    try:
        curr_progress = StatusUpdater(service).get_current_progress()
        from_version = curr_progress.from_version
        to_version = curr_progress.to_version
    except Exception as e:
        logger.error(f"Cannot get from_version/to_version from the kvstore: {e}")

    return from_version, to_version


def complete_upgrade() -> None:
    logger.info(f"Starting the completion script, pid: {os.getpid()}")
    service = None
    servername = None
    role_mapper = None
    try:
        trigger_file = os.path.join(
            get_env_variable(GeneralConstants.SPLUNK_HOME),
            GeneralConstants.UPGRADE_FILE_RELATIVE_PATH,
        )
        logger.info(f"Trigger file path='{trigger_file}'")
        if not os.path.exists(trigger_file):
            logger.info("Trigger file does not exist")
            return
        os.remove(trigger_file)

        # todo: add a configurable timeout for read()
        logger.info("Reading session key from the stdin")
        session_key = sys.stdin.read()
        host, port, servername = get_host_settings(session_key)
        config = RollingUpgradeConfig(allow_deprecated_checksum=True)
        service = SplunkService.from_session_key(
            host, port, session_key, config.requests_timeout_config
        )
        role_mapper = ServerRolesMapper(service.get_server_roles())
        if role_mapper.is_deployer_only() or role_mapper.is_standalone_search_head():
            completer = StandaloneUpgradeCompletion(
                service, UpgraderConfig(servername, trigger_file, config)
            )
        elif role_mapper.is_shc_peer():
            completer = UpgradeCompletion(service, UpgraderConfig(servername, trigger_file, config))
        else:
            logger.info(SHC_UPGRADE_NOT_SUPPORTED_PEER)
            return
        if not completer.complete_upgrade():
            raise Exception("Completion script failed")
    except Exception as e:
        logger.error(f"Error during upgrade finalisation: {e}")
        from_version, to_version = try_getting_versions(service)
        logger.error(
            telemetry_shc_log(
                "SHC Rolling Upgrade failed",
                -1,
                [servername],
                TelemetryStatus.FAILED,
                role_to_telemetry_deployment_type(role_mapper),
                "Error during upgrade finalisation",
                from_version,
                to_version,
            )
        )
        if service:
            try_fail_upgrade(service)


if __name__ == "__main__":
    complete_upgrade()
