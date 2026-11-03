"""
A service that support Splunk licenses in DMC
"""

from agent import ioc
from agent.models.change import EventType
from agent.services.changelog_service import OpType


# pylint: disable=no-self-use
class LicenserService(ioc.Component):
    """Audit of Splunk licenser operations
    """

    def __init__(self):
        self._changelog_service = ioc.services.changelog_service()
        self._user_context = ioc.components.user_context()

    def audit_add_license(self, info):
        """Audit a new license
        """
        self._record_log(OpType.insert, self._license_info("add_license", info))

    def audit_delete_license(self, info):
        """Audit deleted license
        """
        self._record_log(OpType.delete, self._license_info("delete_license", info))

    def audit_add_pool(self, info):
        """Audit a new pool
        """
        self._record_log(OpType.insert, self._pool_info("add_pool", info))

    def audit_delete_pool(self, info):
        """Audit deleted pool
        """
        self._record_log(OpType.delete, self._pool_info("delete_pool", info))

    def audit_activate_group(self, info):
        """Audit group activation
        """
        self._record_log(OpType.update, self._group_info("activate_group", info))

    def _record_log(self, op_type, log):
        """Record audit to changelog
        """
        self._changelog_service.record(
            EventType.licenser, self._user_context.user, action=log, op_type=op_type, deployed=True)

    def _license_info(self, action, info):
        """Audit data for Splunk license
        """
        license_info = dict(action=action, name=info["name"])
        content = info.get("content")
        if content:
            license_info.update(dict(type=content["type"],
                                     quota=content["quota"],
                                     label=content["label"]))
        return license_info

    def _pool_info(self, action, info):
        """Audit data for Splunk license pool
        """
        pool_info = dict(action=action, name=info["name"])
        content = info.get("content")
        if content:
            pool_info.update(dict(stack_id=content["stack_id"], quota=content["quota"]))
        return pool_info

    def _group_info(self, action, info):
        """Audit data for Splunk license group
        """
        group_info = dict(action=action, name=info["name"])
        content = info.get("content")
        if content:
            group_info.update(dict(is_active=content["is_active"]))
        return group_info
