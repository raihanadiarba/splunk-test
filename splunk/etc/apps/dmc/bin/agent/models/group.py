"""
Groups JSON Entity
"""

from agent.models import JSONEntity, View
from agent.models.bundle import compute_bundle_name, BundleType


class Group(JSONEntity):
    """
    Class for group
    A group consists of a set of nodes, i.e. instances
    """

    _ID_FIELD = "name"
    COLLECTION = "groups"

    @property
    def bundle(self):
        """
        Compute bundle name
        """
        return compute_bundle_name(BundleType.custom, self.objid)

    def json(self, view=View.RepositoryView):
        """
        Add calculated fields
        """
        result = super(Group, self).json(view)
        if view == View.RestView:
            if "@bundle" not in result:
                result["@bundle"] = self.bundle
        return result
