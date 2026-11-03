# This file contains descriptions of the settings you can use to configure the
# splunk-rolling-upgrade app.

[logging]
log_level = [DEBUG|INFO|WARN|ERROR]
* The severity level at which the splunk-rolling-upgrade app writes log file
  entries.
* splunk-rolling-upgrade writes logs at the level you set in 'log_level' and
  any higher levels. For example, if you set 'log_level = WARN',
  the app writes logs at both WARN and ERROR severity levels.
* Logging levels increase in order of severity, as follows (lower levels provide more
  information, but increase log file size):
  * DEBUG - Detailed information for diagnosing problems.
  * INFO  - Confirmation that things are working as expected.
  * WARN  - A warning of a recoverable fault or a problem that might
            occur in the future.
  * ERROR - A problem that is causing the software to not run as expected.
* Default: INFO


[requests]
# These settings control the client interface that connects to Splunk software
# via REST API.
retries = <positive integer>
* The maximum number of times the splunk-rolling-upgrade app retries a connection
  attempt before terminating the REST API request.
* Default: 2

delay = <non-negative integer>
* The initial amount of time, in seconds, splunk-rolling-upgrade app waits before
  retrying a REST call.
* Default: 1

timeout = <positive integer>
* The amount of time, in seconds, the splunk-rolling-upgrade app waits for a
  response from a REST API request before terminating the request.
* Default: 30

[process_runner]
# These settings manage internal sub-processes that the splunk-rolling-upgrade app creates.
timeout = <positive integer>
* The maximum about of time, in seconds, the splunk-rolling-upgrade app waits for a process to terminate.
  If the elapsed time exceeds the timeout value, the entire rolling upgrade fails.
* Default: 600

[kvstore_retry]
# Kvstore requires some time to be fully initialised. These settings are used to define
# how long an upgrade has to wait for kvstore initialisation.
max_tries = <positive integer>
* The maximum number of times the splunk-rolling-upgrade app checks for
  kvstore readiness.
* Default: 10

initial_delay_after_each_retry = <non-negative integer>
* The amount of time, in seconds, the splunk-rolling-upgrade app waits before
  checking again if the kvstore is properly initialized.
* Default: 20

[cluster_retry]
# When dealing with a Search Head Cluster there are few things that must happen in order to have
# a fully initialised cluster. Each peer must be ready (and their corresponding kvstore must be
# properly replicated), and a captain must be elected. This requires some time, depending on the
# cluster size.
max_tries = <positive integer>
* The maximum number of times the splunk-rolling-upgrade app checks for search
  head cluster readiness.
* Default: 10

initial_delay_after_each_retry = <non-negative integer>
* The amount of time, in seconds, the splunk-rolling-upgrade apps waits before
  rechecking search head cluster readiness.
* Default: 20

[shcluster_members_retry]
# Settings to control interaction with search head cluster members.
max_tries = <positive integer>
* The maximum number of times the splunk-rolling-upgrade app checks whether
  all historical searches are complete.
* Default: 20

initial_delay_after_each_retry = <non-negative integer>
* The amount of time, in seconds, the splunk-rolling-upgrade app waits before
  rechecking whether all searches are complete.
* Default: 20

[downloader]
# These settings control Splunk package source.
package_path = <string>
* Specifies the URI path to a new Splunk Enterprise installation pacakge.
  Authentication is not supported.
* Supported package file formats are .tgz, .rpm, and .deb.
* Supported URI schemas are file://, http:// and https:// only. All other schemas (such as
  ftp://) result in an error.
* Default: none

sha256_checksum = <string>
* Specifies the sha256 checksum of the installation package pointed to by
  'package_path' in a hexadecimal format.
* If the calculated checksum of the package is different than the checksum
  specified in this setting or if the 'sha256_checksum' value is missing, the
  splunk-rolling-upgrade app won't install the package, and the upgrade
  will be stopped.
* Example: sha256_checksum = 8eaa2e2fe5063e71e837cd27af1c2fa51b10c6a1cf159f49aab4e9ab8016980c
* Default: none

md5_checksum = <string>
* DEPRECATED. Use 'sha256_checksum' instead.

[hook]
# These settings specify a hook script that installs Splunk Enterprise on
# Linux machines during automated rolling upgrade. To install from a .tgz
# archive, use the default 'install.tgz.sh' script, which unpacks the archive
# under $SPLUNK_HOME and restarts Splunk. To install from .rpm or .deb
# packages, you must write a custom hook script. For instructions on how to
# write your own hook script, see Splunk Enterprise documentation.
install_script_path = <string>
* Specifies the path to the hook script that installs Splunk Enterprise.
* Default: $SPLUNK_HOME/etc/apps/splunk-rolling-upgrade/hooks/install_tgz.sh

[orchestrator]
# Settings to control the indexer cluster upgrade orchestrator.
upgrade_check_max_tries = <positive integer>
* Specifies the maximum number of times the orchestrator checks the status of
  a peer node while waiting for it to come back online during an upgrade.
* If the peer node does not come back online before the orchestrator performs
  the maximum number of status checks, the orchestrator registers a peer node
  upgrade failure and stops further cluster upgrade.
* Default: 30

delay_after_each_upgrade_check = <positive integer>
* The amount of time, in seconds, the orchestrator waits before doing the
  next status check of a peer node, while waiting for it to come back online
  during an upgrade.
* Default: 20

concurrency = <positive integer>
* Specifies the number of peer nodes to upgrade simultaneously.
* This value cannot be greater than (search factor - 1). For
  example, if the search factor is 3, this value cannot be greater than 2.
* Setting this value to a number greater than search factor minus one will
  result in a failure during upgrade initiation.
* Default: min((search factor - 1), (cluster_size - 1)/2)), where cluster_size
  is the total number of peers. For example, if (search factor - 1) is 2, and
  (cluster_size - 1)/2 is 4, then the default value is 2.

enable_midpoint_status_check = <boolean>
* Determines whether the splunk-rolling-upgrade app splits a single site
  indexer cluster upgrade into two halves and performs an additional health check
  on the entire cluster.
* A value of "true" means that the splunk-rolling-upgrade app first upgrades
  50% of the peer nodes, then performs a health check on the entire cluster,
  and finally upgrades the remaining 50% of the peers.
* The additional health check verifies that all peer nodes are up and that
  the indexer cluster meets searchability requirements.
* Default: true

midpoint_check_max_tries = <positive integer>
* The maximum number of times the splunk-rolling-upgrade app waits for a
  successful indexer cluster health check status after upgrading 50% of the
  peers of a given site.
* Default: 3

midpoint_check_retry_delay = <positive integer>
* The amount of time, in seconds, the splunk-rolling-upgrade app waits before
  retrying the midpoint indexer cluster health check
* Default: 20

