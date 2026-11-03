"""
A deployed change JSON Entity
"""

from agent.models import JSONEntity


class DeployedChangelog(JSONEntity):
    """
    Class for properties of apps installed on the DMC for deployment
    """

    _ID_FIELD = "name"
    COLLECTION = "deployed_changelog"
