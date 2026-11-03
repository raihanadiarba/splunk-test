import os
import sys

from export_utils.rest.request import build_request, HTTPRequest
from export_utils.rest.response import HTTPResult, HTTPResponse, UNSUPPORTED_METHOD_ERROR

if sys.platform == 'win32':
    import msvcrt
    # Binary mode is required for persistent mode on Windows.
    msvcrt.setmode(sys.stdin.fileno(), os.O_BINARY)
    msvcrt.setmode(sys.stdout.fileno(), os.O_BINARY)
    msvcrt.setmode(sys.stderr.fileno(), os.O_BINARY)


class RestHandler:
    def __init__(self):
        super().__init__()

    def handle(self, request_string):
        try:
            request = build_request(request_string)
            res = self.handle_request(request)

        except Exception as err:
            message = err.msg if hasattr(err, 'msg') else str(err)

            status = err.statusCode if hasattr(err, 'statusCode') else 500
            payload = {
                'message': message
            }
            result = HTTPResult.ERROR
            res = HTTPResponse(status, result, dict(), payload)

        return self.format_response(res)

    def handle_request(self, request: HTTPRequest):
        method = request.method
        if method == 'GET':
            return self.get(request)
        if method == 'POST':
            return self.post(request)
        if method == 'OPTIONS':
            return self.options(request)
        if method == 'PUT':
            return self.put(request)
        if method == 'DELETE':
            return self.delete(request)
        return UNSUPPORTED_METHOD_ERROR


    def format_response(self, response: HTTPResponse):
        headers = dict(response.headers)

        if 'Content-Type' not in headers:
            headers['Content-Type'] = 'application/json; charset=utf-8'

        return {
            'payload': response.to_splunk_payload(),
            'status': response.status,
            'headers': headers
        }

    def get(self, _: HTTPRequest) -> HTTPResponse:
        return UNSUPPORTED_METHOD_ERROR

    def post(self, _: HTTPRequest) -> HTTPResponse:
        return UNSUPPORTED_METHOD_ERROR

    def put(self, _: HTTPRequest) -> HTTPResponse:
        return UNSUPPORTED_METHOD_ERROR

    def delete(self, _: HTTPRequest) -> HTTPResponse:
        return UNSUPPORTED_METHOD_ERROR

    def options(self, _: HTTPRequest) -> HTTPResponse:
        return UNSUPPORTED_METHOD_ERROR
