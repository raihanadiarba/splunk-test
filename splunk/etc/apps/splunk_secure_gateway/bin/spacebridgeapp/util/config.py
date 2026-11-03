"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Configuration utility
"""
import os
import time
import sys
import json
from splunk.clilib import cli_common as cli
from splunk.clilib.bundle_paths import get_base_path
from spacebridgeapp.util import py23
from spacebridgeapp.util.constants import SPACEBRIDGE_SERVER, SPACEBRIDGE_APP_NAME, DEFAULT_HTTP_PORT, \
    DEFAULT_HTTPS_PORT, KEY, VALUE, \
    INSTANCE_ID, HTTP_DOMAIN, GRPC_DOMAIN, REGION, LABEL, REGION_DESCRIPTION, ID, IS_PRIVATE_SPACEBRIDGE
from spacebridgeapp.util.test_state import get_test_state
from typing import Union
from enum import Enum
from cloudgateway.discovery import query_discovery_instances
from spacebridge_protocol.discovery_pb2 import SpacebridgeInstancesResponse
from spacebridgeapp.rest.services.config_service import load_config_from_kvstore
from cloudgateway.splunk.encryption import SplunkEncryptionContext
from cloudgateway.private.sodium_client.sharedlib_sodium_client import SodiumClient

JWT_MAX_TTL = 90

def parse_proxy_settings(proxy_url, default_port=DEFAULT_HTTP_PORT):
    """
    Helper to parse our proxy settings
    :param proxy_url:
    :param default_port:
    :return:
    """
    if proxy_url is None:
        return None

    # Strip https:// or http://
    url = proxy_url.replace('http://', '')
    url = url.replace('https://', '').strip()

    # Split by '@', indicates basic authentication
    if '@' in url:
        auth, proxy_host_port = url.split('@')
    else:
        auth, proxy_host_port = None, url

    # Split by ':'
    if ':' in proxy_host_port:
        host, port = proxy_host_port.split(':')
    else:
        host = proxy_host_port
        port = default_port

    if auth is not None:
        host = f'{auth}@{host}'
        auth = py23.b64encode_to_str(auth.encode('utf-8')).strip()
    else:
        auth = None

    # Fallback to default http port if a non-numeric port is passed in
    if not isinstance(port, int) and not port.isnumeric():
        port = DEFAULT_HTTP_PORT

    return {'host': host, 'port': int(port), 'auth': auth}


def get_ws_proxy_settings(proxy_url, default_port=DEFAULT_HTTP_PORT):
    """
    This is a helper method to break up a proxy_url into the components required for WebSocketClientFactory proxy setup

    The WebSocketClientFactory required params in the following formats:

    proxy = {'host': 'hostname', 'port': port}
    headers['Proxy-Authentication'] = 'Basic ' + basic_authentication

    :param proxy_url:
    :param default_port:
    :return: proxy dictionary and basic_authentication, None in both cases if not available
    """
    if proxy_url is None:
        return None, None

    # Initialize return variables
    proxy = None

    # Parse proxy url
    proxy_settings = parse_proxy_settings(proxy_url, default_port)

    if proxy_settings is None:
        return None, None

    auth = proxy_settings['auth']
    host = proxy_settings['host']
    port = proxy_settings['port']

    if host is not None and port is not None:
        proxy = {'host': host, 'port': port}

    return proxy, auth


def validate_jwt_expiration(jwt_expiration):
    """
    This is a helper method to ensure that the expiry date for a JWT is valid.
    The JWT expiry date must be a positive integer greater than 0 and less than or equal to JWT_MAX_TTL.

    :param: jwt_expiration
    :return: True if JWT expiration is valid
    """
    return type(jwt_expiration) == int and 0 < jwt_expiration <= JWT_MAX_TTL

def format_jwt_expiration(jwt_expiration: int):
    """
    This is a helper method to format the JWT expiry date.

    :param: jwt_expiration
    :return: validated and sanitized jwt_expiration date in the appropriate format ('+' + '[valid # days]' + 'd')
    """
    return '+' + str(jwt_expiration) + 'd'


def get_spacebridge_instance_info_json(session_token, config, spacebridge_server, sodium_client=SodiumClient()):
    """
    This method exclusively offers a public Spacebridge to retrieve instance information, not for the Private Spacebridge.
    """
    encryption_context = SplunkEncryptionContext(session_token, SPACEBRIDGE_APP_NAME, sodium_client)
    current_spacebridge_instance = get_spacebridge_instance_info(encryption_context, spacebridge_server, config)
    return build_spacebridge_server_payload(current_spacebridge_instance)


def get_spacebridge_instance_info(encryption_context, current_spacebridge_server, config):
    get_instances_response = query_discovery_instances(encryption_context, config=config)

    instances_response = SpacebridgeInstancesResponse()
    instances_response.ParseFromString(get_instances_response.instances)
    instances = instances_response.instances

    current_instance = None
    # A private spacebridge_server will result in an empty current_instance
    for instance in instances:
        if instance.httpDomain == current_spacebridge_server:
            current_instance = instance

    return current_instance


def build_spacebridge_server_payload(spacebridge_instance):
    return {
        INSTANCE_ID: spacebridge_instance.instanceId,
        HTTP_DOMAIN: spacebridge_instance.httpDomain,
        GRPC_DOMAIN: spacebridge_instance.grpcDomain,
        REGION: spacebridge_instance.region,
        LABEL: spacebridge_instance.regionLabel,
        REGION_DESCRIPTION: spacebridge_instance.regionDescription,
        ID: spacebridge_instance.id,
        KEY: SPACEBRIDGE_SERVER,
        VALUE: spacebridge_instance.httpDomain
    }


class ConfigCategory(Enum):
    """
    Enum with values mapping to legacy securegateway.conf stanzas
    """
    SETUP = 'setup'
    CLIENT = 'client'
    REGISTRATION = 'registration'
    DASHBOARD = 'dashboard'
    PROXY_CONFIG = 'proxyConfig'
class ConfigType(Enum):
    NUMBER = 'number'
    STRING = 'string'
    BOOLEAN = 'boolean'
    DROPDOWN = 'dropdown'
    URL = 'url'
    PROXY_URL = 'proxy_url'
    SPACEBRIDGE_URL = 'spacebridge_url'
class SecureGatewayConfig(object):
    """
    Class to encapsulate configuration settings for secure gateway configuration.
    """

    # US Spacebridge Defaults, used when Instance Config KVStore is empty
    DEFAULT_HTTP_DOMAIN = 'http.us-east-1.spacebridge.splunkcx.com'
    DEFAULT_GRPC_DOMAIN = 'grpc.us-east-1.spacebridge.splunkcx.com'
    DEFAULT_INSTANCE_ID = 'spacebridge-us-east-1'

    # KV Config
    DEFAULT_KV_ASYNC_TIMEOUT_SECS = 5
    UPDATE_TIMESTAMP_KEY = 'last_updated'

    @classmethod
    def update_timestamp_json(cls) -> dict:
        """
        Class method for generating config update json
        """
        return {KEY: cls.UPDATE_TIMESTAMP_KEY, VALUE: time.time()}

    class ConfigTemplate:
        class ConfigDefinition:
            KEY_LABEL = KEY
            CATEGORY_LABEL = 'category'
            TYPE_LABEL = 'type'
            EXPERT_ONLY_LABEL = 'expert_only'
            ALLOW_RESET_LABEL = 'allow_reset'
            DEFAULT_LABEL = 'default'

            def __init__(self, key: str, category: ConfigCategory, type: ConfigType, expert_only: bool, default=None, min=None, max=None, values=None, hidden=False, allow_reset=True):
                self.KEY = key
                self.CATEGORY = category
                self.TYPE = type
                self.EXPERT_ONLY = expert_only
                self.HIDDEN= hidden
                self.DEFAULT= default
                self.MIN = min
                self.MAX = max
                self.VALUES = values
                self.ALLOW_RESET = allow_reset

            def to_json(self):
                result = {
                    self.KEY_LABEL: self.KEY,
                    self.CATEGORY_LABEL: self.CATEGORY.value,
                    self.TYPE_LABEL: self.TYPE.value,
                    self.EXPERT_ONLY_LABEL: self.EXPERT_ONLY,
                    self.ALLOW_RESET_LABEL: self.ALLOW_RESET,
                    self.DEFAULT_LABEL: self.DEFAULT
                }

                if self.MIN is not None:
                    result['min'] = self.MIN

                if self.MAX is not None:
                    result['max'] = self.MAX

                if self.VALUES is not None:
                    result['values'] = self.VALUES

                return result


        SPACEBRIDGE_SERVER =            ConfigDefinition(SPACEBRIDGE_SERVER,                ConfigCategory.SETUP,   ConfigType.SPACEBRIDGE_URL, expert_only=False, default="http.us-east-1.spacebridge.splunkcx.com", allow_reset=False)
        SPACEBRIDGE_DISCOVERY_SERVER =  ConfigDefinition("spacebridge_discovery_server",    ConfigCategory.SETUP,   ConfigType.SPACEBRIDGE_URL, expert_only=True, default="http.us-east-1.spacebridge.splunkcx.com", hidden=True)
        LOG_LEVEL =                     ConfigDefinition('log_level',                       ConfigCategory.SETUP,   ConfigType.DROPDOWN,        expert_only=False, default="INFO", values=['CRITICAL','ERROR','WARNING','INFO','DEBUG'])
        MTLS =                          ConfigDefinition('mtls',                            ConfigCategory.SETUP,   ConfigType.BOOLEAN,         expert_only=True, default=False, hidden=True)
        JWT_EXPIRATION =                ConfigDefinition('jwt_expiration',                  ConfigCategory.SETUP,   ConfigType.NUMBER,          expert_only=True, default=30, min=1, max=JWT_MAX_TTL)
        JWT_EH_EXPIRATION =             ConfigDefinition('jwt_eh_expiration',               ConfigCategory.SETUP,   ConfigType.NUMBER,          expert_only=True, default=30, min=1, max=JWT_MAX_TTL)
        ASYNC_TIMEOUT =                 ConfigDefinition('async_timeout',                   ConfigCategory.SETUP,   ConfigType.NUMBER,          expert_only=True, default=15, min=1, hidden=True)
        ASYNC_SEMAPHORE =               ConfigDefinition('async_semaphore',                 ConfigCategory.SETUP,   ConfigType.NUMBER,          expert_only=True, default=5, min=1, max=10, hidden=True)

        # The load balancer address should have the following format: <proxy>://<host>:<port>/
        LOAD_BALANCER_ADDRESS =         ConfigDefinition('load_balancer_address',           ConfigCategory.SETUP,   ConfigType.URL,             expert_only=True, hidden=True) #Deprecate
        OIA =                           ConfigDefinition('oia',                             ConfigCategory.SETUP,   ConfigType.BOOLEAN,         expert_only=True, default=False, hidden=True)
        REQUEST_TIMEOUT_SECS =          ConfigDefinition('request_timeout_secs',            ConfigCategory.CLIENT,  ConfigType.NUMBER,          expert_only=True, default=30, min=1)
        DASHBOARD_LIST_MAX_COUNT =      ConfigDefinition('dashboard_list_max_count',        ConfigCategory.DASHBOARD, ConfigType.NUMBER,        expert_only=True, default=0, min=0)
        REGISTRATION_WEBHOOK_URL =      ConfigDefinition('registration_webhook_url',        ConfigCategory.REGISTRATION, ConfigType.URL,        expert_only=True, hidden=True)  #Deprecate
        WEBHOOK_VERIFY_SSL =            ConfigDefinition('webhook_verify_ssl',              ConfigCategory.REGISTRATION, ConfigType.BOOLEAN,    expert_only=True, default=True, hidden=True)  #Deprecate
        DEEP_LINK_REG_TIMEOUT =         ConfigDefinition('deep_link_registration_timeout_secs', ConfigCategory.REGISTRATION, ConfigType.NUMBER, expert_only=True, default=300, min=1)
        HTTP_PROXY =                    ConfigDefinition('http_proxy',                      ConfigCategory.PROXY_CONFIG, ConfigType.PROXY_URL,   expert_only=True)
        HTTPS_PROXY =                   ConfigDefinition('https_proxy',                     ConfigCategory.PROXY_CONFIG, ConfigType.PROXY_URL,   expert_only=True)

        ALL_CONFIGS = [SPACEBRIDGE_SERVER, SPACEBRIDGE_DISCOVERY_SERVER, LOG_LEVEL, MTLS, JWT_EXPIRATION, JWT_EH_EXPIRATION, ASYNC_TIMEOUT, ASYNC_SEMAPHORE,
                        LOAD_BALANCER_ADDRESS, OIA, REQUEST_TIMEOUT_SECS, DASHBOARD_LIST_MAX_COUNT, REGISTRATION_WEBHOOK_URL,
                        WEBHOOK_VERIFY_SSL, DEEP_LINK_REG_TIMEOUT, HTTP_PROXY, HTTPS_PROXY]

    TEMPLATE = ConfigTemplate

    def __init__(self, config_json, session_key=None):
        self.config_json = config_json
        self.session_key = session_key
        self.kv_instance_config = self._parse_kv_instance_config(config_json)
        self._assign_attributes()
        self._validate_jwt_expiration()
        self._update_proxy_config()

    def _parse_kv_instance_config(self, response_string):
        kv_config_list = json.loads(response_string)
        kv_config_map = {}
        for config in kv_config_list:
            if KEY in config:
                kv_config_map[config[KEY]] = config
        return kv_config_map

    def _assign_attributes(self):
        self.spacebridge_server = self._get_value_or_default(self.kv_instance_config, self.ConfigTemplate.SPACEBRIDGE_SERVER, override_default=None)
        # Spacebridge server fallback scenario (not migrated)
        if self.spacebridge_server is None:
            self.spacebridge_server = self._get_value_or_default(self.kv_instance_config, self.ConfigTemplate.SPACEBRIDGE_SERVER, override_default=None, kv_value_field='http_domain')
        self.spacebridge_domain = 'https://' + self.spacebridge_server if self.spacebridge_server is not None else None
        self.is_private_spacebridge = self._get_value_or_default(self.kv_instance_config,
                                                                 self.ConfigTemplate.SPACEBRIDGE_SERVER,
                                                                 override_default=False,
                                                                 kv_value_field=IS_PRIVATE_SPACEBRIDGE)

        self.spacebridge_discovery_server = self._get_value_or_default(self.kv_instance_config,self.ConfigTemplate.SPACEBRIDGE_DISCOVERY_SERVER)
        self.log_level = self._get_value_or_default(self.kv_instance_config,self.ConfigTemplate.LOG_LEVEL)
        self.mtls_enabled = self._get_value_or_default(self.kv_instance_config,self.ConfigTemplate.MTLS)
        self.jwt_expiration = self._get_value_or_default(self.kv_instance_config,self.ConfigTemplate.JWT_EXPIRATION)
        self.jwt_eh_expiration = self._get_value_or_default(self.kv_instance_config,self.ConfigTemplate.JWT_EH_EXPIRATION)
        self.async_timeout = self._get_value_or_default(self.kv_instance_config,self.ConfigTemplate.ASYNC_TIMEOUT)
        self.async_semaphore = self._get_value_or_default(self.kv_instance_config,self.ConfigTemplate.ASYNC_SEMAPHORE)
        self.kv_async_timeout = self._get_value_or_default(self.kv_instance_config,self.ConfigTemplate.ASYNC_TIMEOUT, override_default=self.DEFAULT_KV_ASYNC_TIMEOUT_SECS)
        self.load_balancer_address = self._get_value_or_default(self.kv_instance_config,self.ConfigTemplate.LOAD_BALANCER_ADDRESS)
        self.oia = self._get_value_or_default(self.kv_instance_config,self.ConfigTemplate.OIA)
        self.request_timeout_secs = self._get_value_or_default(self.kv_instance_config,self.ConfigTemplate.REQUEST_TIMEOUT_SECS)
        self.dashboard_list_max_count = self._get_value_or_default(self.kv_instance_config,self.ConfigTemplate.DASHBOARD_LIST_MAX_COUNT)
        self.registration_webhook_url = self._get_value_or_default(self.kv_instance_config,self.ConfigTemplate.REGISTRATION_WEBHOOK_URL)
        self.webhook_verify_ssl = self._get_value_or_default(self.kv_instance_config,self.ConfigTemplate.WEBHOOK_VERIFY_SSL)
        self.deep_link_reg_timeout = self._get_value_or_default(self.kv_instance_config,self.ConfigTemplate.DEEP_LINK_REG_TIMEOUT)
        self.http_proxy = self._get_value_or_default(self.kv_instance_config,self.ConfigTemplate.HTTP_PROXY)
        self.https_proxy = self._get_value_or_default(self.kv_instance_config,self.ConfigTemplate.HTTPS_PROXY)

        timestamp_dict = self.kv_instance_config.get(self.UPDATE_TIMESTAMP_KEY)
        self.last_updated = timestamp_dict.get(VALUE) if isinstance(timestamp_dict, dict) else None

    def _get_value_or_default(self, instance_config, config_defn: ConfigTemplate.ConfigDefinition, override_default=None, kv_value_field='value'):
        default = config_defn.DEFAULT if override_default is None else override_default
        config_dictionary = instance_config.get(config_defn.KEY)
        if config_dictionary is None:
            return default
        else:
            return config_dictionary.get(kv_value_field, default)

    def _validate_jwt_expiration(self):
        if not validate_jwt_expiration(self.jwt_expiration):
            self.jwt_expiration = self.ConfigTemplate.JWT_EXPIRATION.DEFAULT

        if not validate_jwt_expiration(self.jwt_eh_expiration):
            self.jwt_eh_expiration = self.ConfigTemplate.JWT_EH_EXPIRATION.DEFAULT

    def _update_proxy_config(self):
        # Initialize Proxies Dict
        self.proxies = {}

        # Sanitize proxies before using it
        self.http_proxy = self._sanitize_proxy_string(self.http_proxy)
        self.https_proxy = self._sanitize_proxy_string(self.https_proxy)

        if self.http_proxy:
            self.proxies['http'] = self.http_proxy

        if self.https_proxy:
            self.proxies['https'] = self.https_proxy

        # Initialize HTTPS Proxy Settings
        self.https_proxy_settings = parse_proxy_settings(self.https_proxy, DEFAULT_HTTPS_PORT)

        # Initialize WebSocket HTTPS Proxy Settings
        if self.https_proxy is None or self.https_proxy_settings is None:
            self.ws_https_proxy_settings = None, None
        else:
            proxy = None
            auth = self.https_proxy_settings['auth']
            host = self.https_proxy_settings['host']
            port = self.https_proxy_settings['port']

            if host is not None and port is not None:
                proxy = {'host': host, 'port': port}

            self.ws_https_proxy_settings = proxy, auth

    def _sanitize_proxy_string(self, proxy_string):
        if not isinstance(proxy_string, str):
            return None

        if len(proxy_string.strip()) <= 0:
            return None

        return proxy_string

    def to_json(self, show_hidden=False):
        config_list = []
        for config_defn in self.TEMPLATE.ALL_CONFIGS:
            if config_defn.HIDDEN and not show_hidden:
                continue
            config_json = config_defn.to_json()
            kv_json = self.kv_instance_config.get(config_defn.KEY) or {}
            kv_json[VALUE] = self._get_value_or_default(self.kv_instance_config, config_defn)
            config_list.append({**config_json, **kv_json})

        #Append timestamp if show_hidden is true
        if show_hidden and self.last_updated is not None:
            config_list.append({KEY: self.UPDATE_TIMESTAMP_KEY, VALUE: self.last_updated})

        return config_list

    def get_oia(self):
        return self.oia

    def get_log_level(self):
        return self.log_level

    def get_dashboard_list_max_count(self):
        return self.dashboard_list_max_count

    def get_load_balancer_address(self):
        return self.load_balancer_address

    def get_async_timeout_secs(self):
        """
        Helper to get async timeout set by in config file
        :return:
        """
        return self.async_timeout

    def get_async_semaphore(self):
        """
        Helper to get async semaphore set by in config file
        :return:
        """
        return self.async_semaphore

    def get_kv_async_timeout_secs(self):
        """
        Helper to get kv async timeout set by in config file
        :return:
        """
        return self.kv_async_timeout

    def get_request_timeout_secs(self):
        """
        Helper to get client request_timeout_secs
        :return:
        """
        return self.request_timeout_secs

    def get_registration_webhook_url(self):
        """
        Helper get registration webhook url from config, return None if not found
        """

        return self.registration_webhook_url

    def get_webhook_verify_ssl(self):
        """
        Helper get registration webhook url from config, return None if not found
        """
        return self.webhook_verify_ssl

    def get_mtls_enabled(self):
        return self.mtls_enabled

    def get_spacebridge_server(self):
        return self.spacebridge_server

    def is_spacebridge_server_v1_compatible(self) -> bool:
        # Only NA / Default spacebridge server is V1 compatible
        return self.spacebridge_server == self.TEMPLATE.SPACEBRIDGE_SERVER.DEFAULT

    def get_spacebridge_discovery_server(self):
        return self.spacebridge_discovery_server

    def get_spacebridge_domain(self):
        return self.spacebridge_domain

    def get_deep_link_reg_timeout(self):
        return self.deep_link_reg_timeout

    def get_https_proxy(self):
        return self.https_proxy

    def get_proxies(self):
        return self.proxies

    def get_formatted_jwt_expiration(self):
        return format_jwt_expiration(self.jwt_expiration)

    def get_formatted_jwt_eh_expiration(self):
        return format_jwt_expiration(self.jwt_eh_expiration)

    def get_ws_https_proxy_settings(self):
        """
        Helper to get https proxy settings for WebSocket config usage
        :return:
        """
        return self.ws_https_proxy_settings

    def get_https_proxy_settings(self):
        """
        Helper to get https proxy settings for twisted config usage
        :return:
        """
        return self.https_proxy_settings

    def get_last_updated(self):
        """
        Helper to get last updated timestamp
        :return:
        """
        return self.last_updated

    def ensure_spacebridge_server(self):

        if not self.spacebridge_server:
            raise ValueError("Missing Spacebridge server when building SecureGatewayConfig")

    def sleep_and_terminate_process(self, sleep_interval):
        """
        Used for emergency situations where the securegateway.conf file cannot parse values
        and our app is in an unstable state, we don't want the process to keep running, so sleep and terminate
        """

        # Sleep before erroring out so we don't spam logs, if we ever reach here there's an issue with the conf file
        print("splunk_secure_gateway has failed to load securegateway.conf, modular input will now sleep before terminating", file=sys.stderr)
        time.sleep(sleep_interval)
        sys.exit("Exiting because config cannot be read.")

    def clone(self):
        return SecureGatewayConfig(self.config_json, self.session_key)


    def _get_new_timestamp(self):
        return _load_config(self.session_key).get_last_updated()

    """
    Checks if new config is available
    """
    def has_changed(self) -> bool:
        current_timestamp = self.get_last_updated()
        refreshed_timestamp = self._get_new_timestamp()
        return (current_timestamp is None and refreshed_timestamp is not None ) or \
            (current_timestamp is not None and refreshed_timestamp is not None and refreshed_timestamp > current_timestamp)

    def get_is_private_spacebridge(self) -> bool:
        return self.is_private_spacebridge


class LegacySecureGatewayConfig(object):
    """
    Class to encapsulate configuration settings from securegateway.conf for migration purposes.
    """

    CONF_FILENAME = 'securegateway'

    def __init__(self):
        # In unit testing scenario we don't want to use btool
        config = self._read_config(SPACEBRIDGE_APP_NAME, self.CONF_FILENAME)

        # Initialize top level config values
        setup = config.get(ConfigCategory.SETUP.value, {})
        client = config.get(ConfigCategory.CLIENT.value, {})
        registration = config.get(ConfigCategory.REGISTRATION.value, {})
        dashboard = config.get(ConfigCategory.DASHBOARD.value, {})

        # Initialize SETUP config values
        self.async_timeout = self._get_config_as_int(setup.get(SecureGatewayConfig.TEMPLATE.ASYNC_TIMEOUT.KEY))
        self.async_semaphore = self._get_config_as_int(setup.get(SecureGatewayConfig.TEMPLATE.ASYNC_SEMAPHORE.KEY))
        self.mtls_enabled = self._get_config_as_bool(setup.get(SecureGatewayConfig.TEMPLATE.MTLS.KEY))
        self.spacebridge_discovery_server = setup.get(SecureGatewayConfig.TEMPLATE.SPACEBRIDGE_DISCOVERY_SERVER.KEY)
        self.log_level = setup.get(SecureGatewayConfig.TEMPLATE.LOG_LEVEL.KEY)
        self.load_balancer_address = setup.get(SecureGatewayConfig.TEMPLATE.LOAD_BALANCER_ADDRESS.KEY)
        self.oia = self._get_config_as_bool(setup.get(SecureGatewayConfig.TEMPLATE.OIA.KEY))
        self.jwt_expiration = self._get_config_as_int(setup.get(SecureGatewayConfig.TEMPLATE.JWT_EXPIRATION.KEY))
        self.request_timeout_secs = self._get_config_as_int(client.get(SecureGatewayConfig.TEMPLATE.REQUEST_TIMEOUT_SECS.KEY))

        # Initialize REGISTRATION config values
        self.registration_webhook_url = registration.get(SecureGatewayConfig.TEMPLATE.REGISTRATION_WEBHOOK_URL.KEY)
        self.webhook_verify_ssl = self._get_config_as_bool(registration.get(SecureGatewayConfig.TEMPLATE.WEBHOOK_VERIFY_SSL.KEY))

        # Initialize DASHBOARD config values
        self.dashboard_list_max_count =self._get_config_as_int(dashboard.get(SecureGatewayConfig.TEMPLATE.DASHBOARD_LIST_MAX_COUNT.KEY))

        # //---  Proxy initialization logic ---//

        # Initialize proxy config
        proxy_cfg = config.get(ConfigCategory.PROXY_CONFIG.value, None)

        # Initialize HTTP and HTTPS proxy values
        try:
            if not proxy_cfg:
                proxy_cfg = cli.getConfStanza('server', ConfigCategory.PROXY_CONFIG.value)
        except Exception:
            proxy_cfg = None

        try:
            self.https_proxy = proxy_cfg.get(SecureGatewayConfig.TEMPLATE.HTTPS_PROXY.KEY)
        except Exception:
            self.https_proxy = None

        try:
            self.http_proxy = proxy_cfg.get(SecureGatewayConfig.TEMPLATE.HTTP_PROXY.KEY)
        except Exception:
            self.http_proxy = None

    def _read_config(self, appname, conf_filename):
        if get_test_state():
            app_path = os.path.join(get_base_path(), appname)
            config = cli.getAppConf(conf_filename, appname, use_btool=False, app_path=app_path)
        else:
            config = cli.getMergedConf(conf_filename)

        return config

    def _get_config_as_int(self, value: str) -> Union[int, None]:
        """
        Helper to convert config to int.

        Unfortunately this exists because the config is provided as a string, therefore we must validate
        the value to contain digits before defaulting or casting. It is unsafe to just initialize the field
        as the default parameter in the case if we expect an int, but are given a garbage string.

        :return:
        """
        return int(value) if (isinstance(value,str) and value.isdigit()) else None

    def _get_config_as_bool(self, value: str) -> Union[bool, None]:
        """
        Helper to convert config to bool.
        :return:
        """
        return value.lower() == 'true' if isinstance(value,str) else None

    def _append_kv_pair(self, list, key, value):
        if value is None:
            return
        list.append({KEY: key, VALUE: value})

    def get_kv_json(self):
        result = []
        self._append_kv_pair(result, SecureGatewayConfig.TEMPLATE.ASYNC_TIMEOUT.KEY, self.async_timeout)
        self._append_kv_pair(result, SecureGatewayConfig.TEMPLATE.ASYNC_SEMAPHORE.KEY, self.async_semaphore)
        self._append_kv_pair(result, SecureGatewayConfig.TEMPLATE.MTLS.KEY, self.mtls_enabled)
        self._append_kv_pair(result, SecureGatewayConfig.TEMPLATE.SPACEBRIDGE_DISCOVERY_SERVER.KEY, self.spacebridge_discovery_server)
        self._append_kv_pair(result, SecureGatewayConfig.TEMPLATE.LOG_LEVEL.KEY, self.log_level)
        self._append_kv_pair(result, SecureGatewayConfig.TEMPLATE.LOAD_BALANCER_ADDRESS.KEY, self.load_balancer_address)
        self._append_kv_pair(result, SecureGatewayConfig.TEMPLATE.OIA.KEY, self.oia)
        self._append_kv_pair(result, SecureGatewayConfig.TEMPLATE.JWT_EXPIRATION.KEY, self.jwt_expiration)
        self._append_kv_pair(result, SecureGatewayConfig.TEMPLATE.REQUEST_TIMEOUT_SECS.KEY, self.request_timeout_secs)
        self._append_kv_pair(result, SecureGatewayConfig.TEMPLATE.REGISTRATION_WEBHOOK_URL.KEY, self.registration_webhook_url)
        self._append_kv_pair(result, SecureGatewayConfig.TEMPLATE.WEBHOOK_VERIFY_SSL.KEY, self.webhook_verify_ssl)
        self._append_kv_pair(result, SecureGatewayConfig.TEMPLATE.DASHBOARD_LIST_MAX_COUNT.KEY, self.dashboard_list_max_count)
        self._append_kv_pair(result, SecureGatewayConfig.TEMPLATE.HTTPS_PROXY.KEY, self.https_proxy)
        self._append_kv_pair(result, SecureGatewayConfig.TEMPLATE.HTTP_PROXY.KEY, self.http_proxy)
        self._append_kv_pair(result, SecureGatewayConfig.UPDATE_TIMESTAMP_KEY, time.time())
        return result

loaded_config = None
def load_config(session_key, force_refresh=False) -> SecureGatewayConfig:
    """
    Load configuration from KVStore.

    :param session_key: Required session key for authentication
    :param force_refresh: If True, reload config from KVStore even if cached
    :return: Cloned SecureGatewayConfig instance
    :raises ValueError: If session_key is None or empty
    """
    global loaded_config
    if loaded_config is None or force_refresh:
        loaded_config = _load_config(session_key)
    return loaded_config.clone()

def _load_config(session_key) -> SecureGatewayConfig:
    """
    Load configuration from KVStore using the provided session key.

    :param session_key: Required session key for authentication
    :return: SecureGatewayConfig instance
    :raises ValueError: If session_key is None or empty
    """
    if not session_key:
        raise ValueError("session_key is required to load configuration")
    return SecureGatewayConfig(load_config_from_kvstore(session_key), session_key=session_key)
