"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

REST endpoint handler for getting the devices in the kvstore belonging to a specific user
"""

import os
import base64
import json
import sys

from splunk.clilib.bundle_paths import make_splunkhome_path
from splunk.persistconn.application import PersistentServerConnectionApplication

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

from spacebridgeapp.util import py23
from spacebridgeapp.rest.base_endpoint import BaseRestHandler
from spacebridgeapp.rest.devices.util import augment_device_with_metadata
from spacebridgeapp.rest.services.splunk_service import get_devices_for_user, get_devices_metadata

sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))
sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))


class DevicesForUser(BaseRestHandler, PersistentServerConnectionApplication):
    """
    Main class for handling the devices_user endpoint. Subclasses the spacebridge_app
    BaseRestHandler.
    """

    def __init__(self, command_line, command_arg):
        BaseRestHandler.__init__(self, logname="rest_user_devices")

    def get(self, request):
        """
        Handler which retrieves all devices in the kvstore belonging to a specific user. This function:
            1. Identifies the user to retrieve for, either the current user or one specified in a query param.
            2. Retrieves all devices from that user's devices kvstore collection
        """

        # Identifies the user to retrieve for, either the current user or one specified in a query param.
        authtoken = request['session']['authtoken']
        user = request['session']['user']
        if 'user' in request['query'] and py23.py2_check_unicode(request['query']['user']):
            user = request['query']['user']

        self.log.info('Getting devices in kvstore of devices_owner=%s for user=%s' % (user, request['session']['user']))

        # Retrieves all devices from that user's devices kvstore collection
        user_devices = get_devices_for_user(self.log, user, authtoken)
        devices_meta = get_devices_metadata(self.log, authtoken)
        augment_device_with_metadata(user_devices, devices_meta)

        return {
            'payload': user_devices,
            'status': 200,
        }
