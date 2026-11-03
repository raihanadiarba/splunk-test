"""
Verify instance Id command
"""
import traceback

from agent.splunklib.binding import HTTPError

from agent.commands import RemoteRestCommandBase, CommandResult
from agent.common.helpers import compare_ids


class VerifyInstanceIdCommand(RemoteRestCommandBase):
    """Verify instance id
    """

    def execute_rest(self, command, service):
        instanceid = command.get_value(("target", "instanceId"))
        server_info = None
        try:
            server_info = service.info
        except HTTPError as exc:
            self._logger.warning("Failed to get server info: %s", traceback.format_exc())
            return CommandResult(False,
                                 True,
                                 "Failed to get server info",
                                 {"exception": str(exc)})

        ret = None
        if compare_ids(server_info["guid"], instanceid):
            ret = CommandResult(True, False,
                                "Instance guids are matched",
                                None)
        else:
            ret = CommandResult(False, True,
                                "Instance guids are not matched",
                                {"instanceId": instanceid, "splunkGuid": server_info["guid"]})

        return ret
