"""
Tasks service
"""

import logging
import traceback

from agent import ioc, wtransaction
from agent.models import JSONEntity
from agent import ServerException


class TasksService(ioc.Component):
    """Service to work with tasks
    """

    def __init__(self):
        self._repository = \
            ioc.repositories.tasks_repository()
        self._crepository = \
            ioc.repositories.commands_repository()
        self._workflowfactory = ioc.require_feature("workflowsfactory")
        self._repositoriesfactory = ioc.require_feature("repositoriesfactory")
        self._event_aggregator = ioc.components.event_aggregator()
        self._commands_service = ioc.services.commands_service()
        self._user_context = ioc.components.user_context()
        self._logger = logging.getLogger(self.__class__.__name__)

    def get(self, taskid):
        """Get task by id
        """
        return self._repository.get(taskid)

    def delete(self, taskid):
        """Delete task by id
        """
        return self._repository.delete(taskid)

    # pylint: disable=too-many-arguments
    def get_all(self,
                query=None,
                count=None,
                offset=None,
                sort_key=None,
                reverse=False,
                fields=None):
        """Get list of tasks
        """
        if not sort_key:
            sort_key = "createdAt"
        result = self._repository.get_all(query=query,
                                          limit=count,
                                          skip=offset,
                                          fields=fields,
                                          sort=((sort_key, -1 if reverse else 1),))
        return result
        # pylint: enable=too-many-arguments

    @wtransaction
    def new_task(self, workflow, **objects):
        """Create new task by specified workflow
        Specify in objects references
        """
        workflow = self._workflowfactory[workflow](task=None, **objects)
        task = self._repository.insert(workflow.task)
        workflow.task.dirty = False
        self.__persist_workflow(workflow)
        self._event_aggregator.raise_event("NewTask")
        return task

    @wtransaction
    def start_task(self, task):
        """Start task
        """
        with self._user_context.scope(task.get_value("userContext")):
            workflow = self.__construct_workflow(task)
            try:
                workflow.start()
            except ServerException as exp:
                self._logger.error("Task failed on start: %s", traceback.format_exc())
                task.set_value("state", "failed")
                task.add_error(str(exp))
                self._repository.update(task)
            else:
                self.__persist_workflow(workflow)

    @wtransaction
    def handle_progress(self, progress):
        """Handle progress
        Method load task and command, initialize workflow
        and calls handle_progress in workflow.
        If any changes were made in workflow - they will be persistet
        """
        self.__handle_progress_internal(progress)
        self._commands_service.progress_handled(progress)

    def execute_task_linear(self, taskid, progress_reporter=None):
        """Execute task in current thread

        Note:
            - background threads for handling tasks should not be running
            - this method depends on stdin
        """
        assert progress_reporter is None or hasattr(progress_reporter, '__call__')
        # First start the task
        task = self._repository.get(taskid)
        self.start_task(task)

        while True:
            task = self._repository.get(taskid)
            if task.state == "completed" or task.state == "failed":
                break

            command = self._commands_service.get_next_command(taskid=taskid, interactive=None)
            if not command:
                task.add_error("No commands for task")
                task.set_value("state", "failed")
                self._repository.update(task)
                continue

            if command.get_value("state") == "interactive":
                self._commands_service.execute_interactive_command(command)
            else:
                self._commands_service.execute_command(command)
            progress = self._commands_service.get_unhandled_progress_for_command(command.commandid)
            for prog in progress:
                self.handle_progress(prog)
                if progress_reporter is not None:
                    progress_reporter(prog)

        return task

    def get_new_tasks_for_controller(self):
        """Get first 10 created task with state equal new or running

        We use this method for controller. We are limited only to 10 tasks,
        just to be sure that if we will have a lot of new tasks we will
        not load them all in once
        """

        tasks = self._repository.get_all(query={"state": "new"},
                                         limit=10,
                                         sort=(("createdAt", 1),))

        return tasks

    def __handle_progress_internal(self, progress):
        """Handle progress
        """
        taskid = progress.get_value("taskId")
        task = self._repository.get(taskid)

        if task.state != "running":
            self._logger.warning("Task %s is not running, has state %s. "
                                 "Progress %s cannot be handled", task.taskid, task.state, progress.progressid)
            return

        commandid = progress.get_value("commandId")
        command = self._crepository.get(commandid)

        with self._user_context.scope(task.get_value("userContext")):
            workflow = self.__construct_workflow(task)
            try:
                if progress.get_value("failed", default=False):
                    task.add_error(progress.get_value("description"))
                    detailed_error = progress.get_value(("payload", "error"), default="")
                    if detailed_error:
                        task.add_typed_error("error", detailed_error)
                workflow.handle_progress(command, progress)
            except ServerException as exp:
                self._logger.error("Task failed while handling progress: %s", traceback.format_exc())
                task.set_value("state", "failed")
                task.add_error(str(exp))
                self._repository.update(task)
            else:
                self.__persist_workflow(workflow)

    def __construct_workflow(self, task):
        """Contruct workflow from task
        Load all references
        """
        references = task.get_value("references")
        objects = {}
        for ref in references:
            reference = ref["reference"]
            objid = ref["id"]
            collection = ref["collection"]
            repository = ioc.require_feature(
                self._repositoriesfactory[collection])
            objects[reference] = repository.get(objid)
        return self._workflowfactory[task.workflow](task=task, **objects)

    def __persist_workflow(self, workflow):
        """Persist workflow
        If task or any references are dirty or
        new commands were added
        """
        if workflow.task.dirty:
            self._repository.update(workflow.task)
        for obj in workflow.objects.values():
            if isinstance(obj, JSONEntity) and obj.dirty:
                repository = ioc.require_feature(
                    self._repositoriesfactory[obj.COLLECTION])
                repository.update(obj)
        for obj in workflow.iter_changed_entities():
            repository = ioc.require_feature(
                self._repositoriesfactory[obj.COLLECTION])
            repository.update(obj)
        if len(workflow.commands) > 0:
            for command in workflow.commands:
                self._crepository.insert(command)
            self._event_aggregator.raise_event("NewCommand")
