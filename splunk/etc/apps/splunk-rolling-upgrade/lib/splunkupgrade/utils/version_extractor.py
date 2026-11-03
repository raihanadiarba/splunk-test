import os.path
import logging
import tarfile
from zipfile import ZipFile
from typing import Callable, List, Optional
from splunkupgrade.data.parsing import get_enum_field
from splunkupgrade.upgrader.upgrader_utils import CmdArg, execute_child_command
from splunkupgrade.utils.exceptions import (
    NoManifest,
    UnsupportedPackageExtension,
    WrongManifestFormat,
    WrongVersionFormat,
)
from splunkupgrade.utils.package_extractor import PackageExtensions
from packaging.version import InvalidVersion, Version
from pathlib import PurePath

logger = logging.getLogger(__name__)

MANIFEST = "manifest"
SPLUNK = "splunk"


def parse_version_from_manifest(manifest_basename: str) -> Version:
    parts = manifest_basename.split("-")
    if len(parts) < 3 or parts[0] != SPLUNK or parts[-1] != MANIFEST:
        raise WrongManifestFormat(
            f"Manifest file name '{manifest_basename}' in the splunk package has an unexpected format"
        )
    try:
        logger.info(f"Version from the manifest file is '{parts[1]}'")
        return Version(parts[1])
    except InvalidVersion:
        raise WrongManifestFormat(
            f"Manifest file '{manifest_basename}' in the splunk package has an unexpected version format '{parts[1]}'"
        )


def find_manifest_in_file_list(files: List[str]) -> Optional[str]:
    for name in files:
        if name.endswith(MANIFEST):
            path = PurePath(name)
            if len(path.parts) == 2 and path.parts[0] == SPLUNK:
                logger.info(f"Found manifest file {name}")
                return name
    return None


def find_manifest_file_in_tgz(package_path: str) -> Optional[str]:
    with tarfile.open(package_path, "r:gz") as tar:
        names = tar.getnames()
    return find_manifest_in_file_list(names)


def find_manifest_file_in_zip(package_path: str) -> Optional[str]:
    with ZipFile(package_path, "r") as zip:
        files_info = zip.filelist
    names = [file_info.filename for file_info in files_info]
    return find_manifest_in_file_list(names)


def get_version_from_package(
    extract_manifest: Callable[[str], Optional[str]], package_path: str
) -> Version:
    manifest = extract_manifest(package_path)
    if manifest is None:
        raise NoManifest("No manifest file was found in the splunk package")
    return parse_version_from_manifest(os.path.basename(manifest))


def _get_version_from_external_command(command: List[CmdArg], timeout: int) -> Version:
    stdout = execute_child_command(command, timeout)
    str_version = stdout.decode("utf-8")
    try:
        logger.info(f"Version from the rpm package is '{str_version}'")
        return Version(str_version)
    except InvalidVersion:
        raise WrongVersionFormat(f"rpm package has an unexpected version format '{str_version}'")


def _get_rpm_version_command(package_path: str) -> List[CmdArg]:
    return [
        CmdArg("rpm"),
        CmdArg("--query"),
        CmdArg("--package"),
        CmdArg("--queryformat"),
        CmdArg("%{VERSION}"),
        CmdArg(package_path),
    ]


def _get_dpkg_version_command(package_path: str) -> List[CmdArg]:
    return [CmdArg("dpkg"), CmdArg("--field"), CmdArg(package_path), CmdArg("Version")]


def get_version(package_path: str, timeout: int = 10) -> Version:
    extension = os.path.splitext(package_path)[-1].lower()
    package_type = get_enum_field(PackageExtensions, extension, None)
    if package_type == PackageExtensions.TGZ:
        return get_version_from_package(find_manifest_file_in_tgz, package_path)
    elif package_type == PackageExtensions.ZIP:
        return get_version_from_package(find_manifest_file_in_zip, package_path)
    elif package_type == PackageExtensions.RPM:
        return _get_version_from_external_command(_get_rpm_version_command(package_path), timeout)
    elif package_type == PackageExtensions.DEB:
        return _get_version_from_external_command(_get_dpkg_version_command(package_path), timeout)
    raise UnsupportedPackageExtension(f"Unsupported splunk package extension '{extension}'")
