#!/bin/bash
set -e
SPLUNK_PATH="$1"
COMMAND="$2"

if [ "$COMMAND" = "start" ]; then
    "$SPLUNK_PATH" start --accept-license --answer-yes
elif [ "$COMMAND" = "offline" ]; then
    TOKEN="$3"
    "$SPLUNK_PATH" offline -token "$TOKEN"
elif [ "$COMMAND" = "stop" ]; then
    "$SPLUNK_PATH" stop
else
    echo "Invalid command"
    exit 1
fi
