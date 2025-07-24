
class BaseAppException(Exception):
    """Base exception for application-specific errors."""
    pass


class ActorServiceError(BaseAppException):
    """Exception raised by ActorService operations."""
    pass


class ConfigurationError(BaseAppException):
    """Exception raised for configuration-related errors."""
    pass