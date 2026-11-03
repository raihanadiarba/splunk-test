"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Modular input for the Spacebridge app which upgrades kvstore schema/collections
"""
import logging

from spacebridgeapp.util import py23
py23.setup_environment_for_modular_input()

import asyncio
from spacebridgeapp.migration.kvstore_update import KVStoreUpdate
from spacebridgeapp.rest.clients.async_client_factory import AsyncClientFactory
from spacebridgeapp.util.base_modular_input import BaseModularInput


class SSGKVStoreUpgradeInput(BaseModularInput):
    title = "Splunk Secure Gateway KVStore Upgrade"
    description = "Updates kvstore collections to the proper state"
    app = "Splunk Secure Gateway"
    name = "splunk_secure_gateway"
    use_kvstore_checkpointer = False
    use_hec_event_writer = False
    log_mod_input_name = "ssg_kvstore_upgrade.app"
    run_on_captain_only = True

    def do_run(self, input_config):
        if not super(SSGKVStoreUpgradeInput, self).do_run(input_config):
            return

        try:
            self.__do_kvstore_upgrade()
        except Exception as e:
            logging.exception("KVStore upgrade failed {}".format(e))

    def __do_kvstore_upgrade(self):
        client = AsyncClientFactory(self.logger, self.config, None).kvstore_client()
        kvstore_upgrade = KVStoreUpdate(self.logger, client, self.session_key)
        asyncio.run(kvstore_upgrade.run_upgrades())


if __name__ == '__main__':
    modular_input = SSGKVStoreUpgradeInput()
    modular_input.execute()
