"""DMC Enabler workflow

NOTE: currently we are not using this workflow for simple reason -
workflow engine is based on KVStore which needs to be enabled first to
allow us to save progress in it. We have two options in future:
    1. Use different backend.
    2. Allow to execute Tasks in memory.
"""

from agent.workflows import WorkflowBase, OneCommandWorkflowStageBase


class UpdateDMCConfigurationStage(OneCommandWorkflowStageBase):
    """Update DMC Configuration stage
    """
    TYPE = "agent:dmc:update_configuration"
    DESCRIPTION = "Update DMC Configuration"
    COMMAND = "update_dmc_configuration"

    def _new_stage(self, stage):
        super(UpdateDMCConfigurationStage, self)._new_stage(stage)
        payload = self._workflow.objects["payload"]
        stage["payload"] = {
            "bindAddress": payload.get("bindAddress"),
            "port": payload.get("port")
        }

    def _new_command(self):
        command = super(UpdateDMCConfigurationStage, self)._new_command()
        command.set_value("target", {"app": "system", "owner": "nobody"})
        return command


class UpdateDMCAppConfigurationStage(OneCommandWorkflowStageBase):
    """Update DMC App Configuration stage
    """
    TYPE = "agent:dmc:update_app_configuration"
    DESCRIPTION = "Update DMC Application Configuration"
    COMMAND = "update_dmc_app_configuration"

    def _new_command(self):
        command = super(UpdateDMCAppConfigurationStage, self)._new_command()
        command.set_value("target", {"app": "system", "owner": "nobody"})
        return command


class DMCEnablerWorkflow(WorkflowBase):
    """
    DMC Enabler Workflow
    """

    _STAGES = [
        UpdateDMCConfigurationStage,
        UpdateDMCAppConfigurationStage
    ]
    _WORKFLOW = "dmc_enabler_workflow"
