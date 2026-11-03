"use strict";
(() => {
  // ../../node_modules/html-to-image/es/util.js
  function resolveUrl(url, baseUrl) {
    if (url.match(/^[a-z]+:\/\//i)) {
      return url;
    }
    if (url.match(/^\/\//)) {
      return window.location.protocol + url;
    }
    if (url.match(/^[a-z]+:/i)) {
      return url;
    }
    const doc = document.implementation.createHTMLDocument();
    const base = doc.createElement("base");
    const a = doc.createElement("a");
    doc.head.appendChild(base);
    doc.body.appendChild(a);
    if (baseUrl) {
      base.href = baseUrl;
    }
    a.href = url;
    return a.href;
  }
  var uuid = /* @__PURE__ */ (() => {
    let counter = 0;
    const random = () => (
      // eslint-disable-next-line no-bitwise
      `0000${(Math.random() * 36 ** 4 << 0).toString(36)}`.slice(-4)
    );
    return () => {
      counter += 1;
      return `u${random()}${counter}`;
    };
  })();
  function toArray(arrayLike) {
    const arr = [];
    for (let i = 0, l = arrayLike.length; i < l; i++) {
      arr.push(arrayLike[i]);
    }
    return arr;
  }
  function px(node, styleProperty) {
    const win = node.ownerDocument.defaultView || window;
    const val = win.getComputedStyle(node).getPropertyValue(styleProperty);
    return val ? parseFloat(val.replace("px", "")) : 0;
  }
  function getNodeWidth(node) {
    const leftBorder = px(node, "border-left-width");
    const rightBorder = px(node, "border-right-width");
    return node.clientWidth + leftBorder + rightBorder;
  }
  function getNodeHeight(node) {
    const topBorder = px(node, "border-top-width");
    const bottomBorder = px(node, "border-bottom-width");
    return node.clientHeight + topBorder + bottomBorder;
  }
  function getImageSize(targetNode, options = {}) {
    const width = options.width || getNodeWidth(targetNode);
    const height = options.height || getNodeHeight(targetNode);
    return { width, height };
  }
  function getPixelRatio() {
    let ratio;
    let FINAL_PROCESS;
    try {
      FINAL_PROCESS = process;
    } catch (e) {
    }
    const val = FINAL_PROCESS && FINAL_PROCESS.env ? FINAL_PROCESS.env.devicePixelRatio : null;
    if (val) {
      ratio = parseInt(val, 10);
      if (Number.isNaN(ratio)) {
        ratio = 1;
      }
    }
    return ratio || window.devicePixelRatio || 1;
  }
  var canvasDimensionLimit = 16384;
  function checkCanvasDimensions(canvas) {
    if (canvas.width > canvasDimensionLimit || canvas.height > canvasDimensionLimit) {
      if (canvas.width > canvasDimensionLimit && canvas.height > canvasDimensionLimit) {
        if (canvas.width > canvas.height) {
          canvas.height *= canvasDimensionLimit / canvas.width;
          canvas.width = canvasDimensionLimit;
        } else {
          canvas.width *= canvasDimensionLimit / canvas.height;
          canvas.height = canvasDimensionLimit;
        }
      } else if (canvas.width > canvasDimensionLimit) {
        canvas.height *= canvasDimensionLimit / canvas.width;
        canvas.width = canvasDimensionLimit;
      } else {
        canvas.width *= canvasDimensionLimit / canvas.height;
        canvas.height = canvasDimensionLimit;
      }
    }
  }
  function createImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.decode = () => resolve(img);
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.crossOrigin = "anonymous";
      img.decoding = "async";
      img.src = url;
    });
  }
  async function svgToDataURL(svg) {
    return Promise.resolve().then(() => new XMLSerializer().serializeToString(svg)).then(encodeURIComponent).then((html) => `data:image/svg+xml;charset=utf-8,${html}`);
  }
  async function nodeToDataURL(node, width, height) {
    const xmlns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(xmlns, "svg");
    const foreignObject = document.createElementNS(xmlns, "foreignObject");
    svg.setAttribute("width", `${width}`);
    svg.setAttribute("height", `${height}`);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    foreignObject.setAttribute("width", "100%");
    foreignObject.setAttribute("height", "100%");
    foreignObject.setAttribute("x", "0");
    foreignObject.setAttribute("y", "0");
    foreignObject.setAttribute("externalResourcesRequired", "true");
    svg.appendChild(foreignObject);
    foreignObject.appendChild(node);
    return svgToDataURL(svg);
  }
  var isInstanceOfElement = (node, instance) => {
    if (node instanceof instance)
      return true;
    const nodePrototype = Object.getPrototypeOf(node);
    if (nodePrototype === null)
      return false;
    return nodePrototype.constructor.name === instance.name || isInstanceOfElement(nodePrototype, instance);
  };

  // ../../node_modules/html-to-image/es/clone-pseudos.js
  function formatCSSText(style) {
    const content = style.getPropertyValue("content");
    return `${style.cssText} content: '${content.replace(/'|"/g, "")}';`;
  }
  function formatCSSProperties(style) {
    return toArray(style).map((name) => {
      const value = style.getPropertyValue(name);
      const priority = style.getPropertyPriority(name);
      return `${name}: ${value}${priority ? " !important" : ""};`;
    }).join(" ");
  }
  function getPseudoElementStyle(className, pseudo, style) {
    const selector = `.${className}:${pseudo}`;
    const cssText = style.cssText ? formatCSSText(style) : formatCSSProperties(style);
    return document.createTextNode(`${selector}{${cssText}}`);
  }
  function clonePseudoElement(nativeNode, clonedNode, pseudo) {
    const style = window.getComputedStyle(nativeNode, pseudo);
    const content = style.getPropertyValue("content");
    if (content === "" || content === "none") {
      return;
    }
    const className = uuid();
    try {
      clonedNode.className = `${clonedNode.className} ${className}`;
    } catch (err) {
      return;
    }
    const styleElement = document.createElement("style");
    styleElement.appendChild(getPseudoElementStyle(className, pseudo, style));
    clonedNode.appendChild(styleElement);
  }
  function clonePseudoElements(nativeNode, clonedNode) {
    clonePseudoElement(nativeNode, clonedNode, ":before");
    clonePseudoElement(nativeNode, clonedNode, ":after");
  }

  // ../../node_modules/html-to-image/es/mimes.js
  var WOFF = "application/font-woff";
  var JPEG = "image/jpeg";
  var mimes = {
    woff: WOFF,
    woff2: WOFF,
    ttf: "application/font-truetype",
    eot: "application/vnd.ms-fontobject",
    png: "image/png",
    jpg: JPEG,
    jpeg: JPEG,
    gif: "image/gif",
    tiff: "image/tiff",
    svg: "image/svg+xml",
    webp: "image/webp"
  };
  function getExtension(url) {
    const match = /\.([^./]*?)$/g.exec(url);
    return match ? match[1] : "";
  }
  function getMimeType(url) {
    const extension = getExtension(url).toLowerCase();
    return mimes[extension] || "";
  }

  // ../../node_modules/html-to-image/es/dataurl.js
  function getContentFromDataUrl(dataURL) {
    return dataURL.split(/,/)[1];
  }
  function isDataUrl(url) {
    return url.search(/^(data:)/) !== -1;
  }
  function makeDataUrl(content, mimeType) {
    return `data:${mimeType};base64,${content}`;
  }
  async function fetchAsDataURL(url, init, process2) {
    const res = await fetch(url, init);
    if (res.status === 404) {
      throw new Error(`Resource "${res.url}" not found`);
    }
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onloadend = () => {
        try {
          resolve(process2({ res, result: reader.result }));
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsDataURL(blob);
    });
  }
  var cache = {};
  function getCacheKey(url, contentType, includeQueryParams) {
    let key = url.replace(/\?.*/, "");
    if (includeQueryParams) {
      key = url;
    }
    if (/ttf|otf|eot|woff2?/i.test(key)) {
      key = key.replace(/.*\//, "");
    }
    return contentType ? `[${contentType}]${key}` : key;
  }
  async function resourceToDataURL(resourceUrl, contentType, options) {
    const cacheKey = getCacheKey(resourceUrl, contentType, options.includeQueryParams);
    if (cache[cacheKey] != null) {
      return cache[cacheKey];
    }
    if (options.cacheBust) {
      resourceUrl += (/\?/.test(resourceUrl) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime();
    }
    let dataURL;
    try {
      const content = await fetchAsDataURL(resourceUrl, options.fetchRequestInit, ({ res, result }) => {
        if (!contentType) {
          contentType = res.headers.get("Content-Type") || "";
        }
        return getContentFromDataUrl(result);
      });
      dataURL = makeDataUrl(content, contentType);
    } catch (error) {
      dataURL = options.imagePlaceholder || "";
      let msg = `Failed to fetch resource: ${resourceUrl}`;
      if (error) {
        msg = typeof error === "string" ? error : error.message;
      }
      if (msg) {
        console.warn(msg);
      }
    }
    cache[cacheKey] = dataURL;
    return dataURL;
  }

  // ../../node_modules/html-to-image/es/clone-node.js
  async function cloneCanvasElement(canvas) {
    const dataURL = canvas.toDataURL();
    if (dataURL === "data:,") {
      return canvas.cloneNode(false);
    }
    return createImage(dataURL);
  }
  async function cloneVideoElement(video, options) {
    if (video.currentSrc) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
      ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataURL2 = canvas.toDataURL();
      return createImage(dataURL2);
    }
    const poster = video.poster;
    const contentType = getMimeType(poster);
    const dataURL = await resourceToDataURL(poster, contentType, options);
    return createImage(dataURL);
  }
  async function cloneIFrameElement(iframe) {
    var _a;
    try {
      if ((_a = iframe === null || iframe === void 0 ? void 0 : iframe.contentDocument) === null || _a === void 0 ? void 0 : _a.body) {
        return await cloneNode(iframe.contentDocument.body, {}, true);
      }
    } catch (_b) {
    }
    return iframe.cloneNode(false);
  }
  async function cloneSingleNode(node, options) {
    if (isInstanceOfElement(node, HTMLCanvasElement)) {
      return cloneCanvasElement(node);
    }
    if (isInstanceOfElement(node, HTMLVideoElement)) {
      return cloneVideoElement(node, options);
    }
    if (isInstanceOfElement(node, HTMLIFrameElement)) {
      return cloneIFrameElement(node);
    }
    return node.cloneNode(false);
  }
  var isSlotElement = (node) => node.tagName != null && node.tagName.toUpperCase() === "SLOT";
  async function cloneChildren(nativeNode, clonedNode, options) {
    var _a, _b;
    let children = [];
    if (isSlotElement(nativeNode) && nativeNode.assignedNodes) {
      children = toArray(nativeNode.assignedNodes());
    } else if (isInstanceOfElement(nativeNode, HTMLIFrameElement) && ((_a = nativeNode.contentDocument) === null || _a === void 0 ? void 0 : _a.body)) {
      children = toArray(nativeNode.contentDocument.body.childNodes);
    } else {
      children = toArray(((_b = nativeNode.shadowRoot) !== null && _b !== void 0 ? _b : nativeNode).childNodes);
    }
    if (children.length === 0 || isInstanceOfElement(nativeNode, HTMLVideoElement)) {
      return clonedNode;
    }
    await children.reduce((deferred, child) => deferred.then(() => cloneNode(child, options)).then((clonedChild) => {
      if (clonedChild) {
        clonedNode.appendChild(clonedChild);
      }
    }), Promise.resolve());
    return clonedNode;
  }
  function cloneCSSStyle(nativeNode, clonedNode) {
    const targetStyle = clonedNode.style;
    if (!targetStyle) {
      return;
    }
    const sourceStyle = window.getComputedStyle(nativeNode);
    if (sourceStyle.cssText) {
      targetStyle.cssText = sourceStyle.cssText;
      targetStyle.transformOrigin = sourceStyle.transformOrigin;
    } else {
      toArray(sourceStyle).forEach((name) => {
        let value = sourceStyle.getPropertyValue(name);
        if (name === "font-size" && value.endsWith("px")) {
          const reducedFont = Math.floor(parseFloat(value.substring(0, value.length - 2))) - 0.1;
          value = `${reducedFont}px`;
        }
        if (isInstanceOfElement(nativeNode, HTMLIFrameElement) && name === "display" && value === "inline") {
          value = "block";
        }
        if (name === "d" && clonedNode.getAttribute("d")) {
          value = `path(${clonedNode.getAttribute("d")})`;
        }
        targetStyle.setProperty(name, value, sourceStyle.getPropertyPriority(name));
      });
    }
  }
  function cloneInputValue(nativeNode, clonedNode) {
    if (isInstanceOfElement(nativeNode, HTMLTextAreaElement)) {
      clonedNode.innerHTML = nativeNode.value;
    }
    if (isInstanceOfElement(nativeNode, HTMLInputElement)) {
      clonedNode.setAttribute("value", nativeNode.value);
    }
  }
  function cloneSelectValue(nativeNode, clonedNode) {
    if (isInstanceOfElement(nativeNode, HTMLSelectElement)) {
      const clonedSelect = clonedNode;
      const selectedOption = Array.from(clonedSelect.children).find((child) => nativeNode.value === child.getAttribute("value"));
      if (selectedOption) {
        selectedOption.setAttribute("selected", "");
      }
    }
  }
  function decorate(nativeNode, clonedNode) {
    if (isInstanceOfElement(clonedNode, Element)) {
      cloneCSSStyle(nativeNode, clonedNode);
      clonePseudoElements(nativeNode, clonedNode);
      cloneInputValue(nativeNode, clonedNode);
      cloneSelectValue(nativeNode, clonedNode);
    }
    return clonedNode;
  }
  async function ensureSVGSymbols(clone, options) {
    const uses = clone.querySelectorAll ? clone.querySelectorAll("use") : [];
    if (uses.length === 0) {
      return clone;
    }
    const processedDefs = {};
    for (let i = 0; i < uses.length; i++) {
      const use = uses[i];
      const id = use.getAttribute("xlink:href");
      if (id) {
        const exist = clone.querySelector(id);
        const definition = document.querySelector(id);
        if (!exist && definition && !processedDefs[id]) {
          processedDefs[id] = await cloneNode(definition, options, true);
        }
      }
    }
    const nodes = Object.values(processedDefs);
    if (nodes.length) {
      const ns = "http://www.w3.org/1999/xhtml";
      const svg = document.createElementNS(ns, "svg");
      svg.setAttribute("xmlns", ns);
      svg.style.position = "absolute";
      svg.style.width = "0";
      svg.style.height = "0";
      svg.style.overflow = "hidden";
      svg.style.display = "none";
      const defs = document.createElementNS(ns, "defs");
      svg.appendChild(defs);
      for (let i = 0; i < nodes.length; i++) {
        defs.appendChild(nodes[i]);
      }
      clone.appendChild(svg);
    }
    return clone;
  }
  async function cloneNode(node, options, isRoot) {
    if (!isRoot && options.filter && !options.filter(node)) {
      return null;
    }
    return Promise.resolve(node).then((clonedNode) => cloneSingleNode(clonedNode, options)).then((clonedNode) => cloneChildren(node, clonedNode, options)).then((clonedNode) => decorate(node, clonedNode)).then((clonedNode) => ensureSVGSymbols(clonedNode, options));
  }

  // ../../node_modules/html-to-image/es/embed-resources.js
  var URL_REGEX = /url\((['"]?)([^'"]+?)\1\)/g;
  var URL_WITH_FORMAT_REGEX = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g;
  var FONT_SRC_REGEX = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
  function toRegex(url) {
    const escaped = url.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
    return new RegExp(`(url\\(['"]?)(${escaped})(['"]?\\))`, "g");
  }
  function parseURLs(cssText) {
    const urls = [];
    cssText.replace(URL_REGEX, (raw, quotation, url) => {
      urls.push(url);
      return raw;
    });
    return urls.filter((url) => !isDataUrl(url));
  }
  async function embed(cssText, resourceURL, baseURL, options, getContentFromUrl) {
    try {
      const resolvedURL = baseURL ? resolveUrl(resourceURL, baseURL) : resourceURL;
      const contentType = getMimeType(resourceURL);
      let dataURL;
      if (getContentFromUrl) {
        const content = await getContentFromUrl(resolvedURL);
        dataURL = makeDataUrl(content, contentType);
      } else {
        dataURL = await resourceToDataURL(resolvedURL, contentType, options);
      }
      return cssText.replace(toRegex(resourceURL), `$1${dataURL}$3`);
    } catch (error) {
    }
    return cssText;
  }
  function filterPreferredFontFormat(str, { preferredFontFormat }) {
    return !preferredFontFormat ? str : str.replace(FONT_SRC_REGEX, (match) => {
      while (true) {
        const [src, , format] = URL_WITH_FORMAT_REGEX.exec(match) || [];
        if (!format) {
          return "";
        }
        if (format === preferredFontFormat) {
          return `src: ${src};`;
        }
      }
    });
  }
  function shouldEmbed(url) {
    return url.search(URL_REGEX) !== -1;
  }
  async function embedResources(cssText, baseUrl, options) {
    if (!shouldEmbed(cssText)) {
      return cssText;
    }
    const filteredCSSText = filterPreferredFontFormat(cssText, options);
    const urls = parseURLs(filteredCSSText);
    return urls.reduce((deferred, url) => deferred.then((css) => embed(css, url, baseUrl, options)), Promise.resolve(filteredCSSText));
  }

  // ../../node_modules/html-to-image/es/embed-images.js
  async function embedProp(propName, node, options) {
    var _a;
    const propValue = (_a = node.style) === null || _a === void 0 ? void 0 : _a.getPropertyValue(propName);
    if (propValue) {
      const cssString = await embedResources(propValue, null, options);
      node.style.setProperty(propName, cssString, node.style.getPropertyPriority(propName));
      return true;
    }
    return false;
  }
  async function embedBackground(clonedNode, options) {
    if (!await embedProp("background", clonedNode, options)) {
      await embedProp("background-image", clonedNode, options);
    }
    if (!await embedProp("mask", clonedNode, options)) {
      await embedProp("mask-image", clonedNode, options);
    }
  }
  async function embedImageNode(clonedNode, options) {
    const isImageElement = isInstanceOfElement(clonedNode, HTMLImageElement);
    if (!(isImageElement && !isDataUrl(clonedNode.src)) && !(isInstanceOfElement(clonedNode, SVGImageElement) && !isDataUrl(clonedNode.href.baseVal))) {
      return;
    }
    const url = isImageElement ? clonedNode.src : clonedNode.href.baseVal;
    const dataURL = await resourceToDataURL(url, getMimeType(url), options);
    await new Promise((resolve, reject) => {
      clonedNode.onload = resolve;
      clonedNode.onerror = reject;
      const image = clonedNode;
      if (image.decode) {
        image.decode = resolve;
      }
      if (image.loading === "lazy") {
        image.loading = "eager";
      }
      if (isImageElement) {
        clonedNode.srcset = "";
        clonedNode.src = dataURL;
      } else {
        clonedNode.href.baseVal = dataURL;
      }
    });
  }
  async function embedChildren(clonedNode, options) {
    const children = toArray(clonedNode.childNodes);
    const deferreds = children.map((child) => embedImages(child, options));
    await Promise.all(deferreds).then(() => clonedNode);
  }
  async function embedImages(clonedNode, options) {
    if (isInstanceOfElement(clonedNode, Element)) {
      await embedBackground(clonedNode, options);
      await embedImageNode(clonedNode, options);
      await embedChildren(clonedNode, options);
    }
  }

  // ../../node_modules/html-to-image/es/apply-style.js
  function applyStyle(node, options) {
    const { style } = node;
    if (options.backgroundColor) {
      style.backgroundColor = options.backgroundColor;
    }
    if (options.width) {
      style.width = `${options.width}px`;
    }
    if (options.height) {
      style.height = `${options.height}px`;
    }
    const manual = options.style;
    if (manual != null) {
      Object.keys(manual).forEach((key) => {
        style[key] = manual[key];
      });
    }
    return node;
  }

  // ../../node_modules/html-to-image/es/embed-webfonts.js
  var cssFetchCache = {};
  async function fetchCSS(url) {
    let cache2 = cssFetchCache[url];
    if (cache2 != null) {
      return cache2;
    }
    const res = await fetch(url);
    const cssText = await res.text();
    cache2 = { url, cssText };
    cssFetchCache[url] = cache2;
    return cache2;
  }
  async function embedFonts(data, options) {
    let cssText = data.cssText;
    const regexUrl = /url\(["']?([^"')]+)["']?\)/g;
    const fontLocs = cssText.match(/url\([^)]+\)/g) || [];
    const loadFonts = fontLocs.map(async (loc) => {
      let url = loc.replace(regexUrl, "$1");
      if (!url.startsWith("https://")) {
        url = new URL(url, data.url).href;
      }
      return fetchAsDataURL(url, options.fetchRequestInit, ({ result }) => {
        cssText = cssText.replace(loc, `url(${result})`);
        return [loc, result];
      });
    });
    return Promise.all(loadFonts).then(() => cssText);
  }
  function parseCSS(source) {
    if (source == null) {
      return [];
    }
    const result = [];
    const commentsRegex = /(\/\*[\s\S]*?\*\/)/gi;
    let cssText = source.replace(commentsRegex, "");
    const keyframesRegex = new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})", "gi");
    while (true) {
      const matches = keyframesRegex.exec(cssText);
      if (matches === null) {
        break;
      }
      result.push(matches[0]);
    }
    cssText = cssText.replace(keyframesRegex, "");
    const importRegex = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi;
    const combinedCSSRegex = "((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})";
    const unifiedRegex = new RegExp(combinedCSSRegex, "gi");
    while (true) {
      let matches = importRegex.exec(cssText);
      if (matches === null) {
        matches = unifiedRegex.exec(cssText);
        if (matches === null) {
          break;
        } else {
          importRegex.lastIndex = unifiedRegex.lastIndex;
        }
      } else {
        unifiedRegex.lastIndex = importRegex.lastIndex;
      }
      result.push(matches[0]);
    }
    return result;
  }
  async function getCSSRules(styleSheets, options) {
    const ret = [];
    const deferreds = [];
    await Promise.all(styleSheets.map(async (sheet) => {
      if ("cssRules" in sheet) {
        try {
          if (sheet.href) {
            const css = await fetchCSS(sheet.href);
            sheet = new CSSStyleSheet();
            sheet.replaceSync(css);
          }
          toArray(sheet.cssRules || []).forEach((item, index) => {
            if (item.type === CSSRule.IMPORT_RULE) {
              let importIndex = index + 1;
              const url = item.href;
              const deferred = fetchCSS(url).then((metadata) => embedFonts(metadata, options)).then((cssText) => parseCSS(cssText).forEach((rule) => {
                try {
                  sheet.insertRule(rule, rule.startsWith("@import") ? importIndex += 1 : sheet.cssRules.length);
                } catch (error) {
                  console.error("Error inserting rule from remote css", {
                    rule,
                    error
                  });
                }
              })).catch((e) => {
                console.error("Error loading remote css", e.toString());
              });
              deferreds.push(deferred);
            }
          });
        } catch (e) {
          const inline = styleSheets.find((a) => a.href == null) || document.styleSheets[0];
          if (sheet.href != null) {
            deferreds.push(fetchCSS(sheet.href).then((metadata) => embedFonts(metadata, options)).then((cssText) => parseCSS(cssText).forEach((rule) => {
              inline.insertRule(rule, sheet.cssRules.length);
            })).catch((err) => {
              console.error("Error loading remote stylesheet", err);
            }));
          }
          console.error("Error inlining remote css file", e);
        }
      }
    }));
    return Promise.all(deferreds).then(async () => {
      await Promise.all(styleSheets.map(async (sheet) => {
        if ("cssRules" in sheet) {
          try {
            if (sheet.href) {
              const css = await fetchCSS(sheet.href);
              sheet = new CSSStyleSheet();
              sheet.replaceSync(css);
            }
            toArray(sheet.cssRules || []).forEach((item) => {
              ret.push(item);
            });
          } catch (e) {
            console.error(`Error while reading CSS rules from ${sheet.href}`, e);
          }
        }
      }));
      return ret;
    });
  }
  function getWebFontRules(cssRules) {
    return cssRules.filter((rule) => rule.type === CSSRule.FONT_FACE_RULE).filter((rule) => shouldEmbed(rule.style.getPropertyValue("src")));
  }
  async function parseWebFontRules(node, options) {
    if (node.ownerDocument == null) {
      throw new Error("Provided element is not within a Document");
    }
    const styleSheets = toArray(node.ownerDocument.styleSheets);
    const cssRules = await getCSSRules(styleSheets, options);
    return getWebFontRules(cssRules);
  }
  async function getWebFontCSS(node, options) {
    const rules = await parseWebFontRules(node, options);
    const cssTexts = await Promise.all(rules.map((rule) => {
      const baseUrl = rule.parentStyleSheet ? rule.parentStyleSheet.href : null;
      return embedResources(rule.cssText, baseUrl, options);
    }));
    return cssTexts.join("\n");
  }
  async function embedWebFonts(clonedNode, options) {
    const cssText = options.fontEmbedCSS != null ? options.fontEmbedCSS : options.skipFonts ? null : await getWebFontCSS(clonedNode, options);
    if (cssText) {
      const styleNode = document.createElement("style");
      const sytleContent = document.createTextNode(cssText);
      styleNode.appendChild(sytleContent);
      if (clonedNode.firstChild) {
        clonedNode.insertBefore(styleNode, clonedNode.firstChild);
      } else {
        clonedNode.appendChild(styleNode);
      }
    }
  }

  // ../../node_modules/html-to-image/es/index.js
  async function toSvg(node, options = {}) {
    const { width, height } = getImageSize(node, options);
    const clonedNode = await cloneNode(node, options, true);
    await embedWebFonts(clonedNode, options);
    await embedImages(clonedNode, options);
    applyStyle(clonedNode, options);
    const datauri = await nodeToDataURL(clonedNode, width, height);
    return datauri;
  }
  async function toCanvas(node, options = {}) {
    const { width, height } = getImageSize(node, options);
    const svg = await toSvg(node, options);
    const img = await createImage(svg);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const ratio = options.pixelRatio || getPixelRatio();
    const canvasWidth = options.canvasWidth || width;
    const canvasHeight = options.canvasHeight || height;
    canvas.width = canvasWidth * ratio;
    canvas.height = canvasHeight * ratio;
    if (!options.skipAutoScale) {
      checkCanvasDimensions(canvas);
    }
    canvas.style.width = `${canvasWidth}`;
    canvas.style.height = `${canvasHeight}`;
    if (options.backgroundColor) {
      context.fillStyle = options.backgroundColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
  }
  async function toPng(node, options = {}) {
    const canvas = await toCanvas(node, options);
    return canvas.toDataURL();
  }

  // src/MessageHandler/MessageHandler.ts
  var messageHandlers = /* @__PURE__ */ new Map();
  function handleMessage(event) {
    const { type } = event.data;
    const handlersSet = messageHandlers.get(type) ?? /* @__PURE__ */ new Set();
    let handled = false;
    for (const handler of handlersSet) {
      if (event.source === handler.iframeRef?.current?.contentWindow || handler.iframeRef === void 0) {
        handled = true;
        handler(event);
      }
    }
    if (!handled) {
      console.warn(`No handler found for message type: ${type}`);
    }
  }
  function registerMessageHandler(type, handler, iframeRef) {
    handler.iframeRef = iframeRef;
    const handlersSet = messageHandlers.get(type) ?? /* @__PURE__ */ new Set();
    handlersSet.add(handler);
    messageHandlers.set(type, handlersSet);
  }

  // src/common/utils.ts
  function getParentOrigin() {
    const baseURI = document.baseURI;
    const url = new URL(baseURI);
    return url.origin;
  }
  function getRootElement() {
    return document.body.firstChild;
  }
  function arrayBufferToBase64(arrayBuffer) {
    const uint8Array = new Uint8Array(arrayBuffer);
    let binary = "";
    const chunk = 8192;
    for (let i = 0; i < uint8Array.length; i += chunk) {
      const slice = uint8Array.slice(i, i + chunk);
      binary += String.fromCharCode.apply(null, slice);
    }
    return btoa(binary);
  }
  function getMetaTagData(key) {
    const metaData = document.querySelector(`meta[name="${key}"]`);
    const content = metaData?.getAttribute("content") ?? null;
    return content;
  }

  // src/ContentExporter/IframeExportHandler.ts
  async function exportAsPng(event) {
    const node = getRootElement();
    try {
      const dataUri = await toPng(node);
      const message = {
        type: "CONTENT-EXPORTER-SUCCESS" /* Success */,
        id: event.data.id,
        dataUri
      };
      window.parent.postMessage(message, getParentOrigin());
    } catch (error) {
      const errorMessage = {
        type: "CONTENT-EXPORTER-ERROR" /* Error */,
        id: event.data.id,
        error: error.message ?? "Unknown error"
      };
      window.parent.postMessage(errorMessage, getParentOrigin());
    }
  }
  function initContentExporter() {
    registerMessageHandler("CONTENT-EXPORTER-REQUEST" /* Request */, exportAsPng);
  }

  // src/Handlers/common/DrilldownHandler/constants.ts
  var DEFAULT_DRILLDOWN_ACTION = "custom.click";

  // src/Handlers/common/DrilldownHandler/IframeDrilldownHandler.ts
  function handleIframeDrilldown(drilldownArgs) {
    const message = {
      type: "HANDLE-DRILLDOWN" /* HandleDrilldown */,
      ...drilldownArgs,
      originalEvent: { type: drilldownArgs.originalEvent?.type ?? "click" }
    };
    window.parent.postMessage(message, getParentOrigin());
  }
  function addDrilldownListener({
    node,
    action,
    payloadCallback
  }) {
    const studioAction = action ? `${action}.click` : DEFAULT_DRILLDOWN_ACTION;
    node.addEventListener("click", (e) => {
      handleIframeDrilldown({
        action: studioAction,
        payload: payloadCallback ? payloadCallback() : {},
        originalEvent: e
      });
    });
  }

  // src/StateManager/state.ts
  var subscribers = /* @__PURE__ */ new Map();
  var state = {};
  function getIframeState(key) {
    return state[key];
  }
  function setIframeState(key, value, notify = false) {
    state[key] = value;
    if (notify) {
      const keySubscribers = subscribers.get(key);
      if (keySubscribers) {
        keySubscribers.forEach((callback) => callback(value));
      }
    }
  }
  function subscribeToIframeState({
    key,
    callback,
    options
  }) {
    const keyStr = key;
    if (!subscribers.has(keyStr)) {
      subscribers.set(keyStr, /* @__PURE__ */ new Set());
    }
    subscribers.get(keyStr).add(callback);
    if (options?.invokeImmediately) {
      const value = getIframeState(key);
      if (value !== void 0) {
        callback(value);
      }
    }
    const cleanupFunction = () => {
      const keySubscribers = subscribers.get(keyStr);
      if (keySubscribers) {
        keySubscribers.delete(callback);
      }
    };
    if (options?.signal) {
      options.signal.addEventListener("abort", cleanupFunction);
    }
    return cleanupFunction;
  }

  // src/Handlers/studio/DataSourcesHandler/IframeDataSourcesHandler.ts
  var STATE_KEY = "dataSourcesState";
  function handleDataSourcesUpdate(event) {
    const { data } = event.data;
    setIframeState(STATE_KEY, data, true);
  }
  function initIframeDataSourcesHandler() {
    registerMessageHandler("DATA-SOURCES-UPDATE" /* DataSourcesUpdate */, handleDataSourcesUpdate);
  }
  function addDataSourcesListener(callback, options = {}) {
    return subscribeToIframeState({
      key: STATE_KEY,
      callback,
      options
    });
  }
  function getDataSources() {
    return getIframeState(STATE_KEY);
  }

  // src/Handlers/studio/DimensionsHandler/IframeDimensionsHandler.ts
  var STATE_KEY2 = "dimensionsState";
  function handleDimensionsUpdate(event) {
    const { data } = event.data;
    setIframeState(STATE_KEY2, data, true);
  }
  function initIframeDimensionsHandler() {
    registerMessageHandler("DIMENSIONS-UPDATE" /* DimensionsUpdate */, handleDimensionsUpdate);
  }
  function addDimensionsListener(callback, options = {}) {
    return subscribeToIframeState({
      key: STATE_KEY2,
      callback,
      options
    });
  }
  function getDimensions() {
    return getIframeState(STATE_KEY2);
  }

  // src/Handlers/studio/ErrorHandler/IframeErrorHandler.ts
  var STATE_KEY3 = "errorState";
  function setError(message) {
    const errorState = { message };
    setIframeState(STATE_KEY3, errorState.message, true);
    const msg = {
      type: "ERROR-UPDATE" /* ErrorUpdate */,
      data: errorState
    };
    window.parent.postMessage(msg, getParentOrigin());
  }
  function clearError() {
    setIframeState(STATE_KEY3, null, true);
    const msg = {
      type: "ERROR-CLEAR" /* ErrorClear */
    };
    window.parent.postMessage(msg, getParentOrigin());
  }
  function getError() {
    return getIframeState(STATE_KEY3);
  }
  function addErrorListener(callback, options = {}) {
    return subscribeToIframeState({
      key: STATE_KEY3,
      callback,
      options
    });
  }

  // src/Handlers/studio/ModeHandler/IframeModeHandler.ts
  var STATE_KEY4 = "modeState";
  function handleModeUpdate(event) {
    const { data } = event.data;
    setIframeState(STATE_KEY4, data, true);
  }
  function initIframeModeHandler() {
    registerMessageHandler("MODE-UPDATE" /* ModeUpdate */, handleModeUpdate);
  }
  function addModeListener(callback, options = {}) {
    return subscribeToIframeState({
      key: STATE_KEY4,
      callback,
      options
    });
  }
  function getMode() {
    return getIframeState(STATE_KEY4);
  }

  // src/Handlers/studio/OptionsHandler/IframeOptionsHandler.ts
  var STATE_KEY5 = "optionsState";
  function handleOptionsUpdate(event) {
    const { data } = event.data;
    setIframeState(STATE_KEY5, data, true);
  }
  function initIframeOptionsHandler() {
    registerMessageHandler("OPTIONS-UPDATE" /* OptionsUpdate */, handleOptionsUpdate);
  }
  function addOptionsListener(callback, options = {}) {
    return subscribeToIframeState({
      key: STATE_KEY5,
      callback,
      options
    });
  }
  function getOptions() {
    return getIframeState(STATE_KEY5);
  }
  function setOptions(options) {
    if (getMode()?.mode === "edit") {
      const message = {
        type: "OPTIONS-UPDATE" /* OptionsUpdate */,
        data: {
          options
        }
      };
      globalThis.parent.postMessage(message, getParentOrigin());
    } else {
      throw new Error("Cannot set options in view mode");
    }
  }

  // src/Handlers/studio/ThemeHandler/IframeThemeHandler.ts
  var STATE_KEY6 = "themeState";
  function handleThemeUpdate(event) {
    const { data } = event.data;
    const themeMetaTag = document.querySelector('meta[name="color-scheme"]');
    if (themeMetaTag) {
      themeMetaTag.setAttribute("content", data.theme);
    }
    setIframeState(STATE_KEY6, data, true);
  }
  function initIframeThemeHandler() {
    registerMessageHandler("THEME-UPDATE" /* ThemeUpdate */, handleThemeUpdate);
  }
  function addThemeListener(callback, options = {}) {
    return subscribeToIframeState({
      key: STATE_KEY6,
      callback,
      options
    });
  }
  function getTheme() {
    return getIframeState(STATE_KEY6);
  }

  // src/Handlers/studio/TokensHandler/IframeTokensHandler.ts
  var STATE_KEY7 = "tokensState";
  function handleTokensUpdate(event) {
    const { data } = event.data;
    setIframeState(STATE_KEY7, data, true);
  }
  function initIframeTokensHandler() {
    registerMessageHandler("TOKENS-UPDATE" /* TokensUpdate */, handleTokensUpdate);
  }
  function addTokensListener(callback, options = {}) {
    return subscribeToIframeState({
      key: STATE_KEY7,
      callback,
      options
    });
  }
  function getTokens() {
    return getIframeState(STATE_KEY7);
  }

  // src/DashboardExtensionAPI/index.ts
  var DashboardExtensionAPI = {
    addDataSourcesListener,
    getDataSources,
    addModeListener,
    getMode,
    addDimensionsListener,
    getDimensions,
    addOptionsListener,
    getOptions,
    setOptions,
    addThemeListener,
    getTheme,
    addTokensListener,
    getTokens,
    addDrilldownListener,
    triggerDrilldown: handleIframeDrilldown,
    addErrorListener,
    getError,
    setError,
    clearError
  };
  function initDashboardExtensionAPI() {
    const globalWithExtensionAPI = globalThis;
    globalWithExtensionAPI.DashboardExtensionAPI = new Proxy(DashboardExtensionAPI, {
      get(target, prop, receiver) {
        return Reflect.get(target, prop, receiver) ?? (() => {
          throw new Error(`This version of Dashboard Studio does not implement ${String(prop)}`);
        });
      },
      set() {
        throw new Error("DashboardExtensionAPI is read-only");
      }
    });
  }

  // src/FetchHandler/IframeFetchHandler.ts
  var pendingFetchRequests = /* @__PURE__ */ new Map();
  function handleFetchError(event) {
    const { requestId } = event.data;
    const request = pendingFetchRequests.get(requestId);
    if (!request) {
      return;
    }
    pendingFetchRequests.delete(requestId);
    request.reject(new Error(event.data.error));
  }
  function handleFetchResponse(event) {
    const { requestId } = event.data;
    const request = pendingFetchRequests.get(requestId);
    if (!request) {
      return;
    }
    pendingFetchRequests.delete(requestId);
    const { arrayBuffer, init } = event.data;
    const response = new Response(arrayBuffer, init);
    request.resolve(response);
  }
  function initIframeFetchSetup() {
    const customWindow = window;
    let requestId = 0;
    customWindow.originalFetch = window.fetch;
    const parentOrigin = getParentOrigin();
    customWindow.fetch = (resource, options = {}) => {
      const resolvedUrl = resource instanceof Request ? resource.url : resource;
      const absoluteUrl = new URL(resolvedUrl, parentOrigin);
      if (absoluteUrl.origin === parentOrigin) {
        const proxyOptions = resource instanceof Request ? { method: resource.method, headers: Object.fromEntries(resource.headers.entries()), ...options } : options;
        return new Promise((resolve, reject) => {
          requestId++;
          pendingFetchRequests.set(requestId, { resolve, reject });
          window.parent.postMessage(
            {
              type: "FETCH-PROXY-REQUEST" /* FetchProxyRequest */,
              requestId,
              url: absoluteUrl.href,
              options: proxyOptions
            },
            getParentOrigin()
          );
        });
      }
      return customWindow.originalFetch(resource, options);
    };
    registerMessageHandler("FETCH-PROXY-RESPONSE" /* FetchProxyResponse */, handleFetchResponse);
    registerMessageHandler("FETCH-PROXY-ERROR" /* FetchProxyError */, handleFetchError);
  }

  // src/Handlers/common/FocusHandler/IframeFocusHandler.ts
  function initIframeFocusHandler() {
    window.addEventListener("focus", () => {
      const message = {
        type: "FOCUS-HANDLER-FOCUS-EVENT" /* FocusEvent */
      };
      window.parent.postMessage(message, getParentOrigin());
    });
  }

  // src/IframeUtils/Fonts.ts
  var urlRegex = /url\(['"]?([^'")]+\.woff)['"]?\)/g;
  var initIframeFonts = async () => {
    const bootstrapCSSUrl = getMetaTagData("bootstrap-css-link");
    const response = await fetch(bootstrapCSSUrl, { cache: "force-cache" });
    const bootstrapCSSText = await response.text();
    const fontMatches = bootstrapCSSText.matchAll(urlRegex) ?? [];
    const resolvedFonts = {};
    await Promise.all(
      Array.from(fontMatches).map(async (match) => {
        const fontUrl = match[1];
        if (typeof fontUrl !== "string") {
          return;
        }
        const response2 = await fetch(fontUrl, { cache: "force-cache" });
        const arrayBuffer = await response2.arrayBuffer();
        const base64 = arrayBufferToBase64(arrayBuffer);
        resolvedFonts[fontUrl] = `url('data:application/x-font-woff;base64,${base64}')`;
      })
    );
    const bootstrapCSSWithFontsLoaded = bootstrapCSSText.replace(urlRegex, (match, fontUrl) => resolvedFonts[fontUrl] ?? match).trim();
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(bootstrapCSSWithFontsLoaded);
    document.adoptedStyleSheets = [sheet];
  };

  // src/IframeUtils/initStudioIframe.ts
  function initStudioIframe() {
    window.parent.postMessage(
      {
        type: "IFRAME-INIT" /* Init */
      },
      getParentOrigin()
    );
  }

  // src/MessageHandler/IframeMessageHandler.ts
  function handleIframeMessage(event) {
    if (event.origin !== getParentOrigin()) {
      return;
    }
    return handleMessage(event);
  }
  function initIframeMessageHandler() {
    return window.addEventListener("message", handleIframeMessage);
  }

  // src/Iframe/studio.ts
  initIframeMessageHandler();
  initIframeFetchSetup();
  initIframeFonts();
  initIframeFocusHandler();
  initIframeDataSourcesHandler();
  initIframeOptionsHandler();
  initIframeDimensionsHandler();
  initIframeModeHandler();
  initContentExporter();
  initDashboardExtensionAPI();
  initStudioIframe();
  initIframeTokensHandler();
  initIframeThemeHandler();
})();
//# sourceMappingURL=studio.js.map
