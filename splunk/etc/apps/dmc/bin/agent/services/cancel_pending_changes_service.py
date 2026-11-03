"""
Cancel pending changes
"""
import os
import shutil
import six

from agent import ioc, wtransaction
from agent.models import PreDeploymentBackup
from agent.common.helpers import Enum
from agent.models.change import EventType
from agent.models.app import AppProperty


@six.add_metaclass(Enum)
class CancelPendingChangesMode(object):  # pylint: disable=useless-object-inheritance
    """
    Enum to hold the allow types of cancel changes
    """

    @staticmethod
    def _compute(name):
        """
        Return name unchanged
        """
        return name

    all = _compute


class CancelPendingChangesService(ioc.Component):
    """
    Cancel pending changes service
    """

    def __init__(self):
        self._tasks_service = ioc.services.tasks_service()
        self._splunk_home = ioc.components.splunk_home()
        self._changelog_service = ioc.services.changelog_service()
        self._predeployment_backup_repository = ioc.repositories.predeployment_backup_repository()
        self._apps_repository = ioc.repositories.apps_repository()
        self.user_context = ioc.components.user_context()

    @wtransaction
    def record(self, value):
        """
        Inserts a new record into the Backup repository with the original state .
        :return:
        """
        assert value

        if not self._predeployment_backup_repository.exists(value["name"]):
            self._predeployment_backup_repository.insert(PreDeploymentBackup(value))

    @wtransaction
    def update(self, key, values):
        """
        Update an existing record into the Backup repository with the current state .
        :return:
        """
        assert key
        assert values

        entry = self._predeployment_backup_repository.get(key)
        entry.set_values(values)

        self._predeployment_backup_repository.update(entry, log_change=False)

    @wtransaction
    def handle_cancel_pending_changes(self, payload):
        """Handle chancel pending changes.
        """
        return self.create_cancel_pending_changes_task(payload)

    def create_cancel_pending_changes_task(self, payload=None):
        """Create a task to cancel pending changes
        Creates a new workflow and inserts a "cancel_changes" record into the changelog
        """
        if not payload:
            payload = {"mode": CancelPendingChangesMode.all}
        task = self._tasks_service.new_task("cancel_pending_changes", payload=payload)
        self._log_cancel_pending_changes(task)
        return task

    def _log_cancel_pending_changes(self, task):
        """Add a new cancel_changes record into the pending changelog
        """
        key = {"taskId": task.get_value("taskId")}
        self._changelog_service.record(EventType.cancel_changes, self.user_context.user, key)
        self._changelog_service.check_cancel_progress = True

    def prepare_backup_state(self):
        """Takes a backup of the predeployment-apps state and clears the repository
        """
        self._backup_predeployment_apps_dir()
        self._clear_predeployment_backup_repository()

    def _backup_predeployment_apps_dir(self):
        """Take a backup of the predeployment-apps, except staged apps.
        """
        # Clear the predeployment-apps-backup directory
        if os.path.exists(self._splunk_home.predeployment_apps_backup()):
            shutil.rmtree(self._splunk_home.predeployment_apps_backup())

        # Verify if predeployment-apps exist to take a backup.
        # It might not exist in case the user just changed/created server classes.
        if os.path.exists(self._splunk_home.predeployment_apps()):
            staged_apps = [
                app.objid for app in self._apps_repository.get_all(query={AppProperty.STAGED: True})
            ]
            backup_list = [
                name for name in os.listdir(self._splunk_home.predeployment_apps()) if name not in staged_apps
            ]
            for name in backup_list:
                shutil.copytree(src=os.path.join(self._splunk_home.predeployment_apps(), name),
                                dst=os.path.join(self._splunk_home.predeployment_apps_backup(), name))

    def _clear_predeployment_backup_repository(self):
        """Clears all the records in the predeployment-backup repository
        """
        self._predeployment_backup_repository.delete_all()

    def is_cancel_in_progress(self):
        """Checks whether there is a deployment workflow in new/running states
        """
        tasks = self._tasks_service.get_all({
            "$and": [
                {"$or": [{"state": "new"}, {"state": "running"}]},
                {"workflow": "cancel_pending_changes"},
            ]
        }, fields=["taskId"])
        return len(tasks) > 0
