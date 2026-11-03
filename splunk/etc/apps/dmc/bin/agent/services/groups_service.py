# pylint: disable=missing-docstring
# pylint: disable=invalid-name
# pylint: disable=no-init
# pylint: disable=no-self-use
# pylint: disable=attribute-defined-outside-init
# pylint: disable=too-few-public-methods
# pylint: disable=too-many-arguments

import logging

from agent import ioc, wtransaction

from agent.services import group_helpers
from agent.services.group_helpers import builtin_name, group_type, make_bundle_name
from agent.models import View, Group, ServerclassFilteringGroup


class _builtin_display_name(builtin_name):
    indexers = "Indexers"
    search_heads = "Search heads"
    forwarders = "Forwarders"
    all = "All"


class GroupsService(ioc.Component):

    """Service to work with groups

    """

    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)
        self._stanzas_service = ioc.services.stanzas_service()
        self._instances_service = ioc.services.instances_service()
        self._instances_repository = ioc.repositories.instances_repository()
        self._deploy_service = ioc.services.deploy_service()
        self._groups_repository = ioc.repositories.groups_repository()
        self._apps_repository = ioc.repositories.apps_repository()
        self._splunk_host = ioc.components.splunk_host()

    @wtransaction
    def create(self, group):
        entity = Group(group)
        result = self._groups_repository.insert(entity)
        self._deploy_service.invalidate_cache(
            instances_changed=False,
            groups_changed=True,
            apps_changed=False,
            ds_apps_changed=False)
        return result.json(View.RestView)

    # pylint: disable=too-many-locals
    def read(self, name):
        bundle = make_bundle_name(name)
        add_related_existing_types = False
        cache = self._deploy_service.get_cache()

        if name in builtin_name:
            value = {}
            value["displayName"] = _builtin_display_name[name]
            value["@type"] = group_type.builtin
            group_instances = cache.get_group_instances(name)
            value["name"] = name
        else:
            if group_helpers.is_single_node(name):
                instance_id = name[2:]
                instance = self._instances_service.get(instance_id)
                group_instances = [instance.instanceid]
                instance_name = instance.instancename
                value = {}
                value["displayName"] = instance.display_name
                value["description"] = "Node named '%s'" % instance_name
                value["@type"] = group_type.node
                value["name"] = name
                add_related_existing_types = True
            else:
                group = self._groups_repository.get(name)
                value = group.json(View.RestView)
                value["@type"] = group_type.custom
                group_instances = cache.get_group_instances(group.objid)

        value["@bundle"] = bundle

        value["@memberCount"] = len(group_instances)
        value["@upToDateMemberCount"] = sum(1 for instanceid in group_instances
                                            if cache.is_instance_up_to_date(instanceid))

        if add_related_existing_types:
            assert len(group_instances) == 1
            instance = self._instances_service.get(group_instances[0])
            related_bundles = self._instances_service.get_related_bundles(instance).keys()
        else:
            related_bundles = [bundle]
        value["@existingTypes"] = self._get_existing_types(related_bundles)

        app_names = self.get_app_names_for_group(name)
        value["@apps"] = app_names

        return value
    # pylint: enable=too-many-locals

    @wtransaction
    def write(self, group):
        entity = self._groups_repository.update(Group(group))
        self._deploy_service.invalidate_cache(
            instances_changed=False,
            groups_changed=True,
            apps_changed=False,
            ds_apps_changed=False)
        value = entity.json(View.RestView)
        return value

    @wtransaction
    def delete(self, name):
        assert not group_helpers.is_internal(name)
        # construct bundle name for custom group
        bundle = make_bundle_name(name)
        self._stanzas_service.delete_bundle(bundle)

        apps = self._get_apps_for_group(name)

        # Go though all apps and remove any assignment to the group
        for app in apps:
            groups = app.get_value("groups")
            groups.remove(name)

            # The assert will fail if there's a dup of 'name', which we prevent at API entry
            assert name not in groups

            self._apps_repository.update(app)
            self._logger.debug("Removed group '%s' from app '%s'", name, app.objid)

        self._groups_repository.delete(name)
        self._deploy_service.invalidate_cache(
            instances_changed=False,
            groups_changed=True,
            apps_changed=True,
            ds_apps_changed=False)

    def read_custom_all_with_total(
            self,
            req_query,
            count,
            offset,
            sort_key,
            reverse):
        """
        Fetch the custom groups along with the total
        :return {tuple} (results, total):
        """
        sort = ((sort_key, -1 if reverse else 1),) if sort_key else None
        custom_groups = self._groups_repository.get_all_with_total(
            query=req_query,
            limit=count,
            skip=offset,
            sort=sort)

        cache = self._deploy_service.get_cache()

        def make_group(group_entity):
            val = group_entity.json(View.RestView)
            app_names = self.get_app_names_for_group(val["name"])
            val["@apps"] = app_names
            val["@type"] = "custom"
            group_instances = cache.get_group_instances(group_entity.objid)
            val["@memberCount"] = len(group_instances)
            val["@upToDateMemberCount"] = sum(1 for instanceid in group_instances
                                              if cache.is_instance_up_to_date(instanceid))
            return val

        value_list = [make_group(x) for x in custom_groups.results]
        total = custom_groups.total
        return value_list, total

    def read_custom_names(
            self):
        """
        Fetch the custom group names
        """
        entities = self._groups_repository.get_all(
            # '_key' and 'name' have same values. Use _key which is indexed for sorting.
            sort=(("_key", 1),),
            fields=("name",))
        return [entity.json(View.RestView) for entity in entities]

    def read_builtin_all_with_total(
            self,
            req_query,
            count,
            offset,
            sort_key,
            reverse):
        """
        Fetch the builtin groups along with total
        :return {tuple} (results, total):
        """
        default_sort_key = "displayName"
        sort_key = sort_key or default_sort_key

        # Subset compat with MongoDB query style
        # for filtering out a name only
        query_name = req_query.get("name", None) if req_query else None
        query_name_ne = query_name.get("$ne") if query_name else None

        builtins_filtered = [self.read(n) for n in builtin_name
                             if n != query_name_ne]

        builtins = sorted(
            builtins_filtered,
            key=lambda group: group.get(
                sort_key,
                group.get(default_sort_key, '')
            )
        )
        if reverse:
            builtins = list(reversed(builtins))
        builtins = builtins[offset:offset + count]

        return builtins, len(builtins_filtered)

    # pylint: disable=unused-argument
    def read_members(self, name, offset, count, reverse, sort_key):
        assert sort_key is None or sort_key in (
            "name", "instanceName")
        # TODO Currently this method is only supported for single node group
        # It has only one member
        assert group_helpers.is_single_node(name)

        instance_id = name[2:]
        instance = self._instances_service.get(instance_id)
        instance_name = instance.instancename
        value = {
            "instanceId": instance_id,
            "instanceName": instance_name
        }
        return [(instance_name, value)]
    # pylint: enable=unused-argument

    def is_internal_group(self, group):
        return group_helpers.is_internal(group)

    def is_single_node_group(self, group):
        return group_helpers.is_single_node(group)

    def is_valid_group(self, group):
        return group_helpers.is_valid(group)

    def _get_apps_for_group(self, group_name, names_only=False):
        query = {"groups": group_name}
        if names_only:
            fields = ["name", "groups"]
        else:
            # None implies all fields are included
            fields = None
        return self._apps_repository.get_all(
            query=query,
            fields=fields
        )

    def get_app_names_for_group(self, group_name):
        """Get group apps
        """
        return [app["name"] for app in self._apps_repository.get_all(
            query={"groups": group_name},
            fields=("name",),
            raw=True
        )]

    def make_serverclass_filtering_groups(self, serverclasses_query=None):
        """Compose filtering groups based on serverclass properties
        """
        return [ServerclassFilteringGroup(sc)
                for sc in self._groups_repository.get_all(serverclasses_query)]

    def _get_existing_types(self, bundles):
        existing_types = dict()
        # merge the existing types
        for bundle in bundles:
            for (name, count) in self._stanzas_service.existing_types(bundle):
                existing_types[name] = count + (existing_types.get(name) or 0)
        # return an array of existing types
        return [{"name": name, "count": count}
                for name, count in existing_types.items()]
