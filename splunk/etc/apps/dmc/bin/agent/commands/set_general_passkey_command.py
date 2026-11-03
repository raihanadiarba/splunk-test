"""
Command to change general pass4SymmKey
"""

import copy
from agent.commands import RemoteRestCommandBase


class SetGeneralPassKeyCommand(RemoteRestCommandBase):
    """Command to change general pass4SymmKey, which is used by License Master and Slaves
    """
    REST_URL = "/services/server/settings/settings"
    MESSAGES = {"True": "General pass4SymmKey has been updated",
                "False": "Failed to update general pass4SymmKey"}

    def execute_rest(self, command, service):
        params = copy.deepcopy(command.get_value("payload"))
        params["pass4SymmKey"] = self._securestorage.decrypt(params["pass4SymmKey"])
        return self.post(service, params)
