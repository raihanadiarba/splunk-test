from enum import Enum


class RegistrationApp(str, Enum):
    """
    This is a list of app that comes from SSG UI app registration page
    See registrationSlice.ts for more details
    """

    NOT_SELECTED = "not_selected"
    MOBILE = "splunk_mobile"
    EDGE = "splunk_edge"
    CISCO_EDGE_INTELLIGENCE = "cisco_edge_intelligence"
