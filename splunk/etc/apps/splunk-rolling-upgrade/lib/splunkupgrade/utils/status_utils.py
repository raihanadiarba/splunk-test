import logging
from collections import namedtuple

from splunkupgrade.data.shc.kv_upgrade_progress import KvUpgradeProgress
from splunkupgrade.data.shc.kv_upgrade_progress_peer import KvUpgradePeerStep
from splunkupgrade.data.shc.shc_status import ShcStatus
from splunkupgrade.data.shc.shc_status_captain import ShcStatusCaptain
from splunkupgrade.utils.constants import ShcStatusKeys
from splunkupgrade.utils.exceptions import NoNextPeerForUpgradeException

logger = logging.getLogger(__name__)


ReadinessWithReason = namedtuple("ReadinessWithReason", ["is_ready", "failure_reason"])


def is_captain_ready(captain_info: ShcStatusCaptain) -> ReadinessWithReason:
    if not captain_info.dynamic_captain:
        reason = "SHC does not have a dynamic captain. Please fix this before proceeding with rolling upgrade"
        return ReadinessWithReason(False, reason)

    if not captain_info.stable_captain:
        reason = "SHC does not have a stable captain. Please fix this before proceeding with rolling upgrade"
        return ReadinessWithReason(False, reason)

    if not captain_info.service_ready:
        reason = "SHC captain is not ready to provide service. Please fix this before proceeding with rolling upgrade"
        return ReadinessWithReason(False, reason)

    if captain_info.rolling_restart:
        reason = "SHC is in rolling restart. Please fix this before proceeding with rolling upgrade"
        return ReadinessWithReason(False, reason)

    if captain_info.max_failures_to_keep_majority <= 0:
        reason = (
            f"'{ShcStatusKeys.MAX_FAILURES_TO_KEEP_MAJORITY}' should be larger than 0. "
            "Run $SPLUNK_HOME/bin/splunk show shcluster-status to know which search head does not have "
            "the status Up. Please fix this before proceeding with the rolling upgrade"
        )
        return ReadinessWithReason(False, reason)
    return ReadinessWithReason(True, "")


def is_cluster_ready_for_upgrade(
    cluster_info: ShcStatus,
) -> ReadinessWithReason:
    is_captain_ok, failure_reason = is_captain_ready(cluster_info.captain)
    if not is_captain_ok:
        return ReadinessWithReason(False, failure_reason)

    for peer in cluster_info.peers:
        if peer.out_of_sync_node:
            reason = f"SHC member uri='{peer.mgmt_uri}' out_of_sync_node is true"
            return ReadinessWithReason(False, reason)
    return ReadinessWithReason(True, "")


def find_next_peer_for_upgrade(
    cluster_status: ShcStatus, upgrade_progress: KvUpgradeProgress
) -> str:
    for peer in upgrade_progress.peers:
        if (not peer.name == cluster_status.captain.label) and (
            peer.status == KvUpgradePeerStep.READY
        ):
            return peer.name
    raise NoNextPeerForUpgradeException(
        "Upgrade cannot pick a member to upgrade while there are still some upgrade candidates available. "
        "This usually happens when the candidate is holding the captaincy, not transferring the captaincy "
        "to an upgraded member."
    )


def are_all_peers_upgraded(upgrade_progress: KvUpgradeProgress) -> bool:
    return all(peer.status == KvUpgradePeerStep.UPGRADED for peer in upgrade_progress.peers)
