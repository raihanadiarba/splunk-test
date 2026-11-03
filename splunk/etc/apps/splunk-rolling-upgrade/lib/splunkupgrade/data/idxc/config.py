import re
from dataclasses import dataclass
from typing import Optional
from splunkupgrade.utils.constants import IndexerClusterConfigKeys
from splunkupgrade.utils.types import JsonObject
from splunkupgrade.data.parsing import get_field, to_bool, get_optional_field, DataParseException


def to_site_factor(str_site_factor: str) -> int:
    regex = r"[ |{|,]total\s*:\s*(\d+)[ |,|}]"
    parsed = re.findall(regex, str_site_factor)
    error_str = (
        f"Site factor field is expected to contain value='total:<number>', "
        f"instead encountered='{str_site_factor}'"
    )
    if len(parsed) != 1:
        raise DataParseException(error_str)
    try:
        return int(parsed[0])
    except ValueError:
        raise DataParseException(error_str)


@dataclass
class Config:
    multisite: bool
    replication_factor: int
    search_factor: int
    total_site_replication_factor: Optional[int]
    total_site_search_factor: Optional[int]


def to_config(json_config: JsonObject) -> Config:
    site_replication_factor_str = get_optional_field(
        json_config, IndexerClusterConfigKeys.SITE_REPLICATION_FACTOR, str
    )
    site_search_factor_str = get_optional_field(
        json_config, IndexerClusterConfigKeys.SITE_SEARCH_FACTOR, str
    )
    return Config(
        to_bool(get_field(json_config, IndexerClusterConfigKeys.MULTISITE, str)),
        get_field(json_config, IndexerClusterConfigKeys.REPLICATION_FACTOR, int),
        get_field(json_config, IndexerClusterConfigKeys.SEARCH_FACTOR, int),
        to_site_factor(site_replication_factor_str) if site_replication_factor_str else None,
        to_site_factor(site_search_factor_str) if site_search_factor_str else None,
    )
