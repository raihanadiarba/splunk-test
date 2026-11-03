"""
Helpers for managing deployment client
"""
import json
import logging

from agent import ServerException
from agent.services.deploy_status_helpers import compute_application_status

_logger = logging.getLogger(__name__)


def check_bundles_ready(service):
    """
    Check to see if the bundles have been delivered on to the topology node for a built in group
    """
    response = service.get("/services/deployment/server/clients",
                           output_mode="json",
                           count=0)
    entries = json.load(response.body)["entry"]

    if not entries:
        return False

    if len(entries) < 1:
        raise ServerException(
                fmt="No deployment client found. At least 1 client expected.")

    # If there're more deployment clients, where forwarders are forwarding internal logs to IDXs
    if len(entries) > 1:
        # we are not querying for serverclasses="_search_head" directly in the 1st get request
        # because on new stacks, querying for it on new stacks will result in empty collection
        kwargs = dict(serverclasses="_search_heads")
        response = service.get("/services/deployment/server/clients",
                               output_mode="json",
                               count=0,
                               **kwargs)
        entries = json.load(response.body)["entry"]

        # If for any reason found more than 1 search_head as deployment client, throw an exception
        if len(entries) != 1:
            msg = "Found {} Search Head(s) as deployment client(s). One Search Head expected.".format(len(entries))
            raise ServerException(fmt=msg)

    for deployment_client in entries:
        content = deployment_client["content"]
        applications = content.get("applications", {})
        for name, value in applications.items():
            up_to_date, _, error = compute_application_status(
                value,
                server_checksum=None,
                ignore_server_checksum=True
            )
            if not up_to_date:
                if error:
                    raise ServerException(
                        name,
                        error,
                        fmt="Error deploying application %s: %s")

                _logger.debug("Application %s is not up to date yet.", name)
                return False

    return True
