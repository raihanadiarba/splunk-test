import json

from chart_data.service_map_utils import SERVICE_MAP_QUERY, get_service_map_vars
from chart_data.data_manager import DataManager

from util.exception import OperationException, ConfigurationException
from util import o11y_utils
from chart_data.time_utils import get_time_range
from chart_data.o11y_ds_types import O11yChartResponse
from chart_data.o11y_datasource_options import ServiceMapDataSourceOptions
from proxy.o11y_http_proxy import O11yHttpProxy
from chart_data.o11y_ds_types import ChartData
from util.o11y_environment import O11yContext

logger = o11y_utils.setup_logger('data_fetcher_service_map')


class ServiceMapDataManager(DataManager):
    """
    Converts a UDF o11y service map data source into a static data source
    """

    def _build_request_params(self, options: ServiceMapDataSourceOptions) -> dict:
        """
        Builds the parameters for the service map GraphQL query
        """
        earliest = options.earliest
        latest = options.latest
        environments = options.environments or []
        services = options.services or []
        workflows = options.workflows or []
        time_range = get_time_range(earliest=earliest, latest=latest)
        start_time = time_range['start_ms']
        end_time = time_range['end_ms']

        return {
            'query': SERVICE_MAP_QUERY,
            'variables': get_service_map_vars(
                {
                    "endTimestampMillis": end_time,
                    "lookbackMillis": end_time - start_time,
                },
                environments,
                services,
                workflows,
            ),
        }

    def fetch_data(self, o11y_context: O11yContext, options: ServiceMapDataSourceOptions) -> O11yChartResponse:
        """
        Send the service map GraphQL query.
        """
        try:
            request_params = self._build_request_params(options)
            logger.debug(f"Built service map request params: {request_params}")
        except Exception as e:
            raise OperationException("Error requesting O11y data") from e

        try:
            # Create new context with isNewDomain=true for publish dashboard
            query = o11y_context.request.get('query', [])
            query_dict = dict(query) if query else {}
            query_dict['isNewDomain'] = 'true'
            updated_domain_request = {**o11y_context.request, 'query': query_dict}
            updated_domain_context = O11yContext(updated_domain_request)

            response = O11yHttpProxy.make_request(updated_domain_context, {
                'request_body': json.dumps(request_params),
                'rest_path': '/v2/apm/graphql',
                'request_method': o11y_context.request.get('method'),
                'request_query': o11y_context.request.get('query')
            })

        except Exception as e:
            raise OperationException("Error retrieving service map data from O11y") from e

        if response and response.get('status') == 200:
            payload = response.get('payload', {})
            if payload.get('data') is None or payload['data'].get('graph') is None:
                return [], [[]]  # Equivalent to DataSet.empty()
            api_data = payload['data'].get('graph')
            # now that we have viz format data convert to dashboard publish/export format
            metadata = [{'name': 'service-graph'}]
            api_data_str = json.dumps(api_data)
            data = [{'service-graph': [api_data_str]}]

            return ChartData(metadata, data)

        # if status is not 200, raise an exception with the error message
        raise OperationException("Failed to fetch service map data")
