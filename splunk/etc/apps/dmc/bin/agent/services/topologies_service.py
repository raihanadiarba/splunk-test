"""
Module with topologies service
"""
# pylint: disable=no-else-raise
import copy
import logging

from agent import ioc, wtransaction
from agent import NotFoundException, ServerException, WorkflowException
from agent.models import Topology
from agent.common.topology_helpers import topology_role_name


SHC_DEPLOYER_FIELD = "SHCDeployer"
IDXC_MASTER_FIELD = "IDXCMaster"
SEARCH_HEAD_FIELD = "searchHead"
_MGMT_URI_FIELD = "mgmtUri"
_SECRET_FIELD = "secret"

_PREPROCESSED_FIELDS = {SHC_DEPLOYER_FIELD, IDXC_MASTER_FIELD, SEARCH_HEAD_FIELD}


class TopologiesService(ioc.Component):
    """Service to work with topologies
    """

    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)
        self._repository = \
            ioc.repositories.topologies_repository()
        self._instances_service = \
            ioc.services.instances_service()
        self._tasks_service = \
            ioc.services.tasks_service()
        self._secure_storage = ioc.services.secure_storage()

    @wtransaction
    def create_or_update(self, payload):
        """Create new topology based on user request if it does not exist.
            We support only one topology for now and it always should be
            named default.
            Also create a new task with the payload passed
        """
        assert payload

        ret = None

        if not self._is_topology_workflow_busy():
            topology = self.get_default_topology()
            ret = self._process(payload, topology)
        else:
            raise WorkflowException(fmt="Topology currently being updated")

        return ret

    def _preprocess(self, payload, topology):
        """
        Preprocess payload, save and return updated payload
        """
        payload_preprocessed = copy.deepcopy(payload)

        conflicting_fields = {SEARCH_HEAD_FIELD, SHC_DEPLOYER_FIELD}

        if set(payload.keys()).intersection(conflicting_fields):
            # Removing all conflicting fields from the old topology value.
            for field in conflicting_fields:
                if topology.has_path(field):
                    topology.del_value(field)

        for field in payload:
            if field in _PREPROCESSED_FIELDS:
                if not topology.has_path(field):
                    topology.set_value(field, {})
                update = payload_preprocessed.pop(field)
                current = topology.get_value(field)
                self._preprocess_field_value(update, current)

        self.save(topology)
        return payload_preprocessed

    def _process(self, payload, topology):
        """
        Process payload and return the updated topology
        """
        payload = self._preprocess(payload, topology)
        self._tasks_service.new_task("topology_workflow",
                                     topology=topology,
                                     payload=payload)
        return topology

    def _preprocess_field_value(self, update, current):
        """
        Preprocess payload and save
        """
        # process "secret"
        if _SECRET_FIELD in update:
            secret = update[_SECRET_FIELD]
            secret = self._secure_storage.encrypt(secret)
            update[_SECRET_FIELD] = secret

        current.update(update)

    def get_all(self):
        """Get list of registered topologies
        """

        return self._repository.get_all()

    def get(self, topologyid, topologyversion=None):
        """Get one topology by id (latest version) or with specified version
        """

        ret = None
        if not topologyversion:
            ret = self._repository.get(topologyid)
        else:
            topologies = \
                self._repository.get_all({"topologyId": topologyid,
                                          "topologyVersion": topologyversion})
            if len(topologies) == 0:
                ex_msg = "Topology with id '%s' and version '%d' not found." \
                    % (topologyid, topologyversion)
                raise NotFoundException(fmt=ex_msg)
            elif len(topologies) > 1:
                raise ServerException(fmt="Unexpected result")
            else:
                ret = topologies[0]

        return ret

    @wtransaction
    def update(self, topologyid, payload):
        """Update topology
        """
        if self._is_topology_workflow_busy():
            raise WorkflowException(fmt="Topology is currently being updated")
        else:
            topology = self.get(topologyid)
            topology = self._process(payload, topology)
            return self._repository.update(topology)

    @wtransaction
    def save(self, topology):
        """Save topology directly to KVStore
        """
        self._repository.update(topology)

    @wtransaction
    def sync_topology_forwarders(self):
        """Sync count of instances with forwarder topology
        with the count in topology
        """
        # TODO: we are assuming that only one topology can be used
        query = {"topology": topology_role_name.forwarder_member}
        count = self._instances_service.get_count(query)
        topology = self.get_default_topology()
        if not topology.has_path("forwarders"):
            topology.set_value("forwarders", {})
        topology.get_value("forwarders")["count"] = count
        self._repository.update(topology)

    def get_default_topology(self):
        """At current moment we support only one topology with name default
        """
        topologies = self._repository.get_all({"topologyName": "default"})
        if len(topologies) > 1:
            raise ServerException(
                fmt=("Unexpected number of default topologies: %d" %
                     len(topologies)))
        elif not topologies:
            return self.__create_default_topology()
        else:
            return topologies[0]

    def __create_default_topology(self):
        """Create empty default topology
        """
        topology = Topology({"topologyName": "default"})
        self._repository.insert(topology)
        return topology

    def _is_topology_workflow_busy(self):
        """Checks if the topology is currently being updated
        """
        # verify if a task is running on the topology_workflow
        query = {"$and": [{"state": "running"}, {"workflow": "topology_workflow"}]}
        tasks = self._tasks_service.get_all(query=query, fields=["taskId"])
        if len(tasks) > 0:
            return True
        return False
