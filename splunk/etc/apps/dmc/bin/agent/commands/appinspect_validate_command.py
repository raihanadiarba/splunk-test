"""
Validate an app package and return the validation report
"""

import os
import time
import logging
import zipfile
import tarfile

from requests import ConnectionError  # pylint: disable=redefined-builtin
from requests.exceptions import MissingSchema

from splunk.util import toDefaultStrings

from agent import ioc
from agent import ApiErrorException
from agent.commands import CommandBase, CommandResult
from agent.models.instance import DEFAULT_ADMIN_USERNAME, DEFAULT_ADMIN_PASSWORD
from agent.models.package import PackageStatus
from agent.appinspect_apiclient.auth import Auth, DEFAULT_AUTH_ENDPOINT
from agent.appinspect_apiclient.client import Client, DEFAULT_ENDPOINT
from agent.appinspect_apiclient.exceptions import AppInspectClientAuthenticationException, \
    AppInspectValidationException, AppInpsectStatusException, AppInpsectReportException, \
    AppInspectTimeOutException
from agent.common.helpers import make_temp

DEFAULT_VALIDATE_TAGS = "cloud,self-service"
DEFAULT_VALIDATE_TAGS_CLASSIC = "private_classic"
APPINSPECT_REJECTED = "This app has failed AppInspect validation. " \
                      "Fix the issues in the report, and retry AppInspect validation."
APPINSPECT_COMPLETION_TIMEOUT = 14400  # timeout of 4 hours
APPINSPECT_COMPLETION_TIMEOUT_PAYLOAD = "The AppInpsect request took more than " \
                                        + str(APPINSPECT_COMPLETION_TIMEOUT/3600) + " "\
                                        "hours to complete."


class AppInspectValidateCommand(CommandBase):
    """ Validate an app package and return the validation report
    """

    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)
        self._splunk_home = ioc.components.splunk_home()

        configuration = ioc.components.configuration()
        self._username = configuration.get_string("app_inspect_username", default=DEFAULT_ADMIN_USERNAME)
        self._password = configuration.get_string("app_inspect_password", default=DEFAULT_ADMIN_PASSWORD)
        self._endpoint = configuration.get_string("app_inspect_endpoint", default=DEFAULT_ENDPOINT)
        self._auth_endpoint = configuration.get_string("app_inspect_auth_endpoint", default=DEFAULT_AUTH_ENDPOINT)
        self._validate_tags = configuration.get_string("app_inspect_validate_tags", default=DEFAULT_VALIDATE_TAGS)
        stack = ioc.components.stack()
        self.stack_id = stack.get_stack_id()
        self.private_app_vetting_global = configuration.get_boolean("private_app_vetting_global", default=False)
        # if private_app_vetting_global feature flag is enabled
        if self.private_app_vetting_global:
            self._validate_tags = configuration.get_string("private_app_vetting_app_inspect_validate_tags",
                                                           default=DEFAULT_VALIDATE_TAGS_CLASSIC)

    def execute(self, command):
        """ Execute the validation
        """
        package_name = command.get_value(("payload", "package"))
        prevetted_mode = command.get_value(("payload", "prevetted_mode"), default=False)
        unvetted_package = os.path.join(
            self._splunk_home.unvetted_apps(), package_name
        )

        success = True
        payload = dict(package=package_name)
        package_status = PackageStatus.UNKNOWN
        request_id = status_data = report_data = html_report_data = None
        description = "AppInspect validation complete for %s" % package_name

        try:
            client = self._authenticate(command.get_value(("payload", "token"), raise_error=False))
            request_id = self._validate(client, name=package_name, package=unvetted_package,
                                        prevetted_mode=prevetted_mode)
            status_data = self._get_status(client, request_id, self._validate_tags)
            report_data = self._get_report(client, request_id, output_mode="json", included_tags=self._validate_tags)
            html_report_data = self._get_report(
                client, request_id, output_mode="html", included_tags=self._validate_tags)
            package_status = self._get_pacakge_status(status_data, prevetted_mode)

            if package_status == PackageStatus.APPROVED:
                payload["package"] = self._fix_package_format(name=package_name, package=unvetted_package)
            if package_status == PackageStatus.REJECTED and prevetted_mode:
                self._logger.error(APPINSPECT_REJECTED)
                payload["errors"] = [{
                    "type": "AppUpload_Rejected",
                    "payload": APPINSPECT_REJECTED
                }]
        except ApiErrorException as ex:
            success = False
            description = str(ex)
            payload["errors"] = [{
                "type": ex.type,
                "payload": ex.payload
            }]
            package_status = PackageStatus.FAILED
        finally:
            if request_id:
                payload["requestID"] = request_id
            if status_data:
                payload["statusData"] = status_data
            if report_data:
                payload["reportData"] = report_data
            payload["packageStatus"] = package_status
            if html_report_data:
                payload["htmlReportData"] = html_report_data

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

    def _authenticate(self, token):
        """
        Authenticate with app inspect
        """
        try:
            auth = Auth(self._auth_endpoint)
            if token:
                auth.token = token
            else:
                auth.authenticate(self._username, self._password)

            return Client(auth, self._endpoint)
        except AppInspectClientAuthenticationException as ex:
            raise ApiErrorException("AppUpload_InspectAuthentication", dict(message=str(ex)))
        except (ConnectionError, MissingSchema) as ex:
            raise ApiErrorException("AppUpload_InspectConnection", dict(message=str(ex)))

    def _validate(self, client, name, package, prevetted_mode=False):
        """
        Validate app package
        """
        try:
            params = {
                "app_package": toDefaultStrings(package),
                "app_package_name": name,
                "included_tags": self._validate_tags.split(",")
            }
            # if private_app_vetting_global feature flag is enabled
            if self.private_app_vetting_global:
                params["stack_id"] = self.stack_id
            self._logger.info("Params used for appinspect _validate method: %s", params)
            if prevetted_mode:
                validate_data = client.get_validation_result(package, self._validate_tags)
            else:
                validate_data = client.validate(**params)
            self._logger.info("Request ID of appinspect _validate method: %s", validate_data["request_id"])
            return validate_data["request_id"]
        except AppInspectValidationException as ex:
            raise ApiErrorException("AppUpload_InspectValidation", dict(message=str(ex)))
        except ConnectionError as ex:
            raise ApiErrorException("AppUpload_InspectConnection", dict(message=str(ex)))

    def _get_pacakge_status(self, status_data, prevetted_mode):
        """
        Get the package status based on status data
        """
        failure_count = status_data["info"]["failure"] + status_data["info"]["manual_check"]
        if prevetted_mode:
            failure_count += status_data["info"]["error"]
        if failure_count > 0:
            return PackageStatus.REJECTED
        return PackageStatus.APPROVED

    def is_timed_out(self, start_time, timeout):
        """
        Check if current time execeeds timeout duration
        """
        curr_time = time.time()
        return curr_time > start_time + timeout

    def _get_status(self, client, request_id, included_tags=None):
        """
        Get the status of the validation request
        """
        try:
            start_time = time.time()
            while True:
                status_data = client.get_status(request_id=request_id, included_tags=included_tags)
                self._logger.info("AppInspect validation status for %s: %s", request_id, status_data.get("status"))
                if status_data.get("status") == "SUCCESS":  # pylint: disable=no-else-return
                    if not status_data["info"]:  # pylint: disable=no-else-raise
                        # sometimes we get a success and the "info" field is empty
                        self._logger.error("AppInspect status returned SUCCESS, but there is no info!")
                        raise ApiErrorException("AppUpload_InspectStatus")
                    elif status_data["info"]["error"] > 0:
                        # errors are because of app inspect tooling issues
                        self._logger.error("AppInspect status returned SUCCESS, but there were internal errors!")
                        raise ApiErrorException("AppUpload_InspectStatus")
                    del status_data["links"]  # cleanup unused links section
                    return status_data
                elif status_data.get("status") in ["ERROR", "FAILURE"]:
                    raise ApiErrorException("AppUpload_InspectStatus")
                elif self.is_timed_out(start_time, APPINSPECT_COMPLETION_TIMEOUT):
                    self._logger.error("App validation failed: Request timed out."
                                       "Try to upload your app again, "
                                       "or contact Splunk Support regarding an AppInspect timeout failure.")
                    raise AppInspectTimeOutException(APPINSPECT_COMPLETION_TIMEOUT_PAYLOAD)
                time.sleep(10)  # check again after some delay
        except AppInpsectStatusException as ex:
            raise ApiErrorException("AppUpload_InspectStatus", dict(message=str(ex)))
        except ConnectionError as ex:
            raise ApiErrorException("AppUpload_InspectConnection", dict(message=str(ex)))
        except AppInspectTimeOutException as ex:
            raise ApiErrorException("AppUpload_InspectTimeOut", dict(message=str(ex)))

    def _get_report(self, client, request_id, output_mode, included_tags=None):
        """
        Get the final report of the validation request
        """
        try:
            report_data = client.get_report(
                request_id=request_id, output_mode=output_mode, included_tags=included_tags)
            if output_mode == "json":
                del report_data["links"]  # cleanup unused links section
                del report_data["cloc"]   # remove line count output
            return report_data
        except AppInpsectReportException as ex:
            raise ApiErrorException("AppUpload_InspectReport", dict(message=str(ex)))
        except ConnectionError as ex:
            raise ApiErrorException("AppUpload_InspectConnection", dict(message=str(ex)))

    def _fix_package_format(self, name, package):
        """
        'Fix' application package that could be in zip format by repacking it into tar.gz
        """
        split_name = os.path.splitext(name)
        if split_name[-1] == ".zip":
            name = split_name[0] + ".tar.gz"  # new package name
            self._logger.info("repacking package to %s", name)
            try:
                # extract zip to temp and pack it to tar.gz
                with zipfile.ZipFile(package) as archive:
                    with make_temp() as temp_extracted_package:
                        archive.extractall(temp_extracted_package)
                        with tarfile.open(os.path.join(self._splunk_home.unvetted_apps(), name), "w:gz") as tar:
                            app_id = os.listdir(temp_extracted_package)[0]
                            tar.add(os.path.join(temp_extracted_package, app_id), arcname=app_id)
                        # remove zip, it's redundant now
                        os.remove(package)
            except Exception as ex:
                # strange, the package has been approved by appinspect but we cannot open it
                self._logger.error("cannot repack package %s", str(ex))
                raise ApiErrorException("AppUpload_BadPackage", dict(message=str("Cannot extract zipfile contents.")))

        return name  # return updated package name
