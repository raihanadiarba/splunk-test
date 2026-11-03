"""Discovery "external" apps, i.e., applications installed "manually".
"""

from agent import ioc
from agent.workflows import WorkflowBase, OneCommandWorkflowStageBase


class DiscoverExternalAppsStage(OneCommandWorkflowStageBase):
    """Get apps installed on SH and IDXC
    """

    TYPE = "agent:splunk:discover_external_apps"
    DESCRIPTION = "Discover and install external apps"
    COMMAND = "discover_external_apps"

    def _new_command(self):
        command = super(DiscoverExternalAppsStage, self)._new_command()
        command.set_value("payload", {"topology": self._workflow.task.get_value(("payload", "topology"))})
        return command


class ExternalAppsDiscoveryWorkflow(WorkflowBase):
    """Workflow that discovers and installs external applications""
    """

    _STAGES = [
        DiscoverExternalAppsStage
    ]
    _WORKFLOW = "external_apps_discovery_workflow"

    def _new_task(self):
        task = super(ExternalAppsDiscoveryWorkflow, self)._new_task()

        task.set_value("payload", {
            "topology": ioc.services.topologies_service().get_default_topology().json()
        })

        return task
