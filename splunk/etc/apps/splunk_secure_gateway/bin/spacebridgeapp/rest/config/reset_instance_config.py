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
from spacebridgeapp.rest.base_endpoint import BaseRestHandler
from spacebridgeapp.rest.services.kvstore_service import KVStoreCollectionAccessObject as kvstore
from spacebridgeapp.util.kvstore import build_containedin_clause
from spacebridgeapp.util.constants import PAYLOAD, MESSAGE, STATUS, INSTANCE_CONFIG_COLLECTION_NAME, SYSTEM_AUTHTOKEN, KEY
from splunk.persistconn.application import PersistentServerConnectionApplication

sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))
sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))

class ResetInstanceConfig(BaseRestHandler, PersistentServerConnectionApplication):
    """
    Main class for setting the instance config endpoint. Subclasses the spacebridge_app
    BaseRestHandler.

    """

    def __init__(self, command_line, command_arg):
        BaseRestHandler.__init__(self, logname="rest_instance_config")

    def post(self, request):
        kvstore_service = kvstore(collection=INSTANCE_CONFIG_COLLECTION_NAME, session_key=request[SYSTEM_AUTHTOKEN])
        keys_to_delete = [config_defn.KEY for config_defn in self.config.TEMPLATE.ALL_CONFIGS if config_defn.ALLOW_RESET]
        response = {STATUS: HTTPStatus.OK, PAYLOAD: {MESSAGE: "Reset successful"}}
        try:
            kvstore_service.delete_items_by_query(build_containedin_clause(KEY, keys_to_delete))
            kvstore_service.update_item_by_key(self.config.UPDATE_TIMESTAMP_KEY, self.config.update_timestamp_json())
        except Exception as e:
            self.log.error(f"Failed to delete instance configs. error={e}")
            response[STATUS] = HTTPStatus.INTERNAL_SERVER_ERROR
            response[PAYLOAD] = {MESSAGE: str(e)}

        return response
