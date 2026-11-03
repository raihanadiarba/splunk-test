import asyncio
import json
from dataclasses import dataclass
from http import HTTPStatus
from logging import Logger
from typing import Callable, List, Awaitable

from spacebridgeapp.exceptions.spacebridge_exceptions import SpacebridgeApiRequestError
from spacebridgeapp.migration import msb_3081_1, msb_3571
from spacebridgeapp.migration.kvstore_update_context import KVStoreUpdateContext
from spacebridgeapp.request.splunk_auth_header import SplunkAuthHeader
from spacebridgeapp.rest.clients.async_kvstore_client import AsyncKvStoreClient


@dataclass
class KVStoreChange:
    key: str
    description: str
    ref: Callable[[KVStoreUpdateContext], Awaitable] = None

    def __str__(self):
        return f"KVStoreChange(key={self.key}, description={self.description})"

    def __repr__(self):
        return self.__str__()

class KVStoreUpdate:
    COLLECTION: str = "kvstore_change_history"

    def __init__(self, logger: Logger, client: AsyncKvStoreClient, session_key: str):
        self.log: Logger = logger
        self.client: AsyncKvStoreClient = client
        self.auth_header = SplunkAuthHeader(session_key)
        self.main_change_list: List[KVStoreChange] = []
        self.__init_change_list()

    def __init_change_list(self):
        """
        This is the list of all kvstore schema/data changes.
        The #ref should be a pointer to an async method that supposed to manipulate with data
        """
        changes = self.main_change_list
        changes.append(KVStoreChange(key="MSB-3081-1",
                                     description="Fix ownership in alert_recipient_devices collection",
                                     ref=msb_3081_1.patch_alert_recipient_devices))
        changes.append(KVStoreChange(key="MSB-3571-1",
                                     description="Migrate mobile_alerts records from jsonpickle format "
                                                 "to protobuf storage (dashboard data excluded)",
                                     ref=msb_3571.migrate_jsonpickle_alert_data))

    async def run_upgrades(self):
        self.log.info("Upgrading KV Schema process has been started")
        applied_changes = await self._get_applied_changes()
        self.log.info(f"Already applied changes: {applied_changes}")

        changes_to_apply = await self._detect_changes_to_apply(applied_changes)
        self.log.info(f"Changes to apply: {changes_to_apply}")

        context = KVStoreUpdateContext(self.log, self.client, self.auth_header)

        for change in changes_to_apply:
            try:
                self.log.info(f"Applying change: {change}")
                await change.ref(context)
                await self._recode_change_applied(change)
                self.log.info(f"The change {change} has been applied")
            except Exception as e:
                self.log.error(f"Error happened while updating {change.key}: {e}")
                raise

        self.log.info("Upgrading KV Schema process has been completed")

    async def _detect_changes_to_apply(self, applied_changes):
        applied_changes_keys: set[str] = {applied_change.key for applied_change in applied_changes}
        changes_to_apply = [
            change for change in self.main_change_list if
            change.key not in applied_changes_keys
        ]
        return changes_to_apply

    async def _get_applied_changes(self, attempt: int = 0) -> List[KVStoreChange]:
        if attempt == 3:
            return []

        response = await self.client.async_kvstore_get_request(self.COLLECTION, self.auth_header)
        if response.code == HTTPStatus.OK:
            kv_json = await response.json()
            return [KVStoreChange(key=item["_key"], description=item["description"]) for item in kv_json]
        elif response.code == HTTPStatus.NOT_FOUND:
            # Collection is not found in the kv store
            return []
        elif response.code == HTTPStatus.SERVICE_UNAVAILABLE:
            # kv store is not ready yet, retry in 5 seconds
            await asyncio.sleep(5)
            return await self._get_applied_changes(attempt + 1)
        else:
            txt = await response.text()
            raise SpacebridgeApiRequestError(f"Invalid response code from kvstore api, "
                                             f"code: {response.code}, "
                                             f"txt: {txt}")

    async def _recode_change_applied(self, change: KVStoreChange):
        data = json.dumps({"_key": change.key, "description": change.description})
        response = await self.client.async_kvstore_post_request(self.COLLECTION, data, self.auth_header)
        if response.code >= HTTPStatus.BAD_REQUEST:
            txt = await response.text()
            raise SpacebridgeApiRequestError(f"Failed to set current version {txt}, status code {response.code}")
