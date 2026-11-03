#   Version 10.6.1.1
#
# ** FOR USE IN SPLUNK CLOUD ONLY
#
# This file contains the set of attributes and values you can use to
# configure Self Service App Installation Agent in dmc_agent.conf.

#
# There is a dmc_agent.conf in $SPLUNK_HOME/etc/apps/dmc/default/.  To set custom
# configurations, place a dmc_agent.conf in $SPLUNK_HOME/etc/apps/dmc/local/.
#
# To learn more about configuration files (including precedence) please see
# the documentation located at
# http://docs.splunk.com/Documentation/Splunk/latest/Admin/Aboutconfigurationfiles

[dmc]
startup_kvstore_wait_time = <integer>
* The amount of time, in seconds, that SSAI startup waits for App Key Value Store (KVStore) startup
  to complete before it fails.
* If KVStore does not complete within 'startup_kvstore_wait_time' seconds, SSAI startup fails.
* Default: 60

reload_manager_apps_delay = <integer>
* The amount of time, in seconds, that SSAI waits before re-checking the status
  of master apps deployment to Indexers.
* Default: 10

reload_manager_apps_retry = <integer>
* Max number of times that SSAI checks the status of master apps deployment to Indexers
  before marking the app deployment as failed.
* Default: 360

reload_shcluster_delay = <integer>
* The amount of time, in seconds, that SSAI waits before re-checking the status
  of Search Head Cluster apps deployment to Search Heads in Search Head Cluster.
* Default: 10

reload_shcluster_retry = <integer>
* Max number of times that SSAI checks the status of Search Head Cluster apps deployment
  to Search Heads in Search Head Cluster before marking the app deployment failed.
* Default: 360

sync_dc_delay = <integer>
* The amount of time, in seconds, that SSAI waits for deployment clients
  to finish loading the apps from the deployment server.
* Default: 10

sync_dc_retry = <integer>
* Max number of times that SSAI checks the status from deployment clients
  for loading the apps from the deployment server.
* Default: 100

repository_batch_save_size = <integer>
* The number of records that SSAI can save in batches to App Key Value Store (KV Store).
* Records are entities of a collection, like "Apps Collection".
* Default: 200

audit_trail_batch_size = <integer>
* The number of Changelog records that SSAI can save in batches to App Key Value Store (KV Store).
* Records are entities of "Pending Changelog" and "Deployed Changelog" collections.
* Default: 200

deploy_command_retry_limit = <integer>
* Max number of times that SSAI retries commands in deploy workflow in case when they fail.
* Default: 1

deploy_command_retry_interval = <integer>
* The amount of time, in seconds, that SSAI waits between deploy workflow commands retries.
* Default: 15

notification_retry_limit = <integer>
* Max number of times that SSAI tries to post notifications to all registered Search Heads.
* Default: 12

notification_retry_interval = <integer>
* The amount of time, in seconds, SSAI waits between notifications posting to Search Heads.
* Default: 10

splunkbase_retry_enabled = <boolean>
* Whether or not to retry apps operation automatically when splunkbase is unavailable
* Default: False

splunkbase_retry_interval = <integer>
* The amount of time, in seconds, that SSAI waits before retrying to get app
  from splunkbase when it is temporarily unavailable.
* Default: 10

splunkbase_retry_limit = <integer>
* Max number of times that SSAI retries to get app from splunkbase 
  when it is temporarily unavailable.
* Default: 3

# Following properties are used for App Inspect validation
app_inspect_username = admin
app_inspect_password = xxxxxx
app_inspect_endpoint = https://appinspect.splunk.com/v1
app_inspect_auth_endpoint = https://api.splunk.com/2.0/rest/login/splunk
app_inspect_validate_tags = cloud,self-service
app_inspect_prevetted_endpoint_timeout = 20

private_app_vetting_global = <boolean>
* Enables private app vetting feature.
* When set to a value of 1 (true), private app vetting feature is enabled.
* Default: 1 (true)

slim_cache_overwrite = <boolean>
* Whether to overwrite slim cache or not
* Default: 0 (false)

enable_upload_apps_pagination = <boolean>
* feature flag to enable/disable pagination on upload_apps page
* default: 1 (true)

private_app_vetting_app_inspect_validate_tags = private_classic

get_package_by_id_endpoint_disabled = <boolean>
* Determines whether the get package by ID endpoint is disabled or not
* Default: true
