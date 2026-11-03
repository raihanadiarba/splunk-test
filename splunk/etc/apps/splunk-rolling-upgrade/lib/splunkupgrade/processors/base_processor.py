import abc
import json
import logging
import os

from enum import Enum

from splunk.rest.format import primitiveToAtomFeed
from typing import Optional, List, Dict
from http import HTTPStatus
from pathlib import PurePosixPath
from splunkupgrade.data.parsing import get_enum_field_throws, get_optional_field, DataParseException
from splunkupgrade.data.upgrade_endpoints_response import GenericResponse
from splunkupgrade.downloader.downloader import ensure_downloader_config_exists
from splunkupgrade.processors.common import (
    create_service_from_json_request,
)
from splunkupgrade.utils.app_conf import RollingUpgradeConfig
from splunkupgrade.utils.inputs_conf import InputsConfig
from splunkupgrade.utils.constants import GeneralConstants, INTERNAL_ERROR
from splunkupgrade.utils.splunk_service import SplunkService
from splunkupgrade.utils.types import JsonObject
from splunkupgrade.utils.utils import is_supported_platform
from splunkupgrade.utils.exceptions import (
    InvalidEndpointParameter,
    ResponseSafeToPrintException,
)

logger = logging.getLogger(__name__)


class OutputMode(Enum):
    JSON = "json"
    XML = "xml"


def get_output_mode(parameters: dict) -> OutputMode:
    str_output_mode = parameters.get(GeneralConstants.OUTPUT_MODE, "xml")
    try:
        return get_enum_field_throws(OutputMode, str_output_mode)
    except DataParseException as e:
        raise InvalidEndpointParameter(f"Invalid output mode specified '{str_output_mode}'.") from e


def get_field_from_list(query: List[List[str]], field_name: str) -> Optional[str]:
    for key, value in query:
        if key == field_name:
            return value
    return None


def split_payload(payload: str) -> Dict[str, List[str]]:
    result: Dict[str, List[str]] = dict()
    for kv in payload.split("&"):
        key_value = kv.split("=")
        param_value = key_value[1].strip() if len(key_value) > 1 else ""
        result.setdefault(key_value[0].strip(), []).append(param_value)
    return result


class RestProcessorBase(metaclass=abc.ABCMeta):
    def __init__(
        self,
        rest_path: str,
        atom_prefix: str,
        allowed_methods: Optional[List[str]] = None,
        service: Optional[SplunkService] = None,
    ):
        if allowed_methods is None:
            allowed_methods = []

        self._rest_path = rest_path
        self._splunk_service: Optional[SplunkService] = service
        self._config: Optional[RollingUpgradeConfig] = None
        self._inputs_config: Optional[InputsConfig] = None
        self._output_mode = OutputMode.XML
        self._atom_prefix = atom_prefix
        self._allowed_methods = allowed_methods

    @abc.abstractmethod
    def _process(self, request: JsonObject) -> GenericResponse:
        pass

    def _validate_config(self, config: RollingUpgradeConfig) -> None:
        ensure_downloader_config_exists(config.downloader_config)

    def _verify_allowed_http_method(self, request: JsonObject) -> None:
        requested_method = get_optional_field(request, GeneralConstants.METHOD, str)
        if requested_method is None:
            raise Exception(f"Didn't get '{GeneralConstants.METHOD}' value from splunkd")
        if requested_method not in self._allowed_methods:
            raise ResponseSafeToPrintException(
                f"Invalid HTTP method {requested_method}", HTTPStatus.BAD_REQUEST
            )

    def _allow_deprecated_checksum(self) -> bool:
        return False

    def _pre_process(self, in_request: bytes) -> JsonObject:
        request = json.loads(in_request)
        self._output_mode = get_output_mode(request)
        self._verify_allowed_http_method(request)
        self._config = RollingUpgradeConfig(
            allow_deprecated_checksum=self._allow_deprecated_checksum()
        )
        self._validate_config(self._config)
        if not self._splunk_service:
            self._splunk_service = create_service_from_json_request(
                request, self._config.requests_timeout_config
            )
        self._splunk_service.ensure_user_holds_write_permissions(in_request)
        return request

    def format_response(self, response: GenericResponse) -> JsonObject:
        head, tail = os.path.split(self._rest_path)
        inner_head, inner_tail = os.path.split(head)
        content = {tail: response.content}
        feed = primitiveToAtomFeed(
            str(PurePosixPath("/services", os.path.basename(inner_head))),
            str(PurePosixPath("/", self._atom_prefix)),
            content,
        )
        if self._output_mode == OutputMode.XML:
            content = feed.toXml()
        else:
            content = feed.asJsonStruct()
        return {"payload": content, "status": response.status_code}

    def format_error_response(self, status: HTTPStatus, message: str):
        if self._output_mode == OutputMode.XML:
            str_content = (
                f"""<?xml version="1.0" encoding="UTF-8"?>"""
                f"""<response>"""
                f"""  <messages>"""
                f"""    <msg type="ERROR">{message}</msg>"""
                f"""  </messages>"""
                f"""</response>"""
            )
            return {"payload": str_content, "status": status}
        else:
            dict_content = {"messages": [{"type": "ERROR", "text": message}]}
            return {"payload": dict_content, "status": status}

    def handle(self, in_request: bytes) -> JsonObject:
        logger.info(f"Running {self._rest_path} pid='{os.getpid()}'")
        try:
            json_request = self._pre_process(in_request)
            if not is_supported_platform():
                return self.format_error_response(HTTPStatus.BAD_REQUEST, "Unsupported platform")
            return self.format_response(self._process(json_request))
        except ResponseSafeToPrintException as e:
            logger.error(str(e))
            return self.format_error_response(e.status, str(e))
        except Exception as e:
            logger.error(f"Uncaught exception during processing {e}")
            return self.format_error_response(HTTPStatus.INTERNAL_SERVER_ERROR, INTERNAL_ERROR)
