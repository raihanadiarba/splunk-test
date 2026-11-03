"""
Validate an app does not contain symlinks
"""

import os
import tarfile
import logging

from agent import ioc
from agent import ApiErrorException
from agent.commands import CommandBase, CommandResult
from agent.models.package import PackageStatus


class SymlinkCheckCommand(CommandBase):
    """ Validate an app does not contain symlinks
    """

    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)
        self._splunk_home = ioc.components.splunk_home()
        self._stanzas_service = ioc.services.stanzas_service()
        self._apps_service = ioc.services.apps_service()
        self._packages_service = ioc.services.packages_service()

    def execute(self, command):
        """ Execute the symlink check
        """
        package_name = command.get_value(("payload", "package"))
        unvetted_package = os.path.join(
            self._splunk_home.unvetted_apps(), package_name
        )

        success = True
        payload = dict()
        package_status = PackageStatus.UNKNOWN
        description = "Symlink check complete for %s" % package_name

        try:
            # check if this package contains symlinks
            with tarfile.open(unvetted_package) as unvetted_tar:
                for member in unvetted_tar.getmembers():
                    if not member.isfile() and not member.isdir():
                        raise ApiErrorException("AppUpload_InvalidContent", payload=dict(
                            invalid_path=member.name, invalid_type=int(member.type)
                        ))

            # no symlinks found
            package_status = PackageStatus.APPROVED

        except ApiErrorException as ex:
            if ex.type == "AppUpload_InvalidContent":
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
