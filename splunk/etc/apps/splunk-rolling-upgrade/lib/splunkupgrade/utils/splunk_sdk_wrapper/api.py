from typing import Any, Dict, List

from splunkupgrade.utils.exceptions import ImportNotFoundException


def splunkhome_path(parts: List[str]) -> str:
    try:
        from splunk.clilib.bundle_paths import make_splunkhome_path

        ret = make_splunkhome_path(parts)
        return ret
    except ImportError as e:
        raise ImportNotFoundException(
            "Error importing splunk.clilib.bundle_paths.make_splunkhome_path: Splunk version should be 8+"
        ) from e


def get_app_conf(conf_file_name: str) -> Dict[str, Any]:
    try:
        from splunk.clilib.cli_common import getMergedConf

        return getMergedConf(conf_file_name)
    except ImportError as e:
        raise ImportNotFoundException(
            "Error importing splunk.clilib.cli_common.getAppConf: Splunk version should be 8+"
        ) from e
