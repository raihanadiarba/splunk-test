from util.exception import OperationException, ConfigurationException
from chart_data.data_manager import DataManager
from chart_data.metric_util import get_formatted_data, apply_limit_constraint
from util import o11y_utils
from chart_data.signal_flow_utils import build_query
from proxy.o11y_metric_timeseries import O11yMetricTimeSeries
from chart_data.time_utils import get_time_range, get_resolution
from chart_data.o11y_ds_types import O11yChartResponse
from chart_data.o11y_datasource_options import MetricDataSourceOptions
from util.o11y_environment import O11yContext

logger = o11y_utils.setup_logger('metric_chart_data_manager')


class MetricChartDataManager(DataManager):

    def _build_request_params(self, options: MetricDataSourceOptions) -> dict:
        options_dict = vars(options)
        program = build_query(options_dict)
        time_range = get_time_range(
            earliest=options_dict.get('earliest'),
            latest=options_dict.get('latest'))
        start_time = time_range['start_ms']
        end_time = time_range['end_ms']
        resolution = get_resolution(end_time - start_time)
        output = {
            'signalflow_program': program,
            'start_time': start_time,
            'end_time': end_time,
            'resolution': resolution,
        }
        return output

    def fetch_data(self, o11y_context: O11yContext, options: MetricDataSourceOptions) -> O11yChartResponse:
        try:
            signalflow_request_params = self._build_request_params(options)
            logger.debug(f"Built signal flow request params: {signalflow_request_params}")
        except Exception as e:
            raise OperationException("Error requesting O11y data") from e

        signalflow_program = signalflow_request_params.get('signalflow_program')
        start_time = signalflow_request_params.get('start_time')
        end_time = signalflow_request_params.get('end_time')
        resolution = signalflow_request_params.get('resolution')

        with_derived_metadata = False

        try:
            response = O11yMetricTimeSeries.run_signal_flow_program(o11y_context,
                                                                    signalflow_program,
                                                                    start_time, end_time, resolution,
                                                                    with_derived_metadata, force_new_domain=True)
            logger.debug("Received response from O11y metric time series API")
        except Exception as e:
            raise OperationException("Error retrieving time-series data from O11y") from e

        try:
            chart_data = get_formatted_data(response, options)
            chart_data = apply_limit_constraint(chart_data, options.limit)
            logger.debug("Formatted chart data successfully")
        except Exception as e:
            raise OperationException("Error creating chart data from time-series data") from e

        return chart_data
