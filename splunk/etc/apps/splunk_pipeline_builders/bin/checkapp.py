# $SPLUNK_HOME/etc/apps/splunk_pipeline_builders/bin/checkapp.py
from __future__ import print_function
from builtins import str
import sys, os
from splunk.clilib.cli_common import getConfStanza
import splunk.clilib.cli_common as comm
from cherrypy import log


PIPELINE_BUILDERS_APP_CONFIG_FILE = os.path.join(os.environ['SPLUNK_HOME'], 'etc', 'apps', 'splunk_pipeline_builders', 'default', 'app.conf')
DATA_MANAGEMENT_APP_CONFIG_FILE = os.path.join(os.environ['SPLUNK_HOME'], 'etc', 'apps', 'data-management', 'default', 'app.conf')

def is_search_head():
    try:
        clustering_mode = getConfStanza('server', 'clustering').get('mode')
        return clustering_mode == 'searchhead' or clustering_mode == 'disabled'
    except Exception as e:
        log("Checkapp input: Error reading clustering mode from server.conf: %s", str(e))
        return False

def should_disable_pipeline_builders():
    if not is_search_head():
        return True
    else :
        return False

installStanza = "install"
enabledValue = "enabled"
disabledValue = "disabled"

def setAppState(stateValue, configFilePath=PIPELINE_BUILDERS_APP_CONFIG_FILE):
    retDict = {}
    stateKey  = "state"
    currSetts = comm.readConfFile(configFilePath)

    if not installStanza in currSetts:
        currSetts[installStanza] = {}
    if stateKey in currSetts[installStanza]:
        try:
            oldValue = currSetts[installStanza][stateKey]
            if oldValue == stateValue:
                return retDict
        except ValueError:
            log("Checkapp input: Error reading state value from app.conf for pipeline_builders app")
            pass
    currSetts[installStanza][stateKey] = stateValue
    comm.writeConfFile(configFilePath, currSetts)
    return retDict    
    
# Empty introspection routine
def do_scheme(): 
    pass

# Empty validation routine. This routine is optional.
def validate_arguments(): 
    pass

def run_script():
    if (should_disable_pipeline_builders()):
        setAppState(disabledValue)
        log("Splunk pipeline builders app has been disabled because the instance is not a single search head.")
    else:
        setAppState(enabledValue, DATA_MANAGEMENT_APP_CONFIG_FILE)

# Script must implement these args: scheme, validate-arguments
if __name__ == '__main__':
    if len(sys.argv) > 1:
        if sys.argv[1] == "--scheme":
            do_scheme()
        elif sys.argv[1] == "--validate-arguments":
            validate_arguments()
        else:
            pass
    else:
        run_script()

    sys.exit(0)