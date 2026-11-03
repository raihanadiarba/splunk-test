"""
Configuration entry for scripted input
"""

from agent.models import ConfigurationEntry


class ConfigurationEntryScript(ConfigurationEntry):
    """Scripted input configuration entry
    """
    _GROUP = "inputs"
    _STANZA = "script"
    _STANZA_NAME_DELIMITER = "://"

    _SCHEMA = {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            # general settings
            "disabled": {"format": "splunk-boolean"},
            "host": {"type": "string"},
            "index": {"type": "string"},
            "source": {"type": "string"},
            "sourcetype": {"type": "string"},
            "queue": {"type": "string"},
            "_TCP_ROUTING": {"type": "string"},
            "_SYSLOG_ROUTING": {"type": "string"},
            "_INDEX_AND_FORWARD_ROUTING": {"type": "string"},
            # scripted input conf
            "interval": {"type": "string"},
            "passAuth": {"type": "string"},
            "queueSize": {"type": "string"},
            "persistentQueueSize": {"type": "string"},
            "send_index_as_argument_for_path": {"format": "splunk-boolean"},
            "start_by_shell": {"format": "splunk-boolean"},
        }
    }
