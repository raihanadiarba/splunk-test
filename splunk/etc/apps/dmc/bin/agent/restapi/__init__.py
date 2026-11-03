"""
REST API Module
"""

from agent.restapi.auth_plugin import AuthPlugin
from agent.restapi.json_request_plugin import JSONRequestPlugin
from agent.restapi.json_response_plugin import JSONResponsePlugin
from agent.restapi.logging_plugin import LoggingPlugin
from agent.restapi.meta_plugin import MetaPlugin
from agent.restapi.httpserver import Server
from agent.restapi.apps_endpoint import AppsEndpoint
from agent.restapi.topologies_endpoint import TopologiesEndpoint
from agent.restapi.deploy_endpoint import DeployEndpoint
from agent.restapi.tasks_endpoint import TasksEndpoint
from agent.restapi.splunkd_endpoint import SplunkdEndpoint
from agent.restapi.logger_endpoint import LoggerEndpoint
from agent.restapi.changelog_endpoint import ChangelogEndpoint
from agent.restapi.secure_storage_endpoint import SecureStorageEndpoint
from agent.restapi.forwarder_setup_endpoint import ForwarderSetupEndpoint
from agent.restapi.licenser_endpoint import LicenserEndpoint
from agent.restapi.configuration_entry_endpoints import ConfigurationEntryEndpoints
from agent.restapi.info_endpoint import InfoEndpoint
from agent.restapi.audit_endpoint import AuditEndpoint
from agent.restapi.packages_endpoint import PackagesEndpoint

assert AuthPlugin
assert JSONRequestPlugin
assert JSONResponsePlugin
assert LoggingPlugin
assert MetaPlugin
assert Server
assert AppsEndpoint
assert TopologiesEndpoint
assert DeployEndpoint
assert TasksEndpoint
assert SplunkdEndpoint
assert LoggerEndpoint
assert ChangelogEndpoint
assert SecureStorageEndpoint
assert ForwarderSetupEndpoint
assert LicenserEndpoint
assert ConfigurationEntryEndpoints
assert InfoEndpoint
assert AuditEndpoint
assert PackagesEndpoint
