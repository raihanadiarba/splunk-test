import json

import requests
from splunk.persistconn.application import PersistentServerConnectionApplication
import os
import sys
from http import HTTPStatus
import socket
import ipaddress

current_path = os.path.dirname(__file__)
sys.path.append(current_path)
sys.path.append(os.path.abspath(os.path.join(current_path, '..')))
from util import o11y_utils
from util.o11y_environment import (
    O11yController, O11yContext,
    O11Y_MON0_ALLOWED_REALM, PRIVATE_LINK_ALLOWED_REALMS, NEW_O11Y_DOMAIN
)
from util.request_utils import RequestValidationException, is_allowed_o11y_realm
from util.exception import ConfigurationException

logger = o11y_utils.setup_logger('o11y_token_service')


def get_o11y_org(o11y_context: O11yContext, realm, o11y_token):
    # Validates the realm and token by fetching the related org.
    if not o11y_token or not o11y_token.strip():
        raise RequestValidationException({'token': 'Token is required'})
    elif not realm:
        raise RequestValidationException({'realm': 'Realm is required'})

    # Organization endpoint always available on new domain, so force new domain
    o11y_host_name = o11y_context.get_api_host(realm, force_new_domain=True)
    o11y_org_url = f'https://{o11y_host_name}/v2/organization'

    o11y_response = requests.get(o11y_org_url, headers={
        'X-SF-Token': o11y_token
    }, allow_redirects=False)

    if o11y_response.status_code == HTTPStatus.OK:
        return o11y_response.json()
    elif o11y_response.status_code == HTTPStatus.UNAUTHORIZED:
        raise RequestValidationException({'token': 'Token is invalid'})
    else:
        logger.warning(
            f'Unexpected response received from request:{o11y_org_url} ,'
            'response code:{o11y_response.status_code} ,'
            'o11y_response:{o11y_response}')


def validate_token(o11y_context: O11yContext, realm: str, o11y_token: str):
    # Validates the realm and token by fetching the related org.
    if not o11y_token or not o11y_token.strip():
        raise RequestValidationException({'token': 'Token is required'})
    elif not realm:
        raise RequestValidationException({'realm': 'Realm is required'})

    # Check if realm is in allow list of o11y realms
    if not is_allowed_o11y_realm(realm):
        logger.info(f'Realm {realm} is not allowed.')
        raise RequestValidationException(f'Realm {realm} is not allowed.')

    o11y_host_name = o11y_context.get_api_host(realm)

    try:
        resolved_ip = socket.gethostbyname(o11y_host_name)
    except Exception:
        logger.info(f'Host is invalid: {o11y_host_name}')
        raise RequestValidationException({'host': 'Host is invalid'})

    # Verify resolved_ip is a public (global) address when private link is not
    # enabled
    if not o11y_context.is_privatelink_config_enabled():
        if not ipaddress.ip_address(resolved_ip).is_global:
            logger.info('Host must be a public IP address')
            raise RequestValidationException({'host': 'Host must be a public IP address'})

    # Check if realm is allowed for private link configuration
    if o11y_context.is_privatelink_config_enabled() and realm not in PRIVATE_LINK_ALLOWED_REALMS:
        raise ConfigurationException(f'Realm {realm} is not allowed for private link.')

    # Check if realm is allowed for mon0 configuration
    if o11y_context.is_mon0_config_enabled() and realm not in O11Y_MON0_ALLOWED_REALM:
        raise ConfigurationException(f'Realm {realm} is not allowed for mon0.')

    # If the org can be fetched without exception, the token is valid.
    return get_o11y_org(o11y_context, realm, o11y_token)


class TokenService(O11yController, PersistentServerConnectionApplication):
    def __init__(self, _command_line, _command_arg):
        super(PersistentServerConnectionApplication, self).__init__()
        self.storage_passwords = None

    def _get_all_tokens(self, o11y_context: O11yContext):
        o11y_access_tokens = []
        for credential in o11y_context._get_splunk_service().storage_passwords:
            if credential.content.get('username', None) == o11y_utils.O11Y_TOKEN_NAME:
                realm = credential.content.get('realm', None)
                o11y_access_token = credential.content.get('clear_password', None)

                try:
                    organization = get_o11y_org(o11y_context, realm, o11y_access_token)
                except RequestValidationException:
                    organization = None

                token_definition = {
                    'token': o11y_access_token,
                    'realm': realm,
                    'status': 'ACTIVE' if organization else 'INACTIVE',
                    'orgName': organization['organizationName'] if organization else None,
                    'orgId': organization['id'] if organization else None,
                    'url': organization['url'] if organization else None
                }
                o11y_access_tokens.append(token_definition)

        return o11y_access_tokens

    def _get_token(self, realm):
        o11y_access_token = self._get_token_from_passwords(realm)

        if o11y_access_token:
            return {'token': (o11y_access_token.content.get('clear_password', None)), 'realm': realm}

        return None

    def _get_token_from_passwords(self, realm):
        for credential in self.storage_passwords:
            if ((credential.content.get('username', None) == o11y_utils.O11Y_TOKEN_NAME)
                    and (credential.content.get('realm', None) == realm)):
                return credential

        return None

    def _save_token(self, o11y_context: O11yContext, o11y_token: str, realm: str):
        org = validate_token(o11y_context, realm, o11y_token)
        self._delete_all_tokens()
        logger.debug('Before saving the new token')
        self.storage_passwords.create(o11y_token, o11y_utils.O11Y_TOKEN_NAME, realm)
        logger.debug('After saving the new token')
        return {
            'token': o11y_token,
            'realm': realm,
            'status': 'ACTIVE',
            'orgName': org['organizationName'],
            'orgId': org['id'],
            'url': org['url']
        }

    def _delete_token(self, realm):
        o11y_access_token = self._get_token_from_passwords(realm)

        if o11y_access_token is None:
            return None
        else:
            logger.debug('Before deleting the token')
            deleted_token = o11y_access_token.delete()
            logger.debug('after deleting the token')
            return deleted_token

    def _delete_all_tokens(self):
        for credential in self.storage_passwords:
            if credential.content.get('username', None) == o11y_utils.O11Y_TOKEN_NAME:
                credential.delete()

    def _status_message(self, exception_string):
        if 'HTTP 403 Forbidden' in str(exception_string):
            return {'status': 403, 'payload': {'error': 'Unauthorized'}}
        else:
            return {'status': 500, 'payload': {'error': 'exception due to internal server error'}}

    def handle_request(self, o11y_context: O11yContext, request: dict) -> dict:
        request_method = request.get('method')

        service = o11y_context._get_splunk_service()
        self.storage_passwords = service.storage_passwords

        if request_method == 'GET':
            realm = self._get_realm_from_query_params(request)
            if not realm:
                realm = '*'

            try:
                logger.info('Getting token for realm %s', realm)
                if realm == '*':
                    o11y_token_response = self._get_all_tokens(o11y_context)
                else:
                    o11y_token_response = self._get_token(realm)
            except Exception as e:
                logger.exception(e)
                return self._status_message(str(e))

            if o11y_token_response is None:
                return {'status': 200, 'payload': {'message': 'o11y token not found for realm ' + str(realm)}}
            else:
                return {'status': 200, 'payload': o11y_token_response}

        elif request_method == 'POST':
            query_payload = request.get('payload', '{}')
            query_params = json.loads(query_payload)
            o11y_token = query_params.get('token')
            realm = query_params.get('realm')

            try:
                logger.info('Saving token for realm %s', realm)
                saved_token = self._save_token(o11y_context, o11y_token, realm)
            except RequestValidationException as e:
                logger.warning(f'Unable to validate token for realm {realm} - {e}')
                return {'status': e.status_code, 'payload': {'error': e.message}}
            except Exception as e:
                logger.exception(e)
                return self._status_message(str(e))

            if saved_token:
                return {'status': 201, 'payload': saved_token}
            else:
                return {'status': 500,
                        'payload': {'error': 'internal server error, o11y token not saved for realm ' + str(realm)}}

        elif request_method == 'DELETE':
            realm = self._get_realm_from_query_params(request)

            if not realm:
                return {'status': 400, 'payload': {'error': 'Bad request'}}

            try:
                logger.info('Deleting token for realm %s', realm)
                deleted_token = self._delete_token(realm)
            except Exception as e:
                logger.exception(e)
                return self._status_message(str(e))

            if deleted_token is None:
                return {'status': 200, 'payload': {'message': 'o11y token not found for realm ' + str(realm)}}
            else:
                return {'status': 200, 'payload': {'message': 'o11y token deleted for realm ' + str(realm)}}
        else:
            return {'status': 405, 'payload': {'error': 'Method not allowed'}}

    def _get_realm_from_query_params(self, request):
        query = request.get('query')

        if query:
            realm_list = query[0]
            if realm_list[0] == 'realm' and len(realm_list) > 1:
                return realm_list[1]

        return None
