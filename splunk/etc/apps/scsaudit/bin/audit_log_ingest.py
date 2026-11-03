"""
(C) 2025 Splunk LLC All rights reserved.
"""

from __future__ import print_function
import sys
import logging
import signal
import json

from mq.factory import Factory

import splunk.cloud
import splunk.cloud.aws
import splunk.bundle as bundle

import splunk.clilib.cli_common as cli_common

from audit_utils import (
    rest_json_helper,
    setup_logging,
    get_parameter_from_config
)

logging = setup_logging('audit_ingest.log', 'audit_ingest')

DEFAULT_AUDIT_TRAIL_REQUEST_TIMEOUT = 3

DEFAULT_SQS_MESSAGE_MAX_RETRY = 3
DEFAULT_SQS_RECEIVE_WAIT_TIME_SECONDS = 20
DEFAULT_SQS_MAX_RECEIVE_NUMBER = 10

DEFAULT_AZSB_MESSAGE_MAX_RETRY = 3
DEFAULT_AZSB_RECEIVE_WAIT_TIME_SECONDS = 20
DEFAULT_AZSB_MAX_RECEIVE_NUMBER = 100

DEFAULT_GOOGLEPUBSUB_MESSAGE_MAX_RETRY = 3
DEFAULT_GOOGLEPUBSUB_RECEIVE_WAIT_TIME_SECONDS = 20
DEFAULT_GOOGLEPUBSUB_MAX_RECEIVE_NUMBER = 100

messages_to_delete = []

class MissingParameter(Exception):
    pass

class SCSAudit(object):
    def __init__(self, session_key):
        """
        Does not do any external network requests.

        :param session_key: Session key
        """

        self.session_key = session_key
        signal.signal(signal.SIGTERM, self.handle_term)

        self.logger = logging

        cloud_provider = get_parameter_from_config(self.session_key, logging, "cloud_provider")
        if not cloud_provider or not cloud_provider.strip():
            logging.error("init(): Failed to retrieve cloud_provider from config.")
            raise MissingParameter
        self.cloud_provider = cloud_provider

        region = get_parameter_from_config(self.session_key, logging, "region")
        if not region or not region.strip():
            logging.error("init(): Failed to retrieve region from config.")
            raise MissingParameter
        self.region = region

        stack = get_parameter_from_config(self.session_key, logging, "stack")
        if not stack or not stack.strip():
            logging.error("init(): Failed to retrieve stack from config.")
            raise MissingParameter
        self.stack = stack

        self.audit_trail_request_timeout = int(get_parameter_from_config(self.session_key, logging, "audit_trail_request_timeout", DEFAULT_AUDIT_TRAIL_REQUEST_TIMEOUT))

        if cloud_provider == "aws":
            self.max_retry = int(get_parameter_from_config(self.session_key, logging, "sqs_message_max_retry", DEFAULT_SQS_MESSAGE_MAX_RETRY))
            self.wait_time_seconds = int(get_parameter_from_config(self.session_key, logging, "sqs_receive_wait_time_seconds", DEFAULT_SQS_RECEIVE_WAIT_TIME_SECONDS))
            self.max_receive_number = int(get_parameter_from_config(self.session_key, logging, "sqs_max_receive_number", DEFAULT_SQS_MAX_RECEIVE_NUMBER))
        elif cloud_provider == "azure":
            self.max_retry = int(get_parameter_from_config(self.session_key, logging, "azsb_message_max_retry", DEFAULT_AZSB_MESSAGE_MAX_RETRY))
            self.wait_time_seconds = int(get_parameter_from_config(self.session_key, logging, "azsb_receive_wait_time_seconds", DEFAULT_AZSB_RECEIVE_WAIT_TIME_SECONDS))
            self.max_receive_number = int(get_parameter_from_config(self.session_key, logging, "azsb_max_receive_number", DEFAULT_AZSB_MAX_RECEIVE_NUMBER))
        elif cloud_provider == "gcp":
            self.max_retry = int(get_parameter_from_config(self.session_key, logging, "googlepubsub_message_max_retry", DEFAULT_GOOGLEPUBSUB_MESSAGE_MAX_RETRY))
            self.wait_time_seconds = int(get_parameter_from_config(self.session_key, logging, "googlepubsub_receive_wait_time_seconds", DEFAULT_GOOGLEPUBSUB_RECEIVE_WAIT_TIME_SECONDS))
            self.max_receive_number = int(get_parameter_from_config(self.session_key, logging, "googlepubsub_max_receive_number", DEFAULT_GOOGLEPUBSUB_MAX_RECEIVE_NUMBER))

        try:
            mq_client_factory = Factory(
                logger=self.logger,
                cloud_provider=self.cloud_provider,
                max_receive_number=self.max_receive_number,
                wait_time_seconds=self.wait_time_seconds,
                region=self.region,
                stack=self.stack,
            )
            self.mq_client = mq_client_factory.new_mq_client()
        except:
            logging.exception("__init__(): Error while constructing MQ client factory")
            raise

    def close(self):
        self.mq_client.close()

    def process(self):
        """
        Receive all available SCS audit events from a message queue and ingest them into _audit index.
        """

        try:
            self.mq_client.initialize()
        except:
            logging.exception("process(): Error while initializing MQ client")
            raise

        # Continue receiving until no message left in the queue
        total_messages = 0
        global messages_to_delete

        while True:
            received_messages = self.mq_client.receive_messages()
            if len(received_messages) == 0:
                logging.info(f"process(): No more messages. Total received messages: {total_messages}. Exiting")
                return
            total_messages = total_messages + len(received_messages)

            for message in received_messages:
                success = True
                try:
                    logging.info(f"process(): Processing. message_id: {message.message_id}")
                    # Note that the audit_payload field should be set in each message from all vendors.
                    result, response, contents = rest_json_helper(
                        self.session_key,
                        logging,
                        'POST',
                        "/services/admin/audit-trail?output_mode=json",
                        self.audit_trail_request_timeout,
                        message.audit_payload,
                    )
                    if result and (response.status == 200 or response.status == 201):
                        messages_to_delete.append(message)
                        logging.info(f"process(): Success. message_id: {message.message_id}")
                    else:
                        logging.error(f"process(): Error while posting event to audit trail, message_id: {message.message_id}, "
                                      f"response: {response}, contents: {contents}")
                        success = False

                except Exception:
                    logging.exception(f"process(): Encountered exception while ingesting message to audit trail. "
                                      f"message_id: {message.message_id}")
                    success = False

                # Failed messages will be retried until max_retry is reached
                if not success:
                    try:
                        # Note that the audit_delivery_count field should be set in each message from all vendors.
                        logging.info(f"process(): Message with message_id: {message.message_id} "
                                     f"already delivered for {message.audit_delivery_count} times")
                        if message.audit_delivery_count >= self.max_retry:
                            logging.info(f"process(): Message with message_id: {message.message_id} "
                                         f"exceeded maximum retry. Will delete from the queue.")
                            messages_to_delete.append(message)
                    except Exception:
                        logging.exception(f"process(): Failed to retrieve previously delievered count for message "
                                          f"message_id: {message.message_id}. Will delete from the queue.")
                        messages_to_delete.append(message)

            try:
                self.mq_client.delete_messages(messages_to_delete)
                messages_to_delete.clear()
            except Exception:
                logging.exception("process(): Error while deleting messagess")

    def handle_term(self, signum, frame):
        logging.info(f"handle_term(): Received signal {signum}.")
        global messages_to_delete
        try:
            self.mq_client.delete_messages(messages_to_delete)
        except:
            logging.exception("handle_term(): Failed to delete messages, exiting")
            raise
        finally:
            self.mq_client.close()
        
        sys.exit(0)


SUCCESS_EXIT_CODE = 0
FAILURE_EXIT_CODE = 1

if __name__ == '__main__':
    session_key = sys.stdin.read()
    if not session_key:
        logging.info("No session key received. Exiting")
        sys.exit(FAILURE_EXIT_CODE)

    service = None
    try:
        service = SCSAudit(session_key)
    except:
        logging.exception("Failed to construct SCS audit service, exiting")
        sys.exit(FAILURE_EXIT_CODE)

    exit_code = SUCCESS_EXIT_CODE
    try:
        service.process()
        exit_code = SUCCESS_EXIT_CODE
    except:
        logging.exception("Failed to process SCS audit events, exiting")
        exit_code = FAILURE_EXIT_CODE
    finally:
        service.close()

    sys.exit(exit_code)
