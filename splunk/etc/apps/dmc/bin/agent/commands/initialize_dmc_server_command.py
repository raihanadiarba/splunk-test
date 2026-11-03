"""
Initialize DMC Server Command
"""
import os

import splunk.clilib.cli_common

from agent import ioc
from agent.commands import CommandBase, CommandResult
from agent.common.helpers import mkdir_p, touch_file


class InitializeDMCServerCommand(CommandBase):
    """Command to initialize DMC Server
    """
    # path to the conf data in shcluster apps
    CONF_FORWARD_DATA = os.path.join("__dmc_system_app", "local")
    # path to master-app for inputs.conf
    CONF_PEERS_DATA = os.path.join("__dmc_fwd_inputs_app", "local")
    SPLUNK_TCP_PORT = 9997
    DEFAULT_PEERS_GROUP_NAME = "splunk_dmc_search_peers_group"

    def __init__(self):
        super(InitializeDMCServerCommand, self).__init__()
        self.__splunk_home = ioc.components.splunk_home()

    def execute(self, command):
        """
        At current moment we will override all data
        later we can ask user if he wants to enter his own (useful for migration).
        """
        # Ensure master-apps, deployment-apps and deployer-apps are present
        mkdir_p(os.path.join(self.__splunk_home.master_apps()))
        mkdir_p(os.path.join(self.__splunk_home.deployment_apps()))
        mkdir_p(os.path.join(self.__splunk_home.shdeployer_apps()))

        # Setup searchhead forwarding
        self._setup_searchhead_forwarding(
            command.get_value(("payload", "mgmtUri")),
            command.get_value(("payload", "indexDiscoveryPasskey")))

        return CommandResult(True,
                             False,
                             "Initialized DMC Server",
                             None)

    def _setup_searchhead_forwarding(self, mgmt_uri, indexer_discovery_passkey):
        """
        SH Forwarding requires some setup described below
        1) create an app in master-apps with a inputs.conf specifying the splunktcp. This app will
           be deployed to all the indexers
        2) Create a app for search heads in shcluster/apps. Add a outputs.conf in it that sets up
            the search head for forwarding the data
        """
        self._create_indexer_peer_app()
        self._create_sh_deployer_app(mgmt_uri, indexer_discovery_passkey)

    def _create_indexer_peer_app(self):
        """
        Creates an app in master-apps with a inputs.conf and indexes.conf which will be pushed
        to all the indexers
        """
        master_app_local = os.path.join(self.__splunk_home.master_apps(), self.CONF_PEERS_DATA)
        master_app_input = os.path.join(master_app_local, "inputs.conf")
        master_app_indexes = os.path.join(master_app_local, "indexes.conf")
        mkdir_p(master_app_local)
        touch_file(master_app_input)
        touch_file(master_app_indexes)

        # setup the splunktcp port for receiving data
        input_conf = splunk.clilib.cli_common.readConfFile(master_app_input)
        input_conf.setdefault("splunktcp://"+str(self.SPLUNK_TCP_PORT), {}).update({"disabled": 0})
        splunk.clilib.cli_common.writeConfFile(master_app_input, input_conf)

        # For each index defined in an app-specific indexes.conf file, set repFactor=auto,
        # so that the index gets replicated across all peers
        indexes_conf = splunk.clilib.cli_common.readConfFile(master_app_indexes)
        item = {"repFactor": "auto"}
        indexes_conf.setdefault("main", {}).update(item)
        indexes_conf.setdefault("history", {}).update(item)
        indexes_conf.setdefault("summary", {}).update(item)
        indexes_conf.setdefault("splunklogger", {}).update(item)
        indexes_conf.setdefault("_internal", {}).update(item)
        indexes_conf.setdefault("_audit", {}).update(item)
        indexes_conf.setdefault("_thefishbucket", {}).update(item)
        splunk.clilib.cli_common.writeConfFile(master_app_indexes, indexes_conf)

    def _create_sh_deployer_app(self, mgmt_uri, indexer_discovery_passkey):
        """
        setup sh forwarding.  Here we create a outputs.conf file in etc/shcluster/apps/
        and we set it up for auto indexerDiscovery.
        """
        shc_apps_local = os.path.join(self.__splunk_home.shdeployer_apps(), self.CONF_FORWARD_DATA)
        shc_apps_local_output = os.path.join(shc_apps_local, "outputs.conf")
        mkdir_p(shc_apps_local)
        touch_file(shc_apps_local_output)
        indexer_discovery_name = "sh_peers"

        outputs = splunk.clilib.cli_common.readConfFile(shc_apps_local_output)

        #  index=false just forwards data but does not index it locally
        outputs.setdefault("indexAndForward", {}).update({"index": "false"})

        # defaultGroup: This tells the forwarder to send all data to the group specified
        # forwardedindex.filter.disable: If true, disables index filtering. Events for all indexes are then forwarded
        # indexAndForward: Do not Index all data locally, just forward when set to false
        outputs.setdefault("tcpout", {}).update({
            "defaultGroup": self.DEFAULT_PEERS_GROUP_NAME,
            "forwardedindex.filter.disable": "true",
            "indexAndForward": "false"
        })

        # indexerDiscovery : Instructs the forwarder to fetch the list of indexers from the master node
        # specified in the corresponding [indexer_discovery:<name>] stanza.
        # autoLB : Automatic load balancing is the only way to forward data. Round-robin method
        # is not supported anymore
        outputs.setdefault("tcpout:"+self.DEFAULT_PEERS_GROUP_NAME, {}).update(
            {"indexerDiscovery": indexer_discovery_name, "autoLB": "true"})
        outputs.setdefault("indexer_discovery:"+indexer_discovery_name, {}).update(
            {"pass4SymmKey": indexer_discovery_passkey, "master_uri": mgmt_uri})
        splunk.clilib.cli_common.writeConfFile(shc_apps_local_output, outputs)
