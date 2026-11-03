"""
Info endpoint
"""

import bottle
from agent import ioc


class InfoEndpoint(ioc.Component):
    """Info endpoint.
    """

    def __init__(self):
        bottle.get("/info")(self.get)

    @staticmethod
    def get():
        """ Return status info about DMC.
        """
        return {"status": "running"}
