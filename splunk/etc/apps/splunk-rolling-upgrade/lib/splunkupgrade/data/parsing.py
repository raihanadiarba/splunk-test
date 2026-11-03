from typing import Any, Callable, List, Optional

from packaging.version import InvalidVersion, Version
from splunkupgrade.data.data_parse_exception import DataParseException
from splunkupgrade.utils.types import JsonObject
from splunkupgrade.utils.utils import does_path_exist


def get_field(input_dict: JsonObject, field_name: str, type_name: type) -> Any:
    if not does_path_exist(input_dict, field_name):
        raise DataParseException(f"'{field_name}' does not exist")
    field = input_dict[field_name]
    if not isinstance(field, type_name):
        raise DataParseException(
            f"Field='{field_name}' expected to have type='{type_name}', but has a different type"
        )
    return field


def get_field_with_default(
    input_dict: JsonObject, field_name: str, type_name: type, default: Any
) -> Any:
    return (
        get_field(input_dict, field_name, type_name)
        if does_path_exist(input_dict, field_name)
        else default
    )


def get_optional_field(input_dict: JsonObject, field_name: str, type_name: type) -> Optional[Any]:
    if (not does_path_exist(input_dict, field_name)) or input_dict[field_name] is None:
        return None
    return get_field(input_dict, field_name, type_name)


def get_enum_field(enum_type: Any, string_value: str, default_value: Any) -> Any:
    if not isinstance(string_value, str):
        raise DataParseException(
            f"Cannot convert non-string value='{string_value}' to enum='{enum_type}'"
        )
    try:
        value = enum_type(string_value)
    except ValueError:
        return default_value
    return value


def get_enum_field_throws(enum_type: Any, string_value: str) -> Any:
    parsed = get_enum_field(enum_type, string_value, None)
    if parsed is None:
        raise DataParseException(f"Unexpected enum value='{string_value}' for enum='{enum_type}'")
    return parsed


def throw_for_deprecated(deprecated_field_name: str, value: Any, field_name: str) -> None:
    if value is not None:
        raise DataParseException(
            f"Field name='{deprecated_field_name}' has been deprecated. Use '{field_name}' instead"
        )


def get_object_list_field(
    json_array: List[JsonObject], parsing_function: Callable[[JsonObject], Any]
) -> List[Any]:
    return [parsing_function(value) for value in json_array]


def str_to_int(int_as_string: str) -> int:
    try:
        int_value = int(int_as_string)
        return int_value
    except ValueError:
        raise DataParseException(f"Parsing error. value='{int_as_string}' is not an integer")


def is_positive(value: int) -> bool:
    return value > 0


def is_positive_or_zero(value: int) -> bool:
    return value >= 0


def ensure_valid(int_value: int, validator: Callable[[int], bool]) -> None:
    if not validator(int_value):
        raise DataParseException(
            f"Config value parsing error. value='{int_value}' must be positive"
        )


def get_valid_config(int_as_string: str, validator: Callable[[int], bool]) -> int:
    int_value = str_to_int(int_as_string)
    ensure_valid(int_value, validator)
    return int_value


def get_optional_valid_int_config(
    source: dict, config_key_name: str, validator: Callable[[int], bool]
) -> Optional[int]:
    if config_key_name in source:
        config_value_as_str = source[config_key_name]
        if not isinstance(config_value_as_str, str):
            raise DataParseException(
                f"Value='{config_value_as_str}' has unexpected type. String expected."
            )
        return get_valid_config(config_value_as_str, validator)
    return None


def get_valid_int_config_or_default(
    source: dict, config_key_name: str, default_value: int, validator: Callable[[int], bool]
) -> int:
    parsed_value = get_optional_valid_int_config(source, config_key_name, validator)
    return parsed_value if parsed_value is not None else default_value


def to_version(string_version: str) -> Version:
    try:
        return Version(string_version)
    except InvalidVersion as e:
        message = f"Cannot parse version field='{string_version}'. {e}"
        raise DataParseException(message)


def to_bool(string_bool: str) -> bool:
    positives = ["1", "true", "yes", "t"]
    negatives = ["0", "false", "no", "f"]
    lowercase_str = string_bool.lower()
    if lowercase_str in positives:
        return True
    elif lowercase_str in negatives:
        return False
    raise DataParseException(
        f"Boolean field is expected to have one of the following values=['1', '0', 'true', 'false', 'f', 't', 'yes', 'no'], but has value='{string_bool}' instead"
    )
