"""Splunk deploy configuration workflow.
   This workflow updates and refreshes DS, indexers and search heads deployment configuration.
"""

from agent import ioc
from agent.services import group_helpers
from agent.services.topologies_service import SEARCH_HEAD_FIELD, SHC_DEPLOYER_FIELD, IDXC_MASTER_FIELD
from agent.workflows import WorkflowBase, WorkflowStageBase, OneCommandWorkflowStageBase
from agent.workflows.notification_workflow import trigger_sh_notifications
from agent.common.topology_helpers import topology_role_name


NOTIFY_DEPLOY_MSG_KEY = "DMC_DEPLOY_KEY"

NOTIFY_DEPLOY_START_MSG = \
    """
    Your administrator started a Splunk Cloud deployment task.
    This task might take several minutes to complete.
    Splunk Cloud might restart and become unavailable for some time.
    """

NOTIFY_DEPLOY_FAILED_MSG = "A Splunk Cloud deployment task failed. Contact your administrator for details."
NOTIFY_DEPLOY_SUCCESS_MSG = "A Splunk Cloud deployment task completed successfully."

EDIT_OR_INSTALL_APPS_CAP = ("edit_local_apps", "install_apps")


class PrepareStage(OneCommandWorkflowStageBase):
    """Copy folders and set serverclass.conf
    """

    TYPE = "agent:splunk:prepare_ds"
    DESCRIPTION = "Commit pending changes to configuration system"
    COMMAND = "deploy"

    def _new_command(self):
        command = super(PrepareStage, self)._new_command()
        command.set_value("payload", {"topology": self._workflow.task.get_value(("payload", "topology"))})
        return command


class ReloadDSStage(OneCommandWorkflowStageBase):
    """Copy folders and set serverclass.conf
    """

    TYPE = "agent:splunk:reload_ds"
    DESCRIPTION = "Reload deployment server"
    COMMAND = "reloaddsconf"


class SyncDCStage(WorkflowStageBase):
    """Sync DS and DC
    """
    TYPE = "agent:splunk:sync_dc"
    DESCRIPTION = "Sync Deployment Server and Deployment Client"

    def handle_start(self):
        super(SyncDCStage, self).handle_start()
        self._start_sync_dc_commands()

    def _handle_completed(self, command, progress):
        # running commands "bookkeeping"
        self.stage["payload"]["running_commands_count"] -= 1
        self._workflow.task.dirty = True
        if self.stage["payload"]["running_commands_count"] == 0:
            self.mark_completed()

    def _start_sync_dc_commands(self):
        """Queue conf refresh commands for execution
        """
        topology = self._workflow.task.get_value(("payload", "topology"))

        search_head_info = topology.get(SEARCH_HEAD_FIELD)
        if search_head_info:
            payload = dict(node_info=search_head_info)
            self._workflow.commands.append(
                self._create_command_helper(ioc.commands.sync_dc_command, payload=payload)
            )

            remote_cm_info = topology.get(IDXC_MASTER_FIELD)
            if remote_cm_info:
                payload = dict(
                    node_info=remote_cm_info,
                    server_class=group_helpers.builtin_name.indexers
                )
                self._workflow.commands.append(
                    self._create_command_helper(ioc.commands.sync_dc_command, payload=payload)
                )

            self.stage["payload"] = dict(running_commands_count=len(self._workflow.commands))
        else:
            self.mark_completed()


class FinalizeStage(WorkflowStageBase):
    """Finalize deploy and check status
    """
    TYPE = "agent:splunk:finalize"
    DESCRIPTION = "Finalize deployment"

    def handle_start(self):
        super(FinalizeStage, self).handle_start()
        self._start_conf_deploy_commands()

    def _handle_completed(self, command, progress):
        # running commands "bookkeeping"
        self.stage["payload"]["running_commands_count"] -= 1
        self._workflow.task.dirty = True
        if self.stage["payload"]["running_commands_count"] == 0:
            self.mark_completed()

    def _start_conf_deploy_commands(self):
        """Queue conf refresh commands for execution
        """
        instances = ioc.services.instances_service()

        topology = self._workflow.task.get_value(("payload", "topology"))

        payload = dict(topology=topology)

        # reload indexers (if in StackMakr or there is any indexer member instances)
        if SEARCH_HEAD_FIELD in topology or SHC_DEPLOYER_FIELD in topology:
            self._workflow.commands.append(self._create_command_helper("reloadmasterappsconf", payload=payload))

        if SHC_DEPLOYER_FIELD in topology:
            sh_members = None
        else:
            sh_members = [
                dict(pass_key=instance.splunk_pass_key, mgmt_uri=instance.splunk_mgmt_uri)
                for instance in instances.get_all({"topology": topology_role_name.shc_member})
            ]

        if sh_members is None or sh_members:
            self._workflow.commands.append(
                self._create_command_helper("reloadshclusterconf", payload=payload, target=sh_members)
            )

        if self._workflow.commands:
            self.stage["payload"] = dict(running_commands_count=len(self._workflow.commands))
        else:
            self.mark_completed()


class DeployWorkflow(WorkflowBase):
    """Splunk Deployment Server configuration deploy workflow.
    Currently ReloadMasterAppsConfStage and ReloadShClusterConfStage are synchronous and finish only when master-apps
    and shcluster deployment is fully complete. ReloadDeploymentConfStage remains asynchronous.
    """

    _STAGES = [
        PrepareStage,     # this stage copies pre-deployed conf to "correct locations"
        ReloadDSStage,    # reload DS
        SyncDCStage,      # sync DS and DC
        FinalizeStage,    # reload SH and master-apps confs
    ]
    _WORKFLOW = "deploy_workflow"

    def __init__(self, task=None, **kwargs):
        super(DeployWorkflow, self).__init__(task, **kwargs)
        topologies_service = ioc.services.topologies_service()
        self.topology = topologies_service.get_default_topology().json()

        configuration = ioc.components.configuration()
        self.command_retry_limit = configuration.get_int("deploy_command_retry_limit", default=1)
        self.command_retry_interval = configuration.get_int("deploy_command_retry_interval", default=15)

    def _handle_start(self):
        """ Alert the admin deployment has started
        """
        super(DeployWorkflow, self)._handle_start()
        trigger_sh_notifications(self.topology, NOTIFY_DEPLOY_MSG_KEY, NOTIFY_DEPLOY_START_MSG, "info",
                                 EDIT_OR_INSTALL_APPS_CAP)

    def _handle_completed(self):
        """ Alert the admin deployment is complete
        """
        super(DeployWorkflow, self)._handle_completed()
        trigger_sh_notifications(self.topology, NOTIFY_DEPLOY_MSG_KEY, NOTIFY_DEPLOY_SUCCESS_MSG, "info",
                                 EDIT_OR_INSTALL_APPS_CAP)

    def _handle_failed(self):
        """ Alert the admin deployment has failed
        """
        super(DeployWorkflow, self)._handle_failed()
        trigger_sh_notifications(self.topology, NOTIFY_DEPLOY_MSG_KEY, NOTIFY_DEPLOY_FAILED_MSG, "error",
                                 EDIT_OR_INSTALL_APPS_CAP)

    def _new_task(self):
        task = super(DeployWorkflow, self)._new_task()

        topologies = ioc.services.topologies_service()
        topology = topologies.get_default_topology()

        task.set_value("payload", {
            "topology": topology.json()
        })
        return task
