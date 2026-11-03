"""
Change log related
"""
import six
from agent.common.helpers import Enum


@six.add_metaclass(Enum)
class EventType(object):  # pylint: disable=useless-object-inheritance
    """
    Event type, could be an entity type or "deploy"
    """

    @staticmethod
    def _compute(name):
        """
        return name
        """
        return name

    app = _compute
    group = _compute
    stanza = _compute
    deploy = _compute
    licenser = _compute
    cancel_changes = _compute
    graph = _compute
    lock = _compute
