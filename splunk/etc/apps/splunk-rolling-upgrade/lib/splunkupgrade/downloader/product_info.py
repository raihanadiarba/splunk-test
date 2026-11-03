import logging
from enum import Enum

logger = logging.getLogger(__name__)


# TODO:
# see https://community.splunk.com/t5/Installation/Where-did-the-download-links-for-wget-go-on-splunk-com/m-p/196867
# see https://community.splunk.com/t5/Installation/Can-I-download-splunkforwarder-by-using-curl/m-p/242512
# see https://docs.splunk.com/Documentation/Splunk/8.2.5/RESTREF/RESTintrospect#server.2Finfo
#     At this point the important field returned by the API is activeLicenseGroup:
#     Enterprise, Forwarder, Free, Invalid, Trial
class ProductType(Enum):
    SPLUNK = "splunk"
    UNIVERSAL_FORWARDER = "splunkforwarder"
    INVALID = "invalid"

    @staticmethod
    def valid_values():
        return {
            product_type.value: product_type
            for product_type in ProductType
            if product_type != ProductType.INVALID
        }

    @staticmethod
    def from_product_name(product_name):
        all_product_types = ProductType.valid_values()
        if product_name in all_product_types:
            return all_product_types[product_name]
        else:
            return ProductType.INVALID


class ArchitectureType(Enum):
    UNIX_X86_64 = "x86_64"
    UNIX_AMD64 = "amd64"
    WINDOWS_X64 = "x64"
    WINDOWS_64 = "64"
    INVALID = "invalid"

    @staticmethod
    def valid_values():
        return {arch.value: arch for arch in ArchitectureType if arch != ArchitectureType.INVALID}

    @staticmethod
    def from_arch_name(arch_name):
        r = ArchitectureType.valid_values()
        if arch_name in r:
            return r[arch_name]
        else:
            return ArchitectureType.INVALID


class KernerVersion(Enum):
    VERSION_2_DOT_SIX = "2.6"
    INVALID = "invalid"

    @staticmethod
    def from_kernel_version(kernel_version):
        if kernel_version == KernerVersion.VERSION_2_DOT_SIX.value:
            return KernerVersion.VERSION_2_DOT_SIX
        else:
            return ArchitectureType.INVALID


class OSVersion(Enum):
    LINUX_1 = "linux"
    LINUX_2 = "Linux"
    MACOSX = "macosx"
    WINDOWS = "windows"
    INVALID = "invalid"

    @staticmethod
    def valid_values():
        return {os.value: os for os in OSVersion if os != OSVersion.INVALID}

    @staticmethod
    def from_os_name(os_name):
        r = OSVersion.valid_values()
        if os_name in r:
            return r[os_name]
        else:
            return OSVersion.INVALID


class ProductInfo:
    def __init__(self, base_download_url):
        self.base_download_url = (
            base_download_url if base_download_url else "http://download.splunk.com/products"
        )

    def download_url(self):
        # TODO: add URL logic here based on platform once all the pieces are in place
        # Use ManifestLoader in here
        return None
