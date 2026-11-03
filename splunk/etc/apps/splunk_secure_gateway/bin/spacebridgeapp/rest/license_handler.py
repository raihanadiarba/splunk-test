import sys
from time import time
import os

from splunk.clilib.bundle_paths import make_splunkhome_path

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

from cloudgateway.splunk.clients.splunk_client import fetch_license_info
from splunk.persistconn.application import PersistentServerConnectionApplication
from spacebridgeapp.rest.base_endpoint import BaseRestHandler

sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))
sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))


def is_license_valid(license_data):
    now = int(time())
    expiration_time = license_data['expiration_time']
    time_left = expiration_time - now

    if time_left < 0:
        return False, license_data['label']

    return True, None


def check_licences(licence_entries):
    for entry in licence_entries:
        valid, label = is_license_valid(entry['content'])
        if not valid:
            return valid, label
    return True, None


class LicenseHandler(BaseRestHandler, PersistentServerConnectionApplication):

    def __init__(self, command_line, command_arg):
        BaseRestHandler.__init__(self)

    def get(self, request):
        """
        Fetch public and private keys for signing messages from the passwords endpoint
        :param request:
        :return:
        """

        system_authtoken = request['system_authtoken']
        license_response = fetch_license_info(system_authtoken)
        license_valid, violating_label = check_licences(license_response['entry'])


        return {
            "payload": {'license_valid': license_valid, 'violating_label': violating_label},
            "status": 200
        }
