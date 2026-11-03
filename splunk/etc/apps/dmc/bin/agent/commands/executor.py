"""
Commands executor
"""

import time
import logging

from agent import ioc


# pylint: disable=too-few-public-methods, no-self-use
class Executor(ioc.Component):
    """Commands executor
    """
    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)

    def execute(self, command):
        """Base on the type specified in command
        find command implementation in ioc and execute it
        """
        commandtype = command.get_value("type")
        before = time.time()
        result = ioc.require_feature("commands:" + commandtype).execute(command)
        after = time.time()
        execution_time_sec = after - before
        # sync 30 seconds with timeout inside DMCRunner.h
        # If some command takes more than 30 seconds it means that on shutdown we
        # can lose DMC state and will not be properly shut down.
        if execution_time_sec >= 30:
            self._logger.warning("Command %s took more than 30 seconds (%d).", commandtype, execution_time_sec)
        else:
            self._logger.debug("Command %s took %d seconds.", commandtype, execution_time_sec)
        return result
