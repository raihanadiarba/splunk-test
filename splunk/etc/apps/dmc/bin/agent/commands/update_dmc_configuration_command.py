"""
Update DMC Configurations command
"""
from agent.commands import DMCRestCommandBase, CommandResult
from agent.splunklib.client import Entity


def _validate_port(port):
    """Validate a port is a valid integer and in the valid range"""
    try:
        parsed_port = int(port)
        valid = 1024 < parsed_port < 65535
        if valid:
            return True
    except ValueError:
        pass

    return False


def _validate_ip(ip_address):
    """Validate an IP is valid"""
    # TODO: SPL-113544 _validate_ip function should be implemented
    return True


class UpdateDMCConfigurationCommand(DMCRestCommandBase):
    """
    Updates DMC configuration settings, including
    disabled = false
    mode = command->payload->mode
    bindAddress = command->payload->bindAddress
    port = command->payload->port
    """

    def execute_rest(self, command, service):
        bind_address = command.get_value(("payload", "bindAddress"))
        port = command.get_value(("payload", "port"))
        mode = command.get_value(("payload", "mode"))

        # Enable [dmc] stanza in server.conf
        dmc_props = dict(disabled=0, mode=mode)

        if bind_address is not None:
            if not _validate_ip(bind_address):
                return CommandResult(False, True, "Invalid bindAddress", None)
            dmc_props["bindAddress"] = bind_address
        if port is not None:
            if not _validate_port(port):
                return CommandResult(False, True, "Invalid port", None)
            dmc_props["port"] = port

        dmc_settings = Entity(service, "/services/dmc-conf/settings/settings", skip_refresh=True)
        dmc_settings.update(**dmc_props)

        return CommandResult(True, False, "DMC Configuration has been updated", None)
