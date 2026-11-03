from dataclasses import dataclass

from splunkupgrade.data.parsing import get_field
from splunkupgrade.utils.types import JsonObject


class ShcMemberInfoKeys:
    ACTIVE_HISTORICAL_SEARCH_COUNT = "active_historical_search_count"
    ACTIVE_REALTIME_SEARCH_COUNT = "active_realtime_search_count"


@dataclass
class ShcMemberInfo:
    active_historical_search_count: int
    active_realtime_search_count: int


def to_shc_member_info(json_member_info: JsonObject) -> ShcMemberInfo:
    historical_count = get_field(
        json_member_info, ShcMemberInfoKeys.ACTIVE_HISTORICAL_SEARCH_COUNT, int
    )
    rt_count = get_field(json_member_info, ShcMemberInfoKeys.ACTIVE_REALTIME_SEARCH_COUNT, int)
    return ShcMemberInfo(historical_count, rt_count)
