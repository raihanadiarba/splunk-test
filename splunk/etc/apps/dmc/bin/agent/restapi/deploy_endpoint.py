"""
Splunk Deployment Server deploy endpoint
"""

# pylint: disable=too-few-public-methods

import logging

import bottle
from bottle import HTTPError

from agent import ioc
from agent.models import View
from agent.restapi import eai_helpers

from agent.common.access_control import Capability
from agent.restapi import access_control_helpers
from agent.restapi.helpers import DEPLOY_ERROR_REASON_IN_PROGRESS, DEPLOY_ERROR_REASON_LOCKED, \
    DEPLOY_ERROR_ACTION_CHECK_STATUS, DEPLOY_ERROR_ACTION_FOR_LOCKED


class DeployEndpoint(ioc.Component):
    """Deploy endpoint
    Handles:
        POST /deploy
    """

    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)
        self.service = ioc.services.deploy_service()
        bottle.post('/deploy')(self._deploy)
        bottle.get('/deploy')(self._get_last_deploy)
        bottle.post('/deploy/lock')(self._lock)
        bottle.post('/deploy/unlock')(self._unlock)

    # pylint: disable=unused-argument
    @access_control_helpers.edit(Capability.EDIT_DEPLOY_QUEUE)
    @eai_helpers.response_formatted
    @eai_helpers.make_name('taskId')
    def _deploy(self, **kwargs):
        """Deploy DS configuration
        """
        with self.service.lock.get_runtime_scope() as granted:
            cannot_start = "Cannot start a new deployment task"
            if not granted:
                raise HTTPError(400,
                                cannot_start +
                                DEPLOY_ERROR_REASON_IN_PROGRESS +
                                DEPLOY_ERROR_ACTION_CHECK_STATUS)

            if self.service.lock.is_locked():
                raise HTTPError(400,
                                cannot_start +
                                DEPLOY_ERROR_REASON_LOCKED +
                                DEPLOY_ERROR_ACTION_FOR_LOCKED)

            deploy_task = self.service.deploy()

        data = deploy_task.json(View.RestView)
        return eai_helpers.eai_result([data], 1)
    # pylint: enable=unused-argument

    @eai_helpers.response_formatted
    def _get_last_deploy(self):
        """Return info about the last deploy task
        """
        deploy_info = self.service.get_last_deploy()
        return "lastDeploy", deploy_info

    @access_control_helpers.edit(Capability.EDIT_DEPLOY_QUEUE)
    def _lock(self):
        """
        Lock DMC from deployment operations
        Fail if a deployment operation is in progress or the last one has failed.
        If successful, no new deployment operation is allowed until unlock is called.
        """
        if self.service.lock.lock():
            return

        if self.service.last_deploy_state() == "failed":
            raise HTTPError(400, "Can't lock deployment because the last DMC deployment task has failed.")

        raise HTTPError(503, "Can't lock deployment because a deployment operation or task is in-progress.")

    @access_control_helpers.edit(Capability.EDIT_DEPLOY_QUEUE)
    def _unlock(self):
        """
        Unlock DMC deployment
        """
        self.service.lock.unlock()
