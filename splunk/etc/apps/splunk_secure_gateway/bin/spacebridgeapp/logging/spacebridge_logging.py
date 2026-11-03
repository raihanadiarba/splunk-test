"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Logging helper module
"""
import logging
import traceback

from spacebridgeapp.logging.setup_logging import setup_logging as itoa_logger
from spacebridgeapp.logging import context_logger

context_logger.override_logger()


def get_log_level(config):
    """
    Helper method to get log_level from config and validate value or else return default
    :return:
    """
    log_level = config.get_log_level()
    if log_level is not None:
        log_level = log_level.strip().upper()
        if log_level == 'CRITICAL':
            return logging.CRITICAL
        elif log_level == 'ERROR':
            return logging.ERROR
        elif log_level == 'WARNING' or log_level == 'WARN':
            return logging.WARNING
        elif log_level == 'DEBUG':
            return logging.DEBUG
    # default value
    return logging.INFO


def setup_logging(log_name, logger_name, config=None, level=None):
    if config is not None:
        level = get_log_level(config)

    if level is None:
        level = logging.INFO

    return itoa_logger(log_name, logger_name, level=level)

"""
No-op logger
Log an error when function calls are made
"""
class NoopLogger:
    def __init__(self, logger: logging.Logger):
        self.logger = logger

    def __noop(self, *_args, **_kwargs):
        pass

    def __getattr__(self, _):
        stack = traceback.format_stack()
        stack.pop()
        stack_str = "".join(stack)
        self.logger.error(f"[ERROR] Method on uninitialized object invoked.\n\n{stack_str}")
        return self.__noop
