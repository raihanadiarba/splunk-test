"""Helper class with the methods to secure storage interactions.
"""
import logging

from agent import ioc, NotFoundException
from agent.common.helpers import generate_guid
from agent.models.json_entity import View
from agent.splunklib.binding import HTTPError
from agent.splunklib.client import Entity


class SecureStorage(object):  # pylint: disable=useless-object-inheritance
    """Base class to make REST calls using service
    """
    REST_URL = "/servicesNS/nobody/dmc/storage/passwords"
    keyname = "_secureStorageKey"

    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)
        self._splunk_host = ioc.components.splunk_host()
        self._service = self._splunk_host.get_service(owner="nobody", app="dmc")

    def decrypt(self, key):
        """Make get request on the service
        """
        try:
            entity = Entity(self._service, self.REST_URL + "/" + key[self.keyname])
            return entity.content['clear_password']
        except HTTPError as ex:
            if ex.status == 404:  # pylint: disable=no-else-raise
                raise NotFoundException(key[self.keyname])
            else:
                # pylint: disable-next=broad-exception-raised
                raise Exception("Secure Storage failed with %s - %s" % (ex.status, ex.reason)) from ex

    def encrypt(self, password):
        """Make post on the service
        """
        key = generate_guid()
        self._service.post(self.REST_URL, name=key, password=password)
        return {self.keyname: key}

    def encrypt_with_key(self, key, password):
        """encrypt with the existing key
        """
        self._service.post(self.REST_URL, name=key[self.keyname], password=password)
        return key

    def delete(self, key):
        """delete the password
        """
        self._service.delete(self.REST_URL + '/' + key[self.keyname])

    def delete_safe(self, key):
        """Delete the password, and if does not exist, just ignore that
        """
        try:
            self.delete(key)
            return True
        except HTTPError:
            return False

    def delete_all_secrets(self, entity):
        """delete all secrets in entity
        """
        self._delete_all_secrets(entity.json(View.RepositoryView))

    def decrypt_all_secrets(self, obj):
        """Decrypt all values in obj (dictionary is expected)
        """
        assert isinstance(obj, dict)
        self._decrypt_all_secrets(obj)

    def _delete_all_secrets(self, obj):
        """delete all secrets in obj
        """
        if self._is_secret(obj):
            self.delete(obj)
        elif isinstance(obj, list):
            for value in obj:
                self._delete_all_secrets(value)
        elif isinstance(obj, dict):
            for value in obj.values():
                self._delete_all_secrets(value)

    def _decrypt_all_secrets(self, obj):
        """Decrypt all secrets in object
        """
        if isinstance(obj, list):
            for index, _ in enumerate(obj):
                if self._is_secret(obj[index]):
                    obj[index] = self.decrypt(obj)
                else:
                    self._decrypt_all_secrets(obj[index])
        elif isinstance(obj, dict):
            for key, value in obj.items():
                if self._is_secret(value):
                    obj[key] = self.decrypt(value)
                else:
                    self._decrypt_all_secrets(value)

    def _is_secret(self, obj):
        """Verify if object is a secret
        """
        return isinstance(obj, dict) and len(obj) == 1 and self.keyname in obj
