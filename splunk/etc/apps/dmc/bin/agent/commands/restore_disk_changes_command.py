"""Restore disk changes
"""
import os
import shutil

from agent import ioc, wtransaction
from agent.models.app import AppProperty
from agent.commands import CommandBase, CommandResult
from agent.services.cancel_pending_changes_service import CancelPendingChangesMode
from agent.common.helpers import mkdir_p


class RestoreDiskChangesCommand(CommandBase):
    """Restore disk changes
    """

    def __init__(self):
        self._splunk_home = ioc.components.splunk_home()
        self._apps_service = ioc.services.apps_service()

    @wtransaction
    def execute(self, command):

        payload = command.get_value("payload")
        if payload["mode"] == CancelPendingChangesMode.all:  # pylint: disable=comparison-with-callable
            staged_apps = self._apps_service.read_all(query={AppProperty.STAGED: True})

            skip_bundles = [app.get_value(AppProperty.NAME) for app in staged_apps]
            skip_packages = [app.get_value(AppProperty.PACKAGE) for app in staged_apps]

            # Restore backed up bundles, skipping staged app packages
            self._restore_backup(skip_bundles=skip_bundles)

            # Restore the repository packages, skipping staged app packages
            self._restore_packages(skip_packages=skip_packages)

        return CommandResult(
            completed=True,
            failed=False,
            description="Successfully recovered disk changes",
            payload=None)

    def _restore_backup(self, skip_bundles):
        """Restore backed up bundles
        """
        # remove non-staged bundles
        if os.path.exists(self._splunk_home.predeployment_apps()):
            for bundle in os.listdir(self._splunk_home.predeployment_apps()):
                if bundle not in skip_bundles:
                    shutil.rmtree(os.path.join(self._splunk_home.predeployment_apps(), bundle))

        # copy the backup bundles into the predeployment-apps
        if os.path.exists(self._splunk_home.predeployment_apps_backup()):
            if not os.path.exists(self._splunk_home.predeployment_apps()):
                mkdir_p(self._splunk_home.predeployment_apps())

            for bundle in os.listdir(self._splunk_home.predeployment_apps_backup()):
                shutil.copytree(src=os.path.join(self._splunk_home.predeployment_apps_backup(), bundle),
                                dst=os.path.join(self._splunk_home.predeployment_apps(), bundle))

    def _restore_packages(self, skip_packages):
        """Restore previous package repository
        """

        if os.path.exists(self._splunk_home.repository_staged_remove()):
            for package in os.listdir(self._splunk_home.repository_staged_remove()):
                if package not in skip_packages:
                    # add packages that have been removed
                    os.rename(os.path.join(self._splunk_home.repository_staged_remove(), package),
                              os.path.join(self._splunk_home.repository(), package))

        if os.path.exists(self._splunk_home.repository_staged_add()):
            for package in os.listdir(self._splunk_home.repository_staged_add()):
                if package not in skip_packages:
                    # remove packages that have been added
                    os.remove(os.path.join(self._splunk_home.repository(), package))
                    os.remove(os.path.join(self._splunk_home.repository_staged_add(), package))
