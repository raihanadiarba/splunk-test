"""
(C) 2019 Splunk Inc. All rights reserved.
"""

import os
import platform
from abc import ABCMeta


class AbstractParentProcessMonitor(metaclass=ABCMeta):
    """
    Abstract class to monitor parent processes.
    If parent process is not running, the child process (current process) should be stopped.
    It used to stop modular inputs in Splunk. All modular inputs processes are wrapped by shell parent process.
    When Splunk shuts down, it terminates parent process.
    We have to monitor it, and stop the child (current) process.
    NOTE: solnlib modular inputs abstraction layer, already has similar monitoring system.
    Please use it where possible instead of this class.
    """
    MAC = 'Darwin'
    LINUX = 'Linux'
    WINDOWS = 'Windows'
    MONITOR_FREQENCY_SECONDS = 1

    def __init__(self):
        """
        Set the system os, pid of the parent
        """
        self.system_os = platform.system()

        if self.system_os == self.WINDOWS:
            self.parent_pid = None
        else:
            self.parent_pid = os.getppid()

    def is_parent_process_running(self):
        """
        Check whether the original parent process is still the parent.
        If the parent dies, the OS will re-parent the child process to init (PID 1).
        """
        return os.getppid() == self.parent_pid

