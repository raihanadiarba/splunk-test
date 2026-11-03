"""
Bundle related
"""
# pylint: disable=useless-object-inheritance, comparison-with-callable
import six

from agent.common.helpers import Enum


@six.add_metaclass(Enum)
class BundleType(object):
    """Deployment server bundle type
    """

    @staticmethod
    def _compute(name):
        """
        Return unchanged
        """
        return name

    node = _compute
    builtin = _compute
    custom = _compute
    app = _compute


def compute_bundle_name(bundle_type, bundle_id):
    """Compute bundle name based on its type and id
    app, bundle -> bundle
    custom, bundle -> _bundle
    builtin, bundle -> __bundle
    node, bundle -> ___bundle
    """
    if bundle_type == BundleType.custom:
        prefix = "_"
    elif bundle_type == BundleType.builtin:
        prefix = "__"
    elif bundle_type == BundleType.node:
        prefix = "___"
    elif bundle_type == BundleType.app:
        prefix = ""
    else:
        assert False
    return prefix + bundle_id
