from http import HTTPStatus


class SplunkHomeNotSetError(Exception):
    pass


class ResponseSafeToPrintException(Exception):
    def __init__(self, message: str, status: HTTPStatus):
        super().__init__(message)
        self.status = status


class WrongManifestsError(Exception):
    pass


class ConfigurationError(ResponseSafeToPrintException):
    def __init__(self, message: str):
        super().__init__(f"Configuration error: {message}", HTTPStatus.BAD_REQUEST)


class InvalidDownloaderConfigError(ConfigurationError):
    pass


class ImportNotFoundException(Exception):
    pass


class RemoteDownloaderException(ResponseSafeToPrintException):
    def __init__(self, message: str):
        super().__init__(f"Downloader error: {message}", HTTPStatus.INTERNAL_SERVER_ERROR)


class NoNextPeerForUpgradeException(Exception):
    pass


class ProxyNotFoundException(Exception):
    pass


class PackageExtractorException(Exception):
    pass


class UpgraderException(Exception):
    pass


class UndefinedEnvVariableException(Exception):
    pass


class NoUpgradeRecordFound(Exception):
    pass


class NoManifest(Exception):
    pass


class WrongManifestFormat(Exception):
    pass


class UnsupportedPackageExtension(Exception):
    pass


class WrongVersionFormat(Exception):
    pass


class BadSearchFactor(ResponseSafeToPrintException):
    def __init__(self, message: str):
        super().__init__(message, HTTPStatus.SERVICE_UNAVAILABLE)


class InvalidEndpointParameter(ResponseSafeToPrintException):
    def __init__(self, message: str):
        super().__init__(message, HTTPStatus.BAD_REQUEST)


class InvalidPackageChecksum(ResponseSafeToPrintException):
    def __init__(self, message: str):
        super().__init__(message, HTTPStatus.BAD_REQUEST)


class UpgradeToHigherVersionThanCM(ResponseSafeToPrintException):
    def __init__(self, message: str):
        super().__init__(message, HTTPStatus.FORBIDDEN)


class PermissionError(ResponseSafeToPrintException):
    def __init__(self, message: str):
        super().__init__(f"Permission error: {message}", HTTPStatus.UNAUTHORIZED)
