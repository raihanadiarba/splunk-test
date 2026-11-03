"""
External app discovery service
"""
import os
import logging

from slim.utils import SlimStatus

from agent.models.app import App, AppProperty
from agent import ioc, ServerException, NotFoundException
from agent.services.apps_service import DEFAULT_APP_VERSION


_logger = logging.getLogger(__name__)


class ExternalAppsService(ioc.Component):
    """
    External app discovery service
    """

    def __init__(self):
        self._splunk_home = ioc.components.splunk_home()
        self._slim_service = ioc.services.slim_service()
        self._apps_repository = ioc.repositories.apps_repository()
        self._tasks_service = ioc.services.tasks_service()
        self._stanzas_service = ioc.services.stanzas_service()

    def install_app(self, app_id, package_name, groups):
        """Install the external app into our db (and repository)
        """
        app_version = self._stanzas_service.get_app_property_from_package(
            app_id,
            os.path.join(self._splunk_home.repository(), package_name),
            AppProperty.VERSION)
        if app_version == DEFAULT_APP_VERSION:
            _logger.warning("App %s cannot be partitioned by SLIM", app_id)
            payload = {"status": SlimStatus.STATUS_OK}
        else:
            payload = self._slim_service.install_app(package_name, None, external=True)

        if payload["status"] != SlimStatus.STATUS_OK:
            # External apps aren't required to be SLIM valid
            _logger.warning("Failed to add app %s to the installation, "
                            "status %d", app_id, payload["status"])
        else:
            # unstage the installation graph changes if successful.
            self._slim_service.commit_installation()

        properties = {
            AppProperty.NAME: app_id,
            AppProperty.PACKAGE: package_name,
            AppProperty.EXTERNAL: True,
            AppProperty.GROUPS: groups
        }
        app = App(properties, use_defaults=True)
        self._apps_repository.insert(app, log_change=False)

        return payload

    def update_app(self, app_id, package_name):
        """Update the external app package into our db (and repository)
        """
        if package_name is None:
            return {"status": SlimStatus.STATUS_OK}
        package_path = os.path.join(self._splunk_home.repository(), package_name)

        payload = self._slim_service.update_app(package_path)
        if payload["status"] != SlimStatus.STATUS_OK:
            # External apps aren't required to be SLIM valid
            _logger.warning("Failed to update app %s in the "
                            "installation, status %d",
                            app_id, payload["status"])
        else:
            # unstage the installation graph changes if successful.
            self._slim_service.commit_installation()

        properties = {
            AppProperty.PACKAGE: package_name
        }
        self.update_app_properties(app_id, properties)

        return payload

    def uninstall_app(self, app_id):
        """Uninstall the external app by removing it from the db (and repository). Delete the dummy package as well.
        """
        app = self._apps_repository.get(app_id)
        assert app.external  # We expect to only deal with external apps
        assert app.package   # We expect all apps to have a package reference

        payload = self._slim_service.uninstall_app(app_id)
        if payload["status"] != SlimStatus.STATUS_OK:
            _logger.error("Slim service failed to uninstall app %s from the "
                          "installation, status %d",
                          app_id, payload["status"])
        else:
            # unstage the installation graph changes if successful.
            self._slim_service.commit_installation()
            # Save the package path before we attempt to delete the app
            package_path = os.path.join(self._splunk_home.repository(), app.package)
            self._apps_repository.delete(app_id, log_change=False)

            # Delete the app package to complete the uninstall
            if os.path.exists(package_path):
                os.remove(package_path)

        return payload

    def update_apps(self):
        """Scan for new/removed/updated external app so we can record them in our db
        """
        return self._tasks_service.new_task("external_apps_discovery_workflow")

    def last_discovery_error(self):
        """Get error status of the last discovery workflow
        """
        tasks = self._tasks_service.get_all(
            query={"workflow": "external_apps_discovery_workflow"},
            sort_key="createdAt", reverse=True,
            fields=["state", "messages"]
        )
        if not tasks:
            return None  # no external apps discovery has been executed yet
        last_task = tasks[0]
        if last_task.state == "completed":
            return None  # last apps discovery succeeded

        return last_task.format_messages()

    def update_app_properties(self, app_id, properties):
        """Update external app properties without logging the change
        """
        app = self._apps_repository.get(app_id)
        if not app.external:
            raise ServerException(fmt="Application %s is not external." % app_id)

        app.set_values(properties)
        return self._apps_repository.update(app, log_change=False)

    def set_manageable_state(self, apps_state):
        """Set apps manageability state
        """
        updated_apps = []

        if not apps_state:
            _logger.warning("empty request")
            return updated_apps

        for app_id, state in apps_state.items():
            try:
                app = self.update_app_properties(app_id, {AppProperty.MANAGEABLE: state})
                if app:
                    updated_apps.append(app)
            except NotFoundException:
                # Warn on not found app, this is not a critical issue. Usually the caller of this API has some
                # hardcoded list of apps that has to be hidden in apps management and some of these apps don't
                # actually exist.
                _logger.warning("App %s not found", app_id)

        return updated_apps
