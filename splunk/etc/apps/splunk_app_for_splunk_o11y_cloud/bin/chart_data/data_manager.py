from abc import ABC, abstractmethod

from chart_data.o11y_datasource_options import MetricDataSourceOptions
from chart_data.o11y_ds_types import O11yChartResponse
from util.o11y_environment import O11yContext


class DataManager(ABC):
    """Abstract base class for data fetchers."""

    @abstractmethod
    def fetch_data(self, o11y_context: O11yContext, options: MetricDataSourceOptions) -> O11yChartResponse:
        pass
