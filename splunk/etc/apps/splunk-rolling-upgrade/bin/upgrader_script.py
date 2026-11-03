import os
import sys

current_path = os.path.dirname(os.path.realpath(__file__))
app_specific_lib_path = os.path.join(current_path, "..", "lib")
sys.path.insert(0, app_specific_lib_path)

import logging
from splunkupgrade.utils.logger_utils import initialize_logger_for_upgrader

initialize_logger_for_upgrader()


from splunkupgrade.upgrader.upgrader_core import (
    parse_command_line,
    execute_splunk_upgrade,
    create_splunk_service,
)
from splunkupgrade.upgrader.upgrader_utils import UpgraderConfig
from splunkupgrade.utils.app_conf import RollingUpgradeConfig
from splunkupgrade.utils.constants import ExitCodes, GeneralConstants
from splunkupgrade.utils.utils import get_env_variable

logger = logging.getLogger(__name__)


if __name__ == "__main__":
    try:
        peer_name, session_key, rest_uri, _ = parse_command_line()
        trigger_file = os.path.join(
            get_env_variable(GeneralConstants.SPLUNK_HOME),
            GeneralConstants.UPGRADE_FILE_RELATIVE_PATH,
        )
        app_config = RollingUpgradeConfig()
        service = create_splunk_service(session_key, rest_uri, app_config.requests_timeout_config)
        if not service:
            sys.exit(ExitCodes.ERROR_WHEN_UPGRADING)

        upgrader_config = UpgraderConfig(peer_name, trigger_file, app_config)
        return_code = execute_splunk_upgrade(service, upgrader_config)
        sys.exit(return_code.value)
    except Exception as e:
        logger.error(f"Error when upgrading {e}")
        sys.exit(ExitCodes.ERROR_WHEN_UPGRADING)
