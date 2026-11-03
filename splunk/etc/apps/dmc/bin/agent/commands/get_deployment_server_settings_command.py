"""
Get deployment server settings command implementation
"""

from agent.commands import DMCRestCommandBase, CommandResult
from agent.splunklib.client import Entity
from agent.common.helpers import to_bool


class GetDeploymentServerSettingsCommand(DMCRestCommandBase):
    """
    Fetch deployment server settings command
    """

    def execute_rest(self, command, service):
        """Fetch deployment server settings
        """

        auth_entity = Entity(service, "/services/deployment/server/config/authentication")
        return CommandResult(completed=True,
                             description="Discovered Deployment Server settings",
                             payload={
                                 "requireAuthentication": to_bool(auth_entity.content["requireAuthentication"])
                             })
