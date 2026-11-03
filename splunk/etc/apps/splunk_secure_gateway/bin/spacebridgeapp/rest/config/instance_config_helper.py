"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

REST endpoint handler for accessing and setting instance setting kvstore records
"""
import json

from splunk import RESTException
from splunk.clilib.bundle_paths import make_splunkhome_path

from http import HTTPStatus
from spacebridge_protocol.metadata_pb2 import GetSpacebridgeMetadataResponse
from spacebridge_protocol.discovery_pb2 import SpacebridgeInstance
from cloudgateway.private.sodium_client import SodiumClient
from cloudgateway.splunk.encryption import SplunkEncryptionContext
from spacebridgeapp.rest.services.kvstore_service import KVStoreCollectionAccessObject as kvstore
from spacebridgeapp.util.constants import PAYLOAD, INSTANCE_CONFIG_COLLECTION_NAME, KEY, VALUE, SYSTEM_AUTHTOKEN, \
    DEPLOYMENT_NAME, \
    SPACEBRIDGE_SERVER, SESSION, USER, AUTHTOKEN, CODE, IS_PRIVATE_SPACEBRIDGE, HTTP_DOMAIN, SPACEBRIDGE_APP_NAME, \
    TIMEOUT_SECONDS, GRPC_DOMAIN, PUBLIC_SPACEBRIDGE_DOMAIN
from spacebridgeapp.rest.config.deployment_info import get_deployment_friendly_name, set_deployment_friendly_name
from spacebridgeapp.rest.registration.spacebridge_server_metadata import invalid_private_spacebridge_url
from spacebridgeapp.request.request_processor import SpacebridgeAuthHeader
from spacebridgeapp.util.config import SecureGatewayConfig, ConfigType
from spacebridgeapp.util.config import load_config as load_config_from_kvstore
from spacebridgeapp.rest.services.device_service import delete_all_devices
from spacebridgeapp.util.config import get_spacebridge_instance_info_json
from spacebridgeapp.rest.config.deployment_name import validate_deployment_name
from spacebridge_protocol.discovery_pb2 import SpacebridgeInstance
QUERY_LABEL = 'query'
CONFIG_KEYS_LABEL = 'config_key'
SHOW_HIDDEN_LABEL = 'show_hidden'
KEY_LABEL = 'key'

def load_config(log, request):
    query_params = request.get(QUERY_LABEL)
    config_key = None
    show_hidden = False

    if query_params:
        config_key = query_params.get(CONFIG_KEYS_LABEL)
        show_hidden = (query_params.get(SHOW_HIDDEN_LABEL) == "1")

    config = load_config_from_kvstore(request[SYSTEM_AUTHTOKEN], force_refresh=True)
    config_list = config.to_json(show_hidden=show_hidden)
    prepend_deployment_info(log, request, config, config_list)

    if config_key:
        for single_config in config_list:
            if single_config[KEY] == config_key:
                instance_config_setting = single_config
                instance_config_setting[KEY_LABEL] = instance_config_setting[KEY]
                return [instance_config_setting]

        return []
    else:
        for item in config_list:
            item[KEY_LABEL] = item[KEY]

        log.info("returning instance config")
        return config_list

def prepend_deployment_info(log, request, config: SecureGatewayConfig, config_list):
    deployment_name = get_deployment_friendly_name(log, request[SYSTEM_AUTHTOKEN], False)
    config_list.insert(0, {KEY: DEPLOYMENT_NAME, VALUE: deployment_name, config.TEMPLATE.ConfigDefinition.TYPE_LABEL: ConfigType.STRING.value, config.TEMPLATE.ConfigDefinition.EXPERT_ONLY_LABEL: False, config.TEMPLATE.ConfigDefinition.ALLOW_RESET_LABEL: False })


def validate_update_config_body(body):
    if not body:
        raise RESTException(statusCode=HTTPStatus.BAD_REQUEST,
                            msg="Invalid request body: body is empty.", )

    if not isinstance(body, list):
        raise RESTException(statusCode=HTTPStatus.BAD_REQUEST,
                            msg="Invalid request body: body is not a list.")

    for config_item in body:
        if KEY not in config_item:
            raise RESTException(statusCode=HTTPStatus.BAD_REQUEST,
                                msg=f"Failed to set instance config settings, {KEY} missing, config_item: {config_item}")

        if VALUE not in config_item:
            raise RESTException(statusCode=HTTPStatus.BAD_REQUEST,
                                msg=f"Failed to set instance config settings, {VALUE} missing, config_item: {config_item}")


async def _validate_spacebridge_meta(http_url, grpc_url, session_token, spacebridge_client):
    sodium_client = SodiumClient()
    encryption_context = SplunkEncryptionContext(session_token, SPACEBRIDGE_APP_NAME, sodium_client)
    client_id = encryption_context.sign_public_key(transform=encryption_context.generichash_raw)
    header = SpacebridgeAuthHeader(device_id=client_id)
    metadata = await spacebridge_client.async_metadata(header,
                                                       spacebridge_url=http_url,
                                                       timeout=TIMEOUT_SECONDS)
    instance = SpacebridgeInstance()
    instance.ParseFromString(metadata.instance)
    if instance.httpDomain != http_url:
        raise RESTException(statusCode=HTTPStatus.BAD_REQUEST,
                            msg="HTTP domain from spacebridge metadata doesn't match with given http url")
    if instance.grpcDomain != grpc_url:
        raise RESTException(statusCode=HTTPStatus.BAD_REQUEST,
                            msg="GRPC domain from spacebridge metadata doesn't match with given grpc url")


async def validate_spacebridge_server(config_item: dict, spacebridge_client, session_token):
    value: str = config_item[VALUE]
    http_url: str = config_item[HTTP_DOMAIN]
    grpc_url: str = config_item[GRPC_DOMAIN]

    if not http_url:
        raise RESTException(statusCode=HTTPStatus.BAD_REQUEST,
                            msg="http_domain of spacebridge server is missing")

    if value != http_url:
        raise RESTException(statusCode=HTTPStatus.BAD_REQUEST,
                            msg="http_domain of spacebridge server doesn't match with given config value")

    # Validate URLs for private Spacebridge
    if any(invalid_private_spacebridge_url(url) for url in (http_url, grpc_url)):
        raise RESTException(
            statusCode=HTTPStatus.BAD_REQUEST,
            msg="invalid spacebridge http_domain or grpc_domain"
        )

    # Determine if it's a private Spacebridge: do a double check, if client claims it's a public sb
    if not config_item.get(IS_PRIVATE_SPACEBRIDGE, False):
        is_private_http = not http_url.endswith(PUBLIC_SPACEBRIDGE_DOMAIN)
        is_private_grpc = not grpc_url.endswith(PUBLIC_SPACEBRIDGE_DOMAIN)
        config_item[IS_PRIVATE_SPACEBRIDGE] = is_private_http or is_private_grpc

    if config_item[IS_PRIVATE_SPACEBRIDGE]:
        await _validate_spacebridge_meta(http_url, grpc_url, session_token, spacebridge_client)


async def update_config(log, request, spacebridge_client):
    user = request[SESSION][USER]
    session_token = request[SESSION][AUTHTOKEN]
    system_authtoken = request[SYSTEM_AUTHTOKEN]
    current_config = load_config_from_kvstore(system_authtoken, force_refresh=True)


    body = json.loads(request[PAYLOAD]) if PAYLOAD in request else None
    validate_update_config_body(body)
    if len(body) > 0:
        body.insert(0, current_config.update_timestamp_json())

    kvstore_service = kvstore(collection=INSTANCE_CONFIG_COLLECTION_NAME, session_key=system_authtoken)
    config_updated = []
    errors = []

    try:
        for config_item in body:
            kv_config_item = {KEY: config_item[KEY], VALUE: config_item[VALUE]}

            if config_item[KEY] == SPACEBRIDGE_SERVER:
                success, result = await handle_spacebridge_server(log, config_item, current_config, user, session_token,
                                                                  system_authtoken, kvstore_service, spacebridge_client)
                if success:
                    log.info(f"[spacebridge_server updated] Successfully changed to {config_item[VALUE]} by {user}")
                    kv_config_item = result
                else:
                    errors.append(result)
                    continue

            if config_item[KEY] == DEPLOYMENT_NAME:
                success, error = _handle_deployment_name(system_authtoken, config_item[VALUE])
                if not success:
                    errors.append(error)
            else:
                kvstore_service.insert_or_update_item_containing_key(kv_config_item)

            config_updated.append(kv_config_item[KEY])
    except Exception as e:
        log.error("Failed to set instance config settings. error=%s", e)
        return (False, e)

    updated_keys = ','.join(config_updated)
    error_string = "\n\t".join(errors)
    message = f"Updated {len(config_updated)} configs.\nUpdated keys: {updated_keys}.\nErrors: {error_string}"
    update_successful = True if len(body) == 0 or len(config_updated) > 0 else False

    return (update_successful, message)


def is_spacebridge_changed(current_spacebridge_url, kvstore_service) -> bool:
    _, spacebridge_server_obj = kvstore_service.get_item_by_key(SPACEBRIDGE_SERVER)
    spacebridge_server_data = json.loads(spacebridge_server_obj)
    return current_spacebridge_url != spacebridge_server_data[HTTP_DOMAIN]


async def handle_spacebridge_server(log, config_item, current_config: SecureGatewayConfig, user, session_token,
                                    system_authtoken, kvstore_service, spacebridge_client):
    spacebridge_server = config_item[HTTP_DOMAIN]

    # Check if the new Spacebridge server is the same as the currently set one in KVStore.
    # If it is, skip the update and return a message indicating no change.
    log.info("Attempting to check if trying to change to the same Spacebridge server")
    try:
        if not is_spacebridge_changed(spacebridge_server, kvstore_service):
            return (False, "Spacebridge already set to this server. No devices deleted.")
    except RESTException as e:
        if e.statusCode == HTTPStatus.NOT_FOUND:
            log.info("no spacebridge_server key is set in KVstore")
        else:
            return (False, f"KVStore is unavailable with status = {e.statusCode}: {e}")

    try:
        await validate_spacebridge_server(config_item, spacebridge_client, session_token)
    except RESTException as e:
        return (False, f"Spacebridge validation failed: {e.msg}")

    # Attempt to delete devices before changing Spacebridge server
    # If all devices are unable to be deleted catch error and halt changing server
    # If some devices are deleted continue to change Spacebridge server and report the failed devices
    log.info("Attempting to delete all devices.")
    try:
        deletion_result = await delete_all_devices(log, user, session_token, system_authtoken)
        successful_deletions = [result for result in deletion_result if result[CODE] == HTTPStatus.OK]
        num_results = len(deletion_result)
        num_deletions = len(successful_deletions)
        num_failures = num_results - num_deletions
        if num_failures > 0 and num_deletions == 0:
            return (False, "All device deletions failed. Aborting changing Spacebridge Server.")
    except Exception as e:
        return (False, f"An error occurred while deleting all devices. Error: {str(e)}")
    log.info(f"Delete devices completed. Deletions_succeeded = {num_deletions}, Deletions_failed = {num_failures}")

    # If the Spacebridge is public, retrieve additional instance info and update the configuration.
    log.info("Attempting to update spacebridge_server in instance config")
    if config_item.get(IS_PRIVATE_SPACEBRIDGE, False):
        return (True, config_item)
    else:
        spacebridge_server_json = get_spacebridge_instance_info_json(session_token, current_config, spacebridge_server)
        if spacebridge_server_json:
            return (True, spacebridge_server_json)
        else:
            return (False, "Fail to get spacebridge information")


def _handle_deployment_name(auth_token, deployment_name):
    if not validate_deployment_name(deployment_name):
        return (False, "Invalid deployment name")
    set_deployment_friendly_name(auth_token, deployment_name)
    return (True, None)

def delete_config(log, request, config: SecureGatewayConfig):
    body = json.loads(request[PAYLOAD])
    config_key = body[KEY_LABEL]
    kvstore_service = kvstore(collection=INSTANCE_CONFIG_COLLECTION_NAME, session_key=request[SYSTEM_AUTHTOKEN])
    try:
        response = kvstore_service.delete_item_by_key(config_key)
        kvstore_service.update_item_by_key(config.UPDATE_TIMESTAMP_KEY, config.update_timestamp_json())
        return {True, f"Config key {config_key} deleted {response}"}

    except Exception as e:
        log.warn("Failed to delete instance config key %s. error=%s", config_key, e)
        return (False, e)
