"""
Update groups
"""
import copy
from agent.commands import DMCRestCommandBase


class UpdateGroupCommand(DMCRestCommandBase):
    """Make a rest call update groups
    """

    REST_URL = "/services/search/distributed/groups/%s/edit"
    MESSAGES = {"True": "Updated group",
                "False": "Failed to update group"}

    def execute_rest(self, command, service):
        params = copy.deepcopy(command.get_value("payload"))

        group = params["group"]
        del params["group"]

        url = self.REST_URL % group
        return self.post(service, params, url)
