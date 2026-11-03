"""
Command to change deployment server requireAuthentication setting
"""

from agent.commands import DMCRestCommandBase


class SetDeploymentServerRequireAuthenticationCommand(DMCRestCommandBase):
    """Command to change deployment server requireAuthentication setting
    """
    REST_URL = "/services/deployment/server/config/authentication"
    MESSAGES = {"True": "Deployment server requireAuthentication has been updated",
                "False": "Failed to update deployment server requireAuthentication"}

    def execute_rest(self, command, service):
        return self.post(service, command.get_value("payload"))
