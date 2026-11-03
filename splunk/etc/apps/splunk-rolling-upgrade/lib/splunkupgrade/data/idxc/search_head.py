import logging
from dataclasses import dataclass
from packaging.version import Version, InvalidVersion
from typing import Optional
from splunkupgrade.data.parsing import get_field, get_optional_field
from splunkupgrade.utils.constants import SearchheadKeys
from splunkupgrade.utils.types import JsonObject
from typing import Optional


logger = logging.getLogger(__name__)


@dataclass
class SearchHead:
    label: str
    str_splunk_version: Optional[str]

    def get_parsed_version(self) -> Optional[Version]:
        if not self.str_splunk_version:
            logger.warning(f"Search head='{self.label}' does not have version field set")
            return None
        try:
            return Version(self.str_splunk_version)
        except InvalidVersion:
            logger.warning(
                f"Search head='{self.label}' has invalid version value='{self.str_splunk_version}'"
            )
            return None


def to_searchhead(searchhead_json: JsonObject) -> SearchHead:
    return SearchHead(
        get_field(searchhead_json, SearchheadKeys.LABEL, str),
        get_optional_field(searchhead_json, SearchheadKeys.SPLUNK_VERSION, str),
    )
