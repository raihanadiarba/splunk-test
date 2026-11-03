"""
change admin password
"""
import traceback
import sys
from agent import ioc
from agent.splunklib.binding import HTTPError
from agent.commands import RemoteRestCommandBase, CommandResult
from agent.common.helpers import generate_passkey

# pylint: disable=no-name-in-module
# pylint: disable=import-error
if sys.version_info >= (3, 0):
    from urllib.parse import quote
else:
    from urllib import quote
# pylint: enable=no-name-in-module
# pylint: enable=import-error


class ChangeUserPasswordCommand(RemoteRestCommandBase):
    """change admin password command
    """

    def __init__(self):
        super(ChangeUserPasswordCommand, self).__init__()
        self.__instances_service = ioc.services.instances_service()

    def execute_rest(self, command, service):
        username = command.get_value(("payload", "username"))
        password = generate_passkey()

        try:
            result = service.post("/services/authentication/users/" + quote(username), password=password).body.read()
        except HTTPError as exc:
            self._logger.warning("Failed to change password: %s", traceback.format_exc())
            return CommandResult(False,
                                 True,
                                 "Failed to change %s password" % (username,),
                                 {"exception": str(exc)})

        key = self._securestorage.encrypt(password)
        return CommandResult(True,
                             False,
                             "Changed %s password" % (username,),
                             {"password": key,
                              "result": result})
