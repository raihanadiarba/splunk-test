"""
An instances filter matched by serverclass rules
"""

# pylint: disable=missing-docstring
# pylint: disable=no-self-use
# pylint: disable=too-few-public-methods

import re
import logging

from agent import InvalidUserInputException
from agent.models import View
from agent.common.helpers import split_csv_string


class ServerclassFilteringGroup():
    """
    Class for server class filter.
    A group consists of a set of instances that match server class rules.
    """

    LIST_FIELDS = ("clientName", "hostname", "ip", "dns")
    MACHINE_TYPE_FIELDS = ("splunkPlatform",)

    def __init__(self, serverclass):
        self._logger = logging.getLogger(self.__class__.__name__)
        self._group_name = serverclass.get_value("name")
        self._filter_whitelist = list(self._serverclass_match_list(serverclass, "whitelist"))
        self._filter_blacklist = list(self._serverclass_match_list(serverclass, "blacklist"))
        self._filter_machine_type = list(self._serverclass_match_list(serverclass, "machineTypesFilter"))
        self._can_match = bool(self._filter_whitelist)

    def has_filters(self):
        """
        Verify if current server class can possible have any matches
        """
        return self._can_match

    def get_group_name(self):
        """Return filtering group name
        """
        return self._group_name

    def match(self, instance):
        """Match an instance vs. serverclass filters
        """
        return self.match_json(instance.json(View.KeepOriginal))

    # pylint: disable=too-many-branches
    # ForPerformance: this code looks like that because of the performance optimization
    # If you will change it - compare the performance
    def match_json(self, json_instance):
        """Match an instance vs. serverclass filters
        """
        if not self._can_match:
            return False
        matched = False
        for key in self.LIST_FIELDS:
            field = json_instance[key]
            for match in self._filter_whitelist:
                if match(field):
                    matched = True
                    break
            if matched:
                break
        if matched:
            if self._filter_blacklist:
                for key in self.LIST_FIELDS:
                    field = json_instance[key]
                    for match in self._filter_blacklist:
                        if match(field):
                            return False

            if self._filter_machine_type:
                matched = False
                splunk_platform = json_instance["splunkPlatform"]
                for match in self._filter_machine_type:
                    if match(splunk_platform):
                        return True
        return matched

    def _serverclass_match_list(self, serverclass, filters_list):
        filters = serverclass.get_value(filters_list) if serverclass.has_path(filters_list) else ""
        values = split_csv_string(filters)
        for value in values:
            regex = self._normalize_re(value)
            if regex:
                yield regex.match
            else:
                self._can_match = False

    def _normalize_re(self, wildcards):
        # convert serverclass wildcards format to "normal" regex
        try:
            return ServerclassFilteringGroup.compile_re(wildcards)
        except InvalidUserInputException as exc:
            self._logger.error(str(exc))
            return None

    @staticmethod
    def compile_re(user_input):
        """
        Try to compile user filter to regular expression.
        """
        try:
            # we are matching logic in DSClientFilter.cpp
            return re.compile(user_input.replace(".", "\\.").replace("*", ".*") + "$", re.IGNORECASE)
        except re.error as exc:
            raise InvalidUserInputException(fmt=("Invalid server class filter %s. %s" % (user_input, str(exc))))
