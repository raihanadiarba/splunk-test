#   Version 10.6.1.1
#
# ** FOR USE IN SPLUNK CLOUD ONLY
#
# This file contains the set of attributes and values you can use to
# configure in scsaudit.conf.

# For more information on configuration files, search for 
  "configuration files" in the Admin Manual in the Splunk Docs.

[internal_settings]
sqs_message_max_retry = <integer>
* The maximum number of times to retry ingesting a message from SQS.
* Default: 3

sqs_receive_wait_time_seconds = <integer>
* Wait time in seconds for the SQS ReceiveMessage API. When greater than 0,
  long polling is in effect.
* Default: 20

sqs_max_receive_number = <integer>
* Maximum number of messages to receive in one request from SQS.
* Default: 10

azsb_message_max_retry = <integer>
* The maximum number of times to retry ingesting a message from Azure Service Bus queue.
* Default: 3

azsb_receive_wait_time_seconds = <integer>
* Wait time in seconds for the Azure Service Bus message receive call.
  When greater than 0, long polling is in effect.
* Default: 20

azsb_max_receive_number = <integer>
* Maximum number of messages to receive in one request from Azure Service Bus queue.
* Default: 100

googlepubsub_message_max_retry = <integer>
* The maximum number of times to retry ingesting a message from GCP PubSub subscription.
* Default: 3

googlepubsub_receive_wait_time_seconds = <integer>
* Wait time in seconds for the GCP PubSub message receive call.
* Default: 20

googlepubsub_max_receive_number = <integer>
* Maximum number of messages to receive in one request from GCP PubSub subscription.
* Default: 100

audit_trail_request_timeout = <integer>
* Timeout in seconds for the REST call to the audit trail API.
* Default: 3

region = <string>
* AWS region of the SQS queue. Should be set by Puppet.

stack = <string>
* Name of the stack. Should be set by Puppet.

cloud_provider = <string>
* Name of cloud provider. Should be set by Puppet.
