import logging
from os import R_OK, access
from os.path import isabs
from typing import Tuple
from urllib.parse import urlparse
from urllib.request import urlopen

from splunkupgrade.downloader.remote_downloader import handle_remote_path
from splunkupgrade.utils.app_conf import DownloaderConfig
from splunkupgrade.utils.constants import DownloadConfStanza
from splunkupgrade.utils.exceptions import (
    InvalidDownloaderConfigError,
    InvalidPackageChecksum,
    ConfigurationError,
)
from splunkupgrade.utils.utils import calculate_sha256, is_ok_status_code

logger = logging.getLogger(__name__)


def is_local_path_valid(local_path: str) -> bool:
    is_valid = True
    msg_start = "Local package path is invalid:"

    if local_path is None:
        logger.error(f"{msg_start} path is empty")
        is_valid = False
    elif not isabs(local_path):
        logger.error(f"{msg_start} {local_path} is not an absolute path")
        is_valid = False
    elif not access(local_path, R_OK):
        logger.error(f"{msg_start} {local_path} is not accessible")
        is_valid = False

    return is_valid


def split_url(path_from_conf: str) -> Tuple[str, str]:
    parts = urlparse(path_from_conf)
    return parts.scheme, parts.path


def is_local_path(schema: str) -> bool:
    return schema == "file"


def ensure_downloader_config_exists(config: DownloaderConfig):
    if not config.package_path:
        raise ConfigurationError(
            f"Field '{DownloadConfStanza.PACKAGE_PATH}' was not set in the '{DownloadConfStanza.STANZA_NAME}' stanza on the current instance"
        )
    if not config.checksum:
        raise ConfigurationError(
            f"Field '{DownloadConfStanza.CHECKSUM}' was not set in the '{DownloadConfStanza.STANZA_NAME}' stanza on the current instance"
        )


def retrieve_new_splunk_package_path(config: DownloaderConfig) -> str:
    assert config.package_path and config.checksum

    def is_download_needed(schema: str) -> bool:
        return schema != "file"

    schema, package_path = split_url(config.package_path)

    if is_download_needed(schema):
        resulting_path = handle_remote_path(config.package_path)
    elif is_local_path_valid(package_path):
        resulting_path = package_path
    else:
        msg = f"Invalid path='{config.package_path}' specified"
        logger.error(msg)
        raise InvalidDownloaderConfigError(msg)

    checksum = calculate_sha256(resulting_path)
    if checksum != config.checksum:
        raise InvalidPackageChecksum(
            f"SHA256 checksum mismatch: package= '{resulting_path}' checksum = '{checksum}', config checksum = '{config.checksum}'"
        )

    logger.info(f"Splunk package available at path='{resulting_path}'")
    return resulting_path


def is_reachable_remote_path(remote_path: str):
    try:
        with urlopen(remote_path) as response:
            return is_ok_status_code(response.status)
    except Exception as e:
        logger.error(f"Failed to reach url '{remote_path}': {e}")
        return False


def is_package_path_valid(package_url: str) -> bool:
    schema, package_path = split_url(package_url)

    def is_valid_path():
        return (
            is_local_path_valid(package_path)
            if is_local_path(schema)
            else is_reachable_remote_path(package_url)
        )

    return bool(package_path) and bool(schema) and is_valid_path()
