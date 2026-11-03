"""
Error classes for describing Spacebridge REST actions
"""
from http import HTTPStatus
from enum import IntEnum

class SpacebridgeRestError(Exception):
    def __init__(self, message="Spacebridge Error", status=500):
        self.message = message
        self.status = status

    def __str__(self):
        return self.message


class SpacebridgeServerError(SpacebridgeRestError):
    pass


class SpacebridgeKvstoreError(SpacebridgeRestError):
    pass


class SpacebridgePermissionsError(SpacebridgeRestError):
    pass


class SpacebridgeProtobufError(SpacebridgeRestError):
    pass


class SsgHttpError(Exception):
    def __init__(self, message="Unknown error occurred within SSG", status=HTTPStatus.INTERNAL_SERVER_ERROR):
        self.message = message
        self.status = status

    def __str__(self):
        return f"{{'status_code'={self.status}, 'message'={self.message}}}"
    
class SSGHTTPStatus(IntEnum):
    """
    Extended SSG HTTP status codes and reason phrases
    """
    def __new__(cls, value, phrase, description=''):
        obj = int.__new__(cls, value)
        obj._value_ = value

        obj.phrase = phrase
        obj.description = description
        return obj

    SPLUNK_TOKENS_DISABLED = (541, 'Splunk Tokens Disabled',
        'Operation failed due to Splunk tokens being disabled')
