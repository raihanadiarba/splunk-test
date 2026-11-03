"""Allow to read Stack information for DMC
from data archive config file
"""

import os
import logging
from splunk.conf_util import ConfigMap, ConfigMapError
from agent import ioc

DATA_ARCHIVE_CONF_FILE = 'data_archive.conf'
# this env variable always present
SPLUNK_HOME = os.path.normpath(os.environ["SPLUNK_HOME"])


class Stack(ioc.Component):  # pylint: disable=too-few-public-methods
    """Stack class implementation
    """

    def __init__(self, path=''):
        self._logger = logging.getLogger(self.__class__.__name__)
        if path == '':
            self.data_archive_path = os.path.join(SPLUNK_HOME, "etc", "system", "local")
        else:
            # this is mostly for unit test - so we can point on the test file we're reading from
            self.data_archive_path = os.path.join(os.path.abspath(os.getcwd()), path)

    def get_stack_id(self, default="localhost"):
        """ Fetches the stack id
        """

        data_archive_conf_path = os.path.join(self.data_archive_path, DATA_ARCHIVE_CONF_FILE)
        try:
            return ConfigMap(data_archive_conf_path)['buckets']['prefix']
        except ConfigMapError as exc:
            self._logger.warning("Cannot fetch stack id from missing file: %s. Returning default: "
                                 "%s; Ignoring exception: %s", data_archive_conf_path, default, exc)
            return default
