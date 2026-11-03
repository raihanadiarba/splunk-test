"""
Verify instance Id command
"""
import traceback

from agent.common.helpers import to_bool
from agent.common.topology_helpers import topology_role_name
from agent.splunklib.binding import HTTPError
from agent.splunklib.client import Entity

from agent.commands import RemoteRestCommandBase, CommandResult


IDXC_MODE_DISABLED = "disabled"
IDXC_MODE_SLAVE = "slave"
IDXC_MODE_MASTER = "master"
IDXC_MODE_SEARCHHEAD = "searchhead"

SHC_MODE_DISABLED = "disabled"
SHC_MODE_MEMBER = "member"
SHC_MODE_MASTER = "master"


class DiscoverTopologyCommand(RemoteRestCommandBase):
    """Discover Topology Command
    """

    def execute_rest(self, command, service):
        idxc_disabled = True
        idxc_mode = IDXC_MODE_DISABLED
        try:
            idxc_configuration = Entity(service, "/services/cluster/config")
            idxc_disabled = to_bool(idxc_configuration.content["disabled"])
            idxc_mode = idxc_configuration.content["mode"]
        except HTTPError as exc:
            self._logger.warning("Failed to get cluster config: %s", traceback.format_exc())
            return CommandResult(False,
                                 True,
                                 "Failed to get cluster config",
                                 {"exception": str(exc)})

        shc_disabled = True
        shc_mode = SHC_MODE_DISABLED
        try:
            shc_configuration = Entity(service, "/services/shcluster/config")
            shc_disabled = to_bool(shc_configuration.content["disabled"])
            shc_mode = shc_configuration.content["mode"]
        except HTTPError as exc:
            self._logger.warning("Failed to get shcluster config: %s", traceback.format_exc())
            return CommandResult(False,
                                 True,
                                 "Failed to get shcluster config",
                                 {"exception": str(exc)})

        # Both are disabled
        if shc_disabled and idxc_disabled and idxc_mode == IDXC_MODE_DISABLED and shc_mode == SHC_MODE_DISABLED:
            return CommandResult(True, False,
                                 "Instance has unassigned configuration",
                                 {"topology": topology_role_name.unassigned,
                                  "shcmode": shc_mode,
                                  "idxcmode": idxc_mode})

        # Both enabled and idxc is searchhead - this is SHC member
        if not shc_disabled and not idxc_disabled and idxc_mode == IDXC_MODE_SEARCHHEAD:
            return CommandResult(True,
                                 False,
                                 "Instance is a SHC configured member",
                                 {"topology": topology_role_name.shc_member,
                                  "shcmode": shc_mode,
                                  "idxcmode": idxc_mode})

        # SHC disabled, IDXC enabled and slave - this is IDXC member
        if not idxc_disabled and idxc_mode == IDXC_MODE_SLAVE and shc_disabled:
            return CommandResult(True,
                                 False,
                                 "Instance is a IDXC configured member",
                                 {"topology": topology_role_name.idxc_member,
                                  "shcmode": shc_mode,
                                  "idxcmode": idxc_mode})

        # all other configurations are unsupported, like when IDXC is a master (supported on DMC only right now)
        return CommandResult(False, True,
                             "Unsupported configuration, SHC and IDXC cannot be enabled at the same time",
                             None)
