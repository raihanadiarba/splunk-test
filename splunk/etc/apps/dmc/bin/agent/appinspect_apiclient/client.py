import hashlib
import logging
import requests
from . auth import Auth
from . exceptions import AppInspectValidationException, AppInpsectStatusException, \
    AppInpsectReportException
from agent import ioc

logger = logging.getLogger(__name__)

DEFAULT_ENDPOINT = "https://appinspect.splunk.com/v1"
ERROR_MESSAGE = {
    "UNAUTHORIZED": "Incorrect username or password for Splunk credentials.",
    "NOT_FOUND": ("This app has not been submitted to AppInspect. "
                  "Submit your app to AppInspect for validation."),
    "FORBIDDEN": ("You are not authorized to install this app. "
                  "You must submit the app to AppInspect, "
                  "and specify the same credentials as those "
                  "used for AppInspect."),
    "IN_PROGRESS": ("AppInspect validation is in progress. "
                    "Try again later"),
    "VALIDATION_FAILED": ("This app has failed AppInspect validation. "
                          "Fix the issues in the report, "
                          "and retry AppInspect validation."),
    "GENERAL_ERROR": ("Unable to retrieve AppInspect validation result. "
                      "Try again later.")
}


class Client(object):

    def __init__(self, auth, endpoint=DEFAULT_ENDPOINT):
        self.auth = auth
        self.endpoint = endpoint
        configuration = ioc.components.configuration()
        self.private_app_vetting_global = configuration.get_boolean("private_app_vetting_global", default=False)
        self.request_timeout = configuration.get_int("app_inspect_prevetted_endpoint_timeout", default=20)

    def generate_SHA(self, filepath, included_tags="", excluded_tags=""):
        """
        Generates SHA of a given file. SHA variant: 256
        Following the same guidance from AppInspect SHA generate logic
        :param filepath: uploaded file path
        :param str included_tags: included tags for hash
        :param str excluded_tags: excluded tags for hash
        :return: hash value of the file
        """
        file_hash = hashlib.sha256()

        APP_READ_BUFFER_SIZE = 65535

        with open(filepath, "rb") as file_obj:
            content = file_obj.read(APP_READ_BUFFER_SIZE)
            while content:
                file_hash.update(content)
                content = file_obj.read(APP_READ_BUFFER_SIZE)

        hash_value = file_hash.hexdigest()
        logger.info('SHA256 of file %s is: %s', filepath, hash_value)
        return hash_value

    def get_validation_result(self, filepath, included_tags):
        """
        Use generated SHA value to retrieve validation result of the app.

        :type filepath: string
        :param filepath: uploaded file path
        :type included_tags: string
        :param included_tags: included tags for hash

        :rtype: str
        :return: validation response content
        """
        sha = self.generate_SHA(filepath)
        url = "{}/app/validate/status/{}".format(self.endpoint, sha)
        token = "bearer {}".format(self.auth.token)
        headers = {'Authorization': token}
        params = {}
        if included_tags is not None:
            params["included_tags"] = included_tags
        try:
            logger.info("Validating app with url: {}, params: {}".format(url, params))
            response = requests.get(
                url=url,
                params=params,
                headers=headers,
                timeout=self.request_timeout
            )
            # AppInspect responded with 404 Not Found:
            # SHA is not matching with any values on AppInspect
            if response.status_code == 404:
                message = ERROR_MESSAGE["NOT_FOUND"]
                logger.exception(message)
                raise AppInspectValidationException(message)

            # AppInspect responded with 403 Forbidden
            # Splunk credentials used to submit app on AppInspect is not
            #   matching with the user that uploads app on stack
            elif response.status_code == 403:
                message = ERROR_MESSAGE["FORBIDDEN"]
                logger.exception(message)
                raise AppInspectValidationException(message)

            # AppInspect responded with 200 Success
            # App can be found on AppInspect via SHA, but needs further
            #   if check to determine it passes validation
            elif response.status_code == 200:
                content = response.json()

                # App is still pending validation:
                if content.get("status") == "PROCESSING":
                    message = ERROR_MESSAGE["IN_PROGRESS"]
                    logger.exception(message)
                    raise AppInspectValidationException(message)
                return content

            # AppInspect responded with other status code
            else:
                logger.exception(ERROR_MESSAGE["GENERAL_ERROR"])
                raise AppInspectValidationException(ERROR_MESSAGE["GENERAL_ERROR"])

        except AppInspectValidationException:
            raise
        except requests.exceptions.Timeout:
            logger.exception(ERROR_MESSAGE["GENERAL_ERROR"])
            raise AppInspectValidationException(ERROR_MESSAGE["GENERAL_ERROR"])
        except Exception as e:
            logger.exception(str(e))
            raise AppInspectValidationException(message=str(e))

    def validate(self, *args, **kwargs):
        """POST /app/validate
        """
        url = "{}/app/validate".format(self.endpoint)
        token = "bearer {}".format(self.auth.token)
        app_package = kwargs.get('app_package')
        stack_id = kwargs.get('stack_id')
        headers = {'Authorization': token}
        files = {}
        if isinstance(app_package, str):
            files['app_package'] = open(app_package, 'rb')
        else:
            files['app_package'] = app_package
        data = {}
        # if private_app_vetting_global feature flag is enabled
        if self.private_app_vetting_global:
            data["stack_id"] = stack_id
        logger.info("Submit app to AppInspect with url: {}, data: {}".format(url, data))
        response = requests.post(
            url=url,
            data=data,
            headers=headers,
            files=files
        )
        if response.status_code == 200:
            return response.json()
        else:
            try:
                # add response message to the error
                raise AppInspectValidationException(response.json().get("message"))
            except ValueError:
                # non json content
                raise AppInspectValidationException(
                    "Received status code {} from url: {}".format(response.status_code, url))

    def get_status(self, request_id, included_tags=None):
        """GET /app/validate/status/{request_id}
        """
        url = "{}/app/validate/status/{}".format(self.endpoint, request_id)
        token = "bearer {}".format(self.auth.token)
        headers = {'Authorization': token}
        params = {}
        if included_tags is not None:
            params["included_tags"] = included_tags
        logger.info("Checking validation status with url: {}, params: {}".format(url, params))
        response = requests.get(url=url, params=params, headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            raise AppInpsectStatusException("Received status code {} from url: {}".format(response.status_code, url))

    def get_report(self, request_id, output_mode="json", included_tags=None):
        """GET /app/report/{request_id}
        output_mode specifies desired format (json/html). Html is a verbose report produced by app verifier that
        can (and should) be displayed "as is", i.e., as a standalone webpage
        """
        url = "{}/app/report/{}".format(self.endpoint, request_id)
        auth_token = "bearer {}".format(self.auth.token)
        params = {}
        if included_tags is not None:
            params["included_tags"] = included_tags
        logger.info("Retrieve AppInspect report with url: {}, params: {}".format(url, params))
        response = requests.get(
            url=url,
            params=params,
            headers={
                "Authorization": auth_token,
                "Content-Type": "application/json" if output_mode == "json" else "text/html"
            }
        )
        if response.status_code != 200:
            raise AppInpsectReportException("Received status code {} from url: {}".format(response.status_code, url))

        return response.json() if output_mode == "json" else response.text

    @staticmethod
    def get_client(auth_endpoint, endpoint, username, password):
        """
        Convenience method to get an App Inspect Client instance
        """
        auth = Auth(endpoint=auth_endpoint)
        auth.authenticate(username=username, password=password)
        return Client(auth, endpoint=endpoint)
