"""
Search head cluster reload configuration
"""
import threading
import time
import traceback

from agent import ioc
from agent.commands import CommandResult, DMCRestCommandBase
from agent.common.helpers import to_bool
from agent.splunklib.client import ReadOnlyCollection


def _get_mgmt_uri(target):
    """
    Get mgmt URI
    """
    # "mgmtUri" is used by the newer SHCDeployer element for external SHC deployer's targets
    return target.get("mgmtUri") or target["mgmt_uri"]


class ReloadShClusterConfCommand(DMCRestCommandBase):
    """
    REST command to reload search head cluster conf
    """

    REST_URL = "/services/apps/deploy"

    MESSAGES = {"True": "Successfully reloaded search head cluster configuration",
                "False": "Failed to reload search head cluster configuration"}

    CLUSTER_STATUS_URL = "/services/shcluster/status"

    def __init__(self):
        super(ReloadShClusterConfCommand, self).__init__()
        self._secure_storage = ioc.services.secure_storage()
        configuration = ioc.components.configuration()
        self._retry_delay = configuration.get_int("reload_shcluster_delay", default=10)
        self._max_retry = configuration.get_int("reload_shcluster_retry", default=100)

    def execute_rest(self, command, service):
        """
        shcluster deploy operation is synchronous and REST call returns only when all sh cluster nodes are updated
        """
        topology = command.get_value(("payload", "topology"))
        shc_deployer = topology.get("SHCDeployer")
        result = None

        if shc_deployer:
            deployer_pass_key = self._secure_storage.decrypt(shc_deployer["secret"])
            shc_targets = shc_deployer["targets"]
            if not shc_targets:
                return CommandResult(False, True, "There are no targets specified for SHC deployer", None)
        else:
            deployer_pass_key = None
            shc_targets = command.get_value("target")
            if not shc_targets:
                return CommandResult(True, False, "There are no search heads", None)

        # try to find a search head that accepts conf update
        for target in shc_targets:
            target_mgmt_uri = _get_mgmt_uri(target)

            # force="true" is needed to stop SHC deployer from complaining that
            # shccluster/apps contains no app after the very last app has been uninstallled.
            params = dict(action="all", advertising="true", target=target_mgmt_uri, force="true")

            # deploy even when deployer has updates in the default apps
            params.update({"push-default-apps": "true"})

            # set preserve-lookups=true to avoid overwriting the local lookups during the app update
            params.update({"preserve-lookups": "true"})

            result = self.execute_rest_call(params, service)
            if not result.failed:  # pylint: disable=no-else-break
                if not self._wait_for_completion(target, deployer_pass_key):
                    result = CommandResult(False, True, "Wait for completion failed", None)
                break
            else:
                self._logger.warning("Failed to apply conf update at %s. %s", target_mgmt_uri, result.description)

        return result

    def execute_rest_call(self, params, service):
        """
        Initiate rest execution and handle threading responsible for periodically writing info about ongoing rest call
        """
        stop_event = threading.Event()

        self._logger.debug("Rest waiting thread execution start")
        daemon_thread = threading.Thread(
            target=DMCRestCommandBase.wait_for_rest_execution_to_finish,
            args=(
                stop_event,
                ("service=%s, params=%s, rest_url=%s" % (service, params, self.REST_URL)),
                self._logger,
            )
        )
        daemon_thread.start()
        result = self.post(service, params, self.REST_URL)
        self._logger.debug("Rest waiting thread execution stop")
        stop_event.set()
        daemon_thread.join()
        return result

    def _wait_for_completion(self, target, deployer_pass_key):
        """Wait until deployment process is completed"""
        target_mgmt_uri = _get_mgmt_uri(target)
        pass_key = self._get_pass_key(target, deployer_pass_key)
        completed = False
        retries = 0
        # iterate until /services/shcluster/status returns service_ready_flag=1 and rolling_restart_flag=0
        while True:
            if retries > self._max_retry:
                self._logger.error("shcluster remains not deployed after %d retries", retries)
                break

            try:
                remote_service = self._splunk_host.get_remote_service(target_mgmt_uri, pass_key)
                cluster_info = ReadOnlyCollection(
                    remote_service, self.CLUSTER_STATUS_URL)["status"]["content"]["captain"]
                if to_bool(cluster_info["service_ready_flag"]) and \
                        (not to_bool(cluster_info["rolling_restart_flag"])):
                    completed = True
                    break
                self._logger.info("shcluster deploy is in progress, retries=%d, service_ready=%s, rolling_restart=%s",
                                  retries,
                                  cluster_info["service_ready_flag"],
                                  cluster_info["rolling_restart_flag"])
            # pylint: disable=broad-except
            except Exception:
                # when remote server is done (restarting) we receive socket_error exception
                self._logger.info("shcluster deploy is in progress, cannot access %s, retries=%d, exception=%s",
                                  target_mgmt_uri, retries, traceback.format_exc())
            # pylint: enable=broad-except

            # deployment is in progress, sleep and poll again
            time.sleep(self._retry_delay)
            retries += 1

        return completed

    def _get_pass_key(self, target, deployer_pass_key):
        """
        Get pass key
        """
        pass_key = target.get("pass_key")
        ret = None
        if pass_key:
            assert deployer_pass_key is None
            pass_key = self._secure_storage.decrypt(pass_key)
            ret = pass_key
        else:
            # Use the secret provided by the newer SHCDeployer element for an external SHC deployer
            ret = deployer_pass_key

        return ret
