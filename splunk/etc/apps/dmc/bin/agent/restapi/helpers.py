# pylint: disable=missing-docstring
# pylint: disable=invalid-name
# pylint: disable=no-init
# pylint: disable=no-self-use
# pylint: disable=attribute-defined-outside-init
# pylint: disable=too-few-public-methods

"""
Helper functions to make an endpoint EAI like
"""
from functools import wraps

import logging

from contextlib import contextmanager
from bottle import request, HTTPError

import agent
from agent import SchemaValidationException
from agent.common.json_schema import validate_schema

DEPLOY_ERROR_REASON_IN_PROGRESS = " while a deployment task is still in progress."
DEPLOY_ERROR_REASON_FAILED = " because the previous deployment task has failed."

DEPLOY_ERROR_ACTION_CHECK_STATUS = " Check the status of the deployment task " \
                                   "by clicking Last Deployment Status."

DEPLOY_ERROR_REASON_LOCKED = " while deployment operations are locked."
DEPLOY_ERROR_ACTION_FOR_LOCKED = " This might happen during maintenance windows. " \
                                 "If this situation is unexpected or goes on for too long, contact Splunk Support."

EXTERNAL_APPS_DISCOVERY_REASON_FAILED = " because the previous external apps discovery task has failed."
EXTERNAL_APPS_DISCOVERY_FAILED_ACTION = " This might happen during maintenance windows. Contact Splunk Support."

_logger = logging.getLogger(__name__)


def verify_existence(endpoint, name):
    """
    Verify existence by calling 'exists' method on an endpoint instance.
    """
    if not endpoint.exists(name):
        err_msg = "'%s' does not exist." % name
        _logger.warning(err_msg)
        raise HTTPError(404, err_msg)


def verify_not_exist(endpoint, name):
    """
    Verify not exist by calling 'exists' method on an endpoint instance.
    """
    if endpoint.exists(name):
        err_msg = "'%s' already exists." % name
        _logger.warning(err_msg)
        raise HTTPError(409, err_msg)


def verify_not_external(endpoint, name):
    """
    Verify this app is not external.
    """
    if endpoint.external(name):
        err_msg = "Operation not permitted on external app '%s'" % name
        _logger.warning(err_msg)
        raise HTTPError(403, err_msg)


def must_exist(http_method):
    """
    The entity identified by "name" parameter must exist.
    Otherwise, the API will fail with http error 404.
    Used by an endpoint class, which must contain 'exists' method.
    :param http_method:
    :return:
    """
    @wraps(http_method)
    def decorate(*args, **kwargs):
        name = kwargs["name"]
        endpoint = args[0]
        verify_existence(endpoint, name)
        # It is possible for the entity to be deleted
        # concurrently after the above existence check.
        # Handle not found exception so that http 404
        # is returned.
        try:
            return http_method(*args, **kwargs)
        except agent.NotFoundException as exp:
            _logger.warning(exp)
            raise HTTPError(404, str(exp))

    return decorate


def must_not_exist(http_method):
    """
    If name is provided, the entity identified by "name" parameter must not exist.
    Otherwise, the API will fail with http error 409.
    Used by an endpoint class, which must contain 'exists' method.
    :param http_method:
    :return:
    """
    @wraps(http_method)
    def decorate(*args, **kwargs):  # pylint: disable=inconsistent-return-statements
        properties = request.json

        # name will be auto generated
        if not properties or "name" not in properties:  # pylint: disable=unsupported-membership-test
            return

        name = request.json["name"]  # pylint: disable=unsubscriptable-object
        endpoint = args[0]
        verify_not_exist(endpoint, name)
        # It is possible for the entity to be created
        # concurrently after the above existence check.
        # Handle uniqueness exception so that http 404
        # is returned.
        try:
            return http_method(*args, **kwargs)
        except agent.UniqueItemException as exp:
            _logger.warning(exp)
            raise HTTPError(409, str(exp))

    return decorate


def reject_external(http_method):
    """
    The entity identified by "name" parameter must not be an external app.
    Otherwise, the API will fail with http error 403.
    Used by an endpoint class, which must contain 'external' method.
    :param http_method:
    :return:
    """
    @wraps(http_method)
    def decorate(*args, **kwargs):
        name = kwargs["name"]
        endpoint = args[0]
        verify_not_external(endpoint, name)
        return http_method(*args, **kwargs)
    return decorate


def not_accept_name_in_body(http_method):
    """
    The entity in request body should not contain "name" property.
    Otherwise, the API will fail with http error 400.
    :param http_method:
    :return:
    """
    @wraps(http_method)
    def decorate(*args, **kwargs):
        if "name" in request.json:  # pylint: disable=unsupported-membership-test
            err_msg = "Cannot set 'name'."
            _logger.warning(err_msg)
            raise HTTPError(400, err_msg)
        return http_method(*args, **kwargs)
    return decorate


def not_accept_without_name_in_body(http_method):
    """
    The entity in request body should contain "name" property.
    Otherwise, the API will fail with http error 400.
    :param http_method:
    :return:
    """
    @wraps(http_method)
    def decorate(*args, **kwargs):
        if "name" not in request.json \
           or not request.json["name"].strip():  # pylint: disable=unsupported-membership-test, unsubscriptable-object
            err_msg = "'name' is expected."
            _logger.warning(err_msg)
            raise HTTPError(400, err_msg)
        return http_method(*args, **kwargs)
    return decorate


def json_validate_request(schema=None):
    """Validate json request
    """
    def decorator(http_method):
        """Decorator implementation
        """
        @wraps(http_method)
        def decorate(*args, **kwargs):
            if request.method == "POST":
                if "application/json" not in request.content_type:
                    raise HTTPError(400, "\"Content-Type: application/json\" is expected")
                if schema:
                    try:
                        json = request.json
                    except ValueError as ex:
                        raise HTTPError(400, str(ex))
                    try:
                        validate_schema(json, schema)
                    except SchemaValidationException as ex:
                        raise HTTPError(400, str(ex))
            return http_method(*args, **kwargs)
        return decorate
    return decorator


@contextmanager
def deployment_scope(deploy_service, external_apps_service, error_message_prefix=None):
    """Scope for single step API that deploys changes immediately
    """
    with deploy_service.lock.get_runtime_scope() as granted:
        if not granted:
            if error_message_prefix:  # pylint: disable=no-else-raise
                raise HTTPError(400,
                                error_message_prefix +
                                DEPLOY_ERROR_REASON_IN_PROGRESS +
                                DEPLOY_ERROR_ACTION_CHECK_STATUS)
            else:
                raise agent.ApiErrorException("Deploy_InProgress")

        if deploy_service.lock.is_locked():
            if error_message_prefix:  # pylint: disable=no-else-raise
                raise HTTPError(400,
                                error_message_prefix +
                                DEPLOY_ERROR_REASON_LOCKED +
                                DEPLOY_ERROR_ACTION_FOR_LOCKED)
            else:
                raise agent.ApiErrorException("Deploy_Locked")

        if deploy_service.last_deploy_state() == "failed":
            if error_message_prefix:  # pylint: disable=no-else-raise
                raise HTTPError(400,
                                error_message_prefix +
                                DEPLOY_ERROR_REASON_FAILED +
                                DEPLOY_ERROR_ACTION_CHECK_STATUS)
            else:
                raise agent.ApiErrorException("Deploy_Failed")

        last_discovery_error = external_apps_service.last_discovery_error()
        if last_discovery_error:
            if error_message_prefix:  # pylint: disable=no-else-raise
                raise HTTPError(400,
                                error_message_prefix +
                                EXTERNAL_APPS_DISCOVERY_REASON_FAILED +
                                " (%s)" % last_discovery_error +
                                EXTERNAL_APPS_DISCOVERY_FAILED_ACTION)
            else:
                raise agent.ApiErrorException("ExternalAppsDiscovery_Failed",
                                              dict(error=last_discovery_error))

        yield
