remoteProxyLegacyRequireDoubleEncodedUriArgs = <boolean>
* DEPRECATED.
* NOTE: This is a workaround for SPL-243205, do not configure for new use cases.
* Determines whether the remote-proxy endpoint requires HTTP GET arguments to be double-encoded
  before it can forward them to the destination endpoint.
* A value of "true" means the GET arguments must be double-encoded, for example:
  https://<server>:<port>/services/remote-proxy/<REST endpoint>?proxy_to=<proxy_to>&param1%3Dval1%26param2%3Dval2%26param3=val3'.
* A value of "false" means the GET arguments don't need to be double-encoded,
  as the REST endpoint handles the encoding,
  for example: https://<server>:<port>/services/remote-proxy/<REST endpoint>?proxy_to=<proxy_to>&param1=val1&param2=val2&param3=val3'.
* Default: false
