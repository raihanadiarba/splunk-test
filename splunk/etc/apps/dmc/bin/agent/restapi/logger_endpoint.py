"""
REST Endpoint implementation for configuring logger
"""

import logging
import bottle

from bottle import request, HTTPError

from agent import ioc
from agent.restapi import eai_helpers, helpers


class LoggerEndpoint(ioc.Component):
    """ Logger endpoint.
    Handles:
        GET /logger
        GET /logger/{name}
        POST /logger level=(FATAL | WARN | INFO | DEBUG)
        POST /logger/{name} level=(FATAL | WARN | INFO | DEBUG)
    """

    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)

        bottle.get("/logger")(self.get)
        bottle.get("/logger/<name>")(self.get)

        bottle.post("/logger")(self.post)
        bottle.post("/logger/<name>")(self.post)

        self._loggers = logging.Logger.manager.loggerDict
        self._mapping = {
            "DEBUG": logging.DEBUG,
            "INFO": logging.INFO,
            "WARN": logging.WARNING,
            "ERROR": logging.ERROR,
            "": logging.NOTSET
        }

    @eai_helpers.response_formatted
    def get(self, name=None):
        """Handle GET method
        Can return all loggers defined in the system.
        Or just one specified with `name`
        """
        if name:
            if name not in self._loggers:
                raise HTTPError(404, "Logger %s not found" % name)
            return [(name, self._serialize_logger(logging.getLogger(name)))]

        # pylint: disable=consider-iterating-dictionary
        result = [(x, self._serialize_logger(logging.getLogger(x))) for x in self._loggers.keys()]
        result.append(("", self._serialize_logger(logging.getLogger())))
        return result

    @helpers.json_validate_request(schema={
        "type": "object",
        "properties": {"level": {"type": "string", "enum": ["", "DEBUG", "INFO", "WARN", "ERROR"]}},
        "required": ["level"]
    })
    @eai_helpers.response_formatted
    def post(self, name=""):
        """Handle POST method
        Can update root logger or any logger with `name`
        """
        # pylint: disable=unsubscriptable-object
        level = request.json["level"]
        if not level and not name:
            raise HTTPError(400, "Cannot unset level for root logger")

        if not name:
            logger = logging.getLogger()
        else:
            if name not in self._loggers:
                raise HTTPError(404, "Logger %s not found" % name)

            logger = logging.getLogger(name)

        logger.setLevel(self._loglevel_splunk_to_python(level))
        return (name, self._serialize_logger(logger))

    def _serialize_logger(self, logger):
        """Serialize logger to the JSON dict
        """
        if isinstance(logger, logging.PlaceHolder):
            logger = logging.getLogger(logger.name)
        return {"level": self._loglevel_python_to_splunk(logger.level)}

    def _loglevel_splunk_to_python(self, loglevel):
        """Convert splunk logger levels to python
        """
        return self._mapping.get(loglevel)

    def _loglevel_python_to_splunk(self, loglevel):
        """Convert python levels to splunk
        """
        for key, val in self._mapping.items():
            if val == loglevel:
                return key
        self._logger.warning("Unsupported python loglevel %s", loglevel)
        return ""
