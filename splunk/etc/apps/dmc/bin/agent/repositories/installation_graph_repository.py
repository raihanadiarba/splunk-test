"""
SLIM installation graph repository
"""

import agent

from agent.repositories.base_repository import KVStoreRepositoryBase
from agent.models.installation_graph import InstallationGraph
from agent.services.changelog_service import EventType


class KVStoreInstallationGraphRepository(KVStoreRepositoryBase):

    """Repository for storing installation graphs

    Implemented using KVStore.
    """

    CollectionName = InstallationGraph.COLLECTION
    LogEventType = EventType.graph

    def _object_factory(self, entity):
        return InstallationGraph(entity)

    def add_new_graph(self, version, graph):
        """ Add a new installation graph at the specified version
        """
        new_installation = InstallationGraph({
            "staged": True,
            "graph": graph
        })
        new_installation.version = version
        self.insert(new_installation, log_change=False)

    def _find_graph(self, query=None):
        """
        Helper wrapper for the get_all() function where we want to find a single specific graph,
        and handle errors consistently.
        """
        result = self.get_all(limit=1, sort=(("version", -1),), query=query)
        if not result:
            raise agent.NotFoundException(fmt="No installation graphs found.")
        return result[0]

    def get_current(self):
        """ Return the most recent installation graph. If one does not exist, create it!
        """
        try:
            graph = self._find_graph(query=None)
        except agent.NotFoundException:
            graph = InstallationGraph(use_defaults=True)
            self.insert(graph, log_change=False)
        return graph

    def get_committed(self):
        """ Return the most recent committed installation graph (not staged)
        """
        return self._find_graph(query={"staged": False})

    def get_last_version_to_keep(self, cut_off):  # pylint: disable=inconsistent-return-statements
        """
        Return the most recent version that is at cut_off or if
        the total graphs are less than cut_off then return the smallest
        version
        """
        result = self.get_all(limit=cut_off, sort=(("version", -1),))
        if (result and len(result) > 0):
            return result[-1].version

    def delete_older_graphs(self, last_version_to_keep):
        """ Delete older graphs older than last_version_to_keep
        """
        self.delete_all(query={"version": {"$lt": last_version_to_keep}})

    def find_version(self, version):
        """ Return the graph matching the given version
        """
        return self._find_graph(query={"version": version})
