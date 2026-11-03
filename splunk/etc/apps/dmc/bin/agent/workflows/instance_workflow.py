"""Instance workflow
"""

from copy import copy

from agent import ioc
from agent.workflows import WorkflowBase, OneCommandWorkflowStageBase
from agent.common.topology_helpers import topology_role_name
from agent.commands.get_splunk_version_command \
    import splunk_version_from_payload
from agent.models.instance import DEFAULT_ADMIN_USERNAME, DEFAULT_ADMIN_PASSWORD


class GetMachineInformationStage(OneCommandWorkflowStageBase):
    """Verify SSH and get machine information, including
    OS, CPU, Memory
    """

    TYPE = "agent:getmachineinformation"
    DESCRIPTION = "Verify SSH Connection"
    COMMAND = "uname"

    def _handle_completed(self, command, progress):
        super(GetMachineInformationStage, self) \
            ._handle_completed(command, progress)
        instance = self._workflow.objects["instance"]
        payload = progress.get_value("payload")
        instance.set_value("os", payload["uname"])
        instance.dirty = True

    def _new_command(self):
        command = super(GetMachineInformationStage, self)._new_command()
        command.set_value("target",
                          copy(self._workflow.task.get_value("payload")))
        return command


class VerifyBackwardConnectionStage(OneCommandWorkflowStageBase):
    """Verify that instance can get back to the dmc server
    """

    TYPE = "agent:verifybackwardconnection"
    DESCRIPTION = "Verify connectivity from instance to server"
    COMMAND = "verifyconnection"

    def _new_command(self):
        command = super(VerifyBackwardConnectionStage, self)._new_command()
        command.set_value("target", copy(self._workflow.task.get_value("payload")))
        dmc = self._workflow.get_dmc_instance()
        instance = self._workflow.objects["instance"]
        command.set_value("payload", {"host": dmc.get_value("remoteHostname"), "fail": not instance.is_dmc_server})
        return command

    def _handle_completed(self, command, progress):
        if progress.has_path(("payload", "warning")):
            self._workflow.task.add_warning(progress.get_value(("payload", "warning")))
        super(VerifyBackwardConnectionStage, self)._handle_completed(command, progress)


class SetInstanceIdStage(OneCommandWorkflowStageBase):
    """Updaet instance id stage
    """
    TYPE = "agent:splunk:setinstanceid"
    DESCRIPTION = "Update instance id"
    COMMAND = "setinstanceid"

    def _new_stage(self, stage):
        super(SetInstanceIdStage, self)._new_stage(stage)
        instance = self._workflow.objects["instance"]
        stage["payload"] = {
            "splunkHome": instance.splunk_home,
            "instanceId": instance.instanceid
        }

    def _new_command(self):
        command = super(SetInstanceIdStage, self)._new_command()
        command.set_value("target",
                          copy(self._workflow.task.get_value("payload")))
        return command

    @classmethod
    def should_create(cls, workflow):
        instance = workflow.objects["instance"]
        return not instance.is_dmc_server and not instance.get_value("@migration", default=False)


class VerifyInstanceIdStage(OneCommandWorkflowStageBase):
    """Verify that instance has expected instance id
    """
    TYPE = "agent:splunk:verifyinstanceid"
    DESCRIPTION = "Verify instance Id"
    COMMAND = "verifyinstanceid"

    def _new_command(self):
        command = super(VerifyInstanceIdStage, self)._new_command()
        instance = self._workflow.objects["instance"]
        command.set_value("target", {"instanceId": instance.instanceid})
        return command


class GetSplunkInformationStage(OneCommandWorkflowStageBase):
    """Discover Splunk Service stage
    """
    TYPE = "agent:splunk:getinformation"
    DESCRIPTION = "Get information about installed Splunk"
    COMMAND = "getsplunkversion"

    def _new_stage(self, stage):
        super(GetSplunkInformationStage, self)._new_stage(stage)
        instance = self._workflow.objects["instance"]
        stage["payload"] = {
            "splunkHome": instance.splunk_home
        }

    def _handle_completed(self, command, progress):
        super(GetSplunkInformationStage, self)\
            ._handle_completed(command, progress)
        instance = self._workflow.objects["instance"]
        payload = progress.get_value("payload")
        # TODO: Fail if this is not supported version (<6.4)
        splunk_version_from_payload(instance, payload)
        instance.dirty = True

    def _new_command(self):
        command = super(GetSplunkInformationStage, self)._new_command()
        command.set_value("target",
                          copy(self._workflow.task.get_value("payload")))
        return command


class StartSplunkStage(OneCommandWorkflowStageBase):
    """Start Splunk stage
    """
    TYPE = "agent:splunk:start"
    DESCRIPTION = "Start Splunk instance"
    COMMAND = "startsplunk"

    def _new_stage(self, stage):
        super(StartSplunkStage, self)._new_stage(stage)
        instance = self._workflow.objects["instance"]
        stage["payload"] = {
            "splunkHome": instance.splunk_home
        }

    def _new_command(self):
        command = super(StartSplunkStage, self)._new_command()
        command.set_value("target",
                          copy(self._workflow.task.get_value("payload")))
        return command

    @classmethod
    def should_create(cls, workflow):
        instance = workflow.objects["instance"]
        return not instance.is_dmc_server


class GetSplunkManagementUriStage(OneCommandWorkflowStageBase):
    """Management Port Splunk Stage
    """
    TYPE = "agent:splunk:mgmtUri"
    DESCRIPTION = "Get Splunk management uri"
    COMMAND = "getsplunkmanagementport"

    def _new_stage(self, stage):
        super(GetSplunkManagementUriStage, self)._new_stage(stage)
        instance = self._workflow.objects["instance"]
        stage["payload"] = {
            "splunkHome": instance.splunk_home
        }

    def _handle_completed(self, command, progress):
        super(GetSplunkManagementUriStage, self) \
            ._handle_completed(command, progress)
        instance = self._workflow.objects["instance"]
        remotehostname = instance.get_value("remoteHostname")
        port = progress.get_value(("payload", "port"))
        # Getting management port is not enough
        instance.splunk_mgmt_uri = "https://%s:%s" % (remotehostname, port)
        instance.dirty = True

    def _new_command(self):
        command = super(GetSplunkManagementUriStage, self)._new_command()
        command.set_value("target",
                          copy(self._workflow.task.get_value("payload")))
        return command

    @classmethod
    def should_create(cls, workflow):
        """We need this stage only when we don't know how
        to get access to this instance. If user specified
        mgmtUri - we don't need to discover Splunk port
        """
        instance = workflow.objects["instance"]
        return not instance.has_path("splunkMgmtUri")


class VerifySplunkManagementUriStage(OneCommandWorkflowStageBase):
    """Verify Management Uri Stage
    """
    TYPE = "agent:splunk:verifysplunkmanagementuri"
    DESCRIPTION = "Verify Splunk management uri"
    COMMAND = "verifysplunkmanagementuri"

    def _new_command(self):
        command = super(VerifySplunkManagementUriStage, self)._new_command()
        command.set_value("target",
                          copy(self._workflow.task.get_value("payload")))
        return command


class EnableDistributedManagementStage(OneCommandWorkflowStageBase):
    """Enable distributed management control stage
    """
    TYPE = "agent:splunk:enableDistributedManagement"
    DESCRIPTION = "Enable distributed management"
    COMMAND = "enabledistributedmanagementcontrol"

    def _new_stage(self, stage):
        super(EnableDistributedManagementStage, self)._new_stage(stage)
        instance = self._workflow.objects["instance"]
        stage["payload"] = {
            "splunkHome": instance.splunk_home
        }

    def _new_command(self):
        command = super(EnableDistributedManagementStage, self)._new_command()
        command.set_value("target",
                          copy(self._workflow.task.get_value("payload")))
        return command

    def _handle_completed(self, command, progress):
        super(EnableDistributedManagementStage, self)\
            ._handle_completed(command, progress)
        instance = self._workflow.objects["instance"]
        instance.splunk_pass_key = progress.get_value(("payload", "passkey"))

    @classmethod
    def should_create(cls, workflow):
        """We should not try to run it for dmc-server, as we get token for
        connection on start
        """
        instance = workflow.objects["instance"]
        return not instance.is_dmc_server and not instance.has_path("splunkPassKey")


class ChangeAdminPasswordStage(OneCommandWorkflowStageBase):
    """Enable distributed management control stage
    """
    TYPE = "agent:services:splunk:changeadminpassword"
    DESCRIPTION = "Change admin password if default"
    COMMAND = "changeuserpassword"

    def _new_stage(self, stage):
        super(ChangeAdminPasswordStage, self)._new_stage(stage)
        instance = self._workflow.objects["instance"]
        stage["payload"] = {
            "username": instance.splunk_admin_username
        }

    def handle_start(self):
        instance = self._workflow.objects["instance"]
        if instance.splunk_admin_username != DEFAULT_ADMIN_USERNAME:
            self._workflow.task.add_information(
                "Non-default user is used. Skipping changing password for admin user.")
            self.mark_completed()
            return

        if instance.has_path("splunkAdminPassword"):
            secure_storage = ioc.services.secure_storage()
            password = secure_storage.decrypt(instance.splunk_admin_password)
            if password != DEFAULT_ADMIN_PASSWORD:
                self._workflow.task.add_information(
                    "Admin password is different from default. Skipping changing password for admin user.")
                self.mark_completed()
                return

        super(ChangeAdminPasswordStage, self).handle_start()

    def _new_command(self):
        instance = self._workflow.objects["instance"]
        command = super(ChangeAdminPasswordStage, self)._new_command()
        command.set_value("target", {"instanceId": instance.instanceid})
        return command

    def _handle_completed(self, command, progress):
        super(ChangeAdminPasswordStage, self)\
            ._handle_completed(command, progress)
        instance = self._workflow.objects["instance"]
        if instance.has_path("splunkAdminPassword"):
            secure_storage = ioc.services.secure_storage()
            secure_storage.delete(instance.splunk_admin_password)
        instance.splunk_admin_password = progress.get_value(("payload", "password"))
        instance.dirty = True

    @classmethod
    def should_create(cls, workflow):
        """We should not try to run it for dmc-server, as we get token for
        connection on start
        """
        instance = workflow.objects["instance"]
        return not instance.is_dmc_server


class SetupDeploymentConfClientStage(OneCommandWorkflowStageBase):
    """Set up a deployment configuration client
    """
    TYPE = "agent:splunk:setupdeploymentconfclient"
    DESCRIPTION = "Set up a client that receives deployment configuration"
    COMMAND = "setupdeploymentconfclient"

    def _new_stage(self, stage):
        super(SetupDeploymentConfClientStage, self)._new_stage(stage)
        instance = self._workflow.objects["instance"]
        # In case of migration we also ask to verify if current configuration
        # does not require to be updated
        topology = self._workflow.get_entity("topologies", query={"topologyName": "default"})
        stage["payload"] = {
            "targetUri": self._workflow.get_dmc_instance().splunk_mgmt_uri_hostname_port,
            "clientName": instance.instanceid,
            "pass4SymmKey": topology.get_value(("deploymentServer", "secret"))
        }

    def _new_command(self):
        command = super(SetupDeploymentConfClientStage, self)._new_command()
        command.set_value("target", copy(self._workflow.task.get_value("payload")))
        return command

    @classmethod
    def should_create(cls, workflow):
        """We should not try to run it for dmc-server, as we get token for
        connection on start
        """
        instance = workflow.objects["instance"]
        return not instance.is_dmc_server


class VerifyDeploymentClientStage(OneCommandWorkflowStageBase):
    """Verify deployment client

    At this stage we want to wait and verify when client will be
    registered with deployment server
    """
    TYPE = "agent:splunk:verifydeploymentclient"
    DESCRIPTION = "Verify deployment client registration"
    COMMAND = "verifydeploymentclient"

    def _new_command(self):
        instance = self._workflow.objects["instance"]
        command = super(VerifyDeploymentClientStage, self)._new_command()
        command.set_value("payload", {"instanceId": instance.instanceid})
        return command

    @classmethod
    def should_create(cls, workflow):
        """We do not register dmc server as client for DS
        """
        instance = workflow.objects["instance"]
        return not instance.is_dmc_server


class DiscoverTopologyStage(OneCommandWorkflowStageBase):
    """Discover if current instance is SHC or IDXC instance
    """
    TYPE = "agent:splunk:discovertopology"
    DESCRIPTION = "Discover topology"
    COMMAND = "discovertopology"

    def _new_command(self):
        instance = self._workflow.objects["instance"]
        command = super(DiscoverTopologyStage, self)._new_command()
        command.set_value("target", {"instanceId": instance.instanceid})
        return command

    def _handle_completed(self, command, progress):
        instance = self._workflow.objects["instance"]
        instance.topology = progress.get_value(("payload", "topology"), default=topology_role_name.unassigned)
        super(DiscoverTopologyStage, self)._handle_completed(command, progress)

    @classmethod
    def should_create(cls, workflow):
        """We do not register dmc server as client for DS
        """
        instance = workflow.objects["instance"]
        return not instance.is_dmc_server and instance.get_value("@migration", default=False)


class InstanceWorkflow(WorkflowBase):
    """Instance workflow
    """

    _STAGES = [
        GetMachineInformationStage,
        VerifyBackwardConnectionStage,
        SetInstanceIdStage,
        GetSplunkInformationStage,
        StartSplunkStage,
        GetSplunkManagementUriStage,
        EnableDistributedManagementStage,
        VerifyInstanceIdStage,
        SetupDeploymentConfClientStage,
        ChangeAdminPasswordStage,
        VerifySplunkManagementUriStage,
        VerifyDeploymentClientStage,
        DiscoverTopologyStage
    ]
    _WORKFLOW = "instance_workflow"

    def _new_task(self):
        assert "instance" in self.objects
        task = super(InstanceWorkflow, self)._new_task()
        instance = self.objects["instance"]
        task.set_value("payload", {
            "instanceId": instance.instanceid
        })
        instance.set_value("task", {
            "taskId": task.taskid,
            "state": "new"
        })
        return task

    def _handle_start(self):
        super(InstanceWorkflow, self)._handle_start()
        instance = self.objects["instance"]
        instance.get_value("task")["state"] = "running"
        instance.dirty = True

    def _handle_completed(self):
        super(InstanceWorkflow, self)._handle_completed()
        instance = self.objects["instance"]
        instance.get_value("task")["state"] = "completed"
        instance.dirty = True

    def _handle_failed(self):
        super(InstanceWorkflow, self)._handle_failed()
        instance = self.objects["instance"]
        instance.get_value("task")["state"] = "failed"
        instance.dirty = True

    def get_dmc_instance(self):
        """Get dmc server instance
        """
        return self.get_entity("instances", query={
            "topology": topology_role_name.dmc
        })
