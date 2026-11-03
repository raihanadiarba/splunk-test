"""
Implementation of purpose built UI for files monitor
"""

from agent.models import ConfigurationEntry


class ConfigurationEntryFilesMonitor(ConfigurationEntry):
    """UI Entry for Files Monitor
    """
    _GROUP = "inputs"
    _STANZA = "monitor"
    _STANZA_NAME_DELIMITER = "://"

    _SCHEMA = {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "disabled": {"format": "splunk-boolean"},
            "host": {"type": "string"},
            "index": {"type": "string"},
            "source": {"type": "string"},
            "sourcetype": {"type": "string"},
            "queue": {"type": "string"},
            "_TCP_ROUTING": {"type": "string"},
            "_SYSLOG_ROUTING": {"type": "string"},
            "_INDEX_AND_FORWARD_ROUTING": {"type": "string"},
            "host_regex": {"type": "string"},
            "host_segment": {"type": "number"},
            "whitelist": {"type": "string"},
            "blacklist": {"type": "string"},
            "_whitelist": {"type": "string"},
            "_blacklist": {"type": "string"},
            "crcSalt": {"type": "string"},
            "initCrcLength": {"type": "number"},
            "ignoreOlderThan": {"type": "string"},
            "followTail": {"format": "splunk-boolean"},
            "alwaysOpenFile": {"format": "splunk-boolean"},
            "time_before_close": {"type": "number"},
            "multiline_event_extra_waittime": {"format": "splunk-boolean"},
            "recursive": {"format": "splunk-boolean"},
            "followSymlink": {"format": "splunk-boolean"}
        }
    }
