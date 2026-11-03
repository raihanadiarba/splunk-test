"""
Verify Splunk Management Uri
"""

from agent.commands import CommandResult, RemoteRestCommandBase


# pylint: disable=too-few-public-methods
class VerifySplunkManagementUriCommand(RemoteRestCommandBase):
    """Verify management uri command

    We only want to verify that we can connect to the management uri. Base command is trying to access management uri
    to get splunk-system-user token. If we got to this stage this means that we already know that management uri is
    working, so we just need to return successful result
    """

    def execute_rest(self, command, service):
        assert command
        assert service
        return CommandResult(True,
                             False,
                             "Management uri is available",
                             None)
