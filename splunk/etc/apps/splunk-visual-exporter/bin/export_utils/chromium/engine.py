import base64
import json
import subprocess
import os
from export_utils.chromium.paths import get_legacy_html_path, get_studio_html_path, get_headless_shell_path, get_os
from export_utils.chromium.utils import categorize_log, log_messages, log_if_screenshot_error, logger

DEFAULT_TIMEOUT = 30
DEFAULT_WIDTH = 1440
DEFAULT_HEIGHT = 960
DEFAULT_CHROMIUM_SCREENSHOT_DELAY = 0
DEFAULT_EXPORT_MAX_FILE_SIZE_MB = 8
DEFAULT_EXPORT_MAX_SCALE_FACTOR = 4
ROOT_LINUX_EUID = 0

class ChromiumEngine:
	headless_shell_path = get_headless_shell_path()
	potential_sandbox_error = False
	previously_ran_sandbox = False

	def get_definition_dimensions(self, definition: dict):
		layout_options = definition.get('layout', {}).get('options', {})
		
		is_tabbed_dashboard = 'tabs' in definition.get('layout', {}) and 'layoutDefinitions' in definition.get('layout', {})
		# order of tabs is derived from the items array and we then get the layout from layoutDefinitions
		if is_tabbed_dashboard:
			items = definition.get('layout', {}).get('tabs', {}).get('items', [])
			first_tab_id = items[0].get('layoutId', None) if len(items) > 0  else None
			layout_definitions = definition.get('layout', {}).get('layoutDefinitions', {})
			if first_tab_id and first_tab_id in layout_definitions:
				layout_options = layout_definitions[first_tab_id].get('options', {})

		width = layout_options.get('width', DEFAULT_WIDTH)
		height = layout_options.get('height', DEFAULT_HEIGHT)
		return [width, height]

	def kill_process(self, process: subprocess.Popen, dashboard_title: str):
		try:
			process.kill()
			process.terminate()
			# wait for process to exit
			process.communicate()
		except Exception:
			logger.exception("Error occurred while killing Chromium process for dashboard %s" % dashboard_title)

	def is_linux_root_user(self):
		return get_os() == 'linux' and os.geteuid() == ROOT_LINUX_EUID

	def determine_chromium_args(self, command: str, width: int, height: int, html: str):
		chromium_args = [
			self.headless_shell_path,
			command,
			f"--window-size={width},{height}",
			"--disable-extensions",
			"--font-render-hinting=none",
			# GPU flags used so WebGL can work on Linux via software rendering
			"--disable-gpu",
			"--disable-dev-shm-usage",
			"--use-gl=angle",
			"--use-angle=swiftshader",
		]

		# sandbox must always be run on Windows, otherwise renderer processes might not be cleaned up correctly
		if get_os() != 'windows' and (self.is_linux_root_user() or (self.previously_ran_sandbox and self.potential_sandbox_error)):
			reason = 'run Splunk as non-root' if self.is_linux_root_user() else 'enable unprivileged user namespaces'
			logger.error('Running Chromium without sandbox. To run with sandbox ' + reason)
			chromium_args.append("--no-sandbox")
		else:
			logger.info('Running Chromium with sandbox.')
			self.previously_ran_sandbox = True
		
		chromium_args.append(html)

		return chromium_args

	def open_chromium(self, arg_str: str, chromium_args: dict, timeout: int, dashboard_title: str, export_errors: list):
		process = subprocess.Popen(
			args=chromium_args,
			stdin=subprocess.PIPE,
			stdout=subprocess.PIPE,
			stderr=subprocess.PIPE
		)
		# We have to base64 encode the json string since Chromium expects the command line 
		# input in ASCII format
		try:
			_, errs = process.communicate(input=base64.b64encode(arg_str.encode('utf-8')), timeout=timeout)
		except subprocess.TimeoutExpired:
			export_errors.append("PDF failed to render due to Chromium's time out limit. Adjust the time for render_chromium_timeout in the limits.conf file.")
			logger.error('Failed to take screenshot of dashboard %s due to timeout limit' % dashboard_title)
			logger.exception('Killing process for dashboard %s' % dashboard_title)
			self.kill_process(process, dashboard_title)
			return False

		# Chromium writes console logs into stderr along with any other warnings/errors that occur
		errs = errs.decode('utf-8').split(os.linesep)
		return errs

	def append_log(self, js_script_logs, non_js_chromium_logs, err, log_index):
		categorized_log = categorize_log(err.strip(), log_index)
		if categorized_log:
			logs = js_script_logs if categorized_log['is_js_log'] else non_js_chromium_logs
			logs.append(categorized_log['log'])

	# For legacy exports
	def get_svg_from_chromium(self, arg_str: str, width: int = DEFAULT_WIDTH, height: int = DEFAULT_HEIGHT, sxml_errors: list = None, timeout: int = DEFAULT_TIMEOUT):
		dashboard_title = "ClassicDashboard"
		chromium_args = self.determine_chromium_args("--custom-headless-command", width, height, get_legacy_html_path())
		invalid_locale_message = 'SVG cannot be rendered due to invalid locale:'
		try:
			errs = self.open_chromium(arg_str, chromium_args, timeout=timeout, dashboard_title=dashboard_title, export_errors=sxml_errors)
			if not errs:
				return False
			
			svg = None
			js_script_logs = []
			non_js_chromium_logs = []
			for index, err in enumerate(errs):
				if '<svg' in err:
					import re
					regex_match = re.search('"<svg.*\/svg>"', err).group(0)
					svg = json.loads(regex_match)
					break
				elif invalid_locale_message in err:
					logger.warning(err)
				else:
					self.append_log(js_script_logs, non_js_chromium_logs, err, index)

			if svg:
				return svg
			if len(js_script_logs) == 0:
				self.potential_sandbox_error = True

			messages_to_log = js_script_logs
			messages_to_log.extend(non_js_chromium_logs)
			# sort to preserve the order the logs were emitted
			sorted_logs = sorted(messages_to_log, key=lambda x: x['index'])
			log_messages(sorted_logs)
				
			logger.error('Failed to take screenshot of dashboard %s' %dashboard_title)
			return False
		except Exception as e:
			error_msg = 'Failed to take screenshot of dashboard %s because of error: %s' % (dashboard_title, str(e))
			logger.exception(error_msg)
			sxml_errors.append(error_msg)
			return False

	def get_screenshot_from_chromium(self, arg_str, definition, timeout, dashboard_title, studio_errors):
		width, height = self.get_definition_dimensions(definition)
		chromium_args = self.determine_chromium_args("--custom-headless-command", width, height, get_studio_html_path())
		try:
			errs = self.open_chromium(arg_str, chromium_args, timeout=timeout, dashboard_title=dashboard_title, export_errors=studio_errors)
			screenshot = None
			js_script_logs = []
			non_js_chromium_logs = []
			if not errs:
				return False

			for index, err in enumerate(errs):
				import re

				# Try to pull out the screenshot data‐URL (png *or* jpeg)
				screenshot_match = re.search(
					r'"(data:image/(?:png|jpeg);base64,[^"]+)"',
					err
				)
				if not screenshot_match:
					self.append_log(js_script_logs, non_js_chromium_logs, err, index)
					continue

				# it—group(1) is ex: "data:image/png;base64,AAAA..."
				screenshot = screenshot_match.group(1)

				# emit all accumulated logs
				log_messages(js_script_logs)

				logger.info(f'Found screenshot for {dashboard_title}')
				break

			if screenshot:
				return screenshot
			if len(js_script_logs) == 0:
				self.potential_sandbox_error = True
			
			messages_to_log = js_script_logs
			messages_to_log.extend(non_js_chromium_logs)
			# sort to preserve the order the logs were emitted
			sorted_logs = sorted(messages_to_log, key=lambda x: x['index'])
			log_messages(sorted_logs)

			return False
		except Exception as e:
			error_msg = 'Failed to take screenshot of dashboard %s because of error: %s' % (dashboard_title, str(e))
			logger.exception(error_msg)
			studio_errors.append(error_msg)
			return False

	def get_screenshot(self, definition: dict, theme: str, feature_flags: dict, studio_errors: list, timeout: int = DEFAULT_TIMEOUT, screenshot_delay: int = DEFAULT_CHROMIUM_SCREENSHOT_DELAY, export_max_file_size_mb: int = DEFAULT_EXPORT_MAX_FILE_SIZE_MB, export_max_scale_factor: int = DEFAULT_EXPORT_MAX_SCALE_FACTOR, file_format: str = "pdf"):
		arg_str = json.dumps({ "definition": definition, "theme": theme, "featureFlags": feature_flags, "screenshotDelay": screenshot_delay, "exportMaxFileSizeMB": export_max_file_size_mb, "exportMaxScaleFactor": export_max_scale_factor, "fileFormat": file_format.lower()})
		dashboard_title = definition.get('title', '')
		logger.info('Starting export of %s' % dashboard_title)

		first_screenshot_attempt = self.get_screenshot_from_chromium(arg_str, definition, timeout, dashboard_title, studio_errors)
		first_attempt_failed = first_screenshot_attempt == False

		if get_os() != 'windows' and first_attempt_failed and self.previously_ran_sandbox and self.potential_sandbox_error:
			studio_errors.clear()
			second_screenshot_attempt = self.get_screenshot_from_chromium(arg_str, definition, timeout, dashboard_title, studio_errors)
			log_if_screenshot_error(second_screenshot_attempt, dashboard_title)
			return second_screenshot_attempt
		
		log_if_screenshot_error(first_screenshot_attempt, dashboard_title)
		
		return first_screenshot_attempt
	
	def get_svg(self, dashboard_title: str, viz: str, data: dict, width: int = DEFAULT_WIDTH, height: int = DEFAULT_HEIGHT, sxml_errors: list = None, timeout: int = DEFAULT_TIMEOUT):
		arg_str = json.dumps({ "type": "legacy", "viz": viz, "data": data })
		logger.info('Starting export of %s' % dashboard_title)
		first_screenshot_attempt = self.get_svg_from_chromium(arg_str, width, height, sxml_errors, timeout)
		first_attempt_failed = first_screenshot_attempt == False

		if get_os() != 'windows' and first_attempt_failed and self.previously_ran_sandbox and self.potential_sandbox_error:
			sxml_errors.clear()
			second_screenshot_attempt = self.get_svg_from_chromium(arg_str, width, height, sxml_errors, timeout)
			log_if_screenshot_error(second_screenshot_attempt, dashboard_title)
			return second_screenshot_attempt
		
		log_if_screenshot_error(first_screenshot_attempt, dashboard_title)
		return first_screenshot_attempt
	
