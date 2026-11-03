"""
(C) 2025 Splunk LLC All rights reserved.
"""

from azure.servicebus import AutoLockRenewer, ServiceBusClient
from azure.identity import DefaultAzureCredential

class AzureClient(object):
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

        self.fully_qualified_namespace = f"audit-{stack}-{region}.servicebus.windows.net"
        self.queue_name = f"audit-{stack}-{region}"

        try:
            self.azure_credential = DefaultAzureCredential()
        except:
            self.logger.exception("__init__(): Error while constructing default Azure credential")
            raise

        try:
            self.auto_lock_renewer = AutoLockRenewer(max_workers=16)
        except:
            self.logger.exception("__init__(): Error while constructing Azure auto lock renewer")
            raise


    def initialize(self):
        """
        Initialize a client. Needs to be called before any other method.
        Does external network requests, as opposed to __init__.
        """

        self.logger.info(f"initialize(): Constructing and entering Service Bus client. queue_name: {self.queue_name}")
        try:
            self.client = ServiceBusClient(self.fully_qualified_namespace, self.azure_credential)
            self.client.__enter__()
            self.logger.info(
                f"initialize(): Successfully constructed and entered Service Bus client. queue_name: {self.queue_name}")
        except:
            self.logger.exception(
                f"initialize(): Error while constructing and entering Azure Service Bus client. queue_name: {self.queue_name}")
            raise

        self.logger.info(
            f"initialize(): Getting and entering Service Bus queue receiver. queue_name: {self.queue_name}")
        try:
            self.receiver = self.client.get_queue_receiver(queue_name=self.queue_name)
            self.receiver.__enter__()
            self.logger.info(
                f"initialize(): Successfully got and entered Service Bus queue receiver. queue_name: {self.queue_name}")
        except:
            self.logger.exception(
                f"initialize(): Error while getting and entering Service Bus queue receiver. Exiting and closing client. queue_name: {self.queue_name}")
            self.client.__exit__()
            self.client.close()
            raise

    def close(self):
        """
        Close a client. Needs to be called after all other methods.
        """

        self.logger.info("close(): Closing client, exiting receiver and client and closing client")
        self.receiver.__exit__()
        self.client.__exit__()
        self.client.close()

    def receive_messages(self):
        """
        Receive a batch of messages in a single request from an Azure Service Bus queue.
        And registers a lock renewer for each message.

        :return: The list of Message objects received.
        """

        self.logger.info(
            f"receive_messages(): Start receiving. queue: {self.queue_name}, max_number: {self.max_receive_number}, wait_time: {self.wait_time_seconds}")
        try:
            received_messages = self.receiver.receive_messages(
                max_message_count=self.max_receive_number,
                max_wait_time=self.wait_time_seconds)
            for message in received_messages:
                self.auto_lock_renewer.register(
                    receiver=self.receiver,
                    renewable=message,
                    max_lock_renewal_duration=120)
                # Set audit_payload and audit_delivery_count fields to provide a vendor-agnostic message interface.
                message.audit_payload = str(next(message.body), "utf-8")
                message.audit_delivery_count = message.delivery_count
            self.logger.info(f"receive_messages(): Successfully received {len(received_messages)} messages")
        except:
            self.logger.exception("receive_messages(): Couldn't receive messages from queue: %s", self.queue_name)
            raise

        return received_messages

    def delete_messages(self, messages):
        """
        Delete a batch of messages from a queue.
        Marks each message as completed.

        :param messages: The list of messages to delete.
        """

        if messages is None or len(messages) == 0:
            return None

        self.logger.info(f"delete_messages(): Starting deleting {len(messages)} messages")
        try:
            for message in messages:
                self.receiver.complete_message(message)
            self.logger.info("delete_messages(): Successfully deleted messages")
        except:
            self.logger.exception(f"delete_messages(): Failed to delete messages")
            raise
