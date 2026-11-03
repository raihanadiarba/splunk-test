"""
Groups repository
"""
from agent.models.bundle import BundleType
from agent.models.change import EventType

from agent.repositories.base_repository import KVStoreRepositoryBase
from agent.models import Group


class KVStoreGroupsRepository(KVStoreRepositoryBase):

    """Repository for storing groups

    Implemented using KVStore.
    """

    CollectionName = Group.COLLECTION
    LogEventType = EventType.group
    StanzaBundleType = BundleType.custom

    def _object_factory(self, entity):
        return Group(json=entity, keep_original=True)
