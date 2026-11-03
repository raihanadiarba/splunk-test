"""
Service for outputs configuration
"""

from agent import NotFoundException
from agent.services.configuration_entry_service import ConfigurationEntryService
from agent.common.json_schema import validate_schema
from agent.models import \
    ConfigurationEntryTcpOut


_IN_DEFAULT_GROUP_KEY = "@inDefaultGroup"

_DEFAULT_GROUP_KEY = "defaultGroup"

_IN_DEFAULT_GROUP_SCHEMA = {
    "type": "array",
    "items": {
        "additionalProperties": False,
        "type": "string"
    }
}


def _get_default_group_list(entry):
    """Get default group list from a conf entry
    """
    return entry.content.get(_DEFAULT_GROUP_KEY) or []


class OutputsConfigurationService(ConfigurationEntryService):
    """Outputs configuration service
    """

    _GROUP = "outputs"

    def __init__(self):
        super(OutputsConfigurationService, self).__init__([
            ConfigurationEntryTcpOut
        ])

    def update(self, component, bundle, name, params):
        """Update conf entry and its default group. This method is invoked in the scope of create/edit that check input
        parameters and this guarantees that call to super.update cannot fail.
        """
        in_default_group = params.get(_IN_DEFAULT_GROUP_KEY)

        if in_default_group is not None:
            self._check_in_default_group(in_default_group)
            del params[_IN_DEFAULT_GROUP_KEY]
            self._update_default_group(component, name, in_default_group)

        return super(OutputsConfigurationService, self).update(component, bundle, name, params)

    def query_stanzas(self, component, bundles, req_query, offset=0, count=0, reverse=False, sort_key=None):
        """Query conf stanzas adding @inDefaultGroup to the content. This method is called by get/list operations
        """
        reply_entries, reply_total = super(OutputsConfigurationService, self).query_stanzas(
            component, bundles, req_query, offset, count, reverse, sort_key)

        if reply_total > 0:
            # add @inDefaultGroup to reply content
            defaults = self._query_default_stanzas(component)
            for reply_entry in reply_entries:
                reply_entry.content[_IN_DEFAULT_GROUP_KEY] = [
                    entry.get_formatted_bundle_info()
                    for entry in defaults
                    if reply_entry.name in _get_default_group_list(entry)
                ]

        return reply_entries, reply_total

    def delete(self, component, bundle, name):
        """Delete a conf entry including its default groups
        """
        self._delete_from_default_groups(component, name)
        return super(OutputsConfigurationService, self).delete(component, bundle, name)

    def move(self, component, bundle, name, target_bundle):
        """Move an item to the target bundle
        """
        reply = self.copy(component, bundle, name, target_bundle)
        # remove the source without touching the default groups
        super(OutputsConfigurationService, self).delete(component, bundle, name)

        return reply

    def _update_default_group(self, component, name, in_default_group):
        """Update conf entry default groups adding name to the default stanzas. For example:
        [tcpout]
        defaultGroup = ..., ..., name
        """
        component_impl = self.get_component_impl(component)

        # fist delete the "old" default group
        self._delete_from_default_groups(component, name)

        for bundle in in_default_group:
            # for each bundle in the default group get "default stanza (for example [tcpout])"
            entries, total = self.get(component, bundle, component_impl.stanza())
            assert total in (0, 1)
            # add name to the defaultGroup
            default_group_list = _get_default_group_list(entries[0]) if total == 1 else []
            if name not in default_group_list:
                default_group_list.append(name)
                # update the stanzas
                super(OutputsConfigurationService, self).update(
                    component, bundle, component_impl.stanza(),
                    {_DEFAULT_GROUP_KEY: default_group_list}
                )

    def _delete_from_default_groups(self, component, name):
        """Remove conf item from the default groups
        """
        component_impl = self.get_component_impl(component)

        for entry in self._query_default_stanzas(component):
            default_group_list = _get_default_group_list(entry)
            if name in default_group_list:
                default_group_list.remove(name)
                super(OutputsConfigurationService, self).update(
                    component, entry.bundle_info["name"], component_impl.stanza(),
                    {_DEFAULT_GROUP_KEY: default_group_list}
                )

    def _query_default_stanzas(self, component):
        """Return all default stanzas in component
        """
        component_impl = self.get_component_impl(component)

        stanzas, _ = super(OutputsConfigurationService, self).query_stanzas(
            component,
            None,  # all bundles
            {"name": "^%s$" % component_impl.stanza()}  # exact name
        )

        return stanzas

    def _check_in_default_group(self, group):
        """Raise an exception if a bundle doesn't exist
        """
        validate_schema(group, _IN_DEFAULT_GROUP_SCHEMA)
        for bundle in group:
            if not self._stanzas_service.is_bundle_valid(bundle):
                raise NotFoundException(fmt="Bundle %s not found" % bundle)
