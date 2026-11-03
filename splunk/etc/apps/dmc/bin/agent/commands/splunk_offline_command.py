"""
Splunk offline command
"""
from agent.commands import RemoteRestCommandBase


class SplunkOfflineCommand(RemoteRestCommandBase):
    """
    Make a splunk instance offline before it is removed
    """
    REST_URL = "/services/cluster/slave/control/control/decommission"
    MESSAGES = {"True": "Instance made offline",
                "False": "Failed to make instance offline"}

    def execute_rest(self, command, service):
        return self.post(service, {})
