"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.
"""
import logging

from semver import parse_version_info, format_version as format_semver

DEFAULT_VERSION = '0.0.0'

CLIENT_VERSION_LOWER = 'lower'

PRERELEASE_TAG_FAIL = 'fail'

MINIMUM_BUILDS = {
    'fail.local': 9999
}


def format_version(semver_str, build_number):
    version_info = parse_version_info(DEFAULT_VERSION)

    try:
        version_info = parse_version_info(semver_str)
    except (TypeError, ValueError):
        pass

    return format_semver(version_info.major,
                         version_info.minor,
                         version_info.patch,
                         version_info.prerelease,
                         build_number)


def minimum_build(app_id):
    """
    Determines the minimum build for the supplied app id, returns 0 if not configured
    :param app_id:
    :return: the configured build minimum, 0 if not configured
    """
    build_number = int(MINIMUM_BUILDS.get(app_id, 0))
    return build_number


def is_version_ok(log: logging.Logger,
                  app_id, client_semver_str):
    """
    :param app_id:
    :param client_semver_str:
    :return: True if the version passes the configured minimum, False otherwise
    """
    try:
        version_info = parse_version_info(client_semver_str)
        if version_info.prerelease == PRERELEASE_TAG_FAIL:
            return False

        app_minimum_build = minimum_build(app_id)
        client_build_number = int(version_info.build)
        is_valid = app_minimum_build <= client_build_number
        log.debug("Client build_number={}, minimum_build={}".format(client_build_number, app_minimum_build))
        return is_valid
    except (TypeError, ValueError):
        # if the client passes an invalid semver string, assume they know what they're doing
        return True

