"""
Configuration entry for UDP input
"""

from agent.models import ConfigurationEntry


class ConfigurationEntryUdp(ConfigurationEntry):
    """UDP input configuration entry
    """
    _GROUP = "inputs"
    _STANZA = "udp"
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
            # udp input conf
            "connection_host": {"enum": ["ip", "dns", "none"]},
            "_rcvbuf": {"type": "number"},
            "no_priority_stripping": {"format": "splunk-boolean"},
            "no_appending_timestamp": {"format": "splunk-boolean"},
            "queueSize": {"type": "string"},
            "persistentQueueSize": {"type": "string"},
            "listenOnIPv6": {"enum": ["no", "yes", "only"]},
            "acceptFrom": {"type": "string"}
        }
    }
