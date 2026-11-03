"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.
"""

import sys
import os
from splunk.clilib.bundle_paths import make_splunkhome_path
os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

from http import HTTPStatus
from spacebridgeapp.rest.config.deployment_info import load_deployment_info, set_enforce_mdm
from spacebridgeapp.rest.services.splunk_service import user_is_administrator
from spacebridgeapp.util import constants
from spacebridgeapp.util.constants import SESSION, AUTHTOKEN
from splunk.persistconn.application import PersistentServerConnectionApplication

from spacebridgeapp.rest.base_endpoint import BaseRestHandler

sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))
sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))


class DeploymentWebInfo(BaseRestHandler, PersistentServerConnectionApplication):

    def __init__(self, command_line, command_arg):
        BaseRestHandler.__init__(self, logname="rest_app_web_config")

    def get(self, request):
        try:
            deployment_info = load_deployment_info(self.log, self.config, request)

            if user_is_administrator(request[SESSION][AUTHTOKEN]):
                return {
                    constants.PAYLOAD: deployment_info,
                    constants.STATUS: HTTPStatus.OK
                }
            else:
                field_to_extract = [
                    constants.ENFORCE_MDM,
                    constants.CUSTOM_ENDPOINT_ID,
                    constants.CUSTOM_ENDPOINT_HOSTNAME,
                    constants.CUSTOM_ENDPOINT_GRPC_HOSTNAME,
                    constants.CLIENT_CERT_REQUIRED
                ]

                return {
                    constants.PAYLOAD: {field: deployment_info[field] for field in field_to_extract},
                    constants.STATUS: HTTPStatus.OK
                }

        except Exception as e:
            self.log.exception('An error occurred fetching deployment info')
            raise e

    def post(self, request):
        set_enforce_mdm(request)
        return {
            constants.PAYLOAD: {},
            constants.STATUS: HTTPStatus.OK
        }
