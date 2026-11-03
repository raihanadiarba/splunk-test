"""
Command Base
"""

import abc
import six

from agent import ioc


@six.add_metaclass(abc.ABCMeta)
# pylint: disable=useless-object-inheritance, unnecessary-pass
class CommandResultBase(object):
    """Command result base class
    """
    pass


class CommandResult(CommandResultBase):
    """Hold information about command status
    """
    def __init__(self,
                 completed=False,
                 failed=False,
                 description="",
                 payload=None,
                 error_ex=None):
        self.completed = completed
        self.failed = failed
        self.description = description
        self.payload = payload
        self.error_ex = error_ex


class DelayCommandResult(CommandResultBase):
    """If you want to delay execution of this command.
    By default delays on one second
    """
    def __init__(self, delay_sec=1):
        self.delay = delay_sec


@six.add_metaclass(abc.ABCMeta)
class CommandBase(ioc.Component):
    """Command base class
    """

    @abc.abstractmethod
    def execute(self, command):
        """Execute command, return CommandResult
        """
        return CommandResult(failed=True,
                             description="Not implemented")
