"""Cancel pending changes workflow
"""
from copy import copy

from agent import ioc
from agent.workflows import WorkflowBase
from agent.workflows.workflow_base import OneCommandWorkflowStageBase


class RestoreRepositoryChangesStage(OneCommandWorkflowStageBase):
    """Restore repository changes
    """
    TYPE = "restore_repository:restore_repository_changes"
    DESCRIPTION = "Restore repository changes"
    COMMAND = "restore_repository_changes"

    def _new_command(self):
        payload = copy(self._workflow.task.get_value("payload"))
        command = super(RestoreRepositoryChangesStage, self)._new_command()
        command.set_value("payload", payload)
        return command


class RestoreDiskChangesStage(OneCommandWorkflowStageBase):
    """Restore disk changes
    """
    TYPE = "restore_disk:restore_disk_changes"
    DESCRIPTION = "Restore disk changes"
    COMMAND = "restore_disk_changes"

    def _new_command(self):
        payload = copy(self._workflow.task.get_value("payload"))
        command = super(RestoreDiskChangesStage, self)._new_command()
        command.set_value("payload", payload)
        return command


class CancelPendingChangesWorkflow(WorkflowBase):
    """Cancel pending changes workflow
    """

    def __init__(self, task=None, **kwargs):
        self._changelog_service = ioc.services.changelog_service()
        super(CancelPendingChangesWorkflow, self).__init__(task, **kwargs)

    _STAGES = [
        RestoreRepositoryChangesStage,
        RestoreDiskChangesStage
    ]

    _WORKFLOW = "cancel_pending_changes"

    def _new_task(self):
        task = super(CancelPendingChangesWorkflow, self)._new_task()
        payload = self.objects["payload"]
        task.set_value("payload", payload)
        return task

    def _handle_completed(self):
        super(CancelPendingChangesWorkflow, self)._handle_completed()
        self._changelog_service.clear_changelog()
