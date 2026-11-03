"""
A logged change JSON Entity
"""

from agent.models import JSONEntity


class PendingChangelog(JSONEntity):
    """
    Class for properties of apps installed on the DMC for deployment
    """

    _ID_FIELD = "name"
    COLLECTION = "pending_changelog"
