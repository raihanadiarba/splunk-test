"""
Update DMC App Configurations command
"""
from agent.commands import DMCRestCommandBase, CommandResult


class UpdateDMCAppConfigurationCommand(DMCRestCommandBase):
    """
    Updates DMC app configuration settings:
    Enables all collections
    """
    def execute_rest(self, command, service):
        # Enable our collections
        for collection in service.kvstore:
            if collection.access.app == "dmc":
                collection.enable()

        return CommandResult(True, False, "DMC Configuration has been updated", None)
