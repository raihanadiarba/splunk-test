"""
    Tasks Endpoint
"""
import logging

import bottle
from bottle import HTTPError

import agent
from agent import ioc, InvalidUserInputException
from agent.restapi import eai_helpers
from agent.restapi import helpers
from agent.models.json_entity import View


class TasksEndpoint(ioc.Component):
    """
        Task Endpoints
    """

    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)
        self._task_service = ioc.services.tasks_service()
        self._progress_service = ioc.services.progress_service()
        self._commands_service = ioc.services.commands_service()
        bottle.get("/tasks/<task_id>")(self.get_task_by_id)
        bottle.get("/tasks/<task_id>/progress")(self.get_task_progress)
        bottle.get("/tasks/<task_id>/confirmation")(self.get_confirmation)
        bottle.post("/tasks/<task_id>/confirmation/<command_id>/result")(self.post_confirmation)

    @eai_helpers.response_formatted
    @eai_helpers.make_name('taskId')
    def get_task_by_id(self, task_id):
        """
        return Task data by id
        :param task_id:
        :return Return task object
        """
        try:
            data = self._task_service.get(task_id).json(View.RestView)
            return eai_helpers.eai_result([data], 1)
        except agent.NotFoundException as exp:
            raise HTTPError(404, str(exp))

    @eai_helpers.filtered
    @eai_helpers.response_formatted
    @eai_helpers.make_name('taskId')
    def get_task_progress(self, task_id, req_query):
        """
        return task progress by id
        :return: list of task progress
        """
        # Todo implement pagination and sorting if UI requires
        try:
            results = \
                self._progress_service.get_progress_for_task(task_id, req_query)
            data = list([x.json(View.RestView) for x in results])

            # TODO if pagination is required for this endpoint we should
            # use get_all_with_total
            return eai_helpers.eai_result(data, len(data))
        except agent.NotFoundException as exp:
            raise HTTPError(404, str(exp))

    @eai_helpers.response_formatted
    @eai_helpers.make_name("commandId")
    def get_confirmation(self, task_id):
        """
        Get latest command with confirmation (interactive mode)
        """
        results = []
        command = self._commands_service.get_next_command(taskid=task_id, interactive=True)
        if command:
            results.append(command.json(View.RestView))
        return eai_helpers.eai_result(results, len(results))

    @helpers.json_validate_request({
        "type": "object",
        "properties": {
            "choice": {"type": "string", "maxLength": 1},
            "input": {"type": "string"},
            "canceled": {"type": "boolean"}
        },
        "additionalProperties": False
    })
    @eai_helpers.response_formatted
    @eai_helpers.make_name("progressId")
    def post_confirmation(self, task_id, command_id):
        """
        Update confirmation command
        """
        task = self._task_service.get(task_id)
        command = self._commands_service.get(command_id)
        if task.get_value("taskId") != command.get_value("taskId"):
            raise HTTPError(404, "Failed to find a command %s in task %s" % (command_id, task_id))
        progress = None
        if bottle.request.json.get("canceled", False):  # pylint: disable=no-member
            progress = self._commands_service.post_interactive_answer(
                command, canceled=True, answer_payload=None)
        else:
            try:
                progress = self._commands_service.post_interactive_answer(
                    command, canceled=False, answer_payload=bottle.request.json)
            except InvalidUserInputException as exp:
                raise bottle.HTTPError(400, str(exp))
        return progress.json(View.RestView)
