from dataclasses import dataclass
from enum import Enum
from http import HTTPStatus
from typing import Optional

from splunkupgrade.data.parsing import get_field, get_enum_field_throws, get_optional_field
from splunkupgrade.utils.constants import UpgradeEnpointsResponseKeys
from splunkupgrade.utils.types import JsonObject


class EndpointResponseStatus(Enum):
    SUCCEEDED = "succeeded"
    FAILED = "failed"


@dataclass
class UpgradeEndpointsResponse:
    message: str
    status: EndpointResponseStatus
    pid: Optional[int] = None


@dataclass
class GenericResponse:
    status_code: int
    content: JsonObject


def to_upgrade_endpoints_response(json_node: JsonObject) -> UpgradeEndpointsResponse:
    return UpgradeEndpointsResponse(
        get_field(json_node, UpgradeEnpointsResponseKeys.MESSAGE, str),
        get_enum_field_throws(
            EndpointResponseStatus, get_field(json_node, UpgradeEnpointsResponseKeys.STATUS, str)
        ),
        get_optional_field(json_node, UpgradeEnpointsResponseKeys.PID, int),
    )


@dataclass
class UpgradeShcStatusResponse:
    message: dict


def to_upgrade_shc_status_endpoints_response(json_node: JsonObject) -> UpgradeShcStatusResponse:
    return UpgradeShcStatusResponse(
        get_field(json_node, UpgradeEnpointsResponseKeys.MESSAGE, dict),
    )
