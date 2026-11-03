# pylint: disable=missing-docstring
# pylint: disable=invalid-name
# pylint: disable=no-init
# pylint: disable=no-self-use
# pylint: disable=attribute-defined-outside-init
# pylint: disable=too-few-public-methods
# pylint: disable=too-many-arguments
# pylint: disable=useless-object-inheritance, unnecessary-comprehension

import logging
import os
import shutil
import tarfile
from collections import OrderedDict

from splunk.clilib import cli_common

from agent.common import helpers
from agent import ioc, NotFoundException, wtransaction, UniqueItemException

_logger = logging.getLogger(__name__)

# These conf types should be filtered out from the list
# of available conf types
INTERNAL_TYPES_BLACKLIST = ['deployment']


def _make_bundle_local_path(bundle_path):
    """
    :return: absolute path to 'local' subfolder
    """
    return os.path.join(bundle_path,
                        'local')


def _make_bundle_default_path(bundle_path):
    """
    :return: absolute path to 'default' subfolder
    """
    return os.path.join(bundle_path,
                        'default')


class FilesystemStanzasRepository(ioc.Component):
    """Repository for saving and loading stanzas clustered on types
    in the file system.

    Implemented using KVStore.
    """

    @staticmethod
    def get_type_accessor(bundle_root, stanza_type):
        return FilesystemStanzasRepository.TypeAccessor(
            bundle_root, stanza_type)

    def existing_types(self, bundle_root):
        """Return a list of type name and stanza count pairs
        """

        bundle_default_path = _make_bundle_default_path(bundle_root)
        name_set = self._existing_types(bundle_default_path)

        bundle_local_path = _make_bundle_local_path(bundle_root)
        name_set.update(self._existing_types(bundle_local_path))

        def _get_stanza_count(stanza_type):
            """
            Get the count of stanzas for a given type.
            The conf file for the type can be either in default folder, local folder, or both.
            get_type_accessor will group default stanzas and local stanzas according to stanza names.
            """
            accessor = FilesystemStanzasRepository.get_type_accessor(
                bundle_root,
                stanza_type)
            accessor.ensure_loaded()
            return sum(1 for _ in accessor.read())

        return [(stanza_type, _get_stanza_count(stanza_type))
                for stanza_type in name_set]

    @staticmethod
    def _existing_types(bundle_path):
        """
        Return a list of names of types in a folderwhich could either be a default folder or a local folder
        """
        name_set = set()
        if not os.path.isdir(bundle_path):
            return name_set

        for name_ext in os.listdir(bundle_path):
            path = os.path.join(bundle_path, name_ext)
            name, ext = os.path.splitext(name_ext)
            if os.path.isfile(path) and ext == ".conf":
                name_set.add(name)
            # SPL-113515: hide non-.conf type stanzas in Galaxy LAR
            # if os.path.isdir(path):
            #     for type_path, _, stanza_names in os.walk(path):
            #         if len(stanza_names) == 0:
            #             continue
            #         name_set.add(os.path.relpath(
            #             type_path,
            #             bundle_path))

        return name_set

    @wtransaction
    def delete_bundle(self, bundle_root):
        if os.path.isdir(bundle_root):
            shutil.rmtree(bundle_root)

    # pylint: disable=too-many-instance-attributes
    class TypeAccessor():

        @staticmethod
        def _name_ext_iter(type_dir):
            if os.path.isdir(type_dir):
                stanza_files = [
                    f for f in os.listdir(type_dir)
                    if os.path.isfile(os.path.join(type_dir, f))]
                for stanza_file in stanza_files:
                    name, ext = os.path.splitext(stanza_file)
                    yield name, ext

        def get_file_stanza_location(self, name, is_default):
            type_dir = self._default_type_dir if is_default else self._local_type_dir
            for file_name, ext in self._name_ext_iter(type_dir):
                if file_name == name:
                    return name + ext, type_dir
            return None, None

        def __init__(self, bundle_path, stanza_type):
            self._bundle_local_path = os.path.join(bundle_path, "local")
            self._bundle_default_path = os.path.join(bundle_path, "default")
            self._type = stanza_type

            # We should not allow arbitrary type names as directory names.
            # Specifically, going back through ".." should be disallowed.
            # Currently, file based stanzas are disabled (SPL-113515) so we simply use
            # a fixed preset dir name which will prevent "fortify" to flag a security issue (SPL-119620),
            # while allow existing unit tests to pass.
            # When re-enabling file based stanza support, we need to sanitize the type name before
            # using it as directory name and we may need to suppress fortify warning(s).
            type_dir_name = "file-type"
            self._local_type_dir = os.path.join(self._bundle_local_path, type_dir_name)
            self._default_type_dir = os.path.join(self._bundle_default_path, type_dir_name)

            self._is_loaded = False

        def ensure_loaded(self):
            """load from disk
            """

            if self._is_loaded:
                return

            self._local_conf_file = os.path.join(
                self._bundle_local_path,
                self._type + ".conf")

            default_conf_file = os.path.join(
                self._bundle_default_path,
                self._type + ".conf")

            # TODO File operations does not handle multi-threading
            # TODO This will be addressed after moving to DB
            self._local_conf_stanzas = self._read_conf_stanzas(self._local_conf_file)
            self._default_conf_stanzas = self._read_conf_stanzas(default_conf_file)
            self.created_or_updated_file_based_stanzas = set()
            self._is_loaded = True

        @staticmethod
        def _read_conf_stanzas(conf_file):
            if os.path.exists(conf_file):
                stanzas_conf = cli_common.readConfFile(conf_file, ordered=True)
                # readConfFile may create empty 'default' stanzas, removing
                # if any. We need to do this to avoid empty .conf files
                # to be created, which will pollute existingTypes
                key_default = "default"
                if key_default in stanzas_conf and \
                        not stanzas_conf[key_default]:
                    del stanzas_conf[key_default]
            else:
                stanzas_conf = {}
            return stanzas_conf

        def _ensure_bundle_local_dir(self):
            if not os.path.exists(self._bundle_local_path):
                os.makedirs(self._bundle_local_path)

        def _ensure_type_local_dir(self):
            if not os.path.exists(self._local_type_dir):
                os.makedirs(self._local_type_dir)

        def read(self):
            """
            :return: conf based stanzas and
            name and ext of file based stanzas on disk
            """
            self.ensure_loaded()

            conf_stanza_names = set(self._default_conf_stanzas.keys())
            conf_stanza_names.update(self._local_conf_stanzas.keys())

            for name in conf_stanza_names:
                default_value, local_value = self._get_default_and_local_conf_stanza(name)

                yield name, None, default_value, local_value

            # pylint: disable=unnecessary-comprehension
            default_file_stanzas = {name: ext for name, ext in self._name_ext_iter(self._default_type_dir)}
            local_file_stanzas = {name: ext for name, ext in self._name_ext_iter(self._local_type_dir)}

            file_stanza_names = set(default_file_stanzas.keys())
            file_stanza_names.update(local_file_stanzas.keys())

            for name in file_stanza_names:
                default = None
                local = None
                if name in default_file_stanzas:
                    ext = default_file_stanzas[name]
                    default = OrderedDict()

                if name in local_file_stanzas:
                    ext = local_file_stanzas[name]
                    local = OrderedDict()

                yield name, ext, default, local

        def _get_default_and_local_conf_stanza(self, name):
            default_value = None
            local_value = None
            if name in self._default_conf_stanzas:
                default_value = self._default_conf_stanzas[name]
            if name in self._local_conf_stanzas:
                local_value = self._local_conf_stanzas[name]
            return default_value, local_value

        # pylint: disable=inconsistent-return-statements
        def _get_default_and_local_file_stanza_summary(self, name):
            """
            Return file extension, default and local existence flags
            """
            default_ext = self._get_file_ext(name, self._default_type_dir)
            local_ext = self._get_file_ext(name, self._local_type_dir)

            # for a file based stanza summary, {} indicates existence while None indicates otherwise.
            default = None if default_ext is None else OrderedDict()
            local = None if local_ext is None else OrderedDict()

            if default and local and default_ext != local_ext:
                _logger.warning(
                    'File ext mismatch: name = "%s", default_dir = "%s", local_dir = "%s", default_ext = "%s" '
                    'local_ext = "%s"',
                    name,
                    self._default_type_dir,
                    self._local_type_dir,
                    default_ext,
                    local_ext)
            ext = default_ext if default_ext else local_ext
            if ext:
                return ext, default, local

        def _get_file_ext(self, name, type_dir):
            # pylint: disable=inconsistent-return-statements
            if os.path.isdir(type_dir):
                for stanza_file in os.listdir(type_dir):
                    if not stanza_file.startswith(name):
                        continue
                    stanza_path = os.path.join(type_dir, stanza_file)

                    if not os.path.isfile(stanza_path):
                        continue

                    file_name, ext = os.path.splitext(stanza_file)
                    if file_name != name:
                        continue

                    return ext

        def read_stanza(self, name):
            """
            :return: fileExt, default and local
            """
            self.ensure_loaded()
            return self._get_stanza(name)

        def _get_stanza(self, name):
            """
            Get stanza. Should only be called after loading.
            :return: fileExt, default and local
            """
            default, local = self._get_default_and_local_conf_stanza(name)

            if default is not None or local is not None:
                return None, default, local

            return self._get_default_and_local_file_stanza_summary(name)

        def get_stanza_default(self, stanza):
            """
            Return 'default' in the stanza
            """
            return stanza[1]

        @wtransaction
        def set(self, name, ext, settings):
            if ext is None:
                self._local_conf_stanzas[name] = settings
            else:
                # Clear the settings of
                # the conf stanza with the same name.
                self._local_conf_stanzas[name] = None
                stanza_file = os.path.join(self._local_type_dir, name + ext)
                content = settings.get("content") if settings else None
                if content is None:
                    if os.path.exists(stanza_file):
                        os.remove(stanza_file)
                else:
                    # TODO On Windows, find out if we need to use 'wb'
                    # instead of 'w'.
                    self._ensure_type_local_dir()
                    with open(stanza_file, "w") as output:
                        output.write(content)
                    self.created_or_updated_file_based_stanzas.add((name, ext))

        def set_local(self, name, settings):
            """Set local conf settings, this is a rare operation so no flushing optimization is required
            """
            self._local_conf_stanzas[name] = settings
            self._ensure_bundle_local_dir()
            cli_common.writeConfFile(
                os.path.join(self._bundle_local_path, self._type + ".conf"),
                self._local_conf_stanzas)

        @wtransaction
        def flush(self):
            # delete any file with the same name as a conf stanza
            # unless the file is just created or updated, in which
            # case, the conf stanza will be None.
            for name, ext in self._name_ext_iter(self._local_type_dir):
                if name in self._local_conf_stanzas:
                    if (name, ext) in \
                            self.created_or_updated_file_based_stanzas:
                        assert self._local_conf_stanzas[name] is None
                    else:
                        os.remove(os.path.join(self._local_type_dir, name + ext))

            # remove stanzas with None settings
            none_stanzas = [stanza for stanza in self._local_conf_stanzas
                            if self._local_conf_stanzas[stanza] is None]
            for key in none_stanzas:
                del self._local_conf_stanzas[key]

            # delete the conf file if there's no stanza in it.
            # This is needed by existing_types()
            if not self._local_conf_stanzas:
                if os.path.exists(self._local_conf_file):
                    os.remove(self._local_conf_file)
            else:
                # write to conf file
                self._ensure_bundle_local_dir()
                cli_common.writeConfFile(self._local_conf_file, self._local_conf_stanzas)
            # delete the type dir if there's non file based stanzas in them
            if os.path.exists(self._local_type_dir) and not os.listdir(self._local_type_dir):
                os.rmdir(self._local_type_dir)
        # pylint: enable=too-many-instance-attributes

    def list_internal_types(self, system_bundle_root):
        """
        Get system types from README folder of Splunk installation
        plus a fixed set of file based stanza types
        :return: a list of name and ext pairs
        """

        readme_dir = os.path.join(
            system_bundle_root,
            'README')
        spec_ext = ".conf.spec"
        ret = [
            # for regular stanzas, file ext is None
            (name[:-len(spec_ext)], None)
            for name in os.listdir(readme_dir) if name.endswith(spec_ext)
        ]
        # Apply the blacklist
        ret = [name for name in ret if name[0] not in INTERNAL_TYPES_BLACKLIST]
        # SPL-113515: hide non-.conf type stanzas in Galaxy LAR
        # data_ui_dir = os.path.join("data", "ui")
        # ret.extend([(os.path.join(data_ui_dir, name), ".xml") for name in (
        #     "views",
        #     "nav"
        # )])
        # ret.extend([(os.path.join(data_ui_dir, name), ".html") for name in (
        #     "html",
        # )])

        return ret

    # Install the bundle stored within the tar archive or directory at the given path.
    @wtransaction
    def install_from_path(self, name, path, dest_path):
        """
        :param name: name of the app
        :param path: Path to the app package
        :param dest_path: Path to the containing folder of the app
        """
        _logger.debug("Examining application archive: %s", path)

        assert name
        bundle_path = os.path.join(dest_path, name)
        bundle_local_path = _make_bundle_local_path(bundle_path)

        # remove everything in the bundle location except "local" where
        # users conf changes are kept.
        if os.path.isdir(bundle_path):
            for filename in os.listdir(bundle_path):
                filepath = os.path.join(bundle_path, filename)

                if filepath == bundle_local_path:
                    continue

                if os.path.isdir(filepath):
                    shutil.rmtree(filepath)
                else:
                    os.remove(filepath)

        def _filter_app(members, prefix):
            for tarinfo in members:
                file_path = tarinfo.path.split("/")
                if file_path[0] == ".":
                    # a path can start with "current folder" (.) - skip it
                    file_path = file_path[1:]

                assert len(file_path) > 0  # file or empty folder?

                folder_name = file_path[0]
                if not folder_name.startswith(prefix):
                    continue
                yield tarinfo

        if os.path.isdir(path):
            shutil.copytree(path, bundle_path)
        else:
            with tarfile.open(path) as tar:
                _logger.debug("Extracting application %s to: %s", name, dest_path)
                tar.extractall(dest_path, members=_filter_app(tar, name))

    @wtransaction
    def create_bundle_archive(self, name, ofile, path):
        # For now only support tar archives with gzip compression
        bundle_path = os.path.join(path, name)
        if not os.path.isdir(bundle_path):
            raise NotFoundException(fmt="Bundle %s not found" % name)
        # Possible that we want to be more restrict about what we are
        # archiving, like we maybe don't want to include extended file properties
        # of files/folders created by system, like .DS_Store
        with tarfile.open(fileobj=ofile, mode="w:gz") as tar:
            tar.add(bundle_path, arcname=name)

    @wtransaction
    def create_empty(self, appname, path):
        bundle_path = os.path.join(path, appname)
        if os.path.isdir(bundle_path) or os.path.isfile(bundle_path):
            raise UniqueItemException(fmt="Bundle %s already exists on disk" % appname)
        helpers.mkdir_p(bundle_path)
