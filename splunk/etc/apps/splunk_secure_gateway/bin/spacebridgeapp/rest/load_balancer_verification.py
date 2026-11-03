"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

REST endpoint handler for accessing and setting kvstore records
"""
import logging
import os
os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'

import splunk.rest as rest
from spacebridgeapp.exceptions.load_balancer_exceptions import GetConfigError, AddressVerificationError
from spacebridgeapp.util.config import load_config

def get_uri(log: logging.Logger, session_key: str) -> str:
    """
    Construct URI for REST API calls using the load balancer address or the Splunkd URI if not provided
    """
    config = load_config(session_key)
    load_balancer_address = config.get_load_balancer_address()
    uri = load_balancer_address if load_balancer_address else rest.makeSplunkdUri()
    if not uri:
        raise GetConfigError("Failed to get load balancer address from cloudgateway.conf")

    # If load balancer address is given, verify that it is correct
    if uri != rest.makeSplunkdUri():
        if not uri.endswith('/'):
            uri += '/'
        if not verify_load_balancer_address(log, uri, session_key):
            raise AddressVerificationError("Failed to verify load balancer address={}".format(uri))
    return uri


def verify_load_balancer_address(log: logging.Logger, load_balancer_address: str, session_key: str) -> bool:
    """
    Verify the given load balancer address is correct by making a REST API call and checking the http response code
    """
    uri = '%sservices/authentication/users' % load_balancer_address

    try:
        response, content = rest.simpleRequest(uri, sessionKey=session_key, method='GET',
                                               getargs={'output_mode': 'json'}, raiseAllErrors=True)
    except Exception as e:
        log.exception("Failed to verify load_balancer_address={} with error={}".format(load_balancer_address, e))
        return False

    if response.status == 200:
        log.info('Successfully verified load balancer address={}'.format(load_balancer_address))
        return True
    else:
        log.error('Failed to verify load_balancer_address={} with status_code={} and response={}'
                     .format(load_balancer_address, response.status, response))
        return False
