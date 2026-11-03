import re
import logging
from datetime import datetime, timezone
from typing import Match, Union

logger = logging.getLogger('splunk.pdfgen')
js_script_name = 'custom_headless_command.js'

CUSTOM_JS_SCRIPT_LOG_CATEGORY = 'CUSTOM_JS_SCRIPT_LOG'
CHROMIUM_LOG_CATEGORY = 'CHROMIUM_LOG'
NON_CHROMIUM_LOG_CATEGORY = 'OUTSIDE_CHROMIUM_LOG'

EXCLUDING_BRACKETS_AND_COLON_REGEX = '(?P<{}>[^:\[\]]+)'
EXCLUDING_BRACKETS_REGEX = '(?P<{}>[^\[\]]+)'
TIME_CAPTURING_GROUP = EXCLUDING_BRACKETS_AND_COLON_REGEX.format('time')
LOG_LEVEL_CAPTURING_GROUP = EXCLUDING_BRACKETS_AND_COLON_REGEX.format('log_level')
FILE_NAME_CAPTURING_GROUP = EXCLUDING_BRACKETS_REGEX.format('file_name')
# Regex to get the portion of the square brackets of the log, split by :
# Matches log in form of [0630/213543.425232:WARNING:sandbox/policy/linux/sandbox_linux.cc:415] InitializeSandbox() called
# And extracts the following to capturing groups:
# Capturing group 0: 0630/213543.425232
# Capturing group 1: WARNING
# Capturing group 2: sandbox/policy/linux/sandbox_linux.cc:415
CHROMIUM_LOG_REGEX = fr'\[{TIME_CAPTURING_GROUP}:{LOG_LEVEL_CAPTURING_GROUP}:{FILE_NAME_CAPTURING_GROUP}\]'

def get_within_square_brackets(log: str) -> Union[Match, None]:
    return re.search(CHROMIUM_LOG_REGEX, log)

def format_date_time(date_time_source: Union[Match, None]):
    if date_time_source is None:
        return 'Unable to determine timestamp'
    
    date_time = date_time_source.group('time')
    date, fulltime = date_time.split('/')
    time, ms = fulltime.split('.')
    month_day = [date[i:i+2] for i in range(0, len(date), 2)]
    hh_mm_ss = [time[i:i+2] for i in range(0, len(time), 2)]

    timestamp = datetime(
        datetime.now(timezone.utc).year,
        int(month_day[0]),
        int(month_day[1]),
        int(hh_mm_ss[0]),
        int(hh_mm_ss[1]),
        int(hh_mm_ss[2]),
        int(ms),
    )
    # in UTC
    return timestamp

def format_log(log: str, category: str, add_file_source=False):
    try:
        # Regex to remove the portion in square brackets of the log to get the error message
        error_msg = re.sub(r'\[.*?\]', '', log, 1).strip()
        date_time_source = get_within_square_brackets(log)

        timestamp = format_date_time(date_time_source)
        if add_file_source and date_time_source:
            file_name = date_time_source.group('file_name')
            if file_name:
                # YYYY-MM-DD hh:mm:ss.mmmmmm "error message", source: fileName(error line #)
                return f'[{category}] {timestamp} "{error_msg}", source: {file_name}'
        # YYYY-MM-DD hh:mm:ss.mmmmmm "error message" source:  (error line #)
        return f"[{category}] {timestamp} {error_msg}"
    except Exception as e:
        logger.exception(f'Unable to format log {log} because of error {str(e)}')
        return log

def get_log_level(log: str, from_js_script=False):
    try:
        if from_js_script:
            # Regex to get the log level from "custom_headless_command.js:INFO" => INFO
            log_level_pattern = r'{}:(\w+)'.format(re.escape(js_script_name))
            match = re.search(log_level_pattern, log).group(1)
            return match

        date_time_source = get_within_square_brackets(log)
        if date_time_source is None:
            logger.warning(f'Could not determine log level for log {log}. Using DEBUG as default.')
            return 'DEBUG'
        return date_time_source.group('log_level')
    except Exception as e:
        logger.exception(f'Unable to determine log level for log {log} because of error {str(e)}')
        return 'DEBUG'

def is_log_group(groups: list, log: str, from_js_script=False):
    for group in groups:
        if from_js_script and js_script_name+':'+group in log:
            return True
        if not from_js_script and group in log:
            return True
    return False

def log_message(log):
    message = log['message']
    level = log['level']

    if level == 'INFO':
        logger.info(message)
    elif level == 'WARNING':
        logger.warning(message)
    elif level == 'DEBUG':
        logger.debug(message)
    elif level == 'ERROR' or level == 'FATAL':
        logger.error(message)
    else:
        logger.error('Could not categorize log: ' + message)

def log_messages(logs):
    for log in logs:
        log_message(log)

def log_if_screenshot_error(attempt, dashboard_title):
    if attempt == False:
        logger.error('Failed to take screenshot of dashboard %s' %dashboard_title)

def categorize_log(err, log_index):
    # Logs emitted from JS script
    if is_log_group(['INFO', 'DEBUG', 'WARNING', 'ERROR'], err, True):
        return { 
            'log': {"index": log_index, "message": format_log(err, CUSTOM_JS_SCRIPT_LOG_CATEGORY), "level": get_log_level(err, True)}, 
            'is_js_log': True 
        }
    
    # Logs emitted from Chromium
    if is_log_group(['WARNING:', 'ERROR:', 'FATAL:'], err):
        return { 
            'log': {"index": log_index, "message": format_log(err, CHROMIUM_LOG_CATEGORY, True), "level": get_log_level(err)}, 
            'is_js_log': False 
        }
    
    # Logs emitted outside of Chromium can have a non-existing level
    if not is_log_group(['INFO:', 'DEBUG:'], err) and err:
        return { 
            'log': {"index": log_index, "message": format_log(err, NON_CHROMIUM_LOG_CATEGORY), "level": 'ERROR' },
            'is_js_log': False
        }

    return None