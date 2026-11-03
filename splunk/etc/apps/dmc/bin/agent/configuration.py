"""Allow to read configurations for DMC
from config file
"""


import os
from splunk.clilib import cli_common
from agent import ioc
from agent.common.helpers import to_bool

CONFIG_FILE_NAME = 'dmc_agent'
CONFIG_FILE_SECTION = 'dmc'
ENCRYPTED_PROPERTIES = ['app_inspect_password']
# this env variable always present
SPLUNK_HOME = os.path.normpath(os.environ["SPLUNK_HOME"])


class Configuration(ioc.Component):
    """Configuration class implementation
    """

    def __init__(self, app_path=''):
        if app_path == '':
            self.app_path = os.path.join(SPLUNK_HOME, "etc", "apps", "dmc")
        else:
            # this is mostly for unit test - so we can point on the test file we're reading from
            self.app_path = os.path.join(os.path.abspath(os.getcwd()), app_path)
        self.config = cli_common.getAppConf(CONFIG_FILE_NAME, "dmc", False, self.app_path)

    def get_int(self, key, default=0):
        """Get configuration value as number
        """
        val = self.get_string(key)
        if val is None:
            return default
        try:
            return int(val)
        except ValueError:
            return default

    def get_boolean(self, key, default=False):
        """Get configuration value as boolean
        """
        val = self.get_string(key)
        if val is None:
            return default
        try:
            val = to_bool(val)
            if isinstance(val, bool):
                return val
            return default
        except ValueError:
            return default

    def get_string(self, key, default=None, section=CONFIG_FILE_SECTION):
        """Get configuration value as string
        """
        assert self
        if key in self.config[section]:
            if key in ENCRYPTED_PROPERTIES:
                return cli_common.decrypt(self.config[section][key])
            return self.config[section][key]
        return default
