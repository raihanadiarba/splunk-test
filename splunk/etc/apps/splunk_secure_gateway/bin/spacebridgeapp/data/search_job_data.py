"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Search Job Python Data Objects
"""

from spacebridgeapp.data.base import SpacebridgeAppBase


class Message(SpacebridgeAppBase):
    """
    Message object
    """

    def __init__(self, type=None, text=None):
        self.type = type
        self.text = text

    def __eq__(self, obj):
        """
        Equality comparator
        :param obj:
        :return:
        """
        if isinstance(obj, self.__class__):
            return obj.type == self.type and \
                   obj.text == self.text
        else:
            return False

    def __repr__(self):
        """
        Make object a string
        :return:
        """
        return "type=%s, text=%s" % (self.type, self.text)


