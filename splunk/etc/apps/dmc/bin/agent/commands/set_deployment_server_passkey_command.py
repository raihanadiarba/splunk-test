"""
Command to change deployment server pass4SymmKey
"""

import copy
from agent.commands import DMCRestCommandBase
from agent import ioc


class SetDeploymentServerPassKeyCommand(DMCRestCommandBase):
    """Command to change deployment server pass4SymmKey
    """
    REST_URL = "/services/deployment/server/config/config"
    MESSAGES = {"True": "Deployment server pass4SymmKey has been updated",
                "False": "Failed to update deployment server pass4SymmKey"}

    def __init__(self):
        super(SetDeploymentServerPassKeyCommand, self).__init__()
        self._securestorage = ioc.services.secure_storage()

    def execute_rest(self, command, service):
        params = copy.deepcopy(command.get_value("payload"))
        params["pass4SymmKey"] = self._securestorage.decrypt(params["pass4SymmKey"])
        return self.post(service, params)
