"""
Data item that has o be persistent
"""

from agent.models import JSONEntity


class PersistentData(JSONEntity):
    """
    Class for a misc data that has to be persistent
    """

    _ID_FIELD = "name"
    COLLECTION = "persistent_data"

    @property
    def name(self):
        """Data item name
        """
        return self.get_value(self._ID_FIELD)

    @property
    def data(self):
        """Data content
        """
        return self.get_value("data")
