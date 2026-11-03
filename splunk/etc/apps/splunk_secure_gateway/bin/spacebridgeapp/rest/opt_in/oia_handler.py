"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

REST endpoint handler for reading oia value
"""
import os
import sys
import splunk
from http import HTTPStatus

from splunk.persistconn.application import PersistentServerConnectionApplication
from splunk.clilib.bundle_paths import make_splunkhome_path

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

from spacebridgeapp.rest.base_endpoint import BaseRestHandler, build_error_payload
from spacebridgeapp.util.constants import PAYLOAD, STATUS, SYSTEM_AUTHTOKEN

sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))
sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))

class OptInApproved(BaseRestHandler, PersistentServerConnectionApplication):
    """
    Main class for handling the oia endpoint. Subclasses the spacebridge_app
    BaseRestHandler.
    """

    def __init__(self, command_line, command_arg):
        BaseRestHandler.__init__(self)

    def get(self, request):
        """
        Get the oia value.  Default value is false.
        :param request:
        :return:
        """
        try:
            return {
                PAYLOAD: {'oia': self.config.get_oia()},
                STATUS: HTTPStatus.OK
            }
        except splunk.RESTException as e:
            return build_error_payload(e)

