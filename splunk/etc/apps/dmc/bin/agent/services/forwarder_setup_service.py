"""
    Forwarder setup service
"""


from agent import ioc


class ForwarderSetupService(ioc.Component):
    """
        Forwarder setup service
    """

    def __init__(self):
        self._secure_storage = ioc.services.secure_storage()
        self._topologies_service = ioc.services.topologies_service()
        self._instances_service = ioc.services.instances_service()

    def get_forwarder_setup_info(self):
        """
        Get the info required for forwarder setup
        :return dictionary of the deployment passkey , mgmtHostPort and serverName:
        """
        topology = self._topologies_service.get_default_topology()
        if not topology or not topology.has_path("deploymentServer"):
            return None

        deployment_server = topology.get_value("deploymentServer")
        value = self._secure_storage.decrypt(deployment_server["secret"])
        deployment_server_instance = self._instances_service.get(deployment_server["instanceId"])

        return {
            "dsClearPassword": value,
            "mgmtHostPort": deployment_server_instance.splunk_mgmt_uri_port,
            "serverName": deployment_server_instance.get_value("serverName"),
            "requireAuthentication": deployment_server["requireAuthentication"],
            "sslVerifyServerCert": deployment_server.get("sslVerifyServerCert", False),
            "sslVerifyServerName": deployment_server.get("sslVerifyServerName", False),
            "sslPackagedCaCertFile": deployment_server.get("sslPackagedCaCertFile"),
            "sslAppCaCertFile": deployment_server.get("sslAppCaCertFile"),
            "sslCommonName": deployment_server.get("sslCommonName"),
        }
