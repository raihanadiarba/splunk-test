#!/bin/bash
set -e
splunk_tar="$1"
dest_dir="$2"
tar -zvxf "$splunk_tar" --strip-components 1 -C "$dest_dir"
