#!/bin/bash

# NOTE: This script is called by mod inputs framework for the search
# artifacts helper modular input scheme.  It will simply use it to
# bootstrap the actual search_artifacts_helper binary, splunkd

function do_scheme
{
    echo "<scheme>"
    echo "    <title>Search Artifacts Helper Input for Splunk</title>"
    
    echo "    <description>This is the input that manages the uploading of search artifacts to the remote store</description>"
    
    echo "    <use_external_validation>true</use_external_validation>"
    #
    # splunk_search_artifacts_helper.path bootstraps which command line to run for the actual
    # mod input executiion
    ###
    echo "    <script>splunk_search_artifacts_helper.path</script>"
    
    #
    # tells mod input framework to expect HEC/ModInputs formatted JSON to be output
    # by this mod input.  This is a specific JSON language that is able to pass
    # structured fields into splunkd, and map them to appropriate keys in PipelineData
    ###
    echo "    <streaming_mode>json</streaming_mode>"
    
    echo "    <endpoint>"
    echo "        <args>"
    echo "            <arg name="name">"
    echo "                <title>name</title>"
    echo "            </arg>"
    echo "            <arg name="upload_process_maxtime">"
    echo "                <title>upload_process_maxtime</title>"
    echo "                <required_on_create>false</required_on_create>"
    echo "                <required_on_edit>false</required_on_edit>"
    echo "            </arg>"
    echo "            <arg name="num_archive_threads">"
    echo "                <title>num_archive_threads</title>"
    echo "                <required_on_create>false</required_on_create>"
    echo "                <required_on_edit>false</required_on_edit>"
    echo "            </arg>"
    echo "            <arg name="upload_execution_threads">"
    echo "                <title>upload_execution_threads</title>"
    echo "                <required_on_create>false</required_on_create>"
    echo "                <required_on_edit>false</required_on_edit>"
    echo "            </arg>"
    echo "            <arg name="upload_queue_size">"
    echo "                <title>upload_queue_size</title>"
    echo "                <required_on_create>false</required_on_create>"
    echo "                <required_on_edit>false</required_on_edit>"
    echo "            </arg>"
    echo "            <arg name="upload_queue_timeout">"
    echo "                <title>upload_queue_timeout</title>"
    echo "                <required_on_create>false</required_on_create>"
    echo "                <required_on_edit>false</required_on_edit>"
    echo "            </arg>"
    echo "            <arg name="process_runner_poll_interval">"
    echo "                <title>process_runner_poll_interval</title>"
    echo "                <required_on_create>false</required_on_create>"
    echo "                <required_on_edit>false</required_on_edit>"
    echo "            </arg>"
    echo "        </args>"
    echo "    </endpoint>"
    
    echo "</scheme>"
}

if [ "$#" -ne 1 ]; then
    echo 'USAGE: $0 --scheme'
    exit
fi

if [ "$1" == "--scheme" ] ; then
    do_scheme
else
    echo 'USAGE: $0 --scheme'
fi
