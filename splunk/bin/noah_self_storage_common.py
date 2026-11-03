import sys
from datetime import datetime
from typing import NamedTuple


class NoahSelfStorageArgs(NamedTuple):
    src_bucket_name: str
    src_rawdata_path: str
    uploader_guid: str
    cipher_blob: str
    dest_bucket_name: str # On Azure, this will be a container name
    dest_bucket_folder: str
    index_name: str
    local_bucket_path: str


def log_timestamp(message):
    timestamp = datetime.now().strftime('%H:%M:%S.%f')
    sys.stdout.write(f'{timestamp}:{message} ')
    sys.stdout.flush()


def build_file_path(index_name, local_bucket_path, dest_bucket_folder=None):
    file_path = f'{index_name}/{local_bucket_path}/'
    if dest_bucket_folder:
        file_path = f'{dest_bucket_folder}/{file_path}'
    return file_path


def is_rawdata_file(key_or_name):
    return (not key_or_name.endswith('/') and
            ('rawdata/journal' in key_or_name or 'rawdata/deletes' in key_or_name))


def get_new_key(old_key, file_path):
    idx = old_key.rfind('rawdata/')
    return file_path + old_key[idx:]


def handle_missing_rawdata(src_rawdata_path, src_bucket_name):
    sys.exit(f'WARN missing rawdata folder={src_rawdata_path} If the issue persists for bucket={src_bucket_name} '
             f'contact your Splunk administrator\n')


def handle_transfer_error(exc, src_rawdata_path, last_key='none'):
    sys.exit(f'failed to transfer raw data to self storage: src_rawdata_path={src_rawdata_path} '
             f'lastKey={last_key} exception={str(exc)}\n')
