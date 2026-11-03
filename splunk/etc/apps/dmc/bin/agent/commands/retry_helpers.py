"""
Helpers for retrying operations within a command
"""

import logging

from agent.commands import CommandResult
from agent.commands import DelayCommandResult

_logger = logging.getLogger(__name__)


def _run_step(command, step_name, step_func, retry_delay=0, max_retry=0):
    """
    Perform a step in a command with retry if specified.
    If max_retry is 0, no retry is performed.
    Returns None if the step is successful, otherwise a failed CommandResult or DelayCommandResult
    """
    retries = command.get_value(step_name, 0)
    if retries == -1:
        return None

    if step_func():
        retries = -1
    else:
        retries += 1

    command_type = command.get_value("type")
    if retries > max_retry:
        if max_retry == 0:
            msg = "Step %s of command %s is not successful." % (step_name, command_type)
        else:
            msg = "Step %s of command %s is not successful after %d retries." % (step_name, command_type, retries)
        return CommandResult(failed=True, description=msg)

    command.set_value(step_name, retries)

    if retries > -1:
        msg = "Step %s of command %s is in progress, retries=%d" % (step_name, command_type, retries)
        _logger.info(msg)
        return DelayCommandResult(retry_delay)

    assert retries == -1
    return None


class StepHandler(object):  # pylint: disable=useless-object-inheritance
    """
    Handle steps in a command. The command will be retried as specified if a step fails.
    """
    def __init__(self, command):
        self.command = command
        self.steps = []

    def step(self, step_name, step_func, retry_delay=0, max_retry=0):
        """
        Register a step
        """
        self.steps.append(lambda: _run_step(self.command, step_name, step_func, retry_delay, max_retry))

    def execute(self):
        """
        Execute all registered steps
        """
        for step in self.steps:
            command_result = step()
            if command_result is not None:
                return command_result

        return CommandResult(
            completed=True,
            description="Successfully completed %s" % self.command.get_value("type"))
