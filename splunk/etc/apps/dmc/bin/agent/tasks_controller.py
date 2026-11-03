"""
Tasks controller
"""

import logging
import traceback

from agent import ioc, ControllerBase


class TasksController(ControllerBase):
    """Tasks controller
    """

    def __init__(self):
        super(TasksController, self).__init__(events=("NewTask",
                                                      "NewProgress"),
                                              wait_timeout=10)

        self._logger = logging.getLogger(self.__class__.__name__)
        self._service = \
            ioc.services.tasks_service()
        self._cservice = \
            ioc.services.commands_service()

    def _background_iteration(self):
        """Background controller iteration
        """
        while True:
            self._logger.debug("Entering infinite loop")
            tasks = self._service.get_new_tasks_for_controller()
            for task in tasks:
                self._logger.debug("Found new task %s", task.taskid)

                if self.isterminated():
                    return

                self._service.start_task(task)

            progress = self._cservice.get_unhandled_progress()
            for prog in progress:
                self._logger.debug("Found new progress %s",
                                   prog.progressid)

                if self.isterminated():
                    return

                try:
                    self._service.handle_progress(progress=prog)
                # pylint: disable=broad-except
                except Exception:
                    # pylint: enable=broad-except
                    self._logger.error("Progress handling failed: %s", traceback.format_exc())

            if self.isterminated():
                return

            if not tasks and not progress:
                self._logger.debug(
                    "No tasks, no progress. Exiting infinite loop")
                break
