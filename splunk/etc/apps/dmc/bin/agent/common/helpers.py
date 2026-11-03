"""
Miscellaneous utilities
"""
import logging

import os
import errno
import traceback
import uuid
import shutil
import sys
import tempfile
from contextlib import contextmanager
from collections import OrderedDict
from functools import wraps
import six
import semantic_version
import splunk.util


_logger = logging.getLogger(__name__)


# To signify value being retrieved is absent, when None is a legit value.
ABSENT = object()


@contextmanager
def make_temp(filename=None, temp_root=None):
    """
    Make a temp file
    """
    try:
        # prepare temp root folder
        if temp_root:
            if os.path.exists(temp_root):
                shutil.rmtree(temp_root)
            mkdir_p(temp_root)

        temp_dir = tempfile.mkdtemp(dir=temp_root)

        if filename is None:
            yield temp_dir
        else:
            temp_filename = os.path.join(temp_dir, filename)
            yield temp_filename
    finally:
        # cleanup
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)
        if temp_root and os.path.exists(temp_root):
            shutil.rmtree(temp_root)


def remove_file_or_dir(path):
    """ Remove the file or dir """
    if os.path.isfile(path):
        os.remove(path)  # remove the file
    elif os.path.isdir(path):
        shutil.rmtree(path)  # remove dir and all contains
    else:
        assert False


def merge_tree(src, dst):
    """
    Merge src into dst. If a file already exists at the destination, skip it.
    """
    for item in os.listdir(src):
        src_child = os.path.join(src, item)
        dst_child = os.path.join(dst, item)

        if os.path.isdir(dst_child):
            merge_tree(src_child, dst_child)
            continue

        if os.path.exists(dst_child):
            continue

        if os.path.isdir(src_child):
            shutil.copytree(src_child, dst_child)
        else:
            shutil.copy2(src_child, dst_child)


def mkdir_p(path):
    """Analogue of mkdir -p
       http://stackoverflow.com/questions/600268/mkdir-p-functionality-in-python
    """
    try:
        os.makedirs(path)
    except OSError as exc:
        if exc.errno == errno.EEXIST and os.path.isdir(path):
            pass
        else:
            raise


def stringify_guid(guid):
    """We want to have all guids look the same to meet less issues with different
    cases in identifies
    """
    return str(guid).upper()


def touch_file(path):
    """Create a new file if it does not exist
    """
    if not os.path.exists(path):
        open(path, 'a').close()


def is_dir_nonempty(path):
    """Check whether a dir includes files
    """
    return os.path.isdir(path) and any(files for (path, dirs, files) in os.walk(path))


def generate_guid():
    """Generates a guid and capitalized it
    """
    return stringify_guid(uuid.uuid4())


def generate_passkey():
    """ for now use uuid4
    """
    # leaving this function in here so that we can change generate_passkey() in future
    return generate_guid()


def is_guid(val):
    """Checks whether the string is a GUID or not
    """
    try:
        uuid.UUID(val)
    except ValueError:
        return False
    return True


def compare_ids(id1, id2):
    """Compare two identities, if they are guids - will be compared as GUIDs
    if not - as regular values
    """
    try:
        if not isinstance(id1, uuid.UUID):
            id1 = uuid.UUID(id1)
        if not isinstance(id2, uuid.UUID):
            id2 = uuid.UUID(id2)
    except ValueError:
        pass
    return id1 == id2


def split_csv_string(csv, delimiter=","):
    """Split a CSV string into array of values
    """
    return [] if not csv.strip() else \
        [_.strip() for _ in csv.replace("\n", "").split(delimiter)]


class Enum(type):
    """
    Meta class for enums

    An enum can either be declared by setting its __metaclass__ to
    this class or by derive from another enum.

    Enum names are class attribute names (so intellisense would work).
    Enum values can be different than the names and are specified
    as class attribute values.

    If an attribute value is a static function called "_compute", the actual enum value will
    be set to the return value of the function,
    called with the attribute name as the only parameter.

    If an enum is derived from another enum, its values can be
    obtained by the values of the base enum.
    For example:
    In 'role_name' enum, we have 'idxc_member = "idxc:member"'
    In 'role_group_name' enum, we have 'idxc_member="indexers"'
    Since 'role_group_name' is derived from 'role_name',
    we have 'role_group_name["idxc:member"] == "indexers"'

    Attribute names must *NOT* start with '_', so we don't take python
    class internal attributes as enum attributes.
    """
    # pylint: disable=super-init-not-called
    def __init__(cls, what, bases, attr_dict):
        """
        Check consistency and replace enum values if needed.
        """
        assert what
        assert attr_dict

        cls._names = {key for key in cls.__dict__ if not key.startswith('_')}

        for name in cls._names:
            value = getattr(cls, name)
            if callable(value) and value.__name__ == "_compute":
                setattr(cls, name, value.__call__(name))

        assert len(bases) == 1
        base = bases[0]

        if base is not object:
            assert isinstance(base, Enum)
            base.assert_name_set_identical(cls._names)
            base.assert_values_unique()

        cls._values = {getattr(cls, name) for name in cls._names}

    # pylint: enable=super-init-not-called

    def assert_name_set_identical(cls, name_iter):
        """
        Assert the name set of the enum is identical to the set of
        the passed in
        """
        assert set(cls._names) == set(name_iter)

    def __contains__(cls, value):
        """
        Check if a value is in the enum.
        """
        return value in cls._values

    def __getitem__(cls, value):
        """
        :param value: The value in the base enum
        :return: The corresponding value in cls
        """
        base = cls.__base__
        assert base is not object
        name = base(value)
        if not name:
            raise KeyError(value)
        return getattr(cls, name)

    def __call__(cls, value):
        """
        Get the name from a value
        """
        for name in cls._names:
            if getattr(cls, name) == value:
                return name
        _logger.debug("Invalid value %s for enum type %s: %s", value, cls.__name__, traceback.format_exc())
        return None

    def assert_values_unique(cls):
        """
        Assert all values in the enum are unique
        """
        values = [getattr(cls, name) for name in cls._names]
        assert len(values) == len(set(values))

    def __iter__(cls):
        """
        :return: Iterable over values in the enum.
        """
        return (getattr(cls, name) for name in cls._names)


def clean_environ(env, splunk_home=None):
    """
    Returns os.environ without any LIB/PATH of SPLUNK_HOME.
    Useful to run external processes
    """
    result = {}
    if not splunk_home:
        splunk_home = env.get("SPLUNK_HOME")
    if splunk_home:
        splunk_home = os.path.expandvars(os.path.normpath(splunk_home)) + os.sep
        for key, value in env.items():
            if key in [
                    "LIBPATH",  # AIX
                    "DYLD_LIBRARY_PATH",  # OS/X
                    "SHLIB_PATH",  # HP/UX
                    "LD_LIBRARY_PATH",  # All other Unix
                    "PATH",
                    "PYTHONPATH"]:
                values = [x for x in value.split(":") if not os.path.normpath(x).startswith(splunk_home)]
                if values:
                    result[key] = ":".join(values)
    else:
        result = env.copy()
    return result


def to_bool(value):
    """Simple helper to convert string to bool
    """
    return splunk.util.normalizeBoolean(value)


def splunk_bool(value):
    """Simple helper to convert bool to splunk conf format
    """
    return "true" if value else "false"


def serialize_stanza_ordered(stanza_value):
    """
    Serialize stanza value as an ordered dictionary unless it is None
    """
    ret = None
    if isinstance(stanza_value, OrderedDict):
        ret = list(stanza_value.items())
    else:
        assert stanza_value is None
        ret = stanza_value
    return ret


def ensure_str(value):
    """If string is unicode - convert it to string
    """
    if not sys.version_info >= (3, 0) and isinstance(value, unicode):  # pylint: disable=undefined-variable
        return value.encode("ascii", "strict")
    return value


def format_messages(level, messages):
    """Format a list of messages for the UI by including the message type (error|warning|info)
    """
    return [_format_message(level, message) for message in messages]


def _format_message(level, message):
    """Format a single message for the UI
    """
    ret = message
    if is_string(message):
        ret = {"type": level, "text": message}
    elif "type" not in message:
        message["type"] = level
        ret = message
    return ret


def compare_versions(left, right):
    """ "Smart" version comparison that does normalization of the arguments before calling semantic_version.compare
    """
    return semantic_version.compare(str(semantic_version.Version.coerce(left)),
                                    str(semantic_version.Version.coerce(right)))


_STRING_TYPE = six.string_types if sys.version_info >= (3, 0) else basestring  # pylint: disable=undefined-variable


def is_string(value):
    """ Portable check whether the value is string
    """
    return isinstance(value, _STRING_TYPE)


def trace(func):
    """
    Trace function to add bookending logs
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        _logger.info("action=%s, status=starting, arguments=%s", func.__name__, args)
        result = func(*args, **kwargs)
        _logger.info("action=%s, status=success, arguments=%s", func.__name__, args)
        return result
    return wrapper
