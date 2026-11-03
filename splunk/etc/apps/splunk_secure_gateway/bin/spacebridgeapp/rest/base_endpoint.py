"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Generic base class from which all custom Splunk-facing rest endpoints inherit. Generalizes
support for http methods, and abstracts out repetitive boilerplate and error-parsing logic
"""
import os
os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
import json
import sys
import traceback
from http import HTTPStatus

import splunk

from spacebridgeapp.util import py23
from cloudgateway.private.exceptions.rest import CloudgatewayServerError
from cloudgateway.private.registration.registration_utils import RegistrationError
from spacebridgeapp.exceptions import spacebridge_exceptions
from spacebridgeapp.exceptions.spacebridge_exceptions import SpacebridgeApiRequestError
from spacebridgeapp.rest.util import errors
from spacebridgeapp.util import constants
from spacebridgeapp.util.config import load_config
from spacebridgeapp.logging import setup_logging, NoopLogger
import logging
import splunk.rest as rest
from spacebridgeapp.rest.clients.async_client_factory import AsyncClientFactory
from spacebridgeapp.rest.debug.util import create_splunk_resp
from typing import Union

MESSAGE = 'message'

if sys.platform == 'win32':
    import msvcrt
    # Binary mode is required for persistent mode on Windows.
    msvcrt.setmode(sys.stdin.fileno(), os.O_BINARY)
    msvcrt.setmode(sys.stdout.fileno(), os.O_BINARY)
    msvcrt.setmode(sys.stderr.fileno(), os.O_BINARY)

BASE_REST_LOG = "rest_base"
LOG_FILENAME = f"{constants.SPACEBRIDGE_APP_NAME}.log"

def get_value_as_bool(value: str) -> Union[bool, None]:
    """
    Helper to convert string to bool.
    :return:
    """
    return value.lower() == 'true' if isinstance(value,str) else None

class BaseRestHandler:
    """Base class for Spacebridge app REST endpoints."""

    def __init__(self, logname="default"):
        self.__logname = logname
        self.__base_log =setup_logging(LOG_FILENAME, BASE_REST_LOG, level=logging.WARN)
        self.__setup_complete = False
        self.log = NoopLogger(self.__base_log)
        self.config = NoopLogger(self.__base_log)
        self.async_client_factory = NoopLogger(self.__base_log)

    def __setup(self, request):
        if self.__setup_complete:
            return

        system_token = request.get(constants.SYSTEM_AUTHTOKEN)
        self.config = load_config(system_token)
        self.log = setup_logging(LOG_FILENAME, self.__logname , config=self.config)
        if not isinstance(self.async_client_factory, AsyncClientFactory):
            self.async_client_factory = AsyncClientFactory(self.log, self.config, rest.makeSplunkdUri())
        self.__setup_complete = True

    def handle(self, request_json_string):
        """
        Entry path for the REST registration endpoint. This function does the following:
            1. Parses relevant parameters out of the request JSON
            2. Calls the relevant handler based on the request type
            3. Handles errors and formats the response to the UI client

        :param request_json_string: JSON representation of the incoming http request
        :return: response body object and status code
        """
        try:
            # Perform common simplifications on the incoming request object
            request = json.loads(request_json_string)
            self.__setup(request)

            if constants.HEADERS in request:
                request[constants.HEADERS] = flatten_query_params(request[constants.HEADERS])
            request[constants.QUERY] = flatten_query_params(request[constants.QUERY])

            dashboard_format = get_value_as_bool(request[constants.QUERY].get('dashboard_format', "false"))
            res = self.handle_request(request)

        # Handles errors and formats the response to the UI client
        except CloudgatewayServerError as err:
            self.__base_log.exception("Cloudgateway error")
            res = {constants.PAYLOAD: {constants.MESSAGE: err.message}, constants.STATUS: err.status}
        except SpacebridgeApiRequestError as err:
            self.__base_log.exception("SpacebridgeApiRequestError")
            res = {constants.PAYLOAD: {constants.MESSAGE: str(err)}, constants.STATUS: err.status_code}
        except errors.SpacebridgeRestError as err:
            self.__base_log.exception("Spacebridge error")
            res = {constants.PAYLOAD: {constants.MESSAGE: err.message}, constants.STATUS: err.status}
        except spacebridge_exceptions.SpacebridgeError as err:
            self.__base_log.exception("Spacebridge error")
            res = {constants.PAYLOAD: {constants.MESSAGE: err.message}, constants.STATUS: err.status_code}
        except splunk.RESTException as err:
            self.__base_log.exception("Splunk rest error")
            res = {constants.PAYLOAD: {constants.MESSAGE: err.msg}, constants.STATUS: err.statusCode}
        except RegistrationError as err:
            self.__base_log.exception("Splunk Secure Gateway Registration error")
            res = {constants.PAYLOAD: {constants.MESSAGE: str(err)}, constants.STATUS: err.code}
        except Exception as err:
            self.__base_log.exception("Unhandled error")
            message = err.msg if hasattr(err, 'msg') else str(err)
            res = {
                constants.PAYLOAD: {constants.MESSAGE: message},
                constants.STATUS: err.statusCode if hasattr(err, 'statusCode') else 500
            }

        return self.format_response(res, dashboard_format=dashboard_format)

    def handle_request(self, request):
        method = request['method']
        if method == 'GET':
            return self.get(request)
        if method == 'POST':
            return self.post(request)
        if method == 'PUT':
            return self.put(request)
        if method == 'DELETE':
            return self.delete(request)
        return unsupported_method_response(method)

    def format_response(self, response, dashboard_format=False):
        if isinstance(response, dict) and isinstance(response.get(constants.STATUS), int):
            headers = response.get('headers')
            if constants.PAYLOAD in response and dashboard_format:
                response['raw_payload'] = json.dumps(create_splunk_resp(response[constants.PAYLOAD]))

            elif constants.PAYLOAD in response:
                payload = response[constants.PAYLOAD]

                if isinstance(payload, str):
                    payload = {constants.MESSAGE: payload, constants.STATUS: response[constants.STATUS]}

                json_response = {constants.PAYLOAD: payload, constants.STATUS: response[constants.STATUS]}
                if headers:
                    json_response['headers'] = headers
                try:
                    return json.dumps(json_response)
                except TypeError as e:
                    self.__base_log.warning("HTTP Failed to Serialize JSON payload, body=%s", json_response)
                    return {constants.PAYLOAD: payload, constants.STATUS: HTTPStatus.INTERNAL_SERVER_ERROR }

            elif 'binary' in response:
                json_response = {
                    'payload_base64': py23.b64encode_to_str(response['binary']),
                    constants.STATUS: response[constants.STATUS],
                }
                if headers:
                    json_response['headers'] = headers
                return json.dumps(json_response)

            # Format necessary needed for | rest command to be able to parse the result
            if 'raw_payload' in response:
                return {constants.PAYLOAD: response.get('raw_payload'), constants.HEADERS: {constants.HEADER_CONTENT_TYPE: 'application/json'}}

        status = response.get(constants.STATUS, 500) if isinstance(response, dict) else 500
        if not isinstance(status, int):
            status = 500

        json_response = {constants.PAYLOAD: response, constants.STATUS: status}
        return json.dumps(json_response)


    def get(self, request):
        return unsupported_method_response('GET')

    def post(self, request):
        return unsupported_method_response('POST')

    def put(self, request):
        return unsupported_method_response('PUT')

    def delete(self, request):
        return unsupported_method_response('DELETE')


def unsupported_method_response(method):
    return {constants.PAYLOAD: 'Error: Invalid method: %s' % method, constants.STATUS: 405}


def build_error_payload(e):
    return {
        constants.PAYLOAD: {
            'message': e.get_message_text(),
            'description': e.get_extended_message_text()
        },
        constants.STATUS: e.statusCode
    }


def flatten_query_params(params):
    """
    Transforms a list of lists for strings into a dictionary: [ [ 'key', 'value' ] ] => { "key": "value" }
    Used for the query parameters provided to the REST endpoint.

    :param params: List of lists of strings
    :return: Dictionary
    """
    flattened = {}
    for i, j in params:
        # Fixing this to account for repeated parameters
        item = flattened.get(i)
        # If item is already in dict
        if item:
            # This is the case where we have 2 or more items already
            if isinstance(item, list):
                flattened[i].append(j)
            # item is currently a singleton, make it a list and add second item
            else:
                flattened[i] = [item, j]
        else:
            flattened[i] = j
    return flattened
