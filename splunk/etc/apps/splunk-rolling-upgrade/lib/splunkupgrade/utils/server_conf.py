from splunkupgrade.data.parsing import (
    get_field_with_default,
    get_field,
    DataParseException,
)
from splunkupgrade.utils.types import JsonObject
from dataclasses import dataclass
from splunkupgrade.utils.splunk_sdk_wrapper import get_app_conf
from splunkupgrade.utils.constants import ClusteringConfStanza, GeneralConstants
from splunkupgrade.utils.exceptions import ConfigurationError
from typing import Optional
from enum import Enum


class ManagerSwitchoverMode(Enum):
    DISABLED = "disabled"
    AUTO = "auto"
    MANUAL = "manual"


@dataclass
class CMRedundancyConfig:
    manager_switchover_mode: str

    @staticmethod
    def from_dict(stanza_config: dict):
        manager_switchover_mode = get_field_with_default(
            stanza_config,
            ClusteringConfStanza.MANAGER_SWITCHOVER_MODE,
            str,
            ManagerSwitchoverMode.DISABLED.value,
        )
        return CMRedundancyConfig(manager_switchover_mode)


@dataclass
class ServerConfig:
    def __init__(self, config: Optional[JsonObject] = None):
        try:
            json_config = self.get_config() if config is None else config
            self.cm_redundancy_config = self._get_cm_redundancy_config(json_config)
        except DataParseException as e:
            raise ConfigurationError(str(e))

    @staticmethod
    def _get_cm_redundancy_config(config: JsonObject) -> CMRedundancyConfig:
        stanza_config = get_field(config, ClusteringConfStanza.STANZA_NAME, dict)
        return CMRedundancyConfig.from_dict(stanza_config)

    @staticmethod
    def get_config() -> dict:
        return get_app_conf(GeneralConstants.SERVER_CONF)
