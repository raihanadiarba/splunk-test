"""
(C) 2025 Splunk LLC All rights reserved.
"""

from mq.aws_client import AWSClient
from mq.azure_client import AzureClient
from mq.gcp_client import GCPClient


class Factory(object):
    def __init__(
        self,
        logger,
        cloud_provider,
        max_receive_number,
        wait_time_seconds,
        region,
        stack,
    ):
        self.logger = logger
        self.cloud_provider = cloud_provider
        self.max_receive_number = max_receive_number
        self.wait_time_seconds = wait_time_seconds
        self.region = region
        self.stack = stack

    def new_mq_client(self):
        """
        Build and return a new MQ client.
        Does not do any external network requests.
        """

        self.logger.info(f"new_mq_client(): Constructing MQ client. cloud_provider: {self.cloud_provider}")
        if self.cloud_provider == "aws":
            try:
                client = AWSClient(
                    logger=self.logger,
                    max_receive_number=self.max_receive_number,
                    wait_time_seconds=self.wait_time_seconds,
                    region=self.region,
                    stack=self.stack,
                )
                self.logger.info("new_mq_client(): Successfully constructed AWS MQ client")
                return client
            except:
                self.logger.exception("new_mq_client(): Error while constructing AWS MQ client")
                raise
        elif self.cloud_provider == "azure":
            try:
                client = AzureClient(
                    logger=self.logger,
                    max_receive_number=self.max_receive_number,
                    wait_time_seconds=self.wait_time_seconds,
                    region=self.region,
                    stack=self.stack,
                )
                self.logger.info("new_mq_client(): Successfully constructed Azure MQ client")
                return client
            except:
                self.logger.exception("new_mq_client(): Error while constructing Azure MQ client")
                raise
        elif self.cloud_provider == "gcp":
            try:
                client = GCPClient(
                    logger=self.logger,
                    max_receive_number=self.max_receive_number,
                    wait_time_seconds=self.wait_time_seconds,
                    region=self.region,
                    stack=self.stack,
                )
                self.logger.info("new_mq_client(): Successfully constructed GCP MQ client")
                return client
            except:
                self.logger.exception("new_mq_client(): Error while constructing GCP MQ client")
                raise
        else:
            self.logger.exception(f"new_mq_client(): Invalid cloud provider. cloud_provider: {self.cloud_provider}")
            raise InvalidCloudProviderException(self.cloud_provider)

class InvalidCloudProviderException(Exception):
    """
    Custom exception, raised when an invalid cloud provider is passed to Factory.
    """

    def __init__(self, cloud_provider):
        super().__init__(f"Invalid cloud provider: {cloud_provider}")
        self.cloud_provider = cloud_provider
