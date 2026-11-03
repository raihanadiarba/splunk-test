"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

REST endpoint handler for restarting SSG modular inputs
"""
import os
import logging
import sys
from splunk.persistconn.application import PersistentServerConnectionApplication
from splunk.clilib.bundle_paths import make_splunkhome_path
os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

from spacebridgeapp.rest.base_endpoint import BaseRestHandler
from spacebridgeapp.rest.services import splunk_service

sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))
sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))

class RestartSsgInputs(BaseRestHandler, PersistentServerConnectionApplication):

    def __init__(self, command_line, command_arg):
        BaseRestHandler.__init__(self, logname="restart_ssg")

    def post(self, request):
        """
        Restart modular inputs associated to SSG
        """
        self.log.info("Received request to restart SSG modular inputs")
        user_token = request['session']['authtoken']
        return _restart_inputs(self.log, user_token)


def _restart_inputs(log: logging.Logger, user_authtoken):
    responses = splunk_service.restart_all_modular_inputs(log, user_authtoken)
    return {
        'status': 200,
        'payload': responses
    }

