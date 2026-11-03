from dataclasses import dataclass
from typing import TypedDict, Dict, List, Union, Any


OllyDataValue = Union[str, int, float]


@dataclass
class ChartData:
    metadata: List[Dict[str, str]]
    data: List[Dict[str, List[OllyDataValue]]]


# --- Processed Data Output Types ---
ProcessedTimeSeriesData = ChartData


# --- Service Map Data ---
@dataclass
class ProcessedServiceMapData(TypedDict):
    """
    Represents the processed data structure for service maps.
    Nodes and edges are kept generic for now.
    """
    nodes: List[Dict[str, Any]]  # Generic list of dictionaries for nodes
    edges: List[Dict[str, Any]]  # Generic list of dictionaries for edges
    # Potentially other common attributes or specific service map attributes


O11yChartResponse = ChartData
# TODO: We replaced the Union below because
# we believe service map will also conform to
# the same ChartData macrostructure
# TBD when we start working with service map
#
# Union[ProcessedTimeSeriesData, ProcessedServiceMapData]
