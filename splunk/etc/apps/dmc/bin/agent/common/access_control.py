"""
Role Based Access Control
"""
# pylint: disable=useless-object-inheritance

import six

from agent.common.helpers import Enum


class SplunkdCapability(object):
    """Splunk capability item
    """

    def __init__(self, name, imply=None):
        self._name = name
        self._imply = imply or []

    @property
    def name(self):
        """Get capability name
        """
        return self._name

    @property
    def imply(self):
        """Get implied capabilities
        """
        return self._imply

    def match(self, required):
        """Match capability vs. required one. The result is true if
            - self is the same as required
            - self implies a capability that matches the required one
        """
        return self.name == required.name or \
            any(implied.match(required) for implied in self.imply)

    def __str__(self):
        """To string conversion
        """
        return self.name


class DmcCapability(SplunkdCapability):
    """DMC capability item
    """

    PREFIX = "dmc_"

    def __str__(self):
        """To string conversion
        """
        return self.PREFIX + self.name


@six.add_metaclass(Enum)
class Capability(object):
    """Collection of all DMC capabilities. Each item has its tag name and an optional list of implied
    capabilities.
    """

    MANAGE_TOPOLOGY = DmcCapability("manage_topology")

    EDIT_DEPLOY_QUEUE = DmcCapability("edit_deploy_queue")

    GET_FORWARDER_SETUP = DmcCapability("get_forwarder_setup")
    EDIT_FORWARDER_SETUP = DmcCapability("edit_forwarder_setup", [GET_FORWARDER_SETUP])
    EDIT_REQUIRE_AUTHENTICATION = DmcCapability("edit_require_authentication")

    EDIT_INPUTS = DmcCapability("edit_inputs")
    EDIT_OUTPUTS = DmcCapability("edit_outputs")

    EDIT_NODE = DmcCapability("edit_node")

    EDIT_APPS = DmcCapability("edit_apps")

    DEPLOY_APPS = DmcCapability("deploy_apps", [EDIT_APPS, EDIT_DEPLOY_QUEUE])

    EDIT_SERVERCLASSES = DmcCapability("edit_serverclasses")

    EDIT_FORWARDERS = DmcCapability("edit_forwarders")

    # edit __indexer bundle
    EDIT_INDEXERS = DmcCapability("edit_indexers")

    EDIT_IDXC_MASTER = DmcCapability("edit_idxc_master")

    EDIT_INPUT_TOKEN_HTTP = SplunkdCapability('edit_token_http')

    DEPLOY_TOKEN_HTTP = DmcCapability(
        "deploy_token_http",
        [EDIT_INPUT_TOKEN_HTTP, EDIT_INDEXERS, EDIT_INPUTS, EDIT_DEPLOY_QUEUE]
    )

    DMC_ACCESS_CAPABILITY_FORMAT = "dmc_%s_%s"  # dmc_<edit/get>_<node, app, forwarders, ...>
    DMC_ACCESS_STANZAS_CAPABILITY_FORMAT = "dmc_%s_%s_stanzas"  # dmc_<edit/get>_<node, app, forwarders, ...>_stanzas

    @staticmethod
    def parse(capability_str):
        """Convert capability in text format to a Capability enum item object
        """
        # return a Capability enum item corresponding to capability_str or None if not found (next() "suppresses"
        # StopIteration)
        return next((item for item in Capability
                     if isinstance(item, SplunkdCapability) and capability_str == str(item)),
                    None)

    @staticmethod
    def match(granted, required):
        """Match capabilities lists
        Returns: list of insufficient capabilities. An empty list means that capabilities check succeeded.
        """
        return [
            capability for capability in required
            if not any(granted_capability.match(capability) for granted_capability in granted)
        ]
