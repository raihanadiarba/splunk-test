import os
import sys

from splunk.persistconn.application import PersistentServerConnectionApplication

current_path = os.path.dirname(__file__)
sys.path.append(current_path)
sys.path.append(os.path.abspath(os.path.join(current_path, '..')))
from util import o11y_utils
from util.o11y_environment import O11yController, O11yContext

logger = o11y_utils.setup_logger('o11y_config')


class O11yConfigService(O11yController, PersistentServerConnectionApplication):

    def __init__(self, _command_line, _command_arg):
        super(PersistentServerConnectionApplication, self).__init__()

    def handle_request(self, o11y_context: O11yContext, request):
        admin_set = o11y_context.get_admin_settings()

        auto_update_enabled = str(admin_set.get('auto_update', 'False')).lower() == 'true'
        auto_field_mapping_enabled = str(admin_set.get('auto_field_mapping', 'False')).lower() == 'true'
        rc_discovery_flag_enabled = str(admin_set.get('rc_discovery', 'True')).lower() == 'true'
        freemium_flag_enabled = str(admin_set.get('freemium_activated', 'False')).lower() == 'true'
        payload = {'tokenSet': bool(o11y_context.get_api_token() and o11y_context.get_realm()),
                   'autoUpdate': auto_update_enabled,
                   'autoFieldMapping': auto_field_mapping_enabled,
                   'rcDiscovery': rc_discovery_flag_enabled,
                   'freemiumActivated': freemium_flag_enabled,
                   'defaultOrgId': admin_set.get('default_org_id', ''),
                   'defaultOrgName': admin_set.get('default_org_name', ''),
                   'defaultOrgRealm': admin_set.get('default_org_realm', ''),
                   }

        return {'status': 200, 'payload': payload}
