"""
Base class for "purpose built UI" configuration entries
"""

import logging
import sys
import six

from agent.models import JSONEntity, View
from agent.common.json_schema import validate_schema
from agent.common.helpers import to_bool, split_csv_string
from agent.common.helpers import Enum, is_string
# pylint: disable=no-name-in-module
# pylint: disable=import-error
if sys.version_info >= (3, 0):
    import urllib.parse as urllib
else:
    import urllib
# pylint: enable=no-name-in-module
# pylint: enable=import-error


_logger = logging.getLogger(__name__)


def _uri_quote(part):
    """Returns quoted uri part
    """
    part = urllib.quote(part, safe="")
    return part


@six.add_metaclass(Enum)
class ContentType(object):  # pylint: disable=useless-object-inheritance
    """Configuration entry type: default, local, mixed (== default | local)
    """

    none = 0x0
    default = 0x1
    local = 0x2


class ConfigurationEntry(JSONEntity):
    """Base class for purpose built ui entries
    """
    _ID_FIELD = "name"

    _GROUP = None

    _STANZA = None

    _COMPONENT = None

    _STANZA_NAME_DELIMITER = None

    _DEFAULTS = {}

    _SCHEMA = {}

    # by default Splunk conf uses comma to separate array items, but some component (like perfmon) may use a different
    # character
    _ARRAY_DELIMITER = ","

    def __init__(self, bundle_info, name, local, default, **params):
        # find content type
        self._content_type = ContentType.none
        if local is not None:
            self._content_type |= ContentType.local
        if default is not None:
            self._content_type |= ContentType.default

        # combine settings: local (highest priority) and default
        local = local or dict()
        default = default or dict()
        keys = set(list(local.keys()) + list(default.keys()))
        content = {
            key: local.get(key) if local.get(key) is not None else default.get(key)
            for key in keys
        }

        super(ConfigurationEntry, self).__init__({
            "name": name,
            "bundle_info": bundle_info,
            "content": self.deserialize_content(content),
            "params": params
        })

    @classmethod
    def component(cls):
        """Get component name that is used as a part of http query in REST API. By default it's identical to stanza
        name, but for example tcpout has component name tcpout-group
        """
        component_name = cls._COMPONENT or cls._STANZA
        assert component_name
        return component_name

    @classmethod
    def stanza(cls):
        """Get entry conf stanza
        """
        return cls._STANZA

    @classmethod
    def stanza_tag(cls, name):
        """Get entry conf stanza tag. For example all inputs have format [stanza://name], outputs: [stanza:name].
        """
        return cls._STANZA if name == cls._STANZA else cls._STANZA + cls._STANZA_NAME_DELIMITER + name

    @classmethod
    def extract_stanza_name(cls, tag):
        """Extract stanza name from its tag. If delimiter is missing this method returns stanza name itself. For
        example let's assume ":" is the delimiter, then:
        http:test -> test
        http -> http
        """
        return tag.split(cls._STANZA_NAME_DELIMITER, 1)[-1]

    @classmethod
    def schema(cls):
        """Get json schema
        """
        return cls._SCHEMA

    @property
    def name(self):
        """Get entry name
        """
        return self.get_value("name")

    @property
    def bundle_info(self):
        """Get entry bundle info (dict of name, type and id)
        """
        return self.get_value("bundle_info")

    @property
    def content(self):
        """Get entry content
        """
        return self.get_value("content")

    @property
    def disabled(self):
        """Is entry disabled
        """
        return to_bool(self.content.get("disabled"))

    @property
    def status(self):
        """Get entry deployment status
        """
        return "pending" if self.get_value("params")["is_pending"] else "deployed"

    def links(self):
        """Entry links used by UI
        """
        path = "/services/dmc/config/%s/%s/%s/%s" % \
               (self._GROUP, self.bundle_info["name"], self.component(), _uri_quote(self.name))
        toggle = "enable" if self.disabled else "disable"
        # common links
        links = {
            "alternate": path,
            "list": path,
            "edit": path,
            toggle: path + "/" + toggle
        }
        # content type dependent links
        if self._content_type == ContentType.local:
            # local entry - add delete and move links
            links["delete"] = path
            links["move"] = path + "/move"
        elif self._content_type == (ContentType.local | ContentType.default):
            # revert to default link
            links["revert"] = path + "/revert"

        return links

    def update(self, content):
        """Update entry content
        """
        self.validate(content)
        # merge new params with the existing content
        new_content = {}
        new_content.update(self._DEFAULTS)
        new_content.update(self.content)
        new_content.update(self.deserialize_content(content))
        self.set_value("content", new_content)

    def validate(self, content):
        """Validate entry new content
        """
        validate_schema(content, self.schema())

    def json(self, view=View.RepositoryView):
        ret = None
        if view == View.RestView:
            # special format for REST API reply
            ret = {
                "name": self.name,
                "content": self.content,
                "acl": self.get_formatted_bundle_info(),
                "@status": self.status,
                "links": self.links()
            }
        else:
            ret = super(ConfigurationEntry, self).json(view)

        return ret

    def get_formatted_bundle_info(self):
        """Get bundle info as a dictionary with bundle app, type and id"""
        formatted_info = {
            "app": self.bundle_info["name"],
            "@bundleType": self.bundle_info["type"],
            "@bundleId": self.bundle_info["id"]
        }

        # add related bundles (if any)
        related_bundles = self.bundle_info.get("related_bundles")
        if related_bundles is not None:
            formatted_info["@groups"] = related_bundles

        return formatted_info

    def get_serialized_content(self):
        """Return content in format compatible with Splunk conf files. Lists become csv strings.
        """
        return {
            key: self._ARRAY_DELIMITER.join(value) if isinstance(value, list) else str(value)
            for key, value in self.content.items()
            if not key.startswith("@")  # skip "synthetic" content
        }

    @classmethod
    def deserialize_content(cls, serialized_content):
        """Convert Splunk conf style content to an object. If a property is an array (we use json schema to
        detect this) it's converted into a python list.
        """
        content = dict()
        for key, value in serialized_content.items():
            # deserialize csv string to array and number string to int value
            if is_string(value):
                property_type = cls.schema()["properties"].get(key, {}).get("type")
                try:
                    if property_type == "array":
                        content[key] = split_csv_string(value, cls._ARRAY_DELIMITER)
                    elif property_type == "number":
                        content[key] = int(value)
                except ValueError:
                    _logger.error("failed to convert %s to type %s", value, property_type)

            # use value "as is" it it wasn't deserialized before
            if key not in content:
                content[key] = value

        return content
