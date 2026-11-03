"""
Restart Splunk instance
"""

from os import path

from agent.commands import SSHCommandBase, CommandResult


class RestartSplunkCommand(SSHCommandBase):
    """Restart Splunk instance command implementation
    """

    def execute_ssh(self, command, ssh_client):
        splunkhome = command.get_value(("payload", "splunkHome"))
        # TODO: What is we are running this from Windows on Linux
        result = ssh_client.execute(path.join(splunkhome, "bin", "splunk"),
                                    "restart")
        return CommandResult(result.returncode == 0,
                             result.returncode != 0,
                             "Splunk restarted",
                             result.stdout)
