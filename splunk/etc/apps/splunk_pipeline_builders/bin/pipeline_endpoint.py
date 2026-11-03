from splunk.persistconn.application import PersistentServerConnectionApplication
from cherrypy import log
from datetime import datetime, timezone
import json, sys, os
import splunk.rest as rest
import splunk.entity as entity
import splunk.util as util
import xml.etree.ElementTree as ET

from splunk.clilib.cli_common import getConfStanza

# This code is duplicated in edge_endpoint.py
def is_search_head():
    clustering_mode = getConfStanza('server', 'clustering').get('mode')
    return clustering_mode == 'searchhead' or clustering_mode == 'disabled'


class ConfManager:
    def __init__(self, app_name, filename, auth_token):
        # This code is duplicated in edge_endpoint.py
        if not is_search_head():
            log(str({"endpoint":'pipelines', "action": 'init', "error": "The instance is not a Single Search Head"}))
            sys.exit(1)
        else:
            self.uri_path = [entity.buildEndpoint(entityClass='configs', entityName='conf-'+filename, namespace=app_name)]
            # '/servicesNS/nobody/{namespace}/configs/conf-{filename}'
            self.sessionKey = auth_token
            self.stanzas = None

    def _getUriPath(self, stanza=None, key=None):
        parts = []
        if stanza:
            parts.append(stanza)
            if key:
                parts.append(key)
        uriPath = self.uri_path[:]
        uriPath.extend([util.safeURLQuote(shard, '') for shard in parts])
        uri = '/'.join( uriPath)
        return uri

    def _handleErrorMessage(self, byteResponse):
        response = rest.format.parseFeedDocument(byteResponse)
        root = ET.fromstring(response)  # Parse the XML string into an ElementTree
        messages = root.find('messages')
        msg_elements = messages.findall('msg')
        error = ''
        for msg in msg_elements:
            error+=msg.text
        return error

    def createResponse(self, message):
        return {"message": message}

    def list_stanzas(self):
        if not self.stanzas:
            uri = self._getUriPath()
            try:
                serverResponse, serverContent = rest.simpleRequest(uri, getargs={'fillcontents':1, 'count':0}, sessionKey=self.sessionKey, rawResult=True)
                if serverResponse.status != 200:
                    error = self._handleErrorMessage(serverContent)
                    log(str({'endpoint':'pipelines','action': 'list_stanzas', 'error': str(error), "status": serverResponse.status}))
                    return serverResponse.status, self.createResponse(error)

                confFeed = rest.format.parseFeedDocument(serverContent)
                stanzas = confFeed.toPrimitive()
                self.stanzas = stanzas
                return serverResponse.status, self.stanzas

            except Exception as e:
                log(str({'endpoint':'pipelines','action': 'list_stanzas', 'error': str(e), "status": 500}))
                return 500, self.createResponse(f"The server returned error when fetching pipelines")

        return 200, self.stanzas

    def read_stanza(self, stanza):
        uri = self._getUriPath(stanza)
        try:
            serverResponse, serverContent = rest.simpleRequest(uri, getargs={'fillcontents':1}, sessionKey=self.sessionKey, rawResult=True)
            if serverResponse.status != 200:
                error = self._handleErrorMessage(serverContent)
                log(str({'endpoint':'pipelines','action': 'read_stanza', 'error': str(error), "status": serverResponse.status}))
                return serverResponse.status, self.createResponse(error)
            
            confFeed = rest.format.parseFeedDocument(serverContent)
            stanzaResponse = confFeed.toPrimitive()
            return 200, stanzaResponse[stanza]
        except Exception as e:
            log(str({'endpoint':'pipelines','action': 'read_stanza', 'error': str(e), "status": 500}))
            return 500, self.createResponse(str(e))

    def add_stanza(self, stanza):
        """Add a new stanza to a conf file."""
        payload = {"name": stanza}
        uri = self._getUriPath()

        try:
            serverResponse, serverContent = rest.simpleRequest(uri, postargs=payload, sessionKey=self.sessionKey, rawResult=True)
            if serverResponse.status != 201:
                error = self._handleErrorMessage(serverContent)
                log(str({'endpoint':'pipelines','action': 'add_stanza', 'error': str(error), "status": serverResponse.status}))
                return serverResponse.status, self.createResponse(error)

            return serverResponse.status, self.createResponse("Created pipeline")
        except Exception as e:
            log(str({'endpoint':'pipelines','action': 'add_stanza', 'error': str(e), "status": 500}))
            return 500, self.createResponse(str(e))

    def update_stanza_content(self, stanza, content):
        """Update or add content to a stanza."""
        uri = self._getUriPath(stanza)
        try:
            serverResponse, serverContent = rest.simpleRequest(uri, self.sessionKey, postargs=content, rawResult=True)
            if serverResponse.status != 200:
                error = self._handleErrorMessage(serverContent)
                log(str({'endpoint':'pipelines','action': 'update_stanza_content', 'error': str(error), "status": serverResponse.status}))
                return serverResponse.status, self.createResponse(error)

            self.stanzas = None
            return serverResponse.status, self.createResponse("Updated pipeline metadata")
        except Exception as e:
            log(str({'endpoint':'pipelines','action': 'update_stanza_content', 'error': str(e), "status": 500}))
            return 500, self.createResponse(str(e))

    def delete_stanza(self, stanza):
        """Delete a stanza from a conf file."""
        uri = self._getUriPath(stanza)
        try:
            serverResponse, serverContent = rest.simpleRequest(uri, sessionKey=self.sessionKey, method='DELETE', rawResult=True)
            if serverResponse.status != 200:
                error = self._handleErrorMessage(serverContent)
                log(str({'endpoint':'pipelines','action': 'delete_stanza', 'error': str(error), "status": serverResponse.status}))
                return serverResponse.status, self.createResponse(error)

            self.stanzas = None
            return serverResponse.status, self.createResponse("Pipeline deleted successfully")
        except Exception as e:
            log(str({'endpoint':'pipelines','action': 'delete_stanza', 'error': str(e), "status": 500}))
            return 500, self.createResponse(str(e))


class PipelineManager:
    def __init__(
        self,
        app_name,
        filename,
        auth_token=None,
    ):
        self.conf_manager = ConfManager(
            app_name, filename, auth_token
        )

    def parse_pipeline(self, pipeline_name, pipeline):
        extracted_data = {"name": pipeline_name}
        fields = ["updatedAt", "updatedBy", "createdAt", "createdBy", "runtime", "description", "title", "json_meta"]
        for key in pipeline.keys():
            if key == "json_content":
                extracted_data["json_content"] = json.loads(pipeline[key])
            elif key == "json_meta":
                meta = json.loads(pipeline[key])
                for meta_key in meta.keys():
                    if meta_key == "meta":
                        extracted_data["meta"] = json.loads(pipeline[key])    
            elif key in fields:
                extracted_data[key] = pipeline[key]
        return extracted_data

    def read_pipeline(self, pipeline_name):
        status, response = self.conf_manager.read_stanza(pipeline_name)
        if status == 200 and response != None:
            extracted_data = self.parse_pipeline(pipeline_name, response)
            return status, extracted_data
        log(str({'endpoint':'pipelines','action': 'read_pipeline', 'error': str(response), "status": status}))
        return status, response

    def _write_pipeline(
        self, pipeline_name, runtime, pipeline_def, user, description, title, meta, isExistingPipeline=False
    ):
        time_now = datetime.now(timezone.utc).isoformat()

        pipeline = {}
        if isExistingPipeline == False:
            status, response = self.conf_manager.add_stanza(pipeline_name)
            if status != 201:
                log(str({'endpoint':'pipelines','action': '_write_pipeline', 'error': str(response), "status": status}))
                return status, response
            pipeline = {"createdBy": user, "createdAt": time_now, "runtime": runtime}

        if pipeline_def != None:
            pipeline.update(
                {
                    "json_content": json.dumps(pipeline_def),
                    "json_meta": json.dumps(
                        {
                            "meta": meta,
                            "updatedBy": user,
                            "updatedAt": time_now,
                        }
                    )
                }
            )

        pipeline.update(
            {
                "updatedBy": user,
                "updatedAt": time_now,
                "description": description,
                "title": title if title != pipeline_name else ""
            }
        )

        status, response = self.conf_manager.update_stanza_content(
            pipeline_name, pipeline
        )

        if status != 200:
            log(str({'endpoint':'pipelines','action': '_write_pipeline', 'error': str(response), "status": status}))
            return status, response

        if isExistingPipeline:
            return status, self.conf_manager.createResponse("Pipeline updated successfully")

        return status, self.conf_manager.createResponse("Pipeline created successfully")

    def create_pipeline(self, pipeline_name, runtime, pipeline_def, user, description, title, meta):
        # pipeline should not exist
        status, response = self.conf_manager.read_stanza(pipeline_name)
        if status == 404:
            log(str({'endpoint':'pipelines','action': 'create_pipeline', 'error': str(response), "status": status}))
            return self._write_pipeline(pipeline_name, runtime, pipeline_def, user, description, title, meta)
        if status == 200 and response:
            return (
                409,
                self.conf_manager.createResponse("Pipeline with this name already exists. Please change the name."),
            )
        return (
            status,
            response,
        )

    def update_pipeline(self, pipeline_name, pipeline_def, user, description, title, meta):
        # pipeline should exist
        status, response = self.conf_manager.read_stanza(pipeline_name)
        if status == 200 and response:
            return self._write_pipeline(
                pipeline_name, None, pipeline_def, user, description, title, meta, True
            )
        log(str({'endpoint':'pipelines','action': 'update_pipeline', 'error': str(response), "status": status}))
        return (
            status,
            response,
        )

    def delete_pipeline(self, pipeline_name):
        return self.conf_manager.delete_stanza(pipeline_name)

    def list_pipelines(self, runtime):
        status, response = self.conf_manager.list_stanzas()
        pipeline_names = response.keys()
        if status == 200:
            if len(pipeline_names) > 0:
                items = []
                for pipeline_name in pipeline_names:
                    # filter by runtime
                    if runtime == "all" or response[pipeline_name]["runtime"] == runtime:
                        extracted_data = self.parse_pipeline(pipeline_name, response[pipeline_name])
                        items.append(extracted_data)
                return status, {"items": items, "totalCount": len(pipeline_names)}
            log(str({'endpoint':'pipelines','action': 'list_pipelines', 'error': "No pipeline found", "status": status}))
            return status, self.conf_manager.createResponse("No pipeline found")
        log(str({'endpoint':'pipelines','action': 'list_pipelines', 'error': str(response), "status": status}))
        return status, response

class PipelineManagerHandler(PersistentServerConnectionApplication):
    def __init__(self, _command_line, _command_arg):
        super(PersistentServerConnectionApplication, self).__init__()
        self.manager = None

    def _initialize_manager(self, request):
        app_name = request["ns"]["app"]
        self.manager = PipelineManager(
            app_name,
            "pipeline",
            request["session"]["authtoken"],
        )

    # Handle a syncronous from splunkd.
    def handle(self, in_string):
        """
        Called for a simple synchronous request.
        @param in_string: request data passed in
        @rtype: string or dict
        @return: String to return in response.  If a dict was passed in,
                 it will automatically be JSON encoded before being returned.
        """

        request = json.loads(in_string)

        path = request.get("rest_path", None)
        action = request.get("method", None)
        session = request.get("session", None)
        user = session.get("user") if session else None

        if path is None or action is None or user is None:
            log(str({'endpoint':'pipelines','action': 'handle_request', 'error': "rest_path', 'method', and 'user' are required fields", "status": 400}))
            return {
                "status": 400,
                "payload": "rest_path', 'method', and 'user' are required fields",
            }

        # initialize pipeline manager
        if self.manager == None:
            self._initialize_manager(request)

        # /pipelines - list pipelines
        if path == "/pipelines":
            if action == "GET":
                runtime = None
                for param in request.get("query", []):
                    if param[0] == "runtime":
                        runtime = param[1]
                        break

                status, response = self.manager.list_pipelines(runtime)
                return {"status": status, "payload": response}
            log(str({'endpoint':'pipelines','action': 'handle_request', 'error': "Action not supported", "status": 400}))
            return {"status": 400, "payload": "Action not supported"}

        # /pipeline - manipulate individual pipelines
        if action == "GET":
            pipeline_name = None
            for param in request.get("query", []):
                if param[0] == "pipeline_name":
                    pipeline_name = param[1]
                    break

            if not pipeline_name:
                log(str({'endpoint':'pipelines','action': 'handle_request', 'error': '"pipeline_name" query parameter not provided', "status": 400}))
                return {
                    "status": 400,
                    "payload": '"pipeline_name" query parameter not provided',
                }

            status, response = self.manager.read_pipeline(pipeline_name)
            return {
                "payload": response,
                "status": status,
            }

        elif action == "POST" or action == "PUT":
            if "payload" not in request:
                log(str({'endpoint':'pipelines','action': 'handle_request', 'error': 'Missing payload in request', "status": 400}))
                return {"status": 400, "payload": "payload not provided"}

            request_payload = json.loads(request["payload"])
            if "pipeline_name" not in request_payload:
                log(str({'endpoint':'pipelines','action': 'handle_request', 'error': 'Missing "pipeline_name" in payload', "status": 400}))
                return {"status": 400, "payload": '"pipeline_name" not provided'}

            if action == "POST" and "pipeline_def" not in request_payload:
                log(str({'endpoint':'pipelines','action': 'handle_request', 'error': 'Missing "pipeline_def" in payload', "status": 400}))
                return {
                    "status": 400,
                    "payload": "pipeline definition not provided",
                }
            
            pipeline_name = request_payload["pipeline_name"]
            pipeline_def = request_payload["pipeline_def"] if "pipeline_def" in request_payload else None
            description = request_payload["description"] if "description" in request_payload else None
            title = request_payload["title"] if "title" in request_payload else None
            meta = request_payload["meta"] if "meta" in request_payload else None

            if action == "POST":
                runtime = 'edge'
                for param in request.get("query", []):
                    if param[0] == "runtime":
                        runtime = param[1]
                        break
                # create new
                status, message = self.manager.create_pipeline(
                    pipeline_name,
                    runtime,
                    pipeline_def,
                    user,
                    description,
                    title, 
                    meta,
                )
            else:
                # update existing
                status, message = self.manager.update_pipeline(
                    pipeline_name,
                    pipeline_def,
                    user,
                    description,
                    title, 
                    meta,
                )
            return {"status": status, "payload": message}

        elif action == "DELETE":
            pipeline_name = None
            for param in request.get("query", []):
                if param[0] == "pipeline_name":
                    pipeline_name = param[1]
                    break

            if not pipeline_name:
                log(str({'endpoint':'pipelines','action': 'handle_request', 'error': 'Missing "pipeline_name" in payload', "status": 400}))
                return {"status": 400, "payload": '"pipeline_name" not provided'}

            status, message = self.manager.delete_pipeline(pipeline_name)
            return {"status": status, "payload": message}
        log(str({'endpoint':'pipelines','action': 'handle_request', 'error': 'Action not supported', "status": 400}))
        return {"status": 400, "payload": "Action not supported"}

    def handleStream(self, handle, in_string):
        """
        For future use
        """
        raise NotImplementedError("PersistentServerConnectionApplication.handleStream")

    def done(self):
        """
        Virtual method which can be optionally overridden to receive a
        callback after the request completes.
        """
        pass
