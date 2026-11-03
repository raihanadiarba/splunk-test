"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Helper function to convert different types to UTF-8 Strings
"""
from typing import Any


def to_utf8_str(value: Any):
    if isinstance(value, list):
        return list_to_str(value)
    elif value is None:
        return ''
    else:
        return str(value)


def list_to_str(list_of_values: [str]) -> str:
    return str([str(value) for value in list_of_values]).encode('utf-8').decode('unicode_escape')

