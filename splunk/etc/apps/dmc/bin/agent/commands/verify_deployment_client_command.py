"""
Module Verify Deployment Client Command
"""

import logging
import time

from agent import ioc
from agent.commands import CommandBase, CommandResult


# pylint: disable=too-few-public-methods
# pylint: disable=broad-except
class VerifyDeploymentClientCommand(CommandBase):
    """Verify deployment client command
    """

    def __init__(self, max_iterations=60, sleep_time=10):
        self._logger = logging.getLogger(self.__class__.__name__)
        self._max_iterations = max_iterations
        self._sleep_time = sleep_time
        self._instances_service = ioc.services.instances_service()

    def execute(self, command):
        """Execute verify deployment client command
        """
        instanceid = command.get_value(("payload", "instanceId"))
        iteration = 0
        while iteration < self._max_iterations:
            instance = self._instances_service.get(instanceid)
            if instance.has_path("hostname"):
                return CommandResult(True,
                                     False,
                                     "Found registered client",
                                     None)
            iteration += 1
            time.sleep(self._sleep_time)

        return CommandResult(False,
                             True,
                             "Could not discover registered client in Deployment Server",
                             None)
