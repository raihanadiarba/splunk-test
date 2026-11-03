import json
import logging
from http import HTTPStatus
from urllib.parse import urlparse

from splunkupgrade.data.parsing import DataParseException
from splunkupgrade.data.upgrade_endpoints_response import (
    EndpointResponseStatus,
    GenericResponse,
)
from splunkupgrade.utils.app_conf import RequestConfig, DownloaderConfig
from splunkupgrade.utils.constants import DownloadConfStanza
from splunkupgrade.utils.exceptions import ConfigurationError
from splunkupgrade.utils.splunk_service import SplunkService
from splunkupgrade.utils.types import JsonObject
from splunkupgrade.utils.utils import does_path_exist

logger = logging.getLogger(__name__)


def create_service_from_request(input_request: bytes, config: RequestConfig) -> SplunkService:
    in_json = json.loads(input_request)
    return create_service_from_json_request(in_json, config)


def get_auth_token(in_json: JsonObject) -> str:
    if not does_path_exist(in_json, "session", "authtoken"):
        error = "Failed to get session token"
        logger.error(error)
        raise DataParseException(error)
    return in_json["session"]["authtoken"]


def get_rest_uri(in_json: JsonObject) -> str:
    if not does_path_exist(in_json, "server", "rest_uri"):
        error = "Failed to get host uri"
        logger.error(error)
        raise DataParseException(error)
    return in_json["server"]["rest_uri"]


def get_servername(in_request: JsonObject) -> str:
    if not does_path_exist(in_request, "server", "servername"):
        error = "Failed to get servername"
        logger.error(error)
        raise DataParseException(error)
    return in_request["server"]["servername"]


def create_service_from_json_request(in_json: JsonObject, config: RequestConfig) -> SplunkService:
    uri = get_rest_uri(in_json)
    parsed_uri = urlparse(uri)
    if not parsed_uri.hostname or not parsed_uri.port:
        error = f"Failed to parse hostname or port from uri {uri}"
        logger.error(error)
        raise DataParseException(error)
    return SplunkService.from_session_key(
        parsed_uri.hostname, parsed_uri.port, get_auth_token(in_json), config
    )


def create_generic_response_with_message_and_status(
    http_status: int, message: str
) -> GenericResponse:
    body = {
        "message": message,
        "status": EndpointResponseStatus.FAILED.value
        if http_status != HTTPStatus.OK
        else EndpointResponseStatus.SUCCEEDED.value,
    }
    return GenericResponse(http_status, body)


def create_generic_response_with_message(message: str, http_status: int) -> GenericResponse:
    body = {"message": message}
    return GenericResponse(http_status, body)


def create_generic_response_with_message_status_and_pid(
    http_status: int, pid: int, message: str
) -> GenericResponse:
    response = create_generic_response_with_message_and_status(http_status, message)
    response.content["pid"] = pid
    return response
