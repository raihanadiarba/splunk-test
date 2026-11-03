"""
Deploy status helpers
"""

# pylint: disable=too-few-public-methods, useless-object-inheritance, comparison-with-callable

import six
from agent.common.helpers import Enum
from agent.models.bundle import compute_bundle_name
from agent.services.stanzas_service import get_bundle_type_and_id

BUNDLE_FIELD_CHECKSUM = "checksum"
_RESULT_OK = "Ok"
BUNDLE_FIELD_UP_TO_DATE = "upToDate"


@six.add_metaclass(Enum)
class DeploymentMetricAction(object):
    """
    Actions reported by DS that we always record
    They are from deployment metrics sent by clients (DeploymentMetric in Splunk C++)
    Not including the other two actions report by DS, i.e. Unknown, Phonehome.
    Deployment metric action, Uninstall, is not reported by DS at deployment/server/clients (in "applications" field).
    Refer to getApplicationsForClient in Splunk C++
    DS action strings are defined with AppEvent::_actionStrings in Splunk C++
    """

    @staticmethod
    def _compute(name):
        """
        Capitalize the first char in 'name' and return it
        """
        return name[0:1].upper() + name[1:]

    download = _compute

    install = _compute


@six.add_metaclass(Enum)
class BundleAction(object):
    """
    Bundle actions that will be saved to "instances" collection and returned from API
    """

    @staticmethod
    def _compute(name):
        """
        Return name unchanged
        """
        return name

    download = _compute
    install = _compute
    none = _compute


class DeploymentMetricActionMap(DeploymentMetricAction):
    """
    Map DS_BUNDLE_ACTION
    """

    @staticmethod
    def _compute(name):
        """
        Return name unchanged
        """
        return name

    download = BundleAction.download
    install = BundleAction.install


def compute_bundle_status(application_name, client_application, server_checksum):
    """
    Compute deploy status of a bundle at a client. The return value includes the following fields:
    1. action: BundleAction enum
    2. onLatest: Whether or not the client has started on getting the latest version of the bundle.
    3. upToDate: Whether or not the client has successfully installed the latest version of the bundle.
    4. bundleType: BundleType enum
    5. bundleId': ID of the entity associated with the bundle
    6. error: Fail reason string if any. None indicates success and no error.

    client_application example:
    {
        'action': 'Install',
        'result': 'Ok',
        'checksum': '11729801373992025810',
        'failedReason': "''"
    }
    server_application example:
    {
        'checksum': '11729801373992025810'
    }
    Return value example:
    {'__forwarders': {
        'action': 'install',
        'onLatest': True,
        'bundleType': 'builtin',
        'bundleId': 'forwarders',
        'upToDate': True,
        'error': None
        }
    }
    """
    value = {}

    if client_application:
        up_to_date, on_latest, error = compute_application_status(
            client_application,
            server_checksum)
    else:
        up_to_date, on_latest, error = False, False, None

    value["onLatest"] = on_latest
    value[BUNDLE_FIELD_UP_TO_DATE] = up_to_date

    if error and error[0] == "'" and error[-1] == "'":
        # DS wraps failed reason string with single quotes. Remove them.
        error = error[1:-1]
    value["error"] = error

    action = BundleAction.none
    if client_application:
        client_action = client_application["action"]
        if client_action in DeploymentMetricAction:
            action = DeploymentMetricActionMap[client_action]
    value["action"] = action

    bundle_type, bundle_id = get_bundle_type_and_id(application_name)
    value["bundleId"] = bundle_id
    value["bundleType"] = bundle_type

    name = compute_bundle_name(bundle_type, bundle_id)
    return {name: value}


def compute_application_status(client_application, server_checksum, ignore_server_checksum=False):
    """
    Compute application deploy status
    This function is performance critical since it is called once per instance and application pair
    """
    action = client_application["action"]

    client_checksum = client_application[BUNDLE_FIELD_CHECKSUM]

    # checksum is zero (string "0" from DS response in XML mode) for pre-Ember clients
    if client_checksum and int(client_checksum):
        on_latest = client_checksum == server_checksum or ignore_server_checksum
    elif action not in DeploymentMetricAction:
        # If there has been no download or install, set on_latest to false
        on_latest = False
    else:
        # No client check sum and it is a download or install
        # This is a pre-Ember client, set on_latest to unknown
        on_latest = None

    # error being None means success and no error.
    if client_application["result"] == _RESULT_OK:
        error = None
    else:
        error = client_application["failedReason"]

    if error or action != DeploymentMetricAction.install:
        up_to_date = False
    else:
        up_to_date = on_latest

    return up_to_date, on_latest, error
