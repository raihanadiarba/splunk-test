"""
Storage for misc data that has to be persistent
"""

from agent.repositories.base_repository import KVStoreRepositoryBase
from agent.models import PersistentData

REPOSITORY_DATA_ID_UNDEPLOYED_BUNDLES = "undeployed-bundles-data"
REPOSITORY_DATA_ID_DEPLOYMENT_LOCK = "deployment-lock"
REPOSITORY_DATA_ID_SYNC_APPS = "sync-apps"  # apps that requires "custom" synchronization during deployment process


class KVStorePersistentDataRepository(KVStoreRepositoryBase):

    """Repository for storing misc data.
    Implemented using KVStore.
    """

    CollectionName = PersistentData.COLLECTION

    def _object_factory(self, entity):
        return PersistentData(json=entity, keep_original=True)
