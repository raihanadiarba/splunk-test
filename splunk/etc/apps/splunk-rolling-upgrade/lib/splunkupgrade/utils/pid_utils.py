import os
import logging
from dataclasses import dataclass
from enum import Enum
import re
from typing import Optional, List
from splunkupgrade.utils.utils import is_linux

logger = logging.getLogger(__name__)

# See https://man7.org/linux/man-pages/man5/proc.5.html
class ProcessStatus(Enum):
    RUNNING = "R"
    SLEEPING = "S"
    DISK_SLEEP = "D"
    ZOMBIE = "Z"
    STOPPED = "T"
    TRACING_STOP = "t"
    PAGING = "W"
    DEAD = "X"
    DEAD_FROM_KERNEL_2_6_33_TO_3_13 = "x"
    WAKEKILL_FROM_KERNEL_2_6_33_TO_3_13 = "K"
    WAKING_FROM_KERNEL_2_6_33_TO_3_13 = "W"
    PARKED_FROM_KERNEL_3_9_TO_3_13 = "P"


@dataclass
class ProcFile:
    pid: int
    executable: str
    process_state: ProcessStatus


class ProcFileParser:
    PROCESS_ID = "(\\d+)"
    FILENAME = "[(]([\\w\\s\\.]+)[)]"
    STATE = f"([{''.join(s.value for s in ProcessStatus)}])"
    PATTERN = f"^{PROCESS_ID}\\s+{FILENAME}\\s+{STATE}\\s+"
    TOTAL_MATCHING_GROUPS = 3

    def __init__(self, proc_file: str):
        self._proc_file = proc_file
        logger.info(f"Parsing proc file = '{proc_file}'")

    def parse(self) -> Optional[ProcFile]:
        if not self._proc_file:
            return None
        res = re.match(self.PATTERN, self._proc_file)
        if not res or len(res.groups()) < self.TOTAL_MATCHING_GROUPS:
            return None
        return ProcFile(int(res.group(1)), res.group(2), ProcessStatus(res.group(3)))


class ProcPid:
    RUNNING_STATUS = [ProcessStatus.RUNNING, ProcessStatus.SLEEPING, ProcessStatus.DISK_SLEEP]

    def __init__(self, pid: int):
        self._proc_stat_path = f"/proc/{pid}/stat"
        logger.info(f"Trying to detect whether pid = '{pid}' is running")

    def _load_proc_stat(self) -> Optional[ProcFile]:
        try:
            with open(self._proc_stat_path, "r") as proc:
                line = proc.readline()
                # Look at https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/fs/proc/array.c#n574
                # Each field are separated with a single space. This is kernel code, so I won't be validating it.
                return ProcFileParser(line).parse()
        except Exception as e:
            logger.error(f"Cannot open {self._proc_stat_path}: {e}")
            return None

    def is_running(self):
        if not os.path.exists(self._proc_stat_path):
            return False

        stats = self._load_proc_stat()
        if not stats:
            return False

        return stats.process_state in self.RUNNING_STATUS


def is_process_running(pid: int) -> bool:
    running_status = ProcPid(pid).is_running() if is_linux() else False
    logger.info(f"pid = '{pid}' {'is' if running_status else 'is not'} running")
    return running_status
