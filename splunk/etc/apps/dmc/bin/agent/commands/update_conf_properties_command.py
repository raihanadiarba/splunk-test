"""
Update conf properties
"""
from agent.commands import DMCRestCommandBase


class UpdateConfProperties(DMCRestCommandBase):
    """
    Update conf properties
    """

    REST_URL = "/servicesNS/nobody/{0}/configs/conf-{1}/{2}"
    MESSAGES = {"True": "Configuration property updated",
                "False": "Failed to update configuration property"}

    def execute_rest(self, command, service):
        params = command.get_value("payload")

        assert "conf" in params
        assert "stanza" in params
        assert "data" in params

        app = params.get("app", "-")
        conf = params["conf"]
        stanza = params["stanza"]
        data = params["data"]
        url = self.REST_URL.format(app, conf, stanza)
        return self.post(service, data, url)
