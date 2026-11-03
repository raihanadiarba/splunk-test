import json
from typing import Dict
from spacebridgeapp.data.base import SpacebridgeAppBase
from spacebridgeapp.reports.report_helper import ParsedReportId
from splapp_protocol import common_pb2, request_pb2
from spacebridgeapp.util.constants import KEY, USER_KEY

class ReportScheduled(SpacebridgeAppBase):
    def __init__(self, cron_schedule: str, next_scheduled_time: int, next_scheduled_time_str: str):
        self.cron_schedule = cron_schedule
        self.next_scheduled_time = next_scheduled_time
        self.next_scheduled_time_str = next_scheduled_time_str

    def set_proto(self, proto):
        proto.cronSchedule = self.cron_schedule
        proto.nextScheduledTime = self.next_scheduled_time
        proto.nextScheduledTimeString = self.next_scheduled_time_str

    def to_protobuf(self):
        proto = common_pb2.ReportSchedule()
        self.set_proto(proto)
        return proto

class ReportVisualization(SpacebridgeAppBase):
    def __init__(self, options_map: Dict[str, str], trellis_supported: bool, map_supported: bool):
        self.options_map = json.dumps(options_map)
        self.trellis_supported = trellis_supported
        self.map_supported = map_supported

    def set_proto(self, proto):
        options_map_jsn = json.loads(self.options_map)
        if options_map_jsn:
            for key in options_map_jsn.keys():
                proto.options[key] = options_map_jsn[key]
        proto.isTrellisSupported = self.trellis_supported
        proto.isMapSupported = self.map_supported

    def to_protobuf(self):
        proto = common_pb2.ReportVisualization()
        self.set_proto(proto)
        return proto

class ReportDetail(SpacebridgeAppBase):

    def __init__(self, report_id: ParsedReportId,
                 report_name: str = "",
                 description: str = "",
                 app_name: str = "",
                 display_app_name: str = "",
                 is_favorite: bool = False,
                 is_scheduled: bool = False,
                 schedule: ReportScheduled = None,
                 show_time_picker: bool = False,
                 earliest: str = "",
                 latest: str = "",
                 search: str = "",
                 subscribed_to_notifications=False):

        self.report_id = report_id
        self.report_name = report_name
        self.description = description
        self.app_name = app_name
        self.display_app_name = display_app_name
        self.is_favorite = is_favorite
        self.is_scheduled = is_scheduled
        self.schedule = schedule
        self.show_time_picker = show_time_picker
        self.earliest = earliest
        self.latest = latest
        self.search = search
        self.subscribed_to_notifications = subscribed_to_notifications


    def set_proto(self, proto):
        proto.reportId = self.report_id.id_str
        proto.reportName = self.report_name
        proto.description = self.description
        proto.appName = self.app_name
        proto.displayAppName = self.display_app_name
        proto.isFavorite = self.is_favorite
        proto.isScheduled = self.is_scheduled
        proto.showTimePicker = self.show_time_picker
        proto.earliest = self.earliest
        proto.latest = self.latest
        proto.search = self.search
        proto.subscribedToNotifications = self.subscribed_to_notifications

        if self.schedule is not None:
            self.schedule.set_proto(proto.schedule)


    def to_protobuf(self):
        proto = common_pb2.ReportDescription()
        self.set_proto(proto)
        return proto


class ReportMeta(SpacebridgeAppBase):
    """
    Object container for a Report Meta obj in kvstore
    """
    @staticmethod
    def from_json(json_obj):
        """
        Static initializer of Subscription object from a json object
        :param json_obj:
        :return: Subscription object
        """
        report_meta = ReportMeta()
        if json_obj:
            report_meta.is_favorite = json_obj.get('is_favorite')
            report_meta.report_id = json_obj.get('report_id')
            report_meta._key = json_obj.get(KEY)
            report_meta._user = json_obj.get(USER_KEY)
        return report_meta

    def __init__(self,
                 report_id=None,
                 is_favorite=None,
                 key_id=None,
                 _user=None):
        self.report_id = report_id
        self.is_favorite = is_favorite
        self._key = key_id
        self._user = _user

    def set_proto(self, proto):
        proto.reportId = self.report_id
        proto.isFavorite = self.is_favorite

    def to_protobuf(self):
        proto = request_pb2.ReportSetRequest()
        self.set_proto(proto)
        return proto

    def key(self):
        return self._key

    def user(self):
        return self._user
