"""
Base repository
"""
# pylint: disable=no-else-raise, no-else-return, no-else-break, unnecessary-comprehension

import logging
import json
import collections
import uuid
from builtins import range  # pylint: disable=redefined-builtin

import agent
import agent.splunklib.client
from agent.models.bundle import compute_bundle_name
from agent import ioc, wtransaction
from agent.repositories.helpers import clean_private_kvstore_values
from agent.models import JSONEntity, View
from agent.common.helpers import stringify_guid

_QUERY_USER_QUALIFIER = {"_user": "nobody"}

# named tuple that will be used in get_all_with_total to return results
# and total
Collection = collections.namedtuple("Collection", ["results", "total"])


class RepositoryBatchCommand():
    """Combines different actions in one batch command
    """

    def __init__(self):
        self.updates = {}
        self.inserts = []

    def add_update(self, objid, content):
        """Add update

        objid - key
        content - dictionary of values which needs to be updated
        """
        if not isinstance(objid, uuid.UUID):
            objid = uuid.UUID(objid)
        self.updates.setdefault(objid, {}).update(content)

    def add_insert(self, entity):
        """Add insert

        entity - a JSONEntity
        """
        self.inserts.append(entity)

    def empty(self):
        """Check if command is empty
        """
        return not self.updates and not self.inserts


# pylint: disable=too-many-instance-attributes
class KVStoreRepositoryBase(ioc.Component):

    """Base repository for storing entities

    Implemented using KVStore.
    """

    MAX_LIMIT = 7500

    CollectionName = None
    LogEventType = None
    StanzaBundleType = None

    def __init__(self):
        assert self.CollectionName

        self._splunk_host = ioc.components.splunk_host()
        self._changelog_service = ioc.services.changelog_service()
        self._cancel_pending_changes_service = ioc.services.cancel_pending_changes_service()
        self._pending_changelog_repository = ioc.repositories.pending_changelog_repository()
        self._stanzas_service = ioc.services.stanzas_service()
        self._user_context = ioc.components.user_context()
        self._logger = logging.getLogger(self.__class__.__name__)
        self.__kvstore = None

        configuration = ioc.components.configuration()
        self._batch_save_size = configuration.get_int("repository_batch_save_size", 200)

    @clean_private_kvstore_values
    def get(self, key):
        """Get object by id from KVStore
        """
        if not key:
            raise agent.InvalidUserInputException(fmt="Object id cannot be empty")
        try:
            return self._object_factory(self._kvstore.query_by_id(key))
        except agent.splunklib.client.HTTPError as exp:
            if exp.status == 404:
                raise agent.NotFoundException(key, errors=exp)
            else:
                raise agent.ServerException(errors=exp)

    def exists(self, key):
        """
        Helper method to return a boolean indicating if a record with the specified key exists in the collection
        """
        result = self.get_all(query={"_key": key})
        if result:
            assert len(result) == 1
            return True
        else:
            return False

    @clean_private_kvstore_values
    @wtransaction
    def log_change(self, obj, insert=True):
        """Log object change, either as an insert or update
        """
        if not isinstance(obj, JSONEntity):
            raise agent.ServerException(fmt="Expecting JSONEntity")
        before_key = None if insert else obj.objid
        self._log_if_needed(before_key=before_key, after_obj=obj)
        return self.get(obj.objid)

    @clean_private_kvstore_values
    @wtransaction
    def insert(self, obj, log_change=True):
        """Save object in KVStore
        """
        if not isinstance(obj, JSONEntity):
            raise agent.ServerException(fmt="Expecting JSONEntity")

        jsontosave = self._json_to_save(obj)
        if log_change:
            self._log_if_needed(before_key=None, after_obj=obj)
        try:
            self._object_factory(self._kvstore.insert(json.dumps(jsontosave)))
        except agent.splunklib.client.HTTPError as exp:
            if exp.status == 409:
                raise agent.UniqueItemException(obj.id_field_name, obj.objid, errors=exp)
            else:
                raise agent.ServerException(errors=exp)
        return self.get(obj.objid)

    @clean_private_kvstore_values
    @wtransaction
    def update(self, obj, log_change=True):
        """Update object in KVStore
        """
        if not isinstance(obj, JSONEntity):
            raise agent.ServerException(fmt="Expecting JSONEntity")

        jsontosave = obj.json(view=View.RepositoryView)
        key = obj.objid
        if log_change:
            self._log_if_needed(before_key=key, after_obj=obj)
        self._object_factory(self._kvstore.update(key, json.dumps(jsontosave)))
        return self.get(key)

    @wtransaction
    def upsert(self, obj, log_change=True):
        """Checks if the object exists and updates if it does , else creates a new instance.
        """
        if self.exists(obj.objid):
            self.update(obj, log_change=log_change)
        else:
            self.insert(obj, log_change=log_change)
        return self.get(obj.objid)

    @wtransaction
    def upsert_raw(self, raw_obj, log_change=True):
        """Takes a raw object , creates a entity and calls upsert
        """
        assert raw_obj
        entity = self._object_factory(raw_obj)
        return self.upsert(entity, log_change=log_change)

    @wtransaction
    def delete(self, key, log_change=True):
        """Delete object from KVStore
        using specified key
        """
        assert key
        if log_change:
            self._log_if_needed(before_key=key, after_obj=None)
        return self._object_factory(self._kvstore.delete_by_id(key))

    @wtransaction
    def delete_all(self, query=None):
        """Delete objects from the KVStore collection
        query - dict
        """
        self._kvstore.delete(None if query is None else json.dumps(query))

# pylint: disable=too-many-arguments
# pylint: disable=too-many-branches
    @clean_private_kvstore_values
    def get_all(self,
                query=None,
                sort=None,
                limit=None,
                skip=None,
                fields=None,
                raw=False):
        """Get all tasks
        query - dict
        sort - array of tuples, like [ ("a", 1), ("b", -1) ]
        limit - integer
        skip - integer
        fields - list of fields
        """
        params = {}

        if query:
            query_with_user_qualifier = {"$and": [_QUERY_USER_QUALIFIER, query]}
        else:
            query_with_user_qualifier = _QUERY_USER_QUALIFIER
        params["query"] = json.dumps(query_with_user_qualifier)

        if sort:
            params["sort"] = ",".join("%s:%d" % (k, v) for (k, v) in sort)
        if limit:
            params["limit"] = limit
        if skip:
            params["skip"] = skip
        if fields:
            params["fields"] = ",".join(fields)

        if limit is None:
            if not sort:
                params["sort"] = "_key:1"
            params["limit"] = KVStoreRepositoryBase.MAX_LIMIT
            if fields and "_key" not in fields:
                params["fields"] += ",_key"

        data = None
        while True:
            chunk = self._kvstore.query(**params)
            if data is None:
                data = chunk
            else:
                data.extend(chunk)
            if len(chunk) < KVStoreRepositoryBase.MAX_LIMIT:
                break
            elif len(chunk) > KVStoreRepositoryBase.MAX_LIMIT:
                raise agent.ServerException(fmt="Unexpected result, KVStore returned more elements than in limit")
            after_last_query = {"_key": {"$gt": data[-1]["_key"]}}
            and_clause = [_QUERY_USER_QUALIFIER, after_last_query]
            if query:
                and_clause.append(query)

            params["query"] = json.dumps({"$and": and_clause})

        if raw:
            return data
        return list(self._object_factory(obj) for obj in data)
# pylint: enable=too-many-arguments

# pylint: disable=too-many-arguments
    @clean_private_kvstore_values
    def get_all_with_total(self,
                           query=None,
                           sort=None,
                           limit=None,
                           skip=None,
                           fields=None,
                           add_auxiliary_info=True):
        """
        Get all results and the total as a tuple. This takes in the same arguments as get_all but
        returns additional data:
        1. total count
        2. @pending status if the repository is logged.
           The value is true if an entity has been changed since the last deploy.
        """
        total = self.get_count(query)

        params = {}
        if query:
            params["query"] = json.dumps(query)
        if sort:
            params["sort"] = ",".join("%s:%d" % (k, v) for (k, v) in sort)
        if limit:
            params["limit"] = limit
        if skip:
            params["skip"] = skip
        if fields:
            params["fields"] = ",".join(fields)

        entities = [self._object_factory(obj) for obj in self._kvstore.query(**params)]

        if add_auxiliary_info:
            self._add_auxiliary_info(entities)

        return Collection(results=entities, total=total)
    # pylint: enable=too-many-arguments

    def get_count(self, query=None):
        """Get number of entities satisfied to specified query
        """
        # fetch the total number of records without pagination
        # TODO replace this when count is implememted on the kvstore
        countparams = {}
        # fetch only one field
        countparams["fields"] = "_key"
        if query:
            countparams["query"] = json.dumps(query)
        countresult = self._kvstore.query(**countparams)
        return len(countresult)

    def _add_auxiliary_info(self, entities):
        """
        Add @pending bit and @bundle to entities in entity list
        """
        if not self.StanzaBundleType:
            # Currently, we don't have a case where entity changes are logged while
            # we don't check for bundle changes. In other words, if we don't check for bundle
            # changes, we don't log entity changes and thus we should not have pending bit.
            assert not self.LogEventType
            return

        # Get a set of entity IDs representing changes made since the last deploy.
        entity_id_set = self.get_changed_entity_id_set() if self.LogEventType else set()

        entity_bundle_pairs = [
            (
                entity,
                compute_bundle_name(self.StanzaBundleType, entity.objid)
            )
            for entity in entities
        ]

        bundles = [bundle for _, bundle in entity_bundle_pairs]

        # Get a map of bundles that have changed since the last deploy.
        bundle_pending_map = self._stanzas_service.get_pending_stanza_map(bundles)

        for entity, bundle in entity_bundle_pairs:
            entity.set_value("@pending", entity.objid in entity_id_set or bundle in bundle_pending_map)
            # Add entity bundle if it isn't a part of entity content. We did not use @ for computed field when adding
            # bundle to groups endpoint. Once we make the change to use @ consistently, we can remove this if.
            if not entity.has_path("bundle"):
                entity.set_value("@bundle", bundle)

    @wtransaction
    def batch_save(self, entities):
        """Save all entities in batches to KVStore

        Configuration parameter repository_batch_save_size can be used to specify
        max batch size (default = 200)

        Returns True if number of saved entities == len(entities)
        """
        result = True
        for batch_i in range(0, len(entities), self._batch_save_size):
            batch = [self._json_to_save(obj) for obj in entities[batch_i:batch_i+self._batch_save_size]]
            result = self._kvstore.batch_save(*batch)
            if len(result) != len(batch):
                result = False
        return result

    @wtransaction
    def batch(self, batch_command):
        """Execute all batch updates from command
        """
        result = True
        # Save all inserts
        if not self.batch_save(batch_command.inserts):
            result = False
        # Save all updates (preload entities and update changed values)
        batch_command_l = [(key, value) for key, value in batch_command.updates.items()]
        for chunk in range(0, len(batch_command_l), self._batch_save_size):
            batch = batch_command_l[chunk:chunk+self._batch_save_size]
            query = {"$or": [{"_key": stringify_guid(objid)} for objid, _ in batch]}
            if len(query["$or"]) == 1:
                query = query["$or"][0]
            entities = self.get_all(query=query)
            for entity in entities:
                entity.set_values(batch_command.updates[uuid.UUID(entity.objid)])
            if not self.batch_save(entities):
                result = False
        return result

    def get_changed_entity_id_set(self):
        """
        Return a set of IDs of objects that have been changed since last deploy.
        """
        assert self.LogEventType

        query = {"type": self.LogEventType}
        fields = ["key"]
        changes = self._pending_changelog_repository.get_all(
            query=query,
            fields=fields
        )
        return {change.get_value("key")["name"] for change in changes}

    # pylint: disable=no-self-use
    def _object_factory(self, entity):
        """Overide if you need to construct different type of entities
        """
        return JSONEntity(json=entity, keep_original=True)

    def _json_to_save(self, obj):
        """Generate json to save in KVStore
        """
        jsontosave = obj.json(view=View.RepositoryView)
        key = obj.objid
        jsontosave["_key"] = key
        return jsontosave
    # pylint: enable=no-self-use

    @property
    def _kvstore(self):
        """Lazy access to kvstore
        """
        if not self.__kvstore:
            splunk_service = self._splunk_host.get_service(
                owner="nobody", app="dmc")
            self.__kvstore = splunk_service.kvstore[self.CollectionName].data
        return self.__kvstore

    def make_log_key(self, key):
        """
        Make the key object used for BaseRepository event types
        Default key object must have key.name field
        Method to optionally override
        """
        key_obj = {"name": key}
        return key_obj

    def _log_if_needed(self, before_key, after_obj):
        """
        Log the change if needed.
        :param before_key: key to be used to load the before value of the entity
        :param after_obj: the updated entity
        """

        if not self.LogEventType:
            return

        self._backup_if_needed(before_key, after_obj)

        if before_key:
            before_obj = self.get(before_key)
            before_value = before_obj.json(view=View.LogView)
        else:
            before_value = None

        if after_obj:
            after_key = after_obj.objid
            after_value = after_obj.json(view=View.LogView)
        else:
            after_key = None
            after_value = None

        key = before_key or after_key
        assert key

        key_obj = self.make_log_key(key)

        user = self._user_context.user
        self._changelog_service.record(
            self.LogEventType,
            user,
            # "key.name" field is used across all entity types.
            key=key_obj,
            before=before_value,
            after=after_value)

    def _backup_if_needed(self, before_key=None, after_obj=None):
        """
        Take a backup of the original record before change
        :param before_key: key to be used to load the before value of the entity
        :param after_obj: the updated entity
        """

        if not self.LogEventType:
            return

        original_record = None
        if before_key is not None:
            original_obj = self.get(before_key)
            original_record = original_obj.json(view=View.RepositoryView)

        name = before_key if before_key else after_obj.objid
        assert "." not in self.LogEventType
        value = {
            "name": self.LogEventType+"."+name,
            "type": self.LogEventType,
            "data": original_record
        }
        self._cancel_pending_changes_service.record(value)
