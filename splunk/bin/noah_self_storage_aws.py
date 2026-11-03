import sys
import base64
import boto3

from noah_self_storage_handler import SelfStorageHandler
from noah_self_storage_common import NoahSelfStorageArgs, is_rawdata_file, handle_missing_rawdata


class AwsSelfStorageHandler(SelfStorageHandler):
    def __init__(
        self,
        args: NoahSelfStorageArgs,
        region: str,
        enc_scheme: str
    ):
        super().__init__(args)
        self.region = region
        self.enc_scheme = enc_scheme
        self.s3_client = boto3.client('s3', region_name=region)
        self.kms_client = boto3.client('kms', region)

    def decrypt_key(self) -> bytes:
        try:
            kms_response = self.kms_client.decrypt(
                CiphertextBlob=base64.b64decode(self.storage_args.cipher_blob),
                EncryptionContext={'guid': self.storage_args.uploader_guid}
            )
            return kms_response["Plaintext"]
        except Exception:
            raise

    def list_objects(self) -> list[str]:
        try:
            paginator = self.s3_client.get_paginator('list_objects_v2')
            page_iterator = paginator.paginate(
                Bucket=self.storage_args.src_bucket_name,
                Prefix=self.storage_args.src_rawdata_path
            )

            key_list = []
            for page in page_iterator:
                if 'Contents' in page:
                    key_list.extend([obj['Key'] for obj in page['Contents'] if is_rawdata_file(obj['Key'])])

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
            source = {'Bucket': self.storage_args.src_bucket_name, 'Key': src_key}

            extra_args = {
                'ACL': 'bucket-owner-full-control',
                'CopySourceSSECustomerAlgorithm': 'AES256',
                'CopySourceSSECustomerKey': encryption_key
            }
            if self.enc_scheme == 'sse-s3':
                extra_args['ServerSideEncryption'] = 'AES256'

            self.s3_client.copy(source, self.storage_args.dest_bucket_name, dest_key, ExtraArgs=extra_args)
        except Exception as e:
            raise Exception(f"Failed to copy file {src_key}: {str(e)}") from e
