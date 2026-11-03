"""
Implementation of conf entry for HTTP eevent collector
"""

import copy
from agent import ioc
from agent.models import ConfigurationEntry
from agent.server_exceptions import SchemaValidationException
from agent.common.helpers import generate_guid, split_csv_string


class ConfigurationEntryHttp(ConfigurationEntry):
    """UI entry for HTTP event collector
    """
    _GROUP = "inputs"
    _STANZA = "http"
    _STANZA_NAME_DELIMITER = "://"

    _DEFAULTS = {
        "disabled": "false"
    }

    _SCHEMA = {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "acceptFrom": {"type": "string"},
            "ackIdleCleanup": {"format": "splunk-boolean"},
            "allowQueryStringAuth": {"format": "splunk-boolean"},
            "allowSslCompression": {"format": "splunk-boolean"},
            "allowSslRenegotiation": {"format": "splunk-boolean"},
            "caCertFile": {"type": "string"},
            "caPath": {"type": "string"},
            "cipherSuite": {"type": "string"},
            "crossOriginSharingPolicy": {"type": "string"},
            "crossOriginSharingHeaders": {"type": "string"},
            "dedicatedIoThreads": {"type": "number"},
            "description": {"type": "string"},
            "disabled": {"format": "splunk-boolean"},
            "ecdhCurveName": {"type": "string"},
            "ecdhCurves": {"type": "string"},
            "enableSSL": {"format": "splunk-boolean"},
            "forceHttp10": {"format": "splunk-boolean"},
            "host": {"type": "string"},
            "index": {"type": "string"},
            "indexes": {"type": "string"},
            "listenOnIPv6": {"format": "splunk-boolean"},
            "maxIdleTime": {"type": "number"},
            "maxSockets": {"type": "number"},
            "maxThreads": {"type": "number"},
            "requireClientCert": {"format": "splunk-boolean"},
            "sendStrictTransportSecurityHeader": {"format": "splunk-boolean"},
            "serverCert": {"type": "string"},
            "source": {"type": "string"},
            "sourcetype": {"type": "string"},
            "sslAltNameToCheck": {"type": "string"},
            "sslCommonNameToCheck": {"type": "string"},
            "sslKeysfile": {"type": "string"},
            "sslKeysfilePassword": {"type": "string"},
            "sslVersions": {"type": "string"},
            "token": {"type": "string"},
            "_meta": {"type": "string"},
            "port": {"type": "number"},
            "useACK": {"format": "splunk-boolean"},
            "useDeploymentServer": {"format": "splunk-boolean"}
        }
    }

    def __init__(self, bundle_info, name, local, default, **params):
        # add input authorization token if it's missing

        # SPL-196698: don't break HEC management when apps contain HEC inputs in default/inputs.conf
        # (e.g., local = None).
        # HEC token management for apps containing HEC inputs still not supported.
        # tokens in apps aren't deployed, tokens must be managed through UI.
        if local is None:
            if name != self.stanza() and "token" not in default:
                default = copy.deepcopy(default)
                default["token"] = generate_guid()
        else:
            if name != self.stanza() and "token" not in local:
                local = copy.deepcopy(local)
                local["token"] = generate_guid()

        super(ConfigurationEntryHttp, self).__init__(bundle_info, name, local, default, **params)

    def validate(self, content):
        """Check params, the logic in this method duplicates HEC validation that index is in the indexes list
        """
        super(ConfigurationEntryHttp, self).validate(content)

        indexes = content.get("indexes")
        index = content.get("index")
        if not indexes and not index:
            return  # there is nothing to check

        # read indexes list, fallback through provided params, stanza locals, global stanza locals
        if not indexes:
            stanzas_service = ioc.services.stanzas_service()
            # indexes aren't in params list - read from the conf
            stanza = stanzas_service.read_stanza(
                self.bundle_info["name"], self._GROUP, self.stanza_tag(self.name))
            if stanza:
                indexes = stanza[2].get("indexes")
            if not indexes:
                # try global stanza
                stanza = stanzas_service.read_stanza(self.bundle_info["name"], self._GROUP, self.stanza())
                if stanza:
                    indexes = stanza[2].get("indexes")
        if indexes:
            if not index:
                raise SchemaValidationException("The indexes should be specified together with index")
            if index not in split_csv_string(indexes):
                raise SchemaValidationException(
                    fmt="The specified index %s is not valid. It does not conform to the indexes list" % index)
