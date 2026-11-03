import sys
from http import HTTPStatus
from spacebridgeapp.util import py23
from spacebridgeapp.rest.util import errors as Errors
from typing import List, Dict



def extract_parameter(obj, key, source_name):
    """
    Validates that a value exists within a dictionary and is non-empty, then returns it. Throws a
    relevant error otherwise.
    """
    try:
        result = obj[key]
    except KeyError:
        raise Errors.SpacebridgeRestError('Error: Request requires %s parameter "%s"' % (source_name, key), 400)

    if (isinstance(result, str) or py23.py2_check_unicode(result)) and not result:
        error_message = 'Error: Request requires %s parameter "%s" to not be empty' % (source_name, key)
        raise Errors.SpacebridgeRestError(error_message, 400)
    return result


def extract_boolean(obj, key, source_name):
    """
    Validates that a value exists within a dictionary and is a string representing a boolean,
    then returns it. Throws a relevant error otherwise.
    """
    try:
        result = obj[key]
    except KeyError:
        raise Errors.SpacebridgeRestError('Error: Request requires %s parameter "%s"' % (source_name, key), 400)

    if result == 'true' or result is True:
        return True
    if result == 'false' or result is False:
        return False

    error_message = 'Error: Request requires %s parameter "%s" to be a boolean literal ("true" or "false")' % \
                    (source_name, key)

    if not isinstance(result, str) and not py23.py2_check_unicode(result):
        raise Errors.SpacebridgeRestError(error_message, 400)

    if not result:
        error_message = 'Error: Request requires %s parameter "%s" to not be empty' % (source_name, key)
        raise Errors.SpacebridgeRestError(error_message, 400)

    raise Errors.SpacebridgeRestError(error_message, 400)


def camel_case(str):
    if str.isupper():
        return str
    joined = str.replace(" ", "")
    return joined[0].lower() + joined[1:]



def enforce_required_parameters(required_keys: List[str], params: Dict[str, str]) -> None :
    """ Checks if every key exists in params and raises an exception if any required keys are missing """
    missing_parameters = [key for key in required_keys if key not in params]

    if missing_parameters:
        raise Errors.SsgHttpError(message=f'required parameters were missed={missing_parameters}', status=HTTPStatus.BAD_REQUEST)


        
    


