"""
Service for DMC audit
"""
import json

from agent import ApiErrorException
from agent import ioc
from agent.models.change import EventType
from agent.services.changelog_service import add_client_name
from agent.splunklib import results


def _make_search_term_for_contains(term):
    """
    Make a search term for a "contains" filter
    Example:
    (1)
        term: ab
        search term: "*ab*"
    (2)
        term: a"b
        search term: "*a\"b*"
    (3)
        term: a\"b
        search term: *a\\\"b*"

    Note:
        Any "*" in the original input is interpreted as a wildcard, rather than the literal '*'
    """
    term = term.replace('\\', '\\\\')
    term = term.replace('"', '\\"')
    return '"*%s*"' % term


class AuditService(ioc.Component):
    """Service to work with audit
    """

    def __init__(self):
        self._splunk_host = ioc.components.splunk_host()
        self._instance_repository = ioc.repositories.instances_repository()

    # pylint: disable=too-many-locals
    def get(
            self,
            count,
            offset,
            time_range,
            user_contains,
            entity_name_contains,
            event_types):
        """
        Return DMC audit events
        :return {tuple} (results, total):
        """

        user_filter = ''
        if user_contains:
            user_filter = 'user=%s ' % _make_search_term_for_contains(user_contains)

        search_prefix = 'search index=_audit action=dmc_operation %s| spath input=info | dedup name ' % user_filter

        search_postfix = '| fields user, info | fields - _* '

        search_filters = ''

        event_type_list = event_types.split(',') if event_types else []

        for event_type in event_type_list:
            # Only allow valid types to guard against SPL injection
            if event_type not in EventType:
                raise ApiErrorException("Audit_InvalidType", dict(type=event_type))

        if event_type_list:
            search_filters += '(%s) ' % ' OR '.join(['type=%s' % t for t in event_type_list])

        if entity_name_contains:
            # Tab, i.e. '\t' may have issues. 4 spaces (or %20) in URL parameter value works but %09 does not.
            search_filters += 'key.name=%s ' % _make_search_term_for_contains(
                entity_name_contains)

        search_filters_query = '| search %s' % search_filters if search_filters else ''

        job = self._splunk_host.get_service().jobs.create(
            search_prefix + search_filters_query + search_postfix,
            exec_mode="blocking",
            **time_range
        )

        search_results = job.results(count=count, offset=offset)

        value_list = []
        for result in results.ResultsReader(search_results):
            value = {"user": result["user"]}
            value.update(json.loads(result["info"]))
            value_list.append(value)

        add_client_name(self._instance_repository, value_list)

        return value_list, int(job["resultCount"])
    # pylint: enable=too-many-locals
