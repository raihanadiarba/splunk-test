"""
Utility for all DMC's Scripted Inputs
"""

import urllib
import getpass
import httplib2
from xml.dom import minidom

BASE_URL = "https://localhost:8089"


def get_script_log_format():
    '''Customize logging format to insert filename to make it easier to
    find script output in Splunk.'''
    return ("%(asctime)s %(levelname)s (%(threadName)s) %(name)s "
            "%(filename)s: %(message)s")


def get_username_password():
    username = input("admin username: ")
    password = getpass.getpass("password: ")
    return username, password


def generate_session_key():
    """
    Generates session_key used by splunk.rest
    returns: session_key
    """
    try:
        username, password = get_username_password()
        myhttp = httplib2.Http(".cache", disable_ssl_certificate_validation=True)
        servercontent = myhttp.request(BASE_URL + '/services/auth/login', 'POST',
                                headers={}, body=urllib.parse.urlencode({'username':username, 'password':password}))[1]
        sessionkey = minidom.parseString(servercontent).getElementsByTagName('sessionKey')[0].childNodes[0].nodeValue
        return sessionkey
    except:
        raise Exception("Could not generate session_key. Please check username and Password")
