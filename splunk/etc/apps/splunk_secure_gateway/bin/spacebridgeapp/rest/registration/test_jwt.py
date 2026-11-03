"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

REST endpoint handler for testing JWT creation
"""
import os
import sys
from enum import Enum

import splunk
from splunk.persistconn.application import PersistentServerConnectionApplication
from splunk.clilib.bundle_paths import make_splunkhome_path

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

from http import HTTPStatus
import datetime
from cloudgateway.splunk.auth import SplunkJWTCredentials
from cloudgateway.private.sodium_client import SodiumClient
from spacebridgeapp.request.splunk_auth_header import SplunkAuthHeader
from spacebridgeapp.rest.base_endpoint import BaseRestHandler
from spacebridgeapp.rest.services.splunk_service import delete_token_by_id, get_current_context
from spacebridgeapp.request.splunk_auth_header import SplunkAuthHeader

from spacebridgeapp.util.constants import SPACEBRIDGE_APP_NAME, SYSTEM_AUTHTOKEN, SESSION, STATUS, JWT, \
    USER, PAYLOAD, MESSAGE

sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))
sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))

class ErrorType(Enum):
    # Do not change the value of the enum fields as they are used by the frontend!
    UNKNOWN = 'UNKNOWN'
    JWT_TOKEN_CREATION_FAILED = 'JWT_TOKEN_CREATION_FAILED'
    JWT_TOKEN_USAGE_FAILED = 'JWT_TOKEN_USAGE_FAILED'

    def __str__(self):
        return str(self.value)

class TestJwt(BaseRestHandler, PersistentServerConnectionApplication):
    """
    Main class for handling the test_Jwt endpoint. Subclasses the spacebridge_app
    BaseRestHandler.
    """

    ERROR_TYPE = 'error_type'
    TOKEN_EXPIRATION = 'token_expiration'

    def __init__(self, command_line, command_arg):
        BaseRestHandler.__init__(self, logname="rest_test_jwt")
        self.sodium_client = SodiumClient()

    def get(self, request):
        """
        This will return True/False depending if the user has properly setup JWT tokens

        :param request
        :return:
        """

        # Setup
        system_authtoken = request[SYSTEM_AUTHTOKEN]
        user = request[SESSION][USER]
        is_jwt_token = False

        # Attempt to create JWT Token, if any error occurs we want to log it, but still return False
        self.log.info("Initiating test for JWT token configuration")
        try:
            jwt_credentials = SplunkJWTCredentials(user)
            jwt_credentials.create_jwt_token(system_authtoken)
            is_jwt_token = True if jwt_credentials.token_id else False
            expiration = jwt_credentials.get_expiration()
            expiration_date = str(datetime.datetime.fromtimestamp(int(expiration)).strftime("%Y-%m-%d %H:%M:%S %Z"))
            self.log.info(f"Succesfully created JWT token with token_expiration={expiration_date}")

        except Exception as e:
            error_msg = "Failed to create JWT token for user = {}, error = {}".format(user,e)
            self.log.debug(error_msg)
            return {
                STATUS: HTTPStatus.PRECONDITION_REQUIRED,
                PAYLOAD: {MESSAGE: error_msg, self.ERROR_TYPE: str(ErrorType.JWT_TOKEN_CREATION_FAILED)}
            }
        # If JWT token was successfully created, attempt to use it
        try:
            self.log.info("Attempting to use created token")
            token = jwt_credentials.token
            get_current_context(token)
            self.log.info("Succesfully used token with Splunk rest endpoint")
        except splunk.RESTException as err:
            return {PAYLOAD: {MESSAGE: err.msg, self.ERROR_TYPE: str(ErrorType.JWT_TOKEN_USAGE_FAILED), self.TOKEN_EXPIRATION:expiration_date}, STATUS: err.statusCode}

        # clean up token
        if is_jwt_token:
            delete_token_by_id(self.log, system_authtoken, user, jwt_credentials.token_id)



        return {
            STATUS: HTTPStatus.OK,
            PAYLOAD: {JWT: is_jwt_token, self.TOKEN_EXPIRATION: expiration_date}
        }
