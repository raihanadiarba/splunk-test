"""
Helper functions for repository classes
"""

import functools

from agent.models import JSONEntity, View
from agent import ServerException


def __clean(obj):
    """
    Deep clean all underscore fields
    """
    if isinstance(obj, JSONEntity):
        obj = obj.json(view=View.KeepOriginal)
    if "_key" in obj:
        del obj["_key"]
    if "_user" in obj:
        del obj["_user"]


def clean_private_kvstore_values(func):
    """Removes internal fields
    """

    @functools.wraps(func)
    def cleaner(*args, **kwargs):
        """
        Cleaner wrapper
        """
        result = func(*args, **kwargs)
        if isinstance(result, tuple):
            # expects (result, total)
            for member in result[0]:
                __clean(member)
        elif isinstance(result, list):
            for member in result:
                __clean(member)
        elif isinstance(result, JSONEntity):
            __clean(result)
        else:
            raise ServerException("Unexpected type")
        return result

    return cleaner
