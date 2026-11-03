"""
Workflow base
"""
# pylint: disable=unnecessary-pass, no-else-raise, no-else-break

import logging
import copy
import traceback
import inspect

from agent import ioc, ServerException, NotFoundException
from agent.ioc_types import TypedFeature
from agent.models import Command, Task, JSONEntity
from agent.common.topology_helpers import topology_role_name
from agent.common.helpers import generate_guid
from agent.common.json_schema import validate_schema


class WorkflowStageBase(object):  # pylint: disable=useless-object-inheritance
    """Workflow stage base
    """
    TYPE = None
    DESCRIPTION = None

    def __init__(self, workflow, stage=None):
        assert self.TYPE
        assert self.DESCRIPTION

        self._logger = logging.getLogger(self.__class__.__name__)
        self._workflow = workflow
        if not stage:
            stage = self.__new_stage()
        self._stage = stage

    def handle_start(self):
        """Handle stage start
        """
        self._stage["state"] = "running"
        self._workflow.task.dirty = True

    def handle_progress(self, command, progress):
        """Handle stage progress
        """
        self._handle_progress(command, progress)
        if command.get_value("state") == "completed":
            self._handle_completed(command, progress)
        elif command.get_value("state") == "failed":
            self._handle_failed(command, progress)

    @property
    def stage(self):
        """Get stage
        """
        return self._stage

    @property
    def is_new(self):
        """Check if stage has new state
        """
        return self._stage["state"] == "new"

    @property
    def is_running(self):
        """Check if stage has running state
        """
        return self._stage["state"] == "running"

    @property
    def is_completed(self):
        """Check if stage has completed state
        """
        return self._stage["state"] == "completed"

    @property
    def is_failed(self):
        """Check if stage has failed state
        """
        return self._stage["state"] == "failed"

    def mark_completed(self):
        """Set stage set to completed
        """
        self._stage["state"] = "completed"

    def __new_stage(self):
        """When need to create new stage in task
        """
        stage = {
            "stageId": generate_guid(),
            "type": self.TYPE,
            "state": "new",
            "description": self.DESCRIPTION
        }
        self._workflow.task.get_value("stages").append(stage)
        self._workflow.task.dirty = True
        self._new_stage(stage)
        return stage

    def _handle_progress(self, command, progress):
        """Method to override"""
        self._handle_using_decorator("_handle_progress_", command, progress)

    def _handle_completed(self, command, progress):
        """Method to override"""
        self._handle_using_decorator("_handle_completed_", command, progress)

    def _handle_failed(self, command, progress):
        """
        Base impplementation of the handle failed .This method
        marks the stage as failed and sets the task as dirty.
        """
        self._handle_using_decorator("_handle_failed_", command, progress)
        self._stage["state"] = "failed"
        self._workflow.task.dirty = True

    def _new_stage(self, stage):
        """Method to override"""
        pass

    def _set_command_retry(self, command):
        """
        Set command retry parameters
        """
        command.set_value("retryLimit", self._workflow.command_retry_limit)
        command.set_value("retryInterval", self._workflow.command_retry_interval)

    def _create_command_helper(self, commandtype, payload=None, target=None):
        """
        Helper method to create new commands
        """
        assert commandtype

        command = Command()

        if isinstance(commandtype, TypedFeature):

            feature_type = commandtype.type
            commandtype = feature_type.__name__
            feature_key = "commands:" + commandtype

            features = ioc.features()
            if not features.has_feature(feature_key):
                ioc.features().Provide(feature_key, feature_type, singleton=True)

        command.set_value("type", commandtype)
        command.set_value("payload", payload)
        command.set_value("taskId", self._workflow.task.taskid)
        command.set_value("stageId", self._stage["stageId"])
        command.set_value("target", target)
        self._set_command_retry(command)
        return command

    def _add_question(self, question_type, question, choices, data=None):
        """
        Create command with question and append it to commands
        """
        validate_schema(choices, {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "key": {"type": "string", "maxLength": 1, "minLength": 1},
                    "description": {"type": "string"},
                    "input": {"type": "string", "enum": ["password", "text"]}
                },
                "required": ["key", "description"],
                "additionalProperties": False
            }
        })
        command = Command({
            "type": "confirm",
            "state": "interactive",
            "taskId": self._workflow.task.taskid,
            "stageId": self._stage["stageId"],
            "payload": {
                "question_type": question_type,
                "question": question,
                "choices": choices,
                "data": data
            }})
        self._workflow.commands.append(command)

    def _handle_using_decorator(self, prefix, command, progress):
        """
        You can simple defined all your methods like

        _handle_completed_{command_type}(self, command, progress)
        _handle_failed_{command_type}(self, command, progress)
        _handle_progress_{command_type}(self, command, progress)

        They will be called automatically
        """
        if command.has_path("type"):
            command_type = command.get_value("type")
            expected_name = prefix + command_type
            if command_type == "confirm":
                expected_name += "_" + command.get_value(("payload", "question_type"))
            members = inspect.getmembers(self, predicate=inspect.ismethod)
            for (name, member) in members:
                if name == expected_name:
                    member(command, progress)
                    return

    @classmethod
    def should_create(cls, workflow):
        """Check if stage needs to be created
        """
        assert workflow
        return True


class OneCommandWorkflowStageBase(WorkflowStageBase):
    """Workflow stage, which generates only one command"""

    COMMAND = None

    def handle_start(self):
        command = self._new_command()
        if command:
            self._workflow.commands.append(command)
        super(OneCommandWorkflowStageBase, self).handle_start()

    def _handle_completed(self, command, progress):
        self._stage["state"] = "completed"
        self._workflow.task.dirty = True

    def _handle_failed(self, command, progress):
        self._stage["state"] = "failed"
        self._workflow.task.dirty = True

    def _new_command(self):
        """New command
        """
        assert self.COMMAND
        command = Command()
        command.set_value("type", self.COMMAND)
        command.set_value("taskId", self._workflow.task.taskid)
        command.set_value("stageId", self._stage["stageId"])
        if "payload" in self._stage:
            command.set_value("payload",
                              copy.deepcopy(self._stage["payload"]))
        self._set_command_retry(command)
        return command


class WorkflowBase(ioc.Component):
    """Workflow base
    """

    _WORKFLOW = "unknown"
    _TASK_TYPE = Task
    _STAGES = []

    def __init__(self, task=None, **kwargs):
        """Initialize Workflow with existing task
        or create new one
        """
        assert self._TASK_TYPE

        self.command_retry_limit = Command.RETRY_LIMIT_DEFAULT
        self.command_retry_interval = Command.RETRY_INTERVAL_DEFAULT

        self._logger = logging.getLogger(self.__class__.__name__)
        self._objects = dict(kwargs)
        self._commands = []
        self._entities = {}

        if not task:
            self._logger.debug("Creating new task")
            self._task = self._new_task()
            self._stages = list(self._new_stages())
        else:
            self._logger.debug("Using existing task")
            self._stages = list(self._init_stages(task))
            self._task = task

    @property
    def task(self):
        """Get task
        """
        return self._task

    @property
    def objects(self):
        """Get referenced objects
        """
        return self._objects

    @property
    def commands(self):
        """Get created commands
        """
        return self._commands

    @property
    def stages(self):
        """Get created stages
        """
        return self._stages

    def iter_changed_entities(self):
        """Iterate thought all loaded entities
        and yeild return then one which are dirty
        """
        for entities in self._entities.values():
            for entity in entities.values():
                if entity.dirty:
                    yield entity

    def start(self):
        """Start workflow
        """
        if self.task.state != "new":
            raise ServerException(fmt="Cannot start task %s, it has state %s" % (self.task.taskid, self.task.state))
        self.task.set_value("state", "running")
        self._handle_start()
        self._iterate_stages()

    def handle_progress(self, command, progress):
        """Handle progress
        """
        rstage = next(s for s in self._stages if s.is_running)
        assert rstage
        assert rstage.stage["stageId"] == command.get_value("stageId")

        try:
            rstage.handle_progress(command, progress)
        except ServerException as exp:
            self._logger.debug("Stage failed to handle progress, failing task. %s", traceback.format_exc())
            rstage.stage["state"] = "failed"
            self.task.add_error(str(exp))

        self._iterate_stages()

    def _iterate_stages(self):
        """
        Iterate throught stages and if:
            - if completed - just count and continue
            - stage is new execute handle_start action and verify state
            - in other cases - just verify state and break
        """
        workflow_failed = False

        num_of_completed = 0

        for stage in self._stages:

            if stage.is_completed:
                num_of_completed += 1
                continue

            self.flush_cache()

            is_new = stage.is_new
            if is_new:
                try:
                    stage.handle_start()
                except ServerException as exp:
                    self._logger.debug("Stage failed to start: %s", traceback.format_exc())
                    stage.stage["state"] = "failed"
                    self.task.add_error(str(exp))

            if stage.is_failed:
                self._logger.debug("Stage %s failed, failing task", stage.stage["stageId"])
                workflow_failed = True
                break
            elif stage.is_running:
                if not self.commands and is_new:
                    self._logger.error("Stage %s does not have any commands", stage.stage["stageId"])
                    stage.stage["state"] = "failed"
                    workflow_failed = True
                    break
                else:
                    self._logger.debug("Stage %s is running", stage.stage["stageId"])
                break
            elif stage.is_completed:
                num_of_completed += 1

        if workflow_failed:
            self._handle_failed()
            self.task.set_value("state", "failed")
        elif num_of_completed == len(self._stages):
            self._handle_completed()
            self._logger.debug("No more stages, workflow is completed")
            self.task.set_value("state", "completed")

    def _handle_start(self):
        """Method to override
        """
        pass

    def _handle_completed(self):
        """Method to override
        """
        pass

    def _handle_failed(self):
        """Method to override
        """
        pass

    def _new_task(self):
        """New task
        """
        task = self._TASK_TYPE()
        task.set_value("workflow", self._WORKFLOW)
        task.set_value("stages", [])
        task.set_value("references",
                       list({"reference": k,
                             "id": v.objid,
                             "collection": v.COLLECTION}
                            for k, v in self.objects.items()
                            if isinstance(v, JSONEntity)))
        user_context = ioc.components.user_context()
        task.set_value("userContext", user_context.context if user_context.has_context else None)
        return task

    def _new_stages(self):
        """New stages
        """
        for stage in self._STAGES:
            if stage.should_create(self):
                yield stage(self)

    def _init_stages(self, task):
        """Init stages
        """
        for stage in task.get_value("stages"):
            stagetype = None
            for stype in self._STAGES:
                if stype.TYPE == stage["type"]:
                    stagetype = stype
            assert stagetype
            yield stagetype(self, stage=stage)

    def get_dmc_instance(self):
        """
        helper method to access dmc
        """
        query = {"topology": topology_role_name.dmc}
        return self.get_entity("instances",
                               query=query)

    def get_entity(self, collection, objid=None, query=None):
        """Load entity from specific collection.

        This method also tracks for the changes in this object, if there
        any changes in this object - it will be automatically updated
        """
        entities = self._entities.setdefault(collection, {})
        if objid not in entities:
            factory = ioc.require_feature("repositoriesfactory")
            repository = ioc.require_feature(factory[collection])
            if objid:
                entity = repository.get(objid)
            else:
                result = repository.get_all(query)
                if len(result) == 0:
                    raise NotFoundException(fmt="Entity not found")
                elif len(result) > 1:
                    raise ServerException(fmt="Unexpected result")
                entity = result[0]
            entities[entity.objid] = entity
            return entities[entity.objid]

        # in case entities has the object return
        return entities[objid]

    # pylint: disable=too-many-arguments
    def get_entities(self, collection, query=None, fields=None, limit=None, cache=False):
        """Load entities list from collection. When cache is True we store them on the
        _entities so that they can be persisted
        """
        factory = ioc.require_feature("repositoriesfactory")
        repository = ioc.require_feature(factory[collection])
        results = repository.get_all(query=query, fields=fields, limit=limit)
        if cache:
            entities = self._entities.setdefault(collection, {})
            for i, entity in enumerate(results):
                if entity.objid in entities:
                    results[i] = entities[entity.objid]
                else:
                    entities[entity.objid] = entity
        return results
    # pylint: enable=too-many-arguments

    def flush_cache(self):
        """Flush all cached entities into kvstore
        """
        for collection, entities in self._entities.items():
            factory = ioc.require_feature("repositoriesfactory")
            repository = ioc.require_feature(factory[collection])
            changed = [entity for entity in entities.values() if entity.dirty]
            if changed:
                repository.batch_save(changed)
        self._entities.clear()
