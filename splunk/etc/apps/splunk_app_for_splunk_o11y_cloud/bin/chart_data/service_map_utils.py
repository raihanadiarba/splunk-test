SERVICE_MAP_SPAN_LIMIT_DEFAULT = 201  # Match APM troubleshooting span limit
SERVICE_MAP_GROUP_BYS_EDGE_NULL = {
    "scopedTagValues": [],
    "tagName": 'sf_service',
    "limit": SERVICE_MAP_SPAN_LIMIT_DEFAULT,
    "orderby": "requestDurationMicrosP90",
    "ordering": None,
    "allowedMatches": None,
    "allowedValues": None,
    "edges": None,
    "includeOther": True,
}
SERVICE_MAP_GROUP_BYS_EDGE_BOTH = {
    "scopedTagValues": [],
    "tagName": 'sf_service',
    "limit": SERVICE_MAP_SPAN_LIMIT_DEFAULT,
    "orderby": "requestDurationMicrosP90",
    "ordering": None,
    "allowedMatches": None,
    "allowedValues": None,
    "edges": 'both',
    "includeOther": True,
}
SERVICE_MAP_QUERY = (
    "query Graph( $timeRange: TimeRangeInput $filters: GraphFilterInput $groupbys: [GroupByTagInput!] ) { "
    "graph(timeRange: $timeRange, filters: $filters, groupbys: $groupbys) { "
    "nodes { ...GraphNodeHealthFragment } "
    "edges { ...GraphEdgeHealthFragment } "
    "} "
    "} "
    "fragment GraphNodeHealthFragment on NodeHealth { "
    "node { nodeID nodeTags { tagName value } } "
    "attributes { type inferred includedInServiceGroup } "
    "requestCount { value } "
    "errorCount { value } "
    "rootCauseErrorCount { value } "
    "requestDurationMicrosP90 { value } "
    "} "
    "fragment GraphEdgeHealthFragment on EdgeHealth { "
    "edgeID "
    "fromNode { nodeID nodeTags { tagName value } } "
    "toNode { nodeID nodeTags { tagName value } } "
    "health "
    "requestCount { value } "
    "errorCount { value } "
    "requestDurationMicrosP90 { value } "
    "}"
)


def get_service_map_vars(
    timeRange,
    environments,
    services,
    workflows,
):
    """
    Builds the service maps vars for GraphQL query.
    """
    tags = []

    # If an environment filter is set then add it
    if len(environments) > 0:
        tags.append({
            "tagName": "sf_environment",
            "values": environments,
        })
    # If an services filter is set then add it
    if len(services) > 0:
        tags.append({
            "tagName": "sf_service",
            "values": services,
        })

    # If an workflows filter is set then add it
    if len(workflows) > 0:
        tags.append({
            "tagName": "_sf_workflow",
            "values": workflows,
        })

    return {
        "filters": {
            "tags": tags,
        },
        "timeRange": timeRange,
        "groupbys": (
            [SERVICE_MAP_GROUP_BYS_EDGE_NULL, SERVICE_MAP_GROUP_BYS_EDGE_BOTH]
            if len(services)
            else [SERVICE_MAP_GROUP_BYS_EDGE_NULL]
        ), }
