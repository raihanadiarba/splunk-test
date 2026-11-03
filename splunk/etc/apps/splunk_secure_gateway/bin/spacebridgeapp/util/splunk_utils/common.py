import time
from http import HTTPStatus
from solnlib.server_info import ServerInfo
from splunklib.binding import HTTPError
import splunk.rest as rest

TIMEOUT = 300  # 5 minutes


def modular_input_should_run(session_key, logger):
    """
    Determine if a modular input should run or not.
    Run if and only if:
    1. Node is not a SHC member
    2. Node is an SHC member and is Captain
    @return True if condition satisfies, False otherwise
    """
    if not session_key.strip():
        raise ValueError('Invalid session key.')

    info = ServerInfo(session_key)

    if not info.is_shc_member():
        return True

    timeout = TIMEOUT  # 5 minutes
    while timeout > 0:
        try:
            # captain election can take time on a rolling restart.
            if info.is_captain_ready():
                break
        except HTTPError as e:
            if e.status == HTTPStatus.SERVICE_UNAVAILABLE:
                logger.warning('Search head cluster may be initializing on node `%s`. Captain is not ready. Try again.', info.server_name)
            else:
                logger.exception('Unexpected exception on node `%s`.', info.server_name)
                raise
        time.sleep(5)
        timeout -= 5

    # we can fairly be certain that even after 5 minutes if `is_captain_ready`
    # is false, there is a problem
    if not info.is_captain_ready():
        raise Exception('Error. Captain is not ready even after 5 minutes. node=`%s`.', info.server_name)

    return info.is_captain()

def get_conf_stanza_single_entry(session_key, conf_name, stanza_name, entry_name, host_base_uri=''):
    uri = host_base_uri + '/servicesNS/nobody/splunk_secure_gateway/properties/' + conf_name + '/' + stanza_name + '/' + entry_name
    response, content = rest.simpleRequest(
        uri,
        method="GET",
        sessionKey=session_key,
        getargs={'output_mode': 'json'},
        raiseAllErrors=False
        )
    return {'response': response, 'content': content}

