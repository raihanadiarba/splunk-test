"""
App Exceptions
"""


class ServerException(Exception):

    """Base application exception
    """

    def __init__(self, *args, **kwargs):
        super(ServerException, self).__init__(*args)
        errors = kwargs.get("errors", tuple())
        if isinstance(errors, Exception):
            errors = (errors,)
        self._errors = errors
        self._fmt = kwargs.get("fmt")
        self._build_message()

    def __str__(self):
        return self._message

    def _build_message(self):
        """Build message
        """
        fmt = self._fmt or self._default_fmt()
        message = (fmt % self.args) \
            if self.args != () else fmt
        for error in self._errors:
            message += " " + str(error)
        self._message = message

    def _default_fmt(self):
        """Default message
        """
        assert self
        return "Unexpected exception."


class NotFoundException(ServerException):

    """Item not found exception
    """

    def _default_fmt(self):
        return "Item '%s' not found."


class FieldNotFoundException(ServerException):

    """Field not found exception
    """

    def _default_fmt(self):
        return "Field '%s' not found."


class UniqueItemException(ServerException):

    """Unique Item exception
    """

    def _default_fmt(self):
        return "Item with %s '%s' already exists."


class SchemaValidationException(ServerException):

    """Schema Validation Exception
    """

    def _default_fmt(self):
        return "Could not find expected value '%s'."


class InvalidJsonRequestException(ServerException):
    """
     Invalid call to .json
    """

    def _default_fmt(self):
        return "Invalid json request"


class UserContextMissingException(ServerException):
    """User context is missing
    """
    def _default_fmt(self):
        return "User context is not set."


class UserContextInvalidException(ServerException):
    """Supplied user context is not valid
    """
    def _default_fmt(self):
        return "Supplied user context is not valid"


class WorkflowException(ServerException):
    """Workflow exception
    """
    def _default_fmt(self):
        return "Exception executing workflow"


class InvalidUserInputException(ServerException):
    """Invalid user input exception
    """
    def _default_fmt(self):
        return "Invalid user input."


class ApiErrorException(ServerException):
    """
    API error exception
    :param type: type of the error
    :param payload: dictionary of parameters. None will be replaced by an empty dictionary.
    """
    def __init__(self, error_type, payload=None):
        super(ApiErrorException, self).__init__()
        self.type = error_type
        if payload is None:
            self.payload = {}
        else:
            self.payload = payload
        assert isinstance(self.payload, dict)

    def __str__(self):
        message = self.type
        if "message" in self.payload:
            message += ": {}".format(self.payload["message"])
        return message
