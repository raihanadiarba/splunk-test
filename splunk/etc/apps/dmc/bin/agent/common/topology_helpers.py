"""
Topology helpers
"""
# pylint: disable=invalid-name
# pylint: disable=no-init
# pylint: disable=no-self-use
# pylint: disable=too-few-public-methods
import os
import six

from agent.common.helpers import Enum


@six.add_metaclass(Enum)
class topology_role_name(object):
    # pylint: disable=useless-object-inheritance
    """
    Enum of topology role name
    """

    @staticmethod
    def _compute(name):
        """
        Replace '_' with ":" in name
        """
        return name.replace("_", ":")

    unassigned = _compute
    removed = _compute
    dmc = _compute
    idxc_member = _compute
    shc_member = _compute
    forwarder_member = _compute


def get_default_exclude_from_update():
    """
    Get default value for excludeFromUpdate we use in serverclass.conf for deployment server
    """
    return "$app_root${0}local,$app_root${0}metadata{0}local.meta".format(os.sep)
