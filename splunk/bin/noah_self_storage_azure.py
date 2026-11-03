import base64
import hashlib
import uuid
from pathlib import Path
import logging

from splunk.conf_util import ConfigMap, ConfigMapError

logger = logging.getLogger(__name__)

from azure.storage.blob import BlobBlock, ContainerClient, CustomerProvidedEncryptionKey, BlobServiceClient
from azure.core.exceptions import AzureError
from azure.identity import ManagedIdentityCredential, ClientAssertionCredential
from azure.keyvault.keys import KeyClient
from azure.keyvault.keys.crypto import EncryptionAlgorithm

from noah_self_storage_handler import SelfStorageHandler
from noah_self_storage_common import NoahSelfStorageArgs, is_rawdata_file, handle_missing_rawdata


_DDSS_CONF_FILE = "/opt/splunk/etc/system/local/self-storage-azure.conf"
_DDSS_STANZA = "azure_oauth"

_DEFAULT_BLOB_ENDPOINT_SUFFIX = "blob.core.windows.net"
_DEFAULT_AUTHORITY_HOST = "https://login.microsoftonline.com"
_DEFAULT_MI_AUDIENCE = "api://AzureADTokenExchange"


def get_client_id() -> str:
    return ConfigMap(Path(_DDSS_CONF_FILE)).get(_DDSS_STANZA).get("ddss_azure_app_client_id")


def _get_optional_ddss_setting(key: str, default: str) -> str:
    try:
        value = ConfigMap(Path(_DDSS_CONF_FILE)).get(_DDSS_STANZA).get(key)
        return value if value else default
    except ConfigMapError:
        return default
    except Exception:
        logger.exception("Unexpected error reading ddss setting %r", key)
        raise


def get_blob_endpoint_suffix() -> str:
    return _get_optional_ddss_setting("ddss_azure_blob_endpoint_suffix", _DEFAULT_BLOB_ENDPOINT_SUFFIX)


def get_authority_host() -> str:
    return _get_optional_ddss_setting("ddss_azure_authority_host", _DEFAULT_AUTHORITY_HOST)


def get_mi_audience() -> str:
    return _get_optional_ddss_setting("ddss_azure_mi_audience", _DEFAULT_MI_AUDIENCE)


class AzureSelfStorageHandler(SelfStorageHandler):
    def __init__(
        self,
        args: NoahSelfStorageArgs,
        src_endpoint: str,
        key_id: str,
        tenant_id: str,
        storage_account_name: str,
    ):
        super().__init__(args)
        
        self.key_id = key_id  # Expected format: "https://vault-name.vault.azure.net/keys/key-name/version"
        self.tenant_id = tenant_id  # Azure tenant ID for managed identity authentication
        self.storage_account_name = storage_account_name  # Azure storage account name

        self.src_endpoint = src_endpoint
        src_container_name = self.storage_args.src_bucket_name
        src_container_url = f"{self.src_endpoint}/{src_container_name}"
        
        managed_identity_credential: ManagedIdentityCredential = ManagedIdentityCredential()
        self.src_container_client = ContainerClient.from_container_url(
            src_container_url, credential=managed_identity_credential
        )

        audience = get_mi_audience()
        credential = ClientAssertionCredential(
            self.tenant_id,
            get_client_id(),
            lambda: self._get_managed_identity_token(managed_identity_credential, f"{audience}/.default"),
            authority=get_authority_host(),
        )

        account_url: str = f"https://{self.storage_account_name}.{get_blob_endpoint_suffix()}"
        blob_service_client = BlobServiceClient(account_url=account_url, credential=credential)

        self.dest_container_client: ContainerClient = blob_service_client.get_container_client(self.storage_args.dest_bucket_name)

    def decrypt_key(self) -> bytes:
        try:
            vault_url, key_with_version = self.key_id.split("/keys/", maxsplit=1)
            key_parts = key_with_version.split("/", maxsplit=1)
            key_name = key_parts[0]
            key_version = key_parts[1] if len(key_parts) > 1 else None

            key_client = KeyClient(vault_url=vault_url, credential=ManagedIdentityCredential())
            crypto_client = key_client.get_cryptography_client(key_name=key_name, key_version=key_version)
            response = crypto_client.decrypt(
                EncryptionAlgorithm.rsa_oaep_256,
                base64.b64decode(self.storage_args.cipher_blob)
            )

            return response.plaintext
        except Exception as e:
            raise Exception(f"Failed to decrypt key: {str(e)}") from e

    def list_objects(self) -> list[str]:
        try:
            blob_list = self.src_container_client.list_blobs(
                name_starts_with=self.storage_args.src_rawdata_path
            )

            key_list = []
            for blob in blob_list:
                if is_rawdata_file(blob.name):
                    key_list.append(blob.name)

            if not key_list:
                handle_missing_rawdata(
                    self.storage_args.src_rawdata_path,
                    f"{self.src_endpoint}/{self.storage_args.src_bucket_name}"
                )

            return key_list
        except AzureError as e:
            raise Exception(f"Failed to list blobs: {str(e)}") from e

    def _create_customer_provided_key(self, key_bytes: bytes) -> CustomerProvidedEncryptionKey:
        # Ensure we have raw key bytes (not base64-encoded).
        # decrypt_key() may return base64-encoded bytes; decode them first.
        if isinstance(key_bytes, str):
            key_bytes = key_bytes.encode('utf-8')

        try:
            decoded = base64.b64decode(key_bytes, validate=True)
            # A valid 256-bit AES key is exactly 32 bytes after decoding.
            if len(decoded) == 32:
                key_bytes_raw = decoded
            else:
                key_bytes_raw = key_bytes
        except Exception:
            key_bytes_raw = key_bytes

        key_b64 = base64.b64encode(key_bytes_raw).decode('utf-8')
        key_sha256_b64 = base64.b64encode(hashlib.sha256(key_bytes_raw).digest()).decode('utf-8')

        return CustomerProvidedEncryptionKey(
            key_value=key_b64,
            key_hash=key_sha256_b64
        )
    
    def _get_managed_identity_token(self, credential: ManagedIdentityCredential, audience: str) -> str:
        return credential.get_token(audience).token

    def copy_file(
        self,
        src_key: str,
        dest_key: str,
        encryption_key: bytes
    ) -> None:
        try:
            cpk = self._create_customer_provided_key(encryption_key)
            
            src_blob_client = self.src_container_client.get_blob_client(src_key)
            dest_blob_client = self.dest_container_client.get_blob_client(dest_key)
            
            stream_downloader = src_blob_client.download_blob(cpk=cpk)
            
            block_list = []
            for chunk in stream_downloader.chunks():
                block_id = uuid.uuid4().hex
                block_list.append(BlobBlock(block_id=block_id))
                dest_blob_client.stage_block(block_id=block_id, data=chunk, length=len(chunk))

            dest_blob_client.commit_block_list(block_list)
            
        except AzureError as e:
            raise Exception(f"Failed to copy blob {src_key}: {str(e)}") from e
