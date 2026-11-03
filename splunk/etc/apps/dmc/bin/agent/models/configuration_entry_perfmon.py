"""
Configuration entry for Perfmon
"""

from agent.models import ConfigurationEntry


class ConfigurationEntryPerfmon(ConfigurationEntry):
    """Perfmon input configuration entry
    """
    _GROUP = "inputs"
    _STANZA = "perfmon"
    _STANZA_NAME_DELIMITER = "://"
    _ARRAY_DELIMITER = ";"

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
            # perfmon conf
            "object": {"type": "string"},
            "counters": {"type": "array", "items": {"type": "string"}},
            "instances": {"type": "array", "items": {"type": "string"}},
            "interval": {"type": "number"},
            "mode": {"enum": ["single", "multikv"]},
            "samplingInterval": {"type": "number"},
            "stats": {"type": "string"},
            "showZeroValue": {"format": "splunk-boolean"},
            "useEnglishOnly": {"format": "splunk-boolean"},
            "useWinApiProcStats": {"format": "splunk-boolean"},
            "formatString": {"type": "string"},
            "usePDHFmtNoCap100": {"format": "splunk-boolean"}
        }
    }
