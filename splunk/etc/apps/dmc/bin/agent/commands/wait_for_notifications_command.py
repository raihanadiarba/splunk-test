"""
Wait for existing notification commands to complete
"""

import logging

from agent import ioc
from agent.models import Command
from agent.commands import CommandBase, CommandResult, DelayCommandResult


class WaitForNotificationsCommand(CommandBase):
    """ Wait for existing notification commands to complete
    """

    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)
        self._commands_service = ioc.services.commands_service()

    def execute(self, command):
        """ Wait for existing notification commands to complete
        """
        name = command.get_value(("payload", "name"))
        target = command.get_value(("payload", "target"))

        incomplete_commands = self._commands_service.get_incomplete_commands("notify")
        for _command in incomplete_commands:
            cmd_name = _command.get_value(("payload", "params", "name"))
            cmd_target = _command.get_value(("payload", "target"))
            if cmd_name == name and cmd_target["mgmtUri"] == target["mgmtUri"]:
                # We wait for existing notify commands to complete in order to avoid newer messages
                # from being posted while older messages are delayed because of retry. This can happen
                # when a SH is being restarted causing the older message to delay before retry.
                self._logger.info(
                    "Found incomplete notify command for target %s... will wait until it completes", target["mgmtUri"])
                return DelayCommandResult(delay_sec=Command.RETRY_INTERVAL_DEFAULT)

        # All notify commands are complete
        return CommandResult(
            completed=True,
            failed=False,
            description="All notify commands are complete, done waiting",
            payload=None
        )
