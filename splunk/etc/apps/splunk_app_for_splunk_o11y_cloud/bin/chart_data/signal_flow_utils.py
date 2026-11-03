from typing import Any, Dict, List
from chart_data.signalflow import data, Filter, SignalFlowProgram
from chart_data.signal_flow_parser import parse
from chart_data.signal_flow_parser import parse_query as parser_parse_query

from util import o11y_utils

logger = o11y_utils.setup_logger('signal_flow_utils')


# This functionality is copied from o11y-dashboard-extension
# Link: https://cd.splunkdev.com/observability/splunk-integrations/o11y-dashboard-extension/
#       -/blob/main/src/util/SignalFlowUtils.ts?ref_type=heads
def build_query(options: Dict[str, Any]) -> str:
    """
    Build a SignalFlow query from options

    Args:
        options: Dictionary of query configuration options

    Returns:
        SignalFlow program as a string
    """

    if options.get('query'):
        if not options.get('dashboardFilters'):
            return options['query']
        else:
            program = parse(options['query'])
    else:
        data_obj = data({'label': 'A', 'metric': options['metric'], 'metric_type': options.get('metricType')})
        data_obj.filters(options.get('filters') or {})

        if options.get('analytics'):
            for analytic_function, values in options['analytics'].items():
                params = None
                if values:
                    values_str = ", ".join([f"'{value}'" for value in values])
                    params = [f"by=[{values_str}]"]
                data_obj.method(analytic_function, params)

        data_obj.publish()

        program = SignalFlowProgram(data_obj)

    if options.get('dashboardFilters'):
        global_filters = []
        for filter_item in options.get('dashboardFilters'):
            if filter_item.get('value') and filter_item['value'] != '*':
                if isinstance(filter_item['value'], list):
                    global_filters.append(Filter(filter_item['dimension'], *filter_item['value']))
                else:
                    global_filters.append(Filter(filter_item['dimension'], filter_item['value']))

        program.set_global_filters(global_filters)

    return str(program)


def parse_query(signal_flow: str) -> Dict[str, List[str]]:
    """
    Parse a SignalFlow program to extract metrics

    Args:
        signal_flow: A SignalFlow program string

    Returns:
        Dictionary with metrics list
    """
    return parser_parse_query(signal_flow)
