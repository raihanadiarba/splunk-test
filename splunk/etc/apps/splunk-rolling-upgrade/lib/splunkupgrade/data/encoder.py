from enum import Enum
from json import JSONEncoder


class JsonWithEnumsEncoder(JSONEncoder):
    def default(self, o):
        if isinstance(o, Enum):
            return o.value
        return o.__dict__
