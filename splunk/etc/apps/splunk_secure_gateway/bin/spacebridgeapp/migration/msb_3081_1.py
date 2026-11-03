# KV Store structure changes related to MSB-3081
import json
from http import HTTPStatus

from spacebridgeapp.migration.kvstore_update_context import KVStoreUpdateContext
from spacebridgeapp.rest.devices import users_devices
from spacebridgeapp.util import constants

async def patch_alert_recipient_devices(context: KVStoreUpdateContext):
    client = context.client
    log = context.log
    auth = context.auth_header

    response = await client.async_kvstore_get_request(collection=constants.ALERTS_RECIPIENT_DEVICES_COLLECTION_NAME,
                                                      auth_header=auth)
    if response.code != HTTPStatus.OK:
        txt = await response.text()
        log.error(f"Failed to get alert recipients devices response code: {response.code}, text: {txt}")
        return

    alert_devices_json: list[dict] = await response.json()
    size = len(alert_devices_json)
    log.info(f"Found {size} alert recipients devices that need to be updated")

    if size == 0:
        return

    registered_devices_map = await _get_all_devices_map(log, auth.session_token)
    for alert_device in alert_devices_json:
        device_id: str = alert_device[constants.DEVICE_ID]
        registered_device: dict = registered_devices_map[device_id]
        if registered_device is None:
            log.warning(f"Device {device_id} has no registered device")
            continue

        # Update user/owner to the proper one
        alert_device[constants.USER_KEY] = registered_device[constants.USER_KEY]
        await _store_alert_device_with_proper_owner(alert_device, client, auth, log)


async def _store_alert_device_with_proper_owner(alert_device, client, auth, log):
    device_id = alert_device[constants.DEVICE_ID]
    owner = alert_device[constants.USER_KEY]
    log.info(f"Moving alert-device mapping to the proper owner, device id {device_id}, owner: {owner}")
    response = await client.async_kvstore_post_request(collection=constants.ALERTS_RECIPIENT_DEVICES_COLLECTION_NAME,
                                                       data=json.dumps(alert_device),
                                                       owner=owner,
                                                       auth_header=auth)
    if response.code == HTTPStatus.OK or response.code == HTTPStatus.CREATED:
        key = alert_device[constants.KEY]
        log.info(f"Deleting alert-device mapping owned by nobody with the key {key} and device id {device_id}")
        await client.async_kvstore_delete_request(collection=constants.ALERTS_RECIPIENT_DEVICES_COLLECTION_NAME,
                                                  key_id=key,
                                                  owner="nobody",
                                                  auth_header=auth)


async def _get_all_devices_map(log, session_token) -> dict[str, dict]:
    all_devices = users_devices.get_devices_for_registered_users(log, session_token)
    return {device[constants.DEVICE_ID]: device for device in all_devices}
