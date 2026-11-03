"""
Predeployment backup entity
"""

from agent.models import JSONEntity


class PreDeploymentBackup(JSONEntity):
    """
    Predeployment backup entity
    """

    _ID_FIELD = "name"
    COLLECTION = "predeployment_backup"
