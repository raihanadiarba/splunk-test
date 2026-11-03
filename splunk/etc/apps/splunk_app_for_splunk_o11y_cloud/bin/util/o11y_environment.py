import json
import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'libs'))

from util.request_utils import is_allowed_o11y_realm
from util.exception import ConfigurationException, OperationException

from util.o11y_utils import EnvSettings, AdminSettings, DevSettings, O11Y_TOKEN_NAME
from splunklib.client import Service

APP_NAME = 'splunk_app_for_splunk_o11y_cloud'
OLD_O11Y_DOMAIN = 'signalfx.com'
NEW_O11Y_DOMAIN = 'observability.splunkcloud.com'
PRIVATE_LINK_CONF_KEY = 'enable_privatelink'
PRIVATE_LINK_HOST_PREFIX = 'private-'
PRIVATE_LINK_ALLOWED_REALMS = ['lab0', 'rc0']
O11Y_MON0_CONF_KEY = 'enable_mon0'
O11Y_MON0_ALLOWED_REALM = ['mon0']
# When enabled this will allow ollyPromoApp code to support Domain Discovery
# feature while implementation is still in progress
DOMAIN_DISCO_FF = True


class O11yContext:
    """
    Context for O11y operations, encapsulating the information from HTTP requests,
    and methods to retrieve information needed for requests to O11y.

    This class is responsible for:
    - Extracting data from incoming requests.
    - Providing methods to retrieve the API token, realm, and urls needed to access o11y.
    - Interacting with Splunk services to fetch credentials and configuration details.
    """
    def __init__(self, request):
        if not isinstance(request, dict):
            raise ValueError('request must be a dict')

        self.request = request

        # Use system auth token by default
        self.auth_token = self.request.get('system_authtoken', None)

        # Some endpoints require user authentication, and do not have a system auth token.
        if not self.auth_token:
            self.auth_token = self.request.get('session').get('authtoken') if self.request.get('session') else None

        if not self.auth_token:
            raise ValueError('No auth token found in request')

        self.realm = None
        self.o11y_token = None

        # Extract O11y domain from query parameter
        self.o11y_domain = self._extract_o11y_domain(request)

    def _extract_o11y_domain(self, request):
        """Extract O11y domain based on query parameter flag"""
        query = request.get('query', [])
        query_dict = dict(query) if query else {}
        if not DOMAIN_DISCO_FF:
            return OLD_O11Y_DOMAIN
        return NEW_O11Y_DOMAIN if query_dict.get('isNewDomain', '').lower() == 'true' else OLD_O11Y_DOMAIN

    def get_request_path(self):
        return self.request.get('rest_path', '')

    def get_api_token(self):
        if not self.o11y_token:
            self._get_o11y_realm_and_access_token(self._get_splunk_service())

        return self.o11y_token

    def get_realm(self):
        if not self.realm:
            self._get_o11y_realm_and_access_token(self._get_splunk_service())

        return self.realm

    def get_stream_url(self, force_new_domain=False):
        return f'https://{self.get_stream_host(force_new_domain=force_new_domain)}'

    def get_stream_host(self, realm=None, force_new_domain=False):
        if realm:
            realm = realm.lower()
        else:
            realm = self.get_realm().lower() if self.get_realm() else None

        if not realm:
            raise ConfigurationException('Realm is not set. Cannot determine stream host.')

        if not is_allowed_o11y_realm(realm):
            raise ConfigurationException(f'Realm {realm} is not allowed. Cannot determine stream host.')

        # Use new domain if force_new_domain is True, otherwise use old domain
        domain = NEW_O11Y_DOMAIN if force_new_domain else self.o11y_domain
        default_stream_host = f'stream.{realm}.{domain}'

        # Check if realm is allowed for private link configuration
        if self.is_privatelink_config_enabled() and realm in PRIVATE_LINK_ALLOWED_REALMS:
            # hardcode to old domain for private link since new domain is not supported in private link yet
            default_stream_host = f'stream.{realm}.{OLD_O11Y_DOMAIN}'
            return f'{PRIVATE_LINK_HOST_PREFIX}{default_stream_host}'

        # Check if realm is allowed for mon0 configuration
        if self.is_mon0_config_enabled() and realm in O11Y_MON0_ALLOWED_REALM:
            return f'mon-stream.{self.o11y_domain}'

        return default_stream_host

    def get_admin_settings(self):
        return AdminSettings.get_settings(self._get_splunk_service())

    def get_dev_settings(self):
        return DevSettings.get_settings(self._get_splunk_service())

    def get_api_url(self, path=''):
        api_url = f'https://{self.get_api_host()}'
        if not path:
            return api_url
        return f'{api_url}/{path.lstrip("/")}'

    def get_api_host(self, realm=None, force_new_domain=False):
        if realm:
            realm = realm.lower()
        else:
            realm = self.get_realm().lower() if self.get_realm() else None

        if not realm:
            raise ConfigurationException('Realm is not set. Cannot determine API host.')

        if not is_allowed_o11y_realm(realm):
            raise ConfigurationException(f'Realm {realm} is not allowed. Cannot determine API host.')

        # Determine domain: force new domain for specific endpoints (e.g., /v2/organization)
        domain = NEW_O11Y_DOMAIN if force_new_domain else self.o11y_domain

        # Check if realm is allowed for private link configuration
        if self.is_privatelink_config_enabled() and realm in PRIVATE_LINK_ALLOWED_REALMS:
            # hardcode to old domain for private link since new domain is not supported in private link yet
            return f'{PRIVATE_LINK_HOST_PREFIX}api.{realm}.{OLD_O11Y_DOMAIN}'

        return f'app.{realm}.{domain}'

    def _get_splunk_service(self):
        splunkd_scheme, splunkd_host, splunkd_port = self._extract_splunk_scheme_host_port(self.request)

        return Service(scheme=splunkd_scheme, host=splunkd_host, port=splunkd_port,
                       token=self.auth_token, app=APP_NAME)

    def _get_o11y_realm_and_access_token(self, service):
        for credential in service.storage_passwords:
            if credential.content.get('username', None) == O11Y_TOKEN_NAME:
                self.o11y_token = credential.content.get('clear_password', None).strip()
                self.realm = credential.content.get('realm', None).strip()

    @staticmethod
    def _extract_splunk_scheme_host_port(request):
        server = request.get('server', {})
        rest_uri = server.get('rest_uri', '')

        if rest_uri:
            uri_segments = rest_uri.split(':')
            if len(uri_segments) > 2:
                return uri_segments[0], uri_segments[1][2:], uri_segments[2]

        return 'https', 'localhost', 8089

    def is_privatelink_config_enabled(self):
        if not hasattr(self, '_privatelink_enabled'):
            self._privatelink_enabled = str(
                EnvSettings.get_env_setting(self._get_splunk_service())
                .get(PRIVATE_LINK_CONF_KEY, 'False')).lower() == 'true'
        return self._privatelink_enabled

    def is_mon0_config_enabled(self):
        if not hasattr(self, '_mon0_enabled'):
            self._mon0_enabled = str(
                EnvSettings.get_env_setting(self._get_splunk_service())
                .get(O11Y_MON0_CONF_KEY, 'False')).lower() == 'true'
        return self._mon0_enabled


class O11yController:
    """
    Base class for controllers that interact with o11y APIs. It instantiates an O11yContext and passes it, along with
    the parsed request, to the handle_request method.

    Defines the default handle method required by PersistentServerConnectionApplication and must be implemented before
    it.

    Note: PersistentServerConnectionApplication cannot be a superclass of this class due to how Splunk manages it.
    """
    def handle(self, in_string):
        request = json.loads(in_string.decode('utf-8'))
        o11y_context = O11yContext(request)

        try:
            return self.handle_request(o11y_context, request)
        except ConfigurationException as e:
            return {
                "status": 400,
                "payload": json.dumps({"error": str(e)})
            }
        except OperationException as e:
            return {
                "status": 500,
                "payload": str(e)
            }
        except Exception:
            return {
                "status": 500,
                "payload": 'Internal Error - Unable to process request'
            }

    def handle_request(self, o11y_context, request):
        raise NotImplementedError("This method should be implemented in subclasses.")

    def done(self):
        pass
