import argparse
import logging.config
from typing import Optional


logger = logging.getLogger(__name__)


def create_upgrader_cli_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="SHC rolling upgrade automation script")
    parser.add_argument(
        "-p",
        "--peer_name",
        required=True,
        help="SHC label name (returned by $SPLUNK_HOME/bin/splunk show shcluster-status --verbose) we want to upgrade",
    )
    parser.add_argument("-k", "--session_key", required=True, help="Session key for REST calls")
    parser.add_argument(
        "-r",
        "--rest_uri",
        type=str,
        required=True,
        help="Splunk uri for REST call",
    )
    parser.add_argument(
        "-v",
        "--to_version",
        type=str,
        required=False,
        help="Splunk target version for upgrade",
    )
    return parser


def parse_upgrader_command_line_arguments():
    parser = create_upgrader_cli_parser()
    return parser.parse_args()


class UpgraderCommandLineParser:
    def __init__(self):
        try:
            self._args = parse_upgrader_command_line_arguments()
        except ValueError as err:
            logger.error(f"Upgrader Command line parsing error {err}")
            raise err

    def peer_name(self) -> str:
        return self._args.peer_name

    def session_key(self) -> str:
        return self._args.session_key

    def rest_uri(self) -> str:
        return self._args.rest_uri

    def to_version(self) -> Optional[str]:
        return self._args.to_version if self._args.to_version else None
