from typing import Any, List, Optional, Dict, Union, Tuple
from chart_data.o11y_datasource_options import MetricFilter

ALL_VALUE = '*'


# This functionality is copied from o11y-dashboard-extension
# Link: https://cd.splunkdev.com/observability/splunk-integrations/o11y-dashboard-extension/
#       -/blob/main/src/signalflow/SignalFlow.ts?ref_type=heads
class Filter:
    """Represents a SignalFlow filter."""

    def __init__(self, dimension: str, *values: str) -> None:
        self.dimension: str = dimension
        self.values: List[str] = [v for v in values if v]

    def __str__(self) -> str:
        if not self.values:
            return self.dimension

        values_str = ", ".join([f"'{value}'" for value in self.values])
        return f"filter('{self.dimension}', {values_str})"


class Filters:
    """Represents a group of SignalFlow filter functions."""

    def __init__(self, options: Dict[str, Any]) -> None:
        self.label: Optional[str] = options.get('label')
        self.filters: List[Filter] = options.get('filters', [])
        self.has_global_filters: bool = False

    def set_has_global_filters(self) -> "Filters":
        """Set has_global_filters flag"""
        self.has_global_filters = True
        return self

    def __str__(self) -> str:
        prefix = f"{self.label} = " if self.label else ""
        filters_str = " and ".join([str(f) for f in self.filters])
        return f"{prefix}{filters_str}"


class SignalFlowMethod:
    """Represents a SignalFlow method with parameters."""

    def __init__(self, name: str, *params: str) -> None:
        self.name: str = str(name).lower() if name else ''
        self.params: Tuple[str, ...] = params

    def __str__(self) -> str:
        if not self.params:
            return f"{self.name}()"

        params_str = ", ".join([p if '=' in p else f"'{p}'" for p in self.params])
        return f"{self.name}({params_str})"


class Data:
    """Represents a SignalFlow data function."""

    def __init__(self, options: Dict[str, Any]) -> None:
        self.label: Optional[str] = options.get('label')
        self.metric: str = options.get('metric')
        self.metric_type: str = options.get('metric_type')
        self.local_filters: Optional[List[Filter]] = None
        self.methods: List[SignalFlowMethod] = []
        self.has_global_filters: bool = False
        self.exclude_keys: Optional[set] = None

    def filters(self, filters: Union[List[Filter], MetricFilter]) -> "Data":
        """Apply filters to the data"""
        if isinstance(filters, list):
            self.local_filters = filters
        else:
            exclude_keys = set()
            self.local_filters = []

            for key, filter_obj in filters.items():
                if filter_obj.get('exclude'):
                    exclude_keys.add(key)
                    self.local_filters.append(Filter(key, *filter_obj['exclude']))
                elif filter_obj.get('include'):
                    self.local_filters.append(Filter(key, *filter_obj['include']))

            self.exclude_keys = exclude_keys if exclude_keys else None
        return self

    def method(self, method_name: Union[str, SignalFlowMethod], params: Optional[List[str]] = None) -> "Data":
        if isinstance(method_name, SignalFlowMethod):
            self.methods.append(method_name)
        elif params:
            self.methods.append(SignalFlowMethod(method_name, *params))
        else:
            self.methods.append(SignalFlowMethod(method_name))
        return self

    def publish(self, *params: str) -> "Data":
        """Mark the data for publishing"""
        method_params = [f"label='{self.label}'", *params] if self.label else params
        self.methods.append(SignalFlowMethod('publish', *method_params))
        return self

    def set_has_global_filters(self) -> "Data":
        """Set has_global_filters flag"""
        self.has_global_filters = True
        return self

    def _query_function(self) -> str:
        return 'histogram' if (self.metric_type and self.metric_type.upper() == 'HISTOGRAM') else 'data'

    def __str__(self) -> str:
        all_filters = []
        if self.local_filters:
            all_filters.extend(self.local_filters)
        if self.has_global_filters:
            all_filters.append(Filter('globalFilters'))

        filter_str = ""
        if all_filters:
            filter_parts = [
                f"not {f}" if self.exclude_keys and f.dimension in self.exclude_keys else str(f)
                for f in all_filters
            ]
            filter_str = f", filter={' and '.join(filter_parts)}"

        methods_str = "".join(f".{m}" for m in self.methods)
        prefix = f"{self.label} = " if self.label else ""
        return f"{prefix}{self._query_function()}('{self.metric}'{filter_str}){methods_str}"


class GenericFunction:
    """
    Generic representation of a SignalFlow function.

    This is used when parsing a SignalFlow function that we do not use in this library.
    """

    def __init__(self, contents: str) -> None:
        self.contents: str = contents
        self.label: Optional[str] = None
        self.has_global_filters: bool = False

    def set_has_global_filters(self) -> "GenericFunction":
        """Set has_global_filters flag"""
        self.has_global_filters = True
        return self

    def __str__(self) -> str:
        return self.contents


class SignalFlowProgram:
    """Represents a SignalFlow program"""

    def __init__(self, functions: Optional[Union[Data, GenericFunction,
                                                 List[Union[Data, GenericFunction]]]] = None) -> None:
        if functions and not isinstance(functions, list):
            self.functions: List[Union[Data, GenericFunction]] = [functions]
        else:
            self.functions: List[Union[Data, GenericFunction]] = functions or []
        self.global_filters: Optional[List[Filter]] = None

    def add_functions(self, functions: Union[Data, GenericFunction,
                                             List[Union[Data, GenericFunction]]]) -> "SignalFlowProgram":
        """Add functions to the program"""
        if functions:
            if not isinstance(functions, list):
                self.functions.append(functions)
            else:
                self.functions.extend(functions)
        return self

    def set_global_filters(self, filters: List[Filter]) -> "SignalFlowProgram":
        """Set global filters for the program"""
        valid_filters = [f for f in filters if f.values and ALL_VALUE not in f.values]
        if valid_filters:
            self.global_filters = valid_filters
        return self

    def get_metrics(self) -> List[str]:
        """Get all metrics from the program"""
        metrics = set()
        for func in self.functions:
            if isinstance(func, Data):
                metrics.add(func.metric)
        return list(metrics)

    def __str__(self) -> str:
        lines: List[str] = []

        # Add global filters if present
        if self.global_filters:
            filters_str = " and ".join([str(f) for f in self.global_filters])
            lines.append(f"globalFilters = {filters_str}")

        for func in self.functions:
            if self.global_filters:
                func.set_has_global_filters()
            lines.append(str(func))

        return "\n".join(lines)


def filters_to_string(filters: List[Filter]) -> str:
    """Convert a list of filters to a string"""
    return " and ".join([str(f) for f in filters])


def data(options: Dict[str, Any]) -> Data:
    """Create a Data instance with the given options."""
    return Data(options)
