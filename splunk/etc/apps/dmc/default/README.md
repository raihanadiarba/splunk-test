# DMC
## Brief
DMC is the special application embedded in the splunk core repository to handle self-service app management operations in Classic architecture cloud stacks

DMC server runs on Cluster Manager and exposes REST API: https://splunk.atlassian.net/wiki/spaces/PROD/pages/1078436481164/DMC+Knowledge+base

## How to Run DMC endpoints on Classic Stack
Using DMC endpoints CRUD operations can be done on Apps, Indexes, Sourcetypes etc. Refer below document for details. 
https://docs.google.com/document/d/13FM15eIV4nMvShe_8O4eJGpJtay_0b_zY9ywzkwxjFw/edit?usp=sharing

1. SSH on ClusterMaster(CM)
2. Run curl command with stack credentials 
```
curl -k -u admin:<stack_password> https://localhost:8089/services/dmc/<>
```

## Debug DMC logs
To check DMC activity logs run `tail -f /var/log/splunk/dmc_agent.log` on ClusterMaster(CM) OR 

Run search query (index=_internal sourcetype IN (dmc_agent,splunkd)) on stack OR skynet-staging instance


## Run DMC tests
DMC pytests are available at `$SPLUNK_SOURCE/cfg/bundles/dmc/bin/tests`
To run unit test locally, set:
1. Splunk_SOURCE: to your Splunk main repository path
2. Splunk_HOME: to your Local Splunk

> **_NOTE:_**  Follow instruction from below document to install splunk in local machine https://docs.splunk.com/Documentation/Splunk/9.2.1/SearchTutorial/InstallSplunk

Run Pytest using below commands
1. $SPLUNK_HOME/bin/python3 -m pip install pytest
2. $SPLUNK_HOME/bin/python3 -m pytest $SPLUNK_SOURCE/cfg/bundles/dmc/bin/tests/

## How to test newly introduced features
1. Move to feature Branch on Splunk Repo on UI
2. Create the build with latest commit (Run Cloud Branch Pipeline)
3. Get the splunk Version using BuildFetcher: https://fetcher.re.splunkdev.com/
4. Create staging Co2 stack with the same splunk version as output above
5. Once Co2 stack is ready, feature can be tested by accessing Stack UI or using DMC endpoints on ClusterMaster(CM)



# Vulnerabilities fix
## If you are fixing the vulnerabilities please follow the steps.
1. Current building scripts are using node located in `$SPLUNK_HOME/bin/node` check its version `$SPLUNK_HOME/bin/node --version` and use the same version.
2. Generate new package-lock.json, fixing the vulnerabilities.
3. Test your changes
   1. Generate new build `npm run build`
   2. Now modify the templates `cfg/bundles/dmc/appserver/templates/dmc_app.html`
   3. Comment out all the python scripts and copy `window.$C` and `window._` from skynet and inject it with template
   4. If you are able to see any network calls to `file:///en-GB/splunkd/__raw/services/properties/web/remoteUI?output_mode=json` then most likely you are good. In spite of they will fail, due to cors.
4. Bum the version of package `npm version patch`.
5. Generate new tarball `node ./scripts/genTarball.js`.
6. Upload the tarball by:
   1. Following the README instructions in this [repository](https://cd.splunkdev.com/cloudworks/app-deployment/dmc).
   2. Copy the SHA.
7. Update the `$SPLUNK_SOURCE/thirdparty/dmc/repositories.bzl` version, sha and url with the version coming out from package.json, the sha and the new artifactory url obtained in previous step.
8. Make sure to create co2 stack, the dmc package are loaded on SH and SHC for classic flavour. Check if app managements pages are rendered without an error.
   1. [Guide on stack provisioning](https://splunk.atlassian.net/wiki/spaces/PROD/pages/1078351023309/App+Management+Splunk+Cloud+Splunk+Enterprise#Preparing-the-stack-to-load-bundles-from-localhost)
9. Tag your merge request with following labels:
   1. test::cloud_classic::smoke
   2. test::cloud_noah_arm::smoke
10. Make sure to run pipeline action `trigger_splcore_qa_golden_tests_frontend_only`, and check the results.
11. Confirm that vulnerabilities has been resolved by running fossa scan against your branch.
