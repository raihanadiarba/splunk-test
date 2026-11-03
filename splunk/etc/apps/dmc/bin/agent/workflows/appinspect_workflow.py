""" Splunk app inspect vetting workflow.
    This workflow initiates vetting of an app and stores the result.
"""

import os

from agent import ioc
from agent.models.app import AppProperty
from agent.models.package import PackageStatus
from agent.common.helpers import mkdir_p
from agent.workflows import WorkflowBase, OneCommandWorkflowStageBase
from agent.workflows.notification_workflow import trigger_sh_notifications

NOTIFY_APPINSPECT_MSG_KEY = "DMC_APP_INSPECT_KEY_%s"

NOTIFY_VETTING_FAILED_MSG = "The package approval task for %s failed. " \
                            "See the [[/app/dmc/uploaded_apps|Uploaded Apps]] page for report details."
NOTIFY_VETTING_PASSED_MSG = "The package approval task for %s completed. The package is ready to install. " \
                            "See the [[/app/dmc/uploaded_apps|Uploaded Apps]] page for details."

NOTIFY_APPINSPECT_FAILED_MSG = "The package approval task for %s could not complete. " \
                               "Contact your administrator for details or try again later."

EDIT_OR_INSTALL_APPS_CAP = ("edit_local_apps", "install_apps")


class AppInspectStage(OneCommandWorkflowStageBase):
    """ Validate an app package and return the validation report
    """

    TYPE = "agent:splunk:appinspect_validate"
    DESCRIPTION = "Validate an app package and return the validation report"
    COMMAND = "appinspect_validate"

    def _handle_completed(self, command, progress):
        super(AppInspectStage, self)._handle_completed(command, progress)
        payload = self._stage["payload"] = progress.get_value("payload")
        self._workflow.task.update_embedded("payload", {
            "packageStatus": payload.get("packageStatus"),
            "package": payload.get("package")
        })

    def _handle_failed(self, command, progress):
        super(AppInspectStage, self)._handle_failed(command, progress)
        self._stage["errors"] = progress.get_value(("payload", "errors"))
        self._workflow.task.update_embedded("payload", {
            "packageStatus": progress.get_value(("payload", "packageStatus"))
        })

    def _new_command(self):
        command = super(AppInspectStage, self)._new_command()
        payload = self._workflow.task.get_value("payload")
        command.set_value("payload", payload)
        return command


class ValidateAppCompatibilityStage(OneCommandWorkflowStageBase):
    """ Validate that app is compatible with the system
    """

    TYPE = "agent:splunk:validate_app_compatibility"
    DESCRIPTION = "Validate that app in app package is compatible with the system"
    COMMAND = "validate_app_compatibility"

    def handle_start(self):
        package_status = self._workflow.task.payload.get("packageStatus")
        if package_status != PackageStatus.APPROVED:
            self._workflow.task.add_information("skipping app compatibility check, the previous stage has failed")
            self.mark_completed()
            return
        super(ValidateAppCompatibilityStage, self).handle_start()

    def _handle_completed(self, command, progress):
        super(ValidateAppCompatibilityStage, self)._handle_completed(command, progress)
        payload = self._stage["payload"] = progress.get_value("payload")
        if payload and payload.get("packageStatus"):
            self._workflow.task.update_embedded("payload", {"packageStatus": payload.get("packageStatus")})
        if payload and payload.get("app_manifest"):
            self._workflow.task.update_embedded("payload", {"app_manifest": payload.get("app_manifest")})

    def _handle_failed(self, command, progress):
        super(ValidateAppCompatibilityStage, self)._handle_failed(command, progress)
        self._stage["errors"] = progress.get_value(("payload", "errors"))
        self._workflow.task.update_embedded("payload", {
            "packageStatus": progress.get_value(("payload", "packageStatus"))
        })

    def _new_command(self):
        command = super(ValidateAppCompatibilityStage, self)._new_command()
        payload = self._workflow.task.get_value("payload")
        command.set_value("payload", payload)
        return command


class SymlinkCheckStage(OneCommandWorkflowStageBase):
    """ Validate an app does not contain symlinks
    """

    TYPE = "agent:splunk:symlink_check"
    DESCRIPTION = "Validate an app does not contain symlinks"
    COMMAND = "symlink_check"

    def handle_start(self):
        package_status = self._workflow.task.payload.get("packageStatus")
        if package_status != PackageStatus.APPROVED:
            self._workflow.task.add_information("Skipping package symlink check, app inspect validation failed.")
            self.mark_completed()
            return
        super(SymlinkCheckStage, self).handle_start()

    def _handle_completed(self, command, progress):
        super(SymlinkCheckStage, self)._handle_completed(command, progress)
        payload = self._stage["payload"] = progress.get_value("payload")
        if payload and payload.get("packageStatus"):
            self._workflow.task.update_embedded("payload", {
                "packageStatus": payload.get("packageStatus")
            })

    def _handle_failed(self, command, progress):
        super(SymlinkCheckStage, self)._handle_failed(command, progress)
        self._stage["errors"] = progress.get_value(("payload", "errors"))
        self._workflow.task.update_embedded("payload", {
            "packageStatus": progress.get_value(("payload", "packageStatus"))
        })

    def _new_command(self):
        command = super(SymlinkCheckStage, self)._new_command()
        payload = self._workflow.task.get_value("payload")
        command.set_value("payload", payload)
        return command


class VersionCheckStage(OneCommandWorkflowStageBase):
    """ Validate an app version is unique
    """

    TYPE = "agent:splunk:version_check"
    DESCRIPTION = "Validate an app version is unique"
    COMMAND = "version_check"

    def handle_start(self):
        package_status = self._workflow.task.payload.get("packageStatus")
        if package_status != PackageStatus.APPROVED:
            self._workflow.task.add_information("Skipping package version check, app inspect validation failed.")
            self.mark_completed()
            return
        super(VersionCheckStage, self).handle_start()

    def _handle_completed(self, command, progress):
        super(VersionCheckStage, self)._handle_completed(command, progress)
        payload = self._stage["payload"] = progress.get_value("payload")
        if payload and payload.get("packageStatus"):
            self._workflow.task.update_embedded("payload", {
                "packageStatus": payload.get("packageStatus")
            })

    def _handle_failed(self, command, progress):
        super(VersionCheckStage, self)._handle_failed(command, progress)
        self._stage["errors"] = progress.get_value(("payload", "errors"))
        self._workflow.task.update_embedded("payload", {
            "packageStatus": progress.get_value(("payload", "packageStatus"))
        })

    def _new_command(self):
        command = super(VersionCheckStage, self)._new_command()
        payload = self._workflow.task.get_value("payload")
        command.set_value("payload", payload)
        return command


class AppInspectWorkflow(WorkflowBase):
    """ This workflow initiates vetting of an app and stores the result.
    """

    _STAGES = [
        AppInspectStage,
        VersionCheckStage,
        ValidateAppCompatibilityStage,
        SymlinkCheckStage
    ]
    _WORKFLOW = "appinspect_workflow"

    def __init__(self, task=None, **kwargs):
        super(AppInspectWorkflow, self).__init__(task, **kwargs)
        self.splunk_home = ioc.components.splunk_home()
        self.stanzas_service = ioc.services.stanzas_service()

        topologies_service = ioc.services.topologies_service()
        self.topology = topologies_service.get_default_topology().json()

    def _post_appinspect_message(self, taskid, msg, sev):
        """
        Post an app inspect message to search head(s)
        """
        trigger_sh_notifications(self.topology, NOTIFY_APPINSPECT_MSG_KEY % taskid, msg, sev, EDIT_OR_INSTALL_APPS_CAP)

    def _handle_completed(self):
        """
        Cleanup rejected app packages, or move approved packages. Post a message indicating the vetting result.
        """
        unvetted_package = os.path.join(
            self.splunk_home.unvetted_apps(), self.task.get_value(("payload", "package"))
        )

        if self.task.get_value(("payload", "packageStatus")) != PackageStatus.APPROVED:
            # Vetting failed for this package, cleanup unvetted package
            # TODO: Remove cleanup if we allow workflow retry in the future
            os.remove(unvetted_package)

            package_name = self.task.get_value(("payload", "package")).split('_', 1)[1]
            message = NOTIFY_VETTING_FAILED_MSG % package_name
            self._post_appinspect_message(self.task.taskid, message, "warn")
        else:
            # Vetting passed for this package, move unvetted package
            vetted_package = os.path.join(
                self.splunk_home.vetted_apps(), self.task.get_value(("payload", "package"))
            )
            mkdir_p(self.splunk_home.vetted_apps())
            os.rename(unvetted_package, vetted_package)

            app_id = self.stanzas_service.get_app_id_from_package(vetted_package)
            app_label = self.stanzas_service.get_app_property_from_package(
                app_id, vetted_package, AppProperty.LABEL)
            message = NOTIFY_VETTING_PASSED_MSG % app_label
            self._post_appinspect_message(self.task.taskid, message, "info")

    def _handle_failed(self):
        """
        Cleanup failed app packages. Post a message indicating the task failed.
        """

        # Vetting task failed for this package, cleanup unvetted package
        # TODO: Remove cleanup if we allow workflow retry in the future
        unvetted_package = os.path.join(
            self.splunk_home.unvetted_apps(), self.task.get_value(("payload", "package"))
        )
        os.remove(unvetted_package)

        package_name = self.task.get_value(("payload", "package")).split('_', 1)[1]
        message = NOTIFY_APPINSPECT_FAILED_MSG % package_name
        self._post_appinspect_message(self.task.taskid, message, "error")

    def _new_task(self):
        task = super(AppInspectWorkflow, self)._new_task()
        task.set_value("payload", self.objects)
        return task
