"""
Simple controller, which checks if stdin still open and if it does not - kills the process.
This is useful for splunkd -> dmc process communication, when splunkd crashes we also
kill the child process
"""
import os
import sys
import signal

from agent import ControllerBase


class StdinController(ControllerBase):
    """
    Life controller implementation
    """

    def __init__(self):
        super(StdinController, self).__init__(wait_timeout=1)
        self._signal_sent = False
        self._got_shutdown = False

    def stop(self):
        """
        It is ok not to wait this thread, there are no resources we can leak or miss
        """
        self._markterminated()
        sys.stdin.close()
        self.notify()

    def _background_iteration(self):
        if self._signal_sent or self._got_shutdown or self.isterminated():
            return

        line = sys.stdin.readline()
        if not line:
            if not self.isterminated():
                self._logger.warning("Stdin closed, possible that SplunkD crashed. Sending SIGTERM to itself.")
                os.kill(os.getpid(), signal.SIGTERM)
                self._signal_sent = True
        elif line.rstrip() == "shutdown":
            # Splunkd gave us word "shutdown" on stdin, meaning that it will start shutdown procedure now
            self._got_shutdown = True
        else:
            self._logger.warning("Unexpected string on stdin: %s", line)
