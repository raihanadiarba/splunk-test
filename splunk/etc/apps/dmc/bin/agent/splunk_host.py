"""
Splunk host
"""

import logging
from defusedxml.ElementTree import fromstring as safe_fromstring
from future.moves.urllib import parse as urllib_parse
import splunk.rest

import splunk.clilib.cli_common
import agent.splunklib.client
from agent.models import Instance, Command
from agent import ServerException, NotFoundException, ioc
from agent.models.instance import DEFAULT_ADMIN_USERNAME, DEFAULT_ADMIN_PASSWORD
from agent.common.topology_helpers import topology_role_name


class SplunkHost():
    """
    Provides information about SplunkHost server
    """

    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)
        self._tasks_service = ioc.services.tasks_service()
        self._instances_service = ioc.services.instances_service()
        self._splunk_home = ioc.components.splunk_home()
        self.token = None
        self.username = None
        self.password = None

    def _create_service(self,
                        owner=None,
                        app=None,
                        username=None,
                        password=None):
        """Connect to Splunk Host instance

        Find connection mgmt_uri using clilib and connect to it using
        splunklib (python sdk)
        """
        mgmt_uri = urllib_parse.urlparse(splunk.clilib.cli_common.getMgmtUri())
        self._logger.debug("Splunk management URI %s", str(mgmt_uri))

        service_kwargs = dict(
            host=mgmt_uri.hostname,
            port=mgmt_uri.port,
            scheme=mgmt_uri.scheme,
            owner=owner,
            app=app
        )

        if self.token:
            service_kwargs["token"] = "Splunk %s" % self.token
            service_kwargs["username"] = None
            service_kwargs["password"] = None
        else:
            username = username or self.username or DEFAULT_ADMIN_USERNAME
            password = password or self.password or DEFAULT_ADMIN_PASSWORD

            service_kwargs["username"] = username
            service_kwargs["password"] = password

        return agent.splunklib.client.connect(**service_kwargs)

    def connect(self, token=None, username=None, password=None):
        """Setup connection to Splunk
        """
        self.token = token
        self.username = username
        self.password = password

    def get_service(self, owner=None, app=None, username=None, password=None):
        """Get Splunk Service
        """
        return self._create_service(
            owner=owner,
            app=app,
            username=username,
            password=password)

    def get_remote_service(self, uri, passkey, owner=None, app=None):
        """Get remote Splunk Service
        """
        self._logger.debug("Splunk management URI %s", uri)

        mgmt_uri = urllib_parse.urlparse(uri)

        service_kwargs = dict(
            host=mgmt_uri.hostname,
            port=mgmt_uri.port,
            scheme=mgmt_uri.scheme,
            owner=owner,
            app=app,
        )

        self._logger.debug("Try to get new token")
        token = self.get_remote_token(uri, passkey)
        service_kwargs["token"] = "Splunk %s" % token
        return agent.splunklib.client.connect(**service_kwargs)

    def get_remote_token(self, uri, passkey):
        """Get remote token
        """
        response, content = splunk.rest.simpleRequest(uri + "/services/auth/systemlogin",
                                                      postargs={"username": "splunk-system-user",
                                                                "password": passkey})

        if response.status == 200:  # pylint: disable=no-else-return
            token = safe_fromstring(content).findtext("./sessionKey")
            return token
        else:
            self._logger.error("Failed to get a session token")
            raise ServerException(fmt="login failed")

    def verify_splunk_dependencies(self):
        """Verify that Splunk has required collections enabled
        """
        assert self
        update_dmc_app_configuration_command = agent.ioc.require_feature("commands:update_dmc_app_configuration")
        result = update_dmc_app_configuration_command.execute(
            Command({"target": {"app": "dmc", "owner": "nobody"}}))
        return result.completed and not result.failed

    def update_dmc_as_instance(self, hostname=None, remote_fqdn=None, progress_reporter=None):
        """
        Verify DMC instance server.
        If there are any updates required for the server - create new workflow task and execute it
        right away.
        """
        try:
            dmc_instance = self._instances_service.get_by_name("dmc-server")
        except NotFoundException:
            dmc_instance = None

        splunk_service = self.get_service(owner="nobody", app="system")
        splunk_info = splunk_service.info
        instance_id = splunk_info["guid"]

        server_name = remote_fqdn
        if server_name is None:
            server_name = splunk_info["serverName"] if dmc_instance is None else dmc_instance.get_value("serverName")

        remote_hostname = hostname
        if remote_hostname is None:
            remote_hostname = server_name if dmc_instance is None else dmc_instance.get_value("remoteHostname")

        orig_mgmt_uri = urllib_parse.urlparse(splunk.clilib.cli_common.getMgmtUri())
        mgmt_uri = "%s://%s:%s" % (
            orig_mgmt_uri.scheme,
            remote_hostname,
            orig_mgmt_uri.port
        )

        if dmc_instance is None:
            dmc_instance = Instance({
                "instanceId": instance_id,
                "instanceName": "dmc-server",
                "remoteHostname": remote_hostname,
                "splunkHome": self._splunk_home.home(),
                "splunkMgmtUri": mgmt_uri,
                "topology": topology_role_name.dmc,
                "ssh": None,
                "serverName": server_name
            })
            dmc_instance.dirty = True
        else:
            update = {
                "splunkHome": self._splunk_home.home(),
                "splunkMgmtUri": mgmt_uri,
                "topology": topology_role_name.dmc,
                "ssh": None,
                "serverName": server_name
            }
            if hostname is not None:
                update["remoteHostname"] = remote_hostname
            dmc_instance.set_values(update)

        if dmc_instance.dirty:  # pylint: disable=no-else-return
            instance = self._instances_service.create_instance_workflow(dmc_instance)
            return self._tasks_service.execute_task_linear(instance.get_value(("task", "taskId")), progress_reporter)
        else:
            return None

    def get_dmc_settings(self):
        """
        Get DMC Configuration from Splunk Host
        """
        dmc_conf = agent.splunklib.client.Entity(self.get_service(), "/services/dmc-conf/settings")
        return dmc_conf.content
