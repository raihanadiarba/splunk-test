from __future__ import print_function
import sys
import splunk.rest as rest
import logging
import os
from splunk import LicenseRestriction, SplunkdConnectionException, ResourceNotFound

import moncocon

SHC_MC_FLAG_ENDPOINT = '/services/properties/splunk_monitoring_console_assets/settings/auto_configure_in_shc_enabled'



def is_autoconfigure_disabled(session_key):
    # Default is 'disabled', MC auto configuration is disabled by default by feature flag, SPL-232177
    return_value = True

    monco = moncocon.Moncocon(session_key=session_key)
    if not monco._is_this_a_shc_instance():
        # For non SHC instance continue with 'mc_auto_config' setting, check for that will happen later
        return False 
    
    # Find out if we need AutoMC on SHC instance

    try:
        (res, content) = rest.simpleRequest(SHC_MC_FLAG_ENDPOINT,  sessionKey=session_key)
        shc_mc_enabled = content.decode('utf-8').lower()
        return_value = not (shc_mc_enabled == '1' or shc_mc_enabled == 'true')
    except ResourceNotFound:
        logging.debug("Monitoring Console on SHC setting is not found")
    except:
        logging.exception('Cannot check Monitoring Console auto configuration setting due to an unexpected error. Auto configuration of Monitoring Console will not run.')

    return return_value



def execute(session_key):
    if is_autoconfigure_disabled(session_key): # Protected by feature flag
        return
    monco = moncocon.Moncocon(session_key=session_key)
    monco.detect_and_set_distributed_mode(configure_ui=True)

if __name__ == '__main__':
    # set up logger to send message to stderr so it will end up in splunkd.log
    sh = logging.StreamHandler()
    # the following line is to make sure the log event looks the same as any other splunkd.log
    sh.setFormatter(logging.Formatter("%(levelname)s %(message)s"))
    l = logging.getLogger()
    l.setLevel(logging.INFO)
    l.addHandler(sh)

    session_key = sys.stdin.read()

    execute(session_key)
