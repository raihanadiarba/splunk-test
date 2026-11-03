"""
Verify member added as peer
"""
import time
import uuid

from agent import ioc
from agent.commands import CommandResult, DMCRestCommandBase
from agent.splunklib.client import ReadOnlyCollection


# pylint: disable=broad-except
class VerifyPeersAdded(DMCRestCommandBase):
    """
    Verify member added as peer
    """
    REST_URL = "/services/search/distributed/peers"
    MESSAGES = {"True": "Verified member added as peer",
                "False": "Members not added as peers"}

    def __init__(self):
        super(VerifyPeersAdded, self).__init__()
        self._configuration = ioc.components.configuration()
        self.retry_delay = self._configuration.get_int("verify_peers_added_retry_delay", default=10)
        self.max_retry_count = self._configuration.get_int("verify_peers_added_max_retry_count", default=5)

    def get_peers(self, service):
        """get collections. Fetch the list of peers
        """
        success = True
        try:
            data = ReadOnlyCollection(service, self.REST_URL)
            result = [uuid.UUID(item["guid"]) for item in data.list()]
        except Exception as ex:
            success = False
            result = str(ex)
        return success, result

    def execute_rest(self, command, service):
        params = command.get_value("payload")
        retry_count = self.max_retry_count
        new_members = [uuid.UUID(item) for item in params["newMembers"]]
        while True:
            success, result = self.get_peers(service)
            if success:
                if set(new_members) <= set(result):
                    return CommandResult(completed=success,
                                         failed=not success,
                                         description=self.MESSAGES[str(success)],
                                         payload=None)

            if not success or retry_count == 0:
                return CommandResult(completed=False,
                                     failed=True,
                                     description=self.MESSAGES[str(False)],
                                     payload=None)

            retry_count -= 1
            time.sleep(self.retry_delay)
# pylint: enable=broad-except
