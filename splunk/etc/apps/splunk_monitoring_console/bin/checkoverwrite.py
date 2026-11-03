import sys

from os import path
from os import listdir

SCRIPT_DIR = path.dirname(path.abspath(__file__))
APP_DIR = path.dirname(SCRIPT_DIR)
DEFAULT_VIEWS_DIR = path.join(APP_DIR, "default", "data", "ui", "views")
LOCAL_VIEWS_DIR = path.join(APP_DIR, "local", "data", "ui", "views")
sys.path.insert(0, path.join(SCRIPT_DIR, "lib"))
from splunklib.searchcommands import dispatch, GeneratingCommand, Configuration

@Configuration()
class GenerateOverwrites(GeneratingCommand):
    def generate(self):
        if path.isdir(DEFAULT_VIEWS_DIR):
            defaultPages = set(listdir(DEFAULT_VIEWS_DIR))
        else:
            defaultPages = set()

        if path.isdir(LOCAL_VIEWS_DIR):
            localPages = listdir(LOCAL_VIEWS_DIR)
        else:
            localPages = []
        for page in localPages:
            if (page in defaultPages):
                pagePath = path.join(LOCAL_VIEWS_DIR, page)
                yield {'_time':path.getmtime(pagePath), '_raw':page}
dispatch(GenerateOverwrites, sys.argv, sys.stdin, sys.stdout, __name__)
