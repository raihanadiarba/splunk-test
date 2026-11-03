import sys
from argparse import ArgumentParser, Namespace

from splunk.cloud import CloudPlatform, get_cloud_platform

from noah_self_storage_common import (
    NoahSelfStorageArgs, log_timestamp, handle_transfer_error
)


def create_parser(platform: CloudPlatform) -> ArgumentParser:
    parser = ArgumentParser(description="Script to archive noah self storage data.")

    parser.add_argument("src_bucket_name", type=str, help="Source bucket name")
    parser.add_argument("src_rawdata_path", type=str, help="Source rawdata path")
    parser.add_argument("uploader_guid", type=str, help="Uploader GUID")
    parser.add_argument("cipher_blob", type=str, help="Cipher blob")
    parser.add_argument("dest_bucket_name", type=str, help="Destination bucket name")
    parser.add_argument("dest_bucket_folder", type=str, help="Destination bucket folder")
    parser.add_argument("index_name", type=str, help="Index name")
    parser.add_argument("local_bucket_path", type=str, help="Local bucket path")
    
    if platform == CloudPlatform.AWS:
        parser.add_argument("region", type=str, help="AWS region")
        parser.add_argument("encryption_scheme", type=str, help="AWS encryption scheme")
    elif platform == CloudPlatform.GCP:
        parser.add_argument("project_id", type=str, help="GCP project ID")
        parser.add_argument("key_locations", type=str, help="GCP key locations")
        parser.add_argument("key_ring", type=str, help="GCP key ring")
        parser.add_argument("key_name", type=str, help="GCP key name")
    elif platform == CloudPlatform.AZURE:
        parser.add_argument("src_endpoint", type=str, help="Azure source storage account endpoint URL (from ASClientProps::getEndpoint())")
        parser.add_argument("key_id", type=str, help="Azure Key Vault key ID (from receipt.user_data.encryption.key_id)")
        parser.add_argument("tenant_id", type=str, help="Azure tenant ID for managed identity authentication")
        parser.add_argument("storage_account_name", type=str, help="Azure storage account name for destination container")

    return parser


def parse_args(args: list, parser: ArgumentParser) -> Namespace:
    return parser.parse_args(args=args[1:])


def get_handler(parsed_args: Namespace, platform: CloudPlatform):
    storage_args = NoahSelfStorageArgs(
        src_bucket_name=parsed_args.src_bucket_name,
        src_rawdata_path=parsed_args.src_rawdata_path,
        uploader_guid=parsed_args.uploader_guid,
        cipher_blob=parsed_args.cipher_blob,
        dest_bucket_name=parsed_args.dest_bucket_name,
        dest_bucket_folder=parsed_args.dest_bucket_folder,
        index_name=parsed_args.index_name,
        local_bucket_path=parsed_args.local_bucket_path
    )
    
    if platform == CloudPlatform.AWS:
        from noah_self_storage_aws import AwsSelfStorageHandler
        return AwsSelfStorageHandler(
            args=storage_args,
            region=parsed_args.region,
            enc_scheme=parsed_args.encryption_scheme
        )
    elif platform == CloudPlatform.GCP:
        from noah_self_storage_gcp import GcpSelfStorageHandler
        return GcpSelfStorageHandler(
            args=storage_args,
            project_id=parsed_args.project_id,
            key_locations=parsed_args.key_locations,
            key_ring=parsed_args.key_ring,
            key_name=parsed_args.key_name
        )
    elif platform == CloudPlatform.AZURE:
        from noah_self_storage_azure import AzureSelfStorageHandler
        return AzureSelfStorageHandler(
            args=storage_args,
            src_endpoint=parsed_args.src_endpoint,
            key_id=parsed_args.key_id,
            tenant_id=parsed_args.tenant_id,
            storage_account_name=parsed_args.storage_account_name,
        )
    else:
        sys.exit(f'Unsupported cloud platform: {platform}\n')


def main():
    try:
        platform = get_cloud_platform()
    except Exception as exc:
        sys.exit(f'Failed to detect cloud platform: {str(exc)}\n')
    
    parser = create_parser(platform)
    parsed_args = parse_args(sys.argv, parser)
    handler = get_handler(parsed_args, platform)
    
    log_timestamp('start')

    plaintext = handler.decrypt_key()
    log_timestamp('get_key')

    last_key = None
    try:
        key_list = handler.list_objects()

        if not key_list:
            log_timestamp('no_files_found')
            sys.exit(0)

        for key in key_list:
            last_key = key
            dest_key = handler.create_destination_key(key)
            handler.copy_file(key, dest_key, plaintext)

    except Exception as exc:
        handle_transfer_error(exc, handler.storage_args.src_rawdata_path, last_key if last_key else 'none')
    else:
        log_timestamp('complete_transfer')


if __name__ == "__main__":
    main()

