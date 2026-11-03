"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Module use to setup params to pass to search jobs
"""
from typing import List

from spacebridgeapp.util.constants import SAVED_SEARCH_ARGS_PREFIX
from spacebridgeapp.util.string_utils import spl_escape
from spacebridgeapp.reports.report_helper import ParsedReportId
from spacebridgeapp.dashboard.dashboard_helpers import convert_id_to_query


def create_search_query(query):
    """
    Helper method to create search_query
    :param query:
    :return:
    """
    # remove leading and trailing whitespace from search
    search_query = query.strip()

    # short-circuit if query is empty
    if not search_query:
        return None

    # If the query doesn't already start with the 'search' operator or another
    # generating command (e.g. "| inputcsv"), then prepend "search " to it.
    if not (search_query.startswith('search') or search_query.startswith("|")):
        search_query = 'search ' + search_query

    return search_query


def create_post_search_query(query):
    """
    Helper method to create post search query
    :param query:
    :return:
    """
    # remove leading and trailing whitespace from search
    post_search_query = query.strip()

    # short-circuit if query is empty
    if not post_search_query:
        return ''

    if not post_search_query.startswith('|'):
        post_search_query = '| %s' % post_search_query

    return post_search_query


def get_search_job_request_params(query,
                                  earliest_time,
                                  latest_time,
                                  exec_mode,
                                  sample_ratio=1,
                                  max_time='60',
                                  status_buckets='0',
                                  sid=None):
    """
    Helper method to return request params for search job
    :param query:
    :param earliest_time:
    :param latest_time:
    :param sample_ratio:
    :param exec_mode:
    :param max_time:
    :param status_buckets:
    :param sid: Optional override for search job sid
    :return:
    """
    params = {}
    if query is not None:

        search_query = create_search_query(query)
        if not search_query:
            return None

        params = {'output_mode': 'json_cols',
                  'auto_cancel': '90',  # job cancels after this many seconds or inactivity
                  'max_time': max_time,  # number of seconds to run search before auto finalizing
                  'status_buckets': status_buckets,  # number of status buckets to generate
                  'time_format': '%FT%T.%Q%:z',  # IOS-8601 format
                  'exec_mode': exec_mode,  # normal runs search asynchronously
                  'count': '10000',  # max number of entries to return
                  'show_metadata': 'true',  # return fields as a list of jsons
                  'check_risky_command': 'true',
                  'preview': 'true',
                  'sample_ratio': str(int(sample_ratio)) if sample_ratio and int(sample_ratio) > 0 else '1',
                  'search': search_query}

        if sid is not None:
            params['id'] = sid

        if earliest_time is not None:
            params['earliest_time'] = earliest_time

        if latest_time is not None:
            params['latest_time'] = latest_time

    return params


def get_dispatch_job_request_params(earliest_time, latest_time, input_tokens=None):
    """
    Helper method to return request params for dispatch

    :param earliest_time:
    :param latest_time:
    :param input_tokens:
    :return:
    """
    params = {'output_mode': 'json',
              'dispatch.auto_cancel': '90',  # job cancels after this many seconds or inactivity
              'dispatch.buckets': '0',  # number of dispatch buckets to generate
              'dispatch.time_format': '%FT%T.%Q%:z',  # IOS-8601 format
              'dispatch.enablePreview': 'true'}

    # expecting args should be args.argname
    # https://docs.splunk.com/Documentation/Splunk/7.2.6/RESTREF/RESTsearch#saved.2Fsearches.2F.7Bname.7D.2Fdispatch
    if isinstance(input_tokens, dict):
        for token_name, value in input_tokens.items():
            if not token_name.startswith(SAVED_SEARCH_ARGS_PREFIX):
                token_name = SAVED_SEARCH_ARGS_PREFIX+token_name
            params[token_name] = value

    # earliest_time and latest_time works in a pair so if one is specified we need to take the other value
    if earliest_time or latest_time:
        params['dispatch.earliest_time'] = earliest_time
        params['dispatch.latest_time'] = latest_time

    return params


def create_dashboard_report_search_query(app_names: List[str],
                                         is_dashboard: bool,
                                         search_term: str=None,
                                         scheduled: bool = False,
                                         ids: List[str] = [],
                                         dashboard_tags: List[str] = [],
                                         tagging_config_map=None) -> str:
    """
    Helper method to construct search query for retrieving dashboards or reports with Splunk API

    """

    query = []

    if not tagging_config_map:
        tagging_config_map = {}

    # add search logic for apps and their dashboard tagging status to search_str
    if app_names:
        apps_and_tags_query = []
        for app_name in app_names:
            dashboard_tags_query = ''
            app_tag_enabled = False

            # if constructing query for dashboards, check if an app is enabled on the dashboards tab
            if is_dashboard:
                app_tag_enabled = app_name in tagging_config_map and tagging_config_map.get(app_name).get('enabled', False)

            if app_tag_enabled and dashboard_tags:
                tag_query = [f'tags="*{spl_escape(dashboard_tag)}*"' for dashboard_tag in dashboard_tags if dashboard_tag]
                if tag_query:
                    or_join = ' OR '.join(tag_query)
                    dashboard_tags_query = f' AND ({or_join})'

            apps_and_tags_query.append(f'(eai:acl.app="{spl_escape(app_name)}"{dashboard_tags_query})')
        or_join = ' OR '.join(apps_and_tags_query)
        query.append(f'({or_join})')

    if search_term:
        param_name = 'label' if is_dashboard else 'name'
        query.append(f'({param_name}="*{spl_escape(search_term)}*")')

    if not is_dashboard and scheduled:
        query.append('(is_scheduled=1)')

    if ids:
        id_to_query_func = convert_id_to_query if is_dashboard else ParsedReportId.convert_id_to_query
        id_query = [id_to_query_func(id) for id in ids]
        or_join = ' OR '.join(id_query)
        query.append(f'({or_join})')

    search_query = ''
    if len(query) > 0:
        combined = ' AND '.join(query)
        search_query = f' AND {combined}'

    return search_query


