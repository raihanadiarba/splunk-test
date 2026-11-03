"""
Get Splunk version
"""

import re

from os import path

from agent.commands import SSHCommandBase, CommandResult


def splunk_version_from_payload(instance, payload):
    """Extract information from payload and copy to splunk service
    """
    instance.set_value("splunkVersion", payload["VERSION"])
    instance.set_value("splunkBuild", payload["BUILD"])
    # It is not the same as we show in Deployment Client/Server,
    # but similar, we use splunkPlatform only for DMC
    instance.set_value("splunkPlatform", payload["PLATFORM"].lower())
    instance.set_value("splunkProduct", payload["PRODUCT"])


class GetSplunkVersionCommand(SSHCommandBase):
    """Get Splunk version command
    Executes cat $SPLUNK_HOME/etc/splunk.version
    """

    def execute_ssh(self, command, ssh_client):
        splunk_etc = None
        if command.has_path(("payload", "splunkEtc")):
            splunk_etc = command.get_value(("payload", "splunkEtc"))
        else:
            splunk_etc = path.join(command.get_value(("payload", "splunkHome")), "etc")
        result = ssh_client.execute("cat",
                                    path.join(splunk_etc,
                                              "splunk.version"))

        if result.returncode == 0:
            matches = re.findall("^([^=]+)=(.+)$", result.stdout, re.M)
            if matches:
                return CommandResult(True,
                                     False,
                                     "Found Splunk",
                                     dict(matches))
        return CommandResult(False,
                             True,
                             "Failed to parse splunk.version",
                             None)
