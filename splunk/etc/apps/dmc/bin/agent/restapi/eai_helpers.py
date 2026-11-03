# pylint: disable=missing-docstring
# pylint: disable=invalid-name
# pylint: disable=no-init
# pylint: disable=no-self-use
# pylint: disable=attribute-defined-outside-init
# pylint: disable=too-few-public-methods
# pylint: disable=no-member, no-else-return, unsupported-membership-test, unsubscriptable-object

"""
Helper functions to make an endpoint EAI like
"""
import logging
import collections
import json

from functools import wraps

from bottle import request, response, HTTPError
from agent.models.bundle import compute_bundle_name
from agent.common.helpers import format_messages
from agent import ioc

_logger = logging.getLogger(__name__)

_default_per_page = 30
_packages_paginate = "packages-paginate"

eai_result = collections.namedtuple("eai_result", ["data", "count"])


def filtered(get):
    """
    Parse query string for query parameter
    query ==> req_query
    """
    @wraps(get)
    def decorate(*args, **kwargs):
        req_query = _parse_req_query()
        kwargs["req_query"] = req_query
        return get(*args, **kwargs)
    return decorate


def paginated(get):
    """
    Parse query string for EAI like pagination
    Extracts the following query parameters
    offset ==> offset
    count ==> count
    sort_dir ==> reverse : asc ==> True, desc ==> False
    sort_key ==> sort_key
    """
    @wraps(get)
    def decorate(*args, **kwargs):
        offset, count = _parse_offset_count()
        reverse = _parse_sort_dir()
        sort_key = _parse_sort_key()
        kwargs["offset"] = offset
        kwargs["count"] = count
        kwargs["reverse"] = reverse
        kwargs["sort_key"] = sort_key
        return get(*args, **kwargs)
    return decorate


def messages_formatted(callback):
    """
    Format response warning messages to be UI friendly:
        {'type': 'warning', 'text': message}

    Error messages need no additional formatting as they are returned via HTTPError
    """
    @wraps(callback)
    def decorate(*args, **kwargs):
        ret = callback(*args, **kwargs)

        if response.status_code == 200:
            if "messages" in ret:
                ret["messages"] = format_messages('warning', ret["messages"])
            elif "entry" in ret:
                for entry in ret["entry"]:
                    if "messages" in entry:
                        entry["messages"] = format_messages('warning', entry["messages"])

        return ret
    return decorate


def response_formatted(callback):
    """
    Format response to be EAI like which contains pagination related
    information and an array of "entry"
    {
        "entry": [
            {
                "content": ...,
                "name": "_indexers",
                "messages": [{"type": "warning", "text": <string>}, ...]
            },
            ...
        ],
        "paging": {
            "perPage": 30,
            "offset": 0,
            "total": 27
        }
    }
    Input can be a list of name value pairs (tuples)
    or a single pair, with name ==> entry.name
    value ==> entry.content
    """
    @wraps(callback)
    def decorate(*args, **kwargs):
        ret = callback(*args, **kwargs)

        if response.status_code != 200:
            # request failed with a custom message - return it "as is"
            return ret
        elif "status" in ret and ret["status"] != 0:
            # request failed with a custom payload - return it "as is"
            return ret
        elif "offset" in kwargs and "count" in kwargs:
            total = None
            if isinstance(ret, tuple):
                total = _get_total(ret)
                assert isinstance(total, int)
                entries = ret[0]
            elif isinstance(ret, list):
                entries = ret
            else:
                assert False

            return _list_body(
                entries,
                kwargs["count"],
                kwargs["offset"],
                total
            )
        elif isinstance(ret, list):
            # in case of lists we create an entry of each item of
            # the list
            return _list_default(ret)
        elif isinstance(ret, eai_result):
            # In case it's a instance of eai_result
            # call list_body with data from tuple
            return _list_body(ret.data, ret.count,
                              0, ret.count)
        else:
            assert isinstance(ret, tuple)
            return _element_body(*ret)
    return decorate


def response_stanza_links(group_type):
    """Add stanza link to reply entries
    """

    def func_wrapper(func):
        """Callback wrapper
        """

        @wraps(func)
        def wrapper(*args, **kwargs):
            """Add stanza link to every entry in reply
            """
            reply = func(*args, **kwargs)

            for entry in reply.get("entry") or []:
                name = entry.get("name")
                if name:
                    links = entry.setdefault("links", dict())
                    links["stanzas"] = "/services/dmc/stanzas/" + \
                                       compute_bundle_name(group_type, name)

            return reply

        return wrapper

    return func_wrapper


def _parse_offset_count():
    """
    :return: offset and count parsed from query string
    """
    offset_str = request.query.get("offset")
    count_str = request.query.get("count")
    if count_str is None:
        count_str = str(_default_per_page)

    def verify_number(num_str):
        if num_str:
            if not num_str.isdigit():
                err_msg = "'%s' is not a positive integer." % num_str
                _logger.warning(err_msg)
                raise HTTPError(400, err_msg)
            return int(num_str)
        else:
            return 0

    offset = verify_number(offset_str)

    count = verify_number(count_str)

    return offset, count


def _parse_req_query():
    """
    :return: query paremeter or None
    """
    req_query = None
    try:
        if "query" in request.query:
            req_query = json.loads(request.query["query"])
    except:  # noqa: E722
        raise HTTPError(400, "Error parsing request query")

    return req_query


def _parse_sort_dir():
    """
    :return: bool indicating if it is the reverse order or not
    """
    sort_dir = request.query.get("sort_dir")

    if sort_dir is None:
        return False

    if sort_dir == "asc":
        return False

    if sort_dir == "desc":
        return True

    err_msg = "Invalid sort_dir: '%s' ." % sort_dir
    _logger.warning(err_msg)
    raise HTTPError(400, err_msg)


def _parse_sort_key():
    """
    :return:name of sort key or null:
    """
    sort_key = request.query.get("sort_key")

    if sort_key is None:
        return None

    # need to validate if the sort key is valid
    return sort_key


def _list_body(name_value_pairs, perPage, offset, total):
    """
    :return: A dictionary which is ready to be serialized into JSON
    {
        "entry": [..., ...],
        "paging": {
             "perPage": 30,
             "offset": 0
             "total": 100
        }
    }
    """
    entries = [_entry(x[0], x[1]) if isinstance(x, tuple) else x
               for x in name_value_pairs]
    ret = {"entry": entries}
    if total is not None:
        ret["paging"] = {
            "perPage": perPage,
            "offset": offset,
            "total": total
        }
    return ret


def _get_total(ret):
    """
    :return: total, count
    """
    if _packages_paginate in request.url:
        return ioc.repositories.tasks_repository().get_count(
                        query={"workflow": "appinspect_workflow"})
    return ret[1]


def make_name(propName):
    """
    :param propName: The name of the property on result that
    will be used as value for "name" property on each entity
    in EAI format
    """
    assert isinstance(propName, str)

    def decorator(func):
        """
        Converts a given list of result items to a list of tuples
        in the format
        [(name, value), (name,value)....]
        """

        def make_prop_name(x):
            return x[propName], x

        def wrapper(*args, **kwargs):
            res = func(*args, **kwargs)

            if isinstance(res, eai_result):
                data = [make_prop_name(x) for x in res.data]
                return eai_result(data, res.count)
            else:
                # Single element case, just return one element
                # rather than a list, the formatter
                # will set total to 1
                assert isinstance(res, dict)
                if propName not in res:
                    return res  # propName does not exist, do not alter return type
                return [make_prop_name(res)]

        return wrapper
    return decorator


def extract_name(callback):
    """
    Extract and remove "name" property and
    use it for the "name" property on each entity in EAI format.
    """

    def _extract_name(x):
        """
        Move name property of a dictionary out and return a tuple
        """
        name = x["name"]
        del x["name"]
        return name, x

    @wraps(callback)
    def decorator(*args, **kwargs):
        res = callback(*args, **kwargs)

        if isinstance(res, tuple):
            (values, total) = res
            name_value_pairs = [_extract_name(x) for x in values]
            return name_value_pairs, total
        elif isinstance(res, list):
            return [_extract_name(x) for x in res]
        else:
            assert isinstance(res, dict)
            return _extract_name(res)

    return decorator


def _element_body(name, value):
    """
    :return: A dictionary which is ready to be serialized into JSON
    {
        "entry": [...],
        "paging": {
            "perPage": 1,
            "offset": 0,
            "total", 1
        }
    }
    """
    return _list_body([(name, value)], _default_per_page, 0, 1)


def _list_default(items):
    """
    pass in default values for perpage and offset
    """
    num_items = len(items)
    return _list_body(items, _default_per_page, 0, num_items)


def _entry(name, value):
    """
    :param name: name to show up in EAI compatible payload
    :param value: content to show up in EAI comatiple payload
    :return: A dictionary which is ready to be serialized into JSON
    {
        "content": {
          "@existingTypes": [
            "indexes"
          ],
          "description": "Nodes in the indexer tier",
          "@memberCount": 123,
          "@type": "builtin",
          "displayName": "Indexers",
          "@bundle": "__indexers"
        },
        "name": "_indexers",
        "messages": [{"type": "warning", "text": <string>}, ...],
        "manifest": {...}
    }
    """
    ret = {"name": name, "messages": []}
    if value is not None:
        ret["content"] = value

        # Extract fields from the content section into the entry root
        if "manifest" in value:
            ret["manifest"] = value["manifest"]
            del value["manifest"]

        # Pull the messages out of the entry content structure, and format according to UI requirements
        if "messages" in value:
            ret["messages"] = format_messages('warning', value["messages"])
            del value["messages"]
    return ret
