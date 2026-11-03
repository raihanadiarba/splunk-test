import base64
import json
import smtplib
import socket

import splunk
import splunk.entity as entity
import splunk.mining.dcutils as dcu
import splunk.secure_smtplib as secure_smtplib
import splunk.ssl_context as ssl_context
from splunk.rest import simpleRequest
from abc import ABC, abstractmethod

defaultLogger = dcu.getLogger()


def _mask_email(address):
    '''Return a masked representation of an email address for safe logging.

    e.g. "alice@gmail.com" -> "a***e@g***m.com"
    Returns the original string unchanged if it does not match name@domain format
    or if masking fails for any reason.
    '''
    try:
        if not address or '@' not in address:
            return address
        local, _, domain = address.partition('@')
        if not local or not domain:
            return address
        def _mask(s):
            if len(s) <= 2:
                return s[0] + '*' * (len(s) - 1) if s else s
            return s[0] + '*' * (len(s) - 2) + s[-1]
        domain_parts = domain.rsplit('.', 1)
        masked_domain = _mask(domain_parts[0]) + ('.' + domain_parts[1] if len(domain_parts) > 1 else '')
        return '%s@%s' % (_mask(local), masked_domain)
    except Exception:
        return address


class SMTPConfig:
    def __init__(self,
                 logCtx,
                 mailserver,
                 sessionKey,
                 useSSL,
                 useTLS,
                 sslConfigAsJSON,
                 cLogger=None):

        self.logger = cLogger or defaultLogger
        self.logCtx = logCtx

        self.mailserver = mailserver
        self.sessionKey = sessionKey
        self.useSSL = useSSL
        self.useTLS = useTLS
        self.sslConfigAsJSON = sslConfigAsJSON
        self.smtp_connection = None

        self.createSMTPObj()

    def createSMTPObj(self):
        try:
            # setup the Open SSL Context
            sslHelper = ssl_context.SSLHelper()
            serverConfJSON = sslHelper.getServerSettings(self.sessionKey)
            ctx = sslHelper.createSSLContextFromSettings(
                sslConfJSON=self.sslConfigAsJSON,
                serverConfJSON=serverConfJSON,
                isClientContext=True)

            protocol = 'SSL' if self.useSSL else ('TLS' if self.useTLS else 'plain')
            self.logger.debug('smtp: Attempting connection to mailserver=%s protocol=%s. Context=%s' % (
                self.mailserver, protocol, self.logCtx))

            if not self.useSSL:
                self.smtp_connection = secure_smtplib.SecureSMTP(host=self.mailserver)
            else:
                self.smtp_connection = secure_smtplib.SecureSMTP_SSL(host=self.mailserver, sslContext=ctx)
            if self.useTLS:
                self.smtp_connection.ehlo()
                self.smtp_connection.starttls(ctx)

            self.logger.info('smtp: Connected to mailserver=%s protocol=%s. Context=%s' % (
                self.mailserver, protocol, self.logCtx))

        except Exception as e:
            self.logger.error('Unable to create SMTP Object. Error=%s. Context=%s' % (str(e), self.logCtx))
            raise


class CustomSMTPConfig(SMTPConfig):
    '''
    SMTPConfig subclass for the custom SMTP path (Splunk Cloud only).
    Handles host parsing and IPv4-first connection attempts.
    '''

    DEFAULT_PORT_TLS = 587
    DEFAULT_PORT_SSL = 465

    def __init__(self,
                 logCtx,
                 mailserver,
                 sessionKey,
                 useSSL,
                 useTLS,
                 sslConfigAsJSON,
                 cLogger=None):
        self.smtp_host, self.smtp_port = CustomSMTPConfig._parseMailserver(
            mailserver, useSSL, useTLS
        )
        super().__init__(logCtx, mailserver, sessionKey, useSSL, useTLS, sslConfigAsJSON, cLogger)

    @staticmethod
    def _parseMailserver(mailserver, useSSL, useTLS):
        '''
        Parse the host and port from a mailserver string.

        If an explicit port is embedded in the mailserver string (e.g. "smtp.example.com:2525"),
        that port is used regardless of useSSL/useTLS. If no port is given, the port is derived
        from the security settings:

          useSSL=True  → 465
          useTLS=True  → 587
          neither      → ValueError (plain-text port 25 is not supported on Splunk Cloud)

        This matches on-premises smtplib behaviour, where host:port is respected,
        while enforcing that a secure port is always used when no port is specified.

        @param mailserver: mailserver value from alert_actions.conf (e.g. "smtp.gmail.com" or "smtp.gmail.com:587")
        @type mailserver: str

        @param useSSL: whether SSL (SMTPS) is configured
        @type useSSL: bool

        @param useTLS: whether STARTTLS is configured
        @type useTLS: bool

        @returns: (host, port)
        @rtype: tuple(str, int)

        @raises ValueError: if no port is specified and neither useSSL nor useTLS is set
        '''
        mailserver = (mailserver or '').strip()
        if not mailserver:
            raise ValueError('custom_smtp: mailserver must not be empty.')
        if ':' in mailserver:
            # Reject IPv6 literals — not supported in this iteration.
            # Bracketed form [::1]:587 and bare form 2001:db8::1 both contain
            # multiple colons or a leading bracket.
            if mailserver.startswith('[') or mailserver.count(':') > 1:
                raise ValueError(
                    'custom_smtp: Mailserver "%s" does not support IPv6 addresses. '
                    'Use a hostname or IPv4 address.' % mailserver
                )
            host, _, port_str = mailserver.rpartition(':')
            if not host:
                raise ValueError('custom_smtp: Mailserver must not be empty.')
            if not port_str.isdigit():
                raise ValueError(
                    'custom_smtp: Invalid port in mailserver "%s". '
                    'Expected format: host:port (e.g. smtp.example.com:587).' % mailserver
                )
            return host, int(port_str)

        # No explicit port — derive from security settings
        if useSSL:
            return mailserver, CustomSMTPConfig.DEFAULT_PORT_SSL
        elif useTLS:
            return mailserver, CustomSMTPConfig.DEFAULT_PORT_TLS
        else:
            raise ValueError(
                'custom_smtp: No network port was specified in mailserver and neither the useSSL nor useTLS settings has a value. '
                'Splunk Cloud Platform does not support the usage of plaintext SMTP operations over port 25.'
            )

    def createSMTPObj(self):
        '''
        Override of SMTPConfig.createSMTPObj() for the custom SMTP path.

        Resolves self.smtp_host to IPv4 addresses and tries each in order.
        Raises if DNS resolution returns no IPv4 addresses or all connection
        attempts fail.
        '''
        try:
            sslHelper = ssl_context.SSLHelper()
            serverConfJSON = sslHelper.getServerSettings(self.sessionKey)
            ctx = sslHelper.createSSLContextFromSettings(
                sslConfJSON=self.sslConfigAsJSON,
                serverConfJSON=serverConfJSON,
                isClientContext=True)
        except Exception as e:
            self.logger.error('custom_smtp: Failed to build SSL context. Error=%s. Context=%s' % (str(e), self.logCtx))
            raise

        try:
            all_addrs = socket.getaddrinfo(self.smtp_host, self.smtp_port, socket.AF_INET, socket.SOCK_STREAM)
        except socket.gaierror as e:
            self.logger.error('custom_smtp: DNS resolution failed for host=%s. Error=%s. Context=%s' % (self.smtp_host, str(e), self.logCtx))
            raise

        ipv4_addrs = [a for a in all_addrs if a[0] == socket.AF_INET]
        if not ipv4_addrs:
            raise Exception('custom_smtp: no IPv4 addresses resolved for host=%s port=%d. Context=%s' % (
                self.smtp_host, self.smtp_port, self.logCtx))

        protocol = 'SSL' if self.useSSL else ('TLS' if self.useTLS else 'plain')
        self.logger.debug('custom_smtp: Attempting connection to host=%s port=%d protocol=%s candidates=%d. Context=%s' % (
            self.smtp_host, self.smtp_port, protocol, len(ipv4_addrs), self.logCtx))

        errors = []
        for addr_info in ipv4_addrs:
            _, _, _, _, sockaddr = addr_info
            ip = sockaddr[0]
            conn = None
            try:
                if not self.useSSL:
                    conn = secure_smtplib.SecureSMTP(host=ip, port=self.smtp_port)
                else:
                    conn = secure_smtplib.SecureSMTP_SSL(host=ip, port=self.smtp_port, sslContext=ctx)
                if self.useTLS:
                    conn.ehlo()
                    conn.starttls(ctx)
                self.smtp_connection = conn
                self.logger.info('custom_smtp: Connected via ip=%s port=%d host=%s. Context=%s' % (
                    ip, self.smtp_port, self.smtp_host, self.logCtx))
                return
            except Exception as e:
                self.logger.debug('custom_smtp: connection attempt failed. ip=%s port=%d error=%s' % (
                    ip, self.smtp_port, str(e)))
                errors.append('ip=%s: %s' % (ip, str(e)))
                if conn is not None:
                    try:
                        conn.close()
                    except Exception:
                        pass

        raise Exception('custom_smtp: All connection attempts failed for host=%s port=%d. Errors: [%s]. Context=%s' % (
            self.smtp_host, self.smtp_port, '; '.join(errors), self.logCtx))


class SMTPAuth(ABC):
    @abstractmethod
    def authenticate(self):
        pass


class SMTPBasicAuth(SMTPAuth):
    def __init__(self, smtp_connection, username, password, logger=None):
        self.smtp_connection = smtp_connection
        self.username = username
        self.password = password
        self.logger = logger or defaultLogger

    def authenticate(self):
        masked = _mask_email(self.username)
        self.logger.debug('smtp: Attempting Basic Auth for username=%s.' % masked)
        try:
            self.smtp_connection.ehlo()
            self.smtp_connection.login(self.username, self.password)
            self.logger.info('smtp: Basic Auth succeeded for username=%s.' % masked)
        except smtplib.SMTPAuthenticationError as e:
            self.logger.error('smtp: Basic Auth failed for username=%s. SMTP code=%s message=%s.' % (
                masked, e.smtp_code, e.smtp_error))
            raise
        except Exception as e:
            self.logger.error('smtp: Basic Auth error for username=%s. Error=%s.' % (masked, str(e)))
            raise Exception('Error authenticating with username and password provided. Error=%s.' % str(e))


class SMTPOAuth(SMTPAuth):
    def __init__(self, smtp_connection, sessionKey, logger):
        self.sessionKey = sessionKey
        self.logger = logger or defaultLogger
        self.fromAddress, self.token = SMTPOAuth.getToken(self.sessionKey, self.logger)
        self.smtp_connection = smtp_connection

    def authenticate(self):
        masked = _mask_email(self.fromAddress)
        self.logger.debug('smtp: Attempting OAuth (XOAUTH2) for from_address=%s.' % masked)
        try:
            if not self.fromAddress or not self.token:
                raise Exception("Received empty client ID or oAuth Token")
            self.smtp_connection.ehlo()
            self.smtp_connection.docmd('AUTH', f'XOAUTH2 {self.generate_sasl_xoauth2_string()}')
            self.logger.info('smtp: OAuth (XOAUTH2) authentication succeeded for from_address=%s.' % masked)
        except smtplib.SMTPAuthenticationError as e:
            self.logger.error('smtp: OAuth authentication failed for from_address=%s. SMTP code=%s message=%s.' % (
                masked, e.smtp_code, e.smtp_error))
            raise
        except Exception as e:
            self.logger.error('smtp: OAuth authentication error for from_address=%s. Error=%s.' % (masked, str(e)))
            raise

    def generate_sasl_xoauth2_string(self):
        try:
            if not self.fromAddress or not self.token:
                raise Exception("Received empty from address (sender address) or oAuth Token")
            auth_string = f"user={self.fromAddress}\x01auth=Bearer {self.token}\x01\x01"
            return base64.b64encode(auth_string.encode('utf-8')).decode('utf-8')
        except Exception as e:
            err = f'Error generating SASL XOAUTH2 string. Error=%s.' % (str(e))
            self.logger.error(err)
            raise

    @classmethod
    def getToken(cls, sessionKey, logger, namespace="system", owner="nobody"):
        try:
            # /servicesNS/nobody/system/configs/conf-alert_actions/email/token
            entityClass = ['configs', 'conf-alert_actions', 'email', 'token']
            uri = entity.buildEndpoint(
                entityClass,
                namespace=namespace,
                owner=owner
            )
            responseHeaders, responseBody = simpleRequest(uri, method='GET', getargs={'output_mode':'json'}, sessionKey=sessionKey)
            alertConfig = json.loads(responseBody)
            token = alertConfig['entry'][0]['content']['token']['value']
            emailConfig = entity.getEntity('configs/conf-alert_actions', 'email', sessionKey=sessionKey)

            if not emailConfig.get('from') or not token:
                return None, None
        except splunk.ResourceNotFound:
            return None, None
        except Exception as e:
            logger.error('Could not retrieve token from alert actions conf file. Error=%s' % str(e))
            raise Exception('Could not retrieve token from alert actions. Error: %s' % str(e))

        return emailConfig.get('from'), token.strip()

    @classmethod
    def isOAuthEnabled(cls, sessionKey, logger):
        try:
            _, token = SMTPOAuth.getToken(sessionKey, logger)
            return token is not None
        except Exception:
            logger.warning('Could not determine if OAuth is enabled. Defaulting to Basic Auth.')
            return False
