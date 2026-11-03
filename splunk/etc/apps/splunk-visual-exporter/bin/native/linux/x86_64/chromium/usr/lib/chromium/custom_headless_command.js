"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// src/headless_commands/constants.ts
var DEFAULT_POLLING_TIMEOUT = 500;
var DEFAULT_RETRIES = 3;
var DEFAULT_RENDER_SCREENSHOT_DELAY = 0;
var RESIZE_POLLING_TIMEOUT = 50;
var VIZ_FULLY_RENDERED_TIMEOUT = 2e3;
var DEFAULT_TITLE_AND_INPUT = 160;
var MAX_WIDTH = 1440;
var MAX_HEIGHT = 960;
var MAX_PIXELS = MAX_WIDTH * (MAX_HEIGHT + DEFAULT_TITLE_AND_INPUT);
var DATA_LOADING_INDICATOR_SELECTOR = '[data-test="viz-item"] [data-test="status-icon-container"] circle';
var DEFAULT_EXPORT_MAX_FILE_SIZE_MB = 8;
var DEFAULT_EXPORT_MAX_SCALE_FACTOR = 4;
var MAX_ALLOWED_EXPORT_SCALE_FACTOR = 10;

// src/headless_commands/utils.ts
var formatConsoleLog = (message, level = "debug") => {
  return `${message} custom_headless_command.js:${level.toUpperCase()}`;
};
var checkIfProtocolReturnedError = (response, operation, throwError = true) => {
  if (response.error) {
    const errorString = `${operation} failed with error ${JSON.stringify(response.error)}`;
    console.error(formatConsoleLog(errorString, "error"));
    if (throwError) {
      throw new Error(errorString);
    }
  }
  return !!response.error;
};
var calculateFileSize = (base64data) => {
  const decodedBase64Binary = atob(base64data);
  const base64Size = new Blob([decodedBase64Binary]).size;
  const fileSizeKB = base64Size / 1024;
  const fileSizeMB = fileSizeKB / 1024;
  return fileSizeMB;
};
function calculateClampedScaleFactor(originalDimensions, maxScale = 4) {
  const originalPixels = originalDimensions.width * originalDimensions.height;
  const startingScaleFactor = Math.floor(originalPixels / MAX_PIXELS);
  const clampedScaleFactor = Math.min(startingScaleFactor, maxScale);
  console.log(
    formatConsoleLog(
      `originalPixels: ${originalPixels}, MAX_PIXELS: ${MAX_PIXELS}, startingScaleFactor: ${startingScaleFactor}, clampedScaleFactor: ${clampedScaleFactor}`
    )
  );
  return Math.max(clampedScaleFactor, 1);
}
function determineScreenshotFormat(fileFormat, scaleFactor) {
  if (fileFormat === "pdf" && scaleFactor === 1) {
    return "png";
  }
  if (fileFormat === "pdf" && scaleFactor > 1) {
    return "jpeg";
  }
  if (fileFormat === "png") {
    return "png";
  }
  return "png";
}
async function takeScreenshotOfDash({
  dp,
  screenshotParams
}) {
  var _a;
  const screenshotResponse = await dp.Page.captureScreenshot(screenshotParams);
  checkIfProtocolReturnedError(
    screenshotResponse,
    `Failed when taking screenshot with params ${JSON.stringify(screenshotParams)}`
  );
  const imageData = (_a = screenshotResponse.result) == null ? void 0 : _a.data;
  if (!imageData) {
    throw new Error(
      `Screenshot failed to return valid image data with screenshot params: ${JSON.stringify(screenshotParams)}`
    );
  }
  return imageData;
}
async function takeScaledScreenshotOfDash({
  dp,
  boundingRect,
  format,
  sizeLimitMB
}) {
  var _a;
  const screenshotParams = { clip: boundingRect, format };
  let screenshotData = await takeScreenshotOfDash({ dp, screenshotParams });
  let fileSizeMB = calculateFileSize(screenshotData);
  const scaledBoundingRect = __spreadValues({}, boundingRect);
  let currentScale = Math.floor((_a = scaledBoundingRect.scale) != null ? _a : 1);
  while (fileSizeMB > sizeLimitMB && currentScale > 1) {
    console.log(
      formatConsoleLog(
        `File size ${fileSizeMB.toFixed(3)} MB exceeds limit of ${sizeLimitMB} MB. Reducing scale from ${currentScale} to ${currentScale - 1}`,
        "warning"
      )
    );
    currentScale -= 1;
    scaledBoundingRect.scale = currentScale;
    screenshotData = await takeScreenshotOfDash({
      dp,
      screenshotParams: { clip: scaledBoundingRect, format }
    });
    fileSizeMB = calculateFileSize(screenshotData);
    console.log(
      formatConsoleLog(`New screenshot file size at scale ${currentScale}: ${fileSizeMB.toFixed(3)} MB`)
    );
  }
  console.log(formatConsoleLog(`Finalized raw ${format} screenshot file size: ${fileSizeMB.toFixed(3)} MB`, "info"));
  return screenshotData;
}
function buildScreenshotParams({
  dashboardDimensions,
  baseClip,
  fileFormat,
  exportMaxScaleFactor,
  exportMaxFileSizeMB
}) {
  const maxScaleFactor = Math.min(exportMaxScaleFactor, MAX_ALLOWED_EXPORT_SCALE_FACTOR);
  const scale = calculateClampedScaleFactor(dashboardDimensions, maxScaleFactor);
  const format = determineScreenshotFormat(fileFormat, scale);
  return {
    clip: __spreadProps(__spreadValues({}, baseClip), { scale }),
    format,
    sizeLimitMB: exportMaxFileSizeMB
  };
}

// src/headless_commands/custom_headless_command.ts
var wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var waitUntilCondition = async ({
  pollingFn,
  pollingTime = DEFAULT_POLLING_TIMEOUT,
  retries = DEFAULT_RETRIES
} = { pollingFn: () => Promise.resolve(true) }) => {
  for (let i = 0; i < retries; i++) {
    const result = await pollingFn();
    if (result) {
      return true;
    }
    await wait(pollingTime);
  }
  return false;
};
var resolveNode = async (dp, documentNodeId, selector) => {
  var _a;
  const nodeResult = await dp.DOM.querySelector({ nodeId: documentNodeId, selector });
  console.log(formatConsoleLog(`Node result for selector ${selector} is ${JSON.stringify(nodeResult)}}`));
  const usernameNodeId = (_a = nodeResult.result) == null ? void 0 : _a.nodeId;
  const resolvedNode = await dp.DOM.resolveNode({ nodeId: usernameNodeId });
  console.log(formatConsoleLog(`Resolved node result for selector ${selector} is ${JSON.stringify(resolvedNode)}`));
  return resolvedNode;
};
var hasDashboardRendered = (dp, documentNodeId, pollingTime = DEFAULT_POLLING_TIMEOUT, retries = DEFAULT_RETRIES) => {
  return waitUntilCondition({
    pollingFn: async () => {
      const resolvedNode = await resolveNode(dp, documentNodeId, `[data-finished-rendering='true']`);
      return !resolvedNode.error;
    },
    pollingTime,
    retries
  });
};
var boundingRectFunc = function() {
  const e = this.getBoundingClientRect();
  const t = this.ownerDocument.documentElement.getBoundingClientRect();
  const x = e.left - t.left;
  const y = e.top - t.top;
  return JSON.stringify({
    x,
    y,
    bottom: e.height + y,
    right: e.width + x,
    width: e.width,
    height: e.height,
    scale: 1
  });
};
var getBoundingRectAroundElement = async (dp, documentNodeId, selector) => {
  const element = await resolveNode(dp, documentNodeId, selector);
  if (checkIfProtocolReturnedError(element, `Resolving node with selector ${selector}`, false)) {
    return void 0;
  }
  const runtimeCallOnResult = await dp.Runtime.callFunctionOn({
    silent: true,
    objectId: element.result.object.objectId,
    functionDeclaration: boundingRectFunc.toString()
  });
  console.log(
    formatConsoleLog(`Bounding rectangle result around ${selector} is ${JSON.stringify(runtimeCallOnResult)}}`)
  );
  if (checkIfProtocolReturnedError(runtimeCallOnResult, `Getting bounding rectangle around ${selector}`, false)) {
    return void 0;
  }
  return JSON.parse(runtimeCallOnResult.result.result.value);
};
var getElementDimensions = async (dp, documentNodeId, selector) => {
  var _a, _b;
  const boundingRect = await getBoundingRectAroundElement(dp, documentNodeId, selector);
  const height = (_a = boundingRect == null ? void 0 : boundingRect.height) != null ? _a : 0;
  const width = (_b = boundingRect == null ? void 0 : boundingRect.width) != null ? _b : 0;
  if (width && height) {
    console.log(formatConsoleLog(`Element dimensions for ${selector} is width=${width}, height=${height}`));
  } else {
    console.log(
      formatConsoleLog(`Unable to find element dimensions for ${selector}, width=${width}, height=${height}`)
    );
  }
  return { width, height };
};
var getAllElementHeights = async (dp, documentNodeId, elements) => {
  const heightPromises = elements.map(async (element) => {
    const { height: elementHeight } = await getElementDimensions(dp, documentNodeId, element);
    return elementHeight;
  });
  const heights = await Promise.all(heightPromises);
  const totalHeight = heights.reduce((accHeight, currentHeight) => accHeight + currentHeight, 0);
  return totalHeight;
};
var getInputAndHeaderDimensions = async (dp, documentNodeId, definition) => {
  var _a, _b, _c;
  const elements = ['[data-test="input-layout-container"]', '[data-test="dashboard-header"]'];
  if (getIsTabbedDefinition(definition) && ((_c = (_b = (_a = definition.layout) == null ? void 0 : _a.tabs) == null ? void 0 : _b.items) == null ? void 0 : _c.length) && definition.layout.tabs.items.length > 1) {
    elements.push('[data-test="tabs-container"]');
  }
  const elementHeights = await getAllElementHeights(dp, documentNodeId, elements);
  return Math.ceil(elementHeights);
};
var getDimensionsFromDefinition = (definition) => {
  var _a, _b, _c, _d, _e;
  const layoutOptions = getIsTabbedDefinition(definition) ? (_a = getFirstTabLayout(definition)) == null ? void 0 : _a.options : (_c = (_b = definition.layout) == null ? void 0 : _b.options) != null ? _c : {};
  const width = (_d = layoutOptions == null ? void 0 : layoutOptions.width) != null ? _d : MAX_WIDTH;
  const height = (_e = layoutOptions == null ? void 0 : layoutOptions.height) != null ? _e : MAX_HEIGHT;
  return { width, height };
};
var getFirstTabLayout = (definition) => {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const firstTabId = ((_b = (_a = definition == null ? void 0 : definition.layout) == null ? void 0 : _a.tabs) == null ? void 0 : _b.items.length) && ((_e = (_d = (_c = definition == null ? void 0 : definition.layout) == null ? void 0 : _c.tabs) == null ? void 0 : _d.items[0]) == null ? void 0 : _e.layoutId);
  const firstTabLayout = firstTabId && firstTabId in ((_g = (_f = definition == null ? void 0 : definition.layout) == null ? void 0 : _f.layoutDefinitions) != null ? _g : {}) && ((_h = definition == null ? void 0 : definition.layout) == null ? void 0 : _h.layoutDefinitions[firstTabId]);
  return firstTabLayout || void 0;
};
var calculateRequiredScreenDimensions = async (dp, documentNodeId, definition, resizeDetectorAttribute) => {
  let { width, height } = getDimensionsFromDefinition(definition);
  let { width: canvasWidth, height: canvasHeight } = await getElementDimensions(
    dp,
    documentNodeId,
    `[data-test="${resizeDetectorAttribute}"]`
  );
  let titleInputHeight = await getInputAndHeaderDimensions(dp, documentNodeId, definition);
  console.log(
    formatConsoleLog(
      `Width of dashboard=${width}, height of dashboard=${height}, title and input height=${titleInputHeight}`
    )
  );
  const totalPixels = width * height;
  const scaleFactor = Math.sqrt(totalPixels / MAX_PIXELS);
  const scaledWidth = Math.floor(width / scaleFactor);
  if (scaleFactor > 1 && width > scaledWidth) {
    width = scaledWidth;
    await resizeWindow(dp, documentNodeId, width, canvasHeight + titleInputHeight);
    await waitForCanvasToResize({
      dp,
      documentNodeId,
      width: canvasWidth,
      resizeDetectorAttribute
    });
    const resizedTitleInputHeight = await getInputAndHeaderDimensions(dp, documentNodeId, definition);
    const { height: resizedCanvasHeight } = await getElementDimensions(
      dp,
      documentNodeId,
      `[data-test="${resizeDetectorAttribute}"]`
    );
    console.log(
      formatConsoleLog(
        `After resizing: Width of dashboard=${width}, height of canvas=${resizedCanvasHeight}, title and input height=${resizedTitleInputHeight}`
      )
    );
    canvasHeight = Math.ceil(resizedCanvasHeight);
    titleInputHeight = Math.max(titleInputHeight, resizedTitleInputHeight);
  }
  return { width, height: canvasHeight + titleInputHeight };
};
var waitForDashboardToResize = async ({
  dp,
  documentNodeId,
  width,
  height
}) => {
  let boundingRect;
  const hasResized = await waitUntilCondition({
    pollingFn: async () => {
      boundingRect = await getBoundingRectAroundElement(dp, documentNodeId, "div#root");
      if (!boundingRect) {
        return false;
      }
      return boundingRect.width <= width && boundingRect.height <= height;
    },
    pollingTime: RESIZE_POLLING_TIMEOUT
  });
  if (!hasResized) {
    console.log(
      formatConsoleLog(
        `Bounding rectangle ${JSON.stringify(boundingRect)} is not within screen dimensions, returning`,
        "warning"
      )
    );
  }
  return boundingRect;
};
var waitForCanvasToResize = async ({
  dp,
  documentNodeId,
  width,
  resizeDetectorAttribute
}) => {
  const hasResized = await waitUntilCondition({
    pollingFn: async () => {
      const boundingRect = await getBoundingRectAroundElement(
        dp,
        documentNodeId,
        `[data-test="${resizeDetectorAttribute}"]`
      );
      if (!boundingRect) {
        return false;
      }
      return (boundingRect == null ? void 0 : boundingRect.width) < width;
    },
    pollingTime: RESIZE_POLLING_TIMEOUT
  });
  if (!hasResized) {
    console.log(formatConsoleLog("Canvas resize was not detected, screenshot may include whitespace", "warning"));
  }
};
var getDocumentNodeId = async (dp) => {
  const documentResult = await dp.DOM.getDocument({});
  console.log(formatConsoleLog(`Document result is ${JSON.stringify(documentResult)}}`));
  checkIfProtocolReturnedError(documentResult, "Getting root dashboard node");
  return documentResult.result.root.nodeId;
};
var renderStudioDashboard = async (dp, args) => {
  var _a, _b;
  const scriptKickOff = await dp.Runtime.evaluate({
    expression: `SplunkStudioDashboard.render(${JSON.stringify(args)})`,
    awaitPromise: true,
    returnByValue: true
  });
  if ((_a = scriptKickOff.error) != null ? _a : scriptKickOff.result.exceptionDetails) {
    const errorString = (_b = scriptKickOff.error) != null ? _b : JSON.stringify(scriptKickOff.result.exceptionDetails);
    const kickOffErrorMsg = `Rendering the studio dashboard with definition failed with error ${errorString}`;
    console.error(formatConsoleLog(kickOffErrorMsg, "error"));
    throw new Error(kickOffErrorMsg);
  }
  console.log(formatConsoleLog(JSON.stringify(scriptKickOff)));
};
var renderLegacyViz = async (dp, args) => {
  var _a, _b, _c;
  const scriptKickOff = await dp.Runtime.evaluate({
    expression: `SplunkLegacyExporter.render(${JSON.stringify(args)})`,
    awaitPromise: true,
    returnByValue: true
  });
  if ((_a = scriptKickOff.error) != null ? _a : scriptKickOff.result.exceptionDetails) {
    const errorString = (_b = scriptKickOff.error) != null ? _b : JSON.stringify(scriptKickOff.result.exceptionDetails);
    const kickOffErrorMsg = `Rendering the legacy viz with data failed with error ${errorString}`;
    console.error(formatConsoleLog(kickOffErrorMsg, "error"));
    throw new Error(kickOffErrorMsg);
  }
  const svg = (_c = scriptKickOff.result) == null ? void 0 : _c.result.value;
  console.log(formatConsoleLog(JSON.stringify(scriptKickOff)));
  return svg;
};
var containsVisualizationType = (definition, visualizationType) => {
  const { visualizations = {} } = definition;
  return Object.values(visualizations).some((visualization) => {
    return visualization.type === visualizationType;
  });
};
var waitForAllVizToRender = async (dp, documentNodeId, definition) => {
  if (containsVisualizationType(definition, "splunk.map")) {
    await wait(VIZ_FULLY_RENDERED_TIMEOUT);
  } else {
    const vizLoadResult = await waitUntilCondition({
      pollingFn: async () => {
        const { result: vizNotLoadedResult = { nodeIds: [] } } = await dp.DOM.querySelectorAll({
          nodeId: documentNodeId,
          selector: DATA_LOADING_INDICATOR_SELECTOR
        });
        const numberOfVizNotLoaded = vizNotLoadedResult.nodeIds.length;
        return !numberOfVizNotLoaded;
      },
      retries: Math.ceil(VIZ_FULLY_RENDERED_TIMEOUT / DEFAULT_POLLING_TIMEOUT)
    });
    if (!vizLoadResult) {
      console.log(
        formatConsoleLog(
          "Waiting for all visualization loading status indicators to disappear exceeded timeout. Proceeding anyway",
          "warning"
        )
      );
    }
  }
};
var resizeWindow = async (dp, documentNodeId, width, height) => {
  console.log(formatConsoleLog(`Setting width=${width} and height=${height}`));
  const deviceMetricsOverrideResult = await dp.Emulation.setDeviceMetricsOverride({
    // width and height need to be integers
    width: Math.ceil(width),
    height: Math.ceil(height),
    deviceScaleFactor: 1,
    mobile: false
  });
  checkIfProtocolReturnedError(
    deviceMetricsOverrideResult,
    `Failed while resizing to width=${width} and height=${height}`
  );
  console.log(formatConsoleLog(`Device metrics override result is ${JSON.stringify(deviceMetricsOverrideResult)}`));
  const boundingRect = await waitForDashboardToResize({
    dp,
    documentNodeId,
    width,
    height
  });
  return boundingRect;
};
var getIsTabbedDefinition = (definition) => "layout" in definition && "layoutDefinitions" in definition.layout;
async function screenshotRootDashboardNode(dp, args) {
  var _a, _b, _c, _d;
  const {
    definition,
    screenshotDelay = DEFAULT_RENDER_SCREENSHOT_DELAY,
    exportMaxFileSizeMB = DEFAULT_EXPORT_MAX_FILE_SIZE_MB,
    exportMaxScaleFactor = DEFAULT_EXPORT_MAX_SCALE_FACTOR,
    fileFormat = "pdf",
    featureFlags = {}
  } = args;
  console.log(
    formatConsoleLog(
      `Configured scheduled export arguments: ${JSON.stringify({ screenshotDelay, exportMaxFileSizeMB, exportMaxScaleFactor, fileFormat, featureFlags })}`
    )
  );
  const isTabbedDefinition = getIsTabbedDefinition(definition);
  const isGrid = isTabbedDefinition ? ((_a = getFirstTabLayout(definition)) == null ? void 0 : _a.type) === "grid" : ((_b = definition.layout) == null ? void 0 : _b.type) === "grid";
  const resizeDetectorAttribute = isGrid ? "grid-layout" : "absolute-layout";
  await renderStudioDashboard(dp, args);
  const documentNodeId = await getDocumentNodeId(dp);
  const hasRendered = await hasDashboardRendered(dp, documentNodeId);
  if (!hasRendered) {
    console.log(
      formatConsoleLog("Could not find finished-rendering attribute. Taking screenshot anyway", "warning")
    );
  }
  await waitForAllVizToRender(dp, documentNodeId, definition);
  await wait(screenshotDelay * 1e3);
  const { width, height } = await calculateRequiredScreenDimensions(
    dp,
    documentNodeId,
    definition,
    resizeDetectorAttribute
  );
  const boundingRect = (_c = await resizeWindow(dp, documentNodeId, width, height)) != null ? _c : {
    x: 0,
    y: 0,
    width,
    height,
    scale: 1
  };
  const { right: canvasHorizontalEnd, bottom: canvasVerticalEnd } = (_d = await getBoundingRectAroundElement(dp, documentNodeId, `[data-test="${resizeDetectorAttribute}"]`)) != null ? _d : {};
  boundingRect.height = Number(canvasVerticalEnd) > 0 ? Number(canvasVerticalEnd) : height;
  boundingRect.width = Number(canvasHorizontalEnd) > 0 ? Number(canvasHorizontalEnd) : boundingRect.width;
  const originalDimensions = getDimensionsFromDefinition(definition);
  const { clip, format, sizeLimitMB } = buildScreenshotParams({
    dashboardDimensions: originalDimensions,
    baseClip: boundingRect,
    fileFormat,
    exportMaxScaleFactor,
    exportMaxFileSizeMB
  });
  const screenshotData = await takeScaledScreenshotOfDash({
    dp,
    boundingRect: clip,
    format,
    sizeLimitMB
  });
  const dataURL = `data:image/${format};base64,${screenshotData}`;
  return dataURL;
}
async function generateSVGFromViz(dp, args) {
  const svg = await renderLegacyViz(dp, args);
  return svg;
}
async function executeCustomHeadlessCommand(dp, params) {
  const args = JSON.parse(atob(params.customHeadlessArgs));
  if (args.type === "legacy") {
    return generateSVGFromViz(dp, args);
  }
  return screenshotRootDashboardNode(dp, args);
}
executeCustomHeadlessCommand;
