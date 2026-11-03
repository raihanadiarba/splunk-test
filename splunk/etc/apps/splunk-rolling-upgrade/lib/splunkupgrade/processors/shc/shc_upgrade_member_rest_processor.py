import logging
import os.path
import sys
from subprocess import DEVNULL, Popen
from typing import Optional
from http import HTTPStatus

from splunkupgrade.data.shc.kv_upgrade_progress_peer import KvUpgradePeerStep
from splunkupgrade.data.upgrade_endpoints_response import GenericResponse
from splunkupgrade.processors.common import (
    get_auth_token,
    get_rest_uri,
    get_servername,
    create_generic_response_with_message_and_status,
)
from splunkupgrade.processors.base_processor import RestProcessorBase
from splunkupgrade.upgrader.upgrader_utils import try_fail_upgrade, StatusUpdater
from splunkupgrade.utils.constants import GeneralConstants, HTTPMethod
from splunkupgrade.utils.exceptions import ResponseSafeToPrintException
from splunkupgrade.utils.inputs_conf import InputsConfig
from splunkupgrade.utils.types import JsonObject

logger = logging.getLogger(__name__)


class ShcUpgradeMemberRestProcessor(RestProcessorBase):
    def __init__(self, upgrader_path: Optional[str] = None):
        super().__init__("/upgrade/shc/member_upgrade_internal", "shc", [HTTPMethod.POST.value])
        self._upgrader_path = upgrader_path

    def _pre_process(self, in_request: bytes):
        self._inputs_config = InputsConfig()
        return super()._pre_process(in_request)

    def _do_process(self, request: JsonObject) -> GenericResponse:
        # this assert is here to make mypy happy
        assert self._splunk_service

        servername = get_servername(request)
        token = get_auth_token(request)
        uri = get_rest_uri(request)
        if GeneralConstants.SPLUNK_HOME not in os.environ:
            message = "SPLUNK_HOME environmental variable is not set"
            raise ResponseSafeToPrintException(message, HTTPStatus.SERVICE_UNAVAILABLE)
        if not self._upgrader_path:
            self._upgrader_path = os.path.join(
                os.environ[GeneralConstants.SPLUNK_HOME], GeneralConstants.UPGRADER_RELATIVE_PATH
            )
        if not os.path.isfile(self._upgrader_path):
            logger.error(f"Path='{self._upgrader_path}' does not exist")
            raise ResponseSafeToPrintException(
                "Upgrader script does not exist", HTTPStatus.SERVICE_UNAVAILABLE
            )

        status_updater = StatusUpdater(self._splunk_service)
        status_updater.update_peer_status_to(servername, KvUpgradePeerStep.RUNNING_UPGRADE_PROCESS)
        cmd = [
            sys.executable,
            self._upgrader_path,
            "--peer_name",
            servername,
            "--rest_uri",
            uri,
            "--session_key",
            token,
        ]
        logger.info(f"Running script='{self._upgrader_path}'")
        try:
            # Safe here: launches a fixed internal Python script with shell=False and no user-selected executable.
            proc = Popen(  # nosemgrep
                cmd, stdin=DEVNULL, stdout=DEVNULL, stderr=DEVNULL, close_fds=True
            )
        except OSError as e:
            logger.error(f"Failed to create process: {e}")
            raise ResponseSafeToPrintException(
                "Failed to create upgrader process", HTTPStatus.SERVICE_UNAVAILABLE
            )
        return create_generic_response_with_message_and_status(
            HTTPStatus.OK, f"Member='{servername}' upgrade initiated. Pid='{proc.pid}'"
        )

    def _process(self, request: JsonObject) -> GenericResponse:
        assert self._config
        try:
            return self._do_process(request)
        except Exception as e:
            if self._splunk_service:
                try_fail_upgrade(self._splunk_service)
            raise e
