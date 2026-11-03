import json
import os
import re
import sys

import requests as http_requests
from splunk.persistconn.application import PersistentServerConnectionApplication

import splunk
import splunk.rest as rest
from requests.status_codes import codes

current_path = os.path.dirname(__file__)
sys.path.append(current_path)
sys.path.append(os.path.abspath(os.path.join(current_path, '..')))
sys.path.append(os.path.abspath(os.path.join(current_path, '..', '..', 'libs')))
from util import o11y_utils
from util.o11y_environment import O11yController, O11yContext

logger = o11y_utils.setup_logger('csc_update')


SPLUNKD_SCS_TOKEN_ENDPOINT = '/services/authorization/scs_tokens'
TENANT_INFO_ENDPOINT = '/services/server/scs/tenantinfo'
SERVER_INFO_ENDPOINT = '/services/server/info/server-info'

USER_INFO_ENDPOINT = '/services/authentication/users/{username}'
CSC_ENDPOINT = 'https://{}/system/environment/v1alpha1/cloudstack-configs/{}'
PRINCIPAL_ID = 'splunkd'
SCS_TOKEN_SCOPE = 'system'
DEFAULT_CLOUD_PROVIDER = "aws"
EMAIL_PATTERN = re.compile(r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
MAX_EMAIL_LENGTH = 254

PROVISIONING_ENDPOINT = (
    'https://app.{realm}.observability.splunkcloud.com/provisioning/freemium-provisioning'
)
# The provisioning API call is synchronous and its own internal timeout is 240s.
# Ours needs to be at least that long, plus a margin so we don't cut it off right
# at the boundary and get a spurious client-side timeout instead of the real response.
PROVISIONING_REQUEST_TIMEOUT_S = 300


SCS_REGION_TO_O11Y_PROD = {
    "iad10": {"awsRegion": "us-east-1",      "o11yRealm": "us0", "physicalLocation": "US East (N.Virginia)"},
    "pdx10": {"awsRegion": "us-west-2",      "o11yRealm": "us1", "physicalLocation": "US West (Oregon)"},
    "dub10": {"awsRegion": "eu-west-1",      "o11yRealm": "eu0", "physicalLocation": "EU (Ireland)"},
    "fra10": {"awsRegion": "eu-central-1",   "o11yRealm": "eu1", "physicalLocation": "EU (Frankfurt)"},
    "lon10": {"awsRegion": "eu-west-2",      "o11yRealm": "eu2", "physicalLocation": "EU (London)"},
    "tyo10": {"awsRegion": "ap-northeast-1", "o11yRealm": "jp0", "physicalLocation": "Asia Pacific (Tokyo)"},
    "syd10": {"awsRegion": "ap-southeast-2", "o11yRealm": "au0", "physicalLocation": "Asia Pacific (Sydney)"},
    "sin10": {"awsRegion": "ap-southeast-1", "o11yRealm": "sg0", "physicalLocation": "Asia Pacific (Singapore)"},
}

SCS_REGION_TO_O11Y_STG = {
    "iad10": {"awsRegion": "us-east-1", "o11yRealm": "lab0", "physicalLocation": "US East (N. Virginia)"},
    "dub10": {"awsRegion": "eu-west-1", "o11yRealm": "rc0",  "physicalLocation": "EU (Ireland)"},
}


STAGING_HOSTNAME = 'api.staging.scs.splunk.com'


class SplunkdEndpointNotFound(Exception):
    """Raised when a required Splunkd endpoint is not available in this environment (HTTP 404)."""


class CloudStackConfigHandler(O11yController, PersistentServerConnectionApplication):

    def __init__(self, _, __):
        super(PersistentServerConnectionApplication, self).__init__()
        self._tenant_data = None
        self._cloud_stack = None
        self._scs_token = None
        # Request-scoped: set at the top of handle_request and cleared in
        # the finally block. Do NOT read this outside a request lifecycle.
        self._session_key = None

    def _is_cloud_stack(self):
        if self._cloud_stack is not None:
            return self._cloud_stack

        try:
            params = {"output_mode": "json", "principalId": PRINCIPAL_ID, "scope": SCS_TOKEN_SCOPE}
            response, content = rest.simpleRequest(
                SPLUNKD_SCS_TOKEN_ENDPOINT,
                getargs=params,
                sessionKey=self._session_key)
            self._cloud_stack = response.status != codes.not_found
            # Cache the token from this response to avoid a duplicate request in get_scs_token
            if self._cloud_stack and response.status == codes.ok and content:
                payload = json.loads(content) if isinstance(content, bytes) else json.loads(content)
                self._scs_token = payload.get("entry", [{}])[0].get("content", {}).get("scs_token")
        except splunk.ResourceNotFound:
            self._cloud_stack = False

        return self._cloud_stack

    def _is_staging(self):
        tenant_info = self.get_tenant_info() or {}
        logger.info(
            "_is_staging: globalHostname=%s STAGING_HOSTNAME=%s",
            tenant_info.get('globalHostname'),
            STAGING_HOSTNAME,
        )
        return tenant_info.get('globalHostname') == STAGING_HOSTNAME

    def _resolve_region(self, scs_region):
        if not scs_region:
            return None
        is_staging = self._is_staging()
        table = SCS_REGION_TO_O11Y_STG if is_staging else SCS_REGION_TO_O11Y_PROD
        info = table.get(scs_region)
        if not info:
            logger.warning(
                "Unrecognized SCS region in CSC config: %s (is_staging=%s)",
                scs_region, is_staging,
            )
            return None
        return dict(info, scsRegion=scs_region)

    def get_server_info(self):
        response, content = rest.simpleRequest(
            SERVER_INFO_ENDPOINT, sessionKey=self._session_key, getargs={"output_mode": "json"}
        )
        if response.status != codes.ok:
            logger.error("Failed to get server info. status=%s", response.status)
            return None
        if isinstance(content, bytes):
            content = content.decode('utf-8')
        payload = json.loads(content)
        server_name = payload.get("entry", [{}])[0].get("content", {}).get("serverName")
        if not server_name:
            logger.info("There was no server name found for this stack")
            return None
        server_name = re.sub(r"^sh-i-[0-9a-fA-F]+\.", "", server_name)

        logger.info("The server name is %s", server_name)
        return server_name

    def get_tenant_info(self, refresh=False):
        if not refresh and self._tenant_data:
            return self._tenant_data

        if not self._is_cloud_stack():
            logger.info("Not a cloud stack, cannot get tenantinfo")
            raise SplunkdEndpointNotFound("Stack is not a cloud stack")

        try:
            response, content = rest.simpleRequest(
                TENANT_INFO_ENDPOINT,
                getargs={"output_mode": "json"},
                sessionKey=self._session_key)
        except splunk.ResourceNotFound:
            logger.error("tenantinfo endpoint not found")
            raise SplunkdEndpointNotFound("tenantinfo endpoint not found: {}".format(TENANT_INFO_ENDPOINT))

        if response.status != codes.ok:
            logger.error("Failed to get tenant info. status=%s", response.status)
            return None

        if isinstance(content, bytes):
            content = content.decode('utf-8')
        self._tenant_data = json.loads(content)["entry"][0]["content"]
        return self._tenant_data

    def get_scs_token(self):
        # Return cached token if available from _is_cloud_stack
        if self._scs_token:
            return self._scs_token

        try:
            params = {"output_mode": "json", "principalId": PRINCIPAL_ID, "scope": SCS_TOKEN_SCOPE}
            response, content = rest.simpleRequest(
                SPLUNKD_SCS_TOKEN_ENDPOINT,
                getargs=params,
                sessionKey=self._session_key)
        except splunk.ResourceNotFound:
            logger.error("scs_tokens endpoint not found")
            raise SplunkdEndpointNotFound("scs_tokens endpoint not found: {}".format(SPLUNKD_SCS_TOKEN_ENDPOINT))

        if response.status >= 500:
            logger.error("SCS Token service error. status=%s", response.status)
            return None

        payload = json.loads(content) if content else {}
        self._scs_token = payload.get("entry", [{}])[0].get("content", {}).get("scs_token")
        if not self._scs_token:
            logger.error("scs_token not found in response")
        return self._scs_token

    def csc_config(self):
        tenant_info = self.get_tenant_info()
        if not tenant_info:
            return None

        region_hostname = tenant_info.get('regionHostname')
        cloud_stack = tenant_info.get('cloudStack')
        if not region_hostname or not cloud_stack:
            logger.error("Missing regionHostname or cloudStack in tenant info")
            return None

        token = self.get_scs_token()
        if not token:
            return None

        csc_url = CSC_ENDPOINT.format(region_hostname, cloud_stack)

        logger.info("Requesting CSC config from %s", csc_url)
        response = http_requests.get(
            csc_url,
            headers={
                'Authorization': 'Bearer {}'.format(token),
                'Content-Type': 'application/json',
            },
            timeout=30,
        )
        logger.info("CSC config response status=%s body=%s", response.status_code, response.text)

        if response.status_code == 401:
            logger.info("CSC token expired, refreshing and retrying")
            self._scs_token = None
            token = self.get_scs_token()
            if not token:
                return None
            response = http_requests.get(
                csc_url,
                headers={
                    'Authorization': 'Bearer {}'.format(token),
                    'Content-Type': 'application/json',
                },
                timeout=30,
            )
            logger.info("CSC config retry response status=%s body=%s", response.status_code, response.text)

        if response.status_code == 404:
            raise SplunkdEndpointNotFound("CSC config endpoint not found: {}".format(csc_url))

        response.raise_for_status()
        return response.json()

    def get_user_info(self, username='unknown'):
        try:
            response, content = rest.simpleRequest(
                USER_INFO_ENDPOINT.format(username=username),
                getargs={"output_mode": "json"},
                sessionKey=self._session_key)
        except splunk.ResourceNotFound:
            logger.error("User info endpoint not found")
            return None

        if response.status != codes.ok:
            logger.error("Failed to get user info. status=%s", response.status)
            return None

        if isinstance(content, bytes):
            content = content.decode('utf-8')
        return json.loads(content)["entry"][0]["content"]

    def get_provisioning_endpoint(self, realm):
        return PROVISIONING_ENDPOINT.format(realm=realm)

    def handle_new_pairing(self, o11y_context: O11yContext) -> dict:
        logger.info("Handling new CSC pairing")
        request = o11y_context.request
        session = request.get('session', {})

        if not o11y_utils.is_user_admin(o11y_context, request):
            username = session.get('user', 'unknown')
            logger.warning("Unauthorized provisioning attempt by user: %s", username)
            return {"status": codes.forbidden, "payload": {"error": "Unauthorized"}}

        try:
            config = self.csc_config() or {}
        except http_requests.exceptions.Timeout:
            logger.error("CSC config request timed out during pairing")
            return {"status": codes.gateway_timeout, "payload": {"error": "Request to CSC endpoint timed out"}}
        except http_requests.exceptions.ConnectionError:
            logger.error("CSC config connection error during pairing")
            return {"status": codes.service_unavailable, "payload": {"error": "Unable to connect to CSC endpoint"}}
        except SplunkdEndpointNotFound as e:
            logger.error("Endpoint not found during pairing: %s", e)
            return {"status": codes.not_found, "payload": {"error": "Not Found"}}
        except (http_requests.exceptions.RequestException, ValueError) as e:
            logger.error("CSC config request failed during pairing: %s", e)
            return {"status": codes.internal_server_error, "payload": {"error": "Failed to fetch CSC config"}}

        if config.get("o11yPairings"):
            logger.warning("Provisioning rejected: organization already paired")
            return {
                "status": codes.conflict,
                "payload": {
                    "error": "An Observability Cloud organization is already paired with this Splunk Cloud stack."
                },
            }

        region_info = self._resolve_region(config.get("region"))
        if region_info is None:
            logger.error(
                "Provisioning rejected: unable to resolve O11y region for SCS region=%s",
                config.get("region"),
            )
            return {
                "status": codes.bad_request,
                "payload": {
                    "error": "Unable to resolve Observability region for this Splunk Cloud stack."
                },
            }

        try:
            user_info = self.get_user_info(session.get('user', 'unknown'))
            if not user_info:
                logger.error("Failed to get user info for provisioning")
                return {"status": codes.internal_server_error, "payload": {"error": "Failed to get user info"}}
        except Exception as e:
            logger.error("Error fetching user info for provisioning: %s", e)
            return {"status": codes.internal_server_error, "payload": {"error": "Failed to get user info"}}

        tenant_info = self.get_tenant_info() or {}
        cloud_stack = (
            config.get('cloudStack') or config.get('tenant') or tenant_info.get('cloudStack', '')
        )
        input_payload = json.loads(request.get('payload', '{}'))
        ec_token = (input_payload.get('ecAccessToken') or '').strip()
        if not ec_token:
            logger.error("Missing ecAccessToken in request payload")
            return {"status": codes.unauthorized, "payload": {"error": "Unauthorized"}}

        org_name = input_payload.get('orgName', cloud_stack)
        raw_email = input_payload.get('email')
        email = raw_email.strip() if isinstance(raw_email, str) else ''
        if len(email) > MAX_EMAIL_LENGTH or not EMAIL_PATTERN.fullmatch(email):
            logger.warning(
                "Provisioning rejected: invalid email address user=%s",
                session.get('user', 'unknown'),
            )
            return {
                "status": codes.bad_request,
                "payload": {
                    "error": "A valid email address is required to provision an organization."
                },
            }

        name_parts = (
            (user_info.get('realname') or '').strip() or email.partition('@')[0]
        ).split(None, 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) == 2 else first_name

        cloud_provider = config.get('cloudProvider', DEFAULT_CLOUD_PROVIDER).upper()

        payload = {
            'organizationName': org_name,
            'email': email,
            'firstName': first_name,
            'lastName': last_name,
            'cloudProvider': cloud_provider,
            'ecRegion': config.get('region'),
        }

        headers = {
            'x-ec-access-token': ec_token,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }

        provisioning_url = self.get_provisioning_endpoint(region_info['o11yRealm'])
        logger.info("Submitting provisioning request url=%s stack=%s",
                    provisioning_url, cloud_stack)
        try:
            response = http_requests.post(
                provisioning_url, headers=headers, json=payload, timeout=PROVISIONING_REQUEST_TIMEOUT_S,
            )
            logger.info("Provisioning response status=%s", response.status_code)
            response.raise_for_status()
            return {
                "status": response.status_code,
                "payload": response.json() if response.content else {}
            }
        except http_requests.exceptions.RequestException as e:
            logger.error("Provisioning request failed stack=%s error=%s", cloud_stack, e)
            return {
                "status": codes.internal_server_error,
                "payload": {"error": "Provisioning request failed"}
            }

    def handle_request(self, o11y_context: O11yContext, request: dict) -> dict:
        session_key = getattr(o11y_context, 'auth_token', None)
        if not session_key:
            return {"status": codes.unauthorized, "payload": {"error": "Missing authentication token"}}

        self._session_key = session_key

        try:
            try:
                if (o11y_context.request.get('method') or '').upper() == 'POST':
                    return self.handle_new_pairing(o11y_context)

                try:
                    csc_payload = self.csc_config()
                except http_requests.exceptions.Timeout:
                    logger.error("CSC config request timed out")
                    return {"status": codes.gateway_timeout, "payload": {"error": "Request to CSC endpoint timed out"}}
                except http_requests.exceptions.ConnectionError:
                    logger.error("CSC config connection error")
                    return {
                        "status": codes.service_unavailable,
                        "payload": {"error": "Unable to connect to CSC endpoint"},
                    }
                except SplunkdEndpointNotFound as e:
                    logger.error("Endpoint not found: %s", e)
                    return {"status": codes.not_found, "payload": {"error": "Not Found"}}
                except (http_requests.exceptions.RequestException, ValueError) as e:
                    logger.error("CSC config request failed: %s", e)
                    return {"status": codes.internal_server_error, "payload": {"error": "Failed to fetch CSC config"}}

                if csc_payload is None:
                    return {"status": codes.internal_server_error, "payload": {"error": "Failed to get CSC config"}}

                o11y_pairings = csc_payload.get("o11yPairings")
                if not isinstance(o11y_pairings, list):
                    o11y_pairings = []

                paired_realms = list({
                    p.get("realm")
                    for p in o11y_pairings
                    if isinstance(p, dict) and p.get("realm")
                })
            except Exception as e:
                logger.error("Error handling CSC config request: %s", e)
                return {"status": codes.internal_server_error, "payload": {"error": "An unexpected error occurred"}}

            region = self._resolve_region(csc_payload.get("region"))

            return {
                "status": codes.ok,
                "payload": {
                    "o11yPairings": o11y_pairings,
                    "pairedO11yRealms": paired_realms,
                    "splunkVersion": csc_payload.get("splunkVersion", "unknown"),
                    "region": region,
                },
            }
        finally:
            self._session_key = None
