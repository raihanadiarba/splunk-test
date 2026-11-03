import json
import logging
from logging import handlers
import os
import sys
from typing import Any, Dict, Optional

from splunk.persistconn.application import PersistentServerConnectionApplication
import splunk.rest as rest

# Ensure the current directory is on sys.path for local imports
_current_dir = os.path.dirname(os.path.abspath(__file__))
if _current_dir not in sys.path:
    sys.path.insert(0, _current_dir)

"""
AI Canvas Authentication REST Handler for Splunk.

This module provides a persistent REST endpoint that handles CUI token exchange
for AI Canvas integration with Splunk.

Secrets are stored in Splunk's password storage with the following structure:
- Refresh token: realm=ai_canvas, username=refresh_token
  (URI encoded as ai_canvas%3Arefresh_token%3A)
- Client auth string: realm=ai_canvas, username=client_auth_string
  (URI encoded as ai_canvas%3Aclient_auth_string%3A)
  This is a plaintext string of "<client_id>:<client_secret>", that will be base64-encoded in this handler.
  The separating colon is a required part of the string.

Access control for these secrets should be managed via this app's default.meta file. 
Please ensure that the secrets are created within the scope of the AI Canvas app
so that the permissions we set in our default.meta file actually apply.

"""

SPLUNK_HOME = os.path.normpath(os.environ['SPLUNK_HOME'])
LOG_FILE = os.path.join(SPLUNK_HOME, 'var', 'log', 'splunk', 'python.log')

def get_logger() -> logging.Logger:
    """
    Initialize and configure the logger for AI Canvas authentication.

    Returns:
        Configured logging.Logger instance that outputs to stderr.
    """
    logger = logging.getLogger('AICanvasAuthLogger')

    fileHandler = handlers.RotatingFileHandler(
        filename=LOG_FILE, 
        mode='a', 
        maxBytes=50 * 1024**2,
        backupCount=10,)
    fileHandler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')) 
    logger.propagate = False
    logger.addHandler(fileHandler)
    logger.setLevel(logging.INFO)

    logger.info("Initializing AI Canvas Auth REST Handler Logger")

    return logger

class AICanvasAuthRestHandler(PersistentServerConnectionApplication):
    """
    Persistent REST endpoint implementing the CUI token fetch from Splunk for AI Canvas use.

    Attributes:
        logger (logging.Logger): Logger instance for logging events.
    """
    def __init__(self, command_line: str, command_arg: str) -> None:
        super().__init__()
        self.logger = get_logger()
        self.logger.info("AI Canvas Auth REST Handler initialized")

    def handle(self, in_bytes: str) -> Dict[str, Any]:
        """
        Handle incoming HTTP requests.

        This method processes all incoming requests, performing the token fetch
        and then returning a valid CUI token for use with AI Canvas.

        Args:
            in_string: Raw HTTP request string containing JSON data.

        Returns:
            Dict containing HTTP response with status, headers, and payload.
        """

        try:
            i = json.loads(in_bytes)

            response_code, content = self._handle(i)

            if response_code != 200:
                self.logger.error(
                    "AI Canvas auth token request failed with status %d: %s - %s",
                    response_code,
                    content.get("error", "unknown"),
                    content.get("error_description", "no description"),
                )
                return self._build_response(response_code, content)

            return self._build_response(response_code, content)

        except Exception as e:

            self.logger.exception("Unexpected error handling AI Canvas auth request: %s", e)
            return self._build_response(
                400,
                {
                    "error": {"code": -32603, "message": "Internal server error"},
                },
            )

    def handleStream(self, handle: Any, in_string: str) -> Optional[Any]:
        """
        Handle streaming requests (not implemented).

        Args:
            handle: Stream handle (unused).
            in_string: Input string (unused).

        Returns:
            None as streaming is not supported.
        """
        self.logger.warning("Stream handling requested but not supported")
        return None

    def done(self) -> None:
        """
        Cleanup method called when the handler completes handling a request.
        """
        pass

    def _build_response(self, status: int, payload_obj: Any) -> Dict[str, Any]:
        """
        Build a properly formatted HTTP response for Splunk.

        Args:
            status: HTTP status code.
            payload_obj: Response payload object (will be JSON-encoded by Splunk).

        Returns:
            Dict containing complete HTTP response structure.
        """
        return {
            "status": status,
            "headers": {"Content-Type": "application/json"},
            "payload": payload_obj,  # Splunk will JSON encode dict automatically
        }

    def _handle(self, request_data) -> tuple[int, Dict[str, Any]]:
        """
        Process the authentication request and perform token exchange.

        Performs a CUI token-fetch through Splunks server endpoint.

        Args:
            request_data: Parsed request data containing session information.

        Returns:
            Tuple of (response, result_dict) with CUI token data or error information.
        """
        session = request_data['session']['authtoken']
        return self._get_cui_token_from_splunkd(session)

    def _get_cui_token_from_splunkd(self, session: str) -> tuple[int, Dict[str, Any]]:
        """
        Retrieve a CUI token from the built-in Splunk authorization/tokens endpoint.

        Posts to /services/authorization/tokens with type=cui and returns
        the bearer token from the response.

        Args:
            session: The request auth token.

        Returns:
            Tuple of (status_code, result_dict) where result_dict contains
            {'token': str} on success or {'error': str, 'error_description': str} on failure.
        """
        try:
            response, content = rest.simpleRequest(
                '/services/authorization/tokens',
                sessionKey=session,
                method='POST',
                rawResult=True,
                postargs={"type": "cui", "output_mode": "json"},
            )

            if response.status == 200:
                decoded_content = json.loads(content.decode('utf-8'))
                try:
                    access_token = decoded_content['entry'][0]['content']['token']
                    expires_in = decoded_content['entry'][0]['content']['expires_in']
                    self.logger.info("Successfully retrieved CUI token")
                    return 200, {"access_token": access_token, "expires_in": expires_in}
                except (KeyError, IndexError) as e:
                    self.logger.error("Failed to extract token from authorization/tokens response.\nError: %s\nResponse content: %s", e, decoded_content)
                    return 500, {
                        "error": "cui_token_not_found_failure",
                        "error_description": "Failed to extract CUI token from Splunk response."
                    }
            else:
                self.logger.error("Failed to retrieve CUI token from splunkd: HTTP %d - Reason: %s", response.status, response.reason)
                return response.status, {
                    "error": "cui_token_fetch_failure",
                    "error_description": f"Failed to retrieve CUI token from Splunk: HTTP {response.status}"
                }
        except Exception as e:
            self.logger.exception("Error retrieving CUI token from splunkd: %s", e)
            return 500, {
                "error": "cui_token_retrieval_connection_failure",
                "error_description": "Connection to Splunk failed while attempting to retrieve a CUI token."
            }