"""
Master apps reload configuration
"""
from agent import ioc
from agent.commands import DMCRestCommandBase
from agent.commands.rest_command_base import get_remote_service_from_topology_info
from agent.commands.retry_helpers import StepHandler
from agent.splunklib.client import ReadOnlyCollection


class ReloadMasterAppsConfCommand(DMCRestCommandBase):
    """
    REST command to reload master-apps conf
    """

    REST_URL = "/services/cluster/master/control/control/apply"

    MESSAGES = {"True": "Successfully reloaded master-apps",
                "False": "Failed to reload master-apps"}

    CLUSTER_STATUS_URL = "/services/cluster/master/info"

    def __init__(self):
        super(ReloadMasterAppsConfCommand, self).__init__()
        configuration = ioc.components.configuration()
        self._retry_delay = configuration.get_int("reload_manager_apps_delay", default=10)
        self._max_retry = configuration.get_int("reload_manager_apps_retry", default=100)
        self._secure_storage = ioc.services.secure_storage()

    def execute_rest(self, command, service):
        topology = command.get_value(("payload", "topology"))
        idxc_indexer = topology.get("IDXCMaster")
        if idxc_indexer:
            master_service = get_remote_service_from_topology_info(
                self._splunk_host,
                self._secure_storage,
                idxc_indexer)
        else:
            master_service = service

        handler = StepHandler(command)

        handler.step(
            "reloadMasterApps",
            lambda: self._reload_master_apps(master_service))

        handler.step(
            "checkApplyStatus",
            lambda: self._check_apply_status(service),
            self._retry_delay,
            self._max_retry
        )

        return handler.execute()

    def _reload_master_apps(self, service):
        """
        Issue reload REST all to index master
        """
        result = self.post(service, {"ignore_identical_bundle": True}, self.REST_URL)
        if result.failed:
            self._logger.info("Reload master apps failed, %s", result.description)
            return False

        return True

    def _check_apply_status(self, service):
        """
        Check bundle deploy status at index master
        """
        master_info = ReadOnlyCollection(service, self.CLUSTER_STATUS_URL)["master"]["content"]
        if "apply_bundle_status" in master_info:
            apply_status = master_info["apply_bundle_status"]["status"]
            if not apply_status == "None":
                # apply is in progress, sleep and try again
                self._logger.info("master-apps deploy is in progress")
                return False
        return True
