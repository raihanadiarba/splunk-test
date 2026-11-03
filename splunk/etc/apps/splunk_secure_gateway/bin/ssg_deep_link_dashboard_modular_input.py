# Suppress warnings to pass AppInspect when calling --scheme
import logging
import warnings

from spacebridgeapp.util import py23
py23.setup_environment_for_modular_input()
warnings.filterwarnings('ignore', '.*service_identity.*', UserWarning)

from cloudgateway.private.exceptions.registration_exceptions import RegistrationError, RegistrationTimeout
from spacebridgeapp.util.base_modular_input import BaseModularInput
from spacebridgeapp.exceptions.spacebridge_exceptions import SpacebridgeError
from spacebridgeapp.exceptions.splunk_api_exceptions import HTTPException
from spacebridgeapp.rest.services.kvstore_service import KVStoreCollectionAccessObject
from spacebridgeapp.rest.registration.registration_v2 import handle_registration_v2
from spacebridgeapp.util.constants import STATUS, KEY, RUNNING, FAILED, DEEPLINK_DASHBOARD_COLLECTION_NAME, \
    USER, AUTH_CODE, AUTH_METHOD, COMPLETED, REGISTRATION_EXPIRY, EXPIRED, REGISTRATION_TIMESTAMP
from spacebridgeapp.util.config import load_config
from http import HTTPStatus
import json
import time


def _get_deep_link_jobs(log: logging.Logger, kvstore_client: KVStoreCollectionAccessObject):
    response, data = kvstore_client.get_all_items(sort=REGISTRATION_TIMESTAMP)

    if response.status != HTTPStatus.OK:
        log.error(f"Deep Link Dashboard Modular Input failed to fetch jobs from KVStore, response={response.status}")
        raise HTTPException(message="Error fetching from Deeplink KVStore collection", status=response.status)

    return json.loads(data)


def run_registration_job(log: logging.Logger,
                         job: dict,
                         session_token: str,
                         kvstore_client: KVStoreCollectionAccessObject):
    # Fetch all fields
    key = job.get(KEY)
    status = job.get(STATUS)
    user = job.get(USER)
    job_expiry = job.get(REGISTRATION_EXPIRY)
    auth_code = job.get(AUTH_CODE)
    auth_method = job.get(AUTH_METHOD)

    # If the job has outlived it's TTL or has any missing params update it's status to failed
    if None in (key, status, user, job_expiry, auth_code, auth_method):
        job[STATUS] = FAILED
        log.error(f"Deep Link Registration error for key={key}, setting status to status={job[STATUS]}")
    elif time.time() > job_expiry:
        job[STATUS] = EXPIRED
        log.info(f"Deep Link Registration has expired for key={key}, setting status={job[STATUS]}")
    elif status == RUNNING:
        try:
            # Attempt to complete registration handshake
            log.debug(f"Dashboard Deeplink attempting to complete registration for "
                         f"key={key}, user={user}, auth_code={auth_code}, expires_at:{job_expiry}")
            config = load_config(session_token)
            response = handle_registration_v2(log,
                                              config,
                                              auth_code=auth_code,
                                              auth_method=auth_method,
                                              user=user,
                                              session_token=session_token,
                                              system_authtoken=session_token)

            if response[STATUS] == HTTPStatus.OK:
                job[STATUS] = COMPLETED
                log.info(
                    f"deep_link_modular_input registration successful for key={key}, setting status={job[STATUS]}")

        except (RegistrationError, RegistrationTimeout, SpacebridgeError) as e:
            log.error(f"Deep Link Registration completion failed for user={user}, key={key}, error={str(e)}")

    # If job status changes due to failure, TTL expiration or successful completion clean up the job
    if job[STATUS] != RUNNING:
        result = clean_up_job(log, job, kvstore_client)
        if result:
            log.info(f"Clean up successful for job with key={key}, user={user}, status={job[STATUS]}")
            return [key, job[STATUS]]

    return None


def clean_up_job(log: logging.Logger,
                 job: dict,
                 kvstore_client: KVStoreCollectionAccessObject) -> bool:
    try:
        key = job.get(KEY)
        if not key:
            raise ValueError("Cannot clean up job missing key.")

        query = {KEY: key}
        delete_response, _ = kvstore_client.delete_items_by_query(query)

        if delete_response.status != HTTPStatus.OK:
            log.error(f"Failed to delete key from kvstore during Deep Link clean up, "
                         f"key={key}, user={job.get(USER)}, kvstore_response={delete_response.status}")
            return False

        return True

    except Exception as e:
        log.error(f"Deep Link Dashboard clean up failed, error={e}")
        return False


def handle_deep_link_registrations(log: logging.Logger, session_token: str):
    try:
        kvstore_client = KVStoreCollectionAccessObject(collection=DEEPLINK_DASHBOARD_COLLECTION_NAME,
                                                       session_key=session_token)
        jobs = _get_deep_link_jobs(log, kvstore_client)

        if not jobs:
            log.debug("Deep Link Dashboard Modular Input found no running jobs, ending early.")
            return []

        # jobs are returned in sorted order based off their created at timestamp
        # stale or unused jobs will live longer since they won't ever complete until their TTL so process in reverse
        job_results = [run_registration_job(log, job, session_token, kvstore_client) for job in reversed(jobs)]

        return job_results
    except HTTPException as e:
        log.warn(f"Deep Link Dashboard failed with HTTP error={e}")
    except Exception as e:
        log.error(f"Deep Link Dashboard failed handling registrations with error={str(e)}")
        return []


class DeepLinkDashboardModularInput(BaseModularInput):
    title = 'Deep Link Dashboard Modular Input'
    description = 'Initializes the Deep Link Dashboard Modular Input to complete registrations'
    app = 'Splunk Secure Gateway'
    name = 'splunk_secure_gateway'
    use_kvstore_checkpointer = False
    use_hec_event_writer = False
    log_mod_input_name = "ssg_deep_link_dashboard_modular_input.app"
    log_filename = "ssg_deep_link_dashboard_modular_input.log"
    run_on_captain_only = True

    def do_run(self, input_config):
        if not super(DeepLinkDashboardModularInput, self).do_run(input_config):
            return

        logger = self.logger

        logger.info('Enable deep_link_dashboard_modular_input')
        results = handle_deep_link_registrations(logger, session_token=self.session_key)

        if results:
            logger.info(f"Deep Link Modular Input Completed with responses={results}")


if __name__ == "__main__":
    worker = DeepLinkDashboardModularInput()
    worker.execute()
