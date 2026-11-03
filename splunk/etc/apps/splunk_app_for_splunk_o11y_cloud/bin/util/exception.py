class OperationException(Exception):
    """
    Represents an unexpected error during execution.
    Use this to wrap exceptions and provide a general failure message.
    This helps avoid exposing error details not intended for consumers.

    Exception handlers will return a http 500 status code with the provided message,
    and log the specific cause of the exception.
    """
    pass


class ConfigurationException(Exception):
    """
    Represents an error occurring due to an invalid configuration.
    Use this to identify problems a user needs to fix.

    Exception handlers will return a http 400 status code with the provided message.
    """
    pass
