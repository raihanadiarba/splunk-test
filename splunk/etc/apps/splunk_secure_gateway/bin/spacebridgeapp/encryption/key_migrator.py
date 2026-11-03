"""Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved."""
import logging

import splunk
import json

from spacebridgeapp.rest.services import kvstore_service, splunk_service
from spacebridgeapp.util import constants
from spacebridgeapp.util.constants import META_COLLECTION_NAME, ENCRYPTION_KEYS

def migrate_to_storage(log: logging.Logger, session_key):
    desired_keys = [
        constants.SIGN_PUBLIC_KEY,
        constants.SIGN_PRIVATE_KEY,
        constants.ENCRYPT_PUBLIC_KEY,
        constants.ENCRYPT_PRIVATE_KEY
    ]

    kv_store_handler = kvstore_service.KVStoreCollectionAccessObject(collection=META_COLLECTION_NAME, session_key=session_key)

    try:
        r, encryption_keys = kv_store_handler.get_item_by_key(ENCRYPTION_KEYS)
        parsed = json.loads(encryption_keys)
        filtered = {k: v for k, v in parsed.items() if k in desired_keys}

        log.debug("Encryption keys found in kvstore")

        splunk_service.update_sensitive_data(log, session_key, ENCRYPTION_KEYS, json.dumps(filtered))
        kv_store_handler.delete_item_by_key(key=ENCRYPTION_KEYS)
    except splunk.ResourceNotFound:
        log.debug("Encryption keys do not exit in kvstore, no migration necessary")







