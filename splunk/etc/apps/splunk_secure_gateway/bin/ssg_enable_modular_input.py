"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Modular input used to determine if Splunk Secure Gateway modular inputs should be enabled
"""
import time
import warnings

warnings.filterwarnings('ignore', '.*service_identity.*', UserWarning)

from spacebridgeapp.util import py23
py23.setup_environment_for_modular_input()

from spacebridgeapp.util.base_modular_input import BaseModularInput
from spacebridgeapp.util import constants
from spacebridgeapp.rest.services import splunk_service
from spacebridgeapp.access.access_control import allow_access

_OPTIN_APPROVED_SLEEP_DELAY_SECONDS=300

class EnableModularInput(BaseModularInput):
    """
    Modular input to determine if other modular inputs should be enabled
    """
    title = 'Splunk Secure Gateway Enable'
    description = 'Determine if Splunk Secure Gateway core modular inputs should be enabled'
    app = 'Splunk Secure Gateway'
    name = 'splunk_secure_gateway'
    use_kvstore_checkpointer = False
    use_hec_event_writer = False
    input_name = "ssg_enable_modular_input"
    input_config_key = f"{input_name}://default"
    log_mod_input_name = "secure_gateway_enable.app"
    log_filename = f"{constants.SPACEBRIDGE_APP_NAME}_metrics.log"
    monitor_parent_process = True
    shutdown = False

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
        Main entry path for input
        """
        # Modular Input will only run if server contains kv_store role
        if not super(EnableModularInput, self).do_run(input_config):
            return

        logger = self.logger

        # Check if access is allowed, if not just exit out of modular_input
        if not allow_access(self.session_key):
            return

        # We have passed the checks so we can enable the core modular_inputs
        modular_input_names = splunk_service.get_ssg_mod_inputs(self.session_key, [self.input_name])
        logger.debug("Enabling the following SSG modular_inputs=%s", modular_input_names)
        for modular_input_name in modular_input_names:
            if not splunk_service.is_ssg_mod_input_enabled(modular_input_name, self.session_key):
                splunk_service.enable_ssg_mod_input(modular_input_name, self.session_key)

        # customer is opted in and all the modular inputs have been enabled, sleep to prevent pointless work
        for _ in range(_OPTIN_APPROVED_SLEEP_DELAY_SECONDS):
            if self.shutdown:
                break
            time.sleep(1)

    def on_process_is_orphan(self):
        self.shutdown = True


if __name__ == "__main__":
    worker = EnableModularInput()
    worker.execute()
