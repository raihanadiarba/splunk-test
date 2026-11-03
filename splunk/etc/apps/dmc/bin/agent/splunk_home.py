"""
SPLUNK_HOME
"""

import logging
import os


# pylint: disable=too-many-instance-attributes
class SplunkHome():
    """
    Retrieves the location of SPLUNK_HOME and other useful paths
    """
    _splunk_home = None
    _splunk_etc = None
    _system = None
    _apps = None
    _deployment_apps = None
    _master_apps = None
    _shdeployer_apps = None

    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)
        self.calculate()

    @classmethod
    def _bundle_root(cls, *bundle_root):
        """Calculate the root for a specific type of bundle"""
        return os.path.join(
            cls._splunk_etc,
            *bundle_root)

    @classmethod
    def calculate(cls):
        """Calculate all paths we need"""
        cls._splunk_home = os.path.normpath(os.environ["SPLUNK_HOME"])
        cls._splunk_etc = os.path.normpath(os.environ["SPLUNK_ETC"])
        cls._system = cls._bundle_root("system")
        cls._apps = cls._bundle_root("apps")
        cls._repository = cls._bundle_root("repository")
        cls._repository_add = cls._bundle_root("repository", "_add")
        cls._repository_remove = cls._bundle_root("repository", "_remove")
        cls._unvetted_apps = cls._bundle_root("repository", "_unvetted")
        cls._vetted_apps = cls._bundle_root("repository", "_vetted")
        # TODO: should we read it from repositoryLocation in serverclass.conf[global]?
        cls._deployment_apps = cls._bundle_root("deployment-apps")
        cls._predeployment_apps = cls._bundle_root("predeployment-apps")
        cls._predeployment_apps_temp = cls._bundle_root("predeployment-apps-tmp")
        cls._predeployment_apps_backup = cls._bundle_root("predeployment-apps-backup")
        cls._master_apps = cls._bundle_root("master-apps")
        cls._shdeployer_apps = cls._bundle_root("shcluster", "apps")

    def home(self):
        """SPLUNK_HOME
        """
        return self._splunk_home

    def etc(self):
        """SPLUNK_ETC
        """
        return self._splunk_etc

    def system(self):
        """SPLUNK_HOME/etc/system
        """
        return self._system

    def apps(self):
        """SPLUNK_HOME/etc/apps
        """
        return self._apps

    def repository(self):
        """SPLUNK_HOME/etc/repository
        """
        return self._repository

    def repository_staged_add(self):
        """SPLUNK_HOME/etc/repository/_add
        """
        return self._repository_add

    def repository_staged_remove(self):
        """SPLUNK_HOME/etc/repository/_remove
        """
        return self._repository_remove

    def unvetted_apps(self):
        """SPLUNK_HOME/etc/repository/_unvetted
        """
        return self._unvetted_apps

    def vetted_apps(self):
        """SPLUNK_HOME/etc/repository/_vetted
        """
        return self._vetted_apps

    def deployment_apps(self):
        """SPLUNK_HOME/etc/deployment-apps
        """
        return self._deployment_apps

    def predeployment_apps(self):
        """SPLUNK_HOME/etc/predeployment-apps
        """
        return self._predeployment_apps

    def predeployment_apps_temp(self):
        """SPLUNK_HOME/etc/predeployment-apps-tmp
        """
        return self._predeployment_apps_temp

    def predeployment_apps_backup(self):
        """SPLUNK_HOME/etc/predeployment-apps-backup
        """
        return self._predeployment_apps_backup

    def master_apps(self):
        """SPLUNK_HOME/etc/master-apps
        """
        return self._master_apps

    def shdeployer_apps(self):
        """SPLUNK_HOME/etc/shcluster/apps
        """
        return self._shdeployer_apps
