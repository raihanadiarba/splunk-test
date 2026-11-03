"""
Commands controller
"""

import threading
import sys

from builtins import range  # pylint: disable=redefined-builtin
from agent import ioc, ControllerBase
from agent.commands import CommandResult

if sys.version_info >= (3, 0):
    import queue
else:
    import Queue as queue  # pylint: disable=import-error


# pylint: disable=too-many-instance-attributes
class CommandsController(ControllerBase):
    """
    Commands controller
    Excecute commands in background threads
    """

    def __init__(self, workerscount=20):
        self.__workerscount = workerscount
        super(CommandsController, self).__init__(events=("NewCommand",),
                                                 wait_timeout=10)
        self.__workers = []
        self.__workers_condition = threading.Condition()
        self._service = ioc.services.commands_service()
        self._event_aggregator = ioc.components.event_aggregator()
        self._event_aggregator.subscribe("NewCommand", self.notify)
        self.__queue = queue.Queue(maxsize=self.__workerscount)
        self._first_iteration = True

    def start(self):
        """Start commands controller
        """
        self._logger.debug("Starting %d workers", self.__workerscount)
        for i in range(0, self.__workerscount):
            thread_name = "CommandControllerWorker-" + str(i)
            thread = threading.Thread(name=thread_name,
                                      target=self.__background_worker)
            self.__workers.append(thread)
            thread.start()
        super(CommandsController, self).start()

    def stop(self):
        """Stop commands controller, override the logic of basecontroller
        """
        self._markterminated()
        self._logger.debug("Waiting workers...")
        self.notify()
        with self.__workers_condition:
            self.__workers_condition.notify_all()
        self._join_thread()

    def _background_iteration(self):
        """Iteration for background controller
        """
        if self._first_iteration:
            self.__fail_running_commands()
            self._first_iteration = False

        while True:
            command = self._service.get_next_command()

            if self.isterminated():
                return

            if not command:
                break

            self._service.start_command_execution(command)
            self.__queue.put(command)
            with self.__workers_condition:
                self.__workers_condition.notify(n=1)

    def __background_worker(self):
        """Background worker
        """
        while True:
            if self.isterminated():
                return

            self.__background_worker_iteration()

            if self.isterminated():
                return

            with self.__workers_condition:
                self.__workers_condition.wait()

    def __background_worker_iteration(self):
        """Background worker iteration
        """
        command = None
        try:
            command = self.__queue.get_nowait()
        except queue.Empty:
            pass

        if command:
            self._service.execute_command(command)

    def __fail_running_commands(self):
        """
        If process crashed we should on first call
        get all running commands and fail them as we do not know on what state
        the finished/failed.
        """
        running_commands = self._service.get_running_commands()
        if running_commands:
            self._logger.warning("Found %d already running commands. Going to fail them.", len(running_commands))
            for command in running_commands:
                self._service.report_progress(
                    command, CommandResult(failed=True, description="Cannot continue execution after restart."))
