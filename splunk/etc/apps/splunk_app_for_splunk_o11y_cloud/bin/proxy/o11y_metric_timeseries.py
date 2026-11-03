import json
import os
import sys
import time

current_path = os.path.dirname(__file__)
sys.path.append(current_path)
sys.path.append(os.path.abspath(os.path.join(current_path, '..')))
sys.path.append(os.path.abspath(os.path.join(current_path, '..', '..', 'libs', 'simlib')))

from util.exception import ConfigurationException
from util.o11y_environment import O11yController, O11yContext
from util.signalflow_log import sanitize_log_value, signalflow_log_summary
from signalfx.signalflow import SignalFlowClient, messages
from util import o11y_utils
from splunk.persistconn.application import PersistentServerConnectionApplication

logger = o11y_utils.setup_logger('o11y_metric_timeseries')

SIM_FLOW_LIMIT_MSG_CODE = 'FIND_LIMITED_RESULT_SET'
SIM_META_DATA_FIELDS_TO_IGNORE_IN_FLOW_RESULTS_DEFAULT = "sf_originatingMetric,sf_createdOnMs,sf_isPreQuantized," \
                                                         "sf_key,sf_metric,sf_type,sf_singletonFixedDimensions"
SIM_COMMAND_FLOW_METADATA_FIELDS_TO_IGNORE = [
    x.strip() for x in SIM_META_DATA_FIELDS_TO_IGNORE_IN_FLOW_RESULTS_DEFAULT.split(',')
]


# Web Url: http://localhost:8000/en-US/splunkd/__raw/o11y/v1/metrictimeseries
# Service Url: https://localhost:8089/servicesNS/-/splunk_app_for_splunk_o11y_cloud/o11y/v1/metrictimeseries
class O11yMetricTimeSeries(O11yController, PersistentServerConnectionApplication):
    def __init__(self, _command_line, _command_arg):
        super(PersistentServerConnectionApplication, self).__init__()

    def handle_request(self, o11y_context, request):
        query_params = json.loads(request.get('payload', '{}'))
        signalflow_program = query_params.get('signalflow_program')
        if not signalflow_program:
            return {'status': 400, 'payload': {'error': 'Bad request, no signalflow program provided.'}}
        end_time = query_params.get('end_time', int(time.time()) * 1000)
        start_time = query_params.get('start_time', end_time - 60000)
        resolution = query_params.get('resolution', 30000)
        with_derived_metadata = query_params.get('with_derived_metadata', False)

        try:
            results = self.run_signal_flow_program(o11y_context, signalflow_program,
                                                   start_time,
                                                   end_time,
                                                   resolution,
                                                   with_derived_metadata)
            return {'status': 200, 'payload': results}
        except Exception as e:
            return {'status': 500, 'payload': {'error': 'Internal server error, exception=' + str(e)}}

    @staticmethod
    def _process_signalflow_program_results(flow_client, computation, signalflow_program, resolution):
        (
            data_msg_count,
            data_msg_size,
            metadata_msg_count,
            metadata_msg_size,
            mts_count,
            other_msg_count,
            computation_id
        ) = 0, 0, 0, 0, 0, 0, ''
        meta_data = {}
        sim_flow_limit_reached = False
        signalflow_program_log = signalflow_log_summary(signalflow_program)

        logger.info(
            'status=start, action=process_signalflow_program_results, sub_command={}'.format(signalflow_program_log))

        try:
            for msg in computation.stream():
                try:
                    if isinstance(msg, messages.JobStartMessage):
                        computation_id = msg.handle
                    # Check for SIM Limit reached message
                    if not sim_flow_limit_reached and isinstance(
                        msg,
                        messages.InfoMessage
                    ) and msg.message and msg.message.get(
                        'messageCode', None
                    ) == SIM_FLOW_LIMIT_MSG_CODE:
                        sim_flow_limit_reached = True

                    if isinstance(msg, messages.MetadataMessage):
                        msg.properties['metric_name'] = msg.properties.get('sf_originatingMetric', '')
                        msg.properties.pop('computationId', None)
                        # Remove unwanted metadata fields
                        for key in SIM_COMMAND_FLOW_METADATA_FIELDS_TO_IGNORE:
                            msg.properties.pop(key, None)
                        meta_data[msg.tsid] = msg.properties
                        metadata_msg_count += 1
                        if metadata_msg_size == 0:
                            metadata_msg_size = sys.getsizeof(str(msg.properties))

                    elif isinstance(msg, messages.DataMessage):
                        if not msg.data.items():
                            continue
                        msg_time = o11y_utils.normalize_time(msg.logical_timestamp_ms)
                        data_msg_count += 1
                        mts_count += len(msg.data.items())
                        if data_msg_size == 0:
                            data_msg_size = sys.getsizeof(str(msg.data))
                        for k, v in msg.data.items():
                            if k in meta_data:
                                flat_json = meta_data.get(k).copy()
                                # Add fields - metric value, time to match the splunk metric store keys
                                flat_json['_value'] = v
                                flat_json['_time'] = msg_time
                                flat_json['sf_resolutionMs'] = meta_data.get(k).get('sf_resolutionMs', resolution)
                                flat_json['sf_organizationID'] = meta_data.get(k).get('sf_organizationID', None)
                                yield flat_json
                    else:
                        other_msg_count += 1
                except Exception as e:
                    error_msg = sanitize_log_value(e)
                    logger.error(
                        'status=error, action=process_signalflow_program_results_msg, '
                        'sub_command={0}, computation_id={1}, error_msg={2}'.format(
                            signalflow_program_log, computation_id, error_msg))
        except Exception as e:
            error_msg = sanitize_log_value(e)
            logger.error(
                'status=error, action=process_signalflow_program_results_msg, '
                'sub_command={0}, computation_id={1}, error_msg={2}'.format(
                    signalflow_program_log, computation_id, error_msg))
            return
        finally:
            flow_client.close()
            logger.info(
                'status=process, action=close_sim_client_connection, sub_command={0}'.format(
                    signalflow_program_log))

        if sim_flow_limit_reached:
            logger.error(
                'status=error, error_code=limit_reached, error_msg=sim flow search reached metadata message limit '
                'of {2}., action=process_signalflow_program_results, sub_command={0} sim_flow_limit_reached={1}, '
                'sim_flow_metadata_limit={2},computation_id={3}'.format(
                    signalflow_program_log, str(sim_flow_limit_reached), str(metadata_msg_count), computation_id))

            yield {
                'sim_flow_limit_reached': True,
                'sim_flow_limit_metadata_msg_count': metadata_msg_count
            }

        logger.info(
            'status=complete, action=process_signalflow_program_results, sub_command={0}, metadata_msg_count={1}, '
            'metadata_msg_size={2}, data_msg_count={3}, data_msg_size={4}, mts_count={5}, other_msg_count={6}, '
            'computation_id={7}'
            .format(signalflow_program_log, str(metadata_msg_count), str(metadata_msg_size), str(data_msg_count),
                    str(data_msg_size), str(mts_count), str(other_msg_count), computation_id))

    @staticmethod
    def run_signal_flow_program(o11y_context: O11yContext, signalflow_program, start_time, end_time, resolution,
                                with_derived_metadata=None, force_new_domain=False):
        signalflow_program_log = signalflow_log_summary(signalflow_program)
        o11y_stream_url = o11y_context.get_stream_url(force_new_domain=force_new_domain)
        logger.info(
            'status=start, action=run_signal_flow_program, sub_command={0}, url={1}, start_time={2}, end_time={3}, '
            'resolution={4}, with_derived_metadata={5}'.format(
                signalflow_program_log, o11y_stream_url, str(start_time), str(end_time), str(resolution),
                str(with_derived_metadata)))
        try:
            api_token = o11y_context.get_api_token()
            if not api_token:
                raise ConfigurationException('API token is not set')
            flow_client = SignalFlowClient(token=api_token, endpoint=o11y_stream_url)
        except Exception as e:
            error_msg = sanitize_log_value(e)
            logger.error(
                'status=error, action=initialize_sim_client, url{0}, error_msg={1}'.format(o11y_stream_url, error_msg)
            )
            raise e
        try:
            logger.info('status=start, action=execute_signalflow_program, sub_command={0}'.format(
                signalflow_program_log))
            computation = flow_client.execute(signalflow_program,
                                              start=start_time,
                                              stop=end_time,
                                              resolution=resolution,
                                              immediate=True,
                                              withDerivedMetadata=with_derived_metadata,
                                              resolutionAdjustable=True)
            logger.info('status=complete, action=execute_signalflow_program, sub_command={}'.format(
                signalflow_program_log))
        except Exception as e:
            error_msg = sanitize_log_value(e)
            logger.error(
                'status=error, action=execute_signalflow_program, sub_command={0}, error_msg={1}'.format(
                    signalflow_program_log, error_msg))
            flow_client.close()
            raise e
        logger.info(
            'status=complete, action=run_signal_flow_program, sub_command={0}, url={1}, start_time={2}, end_time={3},'
            ' resolution={4}, with_derived_metadata={5}'.format(
                signalflow_program_log, o11y_stream_url, str(start_time), str(end_time), str(resolution),
                str(with_derived_metadata)))

        return list(O11yMetricTimeSeries.
                    _process_signalflow_program_results(flow_client, computation, signalflow_program, resolution))
