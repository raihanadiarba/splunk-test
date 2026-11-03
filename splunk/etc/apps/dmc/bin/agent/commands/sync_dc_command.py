"""
Search head cluster reload configuration
"""


from agent import ioc
from agent.commands.rest_command_base import get_remote_service_from_topology_info
from agent.commands.retry_helpers import StepHandler
from agent.commands.dc_helpers import check_bundles_ready
from agent.commands import DMCRestCommandBase
from agent.services.group_helpers import builtin_name
from agent.repositories.persistent_data_repository import REPOSITORY_DATA_ID_SYNC_APPS
from agent.models import PersistentData


class SyncDeploymentClientCommand(DMCRestCommandBase):
    """
    REST command to reload search head cluster conf
    """
    def __init__(self):
        super(SyncDeploymentClientCommand, self).__init__()
        self._secure_storage = ioc.services.secure_storage()
        self._apps_service = ioc.services.apps_service()
        self._stanzas_service = ioc.services.stanzas_service()
        self._persistent_data_repository = ioc.repositories.persistent_data_repository()
        configuration = ioc.components.configuration()
        self._retry_delay = configuration.get_int("sync_dc_delay", default=10)
        self._max_retry = configuration.get_int("sync_dc_retry", default=100)

    def execute_rest(self, command, service):
        payload = command.get_value("payload")
        node_info = payload.get("node_info")

        sync_apps_list = self._persistent_data_repository.get(REPOSITORY_DATA_ID_SYNC_APPS).data \
            if self._persistent_data_repository.exists(REPOSITORY_DATA_ID_SYNC_APPS) else []

        handler = StepHandler(command)

        if sync_apps_list:
            handler.step(
                "syncApps",
                lambda: self._sync_apps(node_info, sync_apps_list))

        handler.step(
            "syncOnce",
            lambda: self._sync_once(node_info))

        handler.step(
            "waitBundleReady",
            lambda: check_bundles_ready(service),
            self._retry_delay,
            self._max_retry)

        return handler.execute()

    def _sync_apps(self, node_info, apps):
        """
        Update apps state
        """
        client_service = get_remote_service_from_topology_info(self._splunk_host, self._secure_storage, node_info)

        for app in apps:
            if builtin_name.search_heads in self._apps_service.read(app).make_group_list():
                # SH app status is changed by making a rest call
                action = "enable" if self._stanzas_service.get_app_state(app) == "enabled" else "disable"
                client_service.post(path_segment="apps/local/%s/%s" % (app, action))

        # clear sync apps storage
        self._persistent_data_repository.update(PersistentData({"name": REPOSITORY_DATA_ID_SYNC_APPS, "data": []}))

        return True

    def _sync_once(self, node_info):
        """
        Trigger a sync from DC
        """
        client_service = get_remote_service_from_topology_info(self._splunk_host, self._secure_storage, node_info)
        client_service.post(path_segment="deployment/client/config/sync")

        return True
