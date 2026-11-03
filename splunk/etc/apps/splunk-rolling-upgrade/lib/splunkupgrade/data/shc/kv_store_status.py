from enum import Enum

from splunkupgrade.data.data_parse_exception import DataParseException
from splunkupgrade.data.parsing import get_enum_field
from splunkupgrade.utils.constants import KvStoreStatusKeys
from splunkupgrade.utils.types import JsonObject
from splunkupgrade.utils.utils import does_path_exist


class KvStoreStatus(Enum):
    UNKNOWN = "unknown"
    DISABLED = "disabled"
    STARTING = "starting"
    READY = "ready"
    FAILED = "failed"
    SHUTTINGDOWN = "shuttingdown"


def to_kv_store_status(json_status: JsonObject) -> KvStoreStatus:
    if not does_path_exist(json_status, KvStoreStatusKeys.CURRENT, KvStoreStatusKeys.STATUS):
        raise DataParseException(
            f"Path '{KvStoreStatusKeys.CURRENT}.{KvStoreStatusKeys.STATUS}' does not exist kv status dict"
        )
    return get_enum_field(
        KvStoreStatus,
        json_status[KvStoreStatusKeys.CURRENT][KvStoreStatusKeys.STATUS],
        KvStoreStatus.UNKNOWN,
    )
