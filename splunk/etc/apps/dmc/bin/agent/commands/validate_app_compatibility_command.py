"""
Validate that app is compatible with the system
"""

import logging
import os

from agent import ioc
from agent import ApiErrorException
from agent.commands import CommandBase, CommandResult
from agent.models.package import PackageStatus


class ValidateAppCompatibilityCommand(CommandBase):
    """ Validate that app is compatible with the system
    """

    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)
        self._splunk_home = ioc.components.splunk_home()
        self._apps_service = ioc.services.apps_service()

    def execute(self, command):
        """ Check app package
        """

        success = True
        payload = {"packageStatus": PackageStatus.APPROVED}

        try:
            package = os.path.join(
                self._splunk_home.unvetted_apps(), command.get_value(("payload", "package")))

            app_manifest = self._apps_service.check_app_supported_deployment(package)
            if app_manifest:
                payload["app_manifest"] = app_manifest

        except ApiErrorException as error:
            self._logger.error("app compatibility check has failed, %s", str(error))
            success = False
            payload["packageStatus"] = PackageStatus.FAILED
            payload["errors"] = [dict(type=error.type, payload=error.payload)]

        return CommandResult(
            completed=success,
            failed=not success,
            description="App is compatible" if success else "App is not compatible",
            payload=payload
        )
