"""
Get cluster config
"""

from agent.commands import DMCRestCommandBase, CommandResult
from agent.splunklib.client import Entity


# pylint: disable=too-few-public-methods
class GetClusterConfigCommand(DMCRestCommandBase):
    """
    Get cluster config
    """

    REST_URL = "/services/%s/config"
    MESSAGES = {"True": "Successfully fetched cluster config",
                "False": "Failed to fetch cluster config"}

    def execute_rest(self, command, service):
        """get collections. Fetch the list of group names
        """
        params = command.get_value("payload")
        cluster_type = params["type"]
        assert cluster_type and cluster_type in ["cluster", "shcluster"]
        result = self.get_cluster_config(service, cluster_type)
        success = True
        if "replication_factor" in result:
            result["replication_factor"] = int(result["replication_factor"])
        else:
            success = False

        if "search_factor" in result:
            result["search_factor"] = int(result["search_factor"])
        # for idxc cluster we should have the search_factor
        elif cluster_type == "cluster":
            success = False

        return CommandResult(completed=success,
                             failed=not success,
                             description=self.MESSAGES[str(success)],
                             payload=result)

    def get_cluster_config(self, service, cluster_type):
        """
        Makes a rest request using a read only collection
        """
        url = self.REST_URL % cluster_type
        data = Entity(service, url)
        return data.content
