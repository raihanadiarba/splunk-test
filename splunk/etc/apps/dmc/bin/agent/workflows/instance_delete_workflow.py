"""
Workflow to delete instances
"""

from agent import ioc, ServerException
from agent.services.group_helpers import make_bundle_name_from_instance_id
from agent.workflows import WorkflowBase
from agent.workflows.workflow_base import OneCommandWorkflowStageBase
from agent.common.topology_helpers import topology_role_name


class RemoveForwarderFromDeploymentServerStage(OneCommandWorkflowStageBase):
    """This stage removes the forwarder instance form the deployment server
    """
    TYPE = "instance_delete:remove_forwarder_from_deployment_server"
    DESCRIPTION = "Remove forwarder from Deployment Server"
    COMMAND = "remove_client_from_deployment_server"

    def _new_command(self):
        instance = self._workflow.objects["instance"]
        command = super(RemoveForwarderFromDeploymentServerStage, self)._new_command()
        command.set_value("payload", {"instanceId": instance.instanceid, "guid": instance.get_value("guid")})
        return command

    @classmethod
    def should_create(cls, workflow):
        instance = workflow.objects["instance"]
        return instance.topology == topology_role_name.forwarder_member  # pylint: disable=comparison-with-callable


class InstanceDeleteWorkflow(WorkflowBase):
    """
    Delete instance workflow
    """

    _STAGES = [
        RemoveForwarderFromDeploymentServerStage
    ]

    _WORKFLOW = "instance_delete_workflow"

    _VALID_TOPOLOGIES_TO_DELETE = [
        topology_role_name.unassigned,
        topology_role_name.removed,
        topology_role_name.forwarder_member
    ]

    def __init__(self, task=None, **kwargs):
        self._repository = ioc.repositories.instances_repository()
        self._stanza_service = ioc.services.stanzas_service()
        self._deploy_service = ioc.services.deploy_service()
        self._secure_storage = ioc.services.secure_storage()
        super(InstanceDeleteWorkflow, self).__init__(task, **kwargs)

    def _new_task(self):
        assert "instance" in self.objects
        task = super(InstanceDeleteWorkflow, self)._new_task()
        instance = self.objects["instance"]
        topology = instance.topology
        if topology not in self._VALID_TOPOLOGIES_TO_DELETE:
            raise ServerException(fmt="Cannot delete instance with topology " + topology)
        task.set_value("payload", {
            "instanceId": instance.instanceid
        })
        instance.set_value("task", {
            "taskId": task.taskid,
            "state": "new"
        })
        return task

    def _handle_start(self):
        super(InstanceDeleteWorkflow, self)._handle_start()
        instance = self.objects["instance"]
        instance.get_value("task")["state"] = "running"
        instance.dirty = True

    def _handle_completed(self):
        super(InstanceDeleteWorkflow, self)._handle_completed()
        instance = self.objects["instance"]

        bundle = make_bundle_name_from_instance_id(instance.instanceid)
        self._stanza_service.delete_bundle(bundle)

        self._secure_storage.delete_all_secrets(instance)
        self._repository.delete(instance.instanceid)
        self._deploy_service.invalidate_cache(
            instances_changed=False,
            groups_changed=True,
            apps_changed=False,
            ds_apps_changed=False)
        del self.objects["instance"]

    def _handle_failed(self):
        super(InstanceDeleteWorkflow, self)._handle_failed()
        instance = self.objects["instance"]
        instance.get_value("task")["state"] = "failed"
        instance.dirty = True
