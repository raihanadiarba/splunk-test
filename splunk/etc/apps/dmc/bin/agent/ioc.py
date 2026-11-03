"""
Taken from http://code.activestate.com/recipes/413268/
Revision 9
Licensed under the PSF License
"""

import weakref
from threading import Lock
from agent.common import helpers
from agent.ioc_types import Components, Services, Repositories, RestApi, Commands, TypedFeature


# pylint: disable=missing-docstring
# pylint: disable=invalid-name
# pylint: disable=multiple-statements
# pylint: disable=attribute-defined-outside-init
# pylint: disable=too-few-public-methods
# pylint: disable=useless-object-inheritance, useless-object-inheritance, import-outside-toplevel


class FeatureMaps(object):
    def __init__(self):
        self.providers = {}
        self.type_by_feature = {}
        self.feature_by_type = {}
        self.populated = False


class FeatureBroker(object):
    """Feature Broker
    """

    def __init__(self, feature_maps):
        self.injected_providers = {}
        self.providers = feature_maps.providers
        self.type_by_feature = feature_maps.type_by_feature
        self.feature_by_type = feature_maps.feature_by_type
        self.inject = False

    # pylint: disable=keyword-arg-before-vararg
    def Provide(self, feature, provider=None, singleton=False, *args, **kwargs):
        """
        Supply a provider to a feature
        """
        if isinstance(feature, TypedFeature):
            feature = feature.type

        if feature in self.injected_providers:
            raise KeyError("Provider for feature already injected: %r" % feature)

        if provider is None:
            assert not helpers.is_string(feature)
            # Provider is an instance of feature type itself
            provider = feature
            singleton = True

        if callable(provider):
            def call():
                return provider(*args, **kwargs)
        else:
            def call():
                return provider

        caller = call
        if singleton:
            class context(object):
                lock = Lock()
                instance = None

            def callx():
                with context.lock:
                    if not context.instance:
                        context.instance = call()
                return context.instance

            caller = callx

        if self.inject:
            feature = self._try_map_to_type(feature)
            self.injected_providers[feature] = caller
        else:
            if callable(provider):
                self.type_by_feature[feature] = provider
                self.feature_by_type[provider] = feature
            self.providers[feature] = caller

    def has_feature(self, feature):
        """
        Return true if a feature is provided
        """
        if feature in self.providers:
            return True

        return feature in self.injected_providers

    def _try_map_to_type(self, feature):
        """
        Map a string key of a feature to its corresponding python type
        """
        if helpers.is_string(feature):
            feature_type = self.type_by_feature.get(feature)
            if feature_type is not None:
                feature = feature_type
        return feature

    def _try_map_to_key(self, feature):
        """
        Map the python type of a feature to its string key
        """
        if not helpers.is_string(feature):
            feature_key = self.feature_by_type.get(feature)
            if feature_key is not None:
                feature = feature_key
        return feature

    def __contains__(self, feature):
        """
        Return true if a feature is provided
        """
        return self.has_feature(feature)

    def __getitem__(self, feature):
        if self.inject:
            feature = self._try_map_to_type(feature)
            if feature not in self.injected_providers:
                raise KeyError("Feature not injected: %r" % feature)
            provider = self.injected_providers[feature]
        else:
            feature = self._try_map_to_key(feature)
            if feature in self.providers:
                provider = self.providers[feature]
            else:
                if helpers.is_string(feature):
                    raise KeyError("Unknown feature named %r" % feature)

                # Make the feature type itself as the provider.
                self.Provide(feature)
                return self.__getitem__(feature)

        return provider()

    def must_inject(self):
        """
        Set the feature broker in "injection" mode,
        After setting this, all features requested must be "injected" first.
        """
        self.inject = True


# Cache feature maps so that we don't need to run "legacy_configure_ioc" for each unit test,
# which would slow down test run significantly.
feature_cache = FeatureMaps()

# Just to workaround existing code we will keep features as a global variable, but we will
# keep it as a weak reference on FeatureBroker
features = None  # type: FeatureBroker


def NewFeatureBroker(must_inject=True):
    # pylint: disable=global-statement
    global features
    # pylint: enable=global-statement

    broker = FeatureBroker(feature_cache)
    features = weakref.ref(broker)

    if not feature_cache.populated:
        legacy_configure_ioc(broker)
        feature_cache.populated = True

    if must_inject:
        broker.must_inject()

    return broker


# Some basic assertions to test the suitability of injected features

def NoAssertion(obj):
    assert obj or not obj
    return True


class RequiredFeature(object):
    """An attribute descriptor to "declare" required features
    """

    def __init__(self, feature, assertion=NoAssertion):
        self.feature = feature
        self.assertion = assertion

    def __get__(self, obj, T):
        return self.result  # <-- will request the feature upon first call

    def __getattr__(self, name):
        assert name == 'result', \
            "Unexpected attribute request other then 'result'"
        self.result = self.Request()
        return self.result

    def Request(self):
        obj = features()[self.feature]
        assert self.assertion(obj), \
            "The value %r of %r does not match the specified criteria" \
            % (obj, self.feature)
        return obj


class LazyRequiredFeature(object):
    """A feature with lazy resolution
    """

    def __init__(self, feature, assertion=NoAssertion):
        self.__feature = RequiredFeature(feature, assertion)
        self.__resolved_feature = None

    def __getattr__(self, name):
        self.resolve()
        return getattr(self.__resolved_feature, name)

    def __setattr__(self, name, value):  # pylint: disable=inconsistent-return-statements
        if name.startswith("_" + LazyRequiredFeature.__name__ + "__"):
            # For class instance members set in __init__
            super(LazyRequiredFeature, self).__setattr__(name, value)
        else:
            self.resolve()
            return setattr(self.__resolved_feature, name, value)

    def resolve(self):
        if self.__resolved_feature is None:
            self.__resolved_feature = self.__feature.result


def require_feature(feature, assertion=NoAssertion, lazy=False):
    """Require feature right away"""
    return LazyRequiredFeature(feature, assertion) if lazy else RequiredFeature(feature, assertion).result


class Component(object):
    """Symbolic base class for components

    See for more details:
        - http://code.activestate.com/recipes/413268/
        - https://wiki.python.org/moin/DependencyInjectionPattern
    """


components = Components()

repositories = Repositories()

services = Services()

restapi = RestApi()

commands = Commands()


# pylint: enable=too-few-public-methods
# pylint: enable=missing-docstring
# pylint: enable=invalid-name
# pylint: enable=multiple-statements
# pylint: enable=attribute-defined-outside-init


# pylint: disable=too-many-statements
def legacy_configure_ioc(broker):
    """
    Register IoC Components with a string feature key

    When introducing a new IoC singleton, it may no longer be necessary to add it into this function.
    Search "SplunkHome" (case sensitive) for an example for how to declare such a singleton.

    Older IoC singletons are still registered here with string keys so that existing test code using those
    string keys will continue to work unmodified.
    """
    # pylint: disable=redefined-outer-name
    import agent
    import agent.restapi
    import agent.splunk_host
    import agent.dmc_enabler
    import agent.services
    import agent.repositories
    import agent.commands
    import agent.workflows
    import agent.user_context

    # pylint: enable=redefined-outer-name

    broker.Provide("configuration",
                   agent.Configuration,
                   singleton=True)
    broker.Provide("TransactionManager",
                   agent.TransactionManager,
                   singleton=True)
    broker.Provide("EventAggregator",
                   agent.EventAggregator,
                   singleton=True)
    broker.Provide("restapi/AuthPlugin",
                   agent.restapi.AuthPlugin,
                   singleton=True)
    broker.Provide("restapi/JSONRequestPlugin",
                   agent.restapi.JSONRequestPlugin,
                   singleton=True)
    broker.Provide("restapi/JSONResponsePlugin",
                   agent.restapi.JSONResponsePlugin,
                   singleton=True)
    broker.Provide("restapi/LoggingPlugin",
                   agent.restapi.LoggingPlugin,
                   singleton=True)
    broker.Provide("restapi/MetaPlugin",
                   agent.restapi.MetaPlugin,
                   singleton=True)
    broker.Provide("restapi/HTTPServer",
                   agent.restapi.Server,
                   singleton=True)
    broker.Provide("restapi/TasksEndpoint",
                   agent.restapi.TasksEndpoint,
                   singleton=True)
    broker.Provide("restapi/AppsEndpoint",
                   agent.restapi.AppsEndpoint,
                   singleton=True)
    broker.Provide("restapi/TopologiesEndpoint",
                   agent.restapi.TopologiesEndpoint,
                   singleton=True)
    broker.Provide("restapi/DeployEndpoint",
                   agent.restapi.DeployEndpoint,
                   singleton=True)
    broker.Provide("restapi/SplunkdEndpoint",
                   agent.restapi.SplunkdEndpoint,
                   singleton=True)
    broker.Provide("restapi/LoggerEndpoint",
                   agent.restapi.LoggerEndpoint,
                   singleton=True)
    broker.Provide("restapi/ChangelogEndpoint",
                   agent.restapi.ChangelogEndpoint,
                   singleton=True)
    broker.Provide("restapi/SecureStorageEndpoint",
                   agent.restapi.SecureStorageEndpoint,
                   singleton=True)
    broker.Provide("restapi/ForwarderSetupEndpoint",
                   agent.restapi.ForwarderSetupEndpoint,
                   singleton=True)
    broker.Provide("restapi/LicenserEndpoint",
                   agent.restapi.LicenserEndpoint,
                   singleton=True)
    broker.Provide("restapi/ConfigurationEntryEndpoints",
                   agent.restapi.ConfigurationEntryEndpoints,
                   singleton=True)
    broker.Provide("restapi/InfoEndpoint",
                   agent.restapi.InfoEndpoint,
                   singleton=True)
    broker.Provide("restapi/AuditEndpoint",
                   agent.restapi.AuditEndpoint,
                   singleton=True)
    broker.Provide("restapi/PackagesEndpoint",
                   agent.restapi.PackagesEndpoint,
                   singleton=True)
    broker.Provide("services/TasksService",
                   agent.services.TasksService,
                   singleton=True)
    broker.Provide("services/CommandsService",
                   agent.services.CommandsService,
                   singleton=True)
    broker.Provide("services/InstancesService",
                   agent.services.InstancesService,
                   singleton=True)
    broker.Provide("services/ProgressService",
                   agent.services.ProgressService,
                   singleton=True)
    broker.Provide("services/StanzasService",
                   agent.services.StanzasService,
                   singleton=True)
    broker.Provide("services/GroupsService",
                   agent.services.GroupsService,
                   singleton=True)
    broker.Provide("services/AppsService",
                   agent.services.AppsService,
                   singleton=True)
    broker.Provide("services/TopologiesService",
                   agent.services.TopologiesService,
                   singleton=True)
    broker.Provide("services/DeployService",
                   agent.services.DeployService,
                   singleton=True)
    broker.Provide("services/ChangelogService",
                   agent.services.ChangelogService,
                   singleton=True)
    broker.Provide("services/ForwarderSetupService",
                   agent.services.ForwarderSetupService,
                   singleton=True)
    broker.Provide("services/LicenserService",
                   agent.services.LicenserService,
                   singleton=True)
    broker.Provide("services/AuditService",
                   agent.services.AuditService,
                   singleton=True)
    broker.Provide("services/SecureStorage",
                   agent.services.SecureStorage,
                   singleton=True)
    broker.Provide("services/InputsConfigurationService",
                   agent.services.InputsConfigurationService,
                   singleton=True)
    broker.Provide("services/OutputsConfigurationService",
                   agent.services.OutputsConfigurationService,
                   singleton=True)
    broker.Provide("services/CancelPendingChangesService",
                   agent.services.CancelPendingChangesService,
                   singleton=True)
    broker.Provide("services/SlimService",
                   agent.services.SlimService,
                   singleton=True)
    broker.Provide("repositories/TasksRepository",
                   agent.repositories.KVStoreTasksRepository,
                   singleton=True)
    broker.Provide("repositories/CommandsRepository",
                   agent.repositories.KVStoreCommandsRepository,
                   singleton=True)
    broker.Provide("repositories/InstancesRepository",
                   agent.repositories.KVStoreInstancesRepository,
                   singleton=True)
    broker.Provide("repositories/ProgressRepository",
                   agent.repositories.KVStoreProgressRepository,
                   singleton=True)
    broker.Provide("repositories/GroupsRepository",
                   agent.repositories.KVStoreGroupsRepository,
                   singleton=True)
    broker.Provide("repositories/AppsRepository",
                   agent.repositories.KVStoreAppsRepository,
                   singleton=True)
    broker.Provide("repositories/StanzasRepository",
                   agent.repositories.FilesystemStanzasRepository,
                   singleton=True)
    broker.Provide("repositories/TopologiesRepository",
                   agent.repositories.KVStoreTopologiesRepository,
                   singleton=True)
    broker.Provide("repositories/PendingChangelogRepository",
                   agent.repositories.KVStorePendingChangelogRepository,
                   singleton=True)
    broker.Provide("repositories/DeployedChangelogRepository",
                   agent.repositories.KVStoreDeployedChangelogRepository,
                   singleton=True)
    broker.Provide("repositories/PreDeploymentBackupRepository",
                   agent.repositories.KVStorePreDeploymentBackupRepository,
                   singleton=True)
    broker.Provide("repositories/InstallationGraphRepository",
                   agent.repositories.KVStoreInstallationGraphRepository,
                   singleton=True)
    broker.Provide("TasksController",
                   agent.TasksController,
                   singleton=True)
    broker.Provide("CommandsController",
                   agent.CommandsController,
                   singleton=True)
    broker.Provide("ForwardersController",
                   agent.ForwardersController,
                   singleton=True)
    broker.Provide("StdinController",
                   agent.StdinController,
                   singleton=True)
    broker.Provide("SplunkHost",
                   agent.splunk_host.SplunkHost,
                   singleton=True)
    broker.Provide("DmcEnabler",
                   agent.dmc_enabler.DmcEnabler,
                   singleton=True)
    broker.Provide("commands/Executor",
                   agent.commands.Executor,
                   singleton=True)
    broker.Provide("commands/SSHService",
                   agent.commands.SSHService,
                   singleton=True)
    broker.Provide("UserContext",
                   agent.user_context.UserContext,
                   singleton=True)

    # workflows
    broker.Provide("workflowsfactory",
                   {
                       "instance_workflow": agent.workflows.InstanceWorkflow,
                       "deploy_workflow": agent.workflows.DeployWorkflow,
                       "topology_workflow": agent.workflows.TopologyWorkflow,
                       "dmc_enabler_workflow": agent.workflows.DMCEnablerWorkflow,
                       "instance_delete_workflow": agent.workflows.InstanceDeleteWorkflow,
                       "cancel_pending_changes": agent.workflows.CancelPendingChangesWorkflow,
                       "external_apps_discovery_workflow": agent.workflows.ExternalAppsDiscoveryWorkflow,
                       "appinspect_workflow": agent.workflows.AppInspectWorkflow,
                       "notification_workflow": agent.workflows.NotificationWorkflow
                   })

    # repositories
    broker.Provide(
        "repositoriesfactory",
        {
            "instances": "repositories/InstancesRepository",
            "commands": "repositories/CommandsRepository",
            "progress": "repositories/ProgressRepository",
            "tasks": "repositories/TasksRepository",
            "topologies": "repositories/TopologiesRepository",
            "groups": "repositories/GroupsRepository",
            "apps": "repositories/AppsRepository"
        }
    )

    # repository for LogEventType
    broker.Provide(
        "repositoryForLogEventFactory",
        {
            agent.repositories.KVStoreAppsRepository.LogEventType:
                "repositories/AppsRepository",
            agent.repositories.KVStoreGroupsRepository.LogEventType:
                "repositories/GroupsRepository",
            agent.repositories.KVStoreInstallationGraphRepository.LogEventType:
                "repositories/InstallationGraphRepository"
        }
    )

    # commands
    broker.Provide("commands:uname",
                   agent.commands.UnameCommand,
                   singleton=True)
    broker.Provide("commands:startsplunk",
                   agent.commands.StartSplunkCommand,
                   singleton=True)
    broker.Provide("commands:stopsplunk",
                   agent.commands.StopSplunkCommand,
                   singleton=True)
    broker.Provide("commands:restartsplunk",
                   agent.commands.RestartSplunkCommand,
                   singleton=True)
    broker.Provide("commands:getsplunkversion",
                   agent.commands.GetSplunkVersionCommand,
                   singleton=True)
    broker.Provide("commands:getsplunkmanagementport",
                   agent.commands.GetSplunkManagementPortCommand,
                   singleton=True)
    broker.Provide("commands:verifysplunkmanagementuri",
                   agent.commands.VerifySplunkManagementUriCommand,
                   singleton=True)
    broker.Provide("commands:enabledistributedmanagementcontrol",
                   agent.commands.EnableDistributedManagementCommand,
                   singleton=True)
    broker.Provide("commands:changeuserpassword",
                   agent.commands.ChangeUserPasswordCommand,
                   singleton=True)
    broker.Provide("commands:deploy",
                   agent.commands.DeployConfCommand,
                   singleton=True)
    broker.Provide("commands:reloaddsconf",
                   agent.commands.ReloadDSConfCommand,
                   singleton=True)
    broker.Provide("commands:reloadmasterappsconf",
                   agent.commands.ReloadMasterAppsConfCommand,
                   singleton=True)
    broker.Provide("commands:reloadshclusterconf",
                   agent.commands.ReloadShClusterConfCommand,
                   singleton=True)
    broker.Provide("commands:setupdeploymentconfclient",
                   agent.commands.SetupDeploymentConfClientCommand,
                   singleton=True)
    broker.Provide("commands:get_cluster_config",
                   agent.commands.GetClusterConfigCommand,
                   singleton=True)
    broker.Provide("commands:splunk_offline",
                   agent.commands.SplunkOfflineCommand,
                   singleton=True)
    broker.Provide("commands:verifyconnection",
                   agent.commands.VerifyConnectionCommand,
                   singleton=True)
    broker.Provide("commands:verifydeploymentclient",
                   agent.commands.VerifyDeploymentClientCommand,
                   singleton=True)
    broker.Provide("commands:setinstanceid",
                   agent.commands.SetInstanceIdCommand,
                   singleton=True)
    broker.Provide("commands:update_group",
                   agent.commands.UpdateGroupCommand,
                   singleton=True)
    broker.Provide("commands:get_all_distributed_groups",
                   agent.commands.GetAllDistributedGroupsCommand,
                   singleton=True)
    broker.Provide("commands:remove_client_from_deployment_server",
                   agent.commands.RemoveClientFromDeploymentServerCommand,
                   singleton=True)
    broker.Provide("commands:stage_sh_deployer",
                   agent.commands.StageSHDeployerCommand,
                   singleton=True)
    broker.Provide("commands:verify_peer_added",
                   agent.commands.VerifyPeersAdded,
                   singleton=True)
    broker.Provide("commands:update_conf_properties",
                   agent.commands.UpdateConfProperties,
                   singleton=True)
    broker.Provide("commands:run_saved_search",
                   agent.commands.RunSavedSearchCommands,
                   singleton=True)
    broker.Provide("commands:verifyinstanceid",
                   agent.commands.VerifyInstanceIdCommand,
                   singleton=True)
    broker.Provide("commands:discovertopology",
                   agent.commands.DiscoverTopologyCommand,
                   singleton=True)
    broker.Provide("commands:set_general_passkey",
                   agent.commands.SetGeneralPassKeyCommand,
                   singleton=True)
    broker.Provide("commands:update_dmc_configuration",
                   agent.commands.UpdateDMCConfigurationCommand,
                   singleton=True)
    broker.Provide("commands:update_dmc_app_configuration",
                   agent.commands.UpdateDMCAppConfigurationCommand,
                   singleton=True)
    broker.Provide("commands:initialize_dmc_server",
                   agent.commands.InitializeDMCServerCommand,
                   singleton=True)
    broker.Provide("commands:update_stanza",
                   agent.commands.UpdateStanzaCommand,
                   singleton=True)
    broker.Provide("commands:get_deployment_server_settings",
                   agent.commands.GetDeploymentServerSettingsCommand,
                   singleton=True)
    broker.Provide("commands:restore_repository_changes",
                   agent.commands.RestoreRepositoryChangesCommand,
                   singleton=True)
    broker.Provide("commands:restore_disk_changes",
                   agent.commands.RestoreDiskChangesCommand,
                   singleton=True)
    broker.Provide("commands:get_deployment_server_migration_objects",
                   agent.commands.GetDeploymentServerMigrationObjectsCommand,
                   singleton=True)
    broker.Provide("commands:set_deployment_server_passkey",
                   agent.commands.SetDeploymentServerPassKeyCommand,
                   singleton=True)
    broker.Provide("commands:set_deployment_server_require_authentication",
                   agent.commands.SetDeploymentServerRequireAuthenticationCommand,
                   singleton=True)
    broker.Provide("commands:discover_external_apps",
                   agent.commands.DiscoverExternalAppsCommand,
                   singleton=True)
    broker.Provide("commands:appinspect_validate",
                   agent.commands.AppInspectValidateCommand,
                   singleton=True)
    broker.Provide("commands:validate_app_compatibility",
                   agent.commands.ValidateAppCompatibilityCommand,
                   singleton=True)
    broker.Provide("commands:version_check",
                   agent.commands.VersionCheckCommand,
                   singleton=True)
    broker.Provide("commands:symlink_check",
                   agent.commands.SymlinkCheckCommand,
                   singleton=True)
    broker.Provide("commands:notify",
                   agent.commands.PostNotificationCommand,
                   singleton=True)
    broker.Provide("commands:notify_wait",
                   agent.commands.WaitForNotificationsCommand,
                   singleton=True)
