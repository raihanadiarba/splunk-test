"""
Splunk Deployment Server licenser endpoint
"""

import json
from functools import wraps

import bottle
from bottle import request

from agent import ioc
from agent.splunklib.binding import HTTPError
from agent.splunklib.client import Entity
from agent.restapi import JSONRequestPlugin


def response_decorator(func):
    """Decorator to handle splunkd licenser response
    """

    @wraps(func)
    def wrapper(service, **kwargs):
        """A wrapper for REST calls
        """
        try:
            return func(service, **kwargs)
        except HTTPError as ex:
            # cast splunklib.binding.HTTPError to bottle.HTTPError
            raise bottle.HTTPError(ex.status, ex.body)
        except NotImplementedError as ex:
            raise bottle.HTTPError(400, str(ex))

    return wrapper


# pylint: disable=unused-argument
class LicenserEndpoint(ioc.Component):
    """Licenser endpoint
    Handles:
        POST /licenser/licenses
        DELETE /licenser/licenses/{name}
        POST /licenser/pools
        DELETE /licenser/pools/{name}
        POST /licenser/groups/{name}
    """

    SERVER_SERVICES_PATH = "/services"

    def __init__(self):
        self._service = ioc.services.licenser_service()

        splunk_host = ioc.components.splunk_host()
        self._splunk_service = splunk_host.get_service(owner="nobody")

        # licenses add/delete
        bottle.post("/licenser/licenses", skip=[JSONRequestPlugin.name])(self.add_license)
        bottle.delete("/licenser/licenses/<name>")(self.delete_license)

        # license pools add/delete
        bottle.post("/licenser/pools", skip=[JSONRequestPlugin.name])(self.add_pool)
        bottle.delete("/licenser/pools/<name>")(self.delete_pool)

        # license group activate
        bottle.post("/licenser/groups/<name>", skip=[JSONRequestPlugin.name])(self.activate_group)

        # list/get
        bottle.get("/licenser/licenses")(self.list)
        bottle.get("/licenser/licenses/<name>")(self.get)
        bottle.get("/licenser/pools")(self.list)
        bottle.get("/licenser/pools/<name>")(self.get)
        bottle.get("/licenser/groups")(self.list)
        bottle.get("/licenser/groups/<name>")(self.get)

    @response_decorator
    def add_license(self):
        """Add a new license
        """
        reply, license_info = self._proxy_request_to_splunk(request)
        self._service.audit_add_license(license_info)
        return reply

    @response_decorator
    def delete_license(self, name):
        """Delete a license
        """
        reply, _ = self._proxy_request_to_splunk(request)
        self._service.audit_delete_license({"name": name})
        return reply

    @response_decorator
    def add_pool(self):
        """Add a new licenses pool
        """
        reply, pool_info = self._proxy_request_to_splunk(request)
        self._service.audit_add_pool(pool_info)
        return reply

    @response_decorator
    def delete_pool(self, name):
        """Delete a licenses pool
        """
        reply, _ = self._proxy_request_to_splunk(request)
        self._service.audit_delete_pool({"name": name})
        return reply

    @response_decorator
    def activate_group(self, name):
        """Activate a licenser group
        """
        reply, group_info = self._proxy_request_to_splunk(request)
        self._service.audit_activate_group(group_info)
        return reply

    @response_decorator
    def list(self):
        """List licenser items
        """
        reply, _ = self._proxy_request_to_splunk(request)
        return reply

    @response_decorator
    def get(self, name):
        """Get a licenser item
        """
        reply, _ = self._proxy_request_to_splunk(request)
        return reply

    def _proxy_request_to_splunk(self, req):
        """Proxy request to splunk and read the reply.
        :return tuple, the first value is the original unmodified reply from Splunk server and the second
                is "parsed" Splunk reply (a dictionary). Delete doesn't produce any information related to removed
                item thus the second value is None.
        """
        splunk_licenser_entity = Entity(self._splunk_service,
                                        self.SERVER_SERVICES_PATH + req.fullpath,
                                        skip_refresh=True)
        if req.method == "POST":  # pylint: disable=no-else-return
            output_mode = req.params.get("output_mode")
            if not output_mode:
                req.params["output_mode"] = "json"  # use json by default
            elif "json" not in output_mode:
                raise NotImplementedError("Only output_mode=json format is supported")
            result = splunk_licenser_entity.post(**req.params)  # query Splunk server
            # read reply non destructively (splunk_licenser_entity.read reads body and this operation clears the body)
            reply = result.body.peek(-1)
            # Read REST call result. All licenser post requests return a single entry with the new/updated item.
            info = json.loads(reply)["entry"][0]
            return reply, info
        elif req.method == "DELETE":
            return splunk_licenser_entity.delete().body, None
        elif req.method == "GET":
            return splunk_licenser_entity.get(**req.params).body, None
        else:
            raise NotImplementedError("Unsupported method %s" % req.method)
