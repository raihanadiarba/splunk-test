"""
Configuration entry for TCP output
"""

import copy
from agent import SchemaValidationException
from agent.models import ConfigurationEntry


class ConfigurationEntryTcpOut(ConfigurationEntry):
    """TCP output configuration entry
    """

    _COMPONENT = "tcpout-group"
    _GROUP = "outputs"
    _STANZA = "tcpout"
    _STANZA_NAME_DELIMITER = ":"

    _SCHEMA = {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "disabled": {"format": "splunk-boolean"},
            "defaultGroup": {"type": "array", "items": {"type": "string"}},
            "indexAndForward": {"format": "splunk-boolean"},
            "server": {"type": "array", "items": {"type": "string"}},
            "indexerDiscovery": {"type": "string"},
            "token": {"type": "string"},
            "sendCookedData": {"format": "splunk-boolean"},
            "heartbeatFrequency": {"type": "number"},
            "blockOnCloning": {"format": "splunk-boolean"},
            "blockWarnThreshold": {"type": "number"},
            "compressed": {"format": "splunk-boolean"},
            "negotiateNewProtocol": {"format": "splunk-boolean"},
            "channelReapInterval": {"type": "number"},
            "channelTTL": {"type": "number"},
            "channelReapLowater": {"type": "number"},
            "socksServer": {"type": "string"},
            "socksUsername": {"type": "string"},
            "socksPassword": {"type": "string"},
            "socksResolveDNS": {"format": "splunk-boolean"},
            "maxQueueSize": {"type": "string"},
            "dropEventsOnQueueFull": {"type": "number"},
            "dropClonedEventsOnQueueFull": {"type": "number"},
            "maxFailuresPerInterval": {"type": "number"},
            "secsInFailureInterval": {"type": "number"},
            "backoffOnFailure": {"type": "number"},
            "maxConnectionsPerIndexer": {"type": "number"},
            "connectionTimeout": {"type": "number"},
            "readTimeout": {"type": "number"},
            "writeTimeout": {"type": "number"},
            "tcpSendBufSz": {"type": "number"},
            "ackTimeoutOnShutdown": {"type": "number"},
            "dnsResolutionInterval": {"type": "number"},
            "forceTimebasedAutoLB": {"format": "splunk-boolean"},
            "forwardedindex.filter.disable": {"format": "splunk-boolean"},
            "autoLB": {"format": "splunk-boolean"},
            "autoLBFrequency": {"type": "number"},
            "sslPassword": {"type": "string"},
            "clientCert": {"type": "string"},
            "sslCertPath": {"type": "string"},
            "cipherSuite": {"type": "string"},
            "sslCipher": {"type": "string"},
            "ecdhCurves": {"type": "string"},
            "sslRootCAPath": {"type": "string"},
            "sslVerifyServerCert": {"format": "splunk-boolean"},
            "sslVerifyServerName": {"format": "splunk-boolean"},
            "tlsHostname": {"type": "string"},
            "sslCommonNameToCheck": {"type": "string"},
            "sslAltNameToCheck": {"type": "string"},
            "useClientSSLCompression": {"format": "splunk-boolean"},
            "sslQuietShutdown": {"format": "splunk-boolean"},
            "sslVersions": {"type": "string"},
            "useACK": {"format": "splunk-boolean"},
        }
    }

    def links(self):
        """Get links supported by tcpout (all links except "move")
        """
        links = super(ConfigurationEntryTcpOut, self).links()
        if "move" in links:
            del links["move"]
        return links

    def validate(self, content):
        """Custom validation of forwardedindex.<n>.whitelist and forwardedindex.<n>.blacklist
        """
        content_without_forwardedindex = copy.deepcopy(content)
        # validate forwardedindex.<n>.<list>s
        self._validate_forwarded_index(content_without_forwardedindex, "whitelist")
        self._validate_forwarded_index(content_without_forwardedindex, "blacklist")
        # validate the remaining part
        super(ConfigurationEntryTcpOut, self).validate(content_without_forwardedindex)

    @staticmethod
    def _validate_forwarded_index(content, list_type):
        """Check forwardedindex.<n>.<list type> in the content. The sequence shouldn't have "gaps" in the
        values of <n>. This method removes forwardedindex.<n>.<list type> from the content allowing "normal" json
        validation of the remaining part.
        """
        index = 0
        while True:
            key = "forwardedindex.%d.%s" % (index, list_type)
            value = content.get(key)
            if value is None:
                break
            if not isinstance(value, str):
                raise SchemaValidationException(fmt="Invalid schema, string expected, %s" % value)
            index += 1
            del content[key]
