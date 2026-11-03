from typing import Optional

from cloudgateway.key_bundle import KeyBundle, KeyBundlePath
from splunk.rest import getWebKeyFile, getWebCertFile

try:
    from splunk.rest import is_cert_or_key_encrypted
except (ModuleNotFoundError, ImportError):
    def is_cert_or_key_encrypted(cert_filename):
        return False

SPLUNK_KEY_BUNDLE = None
SPLUNK_KEY_BUNDLE_LOADED = False


def get_splunk_mtls_bundle() -> Optional[KeyBundle]:
    """
    This method loads Splunk's web TLS certificates
    @return: KeyBundle with server key and cert body (not paths)
    """
    global SPLUNK_KEY_BUNDLE, SPLUNK_KEY_BUNDLE_LOADED
    if SPLUNK_KEY_BUNDLE_LOADED:
        return SPLUNK_KEY_BUNDLE

    key_path = getWebKeyFile()
    cert_path = getWebCertFile()

    if key_path and cert_path and not is_cert_or_key_encrypted(key_path):
        SPLUNK_KEY_BUNDLE = KeyBundlePath(key_pem=key_path, cert_pem=cert_path)
    SPLUNK_KEY_BUNDLE_LOADED = True
    return SPLUNK_KEY_BUNDLE
