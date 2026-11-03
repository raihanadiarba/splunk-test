"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

REST endpoint handler for accessing and setting instance setting kvstore records
"""
import sys
import os
from splunk.clilib.bundle_paths import make_splunkhome_path

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

from http import HTTPStatus
from spacebridgeapp.util.constants import MESSAGE, PAYLOAD, STATUS
from spacebridgeapp.rest import async_base_endpoint
from spacebridgeapp.rest.config.instance_config_helper import update_config, delete_config, load_config

sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))
sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))

class InstanceConfig(async_base_endpoint.AsyncBaseRestHandler):
    """
    Main class for setting the instance config endpoint. Subclasses the spacebridge_app
    BaseRestHandler.

    """

    def __init__(self, command_line, command_arg):
        super().__init__(command_line, command_arg, logname="rest_instance_config")

    async def get(self, request):
        instance_config_settings = load_config(self.log, request)
        return {
            PAYLOAD: instance_config_settings,
            STATUS: HTTPStatus.OK
        }

    async def post(self, request):
        spacebridge_client = self.async_client_factory.spacebridge_client()
        success, result = await update_config(self.log, request, spacebridge_client)

        status_code = HTTPStatus.OK
        message = result

        if not success:
            if isinstance(result, Exception):
                status_code = HTTPStatus.INTERNAL_SERVER_ERROR
                message = str(result)
            else:
                status_code = HTTPStatus.BAD_REQUEST

        return {
            PAYLOAD: {MESSAGE: message},
            STATUS: status_code
        }

    async def delete(self, request):
        success, message = delete_config(self.log, request, self.config)
        status_code = HTTPStatus.OK if success else HTTPStatus.INTERNAL_SERVER_ERROR

        return {
            PAYLOAD: {MESSAGE: message},
            STATUS: status_code
        }
