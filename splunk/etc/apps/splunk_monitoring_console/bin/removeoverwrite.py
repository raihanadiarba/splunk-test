import os, sys, time, shutil

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
APP_DIR = os.path.dirname(SCRIPT_DIR)
LOCAL_VIEWS_DIR = os.path.join(APP_DIR, "local", "data", "ui", "views")
sys.path.insert(0, os.path.join(SCRIPT_DIR, "lib"))
from splunklib.searchcommands import dispatch, GeneratingCommand, Configuration, Option, validators

@Configuration()
class GenerateOverwrites(GeneratingCommand):
    check = Option(require=True, validate=validators.Fieldname())
    def generate(self):
        if self.check == "all":
            if os.path.isdir(LOCAL_VIEWS_DIR):
                pages = os.listdir(LOCAL_VIEWS_DIR)
            else:
                pages = []
            if len(pages)==0:
                yield {'_time':time.time(),'_raw':'No files to remove'}
            if len(pages) > 0:
                for page in pages:
                    pagePath = os.path.join(LOCAL_VIEWS_DIR, page)
                    yield {'_time':os.path.getmtime(pagePath), '_raw':page + ' to be removed'}
                shutil.rmtree(LOCAL_VIEWS_DIR)
                os.makedirs(LOCAL_VIEWS_DIR)
        else:
            pagePath = os.path.join(LOCAL_VIEWS_DIR, self.check)
            if os.path.exists(pagePath):
                yield {'_time':os.path.getmtime(pagePath), '_raw':self.check + ' removed'}
                os.remove(pagePath)
            else:
                yield {'_time':time.time(),'_raw':'No page with the given name found: '+ self.check}
dispatch(GenerateOverwrites, sys.argv, sys.stdin, sys.stdout, __name__)
