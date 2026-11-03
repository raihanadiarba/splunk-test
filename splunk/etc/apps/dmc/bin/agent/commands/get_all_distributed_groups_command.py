"""
Get list of all distributed groups
"""
import traceback

from agent.commands import DMCRestCommandBase, CommandResult
from agent.splunklib.client import ReadOnlyCollection


class GetAllDistributedGroupsCommand(DMCRestCommandBase):
    """
    Add shc members as peers
    """

    REST_URL = "/services/search/distributed/groups"
    MESSAGES = {"True": "Fetched all distributed groups",
                "False": "Failed to fetch all distributed groups"}

    def execute_rest(self, command, service):
        """get collections. Fetch the list of group names
        """
        success = True
        result = None
        try:
            data = ReadOnlyCollection(service, self.REST_URL)
            result = [item["name"] for item in data.list()]
        # pylint: disable=broad-except
        except Exception:
            self._logger.error(traceback.format_exc())
            success = False
        # pylint: enable=broad-except

        return CommandResult(completed=success,
                             failed=not success,
                             description=self.MESSAGES[str(success)],
                             payload=result)
