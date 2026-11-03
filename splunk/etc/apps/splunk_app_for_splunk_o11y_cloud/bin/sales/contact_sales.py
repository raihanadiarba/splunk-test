import logging
import re
import requests
import json
from splunk.persistconn.application import PersistentServerConnectionApplication

CONTACT_SALES_URL = 'https://www.splunk.com/api/bin/lead/form'
ERROR_INVALID_PAYLOAD = 'Invalid payload'
ERROR_FIRST_NAME_REQUIRED = 'First Name is required'
ERROR_LAST_NAME_REQUIRED = 'Last Name is required'
ERROR_EMAIL_REQUIRED = 'A valid email is required'
ERROR_COMMENTS_REQUIRED = 'Comments are required'
MAX_EMAIL_LENGTH = 254
EMAIL_PATTERN = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')


def validate(request):
    errors = []

    if not request.get('firstName'):
        errors.append(ERROR_FIRST_NAME_REQUIRED)

    if not request.get('lastName'):
        errors.append(ERROR_LAST_NAME_REQUIRED)

    email = request.get('email')
    if (
        not isinstance(email, str)
        or len(email) > MAX_EMAIL_LENGTH
        or not EMAIL_PATTERN.fullmatch(email)
    ):
        errors.append(ERROR_EMAIL_REQUIRED)

    if not request.get('comment'):
        errors.append(ERROR_COMMENTS_REQUIRED)

    return errors


def send_request_to_sales(sales_request):
    headers = {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'referer': 'splunk_app_for_splunk_o11y_cloud'
    }
    data = {
        'FirstName': sales_request.get('firstName'),
        'lastName': sales_request.get('lastName'),
        'EmailAddress': sales_request.get('email'),
        'question': sales_request.get('comment'),
        # The properties below might not be required
        'expertCode': 'sales',
        'emailSendType': 'HTML',
    }

    return requests.post(url=CONTACT_SALES_URL, data=data, headers=headers, allow_redirects=False)


class ContactSales(PersistentServerConnectionApplication):
    def __init__(self, _command_line, _command_arg):
        super(PersistentServerConnectionApplication, self).__init__()
        logging.basicConfig(level=logging.DEBUG)

    def handle(self, in_string):
        raw_payload = json.loads(in_string.decode('utf-8')).get('payload', '{}')
        payload = json.loads(raw_payload)

        errors = validate(payload)

        if len(errors) > 0:
            logging.info('Error validating request to sales: ' + str(errors))
            return {'status': 400, 'payload': {'errors': errors}}
        else:
            result = send_request_to_sales(payload)
        if result.status_code == 200:
            logging.info('Successfully sent request to sales.')
            return {'status': 200, 'payload': {'message': 'message sent to sales'}}
        else:
            logging.error('Error when sending request to sales: ' + str(result))
            return {'status': 500, 'payload': {'errors': ['An error occurred when sending message to sales.']}}

    def handleStream(self, handle, in_string):
        raise NotImplementedError("PersistentServerConnectionApplication.handleStream")

    def done(self):
        pass
