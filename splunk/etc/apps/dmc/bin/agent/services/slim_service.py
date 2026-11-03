"""
SLIM access service
"""
import os
import io
import json
import shutil
import re
import logging
import tarfile
from collections import OrderedDict

import slim
from slim.utils import SlimStatus, SlimLogger, SlimExternalFormatter, SlimConstants, SlimUnreferencedInputGroups, \
    slim_configuration, slim_transaction

import agent
from agent import ioc, wtransaction
from agent.main import LoggerConstants
from agent.models import InstallationGraph
from agent.common.helpers import mkdir_p, trace
from agent.services.group_helpers import builtin_name


_logger = logging.getLogger(__name__)


# SLIM-TODO: SLIM cannot handle multiple concurrent requests, as the library uses a single global context (SPL-122003)
class SlimService(ioc.Component):
    """
    SLIM access service
    """

    def __init__(self):
        self._splunk_home = ioc.components.splunk_home()
        self._stanzas_service = ioc.services.stanzas_service()
        self._graph_repository = ioc.repositories.installation_graph_repository()
        self._configuration = ioc.components.configuration()

        # Setup the SLIM logger to point to the DMC logger
        handler = LoggerConstants.get_agent_handler()
        handler.setFormatter(
            SlimExternalFormatter(LoggerConstants.get_agent_format())
        )
        SlimLogger.use_external_handler(handler)

        # Assign logging paths we want to sanitize
        slim_configuration.sanitized_paths = [
            (os.path.join(self._splunk_home.home(), ''), 'splunk/'),
        ]

        # Set slim overwrite flag
        slim_configuration.slim_cache_overwrite = self._configuration.get_boolean('slim_cache_overwrite', default=True)

        # Setup SLIM repository location for packages
        slim_configuration.repository_path = os.path.join(self._splunk_home.repository())
        mkdir_p(slim_configuration.repository_path)

        # Setup SLIM staged repository for additions and deletions
        mkdir_p(self._splunk_home.repository_staged_add())
        mkdir_p(self._splunk_home.repository_staged_remove())

    @trace
    @wtransaction
    def commit_installation(self):
        """
        Commit the current "staged" installation graph; discard sll other versions
        """
        try:
            current_graph = self._graph_repository.get_current()
        except agent.NotFoundException:
            return  # nothing to commit

        _logger.info("Commit current installation graph, version %d", current_graph.version)

        current_graph.staged = False
        self._graph_repository.update(current_graph, log_change=False)

        self._graph_repository.delete_all(query={"staged": True})

    @trace
    @wtransaction
    def clean_older_installation_graphs(self):
        """
        The external apps discovery keeps adding the new graphs but never used to
        remove them. So this method will keep the number of graphs stored to
        a limited number by removing  graphs that are older than max_graphs_to_keep
        configuration value.
        """
        max_graphs_to_keep = self._configuration.get_int("max_graphs_to_keep", default=50)

        total_graphs_found = self._graph_repository.get_count()

        _logger.info("Total number of graphs currently present: %d. Max Graphs to keep: %d",
                     total_graphs_found, max_graphs_to_keep)

        if total_graphs_found > max_graphs_to_keep:
            last_version_to_keep = self._graph_repository.get_last_version_to_keep(max_graphs_to_keep)
            if last_version_to_keep:
                _logger.info("Removing older graphs with version less than version %d.", last_version_to_keep)
                self._graph_repository.delete_older_graphs(last_version_to_keep)
            else:
                _logger.warning("Failed removing older graphs with version less than version %d.",
                                last_version_to_keep)

    @trace
    @wtransaction
    def rollback_installation(self):
        """
        Rollback the current installation graph to the previous version
        """
        try:
            current_graph = self._graph_repository.get_current()
        except agent.NotFoundException:
            return  # nothing to rollback
        current_graph_version = current_graph.version

        _logger.info("Rollback current installation graph, version %d", current_graph_version)

        # If the graph is staged we can just remove it from the repository
        if current_graph.staged:
            _logger.debug("Current installation graph is staged, deleting it.")
            self._graph_repository.delete(current_graph.objid, log_change=False)
            return

        # Get the previous version; if it does not exist we revert back to an empty installation
        previous_graph = self._graph_repository.find_version(current_graph_version - 1)
        if previous_graph is None:
            _logger.debug("Previous installation graph does not exist, rollback to an empty state.")
            previous_graph = InstallationGraph(use_defaults=True)

        # Create new staged graph entry with the previous graph data and new version
        self._graph_repository.add_new_graph(current_graph_version + 1, previous_graph.get_value("graph"))

    @trace
    @wtransaction
    def commit_repository(self, skip=None):
        """
        Commit the current repository by clearing the staged add/remove packages
        """
        _logger.info("Commit package repository changes, except for the following packages:\n  %s",
                     "\n  ".join(skip) if skip else "None")

        if os.path.exists(self._splunk_home.repository_staged_add()):
            shutil.rmtree(self._splunk_home.repository_staged_add())
        mkdir_p(self._splunk_home.repository_staged_add())

        if os.path.exists(self._splunk_home.repository_staged_remove()):
            shutil.rmtree(self._splunk_home.repository_staged_remove())
        mkdir_p(self._splunk_home.repository_staged_remove())

        # Restore the staged-for-add app packages that we want to skip
        for package in skip if skip is not None else []:
            shutil.copy(
                os.path.join(slim_configuration.repository_path, package),
                os.path.join(self._splunk_home.repository_staged_add(), package)
            )

    @trace
    @wtransaction
    def add_package(self, package, package_name=None):
        """
        Add the package to the repository, marking the add as staged (not yet deployed)
        """
        _logger.info("Add %s to the package repository", os.path.basename(package))

        if not package_name:
            package_name = os.path.basename(package)
        package_path = os.path.join(slim_configuration.repository_path, package_name)

        package_path_add = os.path.join(self._splunk_home.repository_staged_add(), package_name)
        package_path_remove = os.path.join(self._splunk_home.repository_staged_remove(), package_name)

        # If this was a staged package for remove, add it back but don't mark the add as staged
        if os.path.exists(package_path_remove):
            os.remove(package_path_remove)
        else:
            shutil.copy(package, package_path_add)

        # Add the package to the current repository
        if not os.path.exists(package_path):
            shutil.copy(package, package_path)

        return package_path

    @trace
    @wtransaction
    def remove_package(self, package_name):
        """
        Remove the package from the repository, marking the remove as staged (not yet deployed)
        """
        _logger.info("Remove %s from the package repository", package_name)

        package_path = os.path.join(slim_configuration.repository_path, package_name)

        package_path_add = os.path.join(self._splunk_home.repository_staged_add(), package_name)
        package_path_remove = os.path.join(self._splunk_home.repository_staged_remove(), package_name)

        # If this was a staged package for add, remove it but don't mark the remove as staged
        if os.path.exists(package_path_add):
            os.remove(package_path_add)
        else:
            shutil.copy(package_path, package_path_remove)

        # Remove the package from the current repository
        if os.path.exists(package_path):
            os.remove(package_path)

        forwarders_package_path = os.path.join(
            slim_configuration.repository_path,
            package_name.replace(".tar.gz", "") + "-" + builtin_name.forwarders + ".tar.gz")

        if os.path.exists(forwarders_package_path):
            os.remove(forwarders_package_path)

    @trace
    def copy_app_archive(self, app_package, ofile, group=None):
        """
        Copy the app archive from the repository, if it exists
        If the group field is specified, copy that specific deployment package archive, if it exists
        """
        if group is None:
            # Copy the full app archive
            package_path = os.path.join(self._splunk_home.repository(), app_package)
            if not os.path.exists(package_path):
                raise agent.NotFoundException("App package %s does not exist" % app_package)
            with open(package_path, 'r+b') as tar:
                shutil.copyfileobj(tar, ofile)
        else:
            # Copy the specific deployment package
            deployment_package = app_package.replace(".tar.gz", "") + "-" + group + ".tar.gz"
            package_path = os.path.join(self._splunk_home.repository(), deployment_package)
            if not os.path.exists(package_path):
                raise agent.NotFoundException("Deployment package %s does not exist" % deployment_package)
            with open(package_path, 'r+b') as tar:
                shutil.copyfileobj(tar, ofile)

    @trace
    def export_app_archive(self, app):
        """
        Export this app source as a package to the SLIM repository
        """
        version = self._stanzas_service.get_app_version(app)
        package_name = "_%s-%s.tar.gz" % (app, version)
        package_path = os.path.join(self._splunk_home.repository(), package_name)
        self._stanzas_service.export_app_archive(app, package_path)
        return package_name

    def get_app_manifest_from_cache(self, app_id, app_package):
        """
           Describe slim properties of an app, such as dependencies and forwarder groups
        """
        app_manifest = {}
        new_manifest = OrderedDict()
        package_name = ""
        manifest_allowed_keys = {'info': 'info',
                                 'schemaVersion': 'schema_version', 'supportedDeployments': 'supported_deployments'}

        try:
            if app_package.endswith('.tar.gz'):
                package_name = app_package[:-len('.tar.gz')]
            elif app_package.endswith('.tgz') or app_package.endswith('.tar') or app_package.endswith('.spl'):
                package_name = app_package[:-len('.spl')]
            else:
                # We dont support other formats but for safer side falling back to default behavior
                return None

            app_manifest_filename = slim_configuration.cache.cache_path + "/" \
                + package_name + ".source/" + app_id + "/app.manifest"

            if os.path.isfile(app_manifest_filename) and (os.path.getsize(app_manifest_filename) > 0):
                _logger.info("Found app.manifest in cache Path : %s ", app_manifest_filename)
                with io.open(app_manifest_filename, encoding='utf-8') as istream:
                    # confirmed re.match copies no text
                    text = ''.join(line for line in istream if re.match(r'\s*#', line) is None)
                    app_manifest = json.loads(text, object_pairs_hook=OrderedDict)
                # UI uses only supported_deployment from manifest , using slim to
                # Load will trigger same slim conflict , as this is only for APP's
                # loaded prior to fix which are not installed , verfy few APP's will
                # be triggering this code.
                for key in app_manifest:
                    if key in manifest_allowed_keys:
                        new_manifest[manifest_allowed_keys[key]] = app_manifest[key]
        except Exception as ex:  # pylint: disable=broad-except
            _logger.error("Failed to load app.manifest from slim cache for app_id %s due to exception: %s",
                          app_id, str(ex))
            return None

        return new_manifest

    @trace
    def describe(self, app_source):
        """
        Describe slim properties of an app, such as dependencies and forwarder groups
        """
        with slim_transaction():
            slim.describe(app_source, app_only=True)
        result = slim_configuration.payload.payload
        if result.get('manifest'):
            _logger.info("Slim service action describe for app: %s is completed and the result is %s",
                         os.path.basename(app_source), result.get('manifest', {}).get('info', {}))
        else:
            _logger.info("Slim service action describe for app: %s is completed and the result is %s",
                         os.path.basename(app_source), result)
        return self._update_payload_messages(result)

    @trace
    @wtransaction
    def install_app(self, app_package, mappings, external=False, disable_automatic_resolution=True):
        """
        Install the app package to the provided mappings
        """
        action = {
            "action": "set",
            "args": {
                "app_package": str(app_package),
                "combine_search_head_indexer_workloads": 0,  # SLIM-TODO: dynamically determine this value (SPL-124375)
                "workloads": mappings,
                "is_external": external,
                "deployment_packages": []
            }
        }
        _logger.info("Add app package %s to the installation graph with the following mappings:\n  %s",
                     os.path.basename(app_package), json.dumps(mappings))

        current_graph = self._graph_repository.get_current()
        payload = self.update_installation(current_graph.get_value("graph"), [action], disable_automatic_resolution)
        if payload["status"] == SlimStatus.STATUS_OK:
            self._graph_repository.add_new_graph(current_graph.version + 1, payload["installation_graph"])
            _logger.info("Installation graph is updated for the app %s and updates are %s",
                         os.path.basename(app_package), payload.get('installation_graph_updates', {}))
            _logger.info("App package %s added to the installation graph", os.path.basename(app_package))
        return payload

    @trace
    @wtransaction
    def update_app(self, app_package):
        """
        Update the app package with the current mappings
        """
        action = {
            "action": "update",
            "args": {
                "app_package": str(app_package)
            }
        }
        _logger.info("Update installation graph with new app package %s", os.path.basename(app_package))

        current_graph = self._graph_repository.get_current()
        payload = self.update_installation(current_graph.get_value("graph"), [action])
        if payload["status"] == SlimStatus.STATUS_OK:
            self._graph_repository.add_new_graph(current_graph.version + 1, payload["installation_graph"])
            _logger.info("Installation graph is updated for the app %s and updates are %s",
                         os.path.basename(app_package), payload.get('installation_graph_updates', {}))
            _logger.info("App package %s updated in the installation graph", os.path.basename(app_package))
        return payload

    @trace
    @wtransaction
    def uninstall_app(self, app_name):
        """
        Uninstall the app from the current installation
        """
        action = {
            "action": "remove",
            "args": {
                "app_id": str(app_name)
            }
        }
        _logger.info("Remove app %s from the installation graph", app_name)

        # Update the current installation graph by removing the root app requested. The payload, on success,
        # will include the new installation graph that represents the system after this app is gone.
        current_graph = self._graph_repository.get_current()
        payload = self.update_installation(current_graph.get_value("graph"), [action])
        if payload["status"] == SlimStatus.STATUS_OK:
            self._graph_repository.add_new_graph(current_graph.version + 1, payload["installation_graph"])
            _logger.info("Installation graph is updated for the app %s and updates are %s",
                         app_name, payload.get('installation_graph_updates', {}))
            _logger.info("App %s removed from the installation graph", app_name)
        return payload

    def update_installation(self, installation_graph, actions, disable_automatic_resolution=False):
        """
        Apply the given actions to the given installation graph
        """
        with slim_transaction():
            slim.update_installation(installation_graph,
                                     actions,
                                     target_os="_linux_x86_64",
                                     disable_automatic_resolution=disable_automatic_resolution)
        return self._update_payload_messages(slim_configuration.payload.payload)

    @trace
    def validate_package(self, app_package):
        """
        Validate slim properties of a package, such as dependencies and forwarder groups
        """
        with slim_transaction():
            slim.validate(app_package, unreferenced_input_groups=SlimUnreferencedInputGroups.warn, app_only=True)
        return self._update_payload_messages(slim_configuration.payload.payload)

    @trace
    def package(self, app_source, output_dir):
        """
        Package the app into a slim package to the output directory
        """
        with slim_transaction():
            slim.package(app_source, output_dir)
        return self._update_payload_messages(slim_configuration.payload.payload)

    @trace
    def partition(self, app_source, output_dir):
        """
        Partition the app into deployment packages based on current installation graph state
        """
        current_graph = self._graph_repository.get_current()
        installation_graph = current_graph.get_value("graph")

        with slim_transaction():
            slim.partition(app_source, installation_graph, output_dir)
        payload = slim_configuration.payload.payload
        if payload.get("status") == SlimStatus.STATUS_OK:
            _logger.info("Partition is completed for the app %s and the actions are %s",
                         os.path.basename(app_source), payload.get('installation_actions', {}))
        return self._update_payload_messages(payload)

    def _update_payload_messages(self, payload):
        """
        Do not return the info messages, only warnings/errors depending on status. Also remove duplicate messages
        that can happen if we process multiple workloads and groups before returning
        """
        if payload["status"] == SlimStatus.STATUS_OK:
            level = logging.getLevelName(logging.WARNING)
            payload["messages"] = list(set(payload["messages"][level])) if level in payload["messages"] else []
        else:
            level = logging.getLevelName(logging.ERROR)
            assert level in payload["messages"]  # If we have an error status we better have some error messages
            payload["messages"] = list(set(payload["messages"][level]))

        if payload["status"]:
            _logger.info("Returning SLIM payload with status %d", payload["status"])
        return payload


def rename_app_package(source, dest_dir, app_id, app_version):
    """
    Rename an app package into the SLIM format, <app_id>-<app_version>.tar.gz
    """
    app_package = os.path.join(dest_dir, "%s-%s.tar.gz" % (app_id, app_version))
    os.rename(source, app_package)
    return app_package


def copy_app_package(source, dest_dir, app_id, app_version):
    """
    Copy an app package into the SLIM format, <app_id>-<app_version>.tar.gz
    """
    app_package = os.path.join(dest_dir, "%s-%s.tar.gz" % (app_id, app_version))
    shutil.copyfile(source, app_package)
    return app_package


@trace
def extract_packaged_dependencies(package, target_dir):
    """
    Extract the packaged dependencies to the target_path specified
    """
    package_paths = []

    def _filter_dependencies(members):
        """ Filter only the packaged dependency members
        """
        for tarinfo in members:
            if not tarinfo.name.startswith(SlimConstants.DEPENDENCIES_DIR + "/"):
                continue
            tarinfo.name = os.path.basename(tarinfo.name)
            package_paths.append(os.path.join(target_dir, tarinfo.name))
            yield tarinfo

    with tarfile.open(package) as tar:
        tar.extractall(target_dir, members=_filter_dependencies(tar))

    return package_paths


def count_packaged_dependencies(package):
    """
    Count the number of packaged dependencies
    """
    with tarfile.open(package) as tar:
        return count_packaged_dependencies_from_tar(tar)


def count_packaged_dependencies_from_tar(tar):
    """
    Count the number of packaged dependencies from an opened tar file
    """
    return sum(1 for name in tar.getnames() if name.startswith(SlimConstants.DEPENDENCIES_DIR + "/"))
