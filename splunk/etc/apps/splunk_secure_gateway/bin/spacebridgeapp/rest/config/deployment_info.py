"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.
"""

import json
import logging
import sys
import time
import splunk
import os
from splunk.clilib.bundle_paths import make_splunkhome_path

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

from cloudgateway.private.sodium_client import SodiumClient
from cloudgateway.splunk.encryption import SplunkEncryptionContext
from spacebridgeapp.rest.config.get_spacebridge_servers import get_current_spacebridge_server_bundle
from spacebridgeapp.versioning import app_version
from splunk.persistconn.application import PersistentServerConnectionApplication
from http import HTTPStatus
from spacebridgeapp.util import constants, py23
from spacebridgeapp.rest.base_endpoint import BaseRestHandler
from spacebridgeapp.rest.services.kvstore_service import KVStoreCollectionAccessObject as KvStore
from spacebridgeapp.rest.services.splunk_service import (
    fetch_sensitive_data,
    is_app_enabled,
    get_splunk_auth_type
)
from spacebridgeapp.solnlib.server_info import ServerInfo
from spacebridgeapp.util.kvstore import retry_until_ready_sync
from spacebridgeapp.util.word_list import random_words
from spacebridgeapp.rest.util import errors

sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))
sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))


class DeploymentInfo(BaseRestHandler, PersistentServerConnectionApplication):
    """
    Main class for handling the devices_user endpoint. Subclasses the spacebridge_app
    BaseRestHandler.
    """

    def __init__(self, command_line, command_arg):
        BaseRestHandler.__init__(self, logname="rest_app_config")

    def get(self, request):
        try:
            deployment_info = load_deployment_info(self.log, self.config, request)
            return {
                constants.PAYLOAD: deployment_info,
                constants.STATUS: HTTPStatus.OK
            }
        except Exception as e:
            self.log.exception('An error occurred fetching deployment info')
            raise e

    def post(self, request):
        set_enforce_mdm(request)
        return {
            constants.PAYLOAD: {},
            constants.STATUS: HTTPStatus.OK
        }

def get_mdm_public_signing_key(log: logging.Logger, auth_token):
    """
    Return the current MDM public signing key

    :param log:
    :param auth_token: A valid splunk system auth token
    :return: The current friendly deployment name, None if not set
    """

    try:
        return fetch_sensitive_data(log, auth_token, constants.MDM_SIGN_PUBLIC_KEY)
    except splunk.ResourceNotFound as e:
        log.info("Mdm public key not found in storage/passwords")
        return None


def get_mdm_update_timestamp(log: logging.Logger, request, auth_token, retry=True):
    """
    Return the generation time of the mdm signing public key
    :param log:
    :param request:
    :param auth_token: A valid splunk system auth token
    :param retry:
    :return: The last time a mdm public signing key was generated (epoch time)
    """
    kvstore = KvStore(constants.USER_META_COLLECTION_NAME, auth_token, owner=request[constants.SESSION][constants.USER])
    parsed = {}
    try:
        r, jsn = kvstore.get_item_by_key(constants.MDM_KEYPAIR_GENERATION_TIME)
        parsed = json.loads(jsn)

        log.info("mdm keypair last generated info={}".format(parsed[constants.TIMESTAMP]))
    except splunk.RESTException as e:
        # If we get a 503, KV Store is not up yet, so try again in 5 seconds.
        if e.statusCode == HTTPStatus.SERVICE_UNAVAILABLE:
            if retry:
                time.sleep(5)
                return get_mdm_update_timestamp(request, auth_token, False)

        if e.statusCode != HTTPStatus.NOT_FOUND:
            raise e

    return parsed.get(constants.TIMESTAMP, None)


def get_meta_info(log: logging.Logger, auth_token, key, retry=True):
    """ Fetch specific key from meta table in KV Store"""
    kvstore = KvStore(constants.META_COLLECTION_NAME, auth_token, owner=constants.NOBODY)

    parsed = {}
    try:
        r, jsn = kvstore.get_item_by_key(key)
        parsed = json.loads(jsn)

        log.info("current deployment info=%s" % str(parsed))
    except splunk.RESTException as e:
        # If we get a 503, KV Store is not up yet, so try again in 5 seconds.
        if e.statusCode == HTTPStatus.SERVICE_UNAVAILABLE:
            if retry:
                time.sleep(5)
                return get_meta_info(log, auth_token, key, False)

        if e.statusCode == HTTPStatus.NOT_FOUND:
            log.warning("key not found in deployment info, key=%s", key)
        else:
            log.warning("error fetching deployment info")
            raise e

    return parsed

def get_deployment_friendly_name(log: logging.Logger, auth_token, retry=True):
    """
    Return the current splunk deployment friendly name.
    :param log:
    :param auth_token: A valid splunk system auth token
    :return: The current friendly deployment name, None if not set
    """
    return get_meta_info(log, auth_token, constants.DEPLOYMENT_INFO, retry).get(constants.DEPLOYMENT_FRIENDLY_NAME, "")

def set_deployment_friendly_name(auth_token, name):
    """
    Given an auth token and name, set the deployment friendly name in the 'meta' collection
    :param auth_token: A valid splunk system auth token
    :param name: the string representation of the mame you want to give the deployment
    :return:
    """
    kvstore = KvStore(constants.META_COLLECTION_NAME, auth_token, owner=constants.NOBODY)

    deployment_info = {'_key': constants.DEPLOYMENT_INFO, constants.DEPLOYMENT_FRIENDLY_NAME: name}

    kvstore.insert_or_update_item_containing_key(deployment_info)


def set_enforce_mdm_toggle(auth_token: str, enforce_mdm: bool):
    """
    Update enforce_mdm setting in meta table in KV Store
    """
    kvstore = KvStore(constants.META_COLLECTION_NAME, auth_token, owner=constants.NOBODY)

    enforce_mdm_payload = {'_key': constants.ENFORCE_MDM, constants.ENFORCE_MDM: enforce_mdm}

    return kvstore.insert_or_update_item_containing_key(enforce_mdm_payload)


def fetch_cloudgateway_deployment_name(log: logging.Logger, auth_token: str) -> str:
    """
    :param auth_token: auth token used to authenticate with kvstore
    """

    try:
        kvstore = KvStore(app=constants.CLOUDGATEWAY_APP_NAME,
                          collection=constants.META_COLLECTION_NAME,
                          session_key=auth_token,
                          owner=constants.NOBODY)
        response, jsn = kvstore.get_item_by_key(constants.DEPLOYMENT_INFO)
        parsed = json.loads(jsn)
        name = parsed.get(constants.DEPLOYMENT_FRIENDLY_NAME, '')
    except splunk.RESTException as e:
        name = ''
        if e.statusCode != HTTPStatus.NOT_FOUND:
            raise e
    log.debug(f'Cloudgateway deployment name={name}')
    return name


def ensure_deployment_friendly_name(log: logging.Logger, auth_token):
    """
    On first load, check to see if SCG deployment name is set,
    if not, randomly pick 3 words from word list to come up with name.
    Will not return until the deployment friendly name is set.

    :param log:
    :param auth_token: A valid splunk system auth token
    :return:
    """
    log.debug('Checking for existing deployment name')
    def fetch():
        return get_deployment_friendly_name(log, auth_token)

    name = retry_until_ready_sync(fetch)

    if not name:
        # if name not found, check for the SCG deployment name, and set it.
        # otherwise generate random name
        try:
            if is_app_enabled(log, auth_token, constants.CLOUDGATEWAY_APP_NAME):
                name = fetch_cloudgateway_deployment_name(log, auth_token)

        except splunk.RESTException as e:
            # if any exeption occurs, just set name to None, and this will default to
            # the three random words as a name
            log.exception('An exception occurred fetching cloudgateway app name')
            name = None

        # if the cloudgateway app name returns empty,
        # or if cloudgateway is not enabled, name will still be empty, so
        # we set a random name
        if not name:
            name = ''.join(random_words(3))
        set_deployment_friendly_name(auth_token, name)

    log.info(f"Using deployment friendly name={name}")


def load_deployment_info(log, config, request):
    auth_token = request[constants.SYSTEM_AUTHTOKEN]
    friendly_name = get_deployment_friendly_name(log, auth_token)
    encryption_context = SplunkEncryptionContext(auth_token, constants.SPACEBRIDGE_APP_NAME, SodiumClient(log))

    mdm_sign_public_key = get_mdm_public_signing_key(log, auth_token)
    mdm_keypair_generation_time = get_mdm_update_timestamp(log, request, auth_token)

    enforce_mdm = get_meta_info(log, auth_token, constants.ENFORCE_MDM).get(constants.ENFORCE_MDM, False)
    auth_type = get_splunk_auth_type(log, auth_token).decode('utf-8')

    is_cloud_instance = ServerInfo(auth_token).is_cloud_instance()
    spacebridge_server_bundle = get_current_spacebridge_server_bundle(log, auth_token)

    custom_endpoint_id = spacebridge_server_bundle.get(constants.INSTANCE_ID, config.DEFAULT_INSTANCE_ID)
    custom_endpoint_hostname = spacebridge_server_bundle.get(constants.HTTP_DOMAIN, config.DEFAULT_HTTP_DOMAIN)
    custom_endpoint_grpc_hostname = spacebridge_server_bundle.get(constants.GRPC_DOMAIN, config.DEFAULT_GRPC_DOMAIN)
    # Currently always false, SB never has MTLS turned on at the moment
    client_cert_required = False

    return {
        constants.DEPLOYMENT_FRIENDLY_NAME: friendly_name,
        constants.SIGN_PUBLIC_KEY: py23.b64encode_to_str(encryption_context.sign_public_key()),
        constants.DEPLOYMENT_ID: encryption_context.sign_public_key(
            transform=encryption_context.generichash_hex),
        constants.ENCRYPT_PUBLIC_KEY: py23.b64encode_to_str(encryption_context.encrypt_public_key()),
        constants.SERVER_VERSION: str(app_version()),
        constants.MDM_SIGN_PUBLIC_KEY: mdm_sign_public_key,
        constants.MDM_KEYPAIR_GENERATION_TIME: mdm_keypair_generation_time,
        constants.ENFORCE_MDM: enforce_mdm,
        constants.AUTH_TYPE: auth_type,
        constants.IS_CLOUD_INSTANCE: is_cloud_instance,
        constants.CUSTOM_ENDPOINT_ID: custom_endpoint_id,
        constants.CUSTOM_ENDPOINT_HOSTNAME: custom_endpoint_hostname,
        constants.CUSTOM_ENDPOINT_GRPC_HOSTNAME: custom_endpoint_grpc_hostname,
        constants.CLIENT_CERT_REQUIRED: client_cert_required
    }


def set_enforce_mdm(request):
    auth_token = request[constants.SYSTEM_AUTHTOKEN]
    payload = json.loads(request[constants.PAYLOAD])

    if constants.ENFORCE_MDM not in payload:
        raise errors.SpacebridgeRestError(
            message="Invalid payload. Payload must contain {}".format(constants.ENFORCE_MDM),
            status=HTTPStatus.BAD_REQUEST)

    set_enforce_mdm_toggle(auth_token, payload[constants.ENFORCE_MDM])
