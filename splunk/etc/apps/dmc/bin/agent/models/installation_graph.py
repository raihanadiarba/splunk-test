"""
SLIM installation graph JSON Entity
"""

from agent.models import JSONEntity


class InstallationGraph(JSONEntity):
    """
    Class for an installation graph describing a DMC deployment
    """

    _ID_FIELD = "graphId"
    _VERSION_FIELD = "version"
    _DEFAULTS = {
        "staged": False,
        "graph": {}
    }
    COLLECTION = "graphs"

    # The install schema is used to map forwarder groups to server classes
    # Forwarder group names are not known, so we are only concerned with
    # the format of the value (which should be an array of strings)
    #
    # For example,
    #
    # "inputGroupMapping": {
    #     "*": ["<string>", "<string>", ...],
    #     "*": ["<string>", "<string>", ...],
    #     ...
    # }

    INSTALL_SCHEMA = {
        "type": "object",
        "properties": {
            "inputGroupMapping": {
                "type": ["object", "null"],
                "repeat": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            },
            "disableAutomaticResolution": {
                "type": "boolean"
            }
        },
        "required": ["inputGroupMapping"],
        "additionalProperties": False
    }

    @property
    def version(self):
        """ Return the version of this graph
        """
        return self.get_value("version")

    @version.setter
    def version(self, value):
        """ Set the version of the graph
        """
        return self.set_value("version", value)

    @property
    def staged(self):
        """ Return the staged property of this graph
        """
        return self.get_value("staged", False)

    @staged.setter
    def staged(self, value):
        """ Set the staged property of this graph
        """
        self.set_value("staged", value)
