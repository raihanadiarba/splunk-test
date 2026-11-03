#!/usr/bin/env python3
"""
Splunk App Python Version Update Tool

This script helps Splunk app authors update their apps to use specific Python versions
by adding the python.required configuration setting to their conf files.

The python.required setting takes precedence over the deprecated python.version
setting and allows apps to specify which Python versions they support.

Usage:
    python update_python_required.py --app-root=/path/to/app [options]

Options:
    --app-root=PATH              Required. Path to the app root directory (in $SPLUNK_HOME/etc/apps)
    --view                       View current python.version settings without proposing changes
    --preview                    Show what would be changed without making modifications
    --python.required=VALUE      Value for python.required (required with --preview or --update)
    --default                    Update conf files in the default/ directory
    --local                      Update conf files in the local/ directory
    --update                     Perform the actual update
    --force                      Overwrite existing python.required values
    --json                       Get the output in json format
    --help                       Show this help message

Examples:
    # View current python.version settings
    python update_python_required.py --app-root=/opt/splunk/etc/apps/myapp --view

    # View settings in local/ only
    python update_python_required.py --app-root=/opt/splunk/etc/apps/myapp --view --local

    # Preview changes with JSON output
    python update_python_required.py --app-root=/opt/splunk/etc/apps/myapp --python.required="3.13" --preview --json

    # Preview changes for an app
    python update_python_required.py --app-root=/opt/splunk/etc/apps/myapp --python.required="3.13" --preview

    # Update default conf files with Python 3.13
    python update_python_required.py --app-root=/opt/splunk/etc/apps/myapp --python.required="3.13" --default --update

    # Update local conf files with multiple Python versions
    python update_python_required.py --app-root=/opt/splunk/etc/apps/myapp --python.required="3.9, 3.13" --local --update
"""

import sys
import argparse
import re
import json
from pathlib import Path
from typing import List, Tuple, Optional, Any

JSON_MODE = False

# Conf files that support python.version and python.required settings
SUPPORTED_CONF_FILES = [
    'alert_actions.conf',
    'app.conf',
    'authentication.conf',
    'commands.conf',
    'indexes.conf',
    'inputs.conf',
    'restmap.conf',
    'transforms.conf'
]

EXCLUDED_CONF_FILES = ['server.conf', 'web-features.conf']




class ConfFileEntry:
    """Represents a python.version entry found in a conf file"""
    
    def __init__(self, file_path: Path, stanza: str, python_version: str, 
                 line_number: int, has_python_required: bool = False,
                 python_required_value: str = None,
                 python_required_line: Optional[int] = None):
        self.file_path = file_path
        self.stanza = stanza
        self.python_version = python_version
        self.line_number = line_number
        self.has_python_required = has_python_required
        self.python_required_value = python_required_value
        self.python_required_line = python_required_line
    
    def get_relative_path(self, app_root: Path) -> str:
        """Get path relative to app root"""
        try:
            return str(self.file_path.relative_to(app_root))
        except ValueError:
            return str(self.file_path)

    def to_json(
        self,
        app_root: Path,
        proposed_python_required: Optional[str] = None,
        include_status: bool = False,
        overwrite_existing: bool = False,
    ) -> dict:
        rel_path = self.get_relative_path(app_root)
        stanza_value = f"[{self.stanza}]"
        python_required_value = None
        if include_status and proposed_python_required is not None:
            if self.has_python_required:
                if overwrite_existing:
                    python_required_value = f"{proposed_python_required} (will be overwritten)"
                else:
                    python_required_value = f"{self.python_required_value} (already set)"
            else:
                python_required_value = f"{proposed_python_required} (will be added)"
        else:
            python_required_value = self.python_required_value if self.has_python_required else None

        obj: dict = {
            "file": rel_path,
            "stanza": stanza_value,
            "python.version": self.python_version,
        }
        # In view mode, omit python_required entirely if it doesn't exist.
        # In preview/update, include_status ensures python_required is always present.
        if python_required_value is not None or include_status:
            obj["python_required"] = python_required_value
        return obj


def emit_json(obj: Any) -> None:
    print(json.dumps(obj, indent=2, sort_keys=False))


def emit_json_error(message: str, exit_code: int = 1) -> int:
    emit_json({"error": message})
    return exit_code


def _print(message: str, *, to_stderr: bool = False) -> None:
    stream = sys.stderr if (to_stderr or JSON_MODE) else sys.stdout
    print(message, file=stream)


def print_banner():
    """Print the script banner"""
    print("\n" + "="*70)
    print("  Splunk App Python Version Update Tool")
    print("="*70 + "\n")


def print_error(message: str):
    """Print error message"""
    print(f"ERROR: {message}", file=sys.stderr)


def print_warning(message: str):
    """Print warning message"""
    _print(f"WARNING: {message}")


def print_success(message: str):
    """Print success message"""
    _print(message)


def print_info(message: str):
    """Print info message"""
    _print(message)


def validate_app_root(app_root: str) -> Optional[Path]:
    """
    Validate that the app root directory exists and is accessible.
    
    Args:
        app_root: Path to the app root directory
        
    Returns:
        Path object if valid, None otherwise
    """
    if not app_root:
        print_error("App root directory not specified. Use --app-root=PATH")
        return None
    
    app_path = Path(app_root).resolve()
    
    if not app_path.exists():
        print_error(f"App root directory does not exist: {app_path}")
        return None
    
    if not app_path.is_dir():
        print_error(f"App root path is not a directory: {app_path}")
        return None
    
    # Check if it looks like a Splunk app directory
    has_default = (app_path / 'default').exists()
    has_local = (app_path / 'local').exists()
    has_metadata = (app_path / 'metadata').exists()
    
    if not (has_default or has_local or has_metadata):
        print_warning(f"Directory doesn't appear to be a Splunk app (no default/, local/, or metadata/ subdirectories)")
        prompt = "Continue anyway? (y/N): "
        if JSON_MODE:
            print(prompt, end="", file=sys.stderr)
            response = input().strip().lower()
        else:
            response = input(prompt).strip().lower()
        if response != 'y':
            return None
    
    return app_path


def parse_conf_file(file_path: Path) -> List[ConfFileEntry]:
    """
    Parse a conf file and extract stanzas with python.version settings.
    
    Args:
        file_path: Path to the conf file
        
    Returns:
        List of ConfFileEntry objects
    """
    entries = []
    current_stanza = None
    python_version = None
    python_version_line = None
    has_python_required = False
    python_required_value = None
    python_required_line = None
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                line_stripped = line.strip()
                
                # Skip empty lines and comments
                if not line_stripped or line_stripped.startswith(('#', ';')):
                    continue
                
                # Check for stanza header
                stanza_match = re.match(r'^\[(.+)\]$', line_stripped)
                if stanza_match:
                    # Save previous stanza if it had python.version
                    if current_stanza and python_version is not None:
                        entries.append(ConfFileEntry(
                            file_path, current_stanza, python_version,
                            python_version_line, has_python_required,
                            python_required_value,
                            python_required_line
                        ))
                    
                    # Start new stanza
                    current_stanza = stanza_match.group(1)
                    python_version = None
                    python_version_line = None
                    has_python_required = False
                    python_required_value = None
                    python_required_line = None
                    continue
                
                # Check for python.version setting
                version_match = re.match(r'^python\.version\s*=\s*(.+)$', line_stripped)
                if version_match and current_stanza:
                    python_version = version_match.group(1).strip()
                    python_version_line = line_num
                
                # Check for python.required setting
                required_match = re.match(r'^python\.required\s*=\s*(.+)$', line_stripped)
                if required_match and current_stanza:
                    has_python_required = True
                    python_required_value = required_match.group(1).strip()
                    python_required_line = line_num
            
            # Don't forget the last stanza
            if current_stanza and python_version is not None:
                entries.append(ConfFileEntry(
                    file_path, current_stanza, python_version,
                    python_version_line, has_python_required,
                    python_required_value,
                    python_required_line
                ))
    
    except Exception as e:
        print_error(f"Error parsing {file_path}: {e}")
    
    return entries


def scan_app_directory(app_root: Path, target_dir: str) -> List[ConfFileEntry]:
    """
    Scan the app directory for conf files with python.version settings.
    
    Args:
        app_root: Path to the app root directory
        target_dir: 'default' or 'local' or 'both'
        
    Returns:
        List of ConfFileEntry objects
    """
    all_entries = []
    
    dirs_to_scan = []
    if target_dir in ('default', 'both'):
        default_dir = app_root / 'default'
        if default_dir.exists():
            dirs_to_scan.append(default_dir)
    
    if target_dir in ('local', 'both'):
        local_dir = app_root / 'local'
        if local_dir.exists():
            dirs_to_scan.append(local_dir)
    
    if not dirs_to_scan:
        print_warning(f"No {target_dir} directory found in {app_root}")
        return all_entries
    
    for scan_dir in dirs_to_scan:
        for conf_file in SUPPORTED_CONF_FILES:
            if conf_file in EXCLUDED_CONF_FILES:
                continue
            conf_path = scan_dir / conf_file
            if conf_path.exists() and conf_path.is_file():
                entries = parse_conf_file(conf_path)
                all_entries.extend(entries)
    
    return all_entries


def display_view(entries: List[ConfFileEntry], app_root: Path, target_dir: str, json_mode: bool = False):
    """
    Display current python.version settings without proposing changes.
    
    Args:
        entries: List of ConfFileEntry objects
        app_root: Path to the app root directory
    """
    if not entries:
        if not json_mode:
            print_info("No conf files with python.version settings found.")
        return
    
    if json_mode:
        emit_json({
            "mode": "view",
            "app_root": str(app_root),
            "target": target_dir,
            "entries": [e.to_json(app_root) for e in entries],
        })
        return

    print("\nCurrent Settings:\n")
    print(f"Found {len(entries)} stanza(s) with python.version settings:\n")
    
    for i, entry in enumerate(entries, 1):
        rel_path = entry.get_relative_path(app_root)
        print(f"{i}. {rel_path}")
        print(f"   Stanza: [{entry.stanza}]")
        print(f"   python.version = {entry.python_version}")
        
        if entry.has_python_required:
            print(f"   python.required = {entry.python_required_value}")
        print()


def display_preview(
    entries: List[ConfFileEntry],
    app_root: Path,
    target_dir: str,
    python_required_value: str,
    json_mode: bool = False,
    force: bool = False,
):
    """
    Display a preview of conf files that would be modified.
    
    Args:
        entries: List of ConfFileEntry objects
        app_root: Path to the app root directory
        python_required_value: The value to use for python.required
    """
    if not entries:
        if not json_mode:
            print_info("No conf files with python.version settings found.")
        return

    if json_mode:
        emit_json({
            "mode": "preview",
            "app_root": str(app_root),
            "target": target_dir,
            "python_required": python_required_value,
            "entries": [
                e.to_json(
                    app_root,
                    proposed_python_required=python_required_value,
                    include_status=True,
                    overwrite_existing=force,
                )
                for e in entries
            ],
        })
        return
    
    print("\nPreview of Changes:\n")
    print(f"Found {len(entries)} stanza(s) with python.version settings:\n")
    
    for i, entry in enumerate(entries, 1):
        rel_path = entry.get_relative_path(app_root)
        print(f"{i}. {rel_path}")
        print(f"   Stanza: [{entry.stanza}]")
        print(f"   python.version = {entry.python_version}")
        
        if entry.has_python_required:
            if force:
                print(f"   python.required = {python_required_value} (will be overwritten)")
            else:
                print(f"   python.required = {entry.python_required_value} (already set)")
        else:
            print(f"   python.required = {python_required_value} (will be added)")
        print()


def update_conf_file(entry: ConfFileEntry, python_required_value: str, force: bool = False) -> bool:
    """
    Update a conf file by adding python.required after python.version.
    
    Args:
        entry: ConfFileEntry object
        python_required_value: The value to use for python.required
        
    Returns:
        True if successful, False otherwise
    """
    try:
        # Read the entire file
        # Preserve the original newline style (\n vs \r\n) by disabling
        # universal newline translation.
        with open(entry.file_path, 'r', encoding='utf-8', newline='') as f:
            lines = f.readlines()
        
        if entry.has_python_required and force:
            if entry.python_required_line is None:
                raise ValueError("python.required line number is missing")
            target_index = entry.python_required_line - 1
            existing_line = lines[target_index]
            indent = len(existing_line) - len(existing_line.lstrip())
            indent_str = existing_line[:indent]
            newline = "\r\n" if existing_line.endswith("\r\n") else "\n"
            lines[target_index] = f"{indent_str}python.required = {python_required_value}{newline}"
        elif entry.has_python_required:
            # Already has python.required, skip
            return True
        else:
            # Insert python.required after python.version
            # line_number is 1-indexed, list is 0-indexed
            insert_index = entry.line_number

            # Get the indentation from the python.version line
            version_line = lines[entry.line_number - 1]
            indent = len(version_line) - len(version_line.lstrip())
            indent_str = version_line[:indent]

            # Create the new line with same indentation and line ending style.
            newline = "\r\n" if version_line.endswith("\r\n") else "\n"
            new_line = f"{indent_str}python.required = {python_required_value}{newline}"

            # Insert the new line
            lines.insert(insert_index, new_line)
        
        # Write back to file
        with open(entry.file_path, 'w', encoding='utf-8', newline='') as f:
            f.writelines(lines)
        
        return True
    
    except Exception as e:
        print_error(f"Failed to update {entry.file_path}: {e}")
        return False


def perform_update(entries: List[ConfFileEntry], app_root: Path, python_required_value: str, force: bool = False) -> Tuple[int, int]:
    """
    Perform the actual update on conf files.
    
    Args:
        entries: List of ConfFileEntry objects
        app_root: Path to the app root directory
        python_required_value: The value to use for python.required
        
    Returns:
        Tuple of (successful_count, skipped_count)
    """
    if not entries:
        print_info("No conf files to update.")
        return 0, 0
    
    successful = 0
    skipped = 0
    
    _print("\nUpdating Configuration Files:\n")
    
    # Process entries in a stable order that keeps line numbers valid across
    # multiple updates within the same file (bottom-to-top).
    entries_sorted = sorted(entries, key=lambda e: (str(e.file_path), -e.line_number, e.stanza))

    for entry in entries_sorted:
        rel_path = entry.get_relative_path(app_root)
        
        if entry.has_python_required and not force:
            _print(f"SKIP: {rel_path} [{entry.stanza}] - already has python.required")
            skipped += 1
        else:
            if update_conf_file(entry, python_required_value, force=force):
                _print(f"UPDATED: {rel_path} [{entry.stanza}]")
                successful += 1
            else:
                _print(f"FAILED: {rel_path} [{entry.stanza}]")
    
    return successful, skipped


def confirm_update() -> bool:
    """
    Ask user to confirm the update operation.
    
    Returns:
        True if user confirms, False otherwise
    """
    prompt = "Do you want to proceed with the update? (Y/n): "
    if JSON_MODE:
        print(prompt, end="", file=sys.stderr)
        response = input().strip().lower()
    else:
        response = input(prompt).strip().lower()
    return response in ('y', 'yes', '')


def main():
    """Main entry point"""
    class _HelpFormatter(argparse.RawDescriptionHelpFormatter):
        def __init__(self, prog):
            super().__init__(prog, max_help_position=35)

        def _format_action_invocation(self, action):
            if not action.option_strings:
                return super()._format_action_invocation(action)

            if action.nargs == 0:
                return ", ".join(action.option_strings)

            default = self._get_default_metavar_for_optional(action)
            args_string = self._format_args(action, default)

            parts = []
            for opt in action.option_strings:
                if opt.startswith("--"):
                    parts.append(f"{opt}={args_string}")
                else:
                    parts.append(f"{opt} {args_string}")
            return ", ".join(parts)

    parser = argparse.ArgumentParser(
        description='Update Splunk app to use python.required setting for Python version control',
        formatter_class=_HelpFormatter,
        usage="%(prog)s [-h] --app-root=APP_ROOT\n"
              "       [--view | --preview | --update] [--default] [--local]\n"
              "       [--python.required=VALUE] [--force] [--json]",
        epilog="""
Examples:
  # View current python.version settings
  %(prog)s --app-root=/opt/splunk/etc/apps/myapp --view

  # View settings in local/ only
  %(prog)s --app-root=/opt/splunk/etc/apps/myapp --view --local

  # Preview changes for an app
  %(prog)s --app-root=/opt/splunk/etc/apps/myapp --python.required="3.13" --preview

  # Preview changes with JSON output
  %(prog)s --app-root=/opt/splunk/etc/apps/myapp --python.required="3.13" --preview --json

  # Update default conf files
  %(prog)s --app-root=/opt/splunk/etc/apps/myapp --python.required="3.13" --default --update

  # Update local conf files with multiple Python versions
  %(prog)s --app-root=/opt/splunk/etc/apps/myapp --python.required="3.9, 3.13" --local --update

Notes:
  - The python.required setting takes precedence over python.version
  - Valid values: 3.9, 3.13 (or comma-separated list)
        """
    )
    
    parser.add_argument('--app-root', required=True,
                        help='Required. Path to the app root directory (in $SPLUNK_HOME/etc/apps)')
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument('--view', action='store_true',
                      help='View current python.version settings without proposing changes')
    mode.add_argument('--preview', action='store_true',
                      help='Show what would be changed without making modifications')
    mode.add_argument('--update', action='store_true',
                      help='Perform the actual update (adds python.required with specified value)')
    parser.add_argument('--default', action='store_true',
                        help='Target conf files in the default/ directory (required for --update unless --local is used)')
    parser.add_argument('--local', action='store_true',
                        help='Target conf files in the local/ directory (required for --update unless --default is used)')
    parser.add_argument('--python.required', '--python-required',
                        dest='python_required',
                        metavar='VALUE',
                        help='Required with --preview/--update. Value for python.required setting. Examples: "3.13", "3.9, 3.13"')
    parser.add_argument('--force', action='store_true',
                        help='Overwrite existing python.required values during update')
    parser.add_argument('--json', action='store_true',
                        help='Get the output in json format')
    
    args = parser.parse_args()
    global JSON_MODE
    JSON_MODE = bool(args.json)
    
    # Default to view mode if no explicit mode is provided.
    if not (args.view or args.preview or args.update):
        args.view = True

    if (args.preview or args.update) and not args.python_required:
        if args.json:
            return emit_json_error("--preview and --update require --python.required to be specified")
        print_error("--preview and --update require --python.required to be specified")
        return 1
    
    # Print banner
    if not args.json:
        print_banner()
    
    # Validate app root
    app_root = validate_app_root(args.app_root)
    if not app_root:
        if args.json:
            return emit_json_error("Invalid app root or operation cancelled")
        return 1
    
    if not args.json:
        print(f"Found app root: {app_root}")
    
    # Determine target directory
    if args.view:
        if args.default and args.local:
            target_dir = 'both'
            if not args.json:
                print_info("Scanning: default/ and local/ directories")
        elif args.default:
            target_dir = 'default'
            if not args.json:
                print_info("Scanning: default/ directory")
        elif args.local:
            target_dir = 'local'
            if not args.json:
                print_info("Scanning: local/ directory")
        else:
            target_dir = 'both'
            if not args.json:
                print_info("Scanning: default/ and local/ directories")
    elif args.update:
        # For update mode, require explicit directory selection.
        if args.default and args.local:
            target_dir = 'both'
            if not args.json:
                print_info("Target: default/ and local/ directories")
        elif args.default:
            target_dir = 'default'
            if not args.json:
                print_info("Target: default/ directory")
        elif args.local:
            target_dir = 'local'
            if not args.json:
                print_info("Target: local/ directory")
        else:
            if args.json:
                return emit_json_error("For update mode, you must specify --default and/or --local")
            print_error("For update mode, you must specify --default and/or --local")
            return 1
    else:
        # For preview mode, allow --default/--local to narrow scope, otherwise scan both.
        if args.default and args.local:
            target_dir = 'both'
            if not args.json:
                print_info("Scanning: default/ and local/ directories")
        elif args.default:
            target_dir = 'default'
            if not args.json:
                print_info("Scanning: default/ directory")
        elif args.local:
            target_dir = 'local'
            if not args.json:
                print_info("Scanning: local/ directory")
        else:
            target_dir = 'both'
            if not args.json:
                print_info("Scanning: default/ and local/ directories")
    
    # Scan for conf files
    if not args.json:
        print("Scanning for conf files with python.version settings...")
    entries = scan_app_directory(app_root, target_dir)
    
    # Display results based on mode
    if args.view:
        display_view(entries, app_root, target_dir, json_mode=args.json)
        return 0
    
    # Display preview.
    if args.preview:
        display_preview(entries, app_root, target_dir, args.python_required, json_mode=args.json, force=args.force)
        return 0
    
    # Perform update if requested
    if args.update:
        if not entries:
            if args.json:
                emit_json({
                    "mode": "update",
                    "app_root": str(app_root),
                    "target": target_dir,
                    "python_required": args.python_required,
                    "entries": [],
                    "entries_found": 0,
                    "summary": {"updated": 0, "skipped": 0},
                })
                return 0
            print_info("Nothing to update.")
            return 0

        will_update = [e for e in entries if (args.force or not e.has_python_required)]
        if not will_update:
            message = "Nothing to update: all matching stanzas already have python.required. Use --force to overwrite."
            if args.json:
                emit_json({
                    "mode": "update",
                    "app_root": str(app_root),
                    "target": target_dir,
                    "python_required": args.python_required,
                    "confirmed": False,
                    "message": message,
                    "entries": [
                        e.to_json(
                            app_root,
                            proposed_python_required=args.python_required,
                            include_status=True,
                            overwrite_existing=args.force,
                        )
                        for e in entries
                    ],
                    "entries_found": len(entries),
                    "summary": {"updated": 0, "skipped": len(entries)},
                })
                return 0
            display_preview(entries, app_root, target_dir, args.python_required, json_mode=False, force=args.force)
            print_info(message)
            return 0

        if not args.json:
            display_preview(entries, app_root, target_dir, args.python_required, json_mode=False, force=args.force)
        
        # Confirm with user
        if not confirm_update():
            if args.json:
                emit_json({
                    "mode": "update",
                    "app_root": str(app_root),
                    "target": target_dir,
                    "python_required": args.python_required,
                    "confirmed": False,
                    "entries": [
                        e.to_json(
                            app_root,
                            proposed_python_required=args.python_required,
                            include_status=True,
                            overwrite_existing=args.force,
                        )
                        for e in entries
                    ],
                    "entries_found": len(entries),
                    "summary": {"updated": 0, "skipped": 0},
                })
                return 0
            print_info("Update cancelled by user.")
            return 0
        
        # Perform the update
        successful, skipped = perform_update(entries, app_root, args.python_required, force=args.force)

        if args.json:
            emit_json({
                "mode": "update",
                "app_root": str(app_root),
                "target": target_dir,
                "python_required": args.python_required,
                "confirmed": True,
                "entries": [
                    e.to_json(
                        app_root,
                        proposed_python_required=args.python_required,
                        include_status=True,
                        overwrite_existing=args.force,
                    )
                    for e in entries
                ],
                "entries_found": len(entries),
                "summary": {"updated": successful, "skipped": skipped},
            })
            return 0
        
        # Summary
        print("\nUpdate Summary:\n")
        print(f"  Total entries found: {len(entries)}")
        print(f"  Successfully updated: {successful}")
        print(f"  Skipped (already has python.required): {skipped}")
        
        if successful > 0:
            print("\nUpdate completed successfully!\n")
    else:
        # Should be unreachable because --preview and --update are mutually exclusive,
        # and view/preview already returned above.
        pass
    
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n\nOperation cancelled by user.")
        sys.exit(130)
    except Exception as e:
        print_error(f"Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
