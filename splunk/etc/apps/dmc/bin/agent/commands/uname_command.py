"""
Verify SSH connection
"""

from agent.commands import SSHCommandBase, CommandResult


class UnameCommand(SSHCommandBase):
    """Get machine uname
    """

    def execute_ssh(self, command, ssh_client):
        result = ssh_client.execute("uname")
        return CommandResult(result.returncode == 0,
                             result.returncode != 0,
                             "Got uname",
                             {
                                 "uname": result.stdout.strip()
                             })
