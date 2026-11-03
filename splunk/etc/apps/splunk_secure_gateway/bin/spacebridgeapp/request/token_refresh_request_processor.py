"""
(C) 2020 Splunk Inc. All rights reserved.

Module to process Token Refresh Request
"""
import logging
import sys
import json
from http import HTTPStatus
from datetime import datetime, timedelta

from spacebridgeapp.request.request_processor import JWTAuthHeader, async_is_valid_session_token
from spacebridgeapp.rest.clients.async_kvstore_client import AsyncKvStoreClient
from spacebridgeapp.rest.registration import util
from spacebridgeapp.util import constants
from spacebridgeapp.util.config import load_config
from cloudgateway.private.util.tokens_util import calculate_token_info
from splapp_protocol import request_pb2


async def process_token_refresh_request(log: logging.Logger,
                                        request_context,
                                        client_single_request,
                                        server_single_response,
                                        async_splunk_client,
                                        encryption_context,
                                        async_kvstore_client: AsyncKvStoreClient):

    if not isinstance(request_context.auth_header, JWTAuthHeader):
        secured_session_token = encryption_context.secure_session_token(request_context.auth_header.session_token)
        server_single_response.tokenRefreshResponse.sessionToken = secured_session_token
        server_single_response.tokenRefreshResponse.tokenExpiresAt = 0
        server_single_response.tokenRefreshResponse.code = request_pb2.TokenRefreshResponse.SUCCESS
        return

    session_token = request_context.auth_header.token
    system_auth_header = request_context.system_auth_header
    valid_request = await async_is_valid_session_token(request_context.current_user, session_token, async_splunk_client)

    if not valid_request:
        server_single_response.tokenRefreshResponse.code = request_pb2.TokenRefreshResponse.ERROR_TOKEN_INVALID
        return


    # Verify token is not already slated for deletion
    old_token_info = calculate_token_info(session_token)
    old_token_id = old_token_info['jti']
    delete_token_lookup = await async_kvstore_client.async_kvstore_get_request(
        collection=constants.DELETE_TOKENS_COLLECTION_NAME,
        params={"query": json.dumps({"token_id":old_token_id})},
        auth_header=request_context.auth_header
    )

    if delete_token_lookup.status == HTTPStatus.OK:
        tokens = await delete_token_lookup.json()
        if len(tokens) > 0:
            log.info(f"Token {old_token_id} found in delete_tokens collection. Unable to create new token.")
            server_single_response.tokenRefreshResponse.code = request_pb2.TokenRefreshResponse.ERROR_TOKEN_INVALID
            return
    else:
        msg = await delete_token_lookup.text()
        log.warning(f"Token lookup failed. Status: {delete_token_lookup.status} Message: {msg}")

    # Generate new JWT token
    try:
        system_session_token = request_context.system_auth_header.session_token
        config = load_config(system_session_token)
        is_edge_hub = _is_edge_hub(request_context)
        new_jwt_credentials = util.generate_jwt_token(config, log, request_context.current_user, system_session_token, is_edge_hub)
    except Exception as e:
        log.warning("Failed to create new token error={}".format(e))
        server_single_response.tokenRefreshResponse.code = request_pb2.TokenRefreshResponse.ERROR_CREATING_TOKEN
        return

    # Get token expiry
    new_token_info = calculate_token_info(new_jwt_credentials.token)
    server_single_response.tokenRefreshResponse.tokenExpiresAt = new_token_info['exp']

    # Encrypt this token
    new_session_token = new_jwt_credentials.get_credentials() if sys.version_info < (3, 0) else str.encode(new_jwt_credentials.get_credentials())
    encrypted_token = encryption_context.secure_session_token(new_session_token)
    server_single_response.tokenRefreshResponse.sessionToken = encrypted_token
    server_single_response.tokenRefreshResponse.code = request_pb2.TokenRefreshResponse.SUCCESS

    # Insert old token to the delete_tokens collection
    # TTL set for one hour from now so concurrent requests that could be using the old token complete successfully
    old_token_expiry = datetime.now() + timedelta(hours=1)
    delete_token_payload = {"token_id": old_token_id,
                       "user": request_context.current_user,
                       "expires_at": old_token_expiry.timestamp()}

    response = await async_kvstore_client.async_kvstore_post_request(collection=constants.DELETE_TOKENS_COLLECTION_NAME,
                                                                     data=json.dumps(delete_token_payload),
                                                                     auth_header=request_context.system_auth_header)

    log_token_info = {'token_id': old_token_id, 'user': request_context.current_user, 'sub': old_token_info.get('sub'), 'aud': old_token_info.get('aud'), 'exp': old_token_info.get('exp')}
    if response.status != HTTPStatus.CREATED:
        msg = await response.text()
        log.error(f"Failed to store old token in {constants.DELETE_TOKENS_COLLECTION_NAME} collection.\nStatus: {response.status}\nMessage: {msg}\nOld token: {log_token_info}")
    else:
        log.info(f"Added token to {constants.DELETE_TOKENS_COLLECTION_NAME} collection\nExpiry: {old_token_expiry}\nOld token: {log_token_info}")


def _is_edge_hub(request_context):
    return constants.USER_AGENT_EDGE_HUB == request_context.user_agent
