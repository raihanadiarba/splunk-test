""" Command to post a notification to a target
"""

import logging

from requests import ConnectionError  # pylint: disable=redefined-builtin

from agent import ioc
from agent.commands import CommandBase, CommandResult

from agent.splunklib.binding import HTTPError


class PostNotificationCommand(CommandBase):
    """ Command to post a notification to a target
    """

    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)
        self._splunk_host = ioc.components.splunk_host()
        self._secure_storage = ioc.services.secure_storage()

    def execute(self, command):
        """ Execute the command to post a notification to the target
        """

        topology = command.get_value(("payload", "topology"))
        target = command.get_value(("payload", "target"))
        params = command.get_value(("payload", "params"))

        success = True
        description = "Notification %s sent to %s: %s" % (params["name"], target["mgmtUri"], params["value"])

        try:
            passkey = self._secure_storage.decrypt(topology["secret"])
            service = self._splunk_host.get_remote_service(target["mgmtUri"], passkey)
            service.post("/services/messages", **params)
        except (HTTPError, ConnectionError) as ex:
            # Target might be restarting causing connection issues, command will retry automatically
            success = False
            description = str(ex)
            self._logger.warning("Failed to send %s notification to %s", params["name"], target["mgmtUri"])

        if success:
            self._logger.info(description)

        return CommandResult(
            completed=success,
            failed=not success,
            description=description,
            payload=None
        )
