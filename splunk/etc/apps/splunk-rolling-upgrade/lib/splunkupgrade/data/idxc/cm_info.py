from dataclasses import dataclass

from splunkupgrade.data.parsing import get_field
from splunkupgrade.utils.types import JsonObject
from splunkupgrade.utils.constants import CmInfoKeys


@dataclass
class CmInfo:
    maintenance_mode: bool
    rolling_restart_or_upgrade: bool


def to_cm_info(json_response: JsonObject) -> CmInfo:
    return CmInfo(
        get_field(json_response, CmInfoKeys.MAINTENANCE_MODE, bool),
        get_field(json_response, CmInfoKeys.ROLLING_RESTART_OR_UPGRADE, bool),
    )
