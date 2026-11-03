"""
Enable distributed management
"""
from os import path
from agent.commands import SSHCommandBase, CommandResult
from agent.common.helpers import generate_passkey


class EnableDistributedManagementCommand(SSHCommandBase):
    """Enable distributed management command

    Note: this command cannot use REST for single reason: we do not have
    an option at this point to make a remote request, because of the setting
    `allowRemoteLogin=requireSetPassword` for admin user and because of the
    allowDistributedManagementControl is disabled by default (this is what we
    are doing in this command)
    """

    def execute_ssh(self, command, ssh_client):
        splunkhome = command.get_value(("payload", "splunkHome"))
        splunkpath = path.join(splunkhome, "bin", "splunk")
        passkey = generate_passkey()

        result = ssh_client.execute(splunkpath,
                                    "_internal",
                                    "call",
                                    "dmc-conf/settings/settings",
                                    "-post:disabled",
                                    "false",
                                    "-post:mode",
                                    "client",
                                    "-post:pass4SymmKey",
                                    passkey,
                                    "-auth",
                                    self.get_auth_info(command))

        if result.returncode != 0:
            return CommandResult(False,
                                 True,
                                 "EnableDistributedManagement command failed",
                                 "Failed to enable remote distributed\
                                  management control")

        key = self._securestorage.encrypt(passkey)

        return CommandResult(True,
                             False,
                             "EnableDistributedManagement completed",
                             {"passkey": key})
