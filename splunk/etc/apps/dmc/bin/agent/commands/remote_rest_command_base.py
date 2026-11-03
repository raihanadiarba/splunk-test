"""
    Base class to make REST calls using remote service. This class creates the service and calls
    "execute_rest" which is to be implemented by the child classes."splunk-system-user" is used
    to create the service
"""
import abc

from agent.commands import RestCommandBase
from agent import ioc


class RemoteRestCommandBase(RestCommandBase):
    """Base class to make REST calls using remote service
    """
    def __init__(self):
        super(RemoteRestCommandBase, self).__init__()
        self._iservice = ioc.services.instances_service()
        self._securestorage = ioc.services.secure_storage()

    def execute(self, command):
        instance_id = command.get_value(("target", "instanceId"))
        instance = self._iservice.get(instance_id)
        owner = None
        if command.has_path(("target", "owner")):
            owner = command.get_value(("target", "owner"))
        app = None
        if command.has_path(("target", "app")):
            owner = command.get_value(("target", "app"))
        if instance.is_dmc_server:
            service = self._splunk_host.get_service(app=app, owner=owner)
        else:
            mgmt_uri = instance.splunk_mgmt_uri
            pass_key = self._securestorage.decrypt(instance.splunk_pass_key)
            service = self._splunk_host.get_remote_service(mgmt_uri, pass_key, app=app, owner=owner)
        return self.execute_rest(command, service)

    @abc.abstractmethod
    def execute_rest(self, command, service):
        """To be implemented by child classes
        """
        pass  # pylint: disable=unnecessary-pass
