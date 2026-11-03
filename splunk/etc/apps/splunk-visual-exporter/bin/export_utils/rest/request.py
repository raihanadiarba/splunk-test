
from dataclasses import dataclass
import json

@dataclass
class HTTPRequest:
    method: str
    form: dict
    query: dict
    
def flatten_query_params(params):
    flattened = {}
    for i, j in params:
        item = flattened.get(i)
        if item:
            if isinstance(item, list):
                flattened[i].append(j)
            else:
                flattened[i] = [item, j]
        else:
            flattened[i] = j
    return flattened

def build_request(splunk_request_string: str) -> HTTPRequest:
    splunk_request = json.loads(splunk_request_string)
    method = splunk_request['method'] if 'method' in splunk_request else 'GET'
    form = flatten_query_params(splunk_request['form']) if 'form' in splunk_request else {}
    query = flatten_query_params(splunk_request['query']) if 'query' in splunk_request else {}
    return HTTPRequest(method, form, query)