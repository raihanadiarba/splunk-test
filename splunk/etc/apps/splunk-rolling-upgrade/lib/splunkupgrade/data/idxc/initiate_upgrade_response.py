from dataclasses import dataclass

from splunkupgrade.data.parsing import get_field
from splunkupgrade.utils.types import JsonObject
from splunkupgrade.utils.constants import IndexerCluserInitiateUpgradeKeys


@dataclass
class InitiateUpgradeResponse:
    type: str
    text: str

    def is_ok(self):
        return self.type != "ERROR"


def to_initiate_upgrade_response(json_response: JsonObject) -> InitiateUpgradeResponse:
    return InitiateUpgradeResponse(
        get_field(json_response, IndexerCluserInitiateUpgradeKeys.TYPE, str),
        get_field(json_response, IndexerCluserInitiateUpgradeKeys.TEXT, str),
    )
