"""
Splunk DMC audit endpoint
"""
# pylint: disable=no-member

import logging
import bottle

from agent import ioc
from agent.restapi import eai_helpers

_logger = logging.getLogger(__name__)


def _get_time_range_from_request():
    """
    Parse splunk search like time range
    Extracts the following URL query parameters into a time range dictionary
    with those query parameter names as keys and their values as values.
        earliest_time
        latest_time
    :return time range dictionary
    """
    time_range = {}
    earliest_time = bottle.request.query.get("earliest_time")
    if earliest_time is not None:
        time_range["earliest_time"] = earliest_time
    latest_time = bottle.request.query.get("latest_time")
    if latest_time is not None:
        time_range["latest_time"] = latest_time
    return time_range


class AuditEndpoint(ioc.Component):
    """Audit endpoint
    """

    def __init__(self):
        self.service = ioc.services.audit_service()
        bottle.get('/audit')(self.get)

    @eai_helpers.paginated
    @eai_helpers.response_formatted
    @eai_helpers.extract_name
    def get(
            self,
            count,
            offset,
            sort_key,
            reverse):
        """Return DMC audit events
        """
        if sort_key or reverse:
            raise bottle.HTTPError(400, "Not supported.")

        time_range = _get_time_range_from_request()

        user_contains = bottle.request.query.get("user_contains")
        entity_name_contains = bottle.request.query.get("entity_name_contains")
        event_types = bottle.request.query.get("types")

        return self.service.get(
            count,
            offset,
            time_range,
            user_contains,
            entity_name_contains,
            event_types
        )
