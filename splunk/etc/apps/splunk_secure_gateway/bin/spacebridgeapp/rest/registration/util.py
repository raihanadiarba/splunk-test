"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Utilities for registration handlers
"""
import logging

from cloudgateway.splunk.auth import SplunkJWTCredentials

from spacebridgeapp.util import constants
from spacebridgeapp.util.config import SecureGatewayConfig
from spacebridgeapp.rest.registration.registration_webhook import validate_user
from spacebridgeapp.request.splunk_auth_header import SplunkAuthHeader
from spacebridgeapp.rest.services.splunk_service import get_current_context
from spacebridgeapp.rest.util.helper import extract_parameter
from enum import Enum

class RegistrationMethod(Enum):
    """
    Enum for types of registration methods
    """

    AUTH_CODE = "auth_code"
    QR_CODE = "qr_code"
    IN_APP = "in_app"
    MDM = "mdm"
    UNKNOWN = "unknown"


class AuthMethod(Enum):
    """
    Enum for types of registration authentication methods
    """

    SAML = "saml"
    LOCAL_LDAP = "local_ldap"
    UNKNOWN = "unknown"


class DeviceManagementMethod(Enum):
    """
    Enum for types of device management methods
    """

    MDM = "mdm"
    NOT_MDM = "not_mdm"
    UNKNOWN = "unknown"


def validate_registration_via_webhook(config: SecureGatewayConfig, log: logging.Logger, user: str) -> None:
    """
    Method to validate user via registration webhook.
    """
    log.debug('Received new registration confirmation request by user={}'.format(user))
    registration_webhook_url = config.get_registration_webhook_url()

    if registration_webhook_url:
        log.debug('Attempt to validate user via registration webhook')
        validate_user(log, registration_webhook_url, user, config.get_webhook_verify_ssl())
        log.debug('Successfully validated that user via registration webhook')


def is_valid_session_token(user: str, session_token: str) -> bool:
    """
    Method to validate that the user provided session token matches the user
    :param user: string
    :param session_token: string
    :return: boolean
    """
    response = get_current_context(session_token)
    context_user = response[constants.USERNAME]
    return user == context_user


def generate_jwt_token(config: SecureGatewayConfig,
                       log: logging.Logger,
                       user: str,
                       system_authtoken: str,
                       edge_hub: bool = False) -> SplunkJWTCredentials:
    """
    Method to fetch and return JWT token. Will throw exception if fetch fails.
    :param log:
    :param user: string
    :param system_authtoken: string
    :param edge_hub: indicate if token is need for Edge Hub. Lead to different expiration time
    :return: SplunkJWTCredentials
    """
    jwt_expiration = config.get_formatted_jwt_expiration()
    jwt_eh_expiration = config.get_formatted_jwt_eh_expiration()
    expiration = jwt_eh_expiration if edge_hub else jwt_expiration

    credentials = SplunkJWTCredentials(user)
    credentials.create_jwt_token(system_authtoken, jwt_expiration=expiration)
    log.debug("Successfully fetched jwt token for SAML auth user with username={}, ttl={}".format(user, expiration), stack_info=True)
    return credentials


def extract_parameter_if_exists(obj, key, source_name, default_value):
    """
    If a value exists within a dictionary and is non-empty, returns it. Otherwise returns
    the provided default value
    """
    try:
        return extract_parameter(obj, key, source_name)
    except Exception as e:
        return default_value
