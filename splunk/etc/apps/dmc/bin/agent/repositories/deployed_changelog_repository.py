"""
Deployed repository
"""

from agent.repositories.base_repository import KVStoreRepositoryBase
from agent.models import DeployedChangelog


class KVStoreDeployedChangelogRepository(KVStoreRepositoryBase):

    """Repository for storing properties of deployed changes

    Implemented using KVStore.
    """

    CollectionName = DeployedChangelog.COLLECTION

    def _object_factory(self, entity):
        return DeployedChangelog(json=entity, keep_original=True)
