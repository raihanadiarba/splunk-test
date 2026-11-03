[search_artifacts_helper://<name>]
* This is the search artifacts helper input component for Splunk that manages the
  uploading of search artifacts to the remote store.

upload_process_maxtime = <integer>
* The maximum duration, in seconds, for the modular input process that
  uploads search artifacts. If the process exceeds this time, the process
  exits and gets restarted by the modular input framework.
* Default: 86400

num_archive_threads = <integer>
* The maximum number of threads to perform artifact archiving in the search_artifacts_helper process.
* Artifact archiving is CPU intensive. Increasing the num_archive_threads can result in high CPU utilization.
* Default: 3

upload_execution_threads = <integer>
* The maximum number of threads to use to upload artifacts.
* Default: 20

upload_queue_size = <integer>
* The maximum number of upload jobs to queue before blocking.
* Default: 10000

upload_queue_timeout = <integer>
* The maximum amount of time, in seconds, to block when the queue size is full.
* Default: 60

process_runner_poll_interval = <integer>
* The frequency, in seconds, that the search_artifacts_helper process checks
  whether its parent process (the splunkd process runner) is running. The
  search_artifacts_helper process shuts down when its parent is no longer running.
* Default: 30
