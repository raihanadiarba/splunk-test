import json

import splunk.Intersplunk
from splunk.rest import simpleRequest

ENDPOINT = "/services/data/lookup_edit/lookup_daily_data?output_mode=json"


def main():
    _, _, settings = splunk.Intersplunk.getOrganizedResults()
    _, data = simpleRequest(
        ENDPOINT,
        method="POST",
        sessionKey=settings.get("sessionKey"),
    )
    splunk.Intersplunk.outputResults(json.loads(data))


if __name__ == "__main__":
    main()
