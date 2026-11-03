"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.
"""
import logging

import splunk
import time
import os
from http import HTTPStatus
from spacebridgeapp.rest.services.kvstore_service import KVStoreCollectionAccessObject as KvStore
from spacebridgeapp.request.splunk_auth_header import SplunkAuthHeader
from spacebridgeapp.util import constants
from spacebridgeapp.rest.services.splunk_service import get_all_mobile_users, get_all_users, user_has_registered_devices


class RegisteredUsersSync(object):

    def __init__(self, log: logging.Logger, session_key):
        """
        Registered Users Sync constructor
        :param log:
        :param session_key: session key passed by modular input
        """
        self.log = log
        self.session_key = session_key
        self.system_auth_header = SplunkAuthHeader(self.session_key)

    def run(self):
        """
        Attempts to sync the registered users list. If the kvstore is not yet available, schedules
        a non-blocking retry attempt in 5 seconds
        """
        self.log.info("Attempting Registered Users Sync")
        try:
            self.sync()
        except splunk.RESTException as e:
            if e.statusCode == HTTPStatus.SERVICE_UNAVAILABLE:
                self.log.info(f"KVStore is unavailable with status = {e.statusCode}, ssg registered_users_sync "
                               f"shutting down and retrying later.")
            else:
                raise e

    def sync(self):
        """
        Goes through every user to identify those with registered devices, and syncs to KVstore. The list of
        old_registered_users must be fetched first to avoid a possible race condition.
        :return:
        """
        old_registered_users = get_all_mobile_users(self.session_key)
        all_splunk_users = get_all_users(self.session_key) + ['nobody']
        registered_users = [user for user in all_splunk_users if
                            user_has_registered_devices(self.log, user, self.session_key)]

        kvstore_users = KvStore(constants.REGISTERED_USERS_COLLECTION_NAME, self.session_key)
        try:
            [kvstore_users.insert_single_item({u'_key': user}) for user in registered_users if
             user not in old_registered_users]
            [kvstore_users.delete_item_by_key(user) for user in old_registered_users if
             user not in registered_users]
            self.log.info("Completed Registered Users Sync in process PID=%s", os.getpid())
        except Exception:
            self.log.exception("Exception performing RegisteredUsersSync for collection=%s", constants.REGISTERED_USERS_COLLECTION_NAME)
