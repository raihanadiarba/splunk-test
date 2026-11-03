"""
Role Based Access Control helpers
"""
# pylint: disable=import-error
import functools
from collections.abc import Iterable
from functools import reduce  # pylint: disable=redefined-builtin
from bottle import request, HTTPError
from agent import ioc, ApiErrorException


LIMITED_PROPERTIES_KEY = "limited_properties"
_ACCESS_DENIED_ERROR = "Access denied. Insufficient user capability(ies): %s."


def raise_access_denied_error(insufficient_capabilities):
    """Raise HTTP 403 with insufficient capabilities list
    """
    raise HTTPError(403, {
        "description": "Access denied",
        "missing_capabilities": [str(cp) for cp in insufficient_capabilities]
    })


def match_access_capabilities(required):
    """Match required capabilities vs. user granted ones.
    """
    return ioc.components.user_context().match_access_capabilities(required)


def require_capability_format(*required):
    """Helper function that checks capabilities in json schema validation
    """

    def check_capability(_):
        """Capabilities checking callback
        """
        insufficient_capabilities = match_access_capabilities(required)
        if insufficient_capabilities:
            raise_access_denied_error(insufficient_capabilities)
        return True

    return check_capability


def sanitize_reply(reply, path, insufficient_capabilities):
    """Sanitize reply removing protected path from it
    """
    if not insufficient_capabilities:  # there is nothing to do when all capabilities present
        return

    if not path:  # is the entire reply forbidden?
        raise_access_denied_error(insufficient_capabilities)

    # Clean the reply entries:
    # 1. For each entry get section with "limited property" (if any).
    # 2. Delete limited property from the entry itself
    # 3. Make a note in entry[acl][limited_property] explaining why some property has been removed
    limited_property = path[-1]
    for entry in reply["entry"]:
        # reduce returns section of the entry where limited property is located
        limited_property_container = reduce(dict.get, path[:-1], entry)
        if isinstance(limited_property_container, object) and \
                limited_property_container.get(limited_property) is not None:
            # delete limited property
            del limited_property_container[limited_property]

            # update "limited_properties" array
            entry.setdefault("acl", dict())\
                 .setdefault(LIMITED_PROPERTIES_KEY, dict())[limited_property] = \
                dict(error="access denied",
                     missing_capabilities=[str(cp) for cp in insufficient_capabilities])


def decorate_reply_with_user_rights(reply, insufficient_capabilities):
    """Add "acl" "can_write" and "removable" flags to reply. The decorator can be "chained" and it sets rights to
    False if at least one capability in the chain is missing.
    """
    for entry in reply.get("entry") or []:
        # add "acl" can_write and removable
        acl = entry.setdefault("acl", dict())
        acl.setdefault("can_write", True)
        acl.setdefault("removable", True)
        # update user rights based on insufficient capabilities status
        if insufficient_capabilities:
            acl["can_write"] = False
            acl["removable"] = False


def decorate_reply_with_links(service_path, reply, global_links, entry_links, insufficient_capabilities):
    """Add global end entries links to reply
    """
    # decorate reply
    entries = reply.get("entry")
    if entries is None:  # not a "formatted reply" - do nothing
        return

    full_service_path = "/services/dmc" + service_path

    if global_links:
        # add global links
        global_links_dict = reply.setdefault("links", dict())
        for link in global_links:
            global_links_dict.setdefault(link, full_service_path)

        if insufficient_capabilities:
            for link in global_links:
                del global_links_dict[link]

    if entry_links:
        for entry in entries:
            entry_links_dict = entry.setdefault("links", dict())
            for link in entry_links:
                entry_links_dict.setdefault(link, full_service_path + "/" + entry.get("name"))

            if insufficient_capabilities:
                for link in entry_links:
                    del entry_links_dict[link]


def handle_reply(callback, *required):
    """REST endpoint, generic access control decorator
    """

    def func_wrapper(func):
        """Endpoint callback wrapper
        """

        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            """Match user granted capabilities vs required ones
            """
            reply = func(*args, **kwargs)
            insufficient_capabilities = match_access_capabilities(required)
            callback(reply, insufficient_capabilities)
            return reply

        return wrapper

    return func_wrapper


def filtered(path, *required):
    """REST endpoint decorator sanitizing the reply. If access capabilities don't match this decorator removes
    part of reply pointed by path. When path is empty 403 error is replied.
    """
    assert path is None or isinstance(path, Iterable)

    return handle_reply(
        lambda reply, ic: sanitize_reply(reply, path, ic),
        *required
    )


def edit(*required):
    """REST endpoint, edit access control
    """

    def func_wrapper(func):
        """Endpoint callback wrapper
        """

        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            """Match user granted capabilities vs required ones
            """
            if request.method in ["POST", "DELETE"]:
                insufficient_capabilities = match_access_capabilities(required)
                if insufficient_capabilities:
                    raise_access_denied_error(insufficient_capabilities)
            return func(*args, **kwargs)

        return wrapper

    return func_wrapper


def edit_with_api_error(api_prefix, *required):
    """REST endpoint, edit access control
       return ApiErrorException
    """

    def func_wrapper(func):
        """Endpoint callback wrapper
        """

        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            """Match user granted capabilities vs required ones
            """
            if request.method in ["POST", "DELETE"]:
                insufficient_capabilities = match_access_capabilities(required)
                if insufficient_capabilities:
                    raise ApiErrorException(
                        "%s_AccessDenied" % api_prefix,
                        dict(missing_capabilities=[str(cp) for cp in insufficient_capabilities]))
            return func(*args, **kwargs)

        return wrapper

    return func_wrapper


def rights(*required):
    """Decorates reply with user rights
    """
    return handle_reply(decorate_reply_with_user_rights, *required)


def links(service_path, global_links, entry_links, *required):
    """Decorates reply with links
    """
    return handle_reply(
        lambda reply, ic: decorate_reply_with_links(service_path, reply, global_links, entry_links, ic),
        *required
    )
