"""
Remove client from deployment server
"""
import traceback
from agent import ioc, wtransaction

from agent.splunklib.binding import HTTPError
from agent.commands import DMCRestCommandBase, CommandResult


class RemoveClientFromDeploymentServerCommand(DMCRestCommandBase):
    """
    Removes a client from the deployment server. The next time the client "phones home" the record is re-created.
    """
    REST_URL = "/services/deployment/server/clients/%s"
    MESSAGES = {"True": "Successfully removed client from deployment server",
                "False": "Failed to remove client from deployment server"}

    def __init__(self):
        super(RemoveClientFromDeploymentServerCommand, self).__init__()
        self._deployservice = ioc.services.deploy_service()

    @wtransaction
    def execute_rest(self, command, service):
        params = command.get_value("payload")
        instance_id = params["instanceId"]
        guid = params["guid"]
        assert instance_id
        assert guid
        url = self.REST_URL % guid
        success = True
        try:
            service.delete(url).body.read()
            self._deployservice.record_instance_deletion(instance_id)
        except HTTPError as ex:
            # 404 error will be thrown when the instance to be removed is not found in the
            # deployment server.
            if ex.status != 404:
                success = False
            self._logger.warning("Failed to remove instance %s from deployment server with exception: %s",
                                 params["instanceId"],
                                 traceback.format_exc())
        return CommandResult(completed=success,
                             failed=not success,
                             description=self.MESSAGES[str(success)],
                             payload=None)
