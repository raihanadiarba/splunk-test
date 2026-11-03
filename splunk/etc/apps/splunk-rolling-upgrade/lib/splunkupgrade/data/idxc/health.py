from dataclasses import dataclass

from splunkupgrade.data.parsing import get_field, to_bool
from splunkupgrade.utils.constants import IndexerClusterHealthKeys
from splunkupgrade.utils.types import JsonObject


@dataclass
class Health:
    all_data_is_searchable: bool
    all_peers_are_up: bool
    cm_version_is_compatible: bool
    multisite: bool
    no_fixup_tasks_in_progress: bool
    pre_flight_check: bool
    replication_factor_met: bool
    search_factor_met: bool
    site_replication_factor_met: bool
    site_search_factor_met: bool


def to_health(health_json: JsonObject) -> Health:
    return Health(
        to_bool(get_field(health_json, IndexerClusterHealthKeys.ALL_DATA_IS_SEARCHABLE, str)),
        to_bool(get_field(health_json, IndexerClusterHealthKeys.ALL_PEERS_ARE_UP, str)),
        to_bool(get_field(health_json, IndexerClusterHealthKeys.CM_VERSION_IS_COMPATIBLE, str)),
        to_bool(get_field(health_json, IndexerClusterHealthKeys.MULTISITE, str)),
        to_bool(get_field(health_json, IndexerClusterHealthKeys.NO_FIXUP_TASKS, str)),
        to_bool(get_field(health_json, IndexerClusterHealthKeys.PRE_FLIGHT_CHECK, str)),
        to_bool(get_field(health_json, IndexerClusterHealthKeys.REPLICATION_FACTOR_MET, str)),
        to_bool(get_field(health_json, IndexerClusterHealthKeys.SEARCH_FACTOR_MET, str)),
        to_bool(get_field(health_json, IndexerClusterHealthKeys.SITE_REPLICATION_FACTOR_MET, str)),
        to_bool(get_field(health_json, IndexerClusterHealthKeys.SITE_SEARCH_FACTOR_MET, str)),
    )
