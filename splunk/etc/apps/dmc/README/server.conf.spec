#   Version 10.6.1.1
#
# This file contains the set of attributes and values you can use to
# configure server options in server.conf.
#
# There is a server.conf in $SPLUNK_HOME/etc/system/default/.  To set custom
# configurations, place a server.conf in $SPLUNK_HOME/etc/system/local/.
# For examples, see server.conf.example.  You must restart Splunk to enable
# configurations.
#
# To learn more about configuration files (including precedence) please see
# the documentation located at
# http://docs.splunk.com/Documentation/Splunk/latest/Admin/Aboutconfigurationfiles

[dmc]
bindAddress = <address or IP to bind on>
* What interface to bind to
* Defaults to 127.0.0.1

port = <port>
* What port the DMC agent should bind itself to
* Defaults to 8084

pass4SymmKey = <password>
* When mode is proxy or server: authenticates traffic between DMC primary and secondary proxies
* When mode is proxy or client: used as a password for splunk-system-user.

proxyAddress = <URI>
* URI of the primary proxy. This setting should be used in secondary proxy only.

mode = <disabled|proxy|full|forwarder_management|client>
* Default is disabled
* Modified by system only.

sslVersions = <comma-separated list>
* The list of TLS versions to use to connect to the primary proxy server, as
  specified in 'proxyAddress'.
* The versions available are "tls1.2" and "tls1.3".
* TLS versions 1.0 and 1.1 are not supported and are always turned off.
* Use the value "tls" or "*" to include all supported TLS versions.
* If a version is prefixed with "-" it is removed from the list.
* The values "-ssl2", "-ssl3", "-tls1.0", and "-tls1.1" are accepted in
  the version list, but have no effect.
* Defaults to sslVersions value in server.conf [sslConfig] stanza.

sslVerifyServerCert = <bool>
* If this is set to true, Splunk verifies that the primary proxy (specified in 'proxyAddress')
  being connected to is a valid one (authenticated).  Both the common
  name and the alternate name of the server are then checked for a
  match if they are specified in 'sslCommonNameToCheck' and 'sslAltNameToCheck'.
  A certificiate is considered verified if either is matched.
* Defaults to sslVerifyServerCert value in server.conf [sslConfig] stanza.

sslVerifyServerName = <boolean>
* Whether or not splunkd, as a client, performs a TLS hostname validation check
  on an SSL certificate that it receives upon an initial connection
  to a server.
* A TLS hostname validation check ensures that a client
  communicates with the correct server, and has not been redirected to
  another by a machine-in-the-middle attack, where a malicious party inserts
  themselves between the client and the target server, and impersonates
  that server during the session.
* Specifically, the validation check forces splunkd to verify that either
  the Common Name or the Subject Alternate Name in the certificate that the
  server presents to the client matches the host name portion of the URL that
  the client used to connect to the server.
* For this setting to have any effect, the 'sslVerifyServerCert' setting must
  have a value of "true". If it doesn't, TLS hostname validation is not possible
  because certificate verification is not on.
* A value of "true" for this setting means that splunkd performs a TLS hostname
  validation check, in effect, verifying the server's name in the certificate.
  If that check fails, splunkd terminates the SSL handshake immediately. This terminates
  the connection between the client and the server. Splunkd logs this failure at
  the ERROR logging level.
* A value of "false" means that splunkd does not perform the TLS hostname
  validation check. If the server presents an otherwise valid certificate, the
  client-to-server connection proceeds normally.
* Default: The value of server.conf:[sslConfig]/'sslVerifyServerName'

caPath = <path>
* DEPRECATED; use absolute paths for all certificate files.
* If certificate files given by other settings in this stanza are not absolute
  paths, then they will be relative to this path.
* Defaults to caPath value in server.conf [sslConfig] stanza.

caCertFile = <path>
* Full path to a CA (Certificate Authority) certificate(s) PEM format file.
* The <path> must refer to a PEM format file containing one or more root CA
  certificates concatenated together.
* Used for validating SSL certificate from primary proxy (specified in 'proxyAddress')
* Defaults to caCertFile value in server.conf [sslConfig] stanza.

sslCommonNameToCheck = <commonName1>, <commonName2>, ...
* If this value is set, and 'sslVerifyServerCert' is set to true,
  splunkd checks the common name(s) of the certificate presented by
  the primary proxy (specified in 'proxyAddress') against this list of common names.
* Defaults to sslCommonNameToCheck value in server.conf [sslConfig] stanza.

sslAltNameToCheck =  <alternateName1>, <alternateName2>, ...
* If this value is set, and 'sslVerifyServerCert' is set to true,
  splunkd checks the alternate name(s) of the certificate presented by
  the primary proxy (specified in 'proxyAddress') against this list of subject alternate names.
* Defaults to sslAltNameToCheck value in server.conf [sslConfig] stanza.

cipherSuite = <cipher suite string>
* If set, uses the specified cipher string for making outbound HTTPS connection to
* the primary proxy (specified in 'proxyAddress').
* Defaults to cipherSuite value in server.conf [sslConfig] stanza.

ecdhCurves = <comma separated list of ec curves>
* ECDH curves to use for ECDH key negotiation.
* The curves should be specified in the order of preference.
* The client sends these curves as a part of Client Hello to the primary proxy (specified in 'proxyAddress').
* We only support named curves specified by their SHORT names.
  (see struct ASN1_OBJECT in asn1.h)
* The list of valid named curves by their short/long names can be obtained
  by executing this command:
  $SPLUNK_HOME/bin/splunk cmd openssl ecparam -list_curves
* Default is empty string.
* e.g. ecdhCurves = prime256v1,secp384r1,secp521r1
* Default: The value of 'server.conf:[sslConfig]/ecdhCurves'.
