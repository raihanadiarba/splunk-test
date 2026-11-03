"""
Set instance id command
"""

from os import path

from agent.commands import SSHCommandBase, CommandResult


class SetInstanceIdCommand(SSHCommandBase):
    """Set instance id command

    As payload we expect:
        - splunkHome - location of splunk
        - instanceId - the instanceId which we want to set
    """

    def execute_ssh(self, command, ssh_client):
        splunkhome = command.get_value(("payload", "splunkHome"))
        instanceid = command.get_value(("payload", "instanceId"))
        result = ssh_client.execute(path.join(splunkhome, "bin", "splunk"),
                                    "_set_guid",
                                    instanceid)
        return CommandResult(result.returncode == 0,
                             result.returncode != 0,
                             "Instance Id has been changed",
                             result.stdout)
