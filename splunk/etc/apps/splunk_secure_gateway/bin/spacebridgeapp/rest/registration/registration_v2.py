"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

REST endpoint handler for checking if device is registered with Spacebridge
"""
import logging
import sys
import json
from http import HTTPStatus
import os

from splunk.persistconn.application import PersistentServerConnectionApplication
from splunk.clilib.bundle_paths import make_splunkhome_path

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))
from spacebridgeapp.util import py23

from cloudgateway.registration_v2 import complete_registration
from cloudgateway.splunk.encryption import SplunkEncryptionContext
from cloudgateway.private.sodium_client import SodiumClient
from cloudgateway.private.exceptions.registration_exceptions import RegistrationError
from spacebridgeapp.exceptions.spacebridge_exceptions import SpacebridgeError
from spacebridgeapp.util import constants
from spacebridgeapp.util.constants import AUTH_CODE, QUERY, SESSION, USER, AUTHTOKEN, SYSTEM_AUTHTOKEN, \
    APP_ID, APP_NAME, DEVICE_NAME, DEVICE_TYPE, PLATFORM, DEVICE_ID, ENCRYPT_PUBLIC_KEY, SIGN_PUBLIC_KEY, \
    DEVICE_REGISTERED_TIMESTAMP, REGISTRATION_METHOD, AUTH_METHOD, DEVICE_MANAGEMENT_METHOD, PAYLOAD, STATUS
from spacebridgeapp.util.app_info import resolve_app_name, get_app_platform
from spacebridgeapp.rest.base_endpoint import BaseRestHandler
from spacebridgeapp.rest.services.kvstore_service import KVStoreCollectionAccessObject as KvStore
from spacebridgeapp.rest.registration.util import RegistrationMethod, AuthMethod, DeviceManagementMethod, \
    extract_parameter_if_exists
from spacebridgeapp.util.config import SecureGatewayConfig
from spacebridgeapp.rest.util.helper import extract_parameter
from spacebridgeapp.util.time_utils import get_current_timestamp
from spacebridgeapp.rest.services.splunk_service import user_is_splunk_mobile_administrator

sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))
sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))

class RegistrationHandler(BaseRestHandler, PersistentServerConnectionApplication):
    """
    Main class for handling REST RegistrationV2 endpoint. Subclasses the spacebridge_app
    BaseRestHandler. This multiple inheritance is an unfortunate neccesity based on the way
    Splunk searches for PersistentServerConnectionApplications
    """

    def __init__(self, command_line, command_arg):
        BaseRestHandler.__init__(self, logname="rest_registration_saml")

    def post(self, request):
        body = json.loads(request[PAYLOAD])
        auth_code = body.get(AUTH_CODE, None)
        auth_method = body.get(AUTH_METHOD, AuthMethod.LOCAL_LDAP.value)

        if not auth_code:
            return {
                PAYLOAD: {
                    'message': "auth_code is empty",
                },
                STATUS: HTTPStatus.BAD_REQUEST
            }

        user_param = request[QUERY].get(USER, "")
        session_token = request[SESSION][AUTHTOKEN]
        system_authtoken = request[SYSTEM_AUTHTOKEN]
        is_user_mobile_admin = user_is_splunk_mobile_administrator(session_token)
        # allow admin to specify user, otherwise default to user from session context
        user = user_param if is_user_mobile_admin and user_param else request[SESSION][USER]

        return handle_registration_v2(self.log, self.config, auth_code, auth_method, user, session_token, system_authtoken)


def handle_registration_v2(log: logging.Logger, config: SecureGatewayConfig, auth_code, auth_method, user, session_token, system_authtoken):
    """
    """

    splapp_encryption_context = SplunkEncryptionContext(system_authtoken,
                                                        constants.SPACEBRIDGE_APP_NAME,
                                                        SodiumClient(log.getChild("sodium_client")))

    formatted_auth_code = str(auth_code).upper()
    master_key = splapp_encryption_context.sodium_client.pwhash_easy(formatted_auth_code)
    auth_id = splapp_encryption_context.sodium_client.crypto_kdf_derive_authid(master_key)
    saml_register = auth_method == AuthMethod.SAML.value

    try:
        log.debug("Checking if registration complete for auth code={} and user={}".format(formatted_auth_code, user))
        device_info = complete_registration(auth_id=auth_id, encryption_context=splapp_encryption_context, config=config)
        device_id_raw = device_info.client_id(splapp_encryption_context)
        app_name = resolve_app_name(device_info.app_id)
        platform = get_app_platform(device_info.app_id)
        encoded_device_id = py23.b64encode_to_str(device_id_raw)
        device_registration = {
            constants.KEY: py23.urlsafe_b64encode_to_str(device_id_raw),
            APP_ID: device_info.app_id,
            APP_NAME: app_name,
            DEVICE_TYPE: app_name,
            PLATFORM: platform,
            DEVICE_ID: py23.b64encode_to_str(device_id_raw)
        }

        device_public_keys = {
            constants.KEY: py23.urlsafe_b64encode_to_str(device_id_raw),
            ENCRYPT_PUBLIC_KEY: py23.b64encode_to_str(device_info.encryption_public_key),
            SIGN_PUBLIC_KEY: py23.b64encode_to_str(device_info.signing_public_key),
        }

        # Creates a new permanent record for the device in the kvstore
        kvstore_user = KvStore(constants.REGISTERED_DEVICES_COLLECTION_NAME, system_authtoken, owner=user)
        device_registration[DEVICE_REGISTERED_TIMESTAMP] = get_current_timestamp()
        device_registration[REGISTRATION_METHOD] = RegistrationMethod.QR_CODE.value
        device_registration[AUTH_METHOD] = AuthMethod.SAML.value if saml_register else AuthMethod.LOCAL_LDAP.value
        device_registration[DEVICE_MANAGEMENT_METHOD] = DeviceManagementMethod.NOT_MDM.value
        kvstore_user.insert_single_item(device_registration)
        log.info("wrote to registered_devices={}".format(encoded_device_id))

        # Adds the user to the list of users with registered devices, if not already there
        kvstore_users = KvStore(constants.REGISTERED_USERS_COLLECTION_NAME, system_authtoken)
        kvstore_users.insert_or_update_item_containing_key({constants.KEY: user})

        log.info("wrote to registered_users={}".format(encoded_device_id))

        kvstore_nobody = KvStore(constants.DEVICE_PUBLIC_KEYS_COLLECTION_NAME, system_authtoken)
        kvstore_nobody.insert_single_item(device_public_keys)

        log.info("wrote to public_keys={}".format(encoded_device_id))

        log.info(
            'Device registration confirmed. Device for user=\"%s\", with type=\"%s\", and app=\"%s\" was recorded in '
            'kvstore', user, app_name, app_name)
        return {
            'payload': {'message': 'Successful registration for user={}'.format(user)},
            'status': HTTPStatus.OK,
         }

    except SpacebridgeError as e:
        log.exception(f"Complete Registration returned error {e}")

    except RegistrationError as reg_err:

        if reg_err.code == HTTPStatus.NO_CONTENT:
            return {
                constants.PAYLOAD: {constants.MESSAGE: 'No content response'},
                constants.STATUS: HTTPStatus.NO_CONTENT,
            }

        log.exception(f"Complete Registration returned error {reg_err}")

    log.error('Complete Registration failed')
    return {
        'payload': {'message': 'Complete Registration returned error'},
        'status': HTTPStatus.INTERNAL_SERVER_ERROR,
    }
