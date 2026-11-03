# Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.
"""Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved."""
from spacebridgeapp.util.constants import CLOUDGATEWAY
from builtins import object
import logging
import logging.handlers
from splunk import setupSplunkLogger
from splunk.clilib.bundle_paths import make_splunkhome_path
import os
import sys
from future.utils import with_metaclass

# On Windows System, suppress all logging exceptions
# if os.name == 'nt':
#    logging.raiseExceptions = False

LOG_DEFAULT_FMT = '%(asctime)s %(levelname)s [%(name)s] [%(module)s] [%(funcName)s] [%(process)d] %(message)s'
SEARCH_LOG_FILE = '{}.log'.format(CLOUDGATEWAY)

def setup_logging(logfile_name=None, logger_name=None, logger=None, level=logging.INFO,
                  log_format=LOG_DEFAULT_FMT, is_propagate=False):
    '''
    Setup logging

    @param logfile_name: log file name
    @param logger_name: logger name (if logger specified then we ignore this argument)
    @param logger: logger object
    @param level: logging level
    @param log_format: log message format
    @param is_propagate: set to true if you want to propagate log to higher level
    @return: logger
    '''
    if (logfile_name is None or logger_name is None) and logger is None:
        raise ValueError("log_name or logger_name is not specified and logger object is not provided.")

    if logger is None:
        # Logger is singleton so if logger is already defined it will return old handler
        logger = logging.getLogger(logger_name)

    logger = logger.logger if isinstance(logger, CloudgatewayLogger) else logger

    # Save the handlers before overwriting logger
    loghandlers = logger.handlers

    # If handlers is already defined then do not create new handler, this way we can avoid file opening again
    # which is issue on windows see ITOA-2439 for more information
    # Now we are checking if we need create new handler(s)
    hasFileHandler = False
    handlerFormat = None
    for handler in loghandlers:
        if isinstance(handler, logging.FileHandler):
            handlerFormat = handlerFormat if handlerFormat else handler.formatter
            hasFileHandler = True

    # If logger_name is None: will create a child logger with different properties from parent.
    # If the given logger_name is not equal to the existing logger's name, also will create a child logger
    if logger_name is None or logger.name != logger_name:
        # dot(.) in the two log names make the new logger is the child of the existing logger,
        # so new handlers added to the new one will not impact the old one.
        logger = logging.getLogger("%s.%s" % (logger.name, logger_name if logger_name else "sub"))

    logger.propagate = is_propagate  # Prevent the log messages from being duplicated in the python.log file
    logger.setLevel(level)

    if not hasFileHandler:
        logfile = logfile_name
        if os.path.basename(logfile_name) == logfile_name:
            logfile = make_splunkhome_path(['var', 'log', 'splunk', logfile_name])
        #Note that there are still some issues with windows here, going to make it so that we dont
        file_handler = logging.handlers.RotatingFileHandler(logfile, maxBytes=2500000, backupCount=5)
        file_handler.setFormatter(handlerFormat if handlerFormat else logging.Formatter(log_format))
        logger.addHandler(file_handler)

    # Read logging level information from log.cfg so it will overwrite log
    # Note if logger level is specified on that file then it will overwrite log level
    LOGGING_DEFAULT_CONFIG_FILE = make_splunkhome_path(['etc', 'log.cfg'])
    LOGGING_LOCAL_CONFIG_FILE = make_splunkhome_path(['etc', 'log-local.cfg'])
    LOGGING_STANZA_NAME = 'python'
    setupSplunkLogger(
        logger,
        LOGGING_DEFAULT_CONFIG_FILE,
        LOGGING_LOCAL_CONFIG_FILE,
        LOGGING_STANZA_NAME,
        verbose=False
    )

    return logger


UNTRACKED_LOG = "{}.untracked".format(CLOUDGATEWAY)
UNTRACKED_LOG_FILE = "{}_untracked.log".format(CLOUDGATEWAY)

currentframe = lambda: sys._getframe(3)
logging._srcfile = os.path.normcase(currentframe.__code__.co_filename)

"""
Singleton Meta Class for Cloudgateway logging

To be more precisely, this is singleton + proxy approach that allow dependencies
initialize logger first and use later. As long as process entry point initialize
it with logger name and logger file before sub module use it, sub module can still
log to the file that entry point specified.

It doesn't hurt for the sequence of getting/initializing the logger. It is only
hurt when sub module use it before entry point initialize the logger. In this
'bad' case(that may cause log conflict in multi-process environment), the logs go
to UNTRACKED_LOG_FILE. It is developer's responsibility that NOT logging to
UNTRACKED_LOG_FILE.
"""
class Singleton(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        log = cls._instances[cls]
        if (args or 'logger_name' in kwargs) \
                and log.logger.name == UNTRACKED_LOG:
            # Reset logger from entry point
            for h in log.logger.handlers:
                # Make sure the old handlers are completely closed.
                h.close()
                log.logger.removeHandler(h)
            old_logger = log.logger
            try:
                log.logger = setup_logging(*args, **kwargs)
            except IOError as e:
                old_logger.exception(e)
                log.logger = old_logger
        return log

"""
A wrapper class for logger by calling setup_logging, and it is a singleton class
"""
class CloudgatewayLogger(with_metaclass(Singleton, object)):
    def __init__(self, logfile_name = UNTRACKED_LOG_FILE, logger_name = UNTRACKED_LOG,
                 level=logging.INFO, log_format=LOG_DEFAULT_FMT):
        """
        @param logfile_name: the log file name
        @param logger_name:  the name of the logger.
            This class is singleton and initialized at the entry point of process.
            And the logger name will be set by the entry point
            If the entry point does't initialize it, the first python module that
            constructs this object will set the name of this logger.
        @param level: logging level
        @param log_format: log message format

        If the non-entry point of the process call the constructor, it will return
        the already created instance.

        But entry points should provide logfile_name and logger_name, otherwise, all
        logs belong to this process will log to UNTRACKED_LOG_FILE which should
        NEVER happen. Since UNTRACKED_LOG_FILE is a rescue approach to prevent ITSI
        from stop running.
        """
        self.logfile_name = logfile_name
        self.logger_name = logger_name
        self.logger = setup_logging(logfile_name, logger_name, level=level, log_format=log_format)


    def exception(self, msg, *args, **kwargs):
        self.logger.exception(msg, *args, **kwargs)

    def error(self, msg, *args, **kwargs):
        self.logger.error(msg, *args, **kwargs)

    def warning(self, msg, *args, **kwargs):
        self.logger.warning(msg, *args, **kwargs)

    warn = warning

    def info(self, msg, *args, **kwargs):
        self.logger.info(msg, *args, **kwargs)

    def debug(self, msg, *args, **kwargs):
        self.logger.debug(msg, *args, **kwargs)

    def setLevel(self, level):
        self.logger.setLevel(level)

    def addFilter(self, filter):
        self.logger.addFilter(filter)

    def getLogFilePath(self):
        return make_splunkhome_path(['var', 'log', 'splunk', self.logfile_name])


"""
Default Logger
"""
logger = CloudgatewayLogger()
