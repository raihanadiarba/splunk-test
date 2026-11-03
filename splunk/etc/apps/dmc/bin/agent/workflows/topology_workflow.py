"""
Topology workflow module
"""
import time

from agent import ioc
from agent.workflows import WorkflowBase


class TopologyWorkflow(WorkflowBase):
    """Topology workflow
    """
    _WORKFLOW = "topology_workflow"

    def __init__(self, task=None, **kwargs):
        self._securestorage = ioc.services.secure_storage()
        super(TopologyWorkflow, self).__init__(task, **kwargs)

    def _new_task(self):
        assert "topology" in self.objects
        assert "payload" in self.objects
        task = super(TopologyWorkflow, self)._new_task()
        payload = self.objects["payload"]
        topology = self.objects["topology"]

        task.update_embedded("payload", {
            "bootstrap": payload.get("bootstrap", False)
        })

        if task.get_value(("payload", "bootstrap")) and topology.has_path("bootstrapped"):
            topology.del_value("bootstrapped")

        topology.set_value("task", {
            "taskId": task.taskid,
            "state": "new"
        })

        return task

    def _handle_start(self):
        super(TopologyWorkflow, self)._handle_start()
        topology = self.objects["topology"]
        topology.get_value("task")["state"] = "running"
        topology.dirty = True
        self._set_instances_state(topology.get_value("task")["taskId"], "running")

    def _handle_completed(self):
        super(TopologyWorkflow, self)._handle_completed()
        topology = self.objects["topology"]
        topology.get_value("task")["state"] = "completed"
        if self.task.get_value(("payload", "bootstrap"), default=False):
            topology.set_value("bootstrapped", time.time())
        topology.dirty = True
        self._set_instances_state(topology.get_value("task")["taskId"], "completed")

    def _handle_failed(self):
        super(TopologyWorkflow, self)._handle_failed()
        topology = self.objects["topology"]
        topology.get_value("task")["state"] = "failed"
        topology.dirty = True
        self._set_instances_state(topology.get_value("task")["taskId"], "failed")

    def _set_instances_state(self, taskid, state):
        """
        As the workflow progresses this helper method will update the task state on all
        the instances being updated
        """
        query = {"task.taskId": taskid}
        instances = self.get_entities("instances", query=query, cache=True)
        for instance in instances:
            instance.get_value('task')["state"] = state
            instance.dirty = True
