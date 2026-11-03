"""
Transaction manager
"""

import functools
import logging
import traceback

from threading import RLock

from agent import ioc


# pylint: disable=too-few-public-methods
class Transaction():
    """Transaction
    """

    def __init__(self, lock, blocking):
        self._logger = logging.getLogger(self.__class__.__name__)
        self._lock = lock
        self._locked = False
        self._blocking = blocking

    def __enter__(self):
        self._logger.debug("Acquiring lock")
        self._locked = self._lock.acquire(blocking=self._blocking)
        self._logger.debug("Acquired lock")
        return self._locked

    def __exit__(self, exc_type, exc_value, tracebackobj):
        self._logger.debug("Releasing lock")
        if not self._locked:
            assert not self._blocking
            self._logger.debug("Lock hasn't been acquired")
            return
        self._lock.release()
        self._logger.debug("Released lock")
        if exc_type or exc_value or tracebackobj:
            self._logger.warning("Released with exception: %s - %s\n%s",
                                 exc_type,
                                 exc_value,
                                 "".join(traceback.format_tb(tracebackobj)))


class TransactionManager(ioc.Component):

    """Very simple implementation of transaciton manager.

    One lock per whole process, RLock allows to accure the same lock
    more than once in the same thread.

    We use one transaction manager for protecting all writes.

    Use it like

    with tm.transaction():
        do_write()
    """

    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)
        self._lock = RLock()

    def transaction(self, lock=None, blocking=True):
        """Create new transaction
        """
        self._logger.debug("Transaction requested")
        return Transaction(lock or self._lock, blocking)
# pylint: enable=too-few-public-methods


def wtransaction(func):
    """Wraps call to this function with write transaction
    """
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        """Wrapper
        """
        transactionmanager = ioc.components.transaction_manager()
        with transactionmanager.transaction():
            return func(*args, **kwargs)
    return wrapper
