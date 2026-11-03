"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Module to process client config requests for client settings from server
"""
import logging

from spacebridgeapp.util.config import load_config



async def process_client_config_request(log: logging.Logger,
                                        request_context, client_single_request, server_single_response):
    """
    Process client config request for client settings managed by the server
    """
    log.debug("Client Config Requested.")
    config = load_config(request_context.system_auth_header.session_token)
    server_single_response.clientConfigResponse.requestTimeoutSecs = config.get_request_timeout_secs()
