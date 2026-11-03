"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.
"""
from http import HTTPStatus
import splunk.rest as rest
from spacebridgeapp.exceptions.splunk_api_exceptions import LoadConfigError
from spacebridgeapp.logging.spacebridge_logging import setup_logging
from spacebridgeapp.util.constants import SPACEBRIDGE_APP_NAME, INSTANCE_CONFIG_COLLECTION_NAME, NOBODY, LIMIT, OUTPUT_MODE, JSON

_LOAD_CONFIG_LOG = setup_logging(f"{SPACEBRIDGE_APP_NAME}.log", "SecureGatewayConfig")
KV_INSTANCE_CONFIG_URI = f'{rest.makeSplunkdUri()}/servicesNS/{NOBODY}/{SPACEBRIDGE_APP_NAME}/storage/collections/data/{INSTANCE_CONFIG_COLLECTION_NAME}'

def load_config_from_kvstore(session_key) -> str:
    """
    Retrieves instance config from KV Store
    """
    log = _LOAD_CONFIG_LOG
    log.debug("Config loading from KV Store")
    # kvstore_service uses load_config, using kvstore_service will result in a cyclic dependency
    response_header, response_content = rest.simpleRequest(KV_INSTANCE_CONFIG_URI, sessionKey=session_key, getargs={LIMIT: 0, OUTPUT_MODE: JSON})

    if response_header.status != HTTPStatus.OK:
        session_key_found = session_key is not None and session_key != ""
        error_message = f"Error reading SSG config from KV Store.\nStatus code: {response_header.status}\nSession Key Found: {session_key_found}\nResponse: {response_content}"
        log.exception(error_message)
        raise LoadConfigError(error_message)

    return response_content

