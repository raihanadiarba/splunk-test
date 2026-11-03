"""
Get Splunk Management Port Command
"""

import re

from os import path

from agent.commands import SSHCommandBase, CommandResult


class GetSplunkManagementPortCommand(SSHCommandBase):
    """Get Splunk management port command
    """

    def execute_ssh(self, command, ssh_client):
        splunkhome = command.get_value(("payload", "splunkHome"))
        result = ssh_client.execute(path.join(splunkhome, "bin", "splunk"),
                                    "show",
                                    "splunkd-port",
                                    "-auth",
                                    self.get_auth_info(command))

        if result.returncode == 0:
            match = re.search(r"(Splunkd port: )(\d+)", result.stdout)
            if match:
                port = match.group(2)
                return CommandResult(True,
                                     False,
                                     "Found port %s" % port,
                                     {"port": port})
        return CommandResult(False,
                             True,
                             "Failed to get port from splunks",
                             None)
