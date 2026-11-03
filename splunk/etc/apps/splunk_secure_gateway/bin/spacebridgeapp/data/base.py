"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Module for any base classes that we want other data classes
to inherit from
"""

import json
from abc import ABCMeta


class SpacebridgeAppBase(object):
    """Base level abstract class for data objects which provides common utilities
    such as returning a json representation of the object.
    """

    __metaclass__ = ABCMeta

    def __repr__(self):
        return json.dumps(vars(self), default=str)

    def __eq__(self, obj):
        if isinstance(obj, self.__class__) and len(vars(self)) == len(vars(obj)):
            return all(getattr(obj, attr) == getattr(self, attr) for attr in vars(self).keys())
        return False

    def __ne__(self, obj):
        """Overrides the default implementation (unnecessary in Python 3)"""
        return not self.__eq__(obj)

    def to_json(self):
        return json.dumps(vars(self))
