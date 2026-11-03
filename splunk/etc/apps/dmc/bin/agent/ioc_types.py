# pylint: disable=import-outside-toplevel
# there is a circular dependency from when wtransaction is imported in __init__.py
"""
Contains types that can injected at runtime
Currently only support singleton types
When adding a new type, just add a new "property" returning the type itself.
"""
from functools import wraps


class TypedFeature():
    """
    A typed "feature"
    """
    def __init__(self, feature_type):
        self.type = feature_type

    def __call__(self):
        """
        :return: the provider of the feature
        """
        import agent.ioc
        return agent.ioc.require_feature(self.type, lazy=True)

    def provide(self, provider=None):
        """
        Inject a provider to the feature
        :param provider: If None, inject the type itself (i.e. no stubbing)
        """
        import agent.ioc
        if provider is None:
            provider = self.type
        agent.ioc.features().Provide(self.type, provider, singleton=True)


def ioc_feature(fget):
    """
    Return a "feature" for the type
    """
    @wraps(fget)
    def decorate(*args, **kwargs):
        """
        Return the "feature" for a type
        """
        return TypedFeature(fget(*args, **kwargs))
    return decorate


# pylint: disable=missing-docstring
# pylint: disable=too-many-public-methods
# Types are listed below

class Components():

    @property
    def components(self):
        import agent
        return agent

    @property
    @ioc_feature
    def commands_controller(self):
        return self.components.CommandsController

    @property
    @ioc_feature
    def configuration(self):
        return self.components.Configuration

    @property
    @ioc_feature
    def stack(self):
        return self.components.Stack

    @property
    @ioc_feature
    def dmc_enabler(self):
        return self.components.DmcEnabler

    @property
    @ioc_feature
    def event_aggregator(self):
        return self.components.EventAggregator

    @property
    @ioc_feature
    def forwarders_controller(self):
        return self.components.ForwardersController

    @property
    @ioc_feature
    def splunk_home(self):
        return self.components.SplunkHome

    @property
    @ioc_feature
    def splunk_host(self):
        return self.components.SplunkHost

    @property
    @ioc_feature
    def stdin_controller(self):
        return self.components.StdinController

    @property
    @ioc_feature
    def tasks_controller(self):
        return self.components.TasksController

    @property
    @ioc_feature
    def transaction_manager(self):
        return self.components.TransactionManager

    @property
    @ioc_feature
    def user_context(self):
        return self.components.UserContext


class Repositories():

    @property
    def repositories(self):
        from agent import repositories
        return repositories

    @property
    @ioc_feature
    def apps_repository(self):
        return self.repositories.KVStoreAppsRepository

    @property
    @ioc_feature
    def commands_repository(self):
        return self.repositories.KVStoreCommandsRepository

    @property
    @ioc_feature
    def deployed_changelog_repository(self):
        return self.repositories.KVStoreDeployedChangelogRepository

    @property
    @ioc_feature
    def groups_repository(self):
        return self.repositories.KVStoreGroupsRepository

    @property
    @ioc_feature
    def installation_graph_repository(self):
        return self.repositories.KVStoreInstallationGraphRepository

    @property
    @ioc_feature
    def instances_repository(self):
        return self.repositories.KVStoreInstancesRepository

    @property
    @ioc_feature
    def pending_changelog_repository(self):
        return self.repositories.KVStorePendingChangelogRepository

    @property
    @ioc_feature
    def predeployment_backup_repository(self):
        return self.repositories.KVStorePreDeploymentBackupRepository

    @property
    @ioc_feature
    def progress_repository(self):
        return self.repositories.KVStoreProgressRepository

    @property
    @ioc_feature
    def stanzas_repository(self):
        return self.repositories.FilesystemStanzasRepository

    @property
    @ioc_feature
    def tasks_repository(self):
        return self.repositories.KVStoreTasksRepository

    @property
    @ioc_feature
    def topologies_repository(self):
        return self.repositories.KVStoreTopologiesRepository

    @property
    @ioc_feature
    def persistent_data_repository(self):
        return self.repositories.KVStorePersistentDataRepository


class Services():

    @property
    def services(self):
        from agent import services
        return services

    @property
    @ioc_feature
    def apps_service(self):
        return self.services.AppsService

    @property
    @ioc_feature
    def audit_service(self):
        return self.services.AuditService

    @property
    @ioc_feature
    def cancel_pending_changes_service(self):
        return self.services.CancelPendingChangesService

    @property
    @ioc_feature
    def changelog_service(self):
        return self.services.ChangelogService

    @property
    @ioc_feature
    def commands_service(self):
        return self.services.CommandsService

    @property
    @ioc_feature
    def deploy_service(self):
        return self.services.DeployService

    @property
    @ioc_feature
    def forwarder_setup_service(self):
        return self.services.ForwarderSetupService

    @property
    @ioc_feature
    def groups_service(self):
        return self.services.GroupsService

    @property
    @ioc_feature
    def inputs_configuration_service(self):
        return self.services.InputsConfigurationService

    @property
    @ioc_feature
    def instances_service(self):
        return self.services.InstancesService

    @property
    @ioc_feature
    def licenser_service(self):
        return self.services.LicenserService

    @property
    @ioc_feature
    def outputs_configuration_service(self):
        return self.services.OutputsConfigurationService

    @property
    @ioc_feature
    def progress_service(self):
        return self.services.ProgressService

    @property
    @ioc_feature
    def secure_storage(self):
        return self.services.SecureStorage

    @property
    @ioc_feature
    def slim_service(self):
        return self.services.SlimService

    @property
    @ioc_feature
    def stanzas_service(self):
        return self.services.StanzasService

    @property
    @ioc_feature
    def tasks_service(self):
        return self.services.TasksService

    @property
    @ioc_feature
    def topologies_service(self):
        return self.services.TopologiesService

    @property
    @ioc_feature
    def external_apps_service(self):
        return self.services.ExternalAppsService

    @property
    @ioc_feature
    def packages_service(self):
        return self.services.PackagesService


class RestApi():

    @property
    def restapi(self):
        from agent import restapi
        return restapi

    @property
    @ioc_feature
    def apps_endpoint(self):
        return self.restapi.AppsEndpoint

    @property
    @ioc_feature
    def audit_endpoint(self):
        return self.restapi.AuditEndpoint

    @property
    @ioc_feature
    def auth_plugin(self):
        return self.restapi.AuthPlugin

    @property
    @ioc_feature
    def changelog_endpoint(self):
        return self.restapi.ChangelogEndpoint

    @property
    @ioc_feature
    def configuration_entry_endpoints(self):
        return self.restapi.ConfigurationEntryEndpoints

    @property
    @ioc_feature
    def deploy_endpoint(self):
        return self.restapi.DeployEndpoint

    @property
    @ioc_feature
    def forwarder_setup_endpoint(self):
        return self.restapi.ForwarderSetupEndpoint

    @property
    @ioc_feature
    def httpserver(self):
        return self.restapi.Server

    @property
    @ioc_feature
    def info_endpoint(self):
        return self.restapi.InfoEndpoint

    @property
    @ioc_feature
    def json_request_plugin(self):
        return self.restapi.JSONRequestPlugin

    @property
    @ioc_feature
    def json_response_plugin(self):
        return self.restapi.JSONResponsePlugin

    @property
    @ioc_feature
    def licenser_endpoint(self):
        return self.restapi.LicenserEndpoint

    @property
    @ioc_feature
    def logger_endpoint(self):
        return self.restapi.LoggerEndpoint

    @property
    @ioc_feature
    def logging_plugin(self):
        return self.restapi.LoggingPlugin

    @property
    @ioc_feature
    def meta_plugin(self):
        return self.restapi.MetaPlugin

    @property
    @ioc_feature
    def secure_storage_endpoint(self):
        return self.restapi.SecureStorageEndpoint

    @property
    @ioc_feature
    def splunkd_endpoint(self):
        return self.restapi.SplunkdEndpoint

    @property
    @ioc_feature
    def tasks_endpoint(self):
        return self.restapi.TasksEndpoint

    @property
    @ioc_feature
    def topologies_endpoint(self):
        return self.restapi.TopologiesEndpoint

    @property
    @ioc_feature
    def packages_endpoint(self):
        return self.restapi.PackagesEndpoint


class Commands():

    @property
    def commands(self):
        from agent import commands
        return commands

    @property
    @ioc_feature
    def executor(self):
        return self.commands.Executor

    @property
    @ioc_feature
    def ssh_service(self):
        return self.commands.SSHService

    @property
    @ioc_feature
    def sync_dc_command(self):
        return self.commands.SyncDeploymentClientCommand

    @property
    @ioc_feature
    def discover_external_apps_command(self):
        return self.commands.DiscoverExternalAppsCommand
