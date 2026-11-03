# python imports
import os
import sys
import json
import ssl
import glob
from urllib import error as urllib_error
from typing import Any, Optional, Tuple, Union

# Reloading the rapid_diag bin path
sys.path.insert(0, os.path.dirname(os.path.realpath(__file__)))

# splunk imports
from splunk.persistconn.application import PersistentServerConnectionApplication

# local imports
import logger_manager as log
from rapid_diag_handler_utils import persistent_handler_wrap_handle, create_rapiddiag_payload
from rapid_diag.serializable import JsonObject
from rapid_diag.conf_util import RapidDiagConf
from rapid_diag.util import get_server_name

_LOGGER = log.setup_logging("splunkcom_upload_progress_endpoint")
DEFAULT_OUTPUT_ROOT = RapidDiagConf.get_general_outputpath()

def get_diag_filename(args : JsonObject) -> Tuple[str, str]:
    """ Get the diag filename from the payload"""
    host = get_server_name(args['system_authtoken'])
    data = json.loads(args['payload'])
    host = get_server_name(args['system_authtoken'])
    if data.get('diag'):
        diag_file = os.path.basename(data['diag'])
        _LOGGER.debug("Filtering by diag: %s", str(data['diag']))
        return diag_file, host
    diag_file = os.path.basename(data[f"{host}"][0]['output_file'])
    _LOGGER.debug("Filtering by diag: %s", str(data[f"{host}"][0]['output_file']))
    return diag_file, host

def process_status_file(filename : str) -> Any:
    """ Function to load and return data read from status file"""
    try:
        with open(filename, "r") as read_content:
            return json.load(read_content)
    except FileNotFoundError:
        _LOGGER.debug('Status file not found')
        raise
    except json.JSONDecodeError:
        _LOGGER.error('Error reading status file')
        raise

class SplunkcomUploadProgressEndpoint(PersistentServerConnectionApplication):
    """ Persisten REST endpoint responsible for upload progress to splunk.com.

    """
    def __init__(self, command_line : Optional[str] = None, command_arg : Optional[str] = None) -> None:
        pass

    def handle(self, args : Union[str, bytes]) -> JsonObject:
        """ Main handler body
        """
        return persistent_handler_wrap_handle(self._handle, args, ['GET', 'POST'])

    def _handle(self, args: JsonObject) -> JsonObject:

        try:
            ret = {}
            if 'payload' in args:
                data = json.loads(args['payload'])
                try:
                    if 'clean' in data:
                        file_name = f"{DEFAULT_OUTPUT_ROOT}/{os.path.basename(data['filename'])}.upload.json"
                        data = process_status_file(file_name)
                        if data['eta'] != 0:
                            _LOGGER.error('Cannot clean status file %s while still uploading' ,file_name)
                            msg = 'Cannot clean status file while still uploading'
                        else:
                            os.remove(file_name)
                            msg = 'Clean up complete'
                        return create_rapiddiag_payload(msg)
                    diag_filename, host = get_diag_filename(args)
                    _LOGGER.info(diag_filename)
                    data = process_status_file(f"{DEFAULT_OUTPUT_ROOT}/{diag_filename}.upload.json")
                    data['host'] = host
                    ret[diag_filename] = data
                except ValueError:
                    return create_rapiddiag_payload(error='Error has occured reading status from file', status=500)
                except FileNotFoundError:
                    return create_rapiddiag_payload('No uploads in progress found')
            else:
                for file_name in glob.glob(DEFAULT_OUTPUT_ROOT + '/*upload.json'):
                    try:
                        data = process_status_file(file_name)
                    except ValueError as e:
                        ret[os.path.basename(file_name).replace(".upload.json","")] = e
                    else:
                        ret[os.path.basename(file_name).replace(".upload.json","")] = data
            return create_rapiddiag_payload(data=ret)

        except (urllib_error.URLError, urllib_error.HTTPError) as e:
            _LOGGER.error("Check splunk URL and login details: %s", str(e))
            return create_rapiddiag_payload(error='Check your credentials.', status=401)
        except ssl.SSLError as e:
            _LOGGER.error("SSL error check logs for more info: %s", str(e))
            return create_rapiddiag_payload(error='SSL error check logs for more info.', status=401)
