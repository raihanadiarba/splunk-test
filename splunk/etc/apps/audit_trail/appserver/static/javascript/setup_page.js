"use strict";

const appName = "audit_trail";
const appNamespace = {
    owner: "nobody",
    app: appName,
    sharing: "app",
};


// Splunk Web Framework Provided files
require([
    "jquery", "splunkjs/splunk", "app/audit_trail/javascript/audit_trail_static_url"
], function($, splunkjs, auditTrailStaticUrl) {
    console.log("setup_page.js require(...) called");

    auditTrailStaticUrl.applyStaticAssetUrls(document);

    // Set initial value
    setInitialValue();

    // Register .on( "click", handler ) for "Save" button
    $("#setup_button").click(completeSetup);

    // onclick function for "Save" button from setup_page.xml
    async function completeSetup() {
        console.log("setup_page.js completeSetup called");
        // Value of v2_enable_input from setup_page.xml
        //let v2Enable = $('#v2_enable_input').checked;
        let v2Enable = document.getElementById("v2_enable_input").checked;
        let stage = 'Initializing the Splunk SDK for Javascript';
        console.log(stage);
        try {
            // Initialize a Splunk Javascript SDK Service instance
            const http = new splunkjs.SplunkWebHttp();
            const service = new splunkjs.Service(
                http,
                appNamespace,
            );
            stage = 'Retrieving configurations SDK collection';
            console.log(stage);
            const configCollection = service.configurations(appNamespace);
            await configCollection.fetch();
            stage = `Retrieving app.conf values for ${appName}`;
            console.log(stage);
            const auditConfig = configCollection.item('audit');
            await auditConfig.fetch();
            stage = `Retrieving audit.conf [auditTrail] stanza values`;
            console.log(stage);
            const auditTrailStanza = auditConfig.item('auditTrail');
            await auditTrailStanza.fetch();
            if (isTrue(v2Enable)) {
                console.log("Enabling");
                enableLogFormatV2(auditTrailStanza);
            } else {
                console.log("Disabling");
                disableLogFormatV2(auditTrailStanza);  
            }

            // Reload configuration
            const params = {};
            service.request("/services/admin/splunk-audit/_reload", "POST", {}, {}, JSON.stringify(params), 
                {'Content-Type': 'application/json'}, (err, res)=> {
                    if (err) {
                        console.error("Error calling reload.", err);
                    } else {
                        console.log("Reload called successfully.");
                    }
        
                });

            $('.success').show();
            setTimeout(() => {
                $('.success').hide()
            }, 3000)

        } catch (e) {
            console.warn(e);
            $('.error').show();
            $('#error_details').show();
            let errText = `Error encountered during stage: ${stage}<br>`;
            errText += (e.toString() === '[object Object]') ? '' : e.toString();
            if (e.hasOwnProperty('status')) errText += `<br>[${e.status}] `;
            if (e.hasOwnProperty('responseText')) errText += e.responseText;
            $('#error_details').html(errText);
        }
    }


    async function setInitialValue() {
        try {
            console.log('Initialize a Splunk Javascript SDK Service instance');
            const http = new splunkjs.SplunkWebHttp();
            const service = new splunkjs.Service(
                http,
                appNamespace,
            );
            console.log('Retrieving configurations SDK collection');
            const configCollection = service.configurations(appNamespace);
            await configCollection.fetch();
            console.log(`Retrieving app.conf values for ${appName}`);
            const auditConfig = configCollection.item('audit');
            await auditConfig.fetch();
            console.log('Retrieving audit.conf [auditTrail] stanza values');
            const auditTrailStanza = auditConfig.item('auditTrail');
            await auditTrailStanza.fetch();
            const isEnabled = auditTrailStanza.properties().logging_format;
            if (isEnabled === 'both') {
                console.log("Setting to checked.");
                document.getElementById("v2_enable_input").checked = true;
            } else {
                console.log("Setting to unchecked.");
                document.getElementById("v2_enable_input").checked = false;
            }
        } catch (e) {
            console.warn(e);
        }

    }

    async function enableLogFormatV2(stanza) {
        await stanza.update({
            logging_format: "both"
        });
    }


    async function disableLogFormatV2(stanza) {
        await stanza.update({
            logging_format: "v1"
        });
    }


    function isTrue(v) {
        if (typeof(v) === typeof(true)) return v;
        if (typeof(v) === typeof(1)) return v!==0;
        if (typeof(v) === typeof('true')) {
            if (v.toLowerCase() === 'true') return true;
            if (v === 't') return true;
            if (v === '1') return true;
        }
        return false;
    }
});
