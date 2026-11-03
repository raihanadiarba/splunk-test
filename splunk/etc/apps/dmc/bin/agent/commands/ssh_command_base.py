"""
SSH Command Base
"""

import abc

from agent import ioc
from agent.commands import CommandBase
from agent.models.instance import DEFAULT_ADMIN_PASSWORD


class SSHCommandBase(CommandBase):
    """SSH Command Base class
    """

    def __init__(self):
        self.__ssh_service = ioc.commands.ssh_service()
        self.__iservice = ioc.services.instances_service()
        self._securestorage = ioc.services.secure_storage()

    def execute(self, command):
        instanceid = command.get_value(("target", "instanceId"))
        instance = self.__iservice.get(instanceid)
        ssh_client = self.__ssh_service.get_client(instance)
        return self.execute_ssh(command, ssh_client)

    def get_auth_info(self, command):
        """
        Helper method to get the auth info. Returns the admin password in the format
        <username>:<password>.
        :return string  <username>:<password>:
        """
        instance_id = command.get_value(("target", "instanceId"))
        instance = self.__iservice.get(instance_id)
        # Checks if the instance has a admin password already set and returns it. If admin
        # password is not set we return the default password
        if instance.has_path("splunkAdminPassword"):
            admin_password = self._securestorage.decrypt(instance.splunk_admin_password)
        else:
            admin_password = DEFAULT_ADMIN_PASSWORD
        auth = instance.splunk_admin_username + ":" + admin_password
        return auth

    @abc.abstractmethod
    def execute_ssh(self, command, ssh_client):
        """Execute command using ssh client
        """
        pass  # pylint: disable=unnecessary-pass
