import os
import sys

current_path = os.path.dirname(os.path.realpath(__file__))
app_specific_lib_path = os.path.join(current_path, "..", "lib")
sys.path.insert(0, app_specific_lib_path)


import logging
from splunkupgrade.utils.logger_utils import initialize_logger_for_idxc_upgrader

initialize_logger_for_idxc_upgrader()

from typing import Tuple
from splunkupgrade.cli.parser import create_upgrader_cli_parser
from splunkupgrade.upgrader.upgrader_core import (
    create_splunk_service,
)
from splunkupgrade.upgrader.upgrade_orchestrator import UpgradeOrchestrator
from splunkupgrade.data.parsing import to_bool
from splunkupgrade.utils.app_conf import RollingUpgradeConfig
from splunkupgrade.utils.constants import ExitCodes

logger = logging.getLogger(__name__)


def parse_command_line() -> Tuple[str, str, str, bool]:
    parser = create_upgrader_cli_parser()
    parser.add_argument(
        "-s",
        "--skip_checkpoint",
        type=str,
        required=True,
        help="Skips mid upgrade status check",
    )
    args = parser.parse_args()
    return args.peer_name, args.session_key, args.rest_uri, to_bool(args.skip_checkpoint)


if __name__ == "__main__":
    try:
        peer_name, session_key, rest_uri, skip_checkpoint = parse_command_line()
        app_config = RollingUpgradeConfig()
        service = create_splunk_service(session_key, rest_uri, app_config.requests_timeout_config)
        if not service:
            sys.exit(ExitCodes.ERROR_WHEN_UPGRADING)
        return_code = UpgradeOrchestrator(
            service, app_config.orchestrator_config, skip_checkpoint
        ).run_orchestrator()
        sys.exit(return_code.value)
    except Exception as e:
        logger.error(f"Error when upgrading {e}")
        sys.exit(ExitCodes.ERROR_WHEN_UPGRADING)
