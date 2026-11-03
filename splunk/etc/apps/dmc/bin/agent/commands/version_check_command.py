"""
Validate an app version is unique
"""

import os
import logging

from agent import ioc
from agent import ApiErrorException
from agent.commands import CommandBase, CommandResult
from agent.models.app import AppProperty
from agent.models.package import PackageStatus
from agent.common.helpers import compare_versions

DEFAULT_COUNT_FOR_APP_VALIDATION = 100
DEFAULT_OFFSET_FOR_APP_VALIDATION = 0


# pylint: disable=too-few-public-methods
class VersionCheckCommand(CommandBase):
    """ Validate an app version is unique
    """

    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)
        self._splunk_home = ioc.components.splunk_home()
        self._stanzas_service = ioc.services.stanzas_service()
        self._apps_service = ioc.services.apps_service()
        self._packages_service = ioc.services.packages_service()

    def _read_package_info(self, package):
        """ Read the app id and version from the package
        """
        app_id = self._stanzas_service.get_app_id_from_package(package)
        if not app_id:
            raise ApiErrorException("AppUpload_BadPackage")

        app_version = self._stanzas_service.get_app_property_from_package(app_id, package, AppProperty.VERSION)
        if not app_version:
            raise ApiErrorException("AppUpload_BadPackage")

        return app_id, app_version

    # pylint: disable=too-many-locals
    # pylint: disable=too-many-nested-blocks
    def execute(self, command):
        """ Execute the version check
        """
        package_name = command.get_value(("payload", "package"))
        unvetted_package = os.path.join(
            self._splunk_home.unvetted_apps(), package_name
        )

        success = True
        payload = dict()
        package_status = PackageStatus.UNKNOWN
        description = "Version check complete for %s" % package_name

        try:
            # read the app id and version of this package
            app_id, app_version = self._read_package_info(unvetted_package)

            # check if this app is already uploaded/installed at the same version
            if self._apps_service.exists(app_id) and \
               compare_versions(self._apps_service.version(app_id), app_version) == 0:
                raise ApiErrorException("AppUpload_DuplicateVersion", payload=dict(
                    app_id=app_id, app_version=app_version, app_label=self._apps_service.label(app_id)
                ))

            total_uploaded = self._packages_service.get_uploaded_apps_count()

            count = DEFAULT_COUNT_FOR_APP_VALIDATION
            offset = DEFAULT_OFFSET_FOR_APP_VALIDATION
            while offset <= total_uploaded:
                # check if this app is already uploaded/approved at the same version
                approved_packages = [package for package in self._packages_service.get_packages(
                    count=count, offset=offset) if package.status == PackageStatus.APPROVED]
                for package in approved_packages:
                    assert package.get_value("@app")
                    package_app_id = package.get_value("@app")[AppProperty.NAME]
                    package_app_version = package.get_value("@app")[AppProperty.VERSION]
                    if package_app_id == app_id and compare_versions(
                            package_app_version, app_version) == 0:
                        raise ApiErrorException("AppUpload_DuplicateVersion", payload=dict(
                            app_id=app_id, app_version=app_version,
                            app_label=package.get_value("@app")[AppProperty.LABEL]
                        ))
                offset += count

            # no duplicate versions found
            package_status = PackageStatus.APPROVED

        except ApiErrorException as ex:
            if ex.type == "AppUpload_DuplicateVersion":
                # do not fail the task since we completed the check
                # mark the package status as rejected instead
                package_status = PackageStatus.REJECTED
            else:
                success = False
                description = str(ex)
                package_status = PackageStatus.FAILED
            payload["errors"] = [{
                "type": ex.type,
                "payload": ex.payload
            }]
        finally:
            payload["packageStatus"] = package_status

        if success:
            self._logger.info(description)
        else:
            self._logger.error(description)

        return CommandResult(
            completed=success,
            failed=not success,
            description=description,
            payload=payload
        )
