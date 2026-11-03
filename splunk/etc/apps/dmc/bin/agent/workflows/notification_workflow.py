"""
Workflow to post notifications to all registered SHs
"""

from agent import ioc
from agent.workflows import WorkflowBase, OneCommandWorkflowStageBase
from agent.services.topologies_service import SEARCH_HEAD_FIELD, SHC_DEPLOYER_FIELD


def trigger_sh_notifications(topology, name, value, severity, capability=None):
    """ Trigger a notification workflow for all the registered SHs
    """
    tasks_service = ioc.services.tasks_service()

    params = {
        "name": name,
        "value": value,
        "severity": severity
    }
    if capability:
        params["capability"] = capability

    # Post notification to registered single SH
    search_head_info = topology.get(SEARCH_HEAD_FIELD)
    if search_head_info:
        tasks_service.new_task(
            "notification_workflow",
            topology=search_head_info,
            target=search_head_info,
            params=params,
        )

    # Post notification to all registered SHC members
    shc_deployer = topology.get(SHC_DEPLOYER_FIELD)
    if shc_deployer:
        for target in shc_deployer["targets"]:
            tasks_service.new_task(
                "notification_workflow",
                topology=shc_deployer,
                target=target,
                params=params,
            )


class NotificationWaitStage(OneCommandWorkflowStageBase):
    """ Stage to wait for existing notification commands to complete
    """
    TYPE = "agent:splunk:notify_wait"
    DESCRIPTION = "Wait for notification commands"
    COMMAND = "notify_wait"

    def _new_command(self):
        command = super(NotificationWaitStage, self)._new_command()
        command.set_value("payload", {
            "name": self._workflow.task.get_value(("payload", "params", "name")),
            "target": self._workflow.task.get_value(("payload", "target"))
        })
        return command


class NotificationStage(OneCommandWorkflowStageBase):
    """ Stage to trigger the notification commands
    """
    TYPE = "agent:splunk:notify"
    DESCRIPTION = "Execute notification commands"
    COMMAND = "notify"

    def _new_command(self):
        command = super(NotificationStage, self)._new_command()
        command.set_value("payload", self._workflow.task.get_value("payload"))
        return command


class NotificationWorkflow(WorkflowBase):
    """ Workflow to post notifications to all registered SHs
    """

    _STAGES = [
        NotificationWaitStage,
        NotificationStage,
    ]
    _WORKFLOW = "notification_workflow"

    def __init__(self, task=None, **kwargs):
        super(NotificationWorkflow, self).__init__(task, **kwargs)

        configuration = ioc.components.configuration()
        self.command_retry_limit = configuration.get_int("notification_retry_limit", default=12)
        self.command_retry_interval = configuration.get_int("notification_retry_interval", default=10)

    def _new_task(self):
        task = super(NotificationWorkflow, self)._new_task()

        task.set_value("payload", {
            "topology": self.objects["topology"],
            "target": self.objects["target"],
            "params": self.objects["params"]
        })
        return task
