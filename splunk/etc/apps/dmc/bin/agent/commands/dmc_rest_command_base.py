"""
DMC rest command base. Used to execute rest commands on the dmc
"""

import abc
import time

from agent.commands import RestCommandBase


class DMCRestCommandBase(RestCommandBase):
    """Base class to execute base commmand on the DMC
    """

    def execute(self, command):
        """Create the service and call the abstract method that will be
        implemented by child classes
        """
        owner = None
        if command.has_path(("target", "owner")):
            owner = command.get_value(("target", "owner"))
        app = None
        if command.has_path(("target", "app")):
            app = command.get_value(("target", "app"))
        service = self._splunk_host.get_service(owner=owner, app=app)
        return self.execute_rest(command, service)

    @abc.abstractmethod
    def execute_rest(self, command, service):
        """To be implemented by child classes
        """
        pass  # pylint: disable=unnecessary-pass

    @staticmethod
    def wait_for_rest_execution_to_finish(stop_event, rest_call_info, logger):
        """
        Method responsible for logging information about ongoing rest call, while waiting for rest execution to finish

        @param stop_event: event used to stop this method from logging after the rest execution is finished
        @param rest_call_info: string containing additional information about rest call we are waiting to finish
        @param logger: logger to which the ongoing rest call info will be logged
        """
        while not stop_event.is_set():
            logger.info("Wait for rest call to finish: %s" % rest_call_info)
            time.sleep(10)
