"""
Splunk Deployment Server deploy endpoint
"""

import logging
import bottle
from bottle import request, HTTPError

from agent import ioc
from agent.restapi import eai_helpers, helpers
from agent.common.access_control import Capability
from agent.restapi import access_control_helpers
from agent.models import View

_logger = logging.getLogger(__name__)


class ChangelogEndpoint(ioc.Component):
    """Changelog endpoint
    """

    def __init__(self):
        bottle.get('/changes')(self.get)
        bottle.post("/changes")(self._cancel_pending_changes)
        self.changelog_service = ioc.services.changelog_service()
        self.cancel_pending_changes_service = ioc.services.cancel_pending_changes_service()

    @eai_helpers.filtered
    @eai_helpers.paginated
    @access_control_helpers.links("/deploy", ["deploy"], None, Capability.EDIT_DEPLOY_QUEUE)
    @eai_helpers.response_formatted
    @eai_helpers.extract_name
# pylint: disable=too-many-arguments, inconsistent-return-statements
    def get(
            self,
            req_query,
            count,
            offset,
            sort_key,
            reverse):
        """Handles request for group list
        """
# pylint: enable=too-many-arguments
        state = None
        if request.query is not None:
            state = request.query.get("state")  # pylint: disable=no-member

        if state not in ("pending", "deployed"):
            err_msg = "State '%s' is not valid." % state
            _logger.warning(err_msg)
            raise HTTPError(400, err_msg)

        if state == "pending":
            return self.changelog_service.read_all_pending_with_total(
                req_query,
                count,
                offset,
                sort_key,
                reverse)

        if state == "deployed":
            return self.changelog_service.read_all_deployed_with_total(
                req_query,
                count,
                offset,
                sort_key,
                reverse)

    @access_control_helpers.edit(Capability.EDIT_DEPLOY_QUEUE)
    @eai_helpers.response_formatted
    @helpers.json_validate_request(schema={
        "type": "object",
        "properties": {
            "mode": {"type": "string", "enum": ["all"]}
        },
        "required": ["mode"],
        "additionalProperties": False
    })
    def _cancel_pending_changes(self):
        """
        Handle cancel all pending changes.
        """
        data = request.json
        result = self.cancel_pending_changes_service.handle_cancel_pending_changes(data)
        return eai_helpers.eai_result([result.json(View.RestView)], 1)
