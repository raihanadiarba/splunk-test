"""
Service for inputs configuration
"""

from agent.services.configuration_entry_service import ConfigurationEntryService
from agent.models import \
    ConfigurationEntryHttp, \
    ConfigurationEntryFilesMonitor, \
    ConfigurationEntryTcp, \
    ConfigurationEntryUdp, \
    ConfigurationEntryPerfmon, \
    ConfigurationEntryWinEventLog, \
    ConfigurationEntryScript


class InputsConfigurationService(ConfigurationEntryService):
    """Inputs configuration service
    """

    _GROUP = "inputs"

    def __init__(self):
        super(InputsConfigurationService, self).__init__([
            ConfigurationEntryFilesMonitor,
            ConfigurationEntryHttp,
            ConfigurationEntryTcp,
            ConfigurationEntryUdp,
            ConfigurationEntryPerfmon,
            ConfigurationEntryWinEventLog,
            ConfigurationEntryScript
        ])
