[webhook]

param.user_agent = <string>
* The value of the User-Agent HTTP header that the Splunk platform sends
  to the webhook receiver.
* No default.

enable_allowlist = <boolean>
* Whether or not the Splunk platform alert webhook uses the webhook allowlist
  when it performs a webhook query.
* The webhook allowlist defines the URLs for which webhook
  alert actions can send HTTP POST requests.
* A value of "true" means that the webhook allowlist is turned on, and
  that the Splunk platform lets the webhook action query against any endpoint.
  See the CAUTION later in this description for details.
* A value of "false" means that the webhook allowlist is turned off.
* While this setting is valid within the alert-actions.conf file
  within the alert_webhook app, it is also available in the
  alert-actions.conf file in Splunk Enterprise.
* CAUTION: Be mindful when using this setting. If you give the setting
  a value of "true", you must also configure the 'allowlist.<name>' setting.
  Failure to do so is a security risk, as the webhook alert action can then
  query against any REST endpoint, including external endpoints that are not
  in your control and could be malicious.
* Default (for Splunk Cloud Platform): true
* Default (for all other Splunk products including Splunk Enterprise): false

allowlist.<name> = <regular expression>
* A list of endpoints upon which the Splunk platform webhook action can query.
* Each allowlist entry must begin with the string "allowlist." and must be
  on its own line.
* The <name> component of an allowlist entry can be any string, but must be
  unique for each entry.
* Values are regular expression strings which must match URLs which you allow
  the webhook action to access.
* Following is an example allowlist:
  * allowlist.endpoint1 = ^https:\/\/10\.201\..*\/
    * This allowlist entry lets the webhook action access URLs of endpoints that
      begin with the string "https://10.201" and end with a forward slash (/).
  * allowlist.endpoint2 = ^https:\/\/(.*\.|)company.com\/?.*\/
    * This allowlist entry lets the webhook action access URLs of endpoints that
      begin with the string "https://", contain any machine within the domain
      "company.com", and end with a forward slash (/).
* CAUTION: If you don't specify an allowlist after configuring the 'enable_allowlist'
  setting with a value of "true", the Splunk platform lets the webhook
  action query against any endpoint, which is a security risk.
* No default.
