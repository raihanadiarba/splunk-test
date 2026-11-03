# pylint: disable=missing-docstring
# pylint: disable=invalid-name
# pylint: disable=no-init
# pylint: disable=no-self-use
# pylint: disable=attribute-defined-outside-init
# pylint: disable=too-few-public-methods
# pylint: disable=useless-object-inheritance, comparison-with-callable

import six
import agent.ioc
from agent.common.helpers import Enum
from agent.common.topology_helpers import topology_role_name


@six.add_metaclass(Enum)
class builtin_id(object):

    @staticmethod
    def _compute(name):
        return name

    indexers = _compute
    search_heads = _compute
    forwarders = _compute
    all = _compute


class builtin_name(builtin_id):
    @staticmethod
    def _compute(name):
        return '_' + name

    indexers = _compute
    search_heads = _compute
    forwarders = _compute
    all = _compute


class topology_role_group_name(topology_role_name):
    unassigned = None
    dmc = None
    removed = None
    idxc_member = builtin_name.indexers
    shc_member = builtin_name.search_heads
    forwarder_member = builtin_name.forwarders


class group_topology_role_name(builtin_name):
    indexers = topology_role_name.idxc_member
    search_heads = topology_role_name.shc_member
    forwarders = topology_role_name.forwarder_member
    all = None


@six.add_metaclass(Enum)
class group_type(object):

    @staticmethod
    def _compute(name):
        return name

    custom = _compute
    builtin = _compute
    node = _compute


def is_standlone(name):
    """Check if this group name is for standlone deployments
    """
    combined = str(builtin_name.search_heads) + builtin_name.indexers
    return name == combined


def is_internal(name):
    """Check bundle string and return error msg if any
    """
    if (len(name) < 1 or
            name[0] != '_'):
        return False

    return True


def is_single_node(name):
    if not is_internal(name):
        return False

    internal = name[1:]
    if (len(internal) < 1 or
            internal[0] != '_'):
        return False

    return True


def is_builtin(name):
    if not is_internal(name):
        return False

    if is_single_node(name):
        return False

    return True


def _is_valid_internal(name):
    """Check if name is of a valid internal group
    """
    if name in builtin_name:
        return True

    if is_standlone(name):
        return True

    if not is_single_node(name):
        return False

    return is_valid_single_node(name)


def _is_existing_custom(name):
    """Check if name is of a valid custom group
    """
    assert not is_internal(name)
    # TODO we should avoid relying on exception handling in a helper function.
    # Rather we should generalize "exists" function in instances_repository into base_repository
    try:
        groups_repository = agent.ioc.repositories.groups_repository()
        groups_repository.get(name)
        return True
    except agent.NotFoundException:
        return False


def is_valid(name):
    """
    Return if the group is a
    valid internal group or an existing custom group.
    """
    if is_internal(name):
        return _is_valid_internal(name)
    return _is_existing_custom(name)


def is_valid_single_node(name):
    if not is_internal(name):
        return False

    if not is_single_node(name):
        return False

    instance_id = name[2:]

    instances_repository = agent.ioc.repositories.instances_repository()
    return instances_repository.exists(instance_id)


def make_node_group_name(instance_id):
    return '_'*2 + instance_id


def get_instance_id(name):
    assert is_single_node(name)
    return name[2:]


def make_bundle_name(name):
    bundle = '_' + name
    return bundle


def make_bundle_name_from_instance_id(instance_id):
    """
    Return bundle name based on instance_id
    """
    group_name = make_node_group_name(instance_id)
    return make_bundle_name(group_name)


def get_node_id(bundle_id):
    """Get id used for client filtering or logging, which is clientName for a forwarder
    """
    instances_repository = agent.ioc.repositories.instances_repository()
    try:
        instance = instances_repository.get(bundle_id)
    except agent.NotFoundException:
        return None

    if instance.has_topology and instance.topology == topology_role_name.forwarder_member:
        # forwarder node - use its name as id
        node_id = instance.get_value("clientName")
    else:
        # use bundle_id as its name
        node_id = bundle_id
    return node_id


def encode_to_folder_name(group_name):
    """
    Space char becomes '_s' while '_' becomes '__'.
    Examples:
    a b => a_sb
    a_b => a__b
    _s => __s
    """
    atoms = group_name.split('_')
    return '__'.join(atom.replace(' ', '_s') for atom in atoms)


def decode_from_folder_name(folder_name):
    """
    '_s' becomes ' ' and '__' become '_'
    Examples:
    a_sb => a b
    a_b => a_b
    a__b => a_b
    __s => _s
    """
    atoms = folder_name.split('_' * 2)
    return '_'.join(atom.replace('_s', ' ') for atom in atoms)
