"""
Command to restore the repository changes from backup
"""

from agent import ioc, wtransaction
from agent.commands import CommandBase, CommandResult
from agent.services.cancel_pending_changes_service import CancelPendingChangesMode

VALID_TYPES = ["app", "group", "graph"]


def compute_type_and_name(key):
    """Returns the type and name for a given key

    ex: app.appName result: app, appName
    ex: group.test  result: group, test
    """
    result = key.split(".", 1)
    assert result[0] in VALID_TYPES
    return tuple(result)


class RestoreRepositoryChangesCommand(CommandBase):
    """Restore changes form backup
    """

    def __init__(self):
        self._predeployment_backup_repository = ioc.repositories.predeployment_backup_repository()
        self._graph_repository = ioc.repositories.installation_graph_repository()
        self.repository_factory = ioc.require_feature("repositoryForLogEventFactory")
        self._deploy_service = ioc.services.deploy_service()

    @wtransaction
    def execute(self, command):

        payload = command.get_value("payload")
        original_records = []

        if payload["mode"] == CancelPendingChangesMode.all:  # pylint: disable=comparison-with-callable
            original_records = self._predeployment_backup_repository.get_all()

        # loop through all the records in the backup and recover them
        for record in original_records:
            original_data = record.get_value("data")
            key = record.get_value("name")
            event_type, name = compute_type_and_name(key)
            # make sure the repository name is valid
            repository = ioc.require_feature(self.repository_factory[event_type])

            # if original data exists, restore the data in the associated repository
            if original_data:
                repository.upsert_raw(original_data, log_change=False)
            elif repository.exists(name):
                repository.delete(name, log_change=False)

        # delete all staged repository graphs since they are no longer valid
        # this will bring us back to the last committed state
        self._graph_repository.delete_all(query={"staged": True})

        self._deploy_service.invalidate_cache(
            instances_changed=False,
            groups_changed=True,
            apps_changed=True,
            ds_apps_changed=False)

        return CommandResult(
            completed=True,
            failed=False,
            description="Successfully recovered repository changes",
            payload=None)
