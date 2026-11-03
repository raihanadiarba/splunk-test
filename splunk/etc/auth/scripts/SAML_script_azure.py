from commonAuth import *
logger = getLogger("{}/splunk_scripted_authentication_azure.log".format(logPath), "azure")

if sys.version_info < (3,0):
    logger.error("Python 2 has been deprecated. Use Python 3 to execute this script instead.")

import requests
import json
from urllib.parse import quote


# This is for getting SAML user information, it is an alternative to using SAML attribute
# query requests (AQR) which Azure AD does not support.
#
# Provide Azure application credentials in the authentication.conf file or
# using the Splunk Web UI
# (Settings > Authentication Methods > SAML Configuration > Authentication Extensions)
# and use the Azure API to extract user information.
#
# In authentication.conf, configure the 'scriptSecureArguments' setting with
# semicolon-delimited Azure credentials:
# clientId:<your client id>;tenantId:<your tenant id>;clientSecret:<your client secret>
#
# For Azure national clouds, add 'azureCloud' to the same
# semicolon-delimited scriptSecureArguments value. Supported values are:
# public, gcchigh, and dod.
#
# After you restart the Splunk platform, the platform encrypts your Azure credentials.
# For more information about Splunk platform configuration files, search the
# Splunk documentation for "about configuration files".
#
# In Splunk Web UI under Authentication Extensions > Script Secure Arguments:
# key = clientId, value = <your client id>
# key = tenantId, value = <your tenant id>
# key = clientSecret, value = <your client secret>
# key = azureCloud, value = <public|gcchigh|dod>

CLIENT_CREDENTIALS = 'client_credentials'
AZURE_CLOUD = 'azureCloud'
AZURE_USER_FILTER = 'azureUserFilter'
ENCODE_OUTPUT = 'encodeOutput'
GROUP_TYPE = 'groupType'
GROUP_SEARCH_FILTER = 'groupSearchFilter'
GROUP_ATTRIBUTE = 'groupAttribute'
SERVICE_PRINCIPAL_ID = 'servicePrincipalId'
REQUIRE_SP_GROUP_MAP = 'requireSPGroupMap'
LOG_LEVEL = 'logLevel'
# create persistent connection
session = requests.Session()
request_timeout = DEFAULT_REQUEST_TIMEOUT
errMsg = ""

PUBLIC_AZURE_CLOUD = 'public'
GCC_HIGH_AZURE_CLOUD = 'gcchigh'
DOD_AZURE_CLOUD = 'dod'

AZURE_CLOUD_CONFIGS = {
    PUBLIC_AZURE_CLOUD: {
        'loginEndpoint': 'https://login.microsoftonline.com/',
        'userEndpoint': 'https://graph.microsoft.com/v1.0/users/',
        'servicePrincipalEndpoint': 'https://graph.microsoft.com/v1.0/servicePrincipals/',
        'graphScope': 'https://graph.microsoft.com/.default',
        'graphHost': 'graph.microsoft.com',
    },
    GCC_HIGH_AZURE_CLOUD: {
        'loginEndpoint': 'https://login.microsoftonline.us/',
        'userEndpoint': 'https://graph.microsoft.us/v1.0/users/',
        'servicePrincipalEndpoint': 'https://graph.microsoft.us/v1.0/servicePrincipals/',
        'graphScope': 'https://graph.microsoft.us/.default',
        'graphHost': 'graph.microsoft.us',
    },
    DOD_AZURE_CLOUD: {
        'loginEndpoint': 'https://login.microsoftonline.us/',
        'userEndpoint': 'https://dod-graph.microsoft.us/v1.0/users/',
        'servicePrincipalEndpoint': 'https://dod-graph.microsoft.us/v1.0/servicePrincipals/',
        'graphScope': 'https://dod-graph.microsoft.us/.default',
        'graphHost': 'dod-graph.microsoft.us',
    },
}

SUPPORTED_AZURE_CLOUDS = ', '.join(
    [PUBLIC_AZURE_CLOUD, GCC_HIGH_AZURE_CLOUD, DOD_AZURE_CLOUD]
)


def getAzureCloudConfig(args, logger) -> tuple[Optional[dict], Optional[str]]:
    azureCloud = args.get(AZURE_CLOUD, PUBLIC_AZURE_CLOUD).strip()
    azureCloudKey = azureCloud.lower()
    if azureCloudKey not in AZURE_CLOUD_CONFIGS:
        errMsg = "Unsupported azureCloud='{}'. Supported values are: {}".format(
            azureCloud, SUPPORTED_AZURE_CLOUDS
        )
        logger.error(errMsg)
        return None, FAILED + " " + ERROR_MSG + errMsg

    return AZURE_CLOUD_CONFIGS[azureCloudKey], None


def getGraphHeaders(
    apiKey, azureCloudConfig=AZURE_CLOUD_CONFIGS[PUBLIC_AZURE_CLOUD]
):
    return {
        'Host': azureCloudConfig['graphHost'],
        'Authorization': 'Bearer ' + apiKey,
    }


def getAuthToken(
    tenantId,
    clientId,
    clientSecret,
    logger,
    azureCloudConfig=AZURE_CLOUD_CONFIGS[PUBLIC_AZURE_CLOUD],
) -> tuple[Optional[str], Optional[str]]:
    tokenEndpoint = azureCloudConfig['loginEndpoint'] + tenantId + "/oauth2/v2.0/token"  # To Generate OAuth2 Token

    # Retrieve Auth Token from Azure
    body = {
            'grant_type': CLIENT_CREDENTIALS,
            'scope': azureCloudConfig['graphScope'],
            'client_id': clientId,
            'client_secret': clientSecret
             }

    logger.info("Requesting Authorization Token for client={} and tenant={}, with timeout={}".format(clientId, tenantId, request_timeout))

    try:
        auth_response = session.post(tokenEndpoint, data=body, timeout=request_timeout)
    except requests.exceptions.Timeout:
        errMsg = "Timeout occurred when requesting authorization token for client={} and tenant={}".format(clientId, tenantId)
        logger.error(errMsg)
        return None, FAILED + " " + ERROR_MSG + errMsg

    if auth_response.status_code != 200:
        errMsg = "Failed to get authorization token for client={} tenant={} with status={} and response={}".format(clientId, tenantId, auth_response.status_code, auth_response.text)
        logger.error(errMsg)
        if auth_response.status_code == 400:
            errMsg = "It appears your clientId and/or tenantId are incorrect. " \
                "Search the Microsoft documentation to retrieve those values: " \
                "\"Create an Azure AD app & service principal in the portal - Microsoft identity platform\" " \
                "/ \"Get tenant and app ID values for signing in\""
            logger.warning(errMsg)
        elif auth_response.status_code == 401:
            errMsg = "It appears your clientSecret is incorrect. " \
                "Search the Microsoft documentation to retrieve that value: " \
                "\"Create an Azure AD app & service principal in the portal - Microsoft identity platform\" " \
                "/ \"Option 2: Create a new application secret\""
            logger.warning(errMsg)
        return None, FAILED + " " + ERROR_MSG + errMsg

    try:
        auth_responseSTR = json.loads(auth_response.text)
    except Exception as e:
        errMsg = "Failed to parse authorization token for client={} with error={}".format(clientId, str(e))
        logger.error(errMsg)
        return None, FAILED + " " + ERROR_MSG + errMsg
    return auth_responseSTR['access_token'], None

# If azureUserFilter is set and API did not find a user, always fall back to filter by mail
def getPrincipalNameWithMail(
    username,
    logger,
    azureCloudConfig=AZURE_CLOUD_CONFIGS[PUBLIC_AZURE_CLOUD],
):
    query = "mail eq \'{}\'".format(username.replace("'", "''"))
    filterUrl = '?$filter=' + quote(query)
    usernameFilterUrl = azureCloudConfig['userEndpoint'] + filterUrl
    
    try:
        usernameFilterResponse = session.get(usernameFilterUrl, timeout=request_timeout)
    except requests.exceptions.Timeout:
        errMsg = "Timeout occurred when requesting principal name for username={} when defaulting to filtering by mail".format(username)
        logger.error(errMsg)
        return FAILED + " " + ERROR_MSG + errMsg 

    if usernameFilterResponse.status_code == 200:
        try:
            filterValues = json.loads(usernameFilterResponse.text)
        except Exception as e:
            logger.error("Failed to parse principal name for username={} when defaulting to filtering by mail with error={}".format(username, str(e)))
            return ""

        # API will return 200 even if the user doesn't exist
        if len(filterValues['value']) == 0:
            logger.warning("Empty response returned for principal name for username={} when defaulting to filtering by mail".format(username))
            return ""
        if len(filterValues['value']) > 1:
            logger.error("Found more than one entry when getting principal name for username={} when defaulting to filtering by mail".format(username))
            return ""
        logger.info("Found principal name for username={} when defaulting to filtering by mail: {}".format(username, filterValues['value'][0]['userPrincipalName']))
        return filterValues['value'][0]['userPrincipalName']
    else:
        logger.error("Failed to get principal name for username={} when defaulting to filtering by mail with status={} and response={}".format(username, filterBy, usernameFilterResponse.status_code, usernameFilterResponse.text))
        return ""

# Microsoft graph API can only query information with user's principal name or object id
# This function makes another API call to get the user's principal name
# from their email or a user supplied filter argument
def getPrincipalName(
    username,
    logger,
    filterBy,
    azureCloudConfig=AZURE_CLOUD_CONFIGS[PUBLIC_AZURE_CLOUD],
):
    if not username:
        errMsg = "Username is empty. Not executing API call"
        logger.error(errMsg)
        return FAILED + " " + ERROR_MSG + errMsg

    logger.info("Requesting principal name for username={} through filtering by {}".format(username, filterBy))

    query = "{} eq \'{}\'".format(filterBy, username.replace("'", "''"))
    filterUrl = "?$filter=" + quote(query) + "&$count=true"
    usernameFilterUrl = azureCloudConfig['userEndpoint'] + filterUrl
    logger.debug("Azure filter url is {}".format(usernameFilterUrl))
    session.headers.update({"ConsistencyLevel": "eventual"})
    try:
        usernameFilterResponse = session.get(usernameFilterUrl, timeout=request_timeout)
    except requests.exceptions.Timeout:
        errMsg = "Timeout occurred when requesting principal name for username={} through filtering by {}".format(username, filterBy)
        logger.error(errMsg)
        return FAILED + " " + ERROR_MSG + errMsg

    if usernameFilterResponse.status_code != 200:
        if usernameFilterResponse.status_code == 403:
            logger.error(usernameFilterResponse.text)
            errMsg = "You do not have sufficient API privileges. Refer to the Splunk documentation to set API privileges for your Azure AD application"
            logger.warning(errMsg)
        else:
            logger.error("Failed to get principal name for username={} through filtering by {} with status={} and response={}".format(username, filterBy, usernameFilterResponse.status_code, usernameFilterResponse.text))
            errMsg = "You might be trying to use a filter property that does not exist. " \
                "Search the Microsoft documentation for a full list of supported properties: " \
                "\"user resource type - Microsoft Graph v1.0\" / \"Properties\""
            logger.warning(errMsg)
        return FAILED + " " + ERROR_MSG + errMsg

    try:
        filterValues = json.loads(usernameFilterResponse.text)
    except Exception as e:
        errMsg = "Failed to parse principal name for username={} with error={}".format(username, str(e))
        logger.error(errMsg)
        return FAILED + " " + ERROR_MSG + errMsg

    # API will return 200 even if the user doesn't exist
    if len(filterValues['value']) == 0:
        logger.warning("Empty response returned for principal name for username={} when filtering by {}. "
            "This could mean either we are already using the principal name, we are filtering by the wrong property, or the user doesn't exist".format(username, filterBy))
        # As a failsafe, always try to filter by mail if cannot find by azureUserFilter
        if filterBy.lower() != "mail": # except when we're already filtering by mail
            logger.info("Trying to get user info for username={} by defaulting to filtering by mail instead".format(username))
            return getPrincipalNameWithMail(username, logger, azureCloudConfig)
        return ""

    if len(filterValues['value']) > 1:
        errMsg = "Found more than one entry when getting principal name for username={} when filtering by {}".format(username, filterBy)
        logger.error(errMsg)
        return FAILED + " " + ERROR_MSG + errMsg

    logger.info("Found principal name for username={}: {}".format(username, filterValues['value'][0]['userPrincipalName']))
    return filterValues['value'][0]['userPrincipalName']

# Only return groups that are part of the Azure service principal
# First make an API call to get the appRoleAssignments for the Azure service principal
# Then get the intersection of of the assigned groups and the groups the user is a member of
# The final group attribute returned is user-configurable
def getGroupsForUser(
    args,
    logger,
    username,
    azureCloudConfig=AZURE_CLOUD_CONFIGS[PUBLIC_AZURE_CLOUD],
):
    allGroups = []
    groupIdToAttributeMap = {}
    groupAttributeKey = 'id'

    # Construct a groups endpoint with the user's object ID
    groupsUrl = azureCloudConfig['userEndpoint'] + quote(username)
    groupsUrl += '/transitiveMemberOf/microsoft.graph.group?$top=999' # transitiveMemberOf gives us both direct and transitive memberships

    if GROUP_SEARCH_FILTER in args:
        groupsUrl += '&' + args[GROUP_SEARCH_FILTER]
        session.headers.update({'ConsistencyLevel': 'eventual'})

    while groupsUrl:
        logger.debug("Full API call to get groups info: {}".format(groupsUrl))
        
        try:
            groupsResponse = session.get(groupsUrl, timeout=request_timeout)
        except requests.exceptions.Timeout:
            errMsg = "Timeout occurred when requesting groups info for username={}".format(username)
            logger.error(errMsg)
            return FAILED + " " + ERROR_MSG + errMsg
        
        if groupsResponse.status_code != 200:
            errMsg = "Failed to get user group membership for username={} with status={} and response={}".format(username, groupsResponse.status_code, groupsResponse.text)
            logger.error(errMsg)
            return FAILED + " " + ERROR_MSG + errMsg

        try:
            groupsResponseSTR = json.loads(groupsResponse.text)
        except Exception as e:
            errMsg = "Failed to parse user groups response for username={} with error={}".format(username, str(e))
            logger.error(errMsg)
            return FAILED + " " + ERROR_MSG + errMsg

        if groupsResponseSTR['value']:
            for group in groupsResponseSTR['value']:
                groupIdToAttributeMap[group['id']] = group
            if '@odata.nextLink' in groupsResponseSTR:
                groupsUrl = groupsResponseSTR['@odata.nextLink']
            else:
                groupsUrl = None
        else:
            errMsg = "Failed to find user groups in response for username={}".format(username)
            logger.error(errMsg)
            return FAILED + " " + ERROR_MSG + errMsg

    if GROUP_ATTRIBUTE in args:
        groupAttributeKey = args[GROUP_ATTRIBUTE]
        logger.info("Custom group attribute was specified. Returning \'{}\' instead of group Id".format(groupAttributeKey))

    try:
        logger.debug("{} group(s) found: {}".format(len(groupIdToAttributeMap), [groupIdToAttributeMap[group][groupAttributeKey] for group in groupIdToAttributeMap.keys()]))
    except KeyError as e:
        errMsg = "Failed to find custom group attribute \'{}\' in groups API response".format(groupAttributeKey)
        logger.error(errMsg)
        return FAILED + " " + ERROR_MSG + errMsg

    if SERVICE_PRINCIPAL_ID in args:
        appRoleAssignments = getAppRoleAssignments(
            args[SERVICE_PRINCIPAL_ID], logger, azureCloudConfig
        )
        groupsIntersection = list(set(groupIdToAttributeMap.keys()).intersection(appRoleAssignments))
        logger.debug("{} group(s) found that are in the intersection of user's group membership and Azure service principal: {}".format(len(groupsIntersection), groupsIntersection))

        if REQUIRE_SP_GROUP_MAP in args and args[REQUIRE_SP_GROUP_MAP].lower() == "true":
            if len(groupsIntersection) == 0:
                logger.warning("No matching groups found in the intersection of user's group membership and Azure service principal. Not returning any groups")
            groups = groupsIntersection # empty list if no match
        else:
            if len(groupsIntersection) == 0: # if groupIntersections is empty, then just return the full list of groups we found
                logger.warning("No matching groups found in the intersection of user's group membership and Azure service principal. Returning full list of group membership")
                groups = groupIdToAttributeMap.keys()
            else: # found groups in intersection, just return intersection for optimization
                groups = groupsIntersection
    else: # preserve backwards compatiblity when SP ID arg is not used, return full list of groups we found
        groups = groupIdToAttributeMap.keys()

    allGroups = [groupIdToAttributeMap[group][groupAttributeKey] for group in groups]
    logger.info("Found {} group(s) that username={} belongs to".format(len(allGroups), username))
    logger.debug("Returning username={} list of groups={}".format(username, allGroups))

    if ENCODE_OUTPUT in args and args[ENCODE_OUTPUT].lower() == 'false':
        return allGroups
    return [urlsafe_b64encode_to_str(group) for group in allGroups]

def getAppRoleAssignments(
    servicePrincipalId,
    logger,
    azureCloudConfig=AZURE_CLOUD_CONFIGS[PUBLIC_AZURE_CLOUD],
):
    allAssignedAppRoles = []
    appRolesAssignmentUrl = (
        azureCloudConfig['servicePrincipalEndpoint']
        + servicePrincipalId
        + '/appRoleAssignedTo?$top=999'
    )
    while appRolesAssignmentUrl:
        logger.debug("Full API call to get Azure service principal's appRolesAssignment info: {}".format(appRolesAssignmentUrl))
        
        try:
            appRolesAssignmentResponse = session.get(appRolesAssignmentUrl, timeout=request_timeout)
        except requests.exceptions.Timeout:
            errMsg = "Timeout occurred when requesting appRoleAssignments for service principal={}".format(servicePrincipalId)
            logger.error(errMsg)
            return allAssignedAppRoles
        
        if appRolesAssignmentResponse.status_code != 200:
            errMsg = "Failed to get appRoleAssigments for service principal={} with status={} and response={}".format(servicePrincipalId, appRolesAssignmentResponse.status_code, appRolesAssignmentResponse.text)
            logger.error(errMsg)
            return allAssignedAppRoles

        try:
            appRolesAssignmentSTR = json.loads(appRolesAssignmentResponse.text)
        except Exception as e:
            errMsg = "Failed to parse appRolesAssignment response for service principal={} with error={}".format(servicePrincipalId, str(e))
            logger.error(errMsg)
            return allAssignedAppRoles

        if appRolesAssignmentSTR['value']:
            allAssignedAppRoles.extend([
                appRole['principalId'] for appRole in appRolesAssignmentSTR['value']
                if appRole['principalType'] == "Group"
            ])
            if '@odata.nextLink' in appRolesAssignmentSTR:
                appRolesAssignmentUrl = appRolesAssignmentSTR['@odata.nextLink']
            else:
                appRolesAssignmentUrl = None
        else:
            errMsg = "Failed to find appRoleAssignments in response for service principal={}".format(servicePrincipalId)
            logger.error(errMsg)
            return allAssignedAppRoles

    logger.debug("{} appRoleAssignment(s) found of principalType=Group. Group Ids: {}".format(len(allAssignedAppRoles), allAssignedAppRoles))
    return allAssignedAppRoles

def getUserInfo(
    args,
    logger,
    username,
    azureCloudConfig=AZURE_CLOUD_CONFIGS[PUBLIC_AZURE_CLOUD],
):
    # Construct script response with the original username since 
    # we might be using a different username to get user info
    originalUsername = args['username']
    realNameString = ''
    fullString = ''
    rolesString = ''
    emailString = ''

    # all these fields exist in the default response (without select)
    # apart from accountEnabled; this script also has to check for that
    # so we append all the default fields + accountEnabled
    usernameUrl = (
        azureCloudConfig['userEndpoint']
        + quote(username)
        + '?$select=businessPhones,displayName,givenName,jobTitle,mail,'
        + 'mobilePhone,officeLocation,preferredLanguage,surname,'
        + 'userPrincipalName,id,accountEnabled'
    )

    try:
        usernameResponse = session.get(usernameUrl, timeout=request_timeout)
    except requests.exceptions.Timeout:
        errMsg = "Timeout occurred when requesting user info for username={}".format(originalUsername)
        logger.error(errMsg)
        return FAILED + " " + ERROR_MSG + errMsg

    if usernameResponse.status_code != 200:
        errMsg = "Failed to get user info for username={} with status={} and response={}".format(originalUsername, usernameResponse.status_code, usernameResponse.text)
        logger.error(errMsg)
        if usernameResponse.status_code == 404:
            errMsg = "User not found. Unable to get user info for username={}. " \
                "This script only officially supports querying usernames by the User Principal Name, User ID, or Email properties. " \
                "To use other user properties, use the 'azureUserFilter' argument and search the Microsoft documentation for a full list of properties: " \
                "\"user resource type - Microsoft Graph v1.0\" / \"Properties\"".format(username)
            logger.warning(errMsg)
        return FAILED + " " + ERROR_MSG + errMsg

    try:
        nameAttributes = json.loads(usernameResponse.text)
    except Exception as e:
        errMsg = "Failed to parse user info for username={} with error={}".format(username, str(e))
        logger.error(errMsg)
        return FAILED + " " + ERROR_MSG + errMsg

    if not nameAttributes.get('accountEnabled', True):
        errMsg = "User account is disabled for username={}".format(originalUsername)
        logger.warning(errMsg)
        return FAILED + " " + ERROR_MSG + errMsg

    if nameAttributes.get('displayName'):
        realNameString += nameAttributes['displayName']
        logger.info("Real name found: {}".format(realNameString))
    if nameAttributes.get('mail'):
        emailString += nameAttributes['mail']
        logger.info("Email found: {}".format(emailString))

    foundGroups = getGroupsForUser(args, logger, username, azureCloudConfig)
    if FAILED in foundGroups:
        return foundGroups
    rolesString += ":".join(foundGroups)

    encodeOutput = True # default to always encode unless specified in args
    if ENCODE_OUTPUT in args and args[ENCODE_OUTPUT].lower() == 'false':
        encodeOutput = False

    if encodeOutput:
        logger.debug("base64 encoding script output for function=getUserInfo()")
        base64UrlEncodedUsername = urlsafe_b64encode_to_str(originalUsername)
        base64UrlEncodedRealName = urlsafe_b64encode_to_str(realNameString)
        base64UrlEncodedEmail = urlsafe_b64encode_to_str(emailString)
        fullString += '{} --userInfo={};{};{};{} --encodedOutput=true'.format(SUCCESS, base64UrlEncodedUsername, base64UrlEncodedRealName, rolesString, base64UrlEncodedEmail)
    else:
        logger.debug("Not base64 encoding script output for function=getUserInfo()")
        fullString += '{} --userInfo={};{};{};{}'.format(SUCCESS, originalUsername, realNameString, rolesString, emailString)

    logger.info("function=getUserInfo() successful for username={}".format(originalUsername))
    return fullString

def login(
    args,
    logger,
    username,
    azureCloudConfig=AZURE_CLOUD_CONFIGS[PUBLIC_AZURE_CLOUD],
):
    fullString = ''
    rolesString = ''

    foundGroups = getGroupsForUser(args, logger, username, azureCloudConfig)
    if FAILED in foundGroups:
        return foundGroups
    for i in range(len(foundGroups)):
        rolesString += '--groups={} '.format(foundGroups[i])

    encodeOutput = True # default to always encode unless specified in args
    if ENCODE_OUTPUT in args and args[ENCODE_OUTPUT].lower() == 'false':
        encodeOutput = False

    if encodeOutput:
        logger.debug("base64 encoding script output for function=login()")
        fullString += '{} {} --encodedOutput=true'.format(SUCCESS, rolesString)
    else:
        logger.debug("Not base64 encoding script output for function=login()")
        fullString += '{} {}'.format(SUCCESS, rolesString)

    logger.info("function=login() successful for username={}".format(args['userInfo'].split(';')[0]))
    return fullString

if __name__ == "__main__":
    callName = sys.argv[1]
    dictIn = readInputs()
    request_timeout, warningMsg = getRequestTimeout(dictIn)
    if warningMsg is not None:
        logger.warning(warningMsg)
    # set logging level
    if LOG_LEVEL in dictIn.keys() and dictIn[LOG_LEVEL].lower() == "debug":
        logger.setLevel(logging.DEBUG)

    azureCloudConfig, err = getAzureCloudConfig(dictIn, logger)
    if err is not None:
        print(err)
        sys.exit(0)

    apiKey, err = getAuthToken(dictIn['tenantId'], dictIn['clientId'], dictIn['clientSecret'], logger, azureCloudConfig)
    # Exit script early and output error if we cannot retrieve API access token
    if err is not None:
        print(err)

    else:
        # Set the headers once and reuse for all API calls
        session.headers = getGraphHeaders(apiKey, azureCloudConfig)

        # We default filter to email
        filterBy = 'mail'
        if AZURE_USER_FILTER in dictIn.keys():
            filterBy = dictIn[AZURE_USER_FILTER]

        # getPrincipalName will determine what username we use to query the graph API
        if callName == "getUserInfo":
            username = dictIn['username']
            principalName = getPrincipalName(username, logger, filterBy, azureCloudConfig)
            if FAILED in principalName:
                print(principalName)
            else:
                if principalName:
                    username = principalName

                response = getUserInfo(dictIn, logger, username, azureCloudConfig)
                print(response)

        if callName == "login":
            username = dictIn['userInfo'].split(';')[0]
            principalName = getPrincipalName(username, logger, filterBy, azureCloudConfig)
            if FAILED in principalName:
                print(principalName)
            else:
                if principalName:
                    username = principalName

                response = login(dictIn, logger, username, azureCloudConfig)
                print(response)
