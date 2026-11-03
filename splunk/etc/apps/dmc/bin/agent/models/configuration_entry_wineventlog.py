"""
Configuration entry for WinEventLog
"""

from agent.models import ConfigurationEntry


class ConfigurationEntryWinEventLog(ConfigurationEntry):
    """WinEventLog input configuration entry
    """
    _GROUP = "inputs"
    _COMPONENT = "wineventlog"
    _STANZA = "WinEventLog"
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
            # WinEventLog conf
            "start_from": {"enum": ["newest", "oldest", "none"]},
            "use_old_eventlog_api": {"format": "splunk-boolean"},
            "suppress_checkpoint": {"format": "splunk-boolean"},
            "suppress_sourcename": {"format": "splunk-boolean"},
            "suppress_keywords": {"format": "splunk-boolean"},
            "suppress_type": {"format": "splunk-boolean"},
            "suppress_task": {"format": "splunk-boolean"},
            "suppress_opcode": {"format": "splunk-boolean"},
            "use_threads": {"type": "number"},
            "thread_wait_time_msec": {"type": "number"},
            "current_only": {"format": "splunk-boolean"},
            "batch_size": {"type": "number"},
            "checkpointInterval": {"type": "number"},
            "evt_resolve_ad_obj": {"format": "splunk-boolean"},
            "evt_dc_name": {"type": "string"},
            "evt_dns_name": {"type": "string"},
            "evt_resolve_ad_ds": {"enum": ["auto", "PDC"]},
            "evt_ad_cache_disabled": {"format": "splunk-boolean"},
            "evt_ad_cache_exp": {"format": "splunk-boolean"},
            "evt_ad_cache_exp_neg": {"format": "splunk-boolean"},
            "evt_ad_cache_max_entries": {"type": "number"},
            "evt_sid_cache_disabled": {"format": "splunk-boolean"},
            "evt_sid_cache_exp": {"type": "number"},
            "evt_sid_cache_exp_neg": {"type": "number"},
            "evt_sid_cache_max_entries": {"type": "number"},
            "whitelist": {"type": "string"},
            "blacklist": {"type": "string"},
            "whitelist1": {"type": "string"},
            "blacklist1": {"type": "string"},
            "whitelist2": {"type": "string"},
            "blacklist2": {"type": "string"},
            "whitelist3": {"type": "string"},
            "blacklist4": {"type": "string"},
            "whitelist5": {"type": "string"},
            "blacklist5": {"type": "string"},
            "whitelist6": {"type": "string"},
            "blacklist6": {"type": "string"},
            "whitelist7": {"type": "string"},
            "blacklist7": {"type": "string"},
            "whitelist8": {"type": "string"},
            "blacklist8": {"type": "string"},
            "whitelist9": {"type": "string"},
            "blacklist9": {"type": "string"},
            "key": {"type": "string"},
            "suppress_text": {"type": "string"},
            "renderXml": {"format": "splunk-boolean"}
        }
    }
