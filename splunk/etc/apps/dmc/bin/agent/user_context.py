"""
Context manager
"""
from contextlib import contextmanager
import threading
import collections

from agent.server_exceptions import UserContextMissingException, UserContextInvalidException
from agent.common.access_control import Capability

# this can be anything
_THREAD_LOCAL_KEY = "UserContextKey"
_EMPTY_CONTEXT = object()
UserContextContainer = collections.namedtuple("UserContextContainer", ("user_context", "previous"))


def match_access_capabilities(granted_capabilities, required):
    """Match user granted capabilities vs. required ones
    """
    granted_dmc_capabilities = [capability for capability in
                                [Capability.parse(cp) for cp in granted_capabilities]
                                if capability]
    return Capability.match(granted_dmc_capabilities, required)


class UserContext():
    """
    Support user context management
    """
    def __init__(self):
        self._local = threading.local()

    @contextmanager
    def scope(self, context):
        """
        Manage Splunk user context creation and removal
        """
        try:
            container = None
            if self._has():
                container = UserContextContainer(context, self._get())
            else:
                container = UserContextContainer(context, _EMPTY_CONTEXT)
            self._set(container)
            yield
        finally:
            self._del()

    @property
    def context(self):
        """
        Return the context
        """
        return self._get().user_context

    @property
    def user(self):
        """
        Return 'user' property from the context
        """
        return self._get().user_context["user"]

    @property
    def has_context(self):
        """
        Verify if user context is set
        """
        return self._has()

    def match_access_capabilities(self, required):
        """Match user granted capabilities vs. required ones
        """
        return match_access_capabilities(self._get().user_context["capabilities"], required)

    def _has(self, with_context=False):
        """
        Verify that context has been set.
        """
        return hasattr(self._local, _THREAD_LOCAL_KEY) \
            and (not with_context or getattr(self._local, _THREAD_LOCAL_KEY).user_context is not None)

    def _get(self):
        """
        Get the context
        """
        if not self._has(with_context=True):
            raise UserContextMissingException()

        return getattr(self._local, _THREAD_LOCAL_KEY)

    def _set(self, container):
        """
        Set the context container
        """
        assert isinstance(container, UserContextContainer)

        context = container.user_context
        if context is not None and (not isinstance(context, dict) or "user" not in context):
            raise UserContextInvalidException()

        setattr(self._local, _THREAD_LOCAL_KEY, container)

    def _del(self):
        """
        Delete the context and set previous
        """
        if not self._has():
            return

        container = getattr(self._local, _THREAD_LOCAL_KEY)
        delattr(self._local, _THREAD_LOCAL_KEY)
        if container.previous != _EMPTY_CONTEXT:
            self._set(container.previous)
