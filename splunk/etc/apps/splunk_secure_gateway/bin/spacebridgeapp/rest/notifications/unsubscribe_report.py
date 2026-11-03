"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

REST endpoint handler for managing notiification unsubscribes for scheduled report
"""
import os

from re import S
import sys
import json
from dataclasses import dataclass, fields
from splunk.persistconn.application import PersistentServerConnectionApplication
from splunk.clilib.bundle_paths import make_splunkhome_path

os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))
sys.path.insert(0, make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))

from spacebridgeapp.rest.base_endpoint import BaseRestHandler
from spacebridgeapp.rest.util.helper import enforce_required_parameters
from spacebridgeapp.reports.report_helper import ParsedReportId
from spacebridgeapp.rest.services.splunk_service import get_saved_search_with_acl, persist_saved_search
from spacebridgeapp.alerts.alert_action import MobileAlertAction, MobileAlertActionParams
from spacebridgeapp.rest.util.utils import SplunkRequest

sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'lib']))
sys.path.remove(make_splunkhome_path(['etc', 'apps', 'splunk_secure_gateway', 'bin']))


@dataclass(frozen=True)
class ReportUnsubscribeRequest:
    """Data class for managing notification subscription request for reports"""
    id: str

class ReportNotificationUnsubscribeHandler(BaseRestHandler, PersistentServerConnectionApplication):

    def __init__(self, command_line, command_arg):
        BaseRestHandler.__init__(self, logname="report_notification_unsubscribe")

    def post(self, request):
        """ allow a user to unsubscribe to receive notifications from scheduled report """
        self.log.info('Received report notification unsubscribe request')
        splunk_request = SplunkRequest.from_request(request)
        enforce_required_parameters([field.name for field in fields(ReportUnsubscribeRequest)], splunk_request.body)
        report_unsubscribe_request = ReportUnsubscribeRequest(splunk_request.body['id'])
        parsed_report_id = ParsedReportId(report_unsubscribe_request.id)
        self.log.debug(f"Successfully parsed report_unsubscribe_request={report_unsubscribe_request}")

        # Read using the caller's own username as the namespace owner so Splunk
        # applies its normal namespace precedence.  acl.owner/acl.app in the
        # response reveal the canonical identity of the resolved object, which
        # is then used as the write target.  This prevents a private same-named
        # decoy from redirecting writes onto an admin-owned search.
        acl, content = get_saved_search_with_acl(
            splunk_request.user_session_token,
            splunk_request.user,
            parsed_report_id.app_name,
            parsed_report_id.report_name)
        canonical_owner = acl['owner']
        canonical_app = acl['app']
        self.log.debug("Successfully fetched saved_search canonical_owner=%s canonical_app=%s",
                       canonical_owner, canonical_app)

        alert_action = MobileAlertAction.parse_saved_search_response(content)
        canonical_actions = list(alert_action.actions)
        alert_action.remove_user(splunk_request.user)

        # Build a minimal payload: only SSG-owned fields so other alert actions
        # on the target search are never overwritten.  Remove ssg_mobile_alert
        # from the actions CSV only when no recipients remain.
        payload = alert_action.to_mobile_alert_payload()
        new_actions_csv = MobileAlertAction.actions_csv_after_unsubscribe(
            canonical_actions, recipient_users_empty=not alert_action.recipient_users)
        original_actions_csv = ','.join(canonical_actions)
        if new_actions_csv != original_actions_csv:
            payload[MobileAlertActionParams.ACTIONS] = new_actions_csv

        status = persist_saved_search(
            splunk_request.system_session_token,
            canonical_owner,
            canonical_app,
            parsed_report_id.report_name,
            payload)

        self.log.info(f"Completed report notification unsubscribe request with status={status}")

        return {
            'status': status
        }
