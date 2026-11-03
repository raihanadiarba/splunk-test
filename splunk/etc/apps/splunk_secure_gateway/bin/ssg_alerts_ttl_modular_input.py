"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Modular input which periodically goes and deletes old alerts from KV Store
"""
from spacebridgeapp.util import py23
py23.setup_environment_for_modular_input()

from spacebridgeapp.util.base_modular_input import BaseModularInput
from spacebridgeapp.util import constants
from spacebridgeapp.util.alerts_ttl_utility import AlertsTtlUtility
from spacebridgeapp.rest.services.kvstore_service import KVStoreCollectionAccessObject
from spacebridgeapp.util.time_utils import get_current_timestamp


class AlertsTTLModularInput(BaseModularInput):
    title = 'Splunk Secure Gateway Mobile Alerts TTL'
    description = 'Cleans up storage of old mobile alerts'
    app = 'Splunk Secure Gateway'
    name = 'splunk_secure_gateway'
    use_kvstore_checkpointer = False
    use_hec_event_writer = False
    ttl_days = "ttl_days"
    input_config_key = "ssg_alerts_ttl_modular_input://default"
    log_mod_input_name = 'ssg_alerts_ttl_modular_input.app'
    run_on_captain_only = True

    def do_run(self, input_config):
        """
        Executes the modular input using the input config which specifies TTL for alerts
        """
        if not super(AlertsTTLModularInput, self).do_run(input_config):
            return

        logger = self.logger

        self.delete_old_snoozes(logger)
        self.delete_expired_user_snoozes(logger)

        logger.info("Running Alerts TTL modular input with input=%s" % str(input_config))
        alerts_ttl_utility = AlertsTtlUtility(logger,
                                              self.session_key,
                                              float(input_config[self.input_config_key][self.ttl_days]))
        alerts_ttl_utility.run()

    def extra_arguments(self):
        """
        Override extra_arguments list for modular_input scheme
        :return:
        """
        return [{'name': 'ttl_days',
                 'title': 'TTL in Days',
                 'description': 'Alert ttl specified in days'}]

    def delete_old_snoozes(self, logger):
        """
        Deletes snoozes which have expired, i.e. their end time is less than the current timestamp
        """

        # TODO: Add snooze_by_id collection once thats added
        access_object = KVStoreCollectionAccessObject(
            collection=constants.SNOOZED_SCOPES_COLLECTION_NAME,
            session_key=self.session_key,
        )

        try:
            current_timestamp = get_current_timestamp()
            query = {constants.END_TIME: {constants.LESS_THAN_OPERATOR: str(int(current_timestamp))}}
            # Using string comparision here seems a little dangerous, but because get_current_timestamp returns an
            # int (casted for future proofing), and ascii comparison works between two integers, this should be fine
            access_object.delete_items_by_query(query)
            logger.debug('Deleted expired snoozes with query %s', query)
        except Exception as e:
            logger.exception('Exception deleting expired snoozes, with exception %s', e)

    def delete_expired_user_snoozes(self, logger):
        """
        Deletes the user snoozes which have expired, i.e. their end time is less than the current timestamp
        """

        access_object = KVStoreCollectionAccessObject(
            collection=constants.USER_SNOOZES_COLLECTION_NAME,
            session_key=self.session_key,
        )

        try:
            current_timestamp = get_current_timestamp()
            query = {constants.END_TIME: {constants.LESS_THAN_OPERATOR: int(current_timestamp)}}
            access_object.delete_items_by_query(query)
            logger.debug('Deleted expired user snoozes with query %s', query)
        except Exception as e:
            logger.exception('Exception deleting expired user snoozes, with exception %s', e)


if __name__ == "__main__":
    worker = AlertsTTLModularInput()
    worker.execute()
