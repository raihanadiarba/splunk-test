"""
Event aggregator
"""

import logging


class EventAggregator(object):  # pylint: disable=useless-object-inheritance
    """Event aggregator
    """

    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)
        self.__events = {}

    def subscribe(self, eventname, subscriber):
        """Subscrube for event
        """
        assert hasattr(subscriber, '__call__')
        subscribers = self.__events.setdefault(eventname, [])
        subscribers.append(subscriber)
        self._logger.debug("New subscriber for %s", eventname)

    def unsubscribe(self, eventname, subscriber):
        """Unsubscribe from event
        """
        assert hasattr(subscriber, '__call__')
        subscribers = self.__events.get(eventname)
        if subscribers:
            try:
                subscribers.remove(subscriber)
                self._logger.debug("Removed subscriber for %s", eventname)
            except ValueError:
                pass

    def raise_event(self, eventname, *args, **kwargs):
        """Raise event
        """
        self._logger.debug("New event raised %s", eventname)
        subscribers = self.__events.get(eventname)
        if subscribers:
            for subscriber in subscribers:
                subscriber(*args, **kwargs)
        else:
            self._logger.debug("No subscribers for event %s", eventname)
