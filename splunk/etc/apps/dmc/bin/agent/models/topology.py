"""
Topology JSON Entity
"""

from agent.models import JSONEntity


class Topology(JSONEntity):
    """Class for storing topologies
    """

    _ID_FIELD = "topologyId"
    _TRACK_CHANGES = True
    COLLECTION = "topologies"

    @property
    def topologyname(self):
        """Instance name
        """
        return self.get_value("topologyName")

    @property
    def topologyid(self):
        """Topology id
        """
        return self.get_value(self._ID_FIELD)

    def getcluster(self, ctype):
        """Find cluster by id
        """
        if self.has_path("clusters"):
            clusters = self.get_value("clusters")
            for cluster in clusters:
                if cluster["type"] == ctype:
                    return cluster
        return None

    def getshc(self):
        """Get SHC
        Note: we assume that current topology can only have one
        """
        return self.getcluster("shc")

    def getidxc(self):
        """Get IDXC
        Note: we assume that current topology can only have one
        """
        return self.getcluster("idxc")
