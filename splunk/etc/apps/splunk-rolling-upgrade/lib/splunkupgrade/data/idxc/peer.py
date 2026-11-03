from dataclasses import dataclass
from enum import Enum
from typing import Optional
from packaging.version import Version
from splunkupgrade.data.parsing import get_field, get_optional_field, get_enum_field, to_version
from splunkupgrade.utils.constants import IndexerPeerKeys
from splunkupgrade.utils.types import JsonObject


class PeerStatus(Enum):
    UP = "Up"
    PENDING = "Pending"
    AUTOMATIC_DETENTION = "AutomaticDetention"
    MANUAL_DETENTION_PORTS_ENABLED = "ManualDetention - PortsEnabled"
    MANUAL_DETENTION = "ManualDetention"
    RESTARTING = "Restarting"
    SHUTTING_DOWN = "ShuttingDown"
    REASSIGNING_PRIMARIES = "ReassigningPrimaries"
    DECOMISSIONING = "Decommissioning"
    GRACEFUL_SHUTDOWN = "GracefulShutdown"
    STOPPED = "Stopped"
    DOWN = "Down"
    BATCH_ADDING = "BatchAdding"

    # Undocumented status, but can sometimes happen actually
    STARTING = "Starting"
    UNKNOWN = "unknown"


@dataclass
class Peer:
    id: str
    name: str

    # splunkd does not return version in the response if the peer is in 'Starting' state
    version: Optional[Version]
    status: PeerStatus
    site: str


def to_peer(peer_json: JsonObject) -> Peer:
    content_json = get_field(peer_json, IndexerPeerKeys.CONTENT, dict)
    str_version = get_optional_field(content_json, IndexerPeerKeys.SPLUNK_VERSION, str)
    return Peer(
        get_field(peer_json, IndexerPeerKeys.NAME, str),
        get_field(content_json, IndexerPeerKeys.LABEL, str),
        None if str_version is None else to_version(str_version),
        get_enum_field(
            PeerStatus, get_field(content_json, IndexerPeerKeys.STATUS, str), PeerStatus.UNKNOWN
        ),
        get_field(content_json, IndexerPeerKeys.SITE, str),
    )
