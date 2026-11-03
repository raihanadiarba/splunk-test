"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Modular Input for cleaning up stale entries in Registered Devices metadata
"""

import warnings

warnings.filterwarnings('ignore', '.*service_identity.*', UserWarning)

from spacebridgeapp.util import py23
py23.setup_environment_for_modular_input()


from spacebridgeapp.util.base_modular_input import BaseModularInput
from spacebridgeapp.devices.registered_devices_cleanup import RegisteredDevicesCleanup
from spacebridgeapp.util.splunk_utils.common import modular_input_should_run
from spacebridgeapp.util.constants import SPACEBRIDGE_APP_NAME


class RegisteredDevicesModularInput(BaseModularInput):
    title = 'Splunk Secure Gateway Registered Devices'
    description = 'Clean up stale registered devices metadata'
    app = 'Splunk Secure Gateway'
    name = 'splunk_secure_gateway'
    use_kvstore_checkpointer = False
    use_hec_event_writer = False
    input_config_key = "ssg_registered_devices_modular_input://default"
    log_mod_input_name = "ssg_registered_devices_modular_input.app"
    run_on_captain_only = True

    def extra_arguments(self):
        """
        Override extra_arguments list for modular_input scheme
        :return:
        """
        return [
            {
                'name': 'param1',
                'description': 'No params required'
            }
        ]

    def do_run(self, input_config):
        """
        Executes the modular input
        :param input_config:
        :return:
        """

        if not super(RegisteredDevicesModularInput, self).do_run(input_config):
            return

        logger = self.logger

        logger.info("Running Registered Devices Cleanup modular input on search captain node")
        registered_devices_cleanup = RegisteredDevicesCleanup(logger, self.session_key)

        try:
            registered_devices_cleanup.run()
        except Exception:
            logger.warning("Failure encountered while running Registered Devices Cleanup")

if __name__ == "__main__":
    worker = RegisteredDevicesModularInput()
    worker.execute()
