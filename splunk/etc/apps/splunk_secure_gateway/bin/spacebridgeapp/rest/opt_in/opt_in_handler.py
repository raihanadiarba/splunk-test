"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

REST endpoint handler for accessing and setting opt-in signals
"""
import os
import sys
import json
import splunk
from http import HTTPStatus

from splunk.persistconn.application import PersistentServerConnectionApplication
from splunk.clilib.bundle_paths import make_splunkhome_path

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

from spacebridgeapp.util.time_utils import get_current_timestamp
from spacebridgeapp.rest.base_endpoint import BaseRestHandler, build_error_payload
from spacebridgeapp.rest.services.kvstore_service import KVStoreCollectionAccessObject as KVStore
from spacebridgeapp.util.constants import SESSION, AUTHTOKEN, USER, PAYLOAD, STATUS, \
    META_COLLECTION_NAME, NOBODY, TIMESTAMP, KEY, SYSTEM_AUTHTOKEN
from spacebridgeapp.metrics.metrics_collector import OptInPageMetric
from spacebridgeapp.rest.config.deployment_info import ensure_deployment_friendly_name
from spacebridgeapp.rest.services.splunk_service import user_is_administrator
from spacebridgeapp.rest.services.splunk_service import is_fips_mode
from spacebridgeapp.solnlib.server_info import ServerInfo

sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))
sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))

OPT_IN = 'opt_in'
TYPE = 'type'

# The soc2 opt-in type is left over to maintain backwards compatibility of old opt-in signal, this will maintain
# acknowledgement from previous opt-ins
SOC2 = 'soc2'
DEFAULT_OPT_IN = SOC2

OPT_IN_MESSAGE_KEY = 'SSG-OPT-IN'
OPT_IN_MESSAGE = 'Splunk Secure Gateway has been activated by %s. [[/app/splunk_secure_gateway|Learn More]]'

class OptInHandler(BaseRestHandler, PersistentServerConnectionApplication):
    """
    Main class for handling the opt_in endpoint. Subclasses the spacebridge_app
    BaseRestHandler.
    """

    def __init__(self, command_line, command_arg):
        BaseRestHandler.__init__(self, logname="opt_in_handler")

    def get(self, request):
        f"""
        Get the opt_in value by type.  Currently hardcoded to {DEFAULT_OPT_IN} type
        :param request:
        :return:
        """
        try:
            auth_token = request[SYSTEM_AUTHTOKEN]
            opt_in = get_opt_in(DEFAULT_OPT_IN, auth_token)

            return {
                PAYLOAD: opt_in,
                STATUS: HTTPStatus.OK
            }
        except splunk.RESTException as e:
            return build_error_payload(e)

    def post(self, request):
        f"""
        Post call to opt-in by type.  Currently hardcoded to {DEFAULT_OPT_IN} type
        :param request:
        :return:
        """
        config = self.config

        try:
            if not _opt_in_allowed(config, request):
                return {
                    PAYLOAD: {'message': 'User does not have permission to opt in'},
                    STATUS: HTTPStatus.FORBIDDEN
                }

            # system_auth token required to add key in nobody namespace
            system_authtoken = request[SYSTEM_AUTHTOKEN]

            # Ensure the deployment_name is set but ignore any errors as it's not a requirement for opt-in
            try:
                ensure_deployment_friendly_name(self.log, auth_token=system_authtoken)
            except splunk.RESTException:
                self.log.warning("Ignoring deployment_friendly_name failure.  Not a requirement for opt-in.")

            user = request[SESSION][USER]
            set_opt_in(DEFAULT_OPT_IN, user, system_authtoken)
            metric = OptInPageMetric(system_authtoken, self.log, user, 'opt_in')
            self.log.debug('opt_in_metrics=%s', metric)
            metric.send_to_telemetry()

            return {
                PAYLOAD: {},
                STATUS: HTTPStatus.OK
            }
        except splunk.RESTException as e:
            return build_error_payload(e)


# Helper to determine if opt in is allowed
# Legal Opt-In Logic
#
# Guidance provided by Elizabeth Fleming on Feb. 24th, 2021
# Guidance changed to allow non-admins to opt-in
#    by Elizabeth Fleming, Elizabeth Davies and Ted Chan
#    on April. 5th, 2022
#
# Guidance changed again after discussion with ProdSec.
#    We require admins to opt-in for enterprise instances
#    Discussed with Girish Jorapurkar on May 12th, 2022
#
#              Non-FIPS              FIPS
# Cloud        Opt-In for everyone   Wall for everyone → Secret Flag → Opt-In for admins
# Enterprise   Opt-In for admin      Opt-In for admin
def _opt_in_allowed(config, request):
    system_authtoken = request[SYSTEM_AUTHTOKEN]
    user_authtoken = request[SESSION][AUTHTOKEN]

    is_cloud_instance = ServerInfo(system_authtoken).is_cloud_instance()

    if is_cloud_instance:
        if is_fips_mode(system_authtoken):
            if config.get_oia():
                return user_is_administrator(user_authtoken)
            else:
                return False
        else:
            return True
    else:
        return user_is_administrator(user_authtoken)

# Helpers to access KVStore
def get_opt_in(opt_in_type, auth_token):
    """
    Get the opt_in key value by type, None if exception occurs or key record is empty
    :param opt_in_type: Specify the opt-in type will use to construct a opt_in key.  i.e. soc2_opt_in
    :param auth_token:
    :return: payload dict
    """
    # Initialize negative result status
    result = {
        OPT_IN: False,
        TYPE: opt_in_type
    }

    try:
        kvstore = KVStore(META_COLLECTION_NAME, auth_token, owner=NOBODY)
        _, record = kvstore.get_item_by_key(f"{opt_in_type}_opt_in")
    except splunk.RESTException as e:
        if e.statusCode != HTTPStatus.NOT_FOUND:
            raise e
        # opt-in key NOT_FOUND this is a successful negative result
        return result

    # If record for opt-in type exist, update the result dict with params
    if record:
        record = json.loads(record)
        # If record contains keys TIMESTAMP, USERNAME and both have value
        if all(key in record and record[key] for key in [TIMESTAMP, USER]):
            result[TIMESTAMP] = record[TIMESTAMP]
            result[USER] = record[USER]
            result[OPT_IN] = True
    return result


def set_opt_in(opt_in_type, user, auth_token):
    """
    Set opt_in for specified type.  Will insert or update opt_in details.
    :param opt_in_type:
    :param user:
    :param auth_token:
    :return: payload dict
    """
    kvstore = KVStore(META_COLLECTION_NAME, auth_token, owner=NOBODY)
    record = {
        KEY: f"{opt_in_type}_opt_in",
        USER: user,
        TIMESTAMP: get_current_timestamp()
    }
    kvstore.insert_or_update_item_containing_key(record)


def is_opt_in(opt_in_type, auth_token):
    """
    Helper method to return boolean value if type has been opted-in
    :param opt_in_type:
    :param auth_token:
    :return:
    """
    try:
        opt_in = get_opt_in(opt_in_type, auth_token)
        if opt_in and OPT_IN in opt_in and opt_in[OPT_IN]:
            return True
    except splunk.RESTException as e:
        pass
    return False
