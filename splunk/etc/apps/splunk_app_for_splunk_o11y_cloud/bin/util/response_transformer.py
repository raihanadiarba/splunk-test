from util import o11y_utils
from util.o11y_environment import O11yContext

logger = o11y_utils.setup_logger('response_transformer')


def transform_response(o11y_context: O11yContext, json_data):
    override_url = None
    try:
        # Check if the endpoint URL is for o11y configuration json
        if 'v2/app/client/configuration' in o11y_context.get_request_path():
            dev_settings = o11y_context.get_dev_settings()
            if not dev_settings or not isinstance(dev_settings, dict):
                # In normal prod use there isn't a dev stanza, so we just return the default json_data
                return json_data
            override_url = str(dev_settings.get('sidebar_ui_override_url', ''))
            if override_url:
                json_data['appConfig'].update({'enterpriseintegrationJS': override_url})
        return json_data
    except KeyError as e:
        logger.error(f"KeyError in transform_response: {e}")
    except Exception as e:
        logger.error(f"Error processing O11y request: {e}")
    return json_data
