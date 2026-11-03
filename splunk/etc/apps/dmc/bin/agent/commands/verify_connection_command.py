"""
Verify connection from instance to host
"""

from agent.commands import SSHCommandBase, CommandResult


class VerifyConnectionCommand(SSHCommandBase):
    """Verify connections command
    """

    def execute_ssh(self, command, ssh_client):
        host = command.get_value(("payload", "host"))
        fail = command.get_value(("payload", "fail"), default=True)
        # Ping just once
        result = ssh_client.execute("ping", "-c", "1", host)
        ret = None
        if result.returncode == 0:
            ret = CommandResult(True, False, "Verified connection", None)
        else:
            ret = CommandResult(completed=True,
                                failed=fail,
                                description="Failed to connect to '%s'" % host,
                                payload={"warning": result.stderr})
        return ret
