"""
Task JSON Entity
"""

import time
import os

from agent.models import JSONEntity


class Task(JSONEntity):
    """Base class for tasks
    """

    _ID_FIELD = "taskId"
    _DEFAULTS = {
        "state": "new",
        "workflow": "unknown"
    }
    _TRACK_CHANGES = True
    COLLECTION = "tasks"

    @property
    def taskid(self):
        """Get task id
        """
        return self.get_value("taskId")

    @property
    def state(self):
        """Get state
        """
        return self.get_value("state")

    @property
    def workflow(self):
        """Get workflow
        """
        return self.get_value("workflow")

    @property
    def stages(self):
        """Get stages
        """
        return self.get_value("stages")

    @property
    def payload(self):
        """Get payload
        """
        return self.get_value("payload", {})

    def add_error(self, message):
        """Add error message
        """
        self._add_message("error", message)

    def add_warning(self, message):
        """Add warning message
        """
        self._add_message("warning", message)

    def add_information(self, message):
        """Add information message
        """
        self._add_message("information", message)

    def add_typed_error(self, error_type, message):
        """Add typed error message
        """
        self._add_message(error_type, message)

    def _add_message(self, message_type, message):
        """Add message
        """
        messages = []
        if self.has_path("messages"):
            messages = self.get_value("messages")
        else:
            self.set_value("messages", messages)
        messages.append({"type": message_type, "text": message, "time": time.time()})
        self.dirty = True

    def format_messages(self):
        """Format messages, like
        error: message
        warning: message
        """
        output = ""
        messages = self.get_value("messages", default=[])
        for message in messages:
            output += "%s: %s" % (message["type"], message["text"])
            output += os.linesep
        return output
