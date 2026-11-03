"""
Configuration entry for TCP input
"""

from agent.models import ConfigurationEntry


class ConfigurationEntryTcp(ConfigurationEntry):
    """TCP input configuration entry
    """
    _GROUP = "inputs"
    _STANZA = "tcp"
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
            # tcp input conf
            "connection_host": {"enum": ["ip", "dns", "none"]},
            "queueSize": {"type": "string"},
            "persistentQueueSize": {"type": "string"},
            "requireHeader": {"format": "splunk-boolean"},
            "listenOnIPv6": {"enum": ["no", "yes", "only"]},
            "acceptFrom": {"type": "string"},
            "rawTcpDoneTimeout": {"type": "number"}
        }
    }
