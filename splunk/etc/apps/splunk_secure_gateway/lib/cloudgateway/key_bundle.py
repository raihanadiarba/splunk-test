import tempfile
import ssl
import certifi


def _make_temporary_file(data):
    f = tempfile.NamedTemporaryFile()

    for item in data:
        f.write(item.encode())

    f.flush()
    # set reading back at the beginning
    f.seek(0, 0)
    return f


class RegularTlsContext(object):
    def __init__(self, ctx):
        self.ctx = ctx

    def __enter__(self):
        return self.ctx

    def __exit__(self, exc_type, exc_val, exc_tb):
        pass


def asyncio_ssl_context(key_bundle, verify_ssl: bool = True):
    context = ssl.create_default_context(cafile=certifi.where())
    if not verify_ssl:
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE

    if not key_bundle:
        return RegularTlsContext(context)

    return MtlsSslContext(context, key_bundle)


class MtlsSslContext(object):
    def __init__(self, context, key_bundle):
        self.context = context
        self.key_bundle = key_bundle

    def __enter__(self):
        self._key_file = self.key_bundle.make_pkey_file()
        self._cert_file = self.key_bundle.make_cert_file()
        self.context.load_cert_chain(certfile=self._cert_file.name, keyfile=self._key_file.name)
        return self.context

    def __exit__(self, exc_type, exc_val, exc_tb):
        self._key_file.close()
        self._cert_file.close()


class KeyBundle(object):

    _UTF8 = 'utf-8'

    def __init__(self, cert_pem, key_pem):
        self._pkey_pem = key_pem
        self._cert_pem = cert_pem

    @property
    def pkey_pem(self):
        return self._pkey_pem

    @property
    def cert_pem(self):
        return self._cert_pem

    def make_pkey_file(self):
        return _make_temporary_file([self._pkey_pem])

    def make_cert_file(self):
        return _make_temporary_file([self._cert_pem])

    def make_temporary_file(self):
        return _make_temporary_file([self._cert_pem, self._pkey_pem])

class KeyBundlePath(KeyBundle):
    def make_pkey_file(self):
        return open(self._pkey_pem)

    def make_cert_file(self):
        return open(self._cert_pem)