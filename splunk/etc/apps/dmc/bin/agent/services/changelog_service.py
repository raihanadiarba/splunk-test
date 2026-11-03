"""
Service for apps installed onto DMC for deployment
"""
import json

import time
import logging
from builtins import range  # pylint: disable=redefined-builtin
import six

import agent

from agent import ioc
from agent.common.helpers import Enum
from agent.models import PendingChangelog, View
from agent.models.change import EventType
from agent.services.stanzas_service import get_node_bundle_id

_logger = logging.getLogger(__name__)

_SEQ_MAX = int("f"*16, 16)

_EVENT_KEY_USER = "user"

_DMC_AUDIT_ACTION = "dmc_operation"


def _get_audit_info(change):
    """
    Get info field value for the audit event
    """
    change_json = change.json(View.RestView)
    return {key: change_json[key] for key in change_json if key not in (
        # Take out "user" field since its value will be sent in a separate "user" field in the audit event.
        _EVENT_KEY_USER)}


# pylint: disable=too-few-public-methods, useless-object-inheritance
@six.add_metaclass(Enum)
class OpType(object):
    """
    Operation type
    """

    @staticmethod
    def _compute(name):
        """
        return name
        """
        return name

    insert = _compute
    update = _compute
    delete = _compute
    upgrade = _compute
    none = _compute


# pylint: enable=too-few-public-methods


# Event types that are not actual changes and thus not shown by UI
_EXCLUDED_EVENT_TYPES = [
    EventType.graph,
    EventType.deploy,
    EventType.cancel_changes
]


def _get_query_with_exclusion(req_query):
    """
    Add exclusion clause to req_query and return it.
    """
    exclusion = {"$and": [{"type":  {"$ne": event_type}} for event_type in _EXCLUDED_EVENT_TYPES]}
    return {"$and": [req_query, exclusion]} if req_query else exclusion


def add_client_name(instance_repository, changes):
    """
    Add client names for forwarders
    """
    def get_instance_id(change):
        """
        Get instance id if the change is for a forwarder
        """
        ret = None
        if change["type"] == EventType.stanza:  # pylint: disable=comparison-with-callable
            ret = get_node_bundle_id(change["key"])

        return ret

    change_instance_id_list = [get_instance_id(change) for change in changes]
    instance_id_list = [instance_id for instance_id in change_instance_id_list if instance_id]

    if instance_id_list:
        query = {"$or": [{"_key": instance_id} for instance_id in instance_id_list]}
        fields = ["instanceId", "clientName"]
        instances = instance_repository.get_all(
            query=query,
            fields=fields
        )
    else:
        instances = []

    client_name_by_instance_id = {instance.objid: instance.get_value("clientName") for instance in instances}

    for change in changes:
        instance_id = get_instance_id(change)
        if instance_id:
            change["@clientName"] = client_name_by_instance_id.get(instance_id)


class ChangelogService(ioc.Component):
    """Service to work with changelog
    """

    def __init__(self):
        self._repository = ioc.repositories.pending_changelog_repository()
        self._deployed_repository = ioc.repositories.deployed_changelog_repository()
        self._instance_repository = ioc.repositories.instances_repository()
        self._tasks_service = ioc.services.tasks_service()
        self._splunk_host = agent.ioc.components.splunk_host()

        self.check_cancel_progress = True
        self._seq_num = None

        configuration = ioc.components.configuration()
        self._audit_trail_batch_size = configuration.get_int("audit_trail_batch_size", 200)

    @staticmethod
    def _get_event_seq_number(event):
        """ Get event seq number or 0 if None is passed in
        """
        if event is None:
            return 0

        hex_seq_number = event.objid
        return int(hex_seq_number, 16)

# pylint: disable=too-many-arguments
# pylint: disable=too-many-branches
    def record(self, event_type, user,
               key=None,
               before=None,
               after=None,
               action=None,
               op_type=None,
               deployed=False,
               skip_audit=False):
        """
        Insert a log entry.
        It should be done before the change is saved. Otherwise, we would miss a change in changelog
        if there's a crash after the save but before the insert.
        This method should be called under a "transaction" together with the operation to be logged.
        Essentially, all logged operations need to be serialized so that there's a strict order which is
        represented by seq numbers in the log.
        TODO SPL-113617: add assertion or check to ensure this method is called within a "transaction"
        """
        # check if a cancel task is in progress and return error if so
        if self.check_cancel_progress:
            if self.is_cancel_in_progress():
                raise agent.ServerException(fmt="A cancel pending changes request is in progress")
            self.check_cancel_progress = False

        epoch_time = time.time()

        if self._seq_num is None:
            last = self._get_last_one_from_pending_or_deployed(fields=("name",))
            self._seq_num = self._get_event_seq_number(last)

        if self._seq_num == _SEQ_MAX:
            # We should not reach this in practice since it will take thousands of billions of years
            raise agent.ServerException(fmt="seq_num max reached")

        self._seq_num += 1

        if op_type is None:
            if after is None:
                op_type = OpType.delete
            else:
                if before is None:
                    op_type = OpType.insert
                else:
                    op_type = OpType.update

        event_json = {
            "name": self._get_seq_hex(),
            "time": epoch_time,
            "user": user,
            "type": event_type,
            "key": key,
            "before": before,
            "after": after,
            "action": action,
            # op_type can be derived from before and after. Put it into kv store so that it can be sorted.
            "opType": op_type
        }

        event = PendingChangelog(event_json)
        if deployed:
            self._save_to_deployed(user, epoch_time, [event], skip_audit)
        else:
            self._repository.insert(event)

        if event_type == EventType.deploy:  # pylint: disable=comparison-with-callable
            self._move_before_to_deployed(user, epoch_time, skip_audit)
            return

    def update(self, event):
        """Update the event
        """
        self._repository.update(event)

    def is_cancel_in_progress(self):
        """Checks if a cancel task is in progress, if the task is not complete False will be returned, In addition
        a new workflow will be triggered if the task failed.
        """
        query = {"type": EventType.cancel_changes}
        results = self._repository.get_all(query=query, limit=1, sort=(("_key", -1),))
        cancel_in_progress = False
        if len(results) == 1:
            entry = results[0]
            task_id = entry.get_value(("key", "taskId"))
            task = self._tasks_service.get(task_id)
            if task.get_value("state") != "completed":
                cancel_in_progress = True
                if task.get_value("state") == "failed":
                    task = self._tasks_service.new_task("cancel_pending_changes",
                                                        payload=task.get_value("payload"))
                    entry.set_value("key", {"taskId": task.get_value("taskId")})
                    self._repository.update(entry)
        return cancel_in_progress

    def clear_changelog(self):
        """Delete all records in changelog
        """
        self._repository.delete_all()

    def _get_last_one_from_pending_or_deployed(self, query=None, fields=None):
        """
        Get the last record from the pending log or the deployed log.
        If not found, return None.
        """
        def get_seq_num_and_entity(repository):
            """
            Get seq number and entity pair of the last record from the pending log or the deployed log.
            If not found, return (0, None).
            """

            entities = repository.get_all(
                query=query,
                limit=1,
                fields=fields,
                sort=(("_key", -1),))

            if not entities:
                entity = None
            else:
                assert len(entities) == 1
                entity = entities[0]

            return self._get_event_seq_number(entity), entity

        pending_seq_num, pending_entity = get_seq_num_and_entity(self._repository)
        deployed_seq_num, deployed_entity = get_seq_num_and_entity(self._deployed_repository)

        # Entities in the pending log will be bulk deleted after they are copied into the deployed log.
        # That delete operation may not be transactional and may fail in the middle.
        # By selecting the later one from both logs, we won't miss the latest record.
        return pending_entity if pending_seq_num > deployed_seq_num else deployed_entity

    def add_to_before_value(self, properties):
        """
        Update 'before' field of the last record in the pending log
        """
        self._add_to_value("before", properties)

    def add_to_after_value(self, properties):
        """
        Update 'after' field of the last record in the pending log
        """
        self._add_to_value("after", properties)

    def add_to_key_value(self, properties):
        """
        Update 'key' field of the last record in the pending log
        """
        self._add_to_value("key", properties)

    def _add_to_value(self, field_name, properties):
        """
        Update the last record in the pending log
        """
        tail = self._repository.get(self._get_seq_hex())

        field_value = tail.get_value(field_name)
        if field_value:
            field_value.update(properties)
        else:
            field_value = properties
        tail.set_value(field_name, field_value)
        self._repository.update(tail)

    def _get_seq_hex(self):
        """
        Return latest seq number in hex with 16 char fixed size
        """
        seq_hex = "%016x" % self._seq_num
        return seq_hex

    def _move_before_to_deployed(self, user, epoch_time, skip_audit):
        """
        Move changes except the last one (should be of deploy type)
        from changelog collection to 'deployed' collection
        """
        self._save_to_deployed(user, epoch_time, self._repository.get_all(), skip_audit)
        self._repository.delete_all()

    def _save_to_deployed(self, user, epoch_time, changes, skip_audit):
        """
        Save changes to 'deployed' collection
        """
        batch = []
        for change in changes:
            change.set_value("deployedBy", user)
            change.set_value("deployedOn", epoch_time)

            batch.append(change)

        if not skip_audit:
            self._send_to_audit_trail(batch)

        self._deployed_repository.batch_save(batch)

    def read_all_pending_with_total(
            self,
            req_query,
            count,
            offset,
            sort_key,
            reverse):
        """
        Return changes made after the last deploy
        :return {tuple} (results, total):
        """
        req_query = _get_query_with_exclusion(req_query)

        raw = self._repository.get_all_with_total(
            query=req_query,
            limit=count,
            skip=offset,
            sort=((sort_key,
                   -1 if reverse
                   else 1),))

        value_list = [x.json(View.RestView) for x in raw.results]

        add_client_name(self._instance_repository, value_list)

        for val in value_list:
            val["state"] = "pending"

        return value_list, raw.total

    def read_all_deployed_with_total(
            self,
            req_query,
            count,
            offset,
            sort_key,
            reverse):
        """
        Return changes made after the last deploy
        :return {tuple} (results, total):
        """
        req_query = _get_query_with_exclusion(req_query)

        raw = self._deployed_repository.get_all_with_total(
            query=req_query,
            limit=count,
            skip=offset,
            sort=((sort_key,
                   -1 if reverse
                   else 1),))

        value_list = [x.json(View.RestView) for x in raw.results]

        add_client_name(self._instance_repository, value_list)

        for val in value_list:
            val["state"] = "deployed"

        return value_list, raw.total

    def get_last_deploy_record(self):
        """
        Return the last deploy record
        """
        query = {"type":  EventType.deploy}
        return self._get_last_one_from_pending_or_deployed(query=query)

    def _send_to_audit_trail(self, changes):
        """
        Send to audit trail
        """
        path_segment = "/services/admin/audit-trail"

        batch_size = self._audit_trail_batch_size

        splunk_service = self._splunk_host.get_service()

        audited_changes = [change for change in changes if change.get_value("type") not in _EXCLUDED_EVENT_TYPES]

        for batch in [audited_changes[i:i+batch_size] for i in range(0, len(audited_changes), batch_size)]:
            body = []
            for change in batch:
                user = change.get_value("user")
                event = {
                    "user": user,
                    "action": _DMC_AUDIT_ACTION,
                    "info": _get_audit_info(change)
                }
                body.append(event)

            splunk_service.post(
                path_segment=path_segment,
                # The REST handler requires output_mode to be set to json, even though an output is always empty.
                output_mode="json",
                body=json.dumps(body))

    def has_pending_changes(self):
        """
        :return: If there are any pending changes.
        """
        return bool(self._repository.get_count())

    def get_deployment_properties(self, name):
        """Get deployedOn and deployedBy properties of an item in the changelog
        """
        result = self._deployed_repository.get_all(
            query={"key.name": name},
            sort=(("name", -1),),  # last change
            fields=["deployedBy", "deployedOn"],
            limit=1)

        return result[0] if result else None

# pylint: enable=too-many-arguments
