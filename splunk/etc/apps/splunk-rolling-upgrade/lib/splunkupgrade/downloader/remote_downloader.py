import logging
from os.path import basename
from typing import List
from urllib.parse import urlparse
from urllib.request import urlopen

from splunkupgrade.utils.constants import DownloadConfStanza as DCS
from splunkupgrade.utils.exceptions import (
    InvalidDownloaderConfigError,
    RemoteDownloaderException,
)
from splunkupgrade.utils.splunk_sdk_wrapper import splunkhome_path

logger = logging.getLogger(__name__)


class SplunkPackageDownloader:
    def __init__(self, url: str):
        self._url = url

    def _extract_package_basename(self) -> str:
        parts = urlparse(self._url)
        if not all([parts.scheme, parts.netloc, parts.path]):
            msg = f"Invalid url='{self._url}' specified for path='{DCS.PACKAGE_PATH}'"
            logger.error(msg)
            raise InvalidDownloaderConfigError(msg)
        return basename(parts.path)

    def _download_splunk_package_to(self, abs_package_location: str) -> None:
        try:
            with urlopen(self._url) as splunk_new_package:
                with open(abs_package_location, "wb") as f:
                    f.write(splunk_new_package.read())
        except Exception as e:
            logger.error(e)
            raise RemoteDownloaderException(f"Cannot download url='{self._url}'") from e

    def _retrieve_download_location(self, parts: List[str]) -> str:
        return splunkhome_path(parts)

    def download_splunk_package(self) -> str:
        download_location = self._retrieve_download_location(
            ["var", "run", "splunk", self._extract_package_basename()]
        )
        self._download_splunk_package_to(download_location)
        return download_location


def handle_remote_path(remote_package_url: str) -> str:
    return SplunkPackageDownloader(remote_package_url).download_splunk_package()
