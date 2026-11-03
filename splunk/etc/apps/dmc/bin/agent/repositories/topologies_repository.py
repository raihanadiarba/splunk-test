"""
Topologies repository
"""

from agent import wtransaction, ServerException
from agent.repositories.helpers import clean_private_kvstore_values
from agent.repositories.base_repository import KVStoreRepositoryBase
from agent.models import Topology


class KVStoreTopologiesRepository(KVStoreRepositoryBase):

    """Repository for storing and loading topologies

    Implemented using KVStore.
    """

    CollectionName = Topology.COLLECTION

    @clean_private_kvstore_values
    @wtransaction
    def insert(self, obj, log_change=False):
        """Save topology in KVStore
        NOTE: We only support one topology at current moment.
        So user cannot insert second one.
        """
        result = super(KVStoreTopologiesRepository, self).get_all(limit=1)
        if result:
            raise ServerException(fmt="Only one topology is supported.")
        return super(KVStoreTopologiesRepository, self).insert(obj)

    def _object_factory(self, entity):
        return Topology(json=entity, keep_original=True)
