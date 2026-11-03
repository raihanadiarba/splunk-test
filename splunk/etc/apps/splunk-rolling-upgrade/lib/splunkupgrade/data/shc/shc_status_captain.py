from dataclasses import dataclass

from splunkupgrade.data.parsing import get_field
from splunkupgrade.utils.constants import ShcStatusKeys
from splunkupgrade.utils.types import JsonObject


@dataclass
class ShcStatusCaptain:
    label: str
    dynamic_captain: bool
    stable_captain: bool
    service_ready: bool
    rolling_restart: bool
    rolling_upgrade: bool
    max_failures_to_keep_majority: int


def to_shc_status_captain(json_captain: JsonObject) -> ShcStatusCaptain:
    return ShcStatusCaptain(
        get_field(json_captain, ShcStatusKeys.LABEL, str),
        get_field(json_captain, ShcStatusKeys.DYNAMIC_CAPTAIN, bool),
        get_field(json_captain, ShcStatusKeys.STABLE_CAPTAIN, bool),
        get_field(json_captain, ShcStatusKeys.SERVICE_READY_FLAG, bool),
        get_field(json_captain, ShcStatusKeys.ROLLING_RESTART_FLAG, bool),
        get_field(json_captain, ShcStatusKeys.ROLLING_UPGRADE_FLAG, bool),
        get_field(json_captain, ShcStatusKeys.MAX_FAILURES_TO_KEEP_MAJORITY, int),
    )
