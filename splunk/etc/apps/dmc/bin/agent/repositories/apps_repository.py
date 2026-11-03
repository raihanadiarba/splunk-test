"""
Apps repository
"""
from agent.models.bundle import BundleType
from agent.models.change import EventType

from agent import wtransaction
from agent.repositories.base_repository import KVStoreRepositoryBase
from agent.repositories.helpers import clean_private_kvstore_values
from agent.models import App
from agent.models.app import AppProperty


class KVStoreAppsRepository(KVStoreRepositoryBase):

    """Repository for storing properties of apps installed on the DMC for deployment

    Implemented using KVStore.
    """

    CollectionName = App.COLLECTION
    LogEventType = EventType.app
    StanzaBundleType = BundleType.app

    @clean_private_kvstore_values
    @wtransaction
    def update(self, obj, log_change=True):
        """Save app in KVStore, persisting package properties if not present
        """
        current_obj = self.get(obj.get_value("name"))

        app_properties = [
            AppProperty.STAGED, AppProperty.PACKAGE, AppProperty.PACKAGE_TYPE, AppProperty.TRANSACTION_ID
        ]
        for app_property in app_properties:
            if current_obj.has_path(app_property) and not obj.has_path(app_property):
                obj.set_value(app_property, current_obj.get_value(app_property))

        return super(KVStoreAppsRepository, self).update(obj, log_change)

    def make_log_label(self, key):
        """Make the label field for the AppsRepository key
        """
        app_label = self._stanzas_service.get_app_label(key)
        label_obj = {"label": app_label or key}
        return label_obj

    def make_log_key(self, key):
        """
        Make the key object used for AppsRepository event types
        Default key object must have key.name field
        AppsRepository key has added label field
        """
        app_label = self._stanzas_service.get_app_label(key)
        key_obj = {"name": key, "label": app_label or key}
        return key_obj

    def _object_factory(self, entity):
        return App(json=entity, keep_original=True)
