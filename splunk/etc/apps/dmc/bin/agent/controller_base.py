"""
Contains implementation of base controller
"""

import abc
import logging
import threading
import traceback
import six

from agent import ioc


@six.add_metaclass(abc.ABCMeta)
class ControllerBase(ioc.Component):
    """Base controller implementation

    Allows to implement periodic actions in background threads
    """

    def __init__(self, events=None, wait_timeout=60):
        self.__wait_timeout = wait_timeout
        classname = self.__class__.__name__
        self.__thread = threading.Thread(name=classname + "Thread",
                                         target=self.__background_controller)
        self.__thread.daemon = True
        self.__sleep_condition = threading.Condition()
        if events:
            eventaggregator = ioc.components.event_aggregator()
            for event in events:
                eventaggregator.subscribe(event, self.notify)
        self.__terminated = False

        self._logger = logging.getLogger(classname)

    def start(self):
        """Start background controller
        """
        self._logger.debug("Starting thread")
        self.__thread.start()
        self._logger.debug("Thread started")

    def stop(self):
        """Stop background controller
        """
        self._markterminated()
        self._logger.debug("Marked thread as terminated")
        self.notify()
        self.__thread.join()

    def notify(self):
        """Notify/wake-up thread
        """
        self._logger.debug("Notifying condition")
        with self.__sleep_condition:
            self.__sleep_condition.notify_all()

    def isterminated(self):
        """Check if thread is terminated
        """
        return self.__terminated

    def _markterminated(self):
        """Terminate thread, this is async call
        """
        self.__terminated = True

    def _is_thread_alive(self):
        """Verify if background thread still alive
        """
        return self.__thread.is_alive()

    def _join_thread(self):
        """
        Wait for when thread will be terminated
        """
        self.__thread.join()

    def __background_controller(self):
        """Background method
        """
        while True:
            if self.isterminated():
                return

            try:
                self._background_iteration()
            # We want to catch all exceptions here to be sure that controller
            # can recover itself
            # pylint: disable=bare-except
            except:  # noqa: E722
                # pylint: enable=bare-except
                self._logger.error("Exception raised on iteration: %s", traceback.format_exc())

            if self.isterminated():
                return

            # Wait N seconds for new tasks or verify on its own
            with self.__sleep_condition:
                self._logger.debug("Sleeping for %d seconds",
                                   self.__wait_timeout)
                self.__sleep_condition.wait(self.__wait_timeout)

    @abc.abstractmethod
    def _background_iteration(self):
        """Override this method to implement background iteration
        """
        raise NotImplementedError("Please Implement this method (_background_iteration)")
