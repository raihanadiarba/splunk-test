"""
Tasks repository
"""

from agent.repositories.base_repository import KVStoreRepositoryBase
from agent.models import Task


class KVStoreTasksRepository(KVStoreRepositoryBase):

    """Repository for storing tasks

    Implemented using KVStore.
    """

    CollectionName = Task.COLLECTION

    def _object_factory(self, entity):
        return Task(json=entity, keep_original=True)
