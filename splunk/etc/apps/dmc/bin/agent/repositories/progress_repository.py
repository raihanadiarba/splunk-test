"""
Progress repository
"""
from agent.repositories.base_repository import KVStoreRepositoryBase
from agent.models import Progress


class KVStoreProgressRepository(KVStoreRepositoryBase):

    """Repository for storing progress

    Implemented using KVStore.
    """

    CollectionName = Progress.COLLECTION

    def _object_factory(self, entity):
        return Progress(json=entity, keep_original=True)
