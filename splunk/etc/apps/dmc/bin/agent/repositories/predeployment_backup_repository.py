"""
PreDeployment backup repository
"""

from agent.repositories.base_repository import KVStoreRepositoryBase
from agent.models import PreDeploymentBackup


class KVStorePreDeploymentBackupRepository(KVStoreRepositoryBase):
    """
    backup repository to store the changes made after a deployment
    """

    CollectionName = PreDeploymentBackup.COLLECTION

    def _object_factory(self, entity):
        return PreDeploymentBackup(json=entity, keep_original=True)
