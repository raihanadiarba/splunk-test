"""
Main entry for agent
"""

import logging
import logging.handlers
import sys
import os


class LoggerConstants():

    """ DMC Logger Constants

    Constants and helper functions to create DMC loggers
    """

    @classmethod
    def get_agent_format(cls):
        """Return the logging format for the dmc_agent log
        """
        # TODO: make format configurable
        return "%(asctime)s %(levelname)s (%(threadName)s) %(name)s: %(message)s"

    @classmethod
    def get_agent_handler(cls):
        """Return the handler object used to log dmc_agent messages
        """
        # TODO: make filename and parameters configurable?
        return logging.handlers.RotatingFileHandler(
            os.path.join(os.environ["SPLUNK_HOME"], "var", "log", "splunk", "dmc_agent.log"),
            maxBytes=25000000,
            backupCount=5
        )

    @classmethod
    def get_agent_access_handler(cls):
        """Return the handler object used to log dmc_agent_access messages
        """
        # TODO: make filename and parameters configurable?
        return logging.handlers.RotatingFileHandler(
            os.path.join(os.environ["SPLUNK_HOME"], "var", "log", "splunk", "dmc_agent_access.log"),
            maxBytes=25000000,
            backupCount=5)


def configure_logger(daemon=False, verbose=False):
    """Setup logging
    """

    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)

    access_logger = logging.getLogger("dmc_agent_access")
    access_logger.setLevel(logging.DEBUG)
    access_logger.propagate = False

    if daemon:
        handler = LoggerConstants.get_agent_handler()
        handler.setFormatter(
            logging.Formatter(LoggerConstants.get_agent_format())
        )
        root_logger.addHandler(handler)

        access_handler = LoggerConstants.get_agent_access_handler()
        access_logger.addHandler(access_handler)
    else:
        handler = logging.StreamHandler()
        handler.setFormatter(
            logging.Formatter(LoggerConstants.get_agent_format())
        )
        handler.setLevel(logging.INFO if verbose else logging.CRITICAL)
        root_logger.addHandler(handler)
        access_logger.addHandler(handler)


def configure_libs():
    """Setup PYTHON_PATH, include dependenceis from libs folder
    """
    libs = os.path.join(os.path.dirname(os.path.realpath(__file__)),
                        "..",
                        ".virtualenv", "lib", "python2.7", "site-packages")
    logging.debug("libs folder: %s", libs)
    sys.path.append(libs)
    libs = os.path.join(os.path.dirname(os.path.realpath(__file__)), "..")
    logging.debug("libs folder: %s", libs)
    sys.path.append(libs)


if __name__ == "__main__":
    # pylint: disable=invalid-name
    # Only for dmc enable we are not using default log files, so if user by accident will
    # execute cmd with sudo or different rights we will not mess up file permissions
    verbose_output = False
    if "--verbose" in sys.argv:
        verbose_output = True
        sys.argv.remove("--verbose")
    configure_logger(sys.argv[1] == "server", verbose_output)
    configure_libs()
    from agent import ioc
    ioc_features = ioc.NewFeatureBroker(False)
    import agent.launcher
    sys.exit(agent.launcher.Launcher(sys.argv[1:], ioc_features).run())
