#!/bin/bash
# Stop on any errors
set -e

USAGE=$(/bin/cat << EOM
NAME
   collect_cpu_profile.sh

SYNOPSIS
   collect_cpu_profile.sh SID

DESCRIPTION
   This script produces the files necessary for analysis of cpu profiles.
   It produces a single compressed tar file which can be sent to
   another system for further analysis.
   Must be executed as the splunk user.
   SPLUNK_HOME must be set.
EOM
)

# Check args
if [ $# -ne 1 ] ; then
    echo "${USAGE}"
    exit 1
fi

if [[ ! -v SPLUNK_HOME ]] ; then
    echo "Error: SPLUNK_HOME is not set"
    exit 1
fi

SID=$1
PROFILE_PATH="${SPLUNK_HOME}/var/run/profiler"
PROFILE_PATH_SID="${PROFILE_PATH}/${SID}"
if [ ! -d "${PROFILE_PATH_SID}" ] ; then
    echo "Error: the sid ${SID} does not exist in ${PROFILE_PATH}" 
    exit 1 
fi

COMPRESSED_FILE="${SID}-perf.data.tar.bz2"
cd "${PROFILE_PATH_SID}"
/usr/bin/perf script -i perf.data > perf_script.out
/usr/bin/perf report --stdio -n -g flat -i perf.data > perf_report.out
cd ..
/bin/tar -cvjSf "${COMPRESSED_FILE}" "${SID}"
echo "Profile data stored here: ${PWD}/${COMPRESSED_FILE}"
