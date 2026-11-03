"""Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved."""
import base64
import hashlib
import logging
from functools import partial
from enum import Enum
from http import HTTPStatus
import time
import datetime
import calendar
import re
from cloudgateway.private.encryption.encryption_handler import encrypt_for_send
from spacebridgeapp.exceptions.spacebridge_exceptions import SpacebridgeApiRequestError
from spacebridgeapp.util.constants import SPLUNK_DASHBOARD_APP, SPLUNK_DASHBOARD_STUDIO, ITSI, SA_ITOA, \
    UDF_IMAGE_RESOURCE_COLLECTION, UDF_ICON_RESOURCE_COLLECTION, ITSI_FILES_COLLECTION, ITSI_ICON_COLLECTION

# UDF Hosted Image Constants
HOSTED_KVSTORE_PREFIX = "splunk-enterprise-kvstore://"
ICON_VISUALIZATION_TYPE = "icon"
IMAGE_VISUALIZATION_TYPE = "image"
DATA_URI = 'dataURI'
DATA = 'data'
SVG_PATH = 'svg_path'
DEFAULT_WIDTH = 'default_width'
DEFAULT_HEIGHT = 'default_height'
METADATA = 'metadata'
TYPE = 'type'

# Resource Source List
UDF_ICON_RESOURCE_LIST = [
    (SPLUNK_DASHBOARD_STUDIO, UDF_ICON_RESOURCE_COLLECTION),
    (SA_ITOA, ITSI_ICON_COLLECTION),
    (SPLUNK_DASHBOARD_APP, UDF_ICON_RESOURCE_COLLECTION)
]
UDF_IMAGE_RESOURCE_LIST = [
    (SPLUNK_DASHBOARD_STUDIO, UDF_IMAGE_RESOURCE_COLLECTION),
    (SA_ITOA, ITSI_FILES_COLLECTION),
    (SPLUNK_DASHBOARD_APP, UDF_IMAGE_RESOURCE_COLLECTION)
]


class HostedResourceType(Enum):
    """
    Enum to enumerate different types of hosted resources such as whether the resource is hosted in kv store
    """

    UNKNOWN = 0
    URL = 1
    KVSTORE = 2
    LOCAL = 3


def parse_hosted_resource_path(resource_path):
    """
    Given a resource path string, parse the string to return the type of the resource and return a tuple of the
    resource type and the parsed resource path
    :param resource_path:
    :return: (HostedResourceType, Resource Path String)
    """
    resource_path = resource_path.strip()
    if resource_path.startswith(HOSTED_KVSTORE_PREFIX):
        return HostedResourceType.KVSTORE, resource_path[len(HOSTED_KVSTORE_PREFIX):]
    elif resource_path.startswith("http://") or resource_path.startswith("https://"):
        return HostedResourceType.URL, resource_path
    elif resource_path.startswith("/"):
        return HostedResourceType.LOCAL, resource_path
    else:
        return HostedResourceType.UNKNOWN, resource_path


def parse_svg_path_resource(data_jsn):
    """
    Parse the response from an svg_path response for stored resources
    :param data_jsn:
    :return: (String, Bytes) containing the mime-type of the resource and the raw bytes of the resource respectively
    """
    svg_path = data_jsn[SVG_PATH]
    default_width = data_jsn[DEFAULT_WIDTH]
    default_height = data_jsn[DEFAULT_HEIGHT]

    viewbox = ""
    if default_width is not None and default_height is not None:
        viewbox = f"viewBox=\"0 0 {default_width} {default_height}\""

    svg_bytes = bytes(f'<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
                      f'<svg xmlns="http://www.w3.org/2000/svg" {viewbox}>'
                      f'<path d="{svg_path}"></path>'
                      f'</svg>', 'utf-8')
    svg_mime = 'data:image/svg+xml'
    return svg_mime, svg_bytes


def parse_data_kvstore_resource(data_jsn, data_key):
    """
    Parse the response from KV Store for stored resources
    :param data_jsn:
    :param data_key:
    :return: (String, Bytes) containing the mime-type of the resource and the raw bytes of the resource respectively
    """
    metadata_version = data_jsn.get(METADATA, {}).get('version')
    if metadata_version == 'V1':
        mime = f'data:{data_jsn.get(TYPE)}'
        data_payload = data_jsn.get(data_key)
    else:
        data_uri = data_jsn[data_key]
        d = data_uri.split(",")
        data_meta = d[0]
        data_payload = d[1]
        mime, encoding = data_meta.split(";")

        if encoding != 'base64':
            raise SpacebridgeApiRequestError(
                "Unexpected data encoding type. Expected base64 but got encoding={}".format(encoding),
                status_code=HTTPStatus.BAD_REQUEST)

    resource_bytes = base64.b64decode(data_payload)
    return mime, resource_bytes


def parse_udf_kvstore_resource(data_jsn):
    """
    Parse the response from KV Store for stored resources
    :param data_jsn:
    :return: (String, Bytes) containing the mime-type of the resource and the raw bytes of the resource respectively
    """

    if SVG_PATH in data_jsn:
        return parse_svg_path_resource(data_jsn)
    elif DATA_URI in data_jsn:
        return parse_data_kvstore_resource(data_jsn, DATA_URI)
    elif DATA in data_jsn:
        return parse_data_kvstore_resource(data_jsn, DATA)

    return None, None


def build_encrypted_resource(resource_bytes, device_encrypt_public_key, encryption_context):
    """
    Takes resource_bytes and returns the encrypted bytes of the resource encrypted with the client device's public key
    :param resource_bytes
    :param device_encrypt_public_key:
    :param encryption_context:
    :return: Bytes
    """
    encryptor = partial(encrypt_for_send, encryption_context.sodium_client, device_encrypt_public_key)
    return encryptor(resource_bytes)


def get_kvstore_sources_from_resource_type(resource_type):
    """
    Give a resource type for a KV Store Collection Resource, map it to the corresponding list of sources to iterate.
    :param resource_type:
    :return:
    """
    if resource_type.lower() == ICON_VISUALIZATION_TYPE:
        return UDF_ICON_RESOURCE_LIST
    return UDF_IMAGE_RESOURCE_LIST


def generate_cache_key(device_id, hosted_resource_type, parsed_path, resource_type):
    """
    Helper function to generate a cache_key based off of hosted resource params
    :param device_id:
    :param hosted_resource_type:
    :param parsed_path:
    :param resource_type:
    :return:
    """
    values_to_hash = []

    if device_id:
        values_to_hash.append(device_id)

    if hosted_resource_type:
        values_to_hash.append(str(hosted_resource_type))

    if parsed_path:
        values_to_hash.append(parsed_path)

    if resource_type:
        values_to_hash.append(resource_type)

    string_to_hash = ','.join(values_to_hash).encode('utf-8')
    hash_object = hashlib.sha256(string_to_hash)
    return hash_object.hexdigest()


def parse_inputs(log: logging.Logger,
                 jsn):
    """
    Parses the "inputs" section inside of a UDF Dashboard Definition JSON object and replaces
    any unsupported timerange default timestamps with Unix timestamps (see MSB-3268)
    :param jsn: The "inputs" object inside a UDF dashboard definition JSON object
    :return: The same JSON object, with unsupported timestamps replaced
    """
    for j in jsn:
        try:
            if jsn[j].get('type') == 'input.timerange':
                split_defaults = jsn[j]['options']['defaultValue'].split(",", 1)
                earliest, latest = extract_time(log, split_defaults[0]), extract_time(log, split_defaults[1])
                jsn[j]['options']['defaultValue'] = str(earliest) + "," + str(latest)
        except Exception as e:
            # Shouldn't get here
            log.warn("Failed to parse input JSON %s", jsn)
    return jsn

def extract_time(log: logging.Logger, time_string):
    """
    Checks if a time_string is in an unsupported format and converts it to Unix time if that is the case
    :param time_string: the timestamp string. 
    :return: If the timestamp string is not formatted similarly to 2022-09-01T00:00:00.000Z, this function returns time_string, unmodified.
    If a timestamp with a format similar to 2022-09-01T00:00:00.000Z is detected, this function will return the Unix timestamp for that time
    """
    try:
        # full timestamp with milliseconds
        match = re.match(r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z", time_string)
        if match:
            return calendar.timegm(datetime.datetime.strptime(time_string, "%Y-%m-%dT%H:%M:%S.%fZ").timetuple())

        # timestamp missing milliseconds
        match = re.match(r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z", time_string)
        if match:
            return calendar.timegm(datetime.datetime.strptime(time_string, "%Y-%m-%dT%H:%M:%SZ").timetuple())

        # timestamp missing milliseconds & seconds
        match = re.match(r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z", time_string)
        if match:
            return calendar.timegm(datetime.datetime.strptime(time_string, "%Y-%m-%dT%H:%MZ").timetuple())

        # timestamp with only date
        match = re.match(r"\d{4}-\d{2}-\d{2}", time_string)
        if match:
            return calendar.timegm(datetime.datetime.strptime(time_string, "%Y-%m-%d").timetuple())
    except Exception as e:
        log.warn("Failed to convert time_string %s", time_string)
    return time_string
