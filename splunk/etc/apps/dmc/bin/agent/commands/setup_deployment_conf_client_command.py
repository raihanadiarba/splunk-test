"""
Deployment client setup
"""

import traceback

from agent import ioc
from agent.commands import RemoteRestCommandBase, CommandResult
from agent.splunklib.client import Entity
from agent.splunklib.binding import HTTPError


class SetupDeploymentConfClientCommand(RemoteRestCommandBase):
    """Configure deployment configuration client

    Enable DS client and set its name and target (server) uri
    """
    REST_URL = "/services/deployment/client/config"

    def __init__(self):
        super(SetupDeploymentConfClientCommand, self).__init__()
        self.__secure_storage = ioc.services.secure_storage()

    def execute_rest(self, command, service):
        """Execute setup command
        """
        payload = command.get_value("payload")

        current_configuration = None
        try:
            current_configuration = Entity(service, self.REST_URL)
        except HTTPError as exc:
            self._logger.warning("Failed to get current deployment configuration: %s", traceback.format_exc())
            return CommandResult(False,
                                 True,
                                 "Failed to get current deployment configuration",
                                 {"exception": str(exc)})

        try:
            current_configuration.post(targetUri=payload["targetUri"],
                                       disabled=False,
                                       clientName=payload["clientName"],
                                       pass4SymmKey=self.__secure_storage.decrypt(payload["pass4SymmKey"]))
        except HTTPError as exc:
            self._logger.warning("Failed to update deployment configuration: %s", traceback.format_exc())
            return CommandResult(False,
                                 True,
                                 "Failed to update deployment configuration",
                                 {"exception": str(exc)})

        return CommandResult(True,
                             False,
                             "Deployment client configuration updated",
                             None)
