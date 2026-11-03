import logging
import splunk.admin
import splunk.rest
import argparse
import getpass
import sys, json
import urllib
import httplib2
import time
from xml.dom import minidom
import os
sys.path.append(os.path.join(os.environ['SPLUNK_HOME'], 'etc', 'apps', 'dmc'))
from agent.main import LoggerConstants
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)
# Base URL
BASE_URL = "https://localhost:8089"
DEFAULT_ENDPOINT = "{}/servicesNS/nobody/dmc/storage/collections/data".format(BASE_URL)

# Collections endpoints
PROGRESS_ENDPOINT = "progress"
TASKS_ENDPOINT = "tasks"
COMMANDS_ENDPOINT = "commands"

# Filtered parameters
NO_OF_DAYS_FOR_CLEANUP = 60
PAGINATION_LIMIT = 5000
CLEANUP_ITEMS_THRESHOLD = 1024

# Exceptions
GET_COLLECTION_ITEMS_COUNT_FAILED = "GET_COLLECTION_ITEMS_COUNT_FAILED"
CLEANUP_COLLECTION_FAILED_EXCEPTION = "CLEANUP_COLLECTION_FAILED_EXCEPTION"

class KVStoreCleanUp:
    def __init__(self, _session_key):

        handler = LoggerConstants.get_agent_handler()
        handler.setFormatter(logging.Formatter(LoggerConstants.get_agent_format()))
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)

        self._sessionKey = _session_key
        dt = (datetime.today() - timedelta(days=NO_OF_DAYS_FOR_CLEANUP))
        self._cleanup_timestamp = time.mktime(dt.timetuple()) + dt.microsecond/1e6

        # Use the collection's field name as the value in the dictionary, and the collection's value as the key in the dictionary. 
        # This helps to map different items in the filter with the same key name.
        # For example, 
        # Task collection - {"workflow: external_apps_discovery_workflow", "workflow: notification_workflow"}
        # _task_cleanup_items dictionary = {"external_apps_discovery_workflow: workflow", "notification_workflow: workflow"}
        self._progress_cleanup_items = {'handled': 'state'}
        self._task_cleanup_items = {'external_apps_discovery_workflow': 'workflow', 'notification_workflow': 'workflow'}
        self._command_cleanup_items = {'discover_external_apps':'type', 'notify':'type', 'notify_wait': 'type'}
        self._fix_flag = False

    def cleanup_kvstore_collection(self, endpoint, query):
        """Cleanup KVstore data as per query provided"""

        response = splunk.rest.simpleRequest(
            endpoint,
            getargs=query,
            sessionKey=self._sessionKey,
            raiseAllErrors=True,
            method="DELETE"
        )

        return response

    def get_kvstore_records_count(self, endpoint, query):
        """
        Get KVstore data as per query provided
        with Pagination
        """

        skip_count = total_record_count = 0
        query['limit'] = content_count = PAGINATION_LIMIT
        while content_count == PAGINATION_LIMIT:
            query['skip'] = skip_count
            response, content = splunk.rest.simpleRequest(
                endpoint,
                sessionKey=self._sessionKey,
                getargs=query,
                raiseAllErrors=True
            )
            if response.status == 200:
                content_count=len(json.loads(content.decode('utf-8')))
                total_record_count+=content_count
                skip_count+=PAGINATION_LIMIT
            else:
                logger.error({
                    "GET api call is not sucessful: status: {}, content: {}".format(response.status, content)
                })
                raise Exception(GET_COLLECTION_ITEMS_COUNT_FAILED)
        return total_record_count

    def cleanup_ephemeral_data(self, collection_endpoint, query_dict):
        """Cleanup progress collection data"""

        logger.info("Query: {}".format(query_dict))

        # Get progress data
        total_record_count = 0
        api_endpoint = "{}/{}".format(DEFAULT_ENDPOINT, collection_endpoint)
        try:
            total_record_count = self.get_kvstore_records_count(api_endpoint, query_dict)
            logger.info("Total count for cleanup : {}".format(total_record_count))
        except Exception as exc:
            logger.error(
                "Failed to get data. Error: {}".format(exc)
            )
            raise Exception(GET_COLLECTION_ITEMS_COUNT_FAILED)

        # Cleanup progress data
        if(self._fix_flag and total_record_count > CLEANUP_ITEMS_THRESHOLD):
            delete_api_endpoint = "{}/{}".format(DEFAULT_ENDPOINT, collection_endpoint)
            try:
                delete_response = self.cleanup_kvstore_collection(delete_api_endpoint, query_dict)
                if delete_response[0]['status'] == '200':
                    logger.info("Cleanup performed successfully.")
            except Exception as exc:
                logger.error(
                    "Failed to cleanup data. Error: {}".format(exc)
                )
                raise Exception(CLEANUP_COLLECTION_FAILED_EXCEPTION)

    def cleanup_progress_data(self):
        """Cleanup progress collection data"""

        time_dictionary = {"$lt" : self._cleanup_timestamp}
        for key in self._progress_cleanup_items:
            query_dict = {'query': json.dumps({self._progress_cleanup_items[key]: key, 'createdAt': time_dictionary})}
            logger.info("Cleanup started for Progress -> {}".format(key))
            self.cleanup_ephemeral_data(PROGRESS_ENDPOINT, query_dict)

    def cleanup_tasks_data(self):
        """Cleanup tasks collection data"""
        
        time_dictionary = {"$lt" : self._cleanup_timestamp}
        for key in self._task_cleanup_items:
            query_dict = {'query': json.dumps({self._task_cleanup_items[key]: key, 'state': 'completed', 'createdAt': time_dictionary})}
            logger.info("Cleanup started for Tasks -> {}".format(key))
            self.cleanup_ephemeral_data(TASKS_ENDPOINT, query_dict)

    def cleanup_commands_data(self):
        """Cleanup commands collection data"""

        time_dictionary = {"$lt" : self._cleanup_timestamp}
        for key in self._command_cleanup_items:
            query_dict = {'query': json.dumps({self._command_cleanup_items[key]: key, 'state': 'completed', 'createdAt': time_dictionary})}
            logger.info("Cleanup started for Commands -> {}".format(key))
            self.cleanup_ephemeral_data(COMMANDS_ENDPOINT, query_dict)

    def set_fix_flag(self, flag):
        self._fix_flag = flag

def generate_session_key():
    username = input("Username: ")
    password = getpass.getpass("Password: ")
    myhttp = httplib2.Http(".cache", disable_ssl_certificate_validation=True)
    servercontent = myhttp.request(BASE_URL + '/services/auth/login', 'POST',
                            headers={}, body=urllib.parse.urlencode({'username':username, 'password':password}))[1]
    sessionkey = minidom.parseString(servercontent).getElementsByTagName('sessionKey')[0].childNodes[0].nodeValue
    return sessionkey

def main(args):
    try:
        if (args.fix and args.dryrun) or (len(sys.argv)>2):
            print("Both options cannot be used simultaneously. Use --dryrun to get count of ephmeral data"
            " and --fix to cleanup them. Do not use --noninteractive option from CLI, this is only used for Scripted input workflow.")
            print("Exiting...")
            sys.exit(-1)
        
        if args.noninteractive:
            splunk.admin.init(KVStoreCleanUp, splunk.admin.CONTEXT_APP_ONLY)
            sessionkey = sys.stdin.readline().strip()
            args.fix = True
        else:
            sessionkey = generate_session_key()
            
        kvstore_cleanup = KVStoreCleanUp(sessionkey)
        kvstore_cleanup.set_fix_flag(args.fix)

        # Perform cleanup activities for Tasks, Commands, and Progress
        kvstore_cleanup.cleanup_progress_data()
        kvstore_cleanup.cleanup_tasks_data()
        kvstore_cleanup.cleanup_commands_data()
    except Exception as ex:
        logger.error("Error occured while cleaning ephemeral data: {}".format(ex))
        sys.exit(-1)

if __name__ == '__main__':
    description = '''Run the script without any arguments or with "--dryrun" to get count of ephmeral data from different colletions. 
    \nRun the script with "--fix" argument to delete those ephemeral data.\n'''
    parser = argparse.ArgumentParser(description=description)

    parser.add_argument("--dryrun", action="store_true",
                        help='Get count of ephmeral data\n'
                             'eg python3 kvstore_cleanup_job.py --dryrun')
    parser.add_argument("--fix", action="store_true",
                        help='Cleanup ephemral data from different collections\n'
                             'eg python3 kvstore_cleanup_job.py --fix')
    parser.add_argument("--noninteractive", action="store_true",
                        help='Do not use this option from CLI.\n'
                             'This option has been used by Splunk scripted input workflow')
    args = parser.parse_args()
    main(args)
