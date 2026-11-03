import os
import sys

current_path = os.path.dirname(os.path.realpath(__file__))
app_specific_lib_path = os.path.join(current_path, "..", "lib")
sys.path.insert(0, app_specific_lib_path)

import logging
from splunkupgrade.utils.logger_utils import initialize_logger_for_idxc_upgrader

initialize_logger_for_idxc_upgrader()


from splunkupgrade.upgrader.upgrader_core import (
    parse_command_line,
    create_splunk_service,
)
from splunkupgrade.upgrader.upgrader_indexer_core import execute_splunk_indexer_upgrade
from splunkupgrade.utils.app_conf import RollingUpgradeConfig
from splunkupgrade.utils.constants import ExitCodes
from splunkupgrade.upgrader.upgrader_utils import IndexerUpgraderConfig

logger = logging.getLogger(__name__)


if __name__ == "__main__":
    try:
        peer_name, session_key, rest_uri, to_version = parse_command_line()
        app_config = RollingUpgradeConfig()
        service = create_splunk_service(session_key, rest_uri, app_config.requests_timeout_config)
        if not service:
            sys.exit(ExitCodes.ERROR_WHEN_UPGRADING)

        config = IndexerUpgraderConfig(peer_name, app_config, session_key)
        return_code = execute_splunk_indexer_upgrade(service, config, to_version)
        sys.exit(return_code.value)
    except Exception as e:
        logger.error(f"Error when upgrading indexer {peer_name}: {e}")
        sys.exit(ExitCodes.ERROR_WHEN_UPGRADING)
