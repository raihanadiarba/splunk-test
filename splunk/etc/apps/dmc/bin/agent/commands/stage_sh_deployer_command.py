"""
shcluster deploy apps
"""
from agent.commands import DMCRestCommandBase


class StageSHDeployerCommand(DMCRestCommandBase):
    """
    REST command to stage sh apps
    """

    REST_URL = "/services/apps/deploy"
    MESSAGES = {"True": "Successfully staged SH apps",
                "False": "Failed to stage SH apps"}

    def execute_rest(self, command, service):
        return self.post(service, {"action": "stage"})
