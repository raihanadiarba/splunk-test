import logging
import os.path
import subprocess
import tarfile
import zipfile
from enum import Enum
from os.path import splitext
from pathlib import Path
from typing import Any
from zipfile import BadZipFile, ZipFile

from splunkupgrade.data.parsing import get_enum_field
from splunkupgrade.utils.constants import ExitCodes
from splunkupgrade.utils.exceptions import PackageExtractorException

logger = logging.getLogger(__name__)


class PackageExtensions(Enum):
    TGZ = ".tgz"
    ZIP = ".zip"
    DEB = ".deb"
    RPM = ".rpm"
    UNSUPPORTED = "unsupported"


class PackageExtractor:
    def __init__(self, source_path: str, dest_path: str):
        self._source_path = source_path
        self._dest_path = dest_path
        self._validate_parameters()

    def _validate_parameters(self) -> None:
        if not os.path.isfile(self._source_path) or not os.path.isdir(self._dest_path):
            error_message = f"PackageExtractor error: path='{self._source_path}' must be a file, while path='{self._dest_path}' must be a directory"
            logger.error(error_message)
            raise PackageExtractorException(error_message)


# TODO: it looks like we won't be using this anymore: on windows we officially support only MSI.
class ZipPackageExtractor(PackageExtractor):
    def __init__(self, source_path: str, dest_path: str):
        super().__init__(source_path, dest_path)

    def _strip_zip_path(self, info: zipfile.ZipInfo, n_folders_stripped: int):
        p = Path(info.filename)
        if n_folders_stripped >= 1:
            info.filename = str(p.relative_to(*p.parts[:n_folders_stripped]))
        return info

    def extract(self) -> None:
        try:
            with ZipFile(self._source_path) as zip:
                for info in zip.infolist():
                    try:
                        zip.extract(member=self._strip_zip_path(info, 1), path=self._dest_path)
                    except IOError as e:
                        full_path = os.path.join(self._dest_path, info.filename)
                        os.remove(full_path)
                        zip.extract(info, self._dest_path)
                        # TODO: do we really need to take care of permission on windows?
                        # os.chmod(full_path, info.filem)
        except BadZipFile as e:
            error_message = f"Extractor error: {e}"
            logger.error(error_message)
            raise PackageExtractorException(error_message)


class TgzPackageExtractor(PackageExtractor):
    def __init__(self, source_path: str, dest_path: str):
        super().__init__(source_path, dest_path)

    def _strip_tgz_path(self, archive: tarfile.TarFile, name: str, n_folders_stripped: int):
        member = archive.getmember(name)
        p = Path(member.path)
        if n_folders_stripped >= 1:
            member.path = str(p.relative_to(*p.parts[:n_folders_stripped]))
        return member

    # The original method, became unnecessarily complicated due to two aspects:
    # - tarfile.extractall() is limited. An extraction will fail when trying to overwrite
    #   read-only files (this is particularly true for files under $SPLUNK_HOME/lib. The only
    #   suggested workaround we found was to remove that file, and replace it. See
    #   https://stackoverflow.com/questions/7237475/overwrite-existing-read-only-files-when-using-pythons-tarfile
    #   for more info.
    # - Splunk package is package under a folder called "splunk/<all-files>". This means that a single call
    #   to tarfile.extractall(dest_path) will unpack under $SPLUNK_HOME/splunk (remember the default value for
    #   SPLUNK_HOME is "/opt/splunk), and this means we would end up having "$SPLUNK_HOME/splunk/splunk".
    #   On Linux tar supports an option called "--strip". Unfortunately tarfile doesn't, and the only workaround
    #   is to manipulate paths.
    # This is really unfortunate, but there are really no other options available for Python. For this reason we
    # decided to simply use "tar" to do all the work for us.
    def extract(self) -> None:
        try:
            logger.info(
                f"Started extracting from source path='{self._source_path}' to destination path='{self._dest_path}'"
            )
            ret = subprocess.run(
                [
                    "tar",
                    "-zxvf",
                    self._source_path,
                    "--strip-components",
                    "1",
                    "-C",
                    self._dest_path,
                ],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )
            if ret.returncode != ExitCodes.OK.value:
                logger.error(
                    f"Error when extracting Splunk: error code='{ret.returncode}', stderr='{ret.stderr.decode('utf-8')}'"
                )
            else:
                logger.info(f"Command='{ret.args}' terminated with success")
        except Exception as e:
            logger.error(f"Error='{e}'")
            raise PackageExtractorException(f"Error='{e}'")


def extract_package_to(source_path: str, dest_path: str) -> None:
    def get_package_extractor(source: str, dest: str) -> Any:
        # See https://docs.python.org/3.7/library/os.path.html#os.path.splitext for the reason
        # we always get the second element of the return value.
        ext = splitext(source)[1] if source else ""
        ext_type = get_enum_field(PackageExtensions, ext, None)
        if ext_type == PackageExtensions.TGZ:
            return TgzPackageExtractor(source, dest)
        elif ext_type == PackageExtensions.ZIP:
            return ZipPackageExtractor(source, dest)
        else:
            return None

    extractor = get_package_extractor(source_path, dest_path)
    if extractor:
        extractor.extract()
    else:
        error_message = f"Cannot extract source path='{source_path}' to destination path='{dest_path}': unsupported package type"
        logger.error(error_message)
        raise PackageExtractorException(error_message)
