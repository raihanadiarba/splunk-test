import sys
import base64
from google.cloud import kms, storage

from noah_self_storage_handler import SelfStorageHandler
from noah_self_storage_common import NoahSelfStorageArgs, is_rawdata_file, handle_missing_rawdata


class GcpSelfStorageHandler(SelfStorageHandler):
    def __init__(
        self,
        args: NoahSelfStorageArgs,
        project_id: str,
        key_locations: str,
        key_ring: str,
        key_name: str
    ):
        super().__init__(args)
        self.project_id = project_id
        self.key_locations = key_locations
        self.key_ring = key_ring
        self.key_name = key_name
        self.kms_client = kms.KeyManagementServiceClient()
        self.storage_client = storage.Client()

    def decrypt_key(self) -> bytes:
        try:
            key_name = self.kms_client.crypto_key_path(
                self.project_id,
                self.key_locations,
                self.key_ring,
                self.key_name
            )
            uploader = f'guid:{self.storage_args.uploader_guid}'
            decrypt_request = kms.DecryptRequest(
                name=key_name,
                ciphertext=base64.b64decode(self.storage_args.cipher_blob),
                additional_authenticated_data=uploader.encode(),
            )
            decrypt_response = self.kms_client.decrypt(decrypt_request)
            return decrypt_response.plaintext
        except Exception:
            raise

    def list_objects(self) -> list[str]:
        try:
            blobs_iterator = self.storage_client.list_blobs(
                bucket_or_name=self.storage_args.src_bucket_name,
                prefix=self.storage_args.src_rawdata_path
            )

            key_list = [blob.name for blob in blobs_iterator if is_rawdata_file(blob.name)]

            if not key_list:
                handle_missing_rawdata(self.storage_args.src_rawdata_path, self.storage_args.src_bucket_name)

            return key_list
        except Exception:
            raise

    def copy_file(
        self,
        src_key: str,
        dest_key: str,
        encryption_key: bytes
    ) -> None:
        try:
            src_bucket = self.storage_client.bucket(self.storage_args.src_bucket_name)
            dst_bucket = self.storage_client.bucket(self.storage_args.dest_bucket_name)

            src_blob = src_bucket.blob(src_key, encryption_key=encryption_key)
            dst_blob = dst_bucket.blob(dest_key)

            rewrite_token = None
            while True:
                rewrite_token, _, _ = dst_blob.rewrite(
                    src_blob, token=rewrite_token
                )
                if rewrite_token is None:
                    break
        except Exception as e:
            raise Exception(f"Failed to copy file {src_key}: {str(e)}") from e
