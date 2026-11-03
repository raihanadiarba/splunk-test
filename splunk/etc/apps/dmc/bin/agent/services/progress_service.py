"""
    Progress sercice. Deals with progress of
    each task
"""

from agent import ioc


# pylint: disable=too-few-public-methods
class ProgressService(ioc.Component):
    """
        Progress Service
    """

    def __init__(self):
        self._repository = \
            ioc.repositories.progress_repository()

    def get_progress_for_task(self, task_id, req_query):
        """
        get tasks from progress repository for specified task_id
        :param task_id:
        :return:
        """
        query = {"taskId": task_id}
        if req_query is not None:
            query.update(req_query)
        return self._repository.get_all(query=query,
                                        sort=(("createdAt", 1),))
# pylint: enable=too-few-public-methods
