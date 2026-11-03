"""
Command JSON Entity
"""
import time
from agent.models import JSONEntity


class Command(JSONEntity):
    """Class for storing instances
    """

    _ID_FIELD = "commandId"
    _DEFAULTS = {
        "state": "new",
        "executeAfter": time.time
    }
    _TRACK_CHANGES = True
    COLLECTION = "commands"

    RETRY_LIMIT_DEFAULT = 0
    RETRY_INTERVAL_DEFAULT = 15
    RETRY_COUNT_DEFAULT = 0

    @property
    def commandid(self):
        """Command id
        """
        return self.get_value("commandId")
