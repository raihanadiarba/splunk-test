"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.
"""

import json
import urllib.parse
from typing import Dict, Any
import logging
import splunk
import splunk.rest as rest
from spacebridgeapp.util import constants
from spacebridgeapp.rest.services.kvstore_service import KVStoreCollectionAccessObject as KvStore
from http import HTTPStatus
from spacebridgeapp.rest.util.errors import SsgHttpError


def _quote_path_segment(value: str) -> str:
    return urllib.parse.quote(value, safe="")


def authenticate_splunk_credentials(username, password):
    """
    Checks whether a supplied username/password pair are valid Splunk credentials. Throws an error otherwise.

    :param username: User-supplied username
    :param password: User-supplied password
    :return: None
    """
    request_url = '%s/services/auth/login' % rest.makeSplunkdUri()
    body = {
        'username': username,
        'password': password
    }
    response, _ = rest.simpleRequest(request_url, postargs=body, raiseAllErrors=False)

    return response


def user_is_administrator(authtoken):
    """
    Checks if the given user is a Splunk admin. This is necessary for satisfying some of the UI
    feature requirements.

    :param authtoken: Token to allow checking of user permissions
    :return: Boolean
    """

    return constants.ADMIN_ALL_OBJECTS in get_current_context(authtoken)[constants.CAPABILITIES]


def user_is_splunk_mobile_administrator(authtoken):
    """
    Checks if the given user has the splunk mobile administrator capability
    """

    return constants.SPLUNK_MOBILE_ADMINISTRATION in get_current_context(authtoken)[constants.CAPABILITIES]


def get_all_users(authtoken):
    """
    Returns a list of all Splunk users viewable using the permissions of the supplied authtoken

    :param authtoken: Authorization token
    :return: List of users
    """

    request_url = '%s/services/authentication/users' % rest.makeSplunkdUri()
    query_args = {
        'count': 0,
        'output_mode': 'json',
    }
    _, content = rest.simpleRequest(
        request_url,
        sessionKey=authtoken,
        method='GET',
        getargs=query_args,
        raiseAllErrors=True
    )
    # Parse just the list of usernames from the response
    return [x['name'] for x in json.loads(content)['entry']]


def get_app_list_request(authtoken, app_name="", params=None):
    """
    Returns a list of all splunk apps viewable using the permissions of the supplied authtoken

    :param authtoken: Authorization token
    :return: List of Splunk apps
    """

    request_url = '{}services/apps/local/{}'.format(rest.makeSplunkdUri(), app_name)
    params = params if params is not None else {'output_mode': 'json'}
    response, content = rest.simpleRequest(
        request_url,
        sessionKey=authtoken,
        method='GET',
        getargs=params,
        raiseAllErrors=True
    )

    if response.status != HTTPStatus.OK:
        return None

    return json.loads(content)


def get_all_mobile_users(authtoken):
    """
    Returns a list of all Splunk users with registered mobile devices

    :param authtoken: Authorization token
    :return: List of users
    """
    kvstore = KvStore(constants.REGISTERED_USERS_COLLECTION_NAME, authtoken)
    _, content = kvstore.get_collection_keys()
    registered_user_records = json.loads(content)
    return [registered_user_record[u'_key'] for registered_user_record in registered_user_records]


def get_devices_for_user(log: logging.Logger, user, authtoken):
    """
    Gets devices belonging to a user from the kvstore
    :param user: Username to retrieve devices for
    :param authtoken: Authorization token to supply to the kvstore interface
    :return: List of devices
    """
    kvstore = KvStore(constants.REGISTERED_DEVICES_COLLECTION_NAME, authtoken, owner=user)
    _, devices_record = kvstore.get_items_by_query(query={}, sort="device_name")
    log.debug("user={}, devices={}".format(user, devices_record))
    return json.loads(devices_record)


def get_devices_metadata(log: logging.Logger, authtoken):
    """
    Gets all devices metadata from kvstore
    :param authtoken: Authorization token to supply to the kvstore interface
    :return: List of device metadata
    """
    kvstore = KvStore(constants.REGISTERED_DEVICES_META_COLLECTION_NAME, authtoken)
    _, devices_meta = kvstore.get_all_items()
    log.debug("devices_meta=%s", devices_meta)
    return json.loads(devices_meta)


def user_has_registered_devices(log: logging.Logger, user, authtoken):
    """
    Returns true if a user has at least one registered device
    :param user: Username to check
    :param authtoken: Authorization token to supply to the kvstore interface
    :return: Boolean result
    """
    return len(get_devices_for_user(log, user, authtoken)) > 0


def get_splunk_auth_type(log: logging.Logger, authtoken):
    """
    Returns authentication type for Splunk instance (Splunk, LDAP, or SAML)
    :return: String
    """
    log.debug("Getting Splunk authentication type")
    query_args = {
        'output_mode': 'json',
    }
    request_url = "{}services/properties/authentication/authentication/authType".format(rest.makeSplunkdUri())
    _, content = rest.simpleRequest(
        request_url,
        sessionKey=authtoken,
        method='GET',
        getargs=query_args,
        raiseAllErrors=True
    )
    return content


def get_all_secure_gateway_tokens(log: logging.Logger, authtoken):
    """
    Returns all Splunk tokens
    :return: String
    """
    log.debug("Getting Splunk tokens")
    query_args = {
        'output_mode': 'json',
        'sort_key': 'claims.exp',
        'sort_dir': 'asc',
        'search': f"claims.aud={constants.CLOUDGATEWAY}",
        'count': 0
    }
    request_url = "{}services/authorization/tokens".format(rest.makeSplunkdUri())
    _, content = rest.simpleRequest(
        request_url,
        sessionKey=authtoken,
        method='GET',
        getargs=query_args,
        raiseAllErrors=True
    )

    all_tokens = json.loads(content)['entry']
    cloudgateway_tokens = [token for token in all_tokens if token['content']['claims']['aud'] == constants.CLOUDGATEWAY
                           and token['content']['claims']['exp'] != 0]
    return cloudgateway_tokens


def delete_token_by_id(log: logging.Logger, authtoken, user, id):
    """
    Deletes token for given id
    """
    log.debug("Deleting token for id={}".format(id))
    delete_args = {
        'id': id
    }
    request_url = "{}services/authorization/tokens/{}".format(rest.makeSplunkdUri(), user)
    response, _ = rest.simpleRequest(
        request_url,
        sessionKey=authtoken,
        method='DELETE',
        getargs=delete_args,
        raiseAllErrors=True
    )

    return response


def authenticate_saml(log: logging.Logger, authtoken):
    """
    Gets SAML authentication
    :param authtoken:
    :return:
    """
    log.debug("Getting SAML authentication")
    params = {constants.OUTPUT_MODE: constants.JSON}
    request_url = "{}/services/authentication/providers/SAML".format(rest.makeSplunkdUri())
    response, content = rest.simpleRequest(
        request_url,
        sessionKey=authtoken,
        method='GET',
        getargs=params,
        raiseAllErrors=True
    )

    if response.status != HTTPStatus.OK:
        return None

    return json.loads(content)


def create_sensitive_data(log: logging.Logger, session_key, key, data):
    """
    :param session_key: A raw system auth token
    :param key: the string key to fetch the sensitive data for
    :param data: String data representing the secret
    :return:
    """
    log.debug("Updating sensitive data, key={}".format(key))
    base_uri = rest.makeSplunkdUri()
    uri = '{}servicesNS/nobody/{}/storage/passwords'.format(base_uri, constants.SPACEBRIDGE_APP_NAME)

    form_data = {
        constants.NAME: key,
        constants.PASSWORD: data
    }

    return _mutate_sensitive_data(session_key, uri, form_data)


def update_sensitive_data(log: logging.Logger, session_key, key, data):
    """
    :param session_key: A raw system auth token
    :param key: the string key to fetch the sensitive data for
    :param data: String data representing the secret
    :return:
    """
    log.debug("Updating sensitive data, key={}".format(key))
    base_uri = rest.makeSplunkdUri()
    uri = '{}servicesNS/nobody/{}/storage/passwords/{}'.format(base_uri, constants.SPACEBRIDGE_APP_NAME, key)

    form_data = {
        constants.PASSWORD: data
    }

    return _mutate_sensitive_data(session_key, uri, form_data)


def update_or_create_sensitive_data(log: logging.Logger, session_key, key, data):
    """
    Method that tries to update, and if that fails, tries to create
    an entry in storage/passwords.
    Function inspiration from:
    https://docs.djangoproject.com/en/2.2/ref/models/querysets/#update-or-create
    :param session_key: A raw system auth token
    :param key: the string key to fetch the sensitive data for
    :param data: String data representing the secret
    :return [response, created]: Response + true if data created else false
    """
    try:
        return [update_sensitive_data(log, session_key, key, data), False]
    except splunk.ResourceNotFound:
        return [create_sensitive_data(log, session_key, key, data), True]


def _mutate_sensitive_data(session_key, uri, form_data):
    """
    :param session_key: A raw system auth token
    :param uri: The uri to act on
    :param form_data: a dict containing the key 'password' and optionally 'name' if you are creating
    :return:
    """
    params = {
        'output_mode': 'json'
    }

    rest.simpleRequest(
        uri,
        sessionKey=session_key,
        getargs=params,
        postargs=form_data,
        method='POST',
        raiseAllErrors=True
    )


def fetch_sensitive_data(log: logging.Logger, session_key, key, app=constants.SPACEBRIDGE_APP_NAME):
    """
    :param log:
    :param session_key: A raw system auth token
    :param key: the string key to fetch the sensitive data for
    :return: string representation of the secret
    """
    log.debug("retrieving sensitive data, key={}".format(key))
    base_uri = rest.makeSplunkdUri()
    uri = '{}servicesNS/nobody/{}/storage/passwords/{}'.format(base_uri, app, key)

    params = {
        'output_mode': 'json'
    }

    _, content = rest.simpleRequest(
        uri,
        sessionKey=session_key,
        getargs=params,
        method='GET',
        raiseAllErrors=True
    )

    parsed = json.loads(content)
    clear_password = parsed['entry'][0]['content']['clear_password']
    return clear_password


def restart_all_modular_inputs(log: logging.Logger, authtoken, excluded_from_restart=None):
    if excluded_from_restart is None:
        excluded_from_restart = [constants.SSG_ENABLE_MODULAR_INPUT]

    inputs = get_ssg_mod_inputs(authtoken, excluded_from_restart)
    log.info("Restarting modular_inputs=%s", inputs)
    responses = {}

    for input in inputs:
        r = toggle_ssg_mod_input(log, input, authtoken)
        responses[input] = r.status

    log.info("Completed restart of inputs with responses=%s", responses)

    return responses


# Config methods follow the implementaion from these docs
# https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTconf#properties.2F.7Bfile.7D.2F.7Bstanza.7D.2F.7Bkey.7D

def get_config_property(log: logging.Logger, config_property_path, session_key):
    uri = f"{rest.makeSplunkdUri()}services/properties/{config_property_path}"
    try:
        r, content = rest.simpleRequest(uri,
                                        sessionKey=session_key,
                                        method='GET',
                                        raiseAllErrors=True)

        return content.decode("utf-8")
    except Exception as e:
        log.warning("Exception fetching config_property=%s with error=%s" % (config_property_path, str(e)))
        return None


def update_config_property(log: logging.Logger, config_property_path, value, session_key):
    data = {constants.VALUE: value}
    uri = f"{rest.makeSplunkdUri()}servicesNS/nobody/{constants.SPACEBRIDGE_APP_NAME}/properties/{config_property_path}"

    rest.simpleRequest(uri,
                       sessionKey=session_key,
                       postargs=data,
                       method='POST',
                       raiseAllErrors=True)

    log.info("Updated config value %s = %s" % (config_property_path, value))


def get_deployment_info(log: logging.Logger, session_key, default_value=""):
    base_uri = rest.makeSplunkdUri()
    uri = '{}services/ssg/kvstore/deployment_info'.format(base_uri)

    try:
        r, content = rest.simpleRequest(
            uri,
            sessionKey=session_key,
            method='GET',
            raiseAllErrors=False
        )

        parsed = json.loads(content)
        return parsed

    except Exception as e:
        log.exception("Exception fetching ssg meta info")
        return default_value


def _get_inputs_uri():
    base_uri = rest.makeSplunkdUri()
    return f"{base_uri}/servicesNS/nobody/splunk_secure_gateway/data/inputs"


def get_ssg_mod_inputs(session_key, excluded=None):
    """
     Get list of SSG modular inputs
    :param session_key:
    :param excluded: Add any modular_inputs you want to exclude from list
    :return: list of SSG modular_input_names
    """
    if excluded is None:
        excluded = []

    uri = _get_inputs_uri() + '?output_mode=json'

    r, content = rest.simpleRequest(
        uri,
        sessionKey=session_key,
        method='GET',
        raiseAllErrors=False
    )

    parsed = json.loads(content)
    return [entry['name'] for entry in parsed['entry']
            if (entry['name'].startswith('ssg') or entry['name'].startswith('secure_gateway'))
            and entry['name'] not in excluded]


def _get_mod_input_uri(modular_input_name):
    inputs_uri = _get_inputs_uri()
    return inputs_uri + f'/{modular_input_name}/default/'


def toggle_ssg_mod_input(log: logging.Logger, modular_input_name, session_key):
    """
    Toggle SSG modular_input by name
    :param modular_input_name:
    :param session_key:
    :return:
    """
    log.info("Restarting input={}".format(modular_input_name))
    disable_resp, disable_resp_content = disable_ssg_mod_input(modular_input_name, session_key)
    enable_resp, enable_resp_content = enable_ssg_mod_input(modular_input_name, session_key)
    return enable_resp


def enable_ssg_mod_input(modular_input_name, session_key):
    """
    Action on SSG modular_input_name
    :param modular_input_name:
    :param session_key:
    :return:
    """
    uri = _get_mod_input_uri(modular_input_name)
    action_uri = uri + 'enable'
    resp, resp_content = rest.simpleRequest(
        action_uri,
        sessionKey=session_key,
        method='POST',
        raiseAllErrors=False
    )
    return resp, resp_content


def is_ssg_mod_input_enabled(modular_input_name, session_key):
    """
    Return if the provided modular input is enabled
    :param modular_input_name: the modular input to check
    :param session_key: auth to make the request
    :return: True if enabled, False otherwise
    """
    uri = _get_mod_input_uri(modular_input_name) + '?output_mode=json'
    resp, resp_content = rest.simpleRequest(
        uri,
        sessionKey=session_key,
        method='GET',
        raiseAllErrors=False
    )
    parsed = json.loads(resp_content)
    return not parsed['entry'][0]['content']['disabled']


def disable_ssg_mod_input(modular_input_name, session_key):
    """
    Action on SSG modular_input_name
    :param modular_input_name:
    :param session_key:
    :return:
    """
    uri = _get_mod_input_uri(modular_input_name)
    action_uri = uri + 'disable'
    resp, resp_content = rest.simpleRequest(
        action_uri,
        sessionKey=session_key,
        method='POST',
        raiseAllErrors=False
    )
    return resp, resp_content


def get_server_info(session_key)->Dict[str, Any]:
    """
    Return server info
    https://help.splunk.com/en/splunk-enterprise/leverage-rest-apis/rest-api-reference/10.0/system-endpoints/system-endpoint-descriptions
    :param session_key: auth token
    :return: server info dict
    """
    request_url = f'{rest.makeSplunkdUri()}/services/server/info'
    query_args = {
        'output_mode': 'json',
    }
    _, content = rest.simpleRequest(
        request_url,
        sessionKey=session_key,
        method='GET',
        getargs=query_args,
        raiseAllErrors=True
    )
    info = json.loads(content)
    return info['entry'][0]['content']

def is_fips_mode(session_key):
    """
    Return true if Splunk is in fips mode
    """
    server_info = get_server_info(session_key)
    return server_info['fips_mode']


def get_server_roles(session_key):
    """
    Return server-roles
    https://docs.splunk.com/Documentation/Splunk/latest/RESTREF/RESTsystem#server.2Froles
    :param session_key:
    :return:
    """
    request_url = f'{rest.makeSplunkdUri()}/services/server/roles'
    query_args = {
        'output_mode': 'json',
    }
    _, content = rest.simpleRequest(
        request_url,
        sessionKey=session_key,
        method='GET',
        getargs=query_args,
        raiseAllErrors=True
    )
    info = json.loads(content)
    return info['entry'][0]['content']['role_list']


def get_cluster_mode(session_key):
    try:
        return _get_cluster_mode(session_key)
    except splunk.LicenseRestriction:
        return constants.DISABLED

def _get_cluster_mode(session_key):
    """
    Return the cluster mode
    https://docs.splunk.com/Documentation/Splunk/latest/RESTREF/RESTcluster#cluster.2Fconfig

    Valid values: (master | slave | searchhead | disabled) Defaults to disabled.
    Sets operational mode for this cluster node. Only one master may exist per cluster.

    :param session_key:
    :return: mode: (master | slave | searchhead | disabled)
    """
    request_url = f'{rest.makeSplunkdUri()}/services/cluster/config'
    query_args = {
        'output_mode': 'json',
    }
    _, content = rest.simpleRequest(
        request_url,
        sessionKey=session_key,
        method='GET',
        getargs=query_args,
        raiseAllErrors=True
    )
    config = json.loads(content)
    return config['entry'][0]['content']['mode']


def get_current_context(session_key):
    """
    Return current context for the current session key
    :param session_key: The session key we want the context for.
    :return:
    """
    request_url = f'{rest.makeSplunkdUri()}/services/authentication/current-context'
    query_args = {
        'output_mode': 'json',
    }
    _, content = rest.simpleRequest(
        request_url,
        sessionKey=session_key,
        method='GET',
        getargs=query_args,
        raiseAllErrors=True
    )
    response = json.loads(content)
    return response['entry'][0]['content']


def get_tokens_enabled(log: logging.Logger, session_key):
    """
    Returns if tokens are enabled
    :param session_key: A raw system auth token
    :return:
    """
    uri = f'{rest.makeSplunkdUri()}services/authorization/tokens'
    query_args = {
        'output_mode': 'json',
    }
    try:
        r, content = rest.simpleRequest(
            uri,
            sessionKey=session_key,
            method='GET',
            getargs=query_args,
            raiseAllErrors=True,
        )
        return r.status == HTTPStatus.OK
    except Exception as e:
        log.debug("Exception fetching tokens enabled data {}".format(e))
        return False


def enable_splunk_tokens(log: logging.Logger, session_key, value):
    """
    Returns true if tokens are being enabled. False if tokens are being disabled.
    :param session_key:
    :return:
    """

    params = {
        'disabled': value
    }

    uri = f'{rest.makeSplunkdUri()}services/admin/token-auth/tokens_auth?output_mode=json'

    try:
        r, content = rest.simpleRequest(uri,
                                        sessionKey=session_key,
                                        postargs=params,
                                        method='POST',
                                        raiseAllErrors=True)

        log.info("Tokens state was set to Disabled: %s\nResponse: %s" % (value, r))

        response = json.loads(content)
        return response[constants.ENTRY][0][constants.CONTENT]['disabled']
    except Exception as e:
        log.debug("Exception enabling/disabling tokens {}".format(e))
        return False


def is_app_enabled(log: logging.Logger, auth_token, app_name):
    """
    Returns whether or not a given app is enabled
    :param auth_token: A raw system auth token
    :param app_name: App name to check enable status for
    :return:
    """
    app_info = {}
    try:
        app_info = get_app_list_request(auth_token, app_name)
    except splunk.RESTException as e:
        if e.statusCode != HTTPStatus.NOT_FOUND:
            raise e
    if not app_info:
        log.debug(f'No installation of {app_name} found')
        return False
    is_enabled = not app_info['entry'][0]['content']['disabled']
    if not is_enabled:
        log.debug(f'{app_name} is disabled')
    return is_enabled


def send_message(log: logging.Logger, session_key, name, value, capability=None, role=None, severity='info'):
    data = {'name': name,
            'value': value,
            'severity': severity
            }
    if capability is not None:
        data['capability'] = capability

    if role is not None:
        data['role'] = role

    rest.simpleRequest(f"{rest.makeSplunkdUri()}services/messages",
                       sessionKey=session_key,
                       postargs=data,
                       method='POST',
                       raiseAllErrors=True)
    log.info(f"Sent internal message from SSG. Message key: {name}")


def get_saved_search(session_key: str, owner: str, app: str, name: str):
    params = {'output_mode': 'json', 'count': 0}
    uri = f'{rest.makeSplunkdUri()}/servicesNS/{_quote_path_segment(owner)}/{_quote_path_segment(app)}/saved/searches/{_quote_path_segment(name)}'
    r, content = rest.simpleRequest(
        uri,
        sessionKey=session_key,
        method='GET',
        getargs=params,
        raiseAllErrors=True
    )

    if r.status != HTTPStatus.OK:
        raise SsgHttpError(r.content, r.status)

    response = json.loads(content)
    return response['entry'][0]['content']


def get_saved_search_with_acl(session_key: str, owner: str, app: str, name: str):
    """Return (acl, content) for a saved search using the caller's session key.

    acl is the dict at entry[0]['acl'], which splunkd populates with the
    canonical owner/app for the resolved object regardless of the namespace
    segment used in the request URI.
    """
    params = {'output_mode': 'json', 'count': 0}
    uri = f'{rest.makeSplunkdUri()}/servicesNS/{_quote_path_segment(owner)}/{_quote_path_segment(app)}/saved/searches/{_quote_path_segment(name)}'
    r, content = rest.simpleRequest(
        uri,
        sessionKey=session_key,
        method='GET',
        getargs=params,
        raiseAllErrors=True
    )

    if r.status != HTTPStatus.OK:
        raise SsgHttpError(r.content, r.status)

    response = json.loads(content)
    entry = response['entry'][0]
    return entry['acl'], entry['content']


def get_saved_search_from_uri(session_key: str, uri: str):
    params = {'output_mode': 'json', 'count': 0}
    parsed = urllib.parse.urlparse(uri)
    if parsed.scheme or parsed.netloc:
        raise ValueError(f'search_uri must be a relative splunkd path, got: {uri!r}')
    uri = f'{rest.makeSplunkdUri()}{uri}'
    r, content = rest.simpleRequest(
        uri,
        sessionKey=session_key,
        method='GET',
        getargs=params,
        raiseAllErrors=True
    )

    if r.status != HTTPStatus.OK:
        raise SsgHttpError(r.content, r.status)

    response = json.loads(content)
    return (response['entry'][0]['name'], response['entry'][0]['id'], response['entry'][0]['content'])


def persist_saved_search(session_key: str, owner: str, app: str, name: str, data: Dict[str, str]):
    uri = f'{rest.makeSplunkdUri()}/servicesNS/{_quote_path_segment(owner)}/{_quote_path_segment(app)}/saved/searches/{_quote_path_segment(name)}'
    r, _ = rest.simpleRequest(
        uri,
        sessionKey=session_key,
        method='POST',
        postargs=data,
        raiseAllErrors=True
    )

    if r.status != HTTPStatus.OK:
        raise SsgHttpError(r.content, r.status)

    return r.status


def send_report_notifications(session_key: str, search_uri: str):
    uri = f'{rest.makeSplunkdUri()}/services/ssg/notifications/reports/send'

    data = {
        'search_uri': search_uri
    }

    r, _ = rest.simpleRequest(
        uri,
        sessionKey=session_key,
        method='POST',
        jsonargs=json.dumps(data),
        raiseAllErrors=True
    )

    return r.status


def get_saved_search_results(log: logging.Logger, session_key: str, owner: str, app: str, saved_search_name: str):
    params = {
        'search': "| savedsearch {}".format(saved_search_name),
        'output_mode': 'json'
    }
    uri = f'{rest.makeSplunkdUri()}servicesNS/{owner}/{app}/search/v2/jobs/export'
    try:
        r, content = rest.simpleRequest(uri,
                                        sessionKey=session_key,
                                        postargs=params,
                                        method='POST',
                                        raiseAllErrors=True)
        if r.status != HTTPStatus.OK:
            raise SsgHttpError(r.content, r.status)
        response = json.loads(content)
        log.info("Fetched results from saved search\nResponse: %s" % r)
        return response

    except Exception as e:
        log.debug("Exception while fetching saved search results {}".format(e))
        return []


def get_saved_search_history(log: logging.Logger, session_key: str, owner: str, app: str, saved_search_name: str,
                             offset: int, count: int):
    """
    Retrieve the search history given a saved search, takes offset and count as params since the call is paginated
    :param saved_search_name: Name of the saved search
    :param app: App in which the saved search is saved
    :param owner: Owner of the app
    :param offset: The first result (inclusive) from which to begin returning data. This value is 0-indexed.
     Default value is 0
    :param count: The maximum number of results to return. If value is set to 0, then all available results are
    returned.
    """
    params = {
        'output_mode': 'json',
        'offset': offset,
        'count': count
    }

    uri = f'{rest.makeSplunkdUri()}servicesNS/{owner}/{app}/saved/searches/{saved_search_name}/history'

    try:
        r, content = rest.simpleRequest(
            uri,
            sessionKey=session_key,
            method='GET',
            getargs=params,
            raiseAllErrors=True
        )

        if r.status != HTTPStatus.OK:
            raise SsgHttpError(r.content, r.status)

        response = json.loads(content)

        return response[constants.ENTRY]

    except Exception as e:
        log.debug(f'Exception while fetching saved search history {e} {uri}')
        return []


def get_search_results(log: logging.Logger, session_key: str, sid: str, offset: int, count: int):
    """
    Retrieve search results given a sid
    :param sid: search ID of the splunk search, this can be retrieved from the search history calls
    :param offset: The first result (inclusive) from which to begin returning data. This value is 0-indexed.
     Default value is 0
    :param count: The maximum number of results to return. If value is set to 0, then all available results are
    returned.
    """
    params = {
        'output_mode': 'json',
        "offset": offset,
        "count": count
    }

    uri = f'{rest.makeSplunkdUri()}services/search/v2/jobs/{sid}/results'

    try:
        r, content = rest.simpleRequest(uri,
                                        sessionKey=session_key,
                                        postargs=params,
                                        method='POST',
                                        raiseAllErrors=True)
        if r.status != HTTPStatus.OK:
            raise SsgHttpError(r.content, r.status)
        response = json.loads(content)
        log.info("Fetched {} results from saved search starting with offset {} for sid {}".format(count, offset, sid))
        return response[constants.RESULTS]

    except Exception as e:
        log.debug("Exception while fetching saved search results {}".format(e))
        return []

