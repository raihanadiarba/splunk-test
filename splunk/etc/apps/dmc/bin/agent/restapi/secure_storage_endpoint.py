# pylint: disable=missing-docstring
# pylint: disable=too-few-public-methods

import bottle

from agent import ioc, NotFoundException
from agent.restapi import eai_helpers
from agent.services import SecureStorage


class SecureStorageEndpoint(ioc.Component):

    """SecureStorage endpoint.
    """
    def __init__(self):
        bottle.get("/securestorage/<name>")(self.get)
        self._securestorage = ioc.services.secure_storage()

    @eai_helpers.response_formatted
    def get(self, name):
        try:
            entity = self._securestorage.decrypt({SecureStorage.keyname: name})
            return (name, {"name": name, "value": entity},)
        except NotFoundException as ex:
            raise bottle.HTTPError(404, str(ex))
