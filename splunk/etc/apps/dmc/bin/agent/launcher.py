"""
App instance
"""

import logging
import sys
import os
import traceback
import signal
import threading

import splunk.clilib.cli_common

from agent import ioc
from agent.common.helpers import to_bool


# pylint: disable=too-few-public-methods
class Launcher():

    """Main class

    Main entry point to agent
    """
    def __init__(self, argv, features):
        self.logger = logging.getLogger(self.__class__.__name__)
        self.rest_http_server = ioc.restapi.httpserver()
        self.splunk_host = ioc.components.splunk_host()
        self.dmc_enabler = ioc.components.dmc_enabler()
        self.command = None
        self.argv = argv
        self.controllers = []
        self.features = features

    def run(self):
        """Run command specified in constructor

        Execute specified in argv commands
        """
        # Find command
        if len(self.argv) > 0:
            self.command = self.argv[0]
            del self.argv[0]

        func = {
            "help": self._help,
            "server": self._server,
            "enable": self._enable,
            }.get(self.command, self._help)
        return func()

    def _help(self):
        """Show help
        """
        assert self
        print("Help is coming...")
        return 1

    def _get_token(self):
        """Get the Splunk auth token from stdin if we're in integrated mode
        """
        token = sys.stdin.readline().rstrip()
        return token

    def _server(self):
        """Server
        """
        signal.signal(signal.SIGTERM, self._signal_handler)
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGUSR1, self._signal_usr1)
        # In case of Windows we need to catch also Ctrl+C (see src/util/ProcessRunner.cpp)
        if os.name == "nt" and hasattr(signal, "CTRL_C_EVENT"):
            # pylint: disable=no-member
            signal.signal(signal.CTRL_C_EVENT, self._signal_handler)
            # pylint: enable=no-member
        self._setup_debugger()
        if os.getenv("DEVELOPMENT_DMC_SERVER_STANDALONE"):
            # Beside running Splunkd with the env var above, set the following in server.conf
            # [dmc]
            # ...
            # pass4SymmKey = changeme
            # ...
            token = self.splunk_host.get_remote_token(splunk.clilib.cli_common.getMgmtUri(), "changeme")
        else:
            token = self._get_token()

        self.splunk_host.connect(token=token)
        if not self.splunk_host.verify_splunk_dependencies():
            print("Failed to enable required KVStore collections.")
            sys.exit(1)
        task = self.splunk_host.update_dmc_as_instance()
        if task is not None:
            task_messages = task.format_messages()
            if task_messages:
                print(task_messages)
            if task.state != "completed":
                print("Failed to update DMC Server instance.")
                sys.exit(1)
        self.controllers = [
            ioc.components.tasks_controller(),
            ioc.components.commands_controller(),
            ioc.components.stdin_controller(),
        ]
        self.logger.debug("Starting controllers and server")
        for controller in self.controllers:
            controller.start()
        exit_code = 0
        try:
            self.rest_http_server.start()
            self.logger.debug("REST HTTP Server stopped")
        # pylint: disable=broad-except
        except Exception as exc:
            # pylint: enable=broad-except
            # Let's show the error to stderr, so splunkd.log will see it
            sys.stderr.write(str(exc))
            sys.stderr.flush()
            # Detailed error to dmc_agent.log
            self.logger.error(traceback.format_exc())
            exit_code = 1
        for controller in self.controllers:
            controller.stop()
        self.logger.info("Server exited (exit code %d)", exit_code)
        return exit_code

    def _enable(self):
        """Enable
        """
        self.dmc_enabler.enable(self.argv)
        return 0

    def _setup_debugger(self):
        """Configure remote debugger

        See https://www.jetbrains.com/pycharm/help/remote-debugging.html for details
        SPLUNK_DMC_PYCHARM_DEBUGGER_ENABLE - enable debugger
        SPLUNK_DMC_PYCHARM_DEBUGGER_HOSTNAME - specify where remote debugger is launched
        SPLUNK_DMC_PYCHARM_DEBUGGER_PORT - port if different from 5678
        SPLUNK_DMC_PYCHARM_DEBUGGER_SUSPEND - if want to suspend right after connected
        """
        assert self
        pycharm_debugger = to_bool(os.environ.get("SPLUNK_DMC_PYCHARM_DEBUGGER_ENABLE", False))
        if pycharm_debugger:
            import pydevd  # pylint: disable=import-outside-toplevel, import-error

            # pylint: disable=bare-except
            try:
                pydevd.settrace(os.environ.get("SPLUNK_DMC_PYCHARM_DEBUGGER_HOSTNAME"),
                                port=int(os.environ.get("SPLUNK_DMC_PYCHARM_DEBUGGER_PORT", 5678)),
                                suspend=to_bool(os.environ.get("SPLUNK_DMC_PYCHARM_DEBUGGER_SUSPEND", False)),
                                stdoutToServer=True,
                                stderrToServer=True)
            except ImportError:
                self.logger.error("DEBUGGER: Remote server is specified, but libary has not been installed.")
            except:  # noqa: E722
                self.logger.error("DEBUGGER: Failed to connect to remote debugger. %s", traceback.format_exc())
            # pylint: enable=bare-except

    def _signal_handler(self, signum, frame):
        """Handle signal and terminate HTTP server,
        which will trigger termination of everything else
        """
        self.logger.info("Got signal %d, frame %s", signum, frame)
        self.rest_http_server.stop()

    def _signal_usr1(self, signum, frame):
        """
        Dump call stacks of all threads (for debugging)
        """
        id2name = {th.ident: th.name for th in threading.enumerate()}
        code = ["----------- THREADS -----------"]
        # pylint: disable=protected-access
        for thread_id, stack in sys._current_frames().items():
            code.append("")
            code.append("# Thread: %s(%d)" % (id2name.get(thread_id, ""), thread_id))
            for filename, lineno, name, line in traceback.extract_stack(stack):
                code.append('File: "%s", line %d, in %s' % (filename, lineno, name))
                if line:
                    code.append("\t%s" % (line.strip()))
        self.logger.error((os.linesep + "\t").join(code))
