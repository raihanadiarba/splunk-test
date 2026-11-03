#!/bin/bash

# NOTE: This script is called by mod inputs framework for the logd
# modular input scheme.  It will simply use it to bootstrap the actual
# logd binary, splunkd

function do_scheme
{
    #
    # splunk-logd.path bootstraps which command line to run for the actual 
    # mod input executiion
    ###

    #
    # tells mod input framework to expect HEC/ModInputs formatted JSON to be output
    # by this mod input.  This is a specific JSON language that is able to pass
    # structured fields into splunkd, and map them to appropriate keys in PipelineData
    ###
cat <<END
<scheme>
    <title>Logd Input for the Splunk platform</title>
    <description>This input collects data from logd on macOS and sends it to the Splunk platform.</description>
    <use_external_validation>true</use_external_validation>
    <script>splunk-logd.path</script>
    <streaming_mode>json</streaming_mode>
    <endpoint>
        <args>
            <arg name="name">
                <title>name</title>
            </arg>
            <arg name="logd-backtrace">
                <title>logd-backtrace</title>
                <required_on_create>false</required_on_create>
                <required_on_edit>false</required_on_edit>
            </arg>
            <arg name="logd-debug">
                <title>logd-debug</title>
                <required_on_create>false</required_on_create>
                <required_on_edit>false</required_on_edit>
            </arg>
            <arg name="logd-info">
                <title>logd-info</title>
                <required_on_create>false</required_on_create>
                <required_on_edit>false</required_on_edit>
            </arg>
            <arg name="logd-loss">
                <title>logd-loss</title>
                <required_on_create>false</required_on_create>
                <required_on_edit>false</required_on_edit>
            </arg>
            <arg name="logd-signpost">
                <title>logd-signpost</title>
                <required_on_create>false</required_on_create>
                <required_on_edit>false</required_on_edit>
            </arg>
            <arg name="logd-predicate">
                <title>logd-predicate</title>
                <required_on_create>false</required_on_create>
                <required_on_edit>false</required_on_edit>
            </arg>
            <arg name="logd-process">
                <title>logd-process</title>
                <required_on_create>false</required_on_create>
                <required_on_edit>false</required_on_edit>
            </arg>
            <arg name="logd-source">
                <title>logd-source</title>
                <required_on_create>false</required_on_create>
                <required_on_edit>false</required_on_edit>
            </arg>
            <arg name="logd-include-fields">
                <title>logd-include-fields</title>
                <required_on_create>false</required_on_create>
                <required_on_edit>false</required_on_edit>
            </arg>
            <arg name="logd-exclude-fields">
                <title>logd-exclude-fields</title>
                <required_on_create>false</required_on_create>
                <required_on_edit>false</required_on_edit>
            </arg>
            <arg name="logd-interval">
                <title>logd-interval</title>
                <required_on_create>false</required_on_create>
                <required_on_edit>false</required_on_edit>
            </arg>
            <arg name="logd-starttime">
                <title>logd-starttime</title>
                <required_on_create>false</required_on_create>
                <required_on_edit>false</required_on_edit>
            </arg>
            <arg name="logd-freetext">
                <title>logd-freetext</title>
                <required_on_create>false</required_on_create>
                <required_on_edit>false</required_on_edit>
            </arg>
        </args>
    </endpoint>
</scheme>
END
}

ME=$(basename $0)

usage() {
    echo "USAGE: $ME --scheme" >&2
    exit 1
}

if [ "$#" -ne 1 ]; then
    usage
fi

if [ "$1" == "--scheme" ] ; then
    do_scheme
else
    usage
fi
