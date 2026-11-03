"""
This automated script, when run without any arguments,
searches for any partially installed apps, where
the app has dependencies defined in the installation graph, but
without having an entry in the DMC's apps kvstore.
When the script is run with the "--fix" argument, it attempts to
delete all partially installed apps.

After copying this script to the Cluster Manager, run the script:
  python3 scan_and_delete_partially_installed_app.py
  python3 scan_and_delete_partially_installed_app.py --fix

Requires admin password.
"""

import os
import sys
import json
import time
import tarfile
import tempfile
import argparse
import subprocess
import logging

import semantic_version

import splunk.admin
import splunk.rest
from scripted_input_utils import generate_session_key, get_script_log_format
from agent.main import LoggerConstants


logger = logging.getLogger(__name__)
handler = LoggerConstants.get_agent_handler()
handler.setFormatter(logging.Formatter(get_script_log_format()))
logger.addHandler(handler)
stdout_handler = logging.StreamHandler(sys.stdout)
stdout_handler.setFormatter(logging.Formatter("%(filename)s: %(message)s"))
logger.addHandler(stdout_handler)
logger.setLevel(logging.INFO)

BASE_URL = "https://localhost:8089"
APPS_COLLECTION_PATH = "/servicesNS/nobody/dmc/storage/collections/data/apps"
DMC_APPS_PATH = "/services/dmc/apps?count=0"
GRAPHS_URL = "/services/dmc/apps-meta/installation_graph?committed=true"
GET_APPS_COLLECTION_FAILED = "GET_APPS_COLLECTION_FAILED"
GET_GRAPH_COLLECTION_FAILED = "GET_GRAPH_COLLECTION_FAILED"
IMPROPER_ARGS_MSG = "Arguments passed improperly. Please check README for scripts user manual."


class InstallationGraph:
    def __init__(self):
        self._kvstore_backup_path = "/opt/splunk/var/lib/splunk/kvstorebackup/"
        self._kvstore_backup = "kvstore_dump_{}".format(time.time())
        self._kvstore_tar = self._kvstore_backup + ".tar.gz"
        try:
            self._tmp_path = tempfile.TemporaryDirectory()
            self._tmp_path_name = self._tmp_path.name
        except:
            self._tmp_path_name = tempfile.mkdtemp()
        self._graphs_path = "dmc/graphs/graphs0.json"
        self._graphs_tar = "graphs{}.tar.gz".format(time.time())
        self.backup_dmc_kvstore_and_extract()
        self.tmp_graphs_file = os.path.join(self._tmp_path_name, 
                                            self._graphs_path)
        with open(self.tmp_graphs_file, "r") as f:
            self.graphs = json.load(f)
        self.latest_graph = self.latest_graph_with_staged_false()

    def latest_graph_with_staged_false(self):
        """
        Return the latest graph which is not staged i.e. staged=False or none
        """
        try:
            latest_graph = max(self.graphs, key=lambda x: x["version"] \
                if not x["staged"] else -1)
        except TypeError:
            logger.error("Can't find latest unstaged installation graph.")
            raise
        return latest_graph

    def remove_app_from_workload(self, app_id_to_remove, workload):
        """Removes app from specified workload in graphs collection

        Returns True if app removed from workload else returns False.
        """
        workload_apps = self.latest_graph["graph"][workload]["apps"]
        # Bail out early if app isn't in the workload
        if app_id_to_remove not in workload_apps:
            logger.info("App {} is not present on {}. "
                "No need to remove from there!".format(app_id_to_remove, 
                                                       workload))
            return False
        logger.info("Removing {} from {} installation graph version {}."
            .format(app_id_to_remove, workload, self.latest_graph["version"]))
        del workload_apps[app_id_to_remove]

        return True

    def remove_app_from_dmc_graphs_file(self, app_id):
        """Removes app from kvstore backup

        Returns True if app removed from graph else returns False.
        """
        isRemoved = False

        # loop through targetWorkloads in graph
        for workload in self.latest_graph["graph"].keys():
            # app isRemoved is True if removed from any workload
            isRemoved |= self.remove_app_from_workload(app_id, workload)

        # Bail out if no workload modified
        if not isRemoved:
            logger.error("App {} not found in installation graph!".format(app_id))

        return isRemoved

    def append_new_graph(self):
        '''Appends new installation graph
        
        writes it to self.tmp_graphs_file'''
        self.latest_graph["version"] = self.latest_graph["version"] + 1
        self.graphs.append(self.latest_graph)
        with open(self.tmp_graphs_file, "w") as f:
            json.dump(self.graphs, f, separators=(", ", " : "))
        logger.info("Successfully updated installation graph's version: {} and "
            "saved it to the file: {}".format(
                self.latest_graph["version"], self.tmp_graphs_file))

    def copy_graphs_tar_to_kvstore_backup(self):
        '''Create tarball to restore.'''
        full_graphs_tar = os.path.join(self._kvstore_backup_path, 
                                       self._graphs_tar)
        with tarfile.open(full_graphs_tar, "w:gz") as tar:
            tar.add(self.tmp_graphs_file, arcname=self._graphs_path)

    def restore_graph(self):
        '''Restore updated kvstore.'''
        subprocess.check_output(
            "splunk restore kvstore -archiveName {} -collectionName graphs \
                -appName dmc".format(self._graphs_tar), shell=True)
        logger.info("App deleted successfully \nRestored Updated KVStore.")

    def backup_dmc_kvstore_and_extract(self):
        subprocess.check_output("splunk backup kvstore -archiveName {} \
            -appName dmc".format(self._kvstore_backup), shell=True)
        logger.info("KVStore Backup: {}".format(self._kvstore_tar))
        # wait until either, tar.gz is created(written) entirely OR 5 minutes.
        prev_size, count = 0, 0
        while count < 300:
            if count % 30 == 0:
                logger.info("KV store backup in progress . . .")
            count += 1
            time.sleep(1)
            try:
                current_size = os.path.getsize(self._kvstore_backup_path +
                    self._kvstore_tar)
                # if the file size does not change, the tar.gz
                # file is created(written) entirely.
                if current_size != 0 and current_size == prev_size:  
                    break
                prev_size = current_size
            except FileNotFoundError:
                continue
            except:
                raise Exception(sys.exc_info()[0], "occurred")
        # exit code if creating kvstore dump took more than 5 minutes.
        if count == 300:  
            logger.error("Taking longer to create KV-Store dump. Try running "
                "the script again.")
            sys.exit(1)
        # try extracting now that the kvstore is created entirely.
        try:
            with tarfile.open(self._kvstore_backup_path + self._kvstore_tar) \
                as tar:
                tar.extract(self._graphs_path, self._tmp_path_name)
                return True
        except tarfile.ReadError:
            logger.exception("Error in reading tarfile")
            raise Exception("Error in reading tarfile")
        except tarfile.ExtractError:
            logger.exception("Failed to extract files from the KVStore Backup "
                "created. Please retry.")
            raise Exception("Failed to extract files from the KVStore Backup "
                "created. Please retry.")
        
    def fix_dependency_dependent_mismatch(self, dependency_dependent_mismatch_hmap):
        latest_graph = self.latest_graph["graph"]
        for workload, value_objects in dependency_dependent_mismatch_hmap.items():
            workload_apps = latest_graph[workload]["apps"]
            if value_objects.mismatches_found:
                for app_a, app_b in value_objects.apps_to_add_as_dependency:
                    workload_apps[app_b]["dependencies"].append(app_a)
                for app_a, app_b in value_objects.apps_to_add_as_dependents:
                    workload_apps[app_b]["dependents"].append(app_a)
                for app_a, app_b in value_objects.apps_to_remove_from_dependency:
                    workload_apps[app_a]["dependencies"].remove(app_b)
                for app_a, app_b in value_objects.apps_to_remove_from_dependents:
                    workload_apps[app_a]["dependents"].remove(app_b)

class ScanForPartiallyInstalledApps:
    def __init__(self, _session_key):
        self._sessionKey = _session_key

    def get_apps_collection(self):
        """Get KVstore apps collection data."""
        endpoint = BASE_URL+APPS_COLLECTION_PATH
        _, content = splunk.rest.simpleRequest(
            endpoint,
            sessionKey=self._sessionKey,
            raiseAllErrors=True
        )
        return json.loads(content.decode("utf-8"))

    def get_apps(self):
        """Get DMC managed apps data (i.e., dmc/apps endpoint)"""
        endpoint = BASE_URL+DMC_APPS_PATH
        _, content = splunk.rest.simpleRequest(
            endpoint,
            sessionKey=self._sessionKey,
            raiseAllErrors=True
        )
        return json.loads(content.decode("utf-8"))

    def get_installation_graph(self):
        endpoint = BASE_URL+GRAPHS_URL
        _, content = splunk.rest.simpleRequest(
            endpoint,
            sessionKey=self._sessionKey,
            raiseAllErrors=True
        )
        return json.loads(content.decode("utf-8"))
        
    def get_partial_apps(self):
        try:
            logger.info("Loading DMC's apps data:")
            apps_json = self.get_apps_collection()
        except:
            logger.exception("ERROR: Unable to parse apps data returned.")
            sys.exit(1)
        else:
            dmc_app_list = set(item["name"] for item in apps_json)
            logger.info("DMC is currently tracking a total of {} apps.".format(
                str(len(dmc_app_list))))

        try:
            logger.info("Loading installation graph data:")
            ig_dict = self.get_installation_graph()
            ig_version = ig_dict["version"]
        except:
            logger.exception("ERROR: Encountered an error while retrieving and "
                "parsing the installation graph data.")
            sys.exit(1)
        else:
            logger.info("Current graph version: {}".format(ig_version))

        workload_list = list(ig_dict["graph"].keys())
        total_missing_app_list = set()
        for workload in workload_list:
            missing_app_list = []
            ig_app_list = list(ig_dict["graph"][workload]["apps"].keys())

            logger.info("Installation Graph Workload: {}".format(workload))
            logger.info("App count total: {}".format(str(len(ig_app_list))))

            for ig_app in ig_app_list:
                if ig_app not in dmc_app_list:
                    missing_app_list.append(ig_app)

            if len(missing_app_list) > 0:
                logger.error("Following app(s) are found in the installation "
                    "graph, but is missing from the apps list: {}"
                    .format(str(missing_app_list)))
                total_missing_app_list.update(missing_app_list)
            else:
                logger.info("All apps are correctly tracked in the apps and "
                    "the graphs of workload: {}".format(workload))

        return total_missing_app_list
    
    def get_app_version_mismatch(self):
        """Get a list of apps with version mismatches.
        
        Find entries in the graph collection with versions
        that don't match the version in the app collection
        
        Returns list of tuples consisting of [(app, workload)] where 
        mismatches are detected or an empty list.
        """
        apps_list = self.get_apps()
        graphs_dict = self.get_installation_graph()

        app_version_mismatch_list = []
        for app in apps_list["entry"]:
            apps_app_name = app["name"]
            apps_app_version = app["content"]["@version"]
            # check each workload in the installation graph to ensure the 
            # version matches
            for workload in graphs_dict["graph"].keys():
                if graphs_dict["graph"][workload]["apps"].get(apps_app_name):
                    graphs_app_version = graphs_dict["graph"][workload]["apps"]\
                        .get(apps_app_name).get("version")

                    # add app to the mismatch list if 
                    if semantic_version.Version.coerce(graphs_app_version) != \
                        semantic_version.Version.coerce(apps_app_version):
                        logger.debug("app: {}, app.version: {}, "
                                     "graph.version: {}, workload: {}".format(
                                        apps_app_name, apps_app_version,
                                        graphs_app_version, workload))
                        app_version_mismatch_list.append((apps_app_name, 
                                                          workload))

        return app_version_mismatch_list
    
    class DependencyHelper:
        def __init__(self):
            self.dependencies_list = []
            self.dependents_list = []
            self.apps_to_add_as_dependency = []
            self.apps_to_add_as_dependents = []
            self.apps_to_remove_from_dependency = []
            self.apps_to_remove_from_dependents = []
            self.mismatches_found = False 
            self.messages = []
        
        def detect_mismatch(self, workload_apps, workload, current_list):
            storage_list1 = storage_list2 = self.dependents_list
            if current_list == "dependencies":
                storage_list1 = self.dependencies_list
            elif current_list == "dependents":
                storage_list2 = self.dependencies_list
            opposite_list = "dependents" if current_list == "dependencies" else "dependencies"

            mismatches_found = True
            for app_a, app_b in storage_list1:
                mismatches_found = True
                if app_b not in storage_list2 and app_b not in workload_apps:
                    logger.info("App {} not present in the workload {} of the installation graph".format(str(app_b), str(workload)))
                    self.messages.append(" App " + app_b + " not present in the workload " + workload + " of the installation graph")
                    self.apps_to_remove_from_dependency.append((app_b, app_a)) if current_list == "dependencies" else self.apps_to_remove_from_dependents.append((app_b,app_a))
                elif (app_b, app_a) not in storage_list2:
                    logger.info("App {} missing from the {} list of app {} for workload {}".format(str(app_a), str(opposite_list), str(app_b), str(workload)))
                    self.messages.append(" App " + app_a + " missing from the " + opposite_list + " list of app " + app_b + " for workload " + workload)
                    # first app, here, app_a to be removed
                    self.apps_to_add_as_dependents.append((app_a, app_b)) if current_list == "dependencies" else self.apps_to_add_as_dependency.append((app_a, app_b))
                else:
                    mismatches_found = False

            return storage_list1 and mismatches_found

    def get_dependency_dependent_mismatch(self):
        graphs_dict = self.get_installation_graph()
        mismatches_hmap = {}

        logger.info("Scan for detecting dependency/dependent mismatch started non-interactively.")

        for workload in graphs_dict["graph"].keys():
            helper_obj = self.DependencyHelper()
            mismatches_hmap[workload] = helper_obj
            workload_apps = graphs_dict["graph"][workload]["apps"]

            for app in workload_apps:
                if len(workload_apps[app]["dependencies"]) > 0:
                    for dependency_app in workload_apps[app]["dependencies"]:
                        helper_obj.dependencies_list.append((app, dependency_app))
                        # detect if the removal of dependent (child app) will generate a partially installed app issue for the parent app. 
                        try: 
                            if workload_apps[dependency_app]["is_root"] == False:
                                helper_obj.messages.append("WARNING : Uninstalling app " + app + " will cause " + "app " + dependency_app + " to be partially installed. ")
                        except:
                            pass
                if len(workload_apps[app]["dependents"]) > 0:
                    for dependents_app in workload_apps[app]["dependents"]:
                        helper_obj.dependents_list.append((app, dependents_app))

            logger.info("Detecting mismatches for workload {}".format(str(workload)))

            issue_found_while_processing_list_1 = helper_obj.detect_mismatch(workload_apps, workload, current_list="dependencies")
            issue_found_while_processing_list_2 = helper_obj.detect_mismatch(workload_apps, workload, current_list="dependents")

            if not issue_found_while_processing_list_1 and not issue_found_while_processing_list_2:
                logger.info("No mismatches found for workload {}".format(str(workload)))
            else:
                helper_obj.mismatches_found = True

        return mismatches_hmap

def main(args):
    if (len(sys.argv) < 2):
        logger.error(IMPROPER_ARGS_MSG)
        sys.exit(1)
    
    if (args.dryrun or args.fix) and not args.noninteractive:
        sessionkey = generate_session_key()
    elif args.noninteractive and args.dryrun:
        logger.info("Scan for partially_installed_app started "
            "non-interactively.")
        splunk.admin.init(ScanForPartiallyInstalledApps, 
                          splunk.admin.CONTEXT_APP_ONLY)
        sessionkey = sys.stdin.readline().strip()
    else:
        logger.error(IMPROPER_ARGS_MSG)
        sys.exit(1)

    logger.info("partially_installed_app: Scan Started")

    get_partial_apps_obj = ScanForPartiallyInstalledApps(sessionkey)
    total_missing_app_list = get_partial_apps_obj.get_partial_apps()
    total_app_version_mismatch = get_partial_apps_obj.get_app_version_mismatch()
    dependency_dependent_mismatch_hmap = get_partial_apps_obj.get_dependency_dependent_mismatch()
    # remove items from total_app_version_mismatch that are already in 
    # total_missing_app_list, they will already be deleted
    total_app_version_mismatch = [x for x in total_app_version_mismatch 
                                  if x not in total_missing_app_list]
    
    total_dependency_dependent_mismatches = ""
    for workload, object_value in dependency_dependent_mismatch_hmap.items():
        if object_value.messages:
            total_dependency_dependent_mismatches += '\n'.join(object_value.messages) + "\n"

    if not total_missing_app_list and not total_app_version_mismatch and not total_dependency_dependent_mismatches:
        logger.info("No partially installed apps or dependency/dependent mismatch found. No action required.")
        logger.info("partially_installed_app: Scan Completed")
        sys.exit(0)
    else:
        logger.info("The following list of app(s) needs to be cleaned up from "
            "the Installation Graph:{}".format(str(total_missing_app_list)))
        logger.info("The following list of app(s) need version mismatches to "
            "be removed from the Installation Graph:{}".format(
                str(total_app_version_mismatch)))
        logger.info("The following list of app(s) need dependency/dependent mismatches to "
            "be updated from the Installation Graph:\n {}".format
            (total_dependency_dependent_mismatches))
        
    if args.fix:
        logger.info("partially_installed_app: Fix Started")

        installation_graph = InstallationGraph()
        # Remove missing apps from installation graph
        for app_id in total_missing_app_list:
            installation_graph.remove_app_from_dmc_graphs_file(app_id)

        # Remove apps with version mismatch from installation graph
        for app_id, workload in total_app_version_mismatch:
            installation_graph.remove_app_from_workload(app_id, workload)

        installation_graph.fix_dependency_dependent_mismatch(dependency_dependent_mismatch_hmap)
        
        installation_graph.append_new_graph()
        installation_graph.copy_graphs_tar_to_kvstore_backup()
        installation_graph.restore_graph()

        logger.info("partially_installed_app: Fix Completed")
    sys.exit(0)

if __name__ == "__main__":
    description = """Run the script without any arguments to list all the 
        partially installed applications and list all the dependency/dependents 
        mismatches in the Installation Graph. Run the script with "--fix" argument 
        to delete the partially installed application(s) and fix the 
        dependency/dependents mismatches. 
        i.e. Remove app_id from DMC's installation graph.\n\n
        	WARNING: This script only valid on Cluster Manager in 
            Splunk Classic Cloud."""

    my_parser = argparse.ArgumentParser(description=description)
    my_parser.add_argument("--dryrun", action="store_true",
                           help="Scans for all the partially installed app"
                                "and dependency/dependents mismatches"
                                "from installation graph "
                                "eg. python3 "
                                "scan_and_delete_partially_installed_app.py --dryrun")
    my_parser.add_argument("--fix", action="store_true",
                           help="Removes all the partially installed apps"
                                "and resolves all dependency/dependents mismatches"
                                "from installation graph "
                                "eg. python3 "
                                "scan_and_delete_partially_installed_app.py --fix")
    my_parser.add_argument("--noninteractive", action="store_true",
                           help="Do not use this option from CLI."
                                "This option has been used by Splunk scripted input workflow")
    args = my_parser.parse_args()
    main(args)
