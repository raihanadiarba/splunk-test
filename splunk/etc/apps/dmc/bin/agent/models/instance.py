"""
Instance JSON Entity
"""
import time
from future.moves.urllib import parse as urllib_parse
from agent.models import JSONEntity, View
from agent.common.topology_helpers import topology_role_name
from agent.models.bundle import compute_bundle_name, BundleType


DEFAULT_ADMIN_USERNAME = "admin"
DEFAULT_ADMIN_PASSWORD = "changeme"


class Instance(JSONEntity):
    """Class for storing instances
    """

    _ID_FIELD = "instanceId"
    _TRACK_CHANGES = True
    COLLECTION = "instances"
    _DEFAULTS = {
        "topology": topology_role_name.unassigned,
    }

    def __init__(self, *args, **kwargs):
        super(Instance, self).__init__(*args, **kwargs)
        # if instanceName is not set - we will autogenerate it based on instanceid
        if not kwargs.get("keep_original") and not self.has_path("instanceName"):
            self.set_value("instanceName", self.instanceid)

    @property
    def instancename(self):
        """Instance name
        """
        return self.get_value("instanceName")

    @property
    def instanceid(self):
        """Instance id
        """
        return self.get_value(self._ID_FIELD)

    @property
    def display_name(self):
        """Instance display name. By default this is clientName and remoteHostname when clientName is absent.
        """
        return self.get_value("clientName") if self.has_path("clientName") else self.get_value("remoteHostname")

    @property
    def is_dmc_server(self):
        """Is it dmc server
        """
        return self.get_value("instanceName") == "dmc-server"

    @property
    def splunk_home(self):
        """Get splunk home location
        """
        return self.get_value("splunkHome")

    @property
    def splunk_mgmt_uri(self):
        """
        Get mgmt_uri for instance
        """
        return self.get_value("splunkMgmtUri")

    @splunk_mgmt_uri.setter
    def splunk_mgmt_uri(self, value):
        """
        Set mgmt_uri to instance
        """
        self.set_value("splunkMgmtUri", value)

    @property
    def splunk_pass_key(self):
        """
        Get Splunk Pass Key
        """
        return self.get_value("splunkPassKey")

    @splunk_pass_key.setter
    def splunk_pass_key(self, value):
        """
        Set splunk_pass_key to instance
        """
        self.set_value("splunkPassKey", value)

    @property
    def splunk_admin_username(self):
        """
        Get Splunk admin username
        """
        if self.has_path("splunkAdminUsername"):
            return self.get_value("splunkAdminUsername")
        return DEFAULT_ADMIN_USERNAME

    @splunk_admin_username.setter
    def splunk_admin_username(self, value):
        """
        Set splunk admin username to instance
        """
        self.set_value("splunkAdminUsername", value)

    @property
    def splunk_admin_password(self):
        """
        Get Splunk admin password
        """
        return self.get_value("splunkAdminPassword")

    @splunk_admin_password.setter
    def splunk_admin_password(self, value):
        """
        Set splunk_admin_password to instance
        """
        self.set_value("splunkAdminPassword", value)

    @property
    def has_topology(self):
        """Verify if current instance has topology assigned
        """
        return self.has_path("topology")

    @property
    def topology(self):
        """
        Get topology
        """
        return self.get_value("topology")

    @topology.setter
    def topology(self, value):
        """
        Set topology
        """
        self.set_value("topology", value)

    @property
    def last_phone_home_time(self):
        """
        Get last phone home time
        """
        self.get_value("lastPhoneHomeTime")

    @last_phone_home_time.setter
    def last_phone_home_time(self, value):
        """
        Get last phone home time
        """
        self.set_value("lastPhoneHomeTime", value)

    @property
    def splunk_mgmt_uri_hostname(self):
        """
        Get the hostname from splunk_mgmt_uri
        """
        return urllib_parse.urlparse(self.splunk_mgmt_uri).hostname

    @property
    def splunk_mgmt_uri_port(self):
        """
        Get the hostname from splunk_mgmt_uri
        """
        return urllib_parse.urlparse(self.splunk_mgmt_uri).port

    @property
    def splunk_mgmt_uri_hostname_port(self):
        """
        Get the hostname:port from splunk_mgmt_uri
        """
        uri = urllib_parse.urlparse(self.splunk_mgmt_uri)
        return uri.hostname + ":" + str(uri.port)

    @property
    def bundle(self):
        """
        Compute bundle name
        """
        return compute_bundle_name(BundleType.node, self.objid)

    def make_application_list(self):
        """
        Return applications field which is a list. If not present, return an empty list.
        """
        return self.get_value("applications", [])

    def json(self, view=View.RepositoryView):
        """
        Add calculated fields
        """
        result = super(Instance, self).json(view)
        if view == View.RestView:
            if "lastPhoneHomeTime" in result:
                result["@lastPhoneHomeDiffNow"] = int(round(time.time())) - result["lastPhoneHomeTime"]
            if "@bundle" not in result:
                result["@bundle"] = self.bundle
        return result
