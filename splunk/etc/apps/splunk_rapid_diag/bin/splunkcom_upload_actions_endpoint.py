# python imports
import os
import signal
import sys
import json
from typing import Any, Optional, Union

# Reloading the rapid_diag bin path
sys.path.insert(0, os.path.dirname(os.path.realpath(__file__)))

# splunk imports
from splunk.persistconn.application import PersistentServerConnectionApplication

# local imports
import logger_manager as log
from rapid_diag_handler_utils import persistent_handler_wrap_handle, create_rapiddiag_payload
from rapid_diag.serializable import JsonObject
from rapid_diag.conf_util import RapidDiagConf
from rapid_diag.process_abstraction import ProcessLister, ProcessNotFound

_LOGGER = log.setup_logging("splunkcom_upload_actions_endpoint")
DEFAULT_OUTPUT_ROOT = RapidDiagConf.get_general_outputpath()

def process_status_file(filename : str) -> Any:
    """ Function to load and return data read from status file"""
    try:
        with open(filename, "r") as read_content:
            return json.load(read_content)
    except json.JSONDecodeError:
        _LOGGER.error("Error reading status file: %s", filename)
        raise


class SplunkcomUploadActionsEndpoint(PersistentServerConnectionApplication):
    """ Persisten REST endpoint responsible for upload Actions to splunk.com.
        Cancel, Retry actions.
    """
    def __init__(self, command_line : Optional[str] = None, command_arg : Optional[str] = None) -> None:
        pass

    def handle(self, args : Union[str, bytes]) -> JsonObject:
        """ Main handler body
        """
        return persistent_handler_wrap_handle(self._handle, args, ['GET', 'POST'])

    def _handle(self, args: JsonObject) -> JsonObject:

        try:
            data = json.loads(args['payload'])
            file_name = f"{DEFAULT_OUTPUT_ROOT}/{os.path.basename(data['filename'])}.upload.json"
            if not os.path.exists(file_name):
                return create_rapiddiag_payload('No upload in progress')
            proc_data = process_status_file(file_name)
            live_proc = None
            live_proc = ProcessLister.build_process_from_pid(proc_data['pid'])
            if 'cancel' in data['action']:
                # show_in_simple_listing is only true if executable inside the splunk directory. so must be splunk process
                if proc_data['percent'] < 100:
                    if live_proc and live_proc.show_in_simple_listing:
                        try:
                            os.kill(proc_data['pid'],signal.SIGTERM)
                            _LOGGER.debug('Process with pid:%s has been terminated', proc_data["pid"])
                        except ProcessLookupError:
                            _LOGGER.debug('Process with pid=%s was already dead', proc_data["pid"])
                    os.remove(file_name)
                    _LOGGER.debug('Status file:%s removed', file_name)
                    msg = f'Upload process has been cancelled for {file_name}'
                else:
                    _LOGGER.info('Cannot cancel upload process for %s' ,file_name)
                    msg = 'Cannot cancel upload already completed.'
                return create_rapiddiag_payload(msg)
            return create_rapiddiag_payload('Action type not recognised')
        except ProcessNotFound:
            os.remove(file_name)
            _LOGGER.debug('Process with pid=%s dead before kill attempt', proc_data["pid"])
            return create_rapiddiag_payload(error='Upload process was not found for this instance. maybe completed.')
        except (FileNotFoundError, PermissionError):
            _LOGGER.error('Error occurred while trying to remove status file: %s', file_name)
            return create_rapiddiag_payload(error='Error occured while trying to remove status files')
        except json.JSONDecodeError:
            return create_rapiddiag_payload(error='Error occured while trying to process status file')
 