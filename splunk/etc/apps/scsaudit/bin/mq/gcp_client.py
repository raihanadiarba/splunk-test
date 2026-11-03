"""
(C) 2025 Splunk LLC All rights reserved.
"""

import google.auth
from google.cloud import pubsub


class MessageWrapper:
    """
    A class for wrapping messages, which are received from client.pull().
    It's needed because we cannot add custom fields to original messages,
    as we do for AWS and Azure.
    """
    def __init__(
        self,
        message_id,
        audit_payload,
        audit_delivery_count,
        original_message,
    ):
        self.message_id = message_id
        self.audit_payload = audit_payload
        self.audit_delivery_count = audit_delivery_count
        self.original_message = original_message

class GCPClient(object):
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

        self.subscription_name = f"audit-{stack}-{region}"

        try:
            self.client = pubsub.SubscriberClient()
        except:
            self.logger.exception("__init(): Error while constructing Google PubSub client")
            raise

    def initialize(self):
        """
        Initialize a client. Needs to be called before any other method.
        Does external network requests, as opposed to __init__.
        """

        self.logger.info(f"initialize(): Initializing Google PubSub client. subscription_name: {self.subscription_name}")

        try:
            self.project_id = self.get_project_id()
        except:
            self.logger.exception("__init(): Error while getting Google project ID")
            raise

        try:
            self.subscription_path = self.client.subscription_path(self.project_id, self.subscription_name)
        except:
            self.logger.exception("__init(): Error while getting Google PubSub subscription path")
            raise

    def close(self):
        """
        Close a client. Needs to be called after all other methods.
        """

        self.logger.info("close(): Closing client")
        self.client.close()

    def receive_messages(self):
        """
        Receive a batch of messages in a single request from a Google PubSub subscription.
        And registers a lock renewer for each message.

        :return: The list of Message objects received.
        """

        self.logger.info(
            f"receive_messages(): Start receiving. subscription_name: {self.subscription_name}, max_number: {self.max_receive_number}, wait_time: {self.wait_time_seconds}")
        try:
            pull_response = self.client.pull(
                request={
                    "subscription": self.subscription_path,
                    "max_messages": self.max_receive_number,
                },
                timeout=self.wait_time_seconds,
            )
            received_messages = pull_response.received_messages
            wrapped_messages = []
            for message in received_messages:
                # Set audit_payload and audit_delivery_count fields to provide a vendor-agnostic message interface.
                # In case of GCP SDK, we cannot add custom fields to a received original message, so we wrap it here.
                wrapped_messages.append(MessageWrapper(
                    message_id=message.message.message_id,
                    audit_payload=str(message.message.data, "utf-8"),
                    audit_delivery_count=message.delivery_attempt,
                    original_message=message,
                ))
            self.logger.info(f"receive_messages(): Successfully received {len(wrapped_messages)} messages")
        except:
            self.logger.exception("receive_messages(): Couldn't receive messages from subscription: %s", self.subscription_name)
            raise

        return wrapped_messages

    def delete_messages(self, wrapped_messages):
        """
        Delete a batch of messages from a subscription.
        Acknowledges messages.

        :param wrapped_messages: The list of wrapped messages to delete.
        """

        if wrapped_messages is None or len(wrapped_messages) == 0:
            return None

        self.logger.info(f"delete_messages(): Starting deleting {len(wrapped_messages)} messages")

        try:
            ack_ids = [wrapped_message.original_message.ack_id for wrapped_message in wrapped_messages]
            self.client.acknowledge(
                request={
                    "subscription": self.subscription_path,
                    "ack_ids": ack_ids,
                }
            )
            self.logger.info("delete_messages(): Successfully deleted messages")
        except:
            self.logger.exception(f"delete_messages(): Failed to delete messages")
            raise

    def get_project_id(self):
        """
        Gets current GCP project ID.
        May communicate over local network with GCP.

        :return: The project ID
        """

        try:
            project_id = google.auth.default()[1]
            if not project_id or not project_id.strip():
                self.logger.exception("get_project_id(): Got an empty Google project ID from current environment")
                raise
            return project_id
        except:
            self.logger.exception("get_project_id(): Error while getting Google project ID from current environment")
            raise
