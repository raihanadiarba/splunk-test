"""
Get list of Deployment Server server classes and applications
"""
import logging
import os
import re
import collections
import time

from splunk.clilib import cli_common

from agent import ioc, ServerException
from agent.commands.ssh_service import LocalClient
from agent.commands import CommandBase, CommandResult
from agent.common.helpers import to_bool
from agent.models.app import AfterInstallation
from agent.common.topology_helpers import get_default_exclude_from_update


SupportedKey = collections.namedtuple("SupportedKey", ("pattern", "type", "stanza_types", "values", "flags"))


def _normalize_migrated_name(timestamp, object_type, name):
    """
    We do not allow underscore for the application and group names
    """
    if name.startswith("_"):
        return "%s_%d%s" % (object_type, timestamp, name)
    return name


def _split_path_in_list(path):
    """
    Split path "a/b/c" into list ["a", "b", "c"]
    """
    result = []
    head = path
    while True:
        head, tail = os.path.split(head)
        if tail:
            result.insert(0, tail)
        else:
            if head:
                result.insert(0, head)
            break
    return result


def _get_last_space_index(line, start):
    """It is like rfind, but instead of "end" we are looking for last non space index
    """
    index = line.index(" ", start)
    while index < len(line) and line[index + 1] == " ":
        index += 1
    return index


class GetDeploymentServerMigrationObjectsCommand(CommandBase):
    """
    Command to get deployment server server classes and applications
    """
    SUPPORTED_KEYS = [
        SupportedKey(pattern=re.compile(r"\AcrossServerChecksum\Z"),
                     type="boolean",
                     stanza_types=["global"],
                     values=[],
                     flags=[]),
        SupportedKey(pattern=re.compile(r"\AexcludeFromUpdate\Z"),
                     type="string",
                     stanza_types=["global"],
                     values=[get_default_exclude_from_update()],
                     flags=[]),
        SupportedKey(pattern=re.compile(r"\AfilterType\Z"),
                     type="string",
                     stanza_types=["serverclass"],
                     values=["whitelist"],
                     flags=[]),
        SupportedKey(pattern=re.compile(r"\AmachineTypesFilter\Z"),
                     type="string",
                     stanza_types=["serverclass"],
                     values=[],
                     flags=[]),
        SupportedKey(pattern=re.compile(r"\A(whitelist)\.(\d+)\Z"),
                     type="array",
                     stanza_types=["serverclass"],
                     values=[],
                     flags=[]),
        SupportedKey(pattern=re.compile(r"\A(blacklist)\.(\d+)\Z"),
                     type="array",
                     stanza_types=["serverclass"],
                     values=[],
                     flags=[]),
        SupportedKey(pattern=re.compile(r"\ArestartSplunkWeb\Z"),
                     type="boolean",
                     stanza_types=["serverclass", "app", "global"],
                     values=[],
                     flags=["ignored"]),
        SupportedKey(pattern=re.compile(r"\ArestartSplunkd\Z"),
                     type="boolean",
                     stanza_types=["serverclass", "app", "global"],
                     values=[],
                     flags=[]),
        SupportedKey(pattern=re.compile(r"\AissueReload\Z"),
                     type="boolean",
                     stanza_types=["serverclass", "app", "global"],
                     values=[],
                     flags=[]),
        SupportedKey(pattern=re.compile(r"\ArestartIfNeeded\Z"),
                     type="boolean",
                     stanza_types=["serverclass", "app", "global"],
                     values=[],
                     flags=[]),
        # If stateOnClient has default value, just accept it and skip it
        SupportedKey(re.compile(r"\AstateOnClient\Z"),
                     type="string",
                     stanza_types=["serverclass", "app", "global"],
                     values=["enabled"],
                     flags=[])
    ]

    SERVER_CLASS_PATTERN = re.compile(r"\AserverClass:([^:]+)\Z")
    SERVER_CLASS_APP_PATTERN = re.compile(r"\AserverClass:([^:]+):app:([^:]+)\Z")

    def __init__(self):
        self._logger = logging.getLogger(self.__class__.__name__)
        self._splunk_home = ioc.components.splunk_home()
        self._client = LocalClient()

    def execute(self, command):
        """Get deployment server applications and server classes
        """

        timestamp = time.time()

        # 1. Get stanza definitions using btool
        conf, stanza_conf_files = self._get_btool_ouput()
        apps = {}
        groups = {}
        global_values = {}

        # 2. Parse definitions and put them in hierarchical structures
        #    Do basic migration steps.
        for stanza, keys in conf.items():
            self._migrate_stanza(timestamp, global_values, groups, apps, stanza, keys)

        # 3. Move some of the stanza values to the apps
        self._apps_post_migration(timestamp, global_values, groups, apps)

        # No need to be so verbose, remove current
        for app in apps.values():
            del app["current"]
            if not app["canMigrate"]:
                del app["migrated"]
        for group in groups.values():
            del group["current"]
            if not group["canMigrate"]:
                del group["migrated"]

        confs = [_split_path_in_list(conf) for conf in stanza_conf_files]

        return CommandResult(
            completed=True,
            description="Deployment Server: parsed existing groups and applications",
            payload={
                "confs": confs,
                "apps": apps,
                "groups": groups,
                "timestamp": timestamp
            })

    def _migrate_stanza(self, timestamp, global_values, groups, apps, stanza, keys):
        """
        Parse stanza as server_class or application and migrate to the apps or groups
        Save server classes as

        {"class1": {"current": {"key1": "value1"}}}

        And applications as

        {"app1": {"current": {"class1": {"key1": "value1"}}}}

        The different is that we know that the same application can be
        used with several groups, so we are collecting all the combinations of apps with groups
        """
        if stanza == "global":
            can_migrate, messages, values = self._parse_stanza_values(stanza, keys, "global")
            if not can_migrate:
                raise ServerException(
                    " ".join(messages),
                    fmt="Deployment Server has non default global configurations. "
                        "Change them to default before enabling DMC. %s")
            global_values.update(values)
            return

        match = self.SERVER_CLASS_PATTERN.search(stanza)  # [serverClass:classname]
        if match is not None:
            groupname = match.group(1)
            self._migrate_group(timestamp, groups, apps, stanza, keys, groupname)
            return

        match = self.SERVER_CLASS_APP_PATTERN.search(stanza)  # [serverClass:classname:app:appname]
        if match is not None:
            groupname, appname = match.groups()
            self._migrate_app(timestamp, groups, apps, stanza, keys, groupname, appname)
            return

        # If user has something we don't expect ([default], [serverClass:x], [serverClass:x:app:y] are expected)
        # better to raise an exception and let user to fix the error
        raise ServerException(
            stanza,
            fmt="Failed to read stanza objects. Unexpected stanza name %s.")

    def _migrate_group(self, timestamp, groups, apps, stanza, keys, groupname):
        """
        Parse and migrate group
        """
        can_migrate, messages, values = self._parse_stanza_values(stanza, keys, "serverclass")
        groups[groupname] = {
            "current": values,
            "messages": messages,
            "migrated": {
                "machineTypesFilter": values.get("machineTypesFilter", ""),
                "description": "",
                "filterType": values.get("filterType", "whitelist"),
                "blacklist": values.get("blacklist", ""),
                "whitelist": values.get("whitelist", ""),
                "name": _normalize_migrated_name(timestamp, "group", groupname)
            },
            "canMigrate": can_migrate
        }

    def _migrate_app(self, timestamp, groups, apps, stanza, keys, groupname, appname):
        """
        Parse and migrate application
        """
        can_migrate, messages, values = self._parse_stanza_values(stanza, keys, "app")
        deployment_apps_path = self._splunk_home.deployment_apps()

        app_location = os.path.join(deployment_apps_path, appname)
        if not os.path.isdir(app_location):
            can_migrate = False
            messages.append("Could not find application under %s." % app_location)

        app = apps.setdefault(appname, {
            "current": {},
            "messages": [],
            "migrated": {
                "name": _normalize_migrated_name(timestamp, "app", appname),
                "afterInstallation": None,
                "groups": []
            },
            "canMigrate": True
        })
        app["current"][groupname] = values
        app["migrated"]["groups"].append(_normalize_migrated_name(timestamp, "group", groupname))
        app["messages"].extend(messages)
        app["canMigrate"] &= can_migrate

    def _parse_stanza_values(self, stanza, keys, stanza_type):
        """
        Parse stanza values, if we meet any unsupported key - raise an exception
        """
        result = {}
        messages = []
        can_migrate = True
        for key, value in keys.items():
            skey = next((skey for skey
                         in self.SUPPORTED_KEYS
                         if skey.pattern.search(key)), None)
            parsed_key = key
            parsed_value = None

            if skey:
                if skey.type == "boolean":
                    parsed_value = to_bool(value)
                elif skey.type == "array":
                    # In case of array we combine values with comma in between them
                    match = skey.pattern.search(key)
                    parsed_key, index = match.groups()
                    parsed_value = result.get(parsed_key, {})
                    parsed_value.update({index: value})
                else:
                    assert skey.type == "string"
                    parsed_value = value

                if "ignored" in skey.flags:
                    messages.append("Key %s is ignored." % key)

            if not skey or stanza_type not in skey.stanza_types:
                can_migrate = False
                messages.append("Key %s=%s is unsupported for %s." % (key, value, stanza_type))
            elif skey and skey.values and parsed_value not in skey.values:
                can_migrate = False
                messages.append(
                    "Value %s is not supported for key %s (possible values are %s)."
                    % (parsed_value, parsed_key, ", ".join(skey.values)))
            else:
                result[parsed_key] = parsed_value

        for key, value in result.items():
            # Fix arrays
            if isinstance(value, dict):
                result[key] = ", ".join([item for index, item in sorted(value.items())])
        return can_migrate, messages, result

    def _get_btool_ouput(self):
        """
        Invoke btool with arguments "splunk btool --debug serverclass list"
        and parse the output.
        """
        result = self._client.execute(os.path.join(self._splunk_home.home(), "bin", "splunk"),
                                      "btool", "--debug", "serverclass", "list")
        if result.returncode != 0:
            raise ServerException(result.returncode, result.stderr,
                                  fmt="Failed to read serverclass conf. Error code %d. Error: %s")

        lines = [line for line in result.stdout.split(os.linesep) if line]
        stanza_lines, conf_files = self._parse_btool_output(lines, self._splunk_home.etc())
        conf = self._parse_confs(stanza_lines)
        return (conf, conf_files)

    def _parse_btool_output(self, lines, splunk_etc):
        """
        Invocation of "splunk btool --debug serverclass list" returns for us list like

        /splunk/etc/server/default/server.conf          [default]
        /splunk/etc/server/default/server.conf          a = b
        /splunk/etc/server/local/server.conf            a = c

        This function parses each line, finds the place where stanza starts and
        read all the paths to files into the set, the rest of the line it will
        put into list which will be ready to parse stanza
        """
        conf_files = set()
        stanza_lines = []
        reading_global = False
        line_index = 0

        index_file_end = len(splunk_etc)

        # We read line by line, assuming that first space should be somewhere after splunk_etc_len,
        # When we find this space, if it is != index_file_end, we will start reading lines from
        # beginning with setting index_file_end to the index of the space which we just found
        # Assumption is pretty simple, we know that there are should be at least one
        # file, which does not have spaces in the path after $SPLUNK_HOME, it is a
        # /system/[default,local]/serverclass.conf.
        while line_index < len(lines):
            line = lines[line_index]
            if not line.startswith(splunk_etc):
                raise ServerException(
                    line, splunk_etc,
                    fmt="Failed to parse serverclass conf. Unexpected file path for configuration line %s."
                        "All configurations are expected under SPLUNK_ETC folder %s.")
            if index_file_end > len(line):
                raise ServerException(
                    fmt="Failed to parse serverclass conf."
                        "Could not find path to configurations."
                        "Run 'splunk btool --debug serverclass' to find the problem.")
            stanza_start = _get_last_space_index(line, index_file_end)

            # We found a line, where stanza starts not at the same index, where we
            # expect all other files.
            if stanza_start != index_file_end:
                index_file_end = stanza_start
                conf_files = set()
                stanza_lines = []
                reading_global = False
                line_index = 0
                continue
            conf_file = line[len(splunk_etc):index_file_end].rstrip().lstrip(os.sep)
            system_default_conf = _split_path_in_list(conf_file) == ["system", "default", "serverclass.conf"]
            if not system_default_conf:
                conf_files.add(conf_file)

            stanza_line = line[index_file_end + 1:]
            if not reading_global or not system_default_conf:
                stanza_lines.append(stanza_line)

            # Simple check, were we do not allow any modifications to the global
            # stanza (default settings should be used)
            if stanza_line == "[global]":
                reading_global = True
            elif stanza_line.startswith("["):
                reading_global = False

            line_index += 1
        return (stanza_lines, conf_files)

    def _parse_confs(self, stanza_lines):
        """
        Parse stanza lines as configuration objects
        """
        conf = cli_common.readConfLines(stanza_lines)
        # readConfLines returns always default, but it should be empty for serverclass
        if "default" in conf:
            if conf["default"]:
                raise ServerException(
                    fmt="Found unexpected values under [global] stanza in serverclass.conf.")
            del conf["default"]

        return conf

    def _apps_post_migration(self, timestamp, global_values, groups, apps):
        """Verify if some of the configurations needs to be set, because they are
        defined on groups or global settings.

        Move issueReload, restartSplunkd, restartIfNeeded on application level.
        Ignore restartSplunkWeb.
        """
        for app in apps.values():
            defined = {
                "issueReload": None,
                "restartIfNeeded": None,
                "restartSplunkd": None
            }
            g_defined = {}
            a_defined = {}
            for appserverclass, values in app["current"].items():
                a_defined.update(
                    dict((key, (to_bool(value) or to_bool(a_defined.get(key, False))))
                         for key, value
                         in values.items()
                         if key in defined))

                group = next((group
                              for serverclass, group
                              in groups.items() if serverclass == appserverclass), None)
                if group is None:
                    app["messages"].append("ServerClass %s has not been defined." % appserverclass)
                    app["migrated"]["groups"].remove(_normalize_migrated_name(timestamp, "group", appserverclass))
                else:
                    if not group["canMigrate"]:
                        app["messages"].append("ServerClass %s cannot be migrated." % appserverclass)
                        app["migrated"]["groups"].remove(group["migrated"]["name"])
                    g_defined.update(
                        dict((key, (to_bool(value) or to_bool(g_defined.get(key, False))))
                             for key, value
                             in group["current"].items()
                             if key in defined))

            # At first load properties from global settings
            # ServerClass level overrides global settings
            # App level overrides ServerClass level
            defined.update(
                dict((key, value)
                     for key, value
                     in global_values.items()
                     if key in defined))
            defined.update(g_defined)
            defined.update(a_defined)

            if defined["restartSplunkd"]:
                app["migrated"]["afterInstallation"] = AfterInstallation.RESTART
            elif defined["issueReload"] or defined["restartIfNeeded"]:
                app["migrated"]["afterInstallation"] = AfterInstallation.RELOAD
