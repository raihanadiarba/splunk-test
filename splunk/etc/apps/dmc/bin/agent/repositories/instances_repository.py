"""
Instances repository
"""

import agent

from agent import wtransaction
from agent.models.bundle import BundleType
from agent.repositories.helpers import clean_private_kvstore_values
from agent.repositories.base_repository import KVStoreRepositoryBase
from agent.models import Instance


class KVStoreInstancesRepository(KVStoreRepositoryBase):

    """Repository for storing and loading instances

    Implemented using KVStore.
    """

    CollectionName = Instance.COLLECTION
    StanzaBundleType = BundleType.node

    @clean_private_kvstore_values
    @wtransaction
    def insert(self, obj, log_change=False):
        """Save instance in KVStore
        """
        try:
            self.get_by_name(obj.instancename)
            ex_msg = "Instance with name '%s' already exist." % \
                obj.instancename
            raise agent.UniqueItemException(fmt=ex_msg)
        except agent.NotFoundException:
            # We expect to not see this instance
            pass
        return super(KVStoreInstancesRepository, self).insert(obj)

    @clean_private_kvstore_values
    def get_by_name(self, instancename):
        """Get instance by name
        """
        result = super(KVStoreInstancesRepository, self) \
            .get_all(query={"instanceName": instancename},
                     limit=1)
        if result:  # pylint: disable=no-else-return
            return result[0]
        else:
            ex_msg = "Instance with name '%s' not found." % instancename
            raise agent.NotFoundException(fmt=ex_msg)

    def _object_factory(self, entity):
        return Instance(json=entity, keep_original=True)
