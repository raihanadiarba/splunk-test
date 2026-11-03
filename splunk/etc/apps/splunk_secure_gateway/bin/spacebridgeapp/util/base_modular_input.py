"""
Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved.

Base class for all modular_inputs in this app.  All new modular_inputs should extend off this.
"""
import logging
import sys
from abc import abstractmethod
from solnlib import modular_input
from spacebridgeapp.util.splunk_utils.common import modular_input_should_run
from spacebridgeapp.rest.services.splunk_service import get_cluster_mode, get_server_roles
from spacebridgeapp.util.config import load_config
from spacebridgeapp.logging import setup_logging
from spacebridgeapp.util import constants, kvstore_util
from splunk.clilib import cli_common as cli

KV_STORE = 'kv_store'
DISABLED = 'disabled'
SEARCHHEAD = 'searchhead'
ACCEPTED_CLUSTER_MODES = [DISABLED, SEARCHHEAD]
LOG_DEFAULT_FMT = '%(levelname)s [%(name)s:%(lineno)d] [%(funcName)s] [%(process)d] %(message)s'


def fallback_logger(mod_input_name, level=logging.INFO):
    logging.addLevelName(logging.INFO, 'INFO')
    handler = logging.StreamHandler(sys.stderr)
    formatter = logging.Formatter(LOG_DEFAULT_FMT)
    handler.setFormatter(formatter)
    logger = logging.getLogger(mod_input_name)
    logger.setLevel(level)
    logger.addHandler(handler)

    return logger


def is_noah() -> bool:
    """Is the current node part of a Noah stack?"""
    try:
        s3_path: str = cli.getOptConfKeyValue("server", "noahService", "remoteBundle")
        return True if s3_path else False
    except Exception:
        return False


class BaseModularInput(modular_input.ModularInput):
    log_mod_input_name = "ssg_modular_input.app"
    log_filename = f"{constants.SPACEBRIDGE_APP_NAME}_modular_input.log"
    config = None
    logger = None
    run_on_captain_only = False
    monitor_parent_process = False

    def _should_modular_input_run(self):
        try:
            # note: all rest.simpleRequest requests already have retry logic.
            # Also, if the code has reached retry limit
            # splunk core will restart modular inputs in accordance with the 'interval' value from `inputs.conf` file
            server_roles = get_server_roles(self.session_key)
            cluster_mode = get_cluster_mode(self.session_key)
            return cluster_mode in ACCEPTED_CLUSTER_MODES and KV_STORE in server_roles
        except Exception:
            return False

    @abstractmethod
    def do_run(self, inputs):
        if self.monitor_parent_process:
            self.register_orphan_handler(self.on_process_is_orphan)

        if not self._should_modular_input_run():
            self.on_should_not_run()
            return False

        self.wait_for_kvstore()
        self.config = load_config(self.session_key)
        self.logger = self.setup_logging(self.config)

        if self.config is None or self.logger is None:
            logging.warning("Modular input: %s can't be run due to missing configs/logger setup", self.name)
            return False

        if self.run_on_captain_only and not is_noah():
            return modular_input_should_run(self.session_key, self.logger)

        return True

    def wait_for_kvstore(self):
        try:
            kvstore_util.wait_until_ready(self.session_key)
        except TimeoutError:
            self.logger.exception('KV store never initialized while attempting to run modular input: %s', self.name)
            raise

    def setup_logging(self, config):
        try:
            return setup_logging(self.log_filename, self.log_mod_input_name, config=config)
        except Exception:
            logger = fallback_logger(self.log_mod_input_name)
            logger.info(f'{self.log_filename} could not be created, will attempt to reinitialize in the next run of {self.log_mod_input_name}')
            return None

    def on_should_not_run(self):
        # do nothing by default
        pass

    # This method should be called when parent process id (modular input wrapper) is terminated
    def on_process_is_orphan(self):
        # do nothing by default
        pass
