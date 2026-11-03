import splunk.rest as rest
import sys
import json
import logging
import logging.handlers  
 
def main():
    # set up logger to send message to stderr so it will end up in splunkd.log
    sh = logging.StreamHandler()
    # the following line is to make sure the log event looks the same as any
    # other splunkd.log
    sh.setFormatter(logging.Formatter("%(levelname)s %(message)s"))
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    logger.addHandler(sh)
    
    if len(sys.argv) > 1 and sys.argv[1] == "--execute":
        payload = json.loads(sys.stdin.read())
        session_key = payload.get('session_key')

        parameters = {}
        parameters['namespace'] = payload.get('app')
        parameters['owner'] = payload.get('owner')
        parameters['input-dashboard'] = payload.get('search_name').replace('_ScheduledView___SnapshotView__', '')
        parameters['save-snapshot'] = True

        try:
            response, content = rest.simpleRequest("pdfgen/render", sessionKey = session_key, postargs = parameters, timeout = 3600)
            
            if response['status']!='200':
                logger.error("Failed to create Studio snapshot (status = %s): %s" % (repr(response['status']), repr(content)))
        except Exception as e:
            logger.error("Failed to create Studio snapshot (Exception type=%s): %s" % (repr(type(e)), repr(e)))
    
if __name__ == "__main__":
    main()