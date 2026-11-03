"""
(C) 2025 Splunk LLC All rights reserved.
"""

import json
import logging

import splunk.rest as rest
from splunk import (AuthenticationFailed, AuthorizationFailed, BadRequest,
                    InternalServerError, LicenseRestriction, ResourceNotFound,
                    RESTException, setupSplunkLogger)
from splunk.clilib.bundle_paths import make_splunkhome_path

ENDPOINT_SERVER_SETTINGS = '/services/server/settings?output_mode=json'
ENDPOINT_SCSAUDIT_CONFIG = '/servicesNS/nobody/scsaudit/configs/conf-scsaudit/internal_settings?output_mode=json'

# level=logging.INFO
def setup_logging(log_file, logger_name, logger=None, level=logging.INFO, is_console_header=False,
                  log_format='%(asctime)s %(levelname)s [%(name)s] [%(module)s] [%(funcName)s:%(lineno)d]  %(message)s',
                  is_propagate=False):
    """
    Setup logging
    @param log_file: log file name
    @param logger_name: logger name (if logger specified then we ignore this argument)
    @param logger: logger object
    @param level: logging level
    @param is_console_header: set to true if console logging is required
    @param log_format: log message format
    @param is_propagate: set to true if you want to propagate log to higher level
    @return: logger
    """
    if log_file is None or logger_name is None:
        raise ValueError("log_file or logger_name is not specified")

    if logger is None:
        # Logger is singleton so if logger is already defined it will return old handler
        logger = logging.getLogger(logger_name)

    logger.propagate = is_propagate  # Prevent the log messages from being duplicated in the python.log file
    logger.setLevel(level)

    # If handlers is already defined then do not create new handler, this way we can avoid file opening again
    if len(logger.handlers) == 0:
        file_handler = logging.handlers.RotatingFileHandler(make_splunkhome_path(['var', 'log', 'splunk', log_file]),
                                                            maxBytes=25000000, backupCount=10)
        formatter = logging.Formatter(log_format)
        file_handler.setFormatter(formatter)
        logger.handlers = []
        logger.addHandler(file_handler)

        # Console stream handler
        if is_console_header:
            console_handler = logging.StreamHandler()
            console_handler.setFormatter(logging.Formatter(log_format))
            logger.addHandler(console_handler)

    # Read logging level information from log.cfg so it will overwrite log
    # Note if logger level is specified on that file then it will overwrite log level
    LOGGING_DEFAULT_CONFIG_FILE = make_splunkhome_path(['etc', 'log.cfg'])
    LOGGING_LOCAL_CONFIG_FILE = make_splunkhome_path(['etc', 'log-local.cfg'])
    LOGGING_STANZA_NAME = 'python'
    setupSplunkLogger(logger, LOGGING_DEFAULT_CONFIG_FILE, LOGGING_LOCAL_CONFIG_FILE, LOGGING_STANZA_NAME,
                      verbose=False)

    return logger

def rest_json_helper(session_key, logger, method, path, timeout, payload=None):
    """
    Helper function to send HTTP request to splunk endpoint

    :param session_key: The sessionn key to connect to splunk.
    :param logger: The logger object.
    :param method: GET, POST, PUT, DELETE
    :param path: splunk endpoint
    :param timeout: Request timeout in seconds.
    :param payload: Request body.

    :return: success: True (success), False (failed)
             response: The response from splunk
             content: The returned content from splunk
    """
    try:
        args = {
            'method': method,
            'sessionKey': session_key,
        }
        if method == 'POST' or method == 'DELETE' or method == 'PUT':
            args['jsonargs'] = payload
        else:
            args['getargs'] = payload

        response, contents = rest.simpleRequest(path, timeout=timeout, **args)
    except AuthenticationFailed as e:
        logger.error(f"AuthenticationFailed error occurred: {e.get_message_text()}")
        return False, None, None
    except LicenseRestriction as e:
        logger.error(f"LicenseRestriction error occurred: {e.get_message_text()}")
        return False, None, None
    except AuthorizationFailed as e:
        logger.error(f"AuthorizationFailed error occurred: {e.get_message_text()}")
        return False, None, None
    except ResourceNotFound as e:
        logger.error(f"ResourceNotFound error occurred: {e.get_message_text()}")
        return False, None, None
    except BadRequest as e:
        logger.error(f"BadRequest error occurred: {e.get_message_text()}")
        return False, None, None
    except InternalServerError as e:
        logger.error(f"InternalServerError error occurred: {e.get_message_text()}")
        return False, None, None
    except RESTException as e:
        logger.error(f"RESTException error occurred: {e.get_message_text()}")
        return False, None, None

    return True, response, contents

def get_parameter_from_config(session_key, logger, parameter, default=None):
    """
    Given a parameter name and return the value of this parameter set in the conf file

    :param session_key: The sessionn key to connect to splunk.
    :param logger: The logger object.
    :param parameter: The name of the parameter
    :param default: The default value to return if failed to retrieve the parameter

    :return: The value of the given parameter
    """
    value = default
    try:
        success, response, contents = rest_json_helper(session_key, logging, 'GET', ENDPOINT_SCSAUDIT_CONFIG, 1)
        if success:
            response_code = int(response.get('status'))
            if response_code == 200 or response_code == 201:
                json_contents = json.loads(contents)
                value = str(json_contents.get('entry', [])[0].get('content', {}).get(parameter, ''))
                logger.info(f'get_parameter_from_config(): Successfully retrieved parameter {parameter} from config. Value: {value}')
                return value
        logger.error(f"get_parameter_from_config(): Failed to retrieve parameter {parameter} from config. response: {response}")
    except TypeError:
        logger.exception(f"get_parameter_from_config(): Failed to retrieve parameter {parameter} from config. Incorrect type.")
    except Exception as e:
        logger.exception(f"get_parameter_from_config(): Failed to retrieve parameter {parameter} from config.")

    return value

