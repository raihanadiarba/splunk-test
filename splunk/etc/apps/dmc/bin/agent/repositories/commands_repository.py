"""
Commands repository
"""

from agent.repositories.base_repository import KVStoreRepositoryBase
from agent.models import Command


class KVStoreCommandsRepository(KVStoreRepositoryBase):

    """Repository for storing commands

    Implemented using KVStore.
    """

    CollectionName = Command.COLLECTION

    def _object_factory(self, entity):
        return Command(json=entity, keep_original=True)
