class AppInspectClientAuthenticationException(Exception):

    def __init__(self, message):
        super(AppInspectClientAuthenticationException, self).__init__(message)


class AppInspectValidationException(Exception):

    def __init__(self, message):
        super(AppInspectValidationException, self).__init__(message)


class AppInpsectStatusException(Exception):

    def __init__(self, message):
        super(AppInpsectStatusException, self).__init__(message)


class AppInpsectReportException(Exception):

    def __init__(self, message):
        super(AppInpsectReportException, self).__init__(message)

class AppInspectTimeOutException(Exception):

    def __init__(self, message):
        super(AppInspectTimeOutException, self).__init__(message)