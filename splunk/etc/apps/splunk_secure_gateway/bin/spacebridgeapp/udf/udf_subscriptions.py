"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.
Module which contains helper functions for UDF subscriptions
"""
from typing import Optional

from spacebridgeapp.data.subscription_data import SubscriptionSearch
from spacebridgeapp.udf.udf_data import UdfDataSource, UdfDashboardDescription
from spacebridgeapp.data.dashboard_data import Search
from spacebridgeapp.dashboard.util import string_to_refresh_type
from spacebridgeapp.subscriptions.subscription_search_requests import fetch_search
from spacebridgeapp.search.input_token_support import inject_tokens_into_string

OPTIONS = 'options'
QUERY_PARAMETERS = 'queryParameters'
REF = 'ref'
APP = 'app'
EXTEND = 'extend'
QUERY = 'query'
REFRESH = 'refresh'
REFRESH_TYPE = 'refreshType'
EARLIEST = 'earliest'
LATEST = 'latest'
TYPE = 'type'
GLOBAL = 'global'
DATA_SOURCES = 'dataSources'
INPUTS = 'inputs'
TOKEN = 'token'
DEFAULT_VALUE = 'defaultValue'
DS_TEST = 'ds.test'
INPUT_TIME_RANGE = 'input.timerange'


def _process_data_source_chain(ds_jsn: dict,
                               udf_dashboard_definition: UdfDashboardDescription,
                               options_map: dict):
    """
    This function processes the data source chain.
    It recursively checks if there is a refresh interval in parent data sources in inherit them
    :param ds_jsn: data source json definition
    :param udf_dashboard_definition:  dashboard definition
    :param options_map: options for the current data srouce
    :return:
    """
    if not ds_jsn:
        return

    # if current data source has refresh - no need to check parent
    current_refresh = options_map.get(REFRESH)
    current_refresh_type = options_map.get(REFRESH_TYPE)
    if current_refresh and current_refresh_type:
        return

    # Parent data source
    extend_ds = options_map.get(EXTEND)
    if not extend_ds:
        return

    # Check if there are parents dashboards with some refresh interval that we have to inherit
    parent_ds = udf_dashboard_definition.get_data_source_by_id(extend_ds)
    if not parent_ds:
        return

    parent_ds_json: dict = parent_ds.json
    parent_options: dict = parent_ds_json.get(OPTIONS, {})

    # recursion for processing parent if it has it's own parent
    _process_data_source_chain(parent_ds_json, udf_dashboard_definition, parent_options)

    # Overwrite current options with refresh interval from parent
    parent_refresh = parent_options.get(REFRESH)
    parent_refresh_type = parent_options.get(REFRESH_TYPE)
    if parent_refresh and parent_refresh_type:
        options_map[REFRESH] = parent_refresh
        options_map[REFRESH_TYPE] = parent_refresh_type


def create_search_from_data_source(udf_data_source: UdfDataSource,
                                   udf_dashboard_definition: UdfDashboardDescription) -> Optional[Search]:
    """
    Take a data source object, extract out parameters such as search query, earliest, latest, etc. and creates
    a search object

    :param udf_data_source: The datasource object
    :param udf_dashboard_definition: Dashboard definition
    :return: Search object
    """
    # Short circuit here, don't create Search if udf_data_source is None
    if not udf_data_source:
        return None

    ds_jsn = udf_data_source.json
    datasource_type = ds_jsn.get(TYPE, "")

    if datasource_type != DS_TEST:
        # Get default options by data source type from dashboard definition
        defaults_map = defaults_map_for_data_source_type(udf_dashboard_definition.defaults_json, datasource_type)

        # Merge them with options from current data source
        options_map = _add_override_options(ds_jsn, defaults_map)

        # Walk through data source dependencies (chain) to overwrite refresh interval
        _process_data_source_chain(ds_jsn, udf_dashboard_definition, options_map)
        return Search(
            id=udf_data_source.data_source_id,
            ref=options_map.get(REF, ""),
            app=options_map.get(APP, ""),
            base=options_map.get(EXTEND, ""),
            earliest=options_map.get(EARLIEST, ""),
            latest=options_map.get(LATEST, ""),
            refresh=options_map.get(REFRESH, ""),
            refresh_type=string_to_refresh_type(options_map.get(REFRESH_TYPE, "")),
            query=options_map.get(QUERY, "")
        )
    # We don't create a Search object for ds.test
    return None


def defaults_map_for_data_source_type(defaults_json, datasource_type):
    """
    This function will create a map of defaults given a defaultsJson and datasource_type
    :param defaults_json:
    :param datasource_type:
    :return:
    """
    defaults_map = {}
    if defaults_json and datasource_type:
        data_sources = defaults_json.get(DATA_SOURCES, {})

        for default_type in [GLOBAL, datasource_type]:
            params = data_sources.get(default_type, {})
            _add_override_options(params, defaults_map)
    return defaults_map


def _add_override_options(jsn, options_map):
    """
    Helper method to add/override params from existing options_map
    :param jsn:
    :param options_map:
    :return:
    """
    if jsn:
        options = jsn.get(OPTIONS, {})
        for key, value in options.items():
            if isinstance(value, dict):
                for k, v in value.items():
                    options_map[k] = v
            else:
                options_map[key] = value
    return options_map


async def build_cumulative_post_search(log,
                                       auth_header,
                                       owner: str,
                                       subscription_search: SubscriptionSearch,
                                       input_tokens,
                                       async_kvstore_client):
    """
    Build cumulative post_search for chained UDF searches by recursively collecting all intermediate queries.
    For a chain like: root -> child1 -> child2, this returns "child1_query child2_query"
    """

    if not subscription_search.base:
        return None

    # Build the chain by walking up to collect all search definitions
    search_chain = []
    current_search = subscription_search

    # Walk up the chain to collect all search objects in the chain
    while current_search and current_search.base:
        search_chain.append(current_search)

        # Get parent search to continue walking up the chain
        if current_search.parent_search_key:
            try:
                current_search = await fetch_search(auth_header, owner, current_search.parent_search_key,
                                                    async_kvstore_client)
            except Exception as e:
                log.warning(f"Could not fetch parent search {current_search.parent_search_key}: {e}")
                break
        else:
            break

    # Reverse to get correct order (from root child to current search)
    search_chain.reverse()

    # Build cumulative queries by applying token injection to each query in order
    cumulative_queries = []
    for search in search_chain:
        query = inject_tokens_into_string(input_tokens, search.query)
        cumulative_queries.append(query)

    # Join all queries with spaces
    return " ".join(cumulative_queries) if cumulative_queries else None


def get_default_input_token_map(inputs_json):
    """
    Helper to get a map ot input_tokens to default values from a UDF inputs_json
    :param inputs_json: UDF inputs_json
    :return: map of input_token to default value
    """
    input_defaults_map = {}
    if inputs_json:
        for input_obj in inputs_json.values():
            options = input_obj.get(OPTIONS, {})
            token = options.get(TOKEN)
            default_value = str(options.get(DEFAULT_VALUE))
            if token is not None and default_value is not None:
                input_type = input_obj.get(TYPE)
                if input_type == INPUT_TIME_RANGE:
                    earliest, latest = map(str.strip, default_value.split(','))
                    input_defaults_map[f"{token}.{EARLIEST}"] = earliest
                    input_defaults_map[f"{token}.{LATEST}"] = latest
                else:
                    input_defaults_map[token] = default_value
    return input_defaults_map
