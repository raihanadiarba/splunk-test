"""
Update DMC stanza command
"""

import copy

from agent import ioc
from agent.commands import DMCRestCommandBase, CommandResult
from agent.common.helpers import ensure_str


class UpdateStanzaCommand(DMCRestCommandBase):
    """Command to update stanza (currently only on DMC server)
    """

    def __init__(self):
        super(UpdateStanzaCommand, self).__init__()
        self.__securestorage = ioc.services.secure_storage()

    def execute_rest(self, command, service):
        """
        Update stanza
        """
        conf_name = ensure_str(command.get_value(("target", "conf")))
        stanza_name = ensure_str(command.get_value(("target", "stanza")))
        values = copy.deepcopy(command.get_value("payload"))
        self.__securestorage.decrypt_all_secrets(values)

        conf = service.confs[conf_name]

        if stanza_name not in conf:
            conf.create(stanza_name)
        stanza = conf[stanza_name]
        stanza.submit(values)

        return CommandResult(True, False, "Update stanza %s in %s" % (stanza_name, conf_name), None)
