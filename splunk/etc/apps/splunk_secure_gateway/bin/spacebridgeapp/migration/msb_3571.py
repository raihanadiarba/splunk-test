# KV Store data changes related to MSB-3571
# Migrate mobile_alerts records from jsonpickle format to protobuf format.
# Notification fields are fully migrated. Detail fields are partially migrated:
# search_id, results_link, search_name, owner, dashboard_id are preserved;
# result_json is stored as '{}'; call_to_action, dashboard_description and
# list_dashboard_data are not migrated (treated as empty).
import json
from http import HTTPStatus

from spacebridgeapp.data.alert_data import Alert, Detail, Notification
from spacebridgeapp.migration.kvstore_update_context import KVStoreUpdateContext
from spacebridgeapp.rest.services.splunk_service import get_all_mobile_users
from google.protobuf.json_format import MessageToJson
from spacebridgeapp.util.constants import (
    KEY,
    MOBILE_ALERTS_COLLECTION_NAME,
)
from splapp_protocol import common_pb2


async def migrate_jsonpickle_alert_data(context: KVStoreUpdateContext):
    """
    Migrates mobile_alerts records from jsonpickle format to protobuf format.
    Iterates over all registered mobile users and rewrites their alert records
    in-place. Records that are already in the new format (have 'alert_pb_json')
    are skipped. Called once by KVStoreUpdate during app startup.
    """
    users = get_all_mobile_users(context.auth_header.session_token)
    context.log.info(f"MSB-3571: migrating mobile_alerts for {len(users)} user(s)")

    for user in users:
        await _migrate_user_alerts(context, user)


async def _migrate_user_alerts(context: KVStoreUpdateContext, user: str):
    response = await context.client.async_kvstore_get_request(
        collection=MOBILE_ALERTS_COLLECTION_NAME,
        auth_header=context.auth_header,
        owner=user,
    )

    if response.code == HTTPStatus.NOT_FOUND:
        return
    if response.code != HTTPStatus.OK:
        txt = await response.text()
        context.log.warning(
            f"MSB-3571: failed to fetch alerts for user={user}, code={response.code}: {txt}"
        )
        return

    records = await response.json()
    if not records:
        return

    context.log.info(f"MSB-3571: migrating {len(records)} alert(s) for user={user}")
    migrated = 0
    for record in records:
        if await _migrate_record(context, record, user):
            migrated += 1
    context.log.info(f"MSB-3571: migrated {migrated}/{len(records)} alert(s) for user={user}")


async def _migrate_record(context: KVStoreUpdateContext, record: dict, user: str) -> bool:
    key = record.get(KEY)
    if not key:
        context.log.warning(f"MSB-3571: record has no _key, skipping: {record}")
        return False

    # Already in the new format — nothing to do
    if "alert_pb_json" in record:
        return False

    try:
        proto = _build_proto_from_legacy(record)
    except Exception:
        context.log.exception(f"MSB-3571: failed to parse legacy alert key={key}, skipping")
        return False

    try:
        new_doc = json.dumps({
            KEY: key,
            "created_at": proto.notification.createdAt,
            "alert_pb_json": MessageToJson(proto, indent=None),
        })
        update_response = await context.client.async_kvstore_post_request(
            collection=MOBILE_ALERTS_COLLECTION_NAME,
            data=new_doc,
            auth_header=context.auth_header,
            key_id=key,
            owner=user,
        )
        if update_response.code not in (HTTPStatus.OK, HTTPStatus.CREATED):
            txt = await update_response.text()
            context.log.warning(
                f"MSB-3571: failed to update alert key={key}: code={update_response.code}, {txt}"
            )
            return False
        return True
    except Exception:
        context.log.exception(f"MSB-3571: failed to write proto for alert key={key}")
        return False


def _build_proto_from_legacy(record: dict) -> common_pb2.Alert:
    """
    Builds a common_pb2.Alert proto from a jsonpickle-encoded KV store record dict.
    The py/object metadata keys are ignored; only data fields are used.

    Intentionally omitted (treated as empty / default):
    - call_to_action       — defaults to '' which Notification.set_protobuf skips
    - result_json          — stored as '{}' (empty JSON object)
    - dashboard_description, list_dashboard_data — equivalent to empty DashboardTuple
    """
    notif_dict = record.get("notification") or {}
    detail_dict = record.get("detail") or {}

    notification = Notification(
        severity=int(notif_dict.get("severity", 0)),
        alert_id=notif_dict.get("alert_id", ""),
        title=notif_dict.get("title", ""),
        description=notif_dict.get("description", ""),
        created_at=str(notif_dict.get("created_at", "")),
        app_name=notif_dict.get("app_name", ""),
        display_app_name=str(notif_dict.get("display_app_name", "")),
        notification_type=int(notif_dict.get("notification_type", 0)),
        saved_search=notif_dict.get("saved_search", ""),
        # call_to_action intentionally omitted
    )

    detail = Detail(
        result_json={},
        search_id=detail_dict.get("search_id"),
        results_link=detail_dict.get("results_link"),
        search_name=detail_dict.get("search_name"),
        owner=detail_dict.get("owner"),
        dashboard_id=detail_dict.get("dashboard_id"),
        # dashboard_description and list_dashboard_data intentionally omitted
    )

    alert = Alert(notification=notification, detail=detail)
    proto = common_pb2.Alert()
    alert.set_protobuf(proto)
    return proto
