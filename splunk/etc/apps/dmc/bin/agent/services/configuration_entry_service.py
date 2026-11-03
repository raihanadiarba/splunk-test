"""
Service for "purpose built UI"
"""

import logging
import os
import stat
import re
import base64
from collections import OrderedDict
from agent import ioc, wtransaction
from agent import NotFoundException, UniqueItemException
from agent.models.bundle import BundleType
from agent.common.json_schema import validate_schema
from agent.services.stanzas_service import \
    ALL_BUNDLES_WILDCARD, compute_bundle_type_and_id
from agent.common.helpers import mkdir_p


_ATTACH_KEY = "@attach"  # key of the input substructure that describes attached files


_LIST_QUERY_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "properties": {
        "name": {"type": "string"}
    },
    "required": ["name"]
}

_FILES_ATTACH_SCHEMA = {
    "type": "array",
    "items": {
        "additionalProperties": False,
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                # Check that files names in attach are "safe", i.e., simple names without a path part. Otherwise this
                # opens a huge security hole allowing to change any file in the system.
                "format": lambda file_name: os.path.basename(file_name) == file_name
            },
            "content": {"type": "string"}
        },
        "required": ["name", "content"]
    }
}


class ConfigurationEntryService(ioc.Component):
    """Handler of purpose built UI actions
    """

    _GROUP = None  # configuration groups (inputs, outputs)

    def __init__(self, components_impl):
        self._logger = logging.getLogger(self.__class__.__name__)
        self._splunk_home = ioc.components.splunk_home()
        self._stanzas_service = ioc.services.stanzas_service()
        self._instances_service = ioc.services.instances_service()
        self._apps_service = ioc.services.apps_service()

        self._component_impl = {impl.component(): impl for impl in components_impl}

    @classmethod
    def group(cls):
        """Get configuration group
        """
        return cls._GROUP

    @wtransaction
    def create(self, component, bundle, name_param, params):
        """Create a new conf item(s), name_param can be a single name or a list of names
        """
        self._logger.info("create component=%s, bundle=%s, name(s)=%s", component, bundle, name_param)

        if not self._stanzas_service.is_bundle_valid(bundle):
            raise NotFoundException(fmt="Bundle %s not found" % bundle)

        attach = params.get(_ATTACH_KEY, [])
        if attach:
            validate_schema(attach, _FILES_ATTACH_SCHEMA)
            del params[_ATTACH_KEY]

        names = name_param if isinstance(name_param, list) else [name_param]
        for name in names:
            if not name or name.isspace():
                raise ValueError("name cannot be empty")
            self._check_doesnt_exist(component, bundle, name)

        # combine all created items
        entries_created = []
        total_created = 0
        for name in names:
            entries, total = self.update(component, bundle, name, params)
            entries_created += entries
            total_created += total

        self._upload_attach(bundle, attach)

        return entries_created, total_created

    @wtransaction
    def edit(self, component, bundle, name, params):
        """Edit a conf entry
        """
        self._logger.info("edit component=%s, bundle=%s, name=%s", component, bundle, name)
        if name:
            self._check_exists(component, bundle, name)
        return self.update(component, bundle, name, params)

    def enable(self, component, bundle, name):
        """Enable a conf entry
        """
        return self.edit(component, bundle, name, dict(disabled="false"))

    def disable(self, component, bundle, name):
        """Disable a conf entry
        """
        return self.edit(component, bundle, name, dict(disabled="true"))

    @wtransaction
    def delete(self, component, bundle, name):
        """Delete a conf entry
        """
        self._logger.info("delete component=%s, bundle=%s, name=%s", component, bundle, name)
        self._check_exists(component, bundle, name)

        component_impl = self.get_component_impl(component)
        with self._stanzas_service.create_type_writer(bundle, self.group()) as writer:
            stanza_name = component_impl.stanza_tag(name)
            writer.set(stanza_name, None, None)  # clear stanza locals

            return [], 0

    def get(self, component, bundle, name):
        """Get a conf entry
        """
        component_impl = self.get_component_impl(component)
        stanza = component_impl.stanza()
        # make name filter
        if name == component:
            req_query = {"name": "^%s$" % stanza}  # special case - query "global" stanza
        else:
            normalized_name = re.escape(name)
            req_query = {
                "name": "^%s$" % component_impl.stanza_tag(normalized_name)  # query particular stanza by its name
            }

        return self.query_stanzas(
            component, [bundle], req_query=req_query, offset=0, count=1, reverse=False, sort_key=None)

    # pylint: disable=too-many-arguments
    def list(self, component, bundle, query=None, offset=0, count=0, reverse=False, sort_key=None):
        """List conf entries
        """
        component_impl = self.get_component_impl(component)

        if query:
            validate_schema(query, _LIST_QUERY_SCHEMA)
            name_filter = query.get("name")
            if not name_filter:
                # the only support filtering is "by name"
                raise NotImplementedError("Unsupported query format %s" % query)
            name_filter = ".*%s.*" % name_filter  # find all items that include name filter
        else:
            name_filter = ".*"  # list all
        req_query = {"name": "^%s$" % component_impl.stanza_tag(name_filter)}

        if bundle == ALL_BUNDLES_WILDCARD:
            query_bundles = None  # query all bundles
        else:
            bundle_type, bundle_id = compute_bundle_type_and_id(bundle)
            if bundle_type == BundleType.node:
                # query all bundles related to the requested node
                instance = self._instances_service.get(bundle_id)
                query_bundles = self._instances_service.get_related_bundles(instance)
            else:
                # query only the requested bundle
                query_bundles = [bundle]

        return self.query_stanzas(component, query_bundles, req_query, offset, count, reverse, sort_key)
    # pylint: enable=too-many-arguments

    @wtransaction
    def copy(self, component, bundle, name, target_bundle):
        """Copy an item to the target bundle
        """
        if bundle == target_bundle:
            raise ValueError("Cannot move to itself")

        self._check_exists(component, bundle, name)
        self._check_doesnt_exist(component, target_bundle, name)
        if not self._stanzas_service.is_bundle_valid(target_bundle):
            raise NotFoundException(fmt="Bundle %s not found" % target_bundle)

        component_impl = self.get_component_impl(component)

        # read content and write it to the target bundle
        content = self.get(component, bundle, name)[0][0].get_serialized_content()
        # Write stanza to the target bundle. We cannot invoke "self.create" here because this leads validation of the
        # content that already lost its types information (stanzas service is types agnostic and assumes that
        # everything is a string).
        with self._stanzas_service.create_type_writer(target_bundle, self.group()) as writer:
            writer.set(component_impl.stanza_tag(name), None, OrderedDict(content))

        return self.get(component, target_bundle, name)

    @wtransaction
    def move(self, component, bundle, name, target_bundle):
        """Move an item to the target bundle
        """
        reply = self.copy(component, bundle, name, target_bundle)
        self.delete(component, bundle, name)  # remove the source

        return reply

    def revert(self, component, bundle, name):
        """Revert an item to the default settings
        """
        # "delete" removes all local settings without touching the default ones
        return self.delete(component, bundle, name)

    # pylint: disable=too-many-arguments
    def summary(self, bundle=ALL_BUNDLES_WILDCARD, offset=0, count=0, reverse=False, sort_key=None):
        """Get summaries of all components
        """
        if sort_key and sort_key != "name":
            raise NotImplementedError("Sort key %s isn't supported" % sort_key)

        items = []
        for component in self._component_impl:
            items.append({
                "name": component,
                "content": {
                    "count": self.list(component, bundle)[1]
                }
            })

        # sorting / pagination
        if sort_key:
            items.sort(key=lambda item: item[sort_key].lower(), reverse=reverse)
        total = len(items)
        end = total if count == 0 else offset + count

        return items[offset:end], total
    # pylint: enable=too-many-arguments

    def component_info(self, component, bundle):
        """Get component info
        """
        assert bundle
        component_impl = self.get_component_impl(component)
        # Currently we just return json validation schema that includes all information about component fields
        return [{
            "fields": component_impl.schema()
        }]

    # pylint: disable=too-many-locals
    # pylint: disable=too-many-arguments
    def query_stanzas(self, component, bundles, req_query, offset=0, count=0, reverse=False, sort_key=None):
        """Query stanzas in bundles/component
        """
        if sort_key and sort_key != "name":
            raise NotImplementedError("Sort key %s isn't supported" % sort_key)

        # query stanzas by name filter
        stanzas, total = self._stanzas_service.read_type(
            bundles,
            self.group(),
            offset, count, reverse, sort_key,  # pagination
            req_query=req_query
        )
        return self._compose_entries(stanzas, total, component)
    # pylint: enable=too-many-arguments

    def _compose_entries(self, stanzas, total, component):
        """Compose reply entries based on stanzas data
        """
        component_impl = self.get_component_impl(component)
        entries = []
        for stanza_tag, _, default, local, bundle_name, is_pending in stanzas:
            # get stanza name that has format: [<stanza>|name] or [stanza]
            name = component_impl.extract_stanza_name(stanza_tag)
            bundle_type, bundle_id = compute_bundle_type_and_id(bundle_name)
            # we do not get related bundles in any case
            related_bundles = None

            entries.append(component_impl(
                bundle_info=dict(name=bundle_name, type=bundle_type, id=bundle_id, related_bundles=related_bundles),
                name=name, local=local, default=default, is_pending=is_pending))

        return entries, total

    def update(self, component, bundle, name, params):
        """Update conf entry
        """
        component_impl = self.get_component_impl(component)
        stanza_name = component_impl.stanza_tag(name)

        attach = params.get(_ATTACH_KEY, [])
        if attach:
            validate_schema(attach, _FILES_ATTACH_SCHEMA)
            del params[_ATTACH_KEY]

        # update stanza local settings
        with self._stanzas_service.create_type_writer(bundle, self.group()) as writer:
            # read previous conf, stanza_content is (fileExt, defaults, locals)
            stanza_content = writer.read_stanza(stanza_name)
            stanza_default = None
            stanza_local = {}
            if stanza_content:
                stanza_default = stanza_content[1]
                stanza_local = stanza_content[2]

            bundle_type, bundle_id = compute_bundle_type_and_id(bundle)
            entry = component_impl(bundle_info=dict(name=bundle, type=bundle_type, id=bundle_id),
                                   name=name, local=stanza_local, default=stanza_default)
            entry.update(params)
            writer.set(stanza_name, None, OrderedDict(entry.get_serialized_content()))

        self._upload_attach(bundle, attach)

        return self.get(component, bundle, name)

    def _upload_attach(self, bundle, attach):
        """Upload attach files into bundle bin folder.
        """
        if not attach:
            return

        bin_folder = self._stanzas_service.get_bundle_uploads_path(bundle, "bin")
        mkdir_p(bin_folder)

        for file_item in attach:
            file_name = file_item["name"]
            file_content = file_item["content"]
            full_file_path = os.path.join(bin_folder, file_name)
            self._logger.info("write file %s", full_file_path)
            with open(full_file_path, "wb") as bin_file:
                bin_file.write(base64.b64decode(file_content))
            # add exec permission (on windows this code does nothing)
            os.chmod(full_file_path, os.stat(full_file_path).st_mode | stat.S_IEXEC)

    def _does_item_exist(self, component, bundle, name):
        """Check whether name exits in bundle/component
        """
        component_impl = self.get_component_impl(component)
        return name == component_impl.stanza() or \
            self._stanzas_service.read_stanza(
                bundle,
                self.group(),
                component_impl.stanza_tag(name)
            ) is not None

    def _check_exists(self, component, bundle, name):
        """Raise an exception if name isn't defined in bundle/component
        """
        if not self._does_item_exist(component, bundle, name):
            raise NotFoundException(fmt="%s not found in %s" % (name, bundle))

    def _check_doesnt_exist(self, component, bundle, name):
        """Raise an exception if name is already defined in bundle/component
        """
        if self._does_item_exist(component, bundle, name):
            raise UniqueItemException(fmt="%s already exists in %s" % (name, bundle))

    def get_component_impl(self, component):
        """Get component implementation by its name
        """
        component_impl = self._component_impl.get(component)
        if not component_impl:
            raise NotFoundException(fmt="%s not supported" % component)
        return component_impl

    def _get_node_related_bundles_info(self, instance_id):
        """Get information (id and type) about bundles related to an instance"""
        bundles_info = {}

        for bundle in self._instances_service.get_related_bundles(self._instances_service.get(instance_id)):
            bundle_type, bundle_id = compute_bundle_type_and_id(bundle)
            bundles_info[bundle] = {"type": bundle_type, "id": bundle_id}

        return bundles_info
