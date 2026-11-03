"""Copyright (C) 2009-2023 Splunk Inc. All Rights Reserved."""
import socket


def default_shard_id():
    return socket.gethostname()
