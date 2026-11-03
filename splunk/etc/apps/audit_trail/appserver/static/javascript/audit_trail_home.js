"use strict";

require([
    "jquery",
    "app/audit_trail/javascript/audit_trail_static_url"
], function($, auditTrailStaticUrl) {
    $(function() {
        auditTrailStaticUrl.applyStaticAssetUrls(document);
    });
});
