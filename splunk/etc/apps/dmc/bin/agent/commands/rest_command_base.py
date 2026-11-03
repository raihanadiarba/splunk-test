"""Base class with the helper methods to execute Rest calls
"""
import logging
import abc
import traceback
from functools import wraps

from agent.commands import CommandBase, CommandResult
from agent import ioc
from agent.splunklib.binding import HTTPError


def get_remote_service_from_topology_info(splunk_host, secure_storage, node_info):
    """
    Get a remote service
    """
    url = node_info["mgmtUri"]
    pass_key = secure_storage.decrypt(node_info["secret"])
    return splunk_host.get_remote_service(url, pass_key)


def response_decorator(func):
    """Decorator to handle response
    """
    @wraps(func)
    def wrapper(self, service, params, url=None):
        """Wrapper to make the rest call and return the result as CommandResult
        """
        success = True
        if url is None:
            url = self.REST_URL

        assert url
        ex = None
        try:
            result = func(self, service, params, url)
        except HTTPError as err:
            ex = err
            # pylint: disable=protected-access
            self._logger.warning("Failed to make rest call to URL : %s with exception %s",
                                 self.REST_URL,
                                 traceback.format_exc())
            # pylint: enable=protected-access
            result = {
                "error": str(ex)
            }
            success = False

        return CommandResult(completed=success,
                             failed=not success,
                             description=self.MESSAGES[str(success)],
                             payload=result,
                             error_ex=ex)
    return wrapper


class RestCommandBase(CommandBase):
    """Base class to make REST calls using service
    """
    REST_URL = None
    MESSAGES = {"True": "Command executed successfully",
                "False": "Failed to execute command"}

    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)
        self._splunk_host = ioc.components.splunk_host()

    # pylint: disable=no-self-use
    @abc.abstractmethod
    def execute(self, command):
        """To be implemented by child classes
        """

    @response_decorator
    def get(self, service, params=None, url=None):
        """Make get request on the service
        """
        return service.get(url, **params).body.read()

    @response_decorator
    def post(self, service, params=None, url=None):
        """Make post on the service
        """
        return service.post(url, **params).body.read()

    @response_decorator
    def delete(self, service, params=None, url=None):
        """Make a delete request on the service
        """
        return service.delete(url, **params).body.read()
    # pylint: enable=no-self-use
