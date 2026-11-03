import json
import logging
import os
import sys
from defusedxml.ElementTree import fromstring
from abc import ABC

sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'libs'))
from splunk.appserver.mrsparkle.lib import util
from splunklib.binding import HTTPError

IUE_LOG_FILE_NAME = 'splunk_o11y_app.log'
APP_NAME = 'splunk_app_for_splunk_o11y_cloud'
O11Y_TOKEN_NAME = 'o11y_access_token'
ADMIN_SETTINGS = 'admin-settings'
ENV_SETTINGS = 'env-settings'
DEV_SETTINGS = 'dev-settings'


def setup_rotating_log_file():
    try:
        splunk_home_log_path = util.make_splunkhome_path(["var", "log", "splunk"])
        # check to see if the SPLUNK_HOME based log path exists
        if not os.path.exists(splunk_home_log_path):
            # check to see if the relative path based log path exists
            splunk_base = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
            splunk_base_log_path = os.path.join(splunk_base, 'var', 'log', 'splunk')
            if not os.path.exists(splunk_base_log_path):
                # disable logging with noop handler
                logger.addHandler(logging.NullHandler())
                return logger
            else:
                log_file_name = os.path.join(splunk_base_log_path, IUE_LOG_FILE_NAME)
        else:
            log_file_name = os.path.join(splunk_home_log_path, IUE_LOG_FILE_NAME)

        # valid log file path exists and rotate at 10 MB
        file_handler = logging.handlers.RotatingFileHandler(log_file_name, maxBytes=10240000, backupCount=10)
        logging_format = "%(asctime)s %(levelname)-s\t%(name)s:%(lineno)d - %(message)s"
        file_handler.setFormatter(logging.Formatter(logging_format))
        return file_handler
    except Exception:
        # disable logging with noop handler
        return logging.NullHandler()


def setup_logger(modulename):
    logger = logging.getLogger(modulename)
    logger.propagate = False  # Prevent the log messages from being duplicated in the python.log file
    logger.setLevel(logging.INFO)
    logger.addHandler(rotating_log_file)
    return logger


def normalize_time(timestamp):
    if timestamp is not None:
        if len(str(round(float(timestamp)))) == 10:
            # ex: 1586473882.963976
            return float(timestamp)
        else:
            ts_str = str(timestamp)
            if len(ts_str) > 10 and '.' not in ts_str:
                return float(ts_str[:10] + '.' + ts_str[10:])


# Initialize the rotating log file which we will use for multiple loggers.
rotating_log_file = setup_rotating_log_file()

logger = setup_logger('o11y_utils')


def is_user_admin(o11y_context, request):
    """Check if the request session's user has the 'admin' or 'sc_admin' Splunk role."""
    try:
        session = request.get('session', {})
        username = session.get('user')

        if not username:
            logger.warning('Unable to determine username from request session')
            return False

        service = o11y_context._get_splunk_service()
        user_endpoint = f'/services/authentication/users/{username}'
        user_response = service.get(user_endpoint, output_mode='json')
        user_info = json.loads(user_response.body.read())

        if not user_info.get('entry'):
            logger.warning(f'No user data found for username: {username}')
            return False

        user_roles = user_info['entry'][0].get('content', {}).get('roles', [])
        is_admin = 'admin' in user_roles or 'sc_admin' in user_roles

        logger.info(f'Admin check for user {username}: {is_admin} (roles: {user_roles})')
        return is_admin

    except Exception as e:
        logger.exception(f'Error checking admin status for user: {e}')
        return False


class Settings(ABC):
    setting = None

    @classmethod
    def get_settings(cls, service):
        try:
            path_to_setting = f'/services/properties/splunk_app_for_splunk_o11y_cloud/{cls.setting}'

            get_setting = service.get(
                path_to_setting).body.read().decode('utf-8')

            xml = fromstring(get_setting)

            entries = xml.findall('.//{http://www.w3.org/2005/Atom}entry')
            settings = {}

            for entry in entries:
                name = entry.find('{http://www.w3.org/2005/Atom}title').text
                value = entry.find('{http://www.w3.org/2005/Atom}content').text

                if name is not None and value is not None:
                    settings[name] = value

            logger.info(f'Loaded {cls.setting}: {settings}')

            return settings

        except Exception as e:
            if isinstance(e, HTTPError) and e.status == 404:
                pass
            elif isinstance(e, HTTPError) and e.status == 403:
                logger.warning(f'Received 403 error while loading {cls.setting}: {str(e)} ')
            else:
                logger.error(f'Error loading {cls.setting}: {str(e)}')

        return {}


class AdminSettings(Settings):
    setting = ADMIN_SETTINGS


class DevSettings(Settings):
    setting = DEV_SETTINGS


class EnvSettings(Settings):
    _settings = None
    setting = ENV_SETTINGS

    @classmethod
    def get_env_setting(cls, service):

        # caching
        if cls._settings is None:
            cls._settings = cls.get_settings(service)
        return cls._settings

    @classmethod
    def reset(cls):
        cls._settings = None
