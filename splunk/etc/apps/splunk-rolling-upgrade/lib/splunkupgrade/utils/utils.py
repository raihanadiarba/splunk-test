import argparse
import hashlib
import logging.config
import os
import platform
import re
from http import HTTPStatus
from datetime import datetime

from splunkupgrade.utils.types import JsonObject
from splunkupgrade.utils.constants import (
    GeneralConstants,
    UPGRADE_STATUS_DATETIME_FORMAT,
    UpgradeStatusResponseStats,
)
from splunkupgrade.utils.exceptions import UndefinedEnvVariableException

logger = logging.getLogger(__name__)


FOUR_KILOBYTES = 4096


class SplunkVersionAction(argparse.Action):
    def __init__(self, option_strings, dest, nargs=None, **kwargs):
        super().__init__(option_strings, dest, **kwargs)

    def __call__(self, parser, namespace, values, option_string=None):
        p = re.compile("^([1-9]\\d*)(\\.(([1-9]\\d*)|0)){0,3}$")
        if p.match(values):
            setattr(namespace, self.dest, values)
        else:
            raise ValueError(f"version='{values}' is an invalid Splunk version")


def is_windows() -> bool:
    name = platform.system()
    return name == "Windows" or name.startswith("CYGWIN")


def is_linux() -> bool:
    # NOTE: https://docs.python.org/3/library/platform.html. The documentation
    # doesn't really say anything about different Linux flavours (like Ubuntu vs
    # CentOS). The way I tested this was to simply to this:
    # =================
    # Ubuntu test case:
    # =================
    # lstoppa@C02DL3AAMD6R % docker run -i -t ubuntu
    # root@fc50bb709634:/# python3.10
    # Python 3.10.6 (main, Aug 10 2022, 11:40:04) [GCC 11.3.0] on linux
    # Type "help", "copyright", "credits" or "license" for more information.
    # >>> import platform
    # >>> print(platform.system())
    # Linux
    # =================
    # CentOS test case:
    # =================
    # lstoppa@C02DL3AAMD6R % docker run -i -t centos:7
    # [root@30d22df9d388 /]# python
    # Python 2.7.5 (default, Oct 14 2020, 14:45:30)
    # [GCC 4.8.5 20150623 (Red Hat 4.8.5-44)] on linux2
    # Type "help", "copyright", "credits" or "license" for more information.
    # >>> import platform
    # >>> print(platform.system())
    # Linux
    name = platform.system()
    return name == "Linux"


def is_supported_platform() -> bool:
    return is_linux()


def get_path_or_none(dictionary, *args):
    current_node = dictionary
    try:
        for arg in args:
            current_node = current_node[arg]
    except Exception:
        return None
    return current_node


def does_path_exist(dictionary, *args) -> bool:
    try:
        current_node = dictionary
        for arg in args:
            current_node = current_node[arg]
    except Exception:
        return False
    return True


def get_env_variable(env_variable_name: str) -> str:
    if env_variable_name and env_variable_name in os.environ:
        return os.environ[env_variable_name]
    else:
        raise UndefinedEnvVariableException(f"Environment variable='{env_variable_name}' undefined")


def get_splunkd_path() -> str:
    splunk_binary = "splunk.exe" if is_windows() else "splunk"
    return os.path.join(get_env_variable(GeneralConstants.SPLUNK_HOME), "bin", splunk_binary)


def format_timestamp(timestamp: float) -> str:
    return datetime.fromtimestamp(timestamp).strftime(UPGRADE_STATUS_DATETIME_FORMAT)


def generate_upgrade_statistic(total_peers: int, upgraded_peers: int) -> JsonObject:
    def total_upgraded_peers_perc(total_peers: int, total_upgraded_peers: int) -> int:
        return 0 if total_peers == 0 else int(total_upgraded_peers / total_peers * 100)

    upgraded_percent = total_upgraded_peers_perc(total_peers, upgraded_peers)
    return {
        UpgradeStatusResponseStats.PEERS_TO_UPGRADE: total_peers,
        UpgradeStatusResponseStats.OVERALL_UPGRADED: upgraded_peers,
        UpgradeStatusResponseStats.OVERALL_UPGRADED_PERC: upgraded_percent,
    }


def calculate_sha256(file_name) -> str:
    hash_sha256 = hashlib.sha256()
    with open(file_name, "rb") as f:
        for chunk in iter(lambda: f.read(FOUR_KILOBYTES), b""):
            hash_sha256.update(chunk)
    return hash_sha256.hexdigest()


def is_ok_status_code(code: int):
    return HTTPStatus.OK.value <= code < HTTPStatus.MULTIPLE_CHOICES.value


def substitute_splunk_home_in_path(path: str) -> str:
    return path.replace("$SPLUNK_HOME", get_env_variable(GeneralConstants.SPLUNK_HOME))
