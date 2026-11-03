from chart_data.metric_chart_data_manager import MetricChartDataManager
from chart_data.service_map_data_manager import ServiceMapDataManager
from chart_data.o11y_datasource_options import MetricDataSourceOptions, O11yDatasourceOptions, \
    ServiceMapDataSourceOptions
from chart_data.data_manager import DataManager

optionsMap = {
    MetricDataSourceOptions: MetricChartDataManager,
    ServiceMapDataSourceOptions: ServiceMapDataManager
}


def get_data_manager(options: O11yDatasourceOptions) -> DataManager:
    fetcher = optionsMap.get(type(options), None)
    if (fetcher):
        return fetcher()
    raise ValueError(f"Unsupported options type: {options}")
