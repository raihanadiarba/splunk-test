"""
Deployment Server reload configuration
"""

# pylint: disable=invalid-name
# pylint: disable=too-few-public-methods
# pylint: disable=too-few-public-methods

import logging

from agent import ioc
from agent.commands import CommandBase, CommandResult

_reload_description_success = \
    "Deployment Server configuration reloaded successfully"


class ReloadDSConfCommand(CommandBase):
    """Deployment Server reload configuration command
    """

    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)
        self._deploy_service = ioc.services.deploy_service()
        self._splunk_service = ioc.components.splunk_host().get_service(owner="nobody")

    def execute(self, command):
        """Execute reload command
        """
        self._logger.debug("reload DS conf")
        is_success, description = self._reload_splunk_conf()
        if is_success:
            description = _reload_description_success
        else:
            self._logger.error("reload DS conf failed, error=%s", description)

        return CommandResult(
            is_success,  # completed
            not is_success,
            description,
            None  # payload
        )

    def _reload_splunk_conf(self):
        """Signal Splunk server to reload its configuration
        """
        is_success = True
        error = ""
        try:
            # reload splunk configuration
            response = self._splunk_service.get(
                "/services/deployment/server/config/_reload")
            if response.status == 200:
                # reload application cache from DS
                self._deploy_service.invalidate_cache(
                    instances_changed=False,
                    groups_changed=False,
                    apps_changed=False,
                    ds_apps_changed=True)
            else:
                is_success = False
                error = response.reason
        # pylint: disable=broad-except
        except Exception as ex:
            is_success = False
            error = str(ex)
        # pylint: enable=broad-except
        return is_success, error
