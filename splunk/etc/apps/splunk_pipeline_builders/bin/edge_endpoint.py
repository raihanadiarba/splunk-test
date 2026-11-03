from splunk.persistconn.application import PersistentServerConnectionApplication
from cherrypy import log
import re, json, os, base64, sys
from splunk.clilib.cli_common import getConfStanza

BASE_PATH = os.path.join(os.environ.get('SPLUNK_HOME', '/opt/splunk'), 'etc', 'apps', 'splunk_pipeline_builders', 'binaries')
ABS_BASE_PATH = os.path.realpath(BASE_PATH)

# This code is duplicated in pipeline_endpoint.py
def is_search_head():
    clustering_mode = getConfStanza('server', 'clustering').get('mode')
    return clustering_mode == 'searchhead' or clustering_mode == 'disabled'

class EdgeBinaryHandler(PersistentServerConnectionApplication):
    def __init__(self, _command_line, _command_arg):
        # This code is duplicated in pipeline_endpoint.py
        if not is_search_head():
            sys.exit(1)
        else:
            super(PersistentServerConnectionApplication, self).__init__()

    def _compute_file_path(self, name, version, env, artifact):
        """
        Computes the file path based on request.
        @param match: The map containing the keys required to build path
        @param path: The rest url to map to correct artifact
        @return: The computed file path and the filename of current artifact
        """
        binary_path = os.path.join(name, version, env, artifact)
        artifact_path= os.path.join(BASE_PATH, binary_path)

        # Return the full file path
        return artifact_path


    def handle(self, in_string):
        """
        Handles incoming requests for the Splunk Edge CMP package by decoding the input JSON and checking for required fields.
        If the request is valid and the file exists, it returns the file as a base64-encoded string with appropriate headers;
        otherwise, it returns an error response with the corresponding status code.

        @param in_string: request data passed in
        """
        request = json.loads(in_string)

        action = request.get("method", None)

        if action is None:
            log(str({'endpoint':'edge', 'action': 'handle_request', 'error': 'action is None', "status": 400}))
            return {
                "status": 400,
                "payload": "'method' is a required field",
            }

        if action == "GET":
            return self._handle_get_request(request)
        else:
            log(str({'endpoint':'edge','action': 'action not GET', 'error': f"Method '{action}' is not allowed'", "status": 405}))
            return {
                "status": 405,
                "payload": f"Method '{action}' is not allowed'",
            }


    def _handle_get_request(self, request):
        """
        Handles the GET request by computing the file path based on the version in the request,
        and then returning the file if it exists.

        @param request: The decoded JSON request object
        """

        path = request.get("rest_path", None)
        if path is None:
            log(str({'endpoint':'edge','action': '_handle_get_request', 'error': "'rest_path' is required", 'status': 400}))
            return {
                'status': 400,
                'payload': "'rest_path' is required"
            }

        pattern = re.compile(r'/dmx/packages/(?P<name>[^/]+)/(?P<version>[^/]+)/(?P<env>[^/]+)/(?P<artifact>[^/]+)')
        match = pattern.match(path)


        if match is None or not all(field in match.groupdict() for field in ['name', 'version', 'env', 'artifact']):
            log(str({'endpoint':'edge','action': '_handle_get_request', 'error': "'name', 'version', 'environment', and 'artifact' are required fields", 'status': 400}))
            return {
                "status": 400,
                "payload": "'name', 'version', 'environment', and 'artifact' are required fields",
            }

        name = match.group('name')
        version = match.group('version')
        env = match.group('env')
        artifact = match.group('artifact')

        if None in (name, version, env, artifact):
            log(str({'endpoint':'edge','action': '_handle_get_request', 'error': "'name', 'version', 'environment', and 'artifact' are required fields", 'status': 400}))
            return {
                "status": 400,
                "payload": "'name', 'version', 'environment', and 'artifact' are required fields",
            }

        file_path = self._compute_file_path(name, version, env, artifact)
        abs_file_path = os.path.realpath(file_path)

        try:
            is_within_base = os.path.commonpath([abs_file_path, ABS_BASE_PATH]) == ABS_BASE_PATH
        except ValueError:
            is_within_base = False

        if not is_within_base or os.path.isdir(file_path):
            log(str({'endpoint':'edge','action': '_handle_get_request', 'error': "Invalid file path", 'status': 403}))
            return {
                "status": 403,  # Forbidden, due to attempt to access restricted path
                "payload": "Invalid file path",
            }

        try:
            fd = os.open(abs_file_path, os.O_RDONLY | os.O_NOFOLLOW)
            with os.fdopen(fd, 'rb') as file:
                binary_content = file.read()
            encoded_binary = base64.b64encode(binary_content).decode('utf-8')
            return {
                "status": 200,
                "payload_base64": encoded_binary,
                "headers": {
                    "Content-Disposition": f"attachment; filename={artifact}",
                    "Content-Type": "application/x-tar"
                }
            }
        except FileNotFoundError:
            log(str({'endpoint':'edge','action': 'GET', 'error': "Package not found", "status": 404}))
            return {"status": 404, "payload": "Package not found"}
        except Exception as e:
            log(str({'endpoint':'edge','action': '_handle_get_request', 'error': "Parsing of the binary file could not be completed. Please check the integrity of the referenced artifact.", "status": 500}))
            return {
                "status": 500,
                "payload": "Parsing of the binary file could not be completed. Please check the integrity of the referenced artifact."
            }
