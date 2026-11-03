import logging
import requests
from requests.auth import HTTPBasicAuth
from . exceptions import AppInspectClientAuthenticationException

LOGGER = logging.getLogger(__name__)

DEFAULT_AUTH_ENDPOINT = "https://api.splunk.com/2.0/rest/login/splunk"

class Auth(object):

    def __init__(self, endpoint=DEFAULT_AUTH_ENDPOINT):
        self.endpoint = endpoint
        self.token = None

    def authenticate(self, username, password):
        """https://api.splunk.com/2.0/rest/login/splunk
        """
        url = self.endpoint
        LOGGER.debug("Attempting to authenticate using: {}".format(url))

        response = requests.get(url=url, auth=HTTPBasicAuth(username=username, password=password))
        
        if response.status_code == 200:
            token = response.json().get("data").get("token")
            self.token = token
        else:
            message = "Received status code: {} from {}".format(response.status_code, url)
            LOGGER.exception(message)
            raise AppInspectClientAuthenticationException(message)
