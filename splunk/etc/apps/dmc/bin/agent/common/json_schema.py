"""
JSON Schema validation module. See http://json-schema.org, just required
minimum is implemented, see http://spacetelescope.github.io/understanding-json-schema/index.html
for examples

schema = {
    "type": "object",
    "properties": {
        "foo": { "type": "string", "enum": ["a", "b"] },
        "bar": { "type": "number" },
        "url": { "type": "string", "minLength": 1, "maxLength": 255, "pattern": "https?://splunk.*" },
        "path": { "type": "string" },
        "arr": { "type": "array", items: {"type": "string"} },
        "subobj": { "type": "obj", "properties": { "one": { "type": "string"},
                                                   "two": { "type": "string"} },
                    "additionalProperties": false }
        "id": {"type": "string", "format": "guid"}
    },
    "required": [ "foo" ]
}

result = validate_schema({"foo": "foo value", "bar": 1}, schema)
"""

import sys
import numbers
import re
import inspect
from functools import cmp_to_key

from agent import SchemaValidationException, ServerException
from agent.common.helpers import is_guid, is_string


def validators_order_cmp(first, second):
    """Defines the order how we should apply validators.
    We should check type at first before trying to access some special properties
    on this object. Like if we expect dict we might invoke keys() which does not exist
    if current object is string.
    """
    if first == second:
        return 0
    if first == "type":
        return -1
    if second == "type":
        return 1
    return (first > second) - (first < second)


def _is_json_array(json):
    """Verify if json object is json array.

    Right now only list is a valid json array, in future we can also allow sets
    and tuples, but our parser only parses arrays as list so no need for now
    """
    return isinstance(json, list)


def validate_schema(json, schema):
    """Validate json over schema
    """
    jsonvalidator = JsonValidator(json, schema)
    jsonvalidator.validate()


# pylint: disable=too-few-public-methods
class JsonValidator(object):  # pylint: disable=useless-object-inheritance
    """JSON Validator
    """

    def __init__(self, json, schema):
        self._json = json
        self._schema = schema
        self._validators = {
            "type": self._validate_schema_types,
            "repeat": self._validate_schema_repeat,
            "properties": self._validate_schema_properties,
            "items": self._validate_schema_items,
            "required": self._validate_schema_required,
            "enum": self._validate_schema_enum,
            "pattern": self._validate_schema_pattern,
            "format": self._validate_schema_formats,
            "uniqueItems": self._validate_schema_uniqueness,
            # verifying it in "properties"
            "additionalProperties": None,
            # verifying it in "type"
            "minLength": None,
            # verifying it in "type"
            "maxLength": None
        }

    def validate(self):
        """Validate JSON
        """
        self._validate_schema(self._json, self._schema)

    def _validate_schema(self, json, schema):
        """Validate JSON internal
        """
        if not isinstance(schema, dict):
            raise ServerException(fmt=("Invalid schema, dict expected, got %s" % schema))
        for schema_rule in sorted(schema.keys(), key=cmp_to_key(validators_order_cmp)):
            if schema_rule not in self._validators:
                raise ServerException(fmt=("Unexpected schema rule %s" % schema_rule))
            validator = self._validators.get(schema_rule)
            if validator:
                validator(json, schema)

    def _validate_schema_types(self, json, schema):
        """Validate object types
        """
        object_types = schema["type"]
        if isinstance(object_types, str):
            object_types = (object_types,)
        for object_type in object_types:
            if self._validate_schema_type(json, object_type, schema.get("minLength"), schema.get("maxLength")):
                return
        err_msg = "Schema validation failed, expected type(s) %s for %s, got %s" \
            % (object_types, json, type(json).__name__)
        raise SchemaValidationException(fmt=err_msg)

    def _validate_schema_type(self, json, object_type, min_length=None, max_length=None):
        """Validate object type
        """
        assert self
        result = None
        if object_type == "object":
            result = isinstance(json, dict)
        elif object_type == "array":
            result = _is_json_array(json)
        elif object_type == "number":
            result = isinstance(json, numbers.Number) and not isinstance(json, bool)
        elif object_type == "string":
            if not is_string(json):
                return False
            if min_length is not None and len(json) < min_length:
                err_msg = "Schema validation failed, cannot be shorter than %d characters: '%s'" % (min_length, json)
                raise SchemaValidationException(fmt=err_msg)
            if max_length is not None and len(json) > max_length:
                err_msg = "Schema validation failed, cannot be longer than %d characters: '%s'" % (max_length, json)
                raise SchemaValidationException(fmt=err_msg)
            return True
        elif object_type == "boolean":
            result = isinstance(json, bool)
        elif object_type == "null":
            result = json is None
        else:
            err_msg = "Not valid type %s" % object_type
            raise ServerException(fmt=err_msg)
        return result

    def _validate_schema_repeat(self, json, schema):
        """Validate repeated items in object with schema (key value is ignored)
        (recursive)
        """
        # No repeat items, nothing to verify
        if not json:
            return
        repeat_schema = schema["repeat"]
        for value in json.values():
            self._validate_schema(value, repeat_schema)

    def _validate_schema_properties(self, json, schema):
        """Validate properties in object with schema
        (recursive)
        """
        # No properties, nothing to verify
        if not json:
            return
        properties = schema["properties"]
        for prop, prop_schema in properties.items():
            if prop in json:
                self._validate_schema(json[prop], prop_schema)
        if not schema.get("additionalProperties", True):
            for prop in json.keys():
                if prop not in properties:
                    err_msg = "Schema validation failed, unexpected property %s" % prop
                    raise SchemaValidationException(fmt=err_msg)

    def _validate_schema_required(self, json, schema):
        """Validate required fields in object
        """
        assert self
        required = schema["required"]
        if required and not json:
            err_msg = "Schema validation failed, empty object, when required fields defined"
            raise SchemaValidationException(fmt=err_msg)
        for prop in required:
            if prop not in json:
                err_msg = "Schema validation failed, field %s not found" % prop
                raise SchemaValidationException(fmt=err_msg)

    def _validate_schema_enum(self, json, schema):
        """Validate against enum values
        """
        assert self
        enum = schema["enum"]
        for val in enum:
            if json == val:
                return
        err_msg = "Schema validation failed, unexpected value %s" % json
        raise SchemaValidationException(fmt=err_msg)

    def _validate_schema_pattern(self, json, schema):
        """Validate schema pattern
        """
        assert self
        pattern = schema["pattern"]
        if not re.compile(pattern).match(json):
            err_msg = "Schema validation failed, unmatched pattern %s expected %s" % (json, pattern)
            raise SchemaValidationException(fmt=err_msg)

    def _validate_schema_formats(self, json, schema):
        """Validate schema format
        """
        schemaformats = schema["format"]
        if not isinstance(schemaformats, (list, set, tuple)):
            schemaformats = (schemaformats,)
        for schemaformat in schemaformats:
            self._validate_schema_format(json, schema, schemaformat)

    def _validate_schema_format(self, json, schema, schemaformat):
        """Validate schema format
        """
        if schemaformat == "guid":
            if not is_guid(json):
                err_msg = "Schema validation failed, guid expected, got %s" % json
                raise SchemaValidationException(fmt=err_msg)
        elif schemaformat == "splunk-boolean":
            if not is_string(json) or \
               json.strip().lower() not in ["0", "false", "f", "off", "no", "n", "1", "true", "t", "on", "yes", "y"]:
                err_msg = "Schema validation failed, incorrect splunk boolean %s" % json
                raise SchemaValidationException(fmt=err_msg)
        elif callable(schemaformat):
            if sys.version_info >= (3, 0):
                argspec = inspect.getfullargspec(schemaformat)
            else:
                argspec = inspect.getargspec(schemaformat)  # pylint: disable=deprecated-method,no-member
            args = []
            if len(argspec.args) > 0:
                args.append(json)
            if len(argspec.args) > 1:
                args.append(schema)
            if len(argspec.args) > 2:
                args.append(self._json)
            result = schemaformat(*args)
            if result is not None and not result:
                err_msg = "Schema validation failed, format validator failed"
                raise SchemaValidationException(fmt=err_msg)
        else:
            raise ServerException(fmt="Unsupported format %s" % schemaformat)

    def _validate_schema_items(self, json, schema):
        """Validate items in array
        """
        item_schema = schema["items"]
        assert isinstance(item_schema, (dict, list))
        item_schemas = [item_schema] if isinstance(item_schema, dict) else item_schema
        if not _is_json_array(json):
            err_msg = "Schema validation failed, array excepted, got %s" % json
            raise SchemaValidationException(fmt=err_msg)
        for item in json:
            valid = False
            for item_schema in item_schemas:
                # TODO: better to rewrite it without try/catch
                try:
                    self._validate_schema(item, item_schema)
                    valid = True
                    break
                except SchemaValidationException:
                    pass
            if not valid:
                raise SchemaValidationException(fmt="Item is not supported by schema")

    def _validate_schema_uniqueness(self, json, schema):
        """Validate uniqueness in array
        """
        assert self
        assert schema
        if not _is_json_array(json):
            err_msg = "Schema validation failed, array excepted, got %s" % json
            raise SchemaValidationException(fmt=err_msg)
        if len(set(json)) != len(json):
            err_msg = "Schema validation failed, uniqueness expected"
            raise SchemaValidationException(fmt=err_msg)
