import json
import os
import sys
from dataclasses import asdict

from splunk.persistconn.application import PersistentServerConnectionApplication  # type: ignore

current_path = os.path.dirname(__file__)
sys.path.append(current_path)
sys.path.append(os.path.abspath(os.path.join(current_path, '..')))

from util.o11y_environment import O11yContext, O11yController
from util.exception import ConfigurationException, OperationException
from chart_data.o11y_datasource_options import O11yDatasourceOptions
from chart_data.data_manager_util import get_data_manager

from util import o11y_utils

logger = o11y_utils.setup_logger('chart_data_controller')

ERROR_FETCH_CHART_DATA = "Failed to fetch chart data"


class ChartDataController(O11yController, PersistentServerConnectionApplication):
    def __init__(self,
                 _command_line,
                 _command_arg,
                 ):
        super(PersistentServerConnectionApplication, self).__init__()

    def handle_request(self, o11y_context: O11yContext, request: dict) -> dict:
        logger.debug("Request received")
        try:
            payload = json.loads(request.get('payload'))
            data_source_name = payload.get('name', 'Unnamed Data Source')
            options = payload.get('options', {})
            logger.info(f"Fetching chart data for: {data_source_name}")
            logger.debug(f"Request payload: {payload}")
            converted_options = O11yDatasourceOptions.from_dict(options)
            data_fetcher = get_data_manager(converted_options)
        except Exception as e:
            logger.info(f"Invalid datasource options: {e}")
            return {
                "status": 400,
                "payload": (
                    f"Invalid datasource options: {e}" if isinstance(e, ValueError) else "Missing datasource options")
            }

        try:
            response = data_fetcher.fetch_data(o11y_context, converted_options)
            logger.info(f"Fetched data from o11y API for: {data_source_name}")
        except ConfigurationException as e:
            logger.info(e)
            return {
                "status": 400,
                "payload": json.dumps({"error": str(e)})
            }
        except OperationException as e:
            logger.error(e, exc_info=True)
            return {
                "status": 500,
                "payload": str(e)
            }
        except Exception as e:
            generic_error = ERROR_FETCH_CHART_DATA
            # NOTE: we are logging the actual error here,
            # but return only a generic error to the user
            logger.error(f"{generic_error}- {converted_options} - {e} ", exc_info=True)
            return {
                "status": 500,
                "payload": generic_error
            }
        logger.info(f"Returning formatted data for: {data_source_name}")
        return {
            "status": 200,
            "payload": asdict(response)
        }
