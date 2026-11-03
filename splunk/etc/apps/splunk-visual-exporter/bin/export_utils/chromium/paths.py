import platform
from pathlib import Path
from splunk.clilib.bundle_paths import make_splunkhome_path

class UnsupportedOSException(Exception):
    "Unsupported OS"
    pass

def get_os():
    os = platform.system().lower()
    if os in ("windows", "linux", "darwin"):
        return os
    else:
        raise UnsupportedOSException

class UnsupportedArchException(Exception):
    "Unsupported Architecture"
    pass

def get_arch():
    raw_arch = platform.machine().lower()
    if raw_arch in ("i386", "amd64", "x86_64"):
        return "x86_64"
    if raw_arch in ("aarch64", "arm64"):
        return "aarch64"
    else:
        raise UnsupportedArchException

def get_exec_file_name(package: str):
    os = get_os()
    file_name = "{}.exe".format(package) if os == "windows" else package
    return file_name

def get_app_dir_path():
    return make_splunkhome_path(['etc', 'apps', 'splunk-visual-exporter'])

def get_native_modules_path():
    os = get_os()
    arch = get_arch()
    app_dir_path = get_app_dir_path()
    modules_path = Path(app_dir_path).joinpath("bin", "native", os, arch)
    return modules_path

def get_chromium_path():
    native_modules_path = get_native_modules_path()
    # linux uses AppImage format so the actual main chromium binary is nested
    if get_os() == 'linux':
        return native_modules_path.joinpath('chromium', 'usr', 'lib', 'chromium')
    else:
        return native_modules_path.joinpath('chromium')

def get_studio_html_path():
    chromium_path = get_chromium_path()
    dashboard_html_path = chromium_path.joinpath(chromium_path, 'dashboard.html')
    return "file://" + str(dashboard_html_path.absolute())

def get_legacy_html_path():
    chromium_path = get_chromium_path()
    dashboard_html_path = chromium_path.joinpath(chromium_path, 'legacy.html')
    return "file://" + str(dashboard_html_path.absolute())

def get_headless_shell_path():
    modules_path = get_native_modules_path()
    headless_shell_path = modules_path.joinpath("chromium", "chromium")
    return str(headless_shell_path.absolute())
