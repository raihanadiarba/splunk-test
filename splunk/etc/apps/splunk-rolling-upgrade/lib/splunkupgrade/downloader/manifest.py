import logging
import os
import re

from splunkupgrade.downloader.product_info import (
    ArchitectureType,
    KernerVersion,
    OSVersion,
    ProductType,
)
from splunkupgrade.utils.exceptions import (
    SplunkHomeNotSetError,
    WrongManifestsError,
)

logger = logging.getLogger(__name__)


# Class that represents the format of a manifest file name:
# - splunkforwarder-8.2.2-87344edfcdb4-windows-64-manifest (for windows)
# - splunk-8.0.6-152fb4b2bb96-linux-2.6-x86_64-manifest (for linux)
class ManifestFormat:
    PRODUCT = "(\\w+)-"
    VERSION = "(\\d+(?:\\.\\d+){0,4})-"
    HASH = "(\\w+)-"
    OS = "(\\w+)-"
    KERNEL = "(\\d+(?:\\.\\d+){0,4})-"
    ARCH = "([_\\d\\w]+)-"

    manifest_with_kernel = re.compile(f"^{PRODUCT}{VERSION}{HASH}{OS}{KERNEL}{ARCH}manifest$")
    MANIFEST_WITH_KERNEL_FIELDS = 6
    manifest_without_kernel = re.compile(f"^{PRODUCT}{VERSION}{HASH}{OS}{ARCH}manifest$")
    MANIFEST_WITHOUT_KERNEL_FIELDS = 5


def manifest_is_invalid(element):
    size = len(element)
    if size != ManifestLoader.MANIFEST_NAME_COMPONENTS:
        return True
    if (
        element[0] == ProductType.INVALID
        or element[1] == OSVersion.INVALID
        or element[3] == ArchitectureType.INVALID
    ):
        return True
    else:
        return False


def filter_manifest_duplicates(manifests):
    return list(dict.fromkeys(manifests))


# This function remove duplicates. This is necessary because when a customer upgrades, we have
# several *-manifest files under it. Now, all these manifests (with the exception of the version and the hashcode)
# should all be the same. If we find, for example, under $SPLUNK_HOME a manifest of a forwarder, and few manifests
# of an indexer we throw an error because we are not sure what kind of upgrade we should do.
def validate_manifest_or_throw(manifests):
    duplicates_removed = filter_manifest_duplicates(manifests)
    if len(duplicates_removed) != 1 or manifest_is_invalid(duplicates_removed[0]):
        raise WrongManifestsError("Error in ManifestLoader")
    return duplicates_removed[0]


class ManifestLoader:
    MANIFEST_NAME_COMPONENTS = 4

    def __init__(self, splunk_home):
        self._splunk_home = self._validate_splunk_home(splunk_home)
        self._manifest_files = self._find_manifests()
        self._parsed_manifest = validate_manifest_or_throw(self._parse_manifest_name())

    def product_type(self):
        return self._parsed_manifest[0]

    def os_name(self):
        return self._parsed_manifest[1]

    def kernel_version(self):
        return self._parsed_manifest[2]

    def arch_type(self):
        return self._parsed_manifest[3]

    def _validate_splunk_home(self, splunk_home):
        if splunk_home is None:
            raise SplunkHomeNotSetError
        return splunk_home

    def _find_manifests(self):
        manifests = []
        for manifest in glob.glob(os.path.join(self._splunk_home, "*manifest")):
            logger.debug(f"Found manifest file {os.path.basename(manifest)}")
            manifests.append(os.path.basename(manifest))
        return manifests

    def _parse_manifest_name(self):
        multiple_results = []
        for manifest in self._manifest_files:
            with_kernel = ManifestFormat.manifest_with_kernel.search(manifest)
            if (
                with_kernel
                and len(with_kernel.groups()) == ManifestFormat.MANIFEST_WITH_KERNEL_FIELDS
            ):
                product = ProductType.from_product_name(with_kernel.group(1))
                os_name = OSVersion.from_os_name(with_kernel.group(4))
                kernel_version = KernerVersion.from_kernel_version(with_kernel.group(5))
                arch_type = ArchitectureType.from_arch_name(with_kernel.group(6))
                multiple_results.append((product, os_name, kernel_version, arch_type))
            else:
                without_kernel = ManifestFormat.manifest_without_kernel.search(manifest)
                if (
                    without_kernel
                    and len(without_kernel.groups())
                    == ManifestFormat.MANIFEST_WITHOUT_KERNEL_FIELDS
                ):
                    product = ProductType.from_product_name(without_kernel.group(1))
                    os_name = OSVersion.from_os_name(without_kernel.group(4))
                    kernel_version = KernerVersion.INVALID
                    arch_type = ArchitectureType.from_arch_name(without_kernel.group(5))
                    multiple_results.append((product, os_name, kernel_version, arch_type))
        return multiple_results
