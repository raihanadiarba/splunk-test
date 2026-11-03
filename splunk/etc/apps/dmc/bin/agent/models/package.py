"""
Uploaded app package
"""
# pylint: disable=useless-object-inheritance
import six

from agent.common.helpers import Enum
from agent.models import JSONEntity


@six.add_metaclass(Enum)
class PackageProperty(object):
    """
    Package property keys
    """

    PACKAGE_ID = "packageId"
    UPLOADED_FILE = "uploadedFile"
    STATUS = "status"
    SUBMITTED_AT = "submittedAt"
    objid = "objid"


@six.add_metaclass(Enum)
class PackageStatus(object):
    """Package status
    """

    UNKNOWN = "unknown"
    INSTALLED = "installed"
    APPROVED = "approved"
    VETTING = "vetting"
    REJECTED = "rejected"
    IN_MANUAL_REVIEW = "in_manual_review"
    FAILED = "failed"


class Package(JSONEntity):
    """Uploaded app package entity
    """

    _ID_FIELD = "packageId"

    _DEFAULTS = {
        PackageProperty.PACKAGE_ID: None,
        PackageProperty.UPLOADED_FILE: None,
        PackageProperty.STATUS: PackageStatus.UNKNOWN,
        PackageProperty.SUBMITTED_AT: None
    }

    @property
    def uploaded_file(self):
        """Package file
        """
        return self.get_value(PackageProperty.UPLOADED_FILE, None)

    @property
    def status(self):
        """Package status
        """
        return self.get_value(PackageProperty.STATUS, PackageStatus.UNKNOWN)

    @property
    def submitted_at(self):
        """Time when package has been submitted for verification
        """
        return self.get_value(PackageProperty.SUBMITTED_AT, None)
