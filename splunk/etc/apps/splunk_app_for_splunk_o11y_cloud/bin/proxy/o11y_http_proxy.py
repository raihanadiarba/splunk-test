import os
import sys
from urllib.parse import unquote, urlsplit

import requests
import socket
import ipaddress
from splunk.persistconn.application import PersistentServerConnectionApplication

current_path = os.path.dirname(__file__)
sys.path.append(current_path)
sys.path.append(os.path.abspath(os.path.join(current_path, '..')))

from util.exception import ConfigurationException
from util.request_utils import RequestValidationException, validate_request
from util import o11y_utils
from util.response_transformer import transform_response
from util.o11y_environment import O11yController

logger = o11y_utils.setup_logger('o11y_http_proxy')

O11Y_URL_PREFIX = '/o11y'


def normalize_proxy_rest_path(path: str) -> str:
    """Return the canonical upstream path after stripping exactly one proxy prefix."""
    if not isinstance(path, str):
        raise ValueError('Proxy path must be a string')

    try:
        parsed_path = urlsplit(path)
        decoded_path = unquote(parsed_path.path, errors='strict')
    except (UnicodeDecodeError, ValueError) as e:
        raise ValueError('Proxy path contains invalid encoding') from e

    if parsed_path.scheme or parsed_path.netloc:
        raise ValueError('Proxy path must not contain a URL authority')
    if any(delimiter in decoded_path for delimiter in ('%', '?', '#')):
        raise ValueError('Proxy path contains reserved characters')

    normalized = decoded_path.rstrip('/') if len(decoded_path) > 1 else decoded_path
    if normalized == O11Y_URL_PREFIX:
        return ''

    proxy_prefix = f'{O11Y_URL_PREFIX}/'
    if not normalized.startswith(proxy_prefix):
        raise ValueError('Proxy path must start with exactly one /o11y prefix')

    upstream_path = normalized[len(O11Y_URL_PREFIX):]
    if upstream_path == O11Y_URL_PREFIX or upstream_path.startswith(proxy_prefix):
        raise ValueError('Repeated /o11y prefix is not allowed')

    return upstream_path


def is_safe_path(path):
    """Reject paths that can alter the upstream route or URL authority."""
    if not isinstance(path, str) or (path and not path.startswith('/')):
        return False

    has_repeated_prefix = path == O11Y_URL_PREFIX or path.startswith(f'{O11Y_URL_PREFIX}/')
    return not (
        '..' in path
        or '//' in path
        or '@' in path
        or '\\' in path
        or has_repeated_prefix
    )


class O11yHttpProxy(O11yController, PersistentServerConnectionApplication):

    ADMIN_RESTRICTED_PATHS = ['/v2/token']

    def __init__(self, _command_line, _command_arg):
        super(PersistentServerConnectionApplication, self).__init__()

    @staticmethod
    def _requires_admin_access(path: str) -> bool:
        """Check if the path or any descendant requires admin privileges."""
        normalized_path = path.rstrip('/') or '/'
        return any(
            normalized_path == restricted_path
            or normalized_path.startswith(f'{restricted_path.rstrip("/")}/')
            for restricted_path in O11yHttpProxy.ADMIN_RESTRICTED_PATHS
        )

    def handle_request(self, o11y_context, request):
        raw_path = request.get('rest_path')
        try:
            path = normalize_proxy_rest_path(raw_path)
        except ValueError as e:
            logger.warning(f'Blocked unsafe path {raw_path}: {e}')
            return {'status': 400, 'payload': {'error': 'Unsafe path detected.'}}

        if not is_safe_path(path):
            logger.warning(f'Blocked unsafe path: {path}')
            return {'status': 400, 'payload': {'error': 'Unsafe path detected.'}}

        if self._requires_admin_access(path) and not o11y_utils.is_user_admin(o11y_context, request):
            username = request.get('session', {}).get('user', 'unknown')
            logger.warning(f'Unauthorized access attempt to {path} by user: {username}')
            return {'status': 403, 'payload': {'error': 'Unauthorized'}}

        try:
            validation_request = dict(request)
            validation_request['rest_path'] = path
            validate_request(validation_request)
        except RequestValidationException as e:
            logger.warning(f'Request validation failed: {e.message}')
            return {'status': e.status_code, 'payload': {'error': e.message}}

        return self.make_request(o11y_context, {
            'request_body': request.get('payload'),
            'rest_path': path,
            'request_method': request.get('method'),
            'request_query': request.get('query')
        })

    @staticmethod
    def make_request(o11y_context, request_obj):
        request_body = request_obj.get('request_body', '')
        rest_path = request_obj.get('rest_path', '')
        request_method = request_obj.get('request_method', 'GET').upper()
        request_query = request_obj.get('request_query', {})

        if not is_safe_path(rest_path):
            logger.warning(f'Blocked unsafe upstream path: {rest_path}')
            return {'status': 400, 'payload': {'error': 'Unsafe path detected.'}}

        path = rest_path
        o11y_host_name = o11y_context.get_api_host()
        o11y_request_url = o11y_context.get_api_url(path)

        try:
            parsed_url = urlsplit(o11y_request_url)
            parsed_port = parsed_url.port
        except (TypeError, ValueError):
            logger.warning('Blocked malformed O11y request URL')
            return {'status': 400, 'payload': {'error': 'Unsafe O11y destination.'}}

        expected_host = o11y_host_name.rstrip('.').lower()
        connect_host = (parsed_url.hostname or '').rstrip('.').lower()
        if (
            parsed_url.scheme.lower() != 'https'
            or parsed_url.username is not None
            or parsed_url.password is not None
            or parsed_port is not None
            or connect_host != expected_host
        ):
            logger.warning(f'Blocked unexpected O11y destination host: {connect_host}')
            return {'status': 400, 'payload': {'error': 'Unsafe O11y destination.'}}

        try:
            resolved_ip = socket.gethostbyname(connect_host)
        except Exception:
            logger.error(f'Failed to resolve IP address for {connect_host}')
            return {'status': 400, 'payload': {'error': 'Failed to resolve IP address'}}

        # Verify the resolved IP is a public (global) address when private link
        # is not enabled
        if not o11y_context.is_privatelink_config_enabled():
            if not ipaddress.ip_address(resolved_ip).is_global:
                logger.info('Host must be a public IP address')
                return {'status': 400, 'payload': {'error': 'Host must be a public IP address'}}

        api_token = o11y_context.get_api_token()
        if not api_token:
            raise ConfigurationException("No O11y Access Token found")

        o11y_headers = {
            'X-SF-Token': api_token,
            'Content-Type': 'application/json'
        }

        o11y_request = {
            'method': request_method,
            'url': o11y_request_url,
            'body': str(request_body),
            'params': request_query,
        }
        logger.info(f'Request to O11y: {o11y_request}')

        try:
            o11y_response = requests.request(
                request_method, o11y_request_url, data=request_body,
                headers=o11y_headers, params=request_query, allow_redirects=False)

            logger.info(f'Response from O11y: {o11y_response}')
            json_data = o11y_response.json()
            transformed_data = transform_response(o11y_context, json_data)
            return {'status': o11y_response.status_code, 'payload': transformed_data}

        except Exception as e:
            logger.error(
                f'An error occurred from request {o11y_request_url}: {e}')
            return {'status': 500, 'payload': {'error': str(e)}}
