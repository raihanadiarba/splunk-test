"""
Changelog repository
"""

from agent.repositories.base_repository import KVStoreRepositoryBase
from agent.models import PendingChangelog


class KVStorePendingChangelogRepository(KVStoreRepositoryBase):

    """Repository for storing properties of apps installed on the DMC for deployment

    Implemented using KVStore.
    """

    CollectionName = PendingChangelog.COLLECTION

    def _object_factory(self, entity):
        return PendingChangelog(json=entity, keep_original=True)
