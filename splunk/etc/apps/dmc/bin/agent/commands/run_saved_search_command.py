"""
Execute saved searches
"""
import logging

from agent import ioc
from agent.common.helpers import to_bool
from agent.commands import DMCRestCommandBase, CommandResult, DelayCommandResult


class RunSavedSearchCommands(DMCRestCommandBase):
    """
    This command runs saved search and then polls till its done
    """
    MESSAGES = {"True": "Successfully executed saved search: %s",
                "False": "Failed executing saved search: %s"}

    def __init__(self):
        super(RunSavedSearchCommands, self).__init__()
        self._logger = logging.getLogger(self.__class__.__name__)
        self._splunk_host = ioc.components.splunk_host()
        self._configuration = ioc.components.configuration()
        self.retry_delay = self._configuration.get_int("run_saved_search_delay", default=2)
        self.max_retry = self._configuration.get_int("run_saved_search_max_retry", default=5)

    def execute_rest(self, command, service):
        """
        Fetch the service with the app specified and then run saved search
        """
        if not command.has_path("cache"):
            self.start_saved_search(command, service)
        return self.verify_saved_search(command, service)

    def start_saved_search(self, command, service):
        """Start saved search and save job in command's cache
        """
        payload = command.get_value("payload")
        params = payload.get("params", {})
        saved_search = payload["saved_search"]
        search = service.saved_searches[saved_search]
        job = search.dispatch(**params)
        self._logger.debug("Running saved search: %s", saved_search)
        command.set_value("cache", {
            "job_name": job.name,
            "retry": 0
        })

    def verify_saved_search(self, command, service):
        """Runs the saved search and waits till it is completed/failed
        before returning the command result
        """
        job = service.jobs[command.get_value(("cache", "job_name"))]
        job.refresh()
        if job.is_ready():
            if to_bool(job["isFailed"]):  # pylint: disable=no-else-return
                return self.construct_result(False, job["messages"], command.get_value(("payload", "saved_search")))
            elif to_bool(job["isDone"]):
                return self.construct_result(True, None, command.get_value(("payload", "saved_search")))

        cache = command.get_value("cache")
        cache["retry"] += 1
        if cache["retry"] == self.max_retry:
            return self.construct_result(False,
                                         "Job is not ready",
                                         command.get_value(("payload", "saved_search")))

        return DelayCommandResult(self.retry_delay)

    def construct_result(self, success, payload, saved_search):
        """Helper method to return result
        :param success: boolean indicating the command has failed/succeeded:
        :param payload: response payload:
        :param saved_search name of the saved search:
        :return CommandResult:
        """
        return CommandResult(completed=success,
                             failed=not success,
                             description=self.MESSAGES[str(success)] % saved_search,
                             payload=payload)
