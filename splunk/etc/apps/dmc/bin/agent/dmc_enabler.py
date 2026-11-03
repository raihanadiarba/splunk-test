# pylint: disable=broad-except
"""
DMC Enabler
"""

import argparse
import logging
import os
import sys
import time

import agent.ioc

from agent.models import Command
from agent.splunklib.client import Entity
from agent.common.helpers import to_bool


def _error(msg):
    """Print out an error and exit"""
    print(msg)
    print(os.linesep)
    print("'splunk enable dmc-server' again or use --verbose option")
    sys.exit(1)


def progress_reported(progress):
    """Report progress to stdout
    """
    failed = progress.get_value("failed", default=False)
    if failed:
        sys.stdout.write("  x ")
    else:
        sys.stdout.write("  - ")
    print(progress.get_value("description"))
    if progress.has_path(("payload", "error")):
        print("    " + progress.get_value(("payload", "error")))
    sys.stdout.flush()


# pylint: disable=too-many-instance-attributes
class DmcEnabler():

    """
    Enables this Splunk to server as the DMC Server
    """

    def __init__(self):
        self._splunk_host = agent.ioc.components.splunk_host()
        self._splunk_home = None
        self._instance_service = None
        self._topologies_service = None
        self._tasks_service = None
        self._configuration = None
        self._user_context = None
        self._logger = logging.getLogger(self.__class__.__name__)
        self._parser = argparse.ArgumentParser(
            prog="splunk enable dmc-server",
            usage=argparse.SUPPRESS,
            add_help=False)

        self._parser.add_argument(
            "--bindip", dest="bindip",
            help="What interface to bind to")
        self._parser.add_argument(
            "--port", dest="port",
            help="What port the DMC agent should bind itself to")
        self._parser.add_argument(
            "--token", dest="token",
            help="Authentication token")
        self._parser.add_argument(
            "-auth", dest="auth",
            help="Authentication as username:password")
        self._parser.add_argument(
            "--require-authentication", action="store_true", dest="require_authentication", default=None,
            help="Require DS authentication")
        self._parser.add_argument(
            "--hostname", dest="hostname", required=False, default=None,
            help="Remote hostname")
        self._parser.add_argument(
            "--fqdn", dest="fqdn", required=False, default=None,
            help="Remote fully qualified domain name")
        self._parser.add_argument(
            "--ssl-verify-server-cert", action="store_true", dest="ssl_verify_server_cert",
            required=False, default=None,
            help="Whether forwarders should validate the server certificate")
        self._parser.add_argument(
            "--ssl-verify-server-name", action="store_true", dest="ssl_verify_server_name",
            required=False, default=None,
            help="Whether forwarders should validate the server certificate against tls hostname")
        self._parser.add_argument(
            "--packaged-ca-cert-file", dest="ssl_packaged_cacert_file", required=False, default=None,
            help="CA Cert (already packaged) for forwarders to use for validating the server certificate")
        self._parser.add_argument(
            "--app-ca-cert-file", dest="ssl_app_cacert_file", required=False, default=None,
            help="CA Cert (in credentials app) for forwarders to use for validating the server certificate")
        self._parser.add_argument(
            "--ssl-common-name", dest="ssl_common_name", required=False, default=None,
            help="Common Name (CN) tfor forwarders to use for validating the server certificate")
        self._parser.add_argument(
            "--answer-yes", dest="answer_yes", action='store_true')
        self._parser.add_argument("--no-prompt", dest="no_prompt", action='store_true')

    # pylint: disable=too-many-locals
    # pylint: disable=too-many-branches
    # pylint: disable=too-many-statements
    def enable(self, argv):
        """Enable DMC

        This is the method which bootstraps everything in the DMC process
        """

        # 1. Verify parameters

        parsed = self._parser.parse_args(argv)

        if not parsed.auth and not parsed.token:
            _error(
                "Authentication credentials required - "
                "use -auth <username>:<password>")

        username, password = None, None
        if parsed.auth:
            username, password = parsed.auth.split(":")
            if not username or not password:
                _error(
                    "Invalid authentication credentials '%s' - "
                    "use -auth <username>:<password>" % parsed.auth)

        # 2. Connect to DMC host

        print("Connecting to host process...")
        sys.stdout.flush()
        try:
            self._splunk_host.connect(
                token=parsed.token,
                username=username,
                password=password)
            splunk_service = self._splunk_host.get_service(
                owner="nobody", app="system")
        except agent.splunklib.binding.AuthenticationError:
            _error(
                "Failed to authenticate with credentials '%s' - "
                "use -auth <username>:<password>" % parsed.auth)
        except Exception as exc:
            _error(
                "Failed to connect to Splunk: %s" % exc)

        dmc_settings = self._splunk_host.get_dmc_settings()
        if dmc_settings["mode"] != "disabled" and dmc_settings["mode"] and not to_bool(dmc_settings["disabled"]):
            _error("DMC Server has been enabled already. Current mode is '%s'." % dmc_settings["mode"])

        self._initialize_dependencies()
        print("Done." + os.linesep)

        self._wait_kvstore(splunk_service)

        # 3. Execute few commands to make DMC workflow engine available for us
        #    After this step we will be able to use KVStore

        print("Verifying DMC dependencies...")
        sys.stdout.flush()
        self._verify_dmc_dependencies()
        print("Done." + os.linesep)

        current_context = Entity(splunk_service, "/services/authentication/current-context")
        with self._user_context.scope({"capabilities": current_context.content["capabilities"], "user": username}):
            # 4. Starting instance_workflow task with current DMC server as target.
            #    At this point we register and verify everything we could about current
            #    DMC member.

            print("Registering host as instance... ")
            sys.stdout.flush()
            self._register_dmc_as_instance(splunk_service, parsed)
            print("Done." + os.linesep)

            # 5. Starting topology_workflow with bootstrap=True. At this point we will
            #    - Setup default topology with SHC and IDXC
            #    - Enable everything we need to enable on DMC instance regarding distributed
            #      environment
            print("Initializing default topology... ")
            sys.stdout.flush()
            self._initialize_default_topology(parsed)
            print("Done." + os.linesep)

            print(os.linesep + "Successfully enabled DMC Server." + os.linesep)

            print("Updating DMC configuration...")
            self._update_dmc_configuration_settings(parsed)
            print("Done." + os.linesep)

        sys.stderr.flush()
        sys.stdout.flush()

    def _wait_kvstore(self, service):
        """Waiting for KVStore maximum 60 seconds (default value)
        """
        kvstore_wait_time_ms = self._configuration.get_int("startup_kvstore_wait_time", default=60)
        start_time = time.time()
        sys.stdout.write("Verifying KVStore status...")
        kvstore_status = None
        while True:
            kvstore_status = service.info["kvStoreStatus"]
            if kvstore_status in ["disabled", "ready", "failed"]:
                break
            if (time.time() - start_time) > kvstore_wait_time_ms:
                break
            time.sleep(1)
            sys.stdout.write(".")
            sys.stdout.flush()
        print(" " + kvstore_status)
        if kvstore_status != "ready":
            _error("KVStore is required for DMC server.")
        print("Done" + os.linesep)

    def _verify_dmc_dependencies(self):
        """Verify DMC dependencies (KVStore collections)
        """
        if not self._splunk_host.verify_splunk_dependencies():
            _error("Failed to enable KVStore collections." + os.linesep)

    def _update_dmc_configuration_settings(self, parsed):
        """Update DMC configuration settings using dmc_enabler_workflow

        NOTE: this method duplicates DMCEnablerWorkflow, which we cannot execute at current moment
        for simple reason: KVStore collections are not enabled at this point
        """
        assert self
        command = agent.ioc.require_feature("commands:update_dmc_configuration")
        result = command.execute(
            Command({
                "payload": {
                    "bindAddress": parsed.bindip,
                    "port": parsed.port,
                    "mode": "full"
                },
                "target": {
                    "app": "system",
                    "owner": "nobody"
                }}))
        if not result.completed or result.failed:
            _error("Failed to update DMC configuration settings." + os.linesep + result.description)

    def _register_dmc_as_instance(self, splunk_service, parsed):
        """Register ourselves as the DMC Server in the instances listing, and
        provide nothing for SSH so we execute with local commands
        Calculate the new mgmt URI based on the old one and our remote host
        """
        task = self._splunk_host.update_dmc_as_instance(
            hostname=parsed.hostname, remote_fqdn=parsed.fqdn, progress_reporter=progress_reported)
        if task is None:
            print("No updates required for DMC Server instance.")
        else:
            task_messages = task.format_messages()
            if task_messages:
                print(os.linesep + task_messages)
                sys.stdout.flush()
            if task.state != "completed":
                _error("Failed to complete DMC Server registration." + os.linesep + task.format_messages())

    def _initialize_default_topology(self, parsed):
        """Start topology workflow with bootstrap step
        """
        deployment_server = {}
        if parsed.require_authentication is not None:
            deployment_server["requireAuthentication"] = parsed.require_authentication
        if parsed.ssl_verify_server_cert is not None:
            deployment_server["sslVerifyServerCert"] = parsed.ssl_verify_server_cert
        else:
            deployment_server["sslVerifyServerCert"] = False
        if parsed.ssl_verify_server_name is not None:
            deployment_server["sslVerifyServerName"] = parsed.ssl_verify_server_name
        else:
            deployment_server["sslVerifyServerName"] = False
        if parsed.ssl_common_name is not None:
            deployment_server["sslCommonName"] = parsed.ssl_common_name
        if parsed.ssl_packaged_cacert_file is not None:
            deployment_server["sslPackagedCaCertFile"] = parsed.ssl_packaged_cacert_file
        if parsed.ssl_app_cacert_file is not None:
            deployment_server["sslAppCaCertFile"] = parsed.ssl_app_cacert_file
        topology = self._topologies_service.create_or_update(
            {
                "bootstrap": True,
                "deploymentServer": deployment_server,
                "interactive": not parsed.no_prompt,
                "mode": "full",
                "skipAudit": True
            })
        task = self._tasks_service.execute_task_linear(topology.get_value(("task", "taskId")), progress_reported)
        if task.state != "completed":
            _error("Failed to bootstrap default topology." + os.linesep + task.format_messages())

    def _initialize_dependencies(self):
        """Some of the services require auth token, which we load only in enable.

        Let's just delay load everything.
        """
        self._splunk_home = agent.ioc.components.splunk_home()
        self._instance_service = agent.ioc.services.instances_service()
        self._topologies_service = agent.ioc.services.topologies_service()
        self._tasks_service = agent.ioc.services.tasks_service()
        self._configuration = agent.ioc.components.configuration()
        self._user_context = agent.ioc.components.user_context()
