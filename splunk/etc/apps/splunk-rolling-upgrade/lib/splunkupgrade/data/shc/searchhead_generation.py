from dataclasses import dataclass
from packaging.version import Version
from splunkupgrade.data.parsing import get_field, to_version
from splunkupgrade.utils.types import JsonObject
from splunkupgrade.utils.constants import SearchHeadGenerationKeys


@dataclass
class SearchHeadGeneration:
    cluster_manager_version: Version


def to_searchhead_generation(json_searchhead_generation: JsonObject) -> SearchHeadGeneration:
    return SearchHeadGeneration(
        to_version(
            get_field(
                json_searchhead_generation, SearchHeadGenerationKeys.CLUSTER_MANAGER_VERSION, str
            )
        )
    )
