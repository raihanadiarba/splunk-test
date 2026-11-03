"""
Deployment Lock
"""
import logging
from contextlib import contextmanager

from agent import ioc
from agent import wtransaction
from agent.models import PersistentData
from agent.models.change import EventType
from agent.repositories.persistent_data_repository import REPOSITORY_DATA_ID_DEPLOYMENT_LOCK


_logger = logging.getLogger(__name__)

_LOCK_EVENT_NAME = "lock"


# pylint: disable=too-many-instance-attributes, useless-object-inheritance
class DeploymentLock(object):
    """Handler of Splunk Deployment Server deploy command.
    """

    def __init__(self, deploy_service):
        self._deploy_service = deploy_service
        self._persistent_data_repository = ioc.repositories.persistent_data_repository()
        self._transaction_manager = ioc.components.transaction_manager()
        self._changelog_service = ioc.services.changelog_service()
        self._cancel_pending_changes_service = ioc.services.cancel_pending_changes_service()
        self._user_context = ioc.components.user_context()
        self._in_runtime_scope = False

    @contextmanager
    def get_runtime_scope(self):
        """
        Get a runtime scope for an DMC operation that will prevent the lock from being granted.
        Only one thread can get the scope at a time.
        """
        granted = False
        try:
            with self._transaction_manager.transaction():

                if not self._in_runtime_scope and not self._is_in_progress():
                    granted = True
                    self._in_runtime_scope = True

            yield granted

        finally:
            with self._transaction_manager.transaction():
                if granted:
                    assert self._in_runtime_scope
                    self._in_runtime_scope = False

                # It is possible for one-shot API  calls to fail and leave entries in the pending log
                # (which may end up in the install log) and files in the pre-deployment folder.
                self._start_cleanup_if_needed()

    @wtransaction
    def lock(self):
        """
        Lock DMC from deployment operations
        :return:
            True if locking is successful, or if a lock is already in place.
            False if a deployment operation is in progress or the last one has failed.
        """
        _logger.debug("Acquiring deployment lock")

        if self._in_runtime_scope:
            return False

        # It is possible for earlier one-shot API  calls to fail and leave entries in the pending log and
        # files in the pre-deployment folder.
        # DMC deploy uses the pending log to decide whether or not to overwrite a bundle in master-apps.
        # We don't want DMC deploy to overwrite apps deployed by Cloud Ops.
        # Cloud Ops locks DMC which calls into this function before a deployment.
        # By clearing the pending log, it is guaranteed that DMC does not overwrite any app deployed by Cloud Ops.
        self._start_cleanup_if_needed()

        if self._is_in_progress():
            return False

        if self._deploy_service.last_deploy_state() == "failed":
            return False

        if not self._persistent_data_repository.exists(REPOSITORY_DATA_ID_DEPLOYMENT_LOCK):
            self._log("lock")
            self._persistent_data_repository.insert(PersistentData({"name": REPOSITORY_DATA_ID_DEPLOYMENT_LOCK}))
        else:
            _logger.info("Lock called while the DMC deployment lock is already in place.")

        return True

    @wtransaction
    def unlock(self):
        """
        Unlock, or do nothing if there's no lock in place.
        """
        _logger.debug("Releasing DMC deployment lock")

        if self._persistent_data_repository.exists(REPOSITORY_DATA_ID_DEPLOYMENT_LOCK):
            self._log("unlock")
            self._persistent_data_repository.delete(REPOSITORY_DATA_ID_DEPLOYMENT_LOCK)
        else:
            _logger.info("Unlock called while no DMC deployment lock is in place.")

    def is_locked(self):
        """
        Return whether or not a lock is in place.
        """
        return self._persistent_data_repository.exists(REPOSITORY_DATA_ID_DEPLOYMENT_LOCK)

    def _log(self, action):
        """
        Log the lock action.
        """
        self._changelog_service.record(EventType.lock, self._user_context.user, action=action, deployed=True)

    def _is_in_progress(self):
        """
        :return: Whether or not a deployment related operation is in progress.
        """
        return \
            self._deploy_service.is_deploy_in_progress() or \
            self._cancel_pending_changes_service.is_cancel_in_progress() or \
            self._has_pending_changes_to_cancel()

    def _has_pending_changes_to_cancel(self):
        """
        :return: Whether or not there are pending changes to cancel.
        """
        if not self._changelog_service.has_pending_changes():
            return False

        if self._deploy_service.is_deploy_in_progress():
            return False

        if self._deploy_service.last_deploy_state() == "failed":
            # The failed deploy task might be started from the last one shot API call or from a previous one shot API
            # call. In case of the latter, there are no pending changes made by the last one shot API call
            # because we don't allow new changes if a deploy task is in progress or failed.
            # So in either case, there are no pending changes to cancel.
            return False

        return True

    def _start_cleanup_if_needed(self):
        """
        Start cleaning up pending changes if there are any and if they are not being processed.
        """

        if not self._has_pending_changes_to_cancel():
            return

        if self._cancel_pending_changes_service.is_cancel_in_progress():
            return

        self._cancel_pending_changes_service.create_cancel_pending_changes_task()
