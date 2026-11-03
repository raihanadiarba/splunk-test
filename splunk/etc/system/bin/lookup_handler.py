#!/usr/bin/env python

"""Persistent lookup handler wrapper."""

import logging

from splunk.appserver.mrsparkle.controllers.admin import LookupHandler
from splunk.clilib.bundle_paths import make_splunkhome_path

LOGGING_FORMAT = (
    "%(asctime)s %(levelname)-s\t[%(requestid)s] "
    "%(module)s:%(lineno)d - %(message)s"
)


def setup_lookup_logger():
    logger = logging.getLogger("splunk.appserver.controllers.admin")
    log_path = make_splunkhome_path(
        ["var", "log", "splunk", "lookup_handler.log"]
    )
    if any(
        getattr(handler, "baseFilename", None) == log_path
        for handler in logger.handlers
    ):
        return
    handler = logging.FileHandler(log_path, mode="a")
    handler.setFormatter(
        logging.Formatter(LOGGING_FORMAT, defaults={"requestid": "-"})
    )
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    logger.propagate = False


setup_lookup_logger()

__all__ = ["LookupHandler"]
