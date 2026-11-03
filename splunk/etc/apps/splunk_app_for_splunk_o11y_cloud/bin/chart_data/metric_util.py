import json
import re

from collections import defaultdict
from datetime import datetime, timezone
from typing import Dict, List, Union

from chart_data.o11y_ds_types import ChartData
from chart_data.o11y_datasource_options import MetricDataSourceOptions

NAME_KEY = 'name'
VALUE_KEY = '_value'
TIME_KEY = '_time'
SF_STREAM_LABEL = 'sf_streamLabel'

OllyDataValue = Union[str, int, float]
OllyMetricData = Dict[str, OllyDataValue]
OllyMetricDataResponse = List[OllyMetricData]

# One series' dimension map (an element of the `keys` array in TS getSeriesLabels).
_SeriesScalar = str | int | float | bool
SeriesKeyValue = _SeriesScalar | list[_SeriesScalar] | None
SeriesKey = dict[str, SeriesKeyValue]
# Values after normalizing lists to tuples for set membership in _get_properties_with_differing_values.
_DifferingValue = _SeriesScalar | None | tuple[_SeriesScalar, ...]


def get_formatted_data(o11y_data: OllyMetricDataResponse, options: MetricDataSourceOptions) -> ChartData:
    """
    Organize metric data into datasets grouped by unique dimension values.

    This was adapted from code in O11yAPI.ts found in the o11y-dashboard-extension library
    https://cd.splunkdev.com/observability/splunk-integrations/o11y-dashboard-
    extension/-/blob/main/src/api/O11yApi.ts?ref_type=heads#L166
    AI was used to help convert parts of this functionality to Python.
    """
    if not o11y_data:
        return ChartData([], [])

    # Group data by unique dimension values

    # default dict will create empty list
    # when a value is assigned to a missing key
    data_map = defaultdict(list)
    # Store for original dict objects
    attributes_map = {}
    # Track original order of unique attribute combinations
    original_order = []
    # set to store all unique timestamps
    unique_timestamp_set = set()

    for data_element in o11y_data:

        attributes = {k: v for k, v in data_element.items() if
                      v is not None and v != "" and k not in [TIME_KEY, VALUE_KEY]}

        # Using JSON for consistent, safe string representation (no need for eval)
        data_key = json.dumps(attributes, sort_keys=True)

        # Track original order on first occurrence
        if data_key not in data_map:
            original_order.append(data_key)

        data_map[data_key].append(data_element)
        # Store original dict in map
        attributes_map[data_key] = attributes
        unique_timestamp_set.add(data_element[TIME_KEY])

    # **DETERMINISTIC ORDERING**: Sort keys alphabetically for consistency
    deterministic_order = sorted(data_map.keys())

    # Sort all unique timestamps
    sorted_timestamps = sorted(unique_timestamp_set)

    # Create a mapping from timestamp to index
    # This allows mapping back to the original timestamp numeric values
    timestamp_to_index = {ts: i for i, ts in enumerate(sorted_timestamps)}

    # Build series data aligned to timestamps - maintain original order
    data_series_map: Dict[str, List[OllyDataValue]] = {}

    for key in deterministic_order:  # Use deterministic order
        values = data_map[key]
        # Initialize series with None values for all timestamps
        series_data = [None] * len(sorted_timestamps)

        # Fill in actual values at correct timestamp positions
        for data_element in values:
            timestamp = data_element[TIME_KEY]
            index = timestamp_to_index[timestamp]
            series_data[index] = data_element[VALUE_KEY]

        data_series_map[key] = series_data

    # Create labels for each series - use stored dicts directly!
    data_series_keys = [attributes_map[key] for key in deterministic_order]
    series_labels = _get_series_labels(data_series_keys, options)
    series_data = [data_series_map[key] for key in deterministic_order]

    # Build final data structure
    data = [
        {TIME_KEY: [datetime.fromtimestamp(int(timestamp), tz=timezone.utc).isoformat()],
         **{label: [values[i]] for label, values in zip(series_labels, series_data)}}
        for i, timestamp in enumerate(sorted_timestamps)
    ]

    metadata = ([{NAME_KEY: TIME_KEY}] if sorted_timestamps else []) + [{NAME_KEY: label} for label in series_labels]

    return ChartData(metadata, data)


def apply_limit_constraint(chart_data: ChartData, limit: int) -> ChartData:
    """
    Apply limit constraint to chart data by truncating series data.

    Args:
        chart_data: The original chart data
        limit: Maximum number of series to include (excluding _time)

    Returns:
        ChartData with limited series
    """
    if not chart_data or not chart_data.metadata or limit <= 0:
        return chart_data

    # Calculate offset_max (include _time + limit number of series)
    offset_max = limit + 1

    # Slice metadata (fields)
    constrained_metadata = chart_data.metadata[:offset_max] if chart_data.metadata else []

    # Filter data rows to only include the constrained fields
    constrained_data = []
    if chart_data.data and constrained_metadata:
        # Get the field names from constrained metadata
        allowed_fields = {field['name'] for field in constrained_metadata}

        # Filter each data row to only include allowed fields
        for row in chart_data.data:
            constrained_row = {k: v for k, v in row.items() if k in allowed_fields}
            constrained_data.append(constrained_row)
    else:
        constrained_data = chart_data.data or []

    return ChartData(constrained_metadata, constrained_data)


_CHART_BUILDER_SINGLE_LETTER = re.compile(r"^[A-Z]$")


def _get_series_labels(
    data_series_keys: list[SeriesKey] | None,
    options: MetricDataSourceOptions,
) -> list[str]:
    """
    Build human-readable series labels for chart columns.
    Mirrors src/api/O11yApi.ts `getSeriesLabels`.
    """
    analytic_key = _last_analytic_field_key(options)
    label_fallback = "data"
    keys = data_series_keys if data_series_keys is not None else []

    def get_raw_label(series_key: SeriesKey) -> str:
        prefix = ""
        sl = series_key.get(SF_STREAM_LABEL)
        if sl is not None and not (
            isinstance(sl, str) and _CHART_BUILDER_SINGLE_LETTER.fullmatch(sl)
        ):
            same_label_count = sum(
                1 for k in keys if k.get(SF_STREAM_LABEL) == sl
            )
            if same_label_count > 1:
                prefix = f"{sl} - "
            else:
                return str(sl)
        if analytic_key:
            v = series_key.get(analytic_key)
            return str(v) if v is not None else label_fallback
        legend_dim = options.legendDimension
        if legend_dim:
            legend_val = series_key.get(legend_dim)
            legend_label: str | None
            if isinstance(legend_val, list) and len(legend_val) > 0:
                legend_label = ", ".join(str(x) for x in legend_val)
            elif legend_val is not None and str(legend_val) != "":
                legend_label = str(legend_val)
            else:
                legend_label = None
            if legend_label is not None:
                return f"{prefix}{legend_label}" if prefix else legend_label
        differing_props = _get_properties_with_differing_values(keys)
        if differing_props:
            label_parts = [
                f"{prop}:{series_key[prop]}"
                for prop in differing_props
                if prop in series_key
            ]
            return f"{prefix}{' | '.join(label_parts)}"
        mn = series_key.get("metric_name")
        if mn is not None and str(mn) != "":
            return str(mn)
        return label_fallback
    occurrence_by_label: dict[str, int] = {}

    out: list[str] = []
    for series_key in keys:
        raw = get_raw_label(series_key) or label_fallback
        n = occurrence_by_label[raw] = occurrence_by_label.get(raw, 0) + 1
        label = raw if n == 1 else f"{raw}-{n}"
        out.append(label)
    return out


def _get_properties_with_differing_values(objects: List[SeriesKey]) -> List[str]:
    """
    Property names whose values differ across the given objects, or that are missing
    from some objects (missing is treated as None), matching prior Python behavior.
    """
    all_keys: set[str] = set()
    for obj in objects:
        all_keys.update(obj.keys())

    property_values_map: defaultdict[str, set[_DifferingValue]] = defaultdict(set)
    for obj in objects:
        for key in all_keys:
            value = obj.get(key, None)
            if isinstance(value, list):
                value = tuple(value)
            property_values_map[key].add(value)
    return sorted([k for k, values in property_values_map.items() if len(values) > 1])


def _last_analytic_field_key(options: MetricDataSourceOptions) -> str | None:
    analytics = options.analytics
    if not analytics:
        return None
    flat: list[str] = [x for vals in analytics.values() for x in vals]
    return flat[-1] if flat else None
