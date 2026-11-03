
from dataclasses import dataclass
from typing import Dict, Optional, List, TypedDict, Union


# --- MetricAnalytics ---
MetricAnalytics = Dict[str, List[str]]


class FilterValue(TypedDict, total=False):
    include: List[str]
    exclude: List[str]


# --- MetricFilter ---
MetricFilter = Dict[str, FilterValue]

# --- DimensionFilter ---


class DimensionFilterRequired(TypedDict):
    dimension: str
    value: Union[str, List[str]]


class DimensionFilter(DimensionFilterRequired, total=False):
    token: Optional[str]


def normalize_filters_to_new_format(filters: dict) -> MetricFilter:
    """Convert any filter format to new format"""
    if not filters:
        return {}

    normalized = {}
    for key, value in filters.items():
        if isinstance(value, dict) and ('include' in value or 'exclude' in value):
            normalized[key] = value
        else:
            # Old format - array of values, convert to include
            normalized[key] = {"include": value}

    return normalized


@dataclass
class O11yDatasourceOptions():
    o11yDSType: str

    @staticmethod
    def from_dict(data: dict) -> "O11yDatasourceOptions":
        o11yDSType = data.get('o11yDSType', None) if data else None
        if o11yDSType == 'metric':
            filters = data.get('filters', {})
            if filters:
                data = data.copy()
                # Normalize old format filters to new format
                data['filters'] = normalize_filters_to_new_format(filters)
            return MetricDataSourceOptions(**data)
        elif o11yDSType == 'serviceMap':
            return ServiceMapDataSourceOptions(**data)
        else:
            raise ValueError(f"Unsupported o11yDSType: {o11yDSType}")


@dataclass
class MetricDataSourceOptions(O11yDatasourceOptions):
    """New MetricDataSourceOptions with new filter format"""
    o11yDSType: str = None
    analytics: Optional[MetricAnalytics] = None
    dashboardFilters: Optional[List[DimensionFilter]] = None
    earliest: Optional[str] = None
    filters: Optional[MetricFilter] = None  # New format
    latest: Optional[str] = None
    limit: int = 0
    legendDimension: Optional[str] = None
    metric: Optional[str] = None
    metricType: Optional[str] = None
    o11yChartId: Optional[str] = None
    query: Optional[str] = None
    orgId: Optional[str] = None

    def __post_init__(self):
        if self.o11yDSType != 'metric':
            raise ValueError(f"Invalid o11yDSType: {self.o11yDSType}, expected 'metric'")
        if not self.metric and not self.query:
            raise ValueError("metric or query is required")
        if not self.earliest or not self.latest:
            raise ValueError("earliest and latest are required")

# --- ServiceMapDataSourceOptions ---


@dataclass
class ServiceMapDataSourceOptions(O11yDatasourceOptions):
    earliest: Optional[str] = None
    latest: Optional[str] = None
    environments: Optional[List[str]] = None
    services: Optional[List[str]] = None
    workflows: Optional[List[str]] = None
    orgId: Optional[str] = None
