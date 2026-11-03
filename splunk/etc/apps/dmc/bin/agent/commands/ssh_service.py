"""
SSH Service
"""

import logging
import subprocess
import os
import tempfile
import sys

from collections import namedtuple

from agent import ioc
from agent.common import helpers

SSHResult = namedtuple("SSHResult", ("returncode", "stdout", "stderr"))


def _execute_process(args):
    """Execute a process via subprocess.Popen"""
    process = subprocess.Popen([str(x) for x in args],
                               stdout=subprocess.PIPE,
                               stderr=subprocess.PIPE,
                               shell=False,
                               env=helpers.clean_environ(os.environ))
    output, error = process.communicate()
    if sys.version_info >= (3, 0):
        output = output.decode()
        error = error.decode()
    assert process.returncode is not None
    return process, output, error


# pylint: disable=too-few-public-methods, useless-object-inheritance
class SSHKeyPath(object):
    """
    SSH Key path class that creates and destroys temp file within
    the "with" block.
    """

    def __init__(self, instance):
        self._splunk_home = ioc.components.splunk_home()
        self._secure_storage = ioc.services.secure_storage()
        self._temp_file_path = os.path.join(self._splunk_home.home(), "var", "run", "dmc")
        helpers.mkdir_p(self._temp_file_path)
        self._instance = instance
        self._temp_file = None

    def __enter__(self):
        """
        1)Make a temp file if a "secret" exists on the ssh.
        Load the temp file with the private key and flush the changes.
        2) If secret does not exist on ssh then return the keyPath
        """
        ssh = self._instance.get_value("ssh", default={})
        ret = None
        if "keyString" in ssh:
            self._temp_file = tempfile.NamedTemporaryFile(dir=self._temp_file_path)
            key_string = self._secure_storage.decrypt(ssh["keyString"])
            self._temp_file.write(key_string.encode())
            self._temp_file.flush()
            ret = self._temp_file.name
        else:
            ret = self._instance.get_value(("ssh", "keyPath"))
        return ret

    def __exit__(self, exc_type=None, exc_val=None, exc_tb=None):
        """Delete the temp file after the ssh command is executed
        """
        if self._temp_file:
            self._temp_file.close()


# pylint: disable=useless-object-inheritance
class SSHClient(object):
    """SSH Client
    """

    def __init__(self, instance):
        self._logger = logging.getLogger(self.__class__.__name__)
        self.__instance = instance

    def execute(self, *args):
        """Execute argumens on remote instance
        """

        with SSHKeyPath(self.__instance) as file_path:
            ssh = ["ssh",
                   "-o",
                   "UserKnownHostsFile=/dev/null",
                   "-o",
                   "StrictHostKeyChecking=no",
                   "-o",
                   "CheckHostIP=no",
                   "%s@%s" % (self.__instance.get_value(("ssh", "username")),
                              self.__instance.get_value("remoteHostname")),
                   "-p",
                   str(self.__instance.get_value(("ssh", "port"))),
                   "-i",
                   file_path] + [str(x) for x in args]
            process, output, error = _execute_process(ssh)
            return SSHResult(process.returncode,
                             output,
                             error)


# pylint: disable=too-few-public-methods, useless-object-inheritance
class LocalClient(object):
    """Local Client
    """

    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__ + "-local")

    # pylint: disable=no-self-use
    def execute(self, *args):
        """Execute argumens on local instance
        """
        process, output, error = _execute_process(args)
        return SSHResult(process.returncode,
                         output,
                         error)


# pylint: disable=no-self-use
class SSHService(ioc.Component):
    """SSH Service
    """

    def get_client(self, instance):
        """Get SSH Client for instance
        """
        ret = None
        if not instance.has_path("ssh") or not instance.get_value("ssh"):
            ret = LocalClient()
        else:
            ret = SSHClient(instance)
        return ret
# pylint: enable=too-few-public-methods, no-self-use
