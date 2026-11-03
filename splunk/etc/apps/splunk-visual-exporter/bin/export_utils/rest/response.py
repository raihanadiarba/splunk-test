from dataclasses import dataclass
from typing import Dict, Union
from enum import Enum
from http import HTTPStatus

class HTTPResult(Enum):
    OK = 'ok'
    ERROR = 'error'

    def __str__(self):
        return self.value

@dataclass
class HTTPResponse:
    status: int
    result: HTTPResult
    headers: dict
    payload: Union[Dict, str]
    raw: bool = False

    def to_splunk_payload(self) -> Union[Dict, str]:
        if self.raw:
            return self.payload

        return {
            'result': str(self.result),
            'payload': self.payload
        }
    
UNSUPPORTED_METHOD_ERROR = HTTPResponse(HTTPStatus.METHOD_NOT_ALLOWED,
                                         HTTPResult.ERROR,
                                         dict(),
                                         {'message': "Unsupported HTTP method"})

