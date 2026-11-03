import logging
from typing import List

from splunkupgrade.data.data_parse_exception import DataParseException
from splunkupgrade.data.server_roles import ServerRole

logger = logging.getLogger(__name__)


class ServerRolesMapper:
    def __init__(self, roles: List[str]):
        if roles is None:
            raise DataParseException("Invalid server roles: None was specified")
        self._parsed_roles = self._parse_roles(roles)
        logger.debug(f"Parsed the following roles='{self._parsed_roles}' from input='{roles}'")

    def _parse_roles(self, roles: List[str]):
        role_values = [role_as_enum.value for role_as_enum in ServerRole]
        return [ServerRole(role) for role in roles if role in role_values]

    def is_cluster_manager(self) -> bool:
        return ServerRole.CLUSTER_MANAGER in self._parsed_roles

    # While a deployer can have multiple roles, we are only interested into ServerRole.SHC_DEPLOYER.
    # Other existing (supported) roles will be skipped. This means, as part of our parsing, a "good"
    # deployer should only have a single parsed ServerRole.
    def is_deployer_only(self) -> bool:
        return ServerRole.SHC_DEPLOYER in self._parsed_roles and not self.is_sh()

    def is_standalone_search_head(self) -> bool:
        return self.is_sh() and (not self.is_shc_peer()) and (not self.is_cluster_manager())

    def is_sh(self):
        return (
            ServerRole.SEARCH_HEAD in self._parsed_roles
            or ServerRole.CLUSTER_SEARCH_HEAD in self._parsed_roles
        )

    # A typical peer in a SHC has always either ServerRole.SHC_CAPTAIN or ServerRole.SHC_MEMBER role.
    # Additionally, it can have ServerRole.SEARCH_HEAD role.
    def is_shc_peer(self) -> bool:
        return any(
            role in self._parsed_roles for role in [ServerRole.SHC_CAPTAIN, ServerRole.SHC_MEMBER]
        )

    def is_search_head_for_indexer_cluster(self) -> bool:
        return ServerRole.CLUSTER_SEARCH_HEAD in self._parsed_roles

    def is_standalone_indexer(self) -> bool:
        return (
            ServerRole.INDEXER in self._parsed_roles
            and ServerRole.CLUSTER_PEER not in self._parsed_roles
        )

    def is_cluster_peer(self):
        return (
            ServerRole.INDEXER in self._parsed_roles
            and ServerRole.CLUSTER_PEER in self._parsed_roles
        )

    # Returns true if an instance is a license manager that is neither a search head nor indexer
    def is_isolated_license_manager(self):
        return (
            (ServerRole.LICENSE_MANAGER in self._parsed_roles)
            and (not self.is_sh())
            and (ServerRole.INDEXER not in self._parsed_roles)
        )
