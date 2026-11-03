/*!
 * Copyright © 2018 Splunk Inc.
 * SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or
 * in part without a valid written license from Splunk Inc. is PROHIBITED.
 */
"use strict";
(self["webpackChunksplunk_data_management"] = self["webpackChunksplunk_data_management"] || []).push([[155],{

/***/ 155
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Manifest: () => (/* binding */ Manifest),
  "default": () => (/* binding */ DMXPluginManifest)
});

;// ./node_modules/@splunk/dmx-plugins/build/esm/constants.js
const DMX_STANZA_NAME = 'data_management';
const PLUGIN_PREFIX = `${DMX_STANZA_NAME}_plugin`;
const PLUGIN_ATTRIBUTE_NAME = 'plugin_enabled';
const replaceHyphens = /-/g;
const pluginName = (appName) => `${PLUGIN_PREFIX}_${appName.replace(replaceHyphens, '_')}`;
const extensionId = (appName, extensionName) => `${pluginName(appName)}:${extensionName}`;

;// ./node_modules/@splunk/dmx-plugins/build/esm/types.js
const DATA_MONITORING_EXTENSION = 'dataMonitoringExtension';
const DATA_INTEGRATION_EXTENSION = 'dataIntegrationExtension';
const SIDE_NAV_EXTENSION = 'sideNavExtension';

;// ./src/main/constants.ts
const APP_NAME = 'splunk-data-management';
const DATA_MANAGEMENT_APP_ID = {
  DATA_MANAGEMENT: 'splunk-data-management',
  INGEST_MONITORING: 'splunk-ingest-monitoring',
  GUIDED_ONBOARDING: 'guided_experience',
  DATA_INPUTS: 'data_manager'
};
const DATA_MANAGEMENT_APP_IDS = Object.values(DATA_MANAGEMENT_APP_ID);
let PRODUCT_ID = /*#__PURE__*/(/* unused pure expression or super */ null && (function (PRODUCT_ID) {
  PRODUCT_ID["IM"] = "IngestMonitoring";
  PRODUCT_ID["DM"] = "DM";
  PRODUCT_ID["SCS"] = "SplunkCloud";
  PRODUCT_ID["SPLUNK"] = "Splunk";
  return PRODUCT_ID;
}({})));
const LATEST_CARD_COUNT = 4;
;// ./src/DMXPluginManifest.tsx



const listSideNavs = () => {
  return [{
    capabilities: {},
    name: 'dmx_home',
    featureFlag: 'feature:new_data_management_experience/enable_new_data_management_home',
    content: {
      'menu.name': 'dmx_top',
      'menu.label': 'Home',
      'menu.order': 0,
      'menu.url': `/app/${APP_NAME}/dm-home`,
      'menu.icon': 'PHN2ZyBmaWxsPSJjdXJyZW50Q29sb3IiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTIuMDAyNiA0LjE4Mkw1IDEwLjQ0NzFMNS4wMDAxMiAxOEg5VjE0LjVDOSAxMy42NzE2IDkuNjcxNTcgMTMgMTAuNSAxM0gxMy41QzE0LjMyODQgMTMgMTUgMTMuNjcxNiAxNSAxNC41VjE4SDE5TDE4Ljk5OTkgMTAuNDQ2OUwxMi4wMDI2IDQuMTgyWk0xMS4wMDI2IDIuMzkzMUMxMS41NzIyIDEuODgzNDggMTIuNDMzOSAxLjg4MzYzIDEzLjAwMzMgMi4zOTM0NkwyMC41MDA0IDkuMTA1OTNDMjAuODE4MiA5LjM5MDQ4IDIwLjk5OTkgOS43OTY4NyAyMC45OTk5IDEwLjIyMzRMMjEgMTguNUMyMSAxOS4zMjg0IDIwLjMyODQgMjAgMTkuNSAyMEgxM1YxNUgxMVYyMEg0LjUwMDEzQzMuNjcxNzEgMjAgMy4wMDAxNCAxOS4zMjg1IDMuMDAwMTMgMTguNUwzIDEwLjIyMzZDMi45OTk5OSA5Ljc5NjgxIDMuMTgxNzggOS4zOTAyNCAzLjQ5OTg0IDkuMTA1NjhMMTEuMDAyNiAyLjM5MzFaIi8+PC9zdmc+'
    }
  }
  // waiting on IM to migrate to SUI5 (https://cd.splunkdev.com/swp/ui-platform/-/merge_requests/11853)
  // {
  //     capabilities: {},
  //     name: 'dmx_education_center',
  //     content: {
  //         'menu.name': 'dmx_bottom',
  //         'menu.label': 'Education center',
  //         'menu.order': 0,
  //         'menu.url': `/app/${APP_NAME}/dm-education-center`,
  //         'menu.icon':
  //             'PHN2ZyBmaWxsPSJjdXJyZW50Q29sb3IiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0zLjMxNTY5IDE5LjQ0ODlDMi45NjYyMyAxOS41MTUyIDIuNjc1OSAxOS40OTkxIDIuNDE1MjkgMTkuMzExMkMyLjE1NDUyIDE5LjEyMzMgMiAxOC44MjE0IDIgMTguNVY1Ljk5OTk5QzIgNS40NzA1NiAyLjQwNjI5IDUuMTYzMTkgMi44MzQwNCA0Ljk0OTMyQzMuMDYxMzIgNC44MzU2NyAzLjM4NjI3IDQuNjkyMTQgMy44MDg3NyA0LjU1MTMxQzQuNjU1MTkgNC4yNjkxNyA1Ljg4NjgyIDMuOTk5OTkgNy41IDMuOTk5OTlDOS4xNzI3NiAzLjk5OTk5IDEwLjQ0OTkgNC40MTk0MiAxMS4zMjIyIDQuODU1NTdDMTEuNTg1OCA0Ljk4NzM3IDExLjgxMTcgNS4xMjAzMSAxMiA1LjI0M0MxMi4xODgzIDUuMTIwMzEgMTIuNDE0MiA0Ljk4NzM3IDEyLjY3NzggNC44NTU1N0MxMy41NTAxIDQuNDE5NDIgMTQuODI3MiAzLjk5OTk5IDE2LjUgMy45OTk5OUMxOC4xMTMyIDMuOTk5OTkgMTkuMzQ0OCA0LjI2OTE3IDIwLjE5MTIgNC41NTEzMUMyMC42NjIxIDQuNzA4MjggMjEuMTM1NCA0Ljg5ODM5IDIxLjU1NDcgNS4xNjc5NEMyMS44MzI5IDUuMzUzNDEgMjIgNS42NjU2NCAyMiA1Ljk5OTk5VjE4LjVDMjIgMTguODIxNCAyMS44NDU1IDE5LjEyMzMgMjEuNTg0NyAxOS4zMTEyQzIxLjMyNDEgMTkuNDk5MSAyMS4wMzM4IDE5LjUxNTIgMjAuNjg0MyAxOS40NDg5QzIwLjY0MDUgMTkuNDQwNSAyMC42MTg4IDE5LjQzMzYgMjAuNTkwMSAxOS40MjQ0TDIwLjU3MSAxOS40MTg0TDIwLjU1NzEgMTkuNDE0MUMyMC41MzY5IDE5LjQwOCAyMC41MTE1IDE5LjQwMDggMjAuNDc2MiAxOS4zOTJDMjAuMzE0MSAxOS4zNTE1IDIwLjA1ODkgMTkuMjk0NCAxOS43MTA2IDE5LjIzNjRDMTkuMDE0MiAxOS4xMjAzIDE3Ljk0NDIgMTkgMTYuNSAxOUMxNS4xNzE5IDE5IDE0LjUxOTQgMTkuMzI5MiAxNC4yMjUgMTkuNTVDMTQuMDcyIDE5LjY2NDggMTMuOTU2NCAxOS44MTQ1IDEzLjg0MzIgMTkuOTYwOUMxMy42MzA3IDIwLjIzNjEgMTMuNDI2OSAyMC41IDEzIDIwLjVIMTIuMDFDMTIuMDA2NyAyMC41IDEyLjAwMzMgMjAuNSAxMiAyMC40OTk5QzExLjk5NjcgMjAuNSAxMS45OTMzIDIwLjUgMTEuOTkgMjAuNUgxMUMxMC41NzMxIDIwLjUgMTAuMzY5MyAyMC4yMzYxIDEwLjE1NjggMTkuOTYwOUMxMC4wNDM2IDE5LjgxNDUgOS45MjgwNCAxOS42NjQ4IDkuNzc1IDE5LjU1QzkuNDgwNiAxOS4zMjkyIDguODI4MTMgMTkgNy41IDE5QzYuMDU1ODQgMTkgNC45ODU4MiAxOS4xMjAzIDQuMjg5NCAxOS4yMzY0QzMuOTQxMDkgMTkuMjk0NCAzLjgxOTIzIDE5LjMxNTggMy41MjM3OSAxOS4zOTJDMy40OTE1MSAxOS40MDAzIDMuNDY1MTUgMTkuNDA4NSAzLjQzOTk1IDE5LjQxNjNDMy40MDE0OCAxOS40MjgzIDMuMzY1NyAxOS40Mzk0IDMuMzE1NjkgMTkuNDQ4OVpNMTEgMTcuOTY4OVY2Ljk4MDI1QzEwLjg1ODYgNi44ODI2NiAxMC42Njc4IDYuNzY0NDMgMTAuNDI3OCA2LjY0NDQyQzkuODAwMDcgNi4zMzA1NiA4LjgyNzI0IDUuOTk5OTkgNy41IDUuOTk5OTlDNi4xMTMxOCA1Ljk5OTk5IDUuMDk0ODEgNi4yMzA4MSA0LjQ0MTIzIDYuNDQ4NjhDNC4yNjk0IDYuNTA1OTUgNC4xMjIzMyA2LjU2MjQ5IDQgNi42MTM5NlYxNy4yNTcxQzQuODAyNTYgMTcuMTI1NSA1Ljk2OTQgMTcgNy41IDE3QzkuMTcxODcgMTcgMTAuMjY5NCAxNy40MjA4IDEwLjk3NSAxNy45NUwxMSAxNy45Njg5Wk0xMyAxNy45Njg5TDEzLjAyNSAxNy45NUMxMy43MzA2IDE3LjQyMDggMTQuODI4MSAxNyAxNi41IDE3QzE4LjAzMDYgMTcgMTkuMTk3NCAxNy4xMjU1IDIwIDE3LjI1NzFWNi42MTM5NkMxOS44Nzc3IDYuNTYyNDkgMTkuNzMwNiA2LjUwNTk1IDE5LjU1ODggNi40NDg2OEMxOC45MDUyIDYuMjMwODEgMTcuODg2OCA1Ljk5OTk5IDE2LjUgNS45OTk5OUMxNS4xNzI4IDUuOTk5OTkgMTQuMTk5OSA2LjMzMDU2IDEzLjU3MjIgNi42NDQ0MkMxMy4zMzIyIDYuNzY0NDMgMTMuMTQxNCA2Ljg4MjY2IDEzIDYuOTgwMjVWMTcuOTY4OVoiLz48L3N2Zz4=',
  //     },
  // },
  ];
};
const Manifest = {
  name: pluginName(APP_NAME),
  extensions: {
    [SIDE_NAV_EXTENSION]: [{
      id: extensionId(APP_NAME, SIDE_NAV_EXTENSION),
      listSideNavs
    }]
  }
};
/* harmony default export */ const DMXPluginManifest = (Manifest);

/***/ }

}]);