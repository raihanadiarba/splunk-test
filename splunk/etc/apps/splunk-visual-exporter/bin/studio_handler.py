import sys
import json
from splunk.clilib.bundle_paths import make_splunkhome_path
from splunk.persistconn.application import PersistentServerConnectionApplication
 
sys.path.append(make_splunkhome_path(['etc', 'apps', 'splunk-visual-exporter', 'bin']))
sys.path.append(make_splunkhome_path(['etc', 'apps', 'splunk-visual-exporter', 'bin', 'modules']))

from http import HTTPStatus
from export_utils.rest.handler import RestHandler, HTTPResponse, HTTPResult
from export_utils.rest.request import HTTPRequest
from export_utils.chromium.engine import ChromiumEngine, DEFAULT_EXPORT_MAX_FILE_SIZE_MB, DEFAULT_EXPORT_MAX_SCALE_FACTOR

class StudioHandler(RestHandler, PersistentServerConnectionApplication):
    def __init__(self, _command_line, _command_arg):
        super(PersistentServerConnectionApplication, self).__init__()

    def post(self, request: HTTPRequest):
        definition_string = request.form.get('definition')
        feature_flags_string = request.form.get('featureFlags', '{}')
        theme = request.form.get('theme', 'dark')
        timeout = request.form.get('timeout')
        export_max_file_size_mb = request.form.get("exportMaxFileSizeMB")
        export_max_scale_factor = request.form.get("exportMaxScaleFactor")
        file_format = request.form.get('fileFormat', 'pdf')
        
        if timeout is not None:
            timeout = int(timeout)
        screenshot_delay = request.form.get('screenshot_delay')
        if screenshot_delay is not None:
            screenshot_delay = int(screenshot_delay)
        if export_max_file_size_mb is not None:
            export_max_file_size_mb = self._extract_form_value_with_threshold(export_max_file_size_mb, default_value=DEFAULT_EXPORT_MAX_FILE_SIZE_MB, min_threshold=0)
        if export_max_scale_factor is not None:
            export_max_scale_factor = self._extract_form_value_with_threshold(export_max_scale_factor, default_value=DEFAULT_EXPORT_MAX_SCALE_FACTOR, min_threshold=0)
        
        definition = json.loads(definition_string)
        feature_flags = {}

        # Parse the feature flags from the request
        try:
            feature_flags = json.loads(feature_flags_string)
        except (json.JSONDecodeError, TypeError):
            feature_flags = {}

        studio_errors = []
        engine = ChromiumEngine()
        image = engine.get_screenshot(definition, theme, feature_flags, studio_errors, timeout=timeout, screenshot_delay=screenshot_delay, export_max_file_size_mb=export_max_file_size_mb, export_max_scale_factor=export_max_scale_factor, file_format=file_format)

        if request.query.get('export_as') == 'html':
            return self.html_response(image)
        return self.json_response(image)

    def _extract_form_value_with_threshold(self, form_value, default_value, min_threshold):
        int_form_value = int(form_value)
        if int_form_value <= min_threshold:
            int_form_value = default_value
        
        return int_form_value

    def html_response(self, image: str):
        html = "<html><body><img src='{}' /></body></html>".format(image)
        return HTTPResponse(
            HTTPStatus.OK,
            HTTPResult.OK,
            {
                'Content-Type': 'text/html'
            },
            html,
            True
        ) 
    
    def json_response(self, image: str):
        # image == False or None means “capture failed or timed out”
        if not image:
            body = {
                'result': 'ok',
                'contents': False
            }
        else:
            # extract “png” or “jpeg” from the data:URI
            prefix = image.split(',', 1)[0]
            try:
                img_type = prefix.split(';', 1)[0].split('/', 1)[1]
            except Exception:
                img_type = 'png'
            body = {
                'result': 'ok',
                'meta': { 
                    'type': img_type 
                },
                'contents': image
            }
        return HTTPResponse(
            HTTPStatus.OK,
            HTTPResult.OK,
            {'Content-Type': 'application/json'},
            body
        )

    def get(self, request: HTTPRequest):
        return HTTPResponse(
            HTTPStatus.OK,
            HTTPResult.OK,
            {},
            {
                'message': 'successful',
            },
        )