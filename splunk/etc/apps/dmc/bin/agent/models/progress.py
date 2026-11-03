"""
Progress JSON Entity
"""
from agent.models import JSONEntity


class Progress(JSONEntity):
    """Class for progress
    """

    _ID_FIELD = "progressId"
    COLLECTION = "progress"
    _DEFAULTS = {
        "state": "new"
    }
    _TRACK_CHANGES = True

    @property
    def progressid(self):
        """Progress Id
        """
        return self.get_value("progressId")
