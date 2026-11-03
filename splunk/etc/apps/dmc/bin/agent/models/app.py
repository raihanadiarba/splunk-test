"""
Apps JSON Entity
"""
# pylint: disable=useless-object-inheritance

import six
from agent.common.helpers import Enum

from agent.models import JSONEntity, View
from agent.models.bundle import compute_bundle_name, BundleType


@six.add_metaclass(Enum)
class AfterInstallation(object):
    """
    After installation settings for a bundle
    """

    RELOAD = "issueReload"
    RESTART = "restartSplunkd"
    NONE = None


@six.add_metaclass(Enum)
class AppProperty(object):
    """
    App property keys
    """

    NAME = "name"
    DISPLAY_NAME = "displayName"
    DESCRIPTION = "description"

    GROUPS = "groups"
    AFTER_INSTALLATION = "afterInstallation"

    PACKAGE_TYPE = "packageType"
    STAGED = "staged"

    PACKAGE = "package"

    EXTERNAL = "external"

    MANAGEABLE = "manageable"

    PRIVATE = "private"
    PACKAGE_ID = "packageId"

    VERSION = "version"
    LABEL = "label"
    CHECK_FOR_UPDATES = "check_for_updates"

    TRANSACTION_ID = "transactionId"

    TEMPLATE = "template"


@six.add_metaclass(Enum)
class AppPackageType(object):
    """
    App packageType possible values
    """

    NONE = "none"
    DEFAULT = "source"
    DEPENDENCY = "dependency"


class App(JSONEntity):
    """
    Class for properties of apps installed on the DMC for deployment
    """

    _ID_FIELD = "name"
    _DEFAULTS = {
        AppProperty.AFTER_INSTALLATION: AfterInstallation.NONE,
        AppProperty.GROUPS: lambda: [],
        AppProperty.PACKAGE_TYPE: AppPackageType.NONE,
        AppProperty.STAGED: False,
        AppProperty.PACKAGE: None,
        AppProperty.EXTERNAL: False,
        AppProperty.MANAGEABLE: True,
        AppProperty.PRIVATE: False,
        AppProperty.PACKAGE_ID: None,
        AppProperty.TRANSACTION_ID: None,
        AppProperty.TEMPLATE: None
    }
    COLLECTION = "apps"

    REMOTE_SCHEMA = {
        "type": "object",
        "properties": {
            "appId": {"type": "string"},
            "auth": {"type": "string"}
        },
        "required": ["appId", "auth"],
        "additionalProperties": True
    }

    @property
    def bundle(self):
        """
        Compute bundle name
        """
        return compute_bundle_name(BundleType.app, self.objid)

    @property
    def package(self):
        """
        Return the package name for this app
        """
        return self.get_value(AppProperty.PACKAGE, None, raise_error=False)

    @property
    def external(self):
        """
        Return whether the app is external
        """
        return self.get_value(AppProperty.EXTERNAL, False)

    @property
    def manageable(self):
        """
        Return whether the app is manageable by DMC UI
        """
        return self.get_value(AppProperty.MANAGEABLE, True)

    @property
    def private(self):
        """
        Return whether the app is "private", i.e., installed directly by uploading its package and not from splunkbase
        """
        return self.get_value(AppProperty.PRIVATE, False)

    @property
    def package_id(self):
        """
        Package id for the apps installed by uploading its package
        """
        return self.get_value(AppProperty.PACKAGE_ID, None)

    @property
    def staged(self):
        """
        Return whether the app is staged
        """
        return self.get_value(AppProperty.STAGED, False)

    @staged.setter
    def staged(self, value):
        """
        Set the staged value on this app
        """
        self.set_value(AppProperty.STAGED, value)

    @property
    def template(self):
        """
        Return app template (if any)
        """
        return self.get_value(AppProperty.TEMPLATE, None)

    @template.setter
    def template(self, value):
        """
        Set the app template
        """
        self.set_value(AppProperty.TEMPLATE, value)

    def make_group_list(self):
        """
        Return group field which is a list. If not present, return an empty list.
        """
        return self.get_value(AppProperty.GROUPS, [])

    def add_value(self, key, value):
        """
        Update the values contained for the given key's list
        """
        values = self.get_value(key, [])
        if value not in values:
            values.append(value)
        self.set_value(key, values)

    def remove_value(self, key, value):
        """
        Remove this value from the key's list
        """
        values = self.get_value(key, [])
        if value in values:
            values.remove(value)
        self.set_value(key, values)

    def json(self, view=View.RepositoryView):
        """
        Add calculated fields
        """
        result = super(App, self).json(view)
        if view == View.RestView:
            if "@bundle" not in result:
                result["@bundle"] = self.bundle
        return result
