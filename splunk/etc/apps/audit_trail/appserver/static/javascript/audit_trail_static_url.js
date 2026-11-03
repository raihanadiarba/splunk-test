"use strict";

define([], function() {
    function getConfigValue(key, defaultValue) {
        if (window.$C && Object.prototype.hasOwnProperty.call(window.$C, key)) {
            return window.$C[key];
        }

        if (defaultValue !== undefined) {
            return defaultValue;
        }

        throw new Error("Missing Splunk config value: " + key);
    }

    function fallbackMakeUrl(path) {
        var output = "";
        var seg;
        var len;

        for (var i = 0; i < arguments.length; i++) {
            seg = arguments[i].toString();
            len = seg.length;

            if (len > 1 && seg.charAt(len - 1) === "/") {
                seg = seg.substring(0, len - 1);
            }

            if (seg.charAt(0) !== "/") {
                output += "/" + seg;
            } else {
                output += seg;
            }
        }

        if (output !== "/") {
            var segments = output.split("/");
            var firstSegment = segments[1];

            if (firstSegment === "static" || firstSegment === "modules") {
                var postfix = output.substring(firstSegment.length + 2);
                output = "/" + firstSegment;

                if (window.$C && window.$C.BUILD_NUMBER) {
                    output += "/@" + window.$C.BUILD_NUMBER;
                }
                if (window.$C && window.$C.BUILD_PUSH_NUMBER) {
                    output += "." + window.$C.BUILD_PUSH_NUMBER;
                }
                if (segments[2] === "app") {
                    output += ":" + getConfigValue("APP_BUILD", 0);
                }

                output += "/" + postfix;
            }
        }

        var root = getConfigValue("MRSPARKLE_ROOT_PATH", "/");
        var locale = getConfigValue("LOCALE", "en-US");
        var combinedPath = "/" + locale + output;

        if (root === "" || root === "/") {
            return combinedPath;
        }

        return root + combinedPath;
    }

    function makeStaticUrl(path) {
        if (window.Splunk &&
            window.Splunk.util &&
            typeof window.Splunk.util.make_url === "function") {
            return window.Splunk.util.make_url(path);
        }

        return fallbackMakeUrl(path);
    }

    function applyStaticAssetUrls(rootElement) {
        var scope = rootElement || document;
        var elements = scope.querySelectorAll("[data-static-app-path]");

        Array.prototype.forEach.call(elements, function(element) {
            element.setAttribute("src", makeStaticUrl(element.getAttribute("data-static-app-path")));
        });
    }

    return {
        applyStaticAssetUrls: applyStaticAssetUrls,
        makeStaticUrl: makeStaticUrl
    };
});
