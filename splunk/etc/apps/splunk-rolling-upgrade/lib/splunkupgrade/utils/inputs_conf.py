from splunkupgrade.data.parsing import get_field, DataParseException
from splunkupgrade.utils.splunk_sdk_wrapper import get_app_conf
from splunkupgrade.utils.constants import RollingUpgradeInputsConfStanza, GeneralConstants
from splunkupgrade.utils.exceptions import ConfigurationError, UndefinedEnvVariableException
from splunkupgrade.utils.types import JsonObject
from splunkupgrade.utils.utils import substitute_splunk_home_in_path
from dataclasses import dataclass
from typing import Optional


@dataclass
class RollingUpgradeInputsConfig:
    pass_auth: str

    @staticmethod
    def from_dict(config_stanza: dict) -> "RollingUpgradeInputsConfig":
        pass_auth = get_field(config_stanza, RollingUpgradeInputsConfStanza.PASS_AUTH, str)
        if not pass_auth or pass_auth.isspace():
            raise ConfigurationError("'passAuth' value must be non-empty")
        return RollingUpgradeInputsConfig(pass_auth)


@dataclass
class InputsConfig:
    def __init__(self, config: Optional[JsonObject] = None):
        try:
            json_config = self.get_config() if config is None else config
            self.rolling_upgrade_inputs_conf = InputsConfig._get_rolling_upgrade_inputs_config(
                json_config
            )
        except (UndefinedEnvVariableException, DataParseException) as e:
            raise ConfigurationError(str(e))

    @staticmethod
    def get_config() -> dict:
        return get_app_conf(GeneralConstants.INPUTS_CONF)

    @staticmethod
    def _get_rolling_upgrade_inputs_config(config: JsonObject) -> RollingUpgradeInputsConfig:
        stanza_config = get_field(
            config, substitute_splunk_home_in_path(RollingUpgradeInputsConfStanza.STANZA_NAME), dict
        )
        return RollingUpgradeInputsConfig.from_dict(stanza_config)
