"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Modular Input for refreshing the list of registered users
"""

import warnings

warnings.filterwarnings('ignore', '.*service_identity.*', UserWarning)

from spacebridgeapp.util import py23, constants
py23.setup_environment_for_modular_input()

from spacebridgeapp.util.base_modular_input import BaseModularInput
from spacebridgeapp.util.splunk_utils.common import modular_input_should_run
from spacebridgeapp.util.constants import SPACEBRIDGE_APP_NAME
from spacebridgeapp.users.registered_users_sync import RegisteredUsersSync
from spacebridgeapp.rest.services.splunk_service import get_splunk_auth_type


class RegisteredUsersListModularInput(BaseModularInput):
    title = 'Splunk Secure Gateway Registered Users List'
    description = 'Sync the list of registered gateway users'
    app = 'Splunk Secure Gateway'
    name = 'splunk_secure_gateway'
    use_kvstore_checkpointer = False
    use_hec_event_writer = False
    input_config_key = "ssg_registered_users_list_modular_input://default"
    log_mod_input_name = "ssg_registered_users_list_modular_input.app"
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

        if not super(RegisteredUsersListModularInput, self).do_run(input_config):
            return

        logger = self.logger

        if get_splunk_auth_type(logger, authtoken=self.session_key) == constants.SAML:
            logger.debug("Registered Users List modular input should not run on SAML environment")
            return

        logger.info("Running Registered Users List modular input on search captain node")
        registered_users_sync = RegisteredUsersSync(logger, self.session_key)

        try:
            registered_users_sync.run()
        except Exception:
            logger.exception("Failure encountered while running Registered Users List sync")


if __name__ == "__main__":
    worker = RegisteredUsersListModularInput()
    worker.execute()
