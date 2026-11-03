"""
Stop Splunk instance
"""

from os import path

from agent.commands import SSHCommandBase, CommandResult


class StopSplunkCommand(SSHCommandBase):
    """Stop Splunk instance command implementation
    """

    def execute_ssh(self, command, ssh_client):
        splunkhome = command.get_value(("payload", "splunkHome"))
        result = ssh_client.execute(path.join(splunkhome, "bin", "splunk"),
                                    "stop")
        return CommandResult(result.returncode == 0,
                             result.returncode != 0,
                             "Splunk stopped",
                             result.stdout)
