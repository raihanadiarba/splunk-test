"""
(C) 2025 Splunk LLC All rights reserved.
"""

import boto3
import botocore.exceptions


class AWSClient(object):
    def __init__(
        self,
        logger,
        max_receive_number,
        wait_time_seconds,
        region,
        stack,
    ):
        """
        Does not do any external network requests. They should be done in `initialize`.

        :param logger: Logger.
        :param max_receive_number: Maximum number of messages to receive in one request.
        :param wait_time_seconds: Maximum time to wait in seconds for the first message to arrive.
        :param region: Current region name.
        :param stack: Current EC stack name.
        """

        self.logger = logger
        self.max_receive_number = max_receive_number
        self.wait_time_seconds = wait_time_seconds
        self.region = region
        self.stack = stack

        self.sqs_resource = None
        self.queue_client = None

        self.sqs_endpoint_url = f"https://sqs.{self.region}.amazonaws.com"
        self.logger.info(f"init(): sqs_endpoint_url: {self.sqs_endpoint_url}")

        try:
            self.sqs_resource = boto3.resource(
                'sqs',
                region_name=self.region,
                endpoint_url=self.sqs_endpoint_url)
        except:
            self.logger.exception("init(): Failed to initialize SQS boto3 resource.")
            raise

        # Construct the queue name from stack name and region
        # queue name: audit-<stack>-<region>
        self.queue_name = f"audit-{self.stack}-{self.region}"

    def initialize(self):
        """
        Initialize a client. Needs to be called before any other method.
        Does external network requests, as opposed to __init__.
        """

        self.logger.info(f"initialize(): Getting queue client for {self.queue_name}")
        try:
            self.queue_client = self.sqs_resource.get_queue_by_name(QueueName=self.queue_name)
            self.logger.info(
                f"initialize(): Successfully got client for {self.queue_name} queue with URL={self.queue_client.url}")
        except:
            self.logger.exception("initialize(): Failed to get client for queue %s.", self.queue_name)
            raise

    def close(self):
        """
        Close a client. Needs to be called after all other methods.
        Intentionally empty. Left for interface uniformity.
        """

        self.logger.info("close(): Closing client")

    def receive_messages(self):
        """
        Receive a batch of messages in a single request from an SQS queue.

        :return: The list of Message objects received. These each contain the body
                 of the message and metadata and custom attributes.
        """

        self.logger.info(
            f"receive_messages(): Start receiving. queue: {self.queue_client}, max_number: {self.max_receive_number}, wait_time: {self.wait_time_seconds}")
        try:
            messages = self.queue_client.receive_messages(
                AttributeNames=['All'],
                MaxNumberOfMessages=self.max_receive_number,
                WaitTimeSeconds=self.wait_time_seconds
            )
            for message in messages:
                # Set audit_payload and audit_delivery_count fields to provide a vendor-agnostic message interface.
                message.audit_payload = message.body.encode('utf-8')
                message.audit_delivery_count = int(message.attributes.get('ApproximateReceiveCount'))

            self.logger.info(f"receive_messages(): Successfully received {len(messages)} messages")
        except botocore.exceptions.ClientError:
            self.logger.exception("receive_messages(): Couldn't receive messages from queue: %s", self.queue_client)
            raise
        except:
            self.logger.exception("receive_messages(): Couldn't receive messages from queue: %s", self.queue_client)
            raise

        return messages

    def delete_messages(self, messages):
        """
        Delete a batch of messages from an SQS queue in a single request.

        :param messages: The list of messages to delete.
        """

        if messages is None or len(messages) == 0:
            return None

        self.logger.info(f"delete_messages(): Starting deleting {len(messages)} messages")
        try:
            entries = [{
                'Id': str(ind),
                'ReceiptHandle': msg.receipt_handle
            } for ind, msg in enumerate(messages)]
            response = self.queue_client.delete_messages(Entries=entries)
            if 'Failed' in response:
                for msg_meta in response['Failed']:
                    self.logger.error(
                        f"delete_messages(): Failed to delete message: {messages[int(msg_meta['Id'])].receipt_handle}"
                    )
            self.logger.info("delete_messages(): Successfully deleted messages")
        except:
            self.logger.exception("delete_messages(): Error encountered while deleting messages from queue")
            raise
