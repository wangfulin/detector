"use strict";
var Detector = require("./detector.js");
var WebRules = require("./web-rules.js");
var userAgent = navigator.userAgent || "";
var appVersion = navigator.appVersion || "";
var vendor = navigator.vendor || "";
var ua = userAgent + " " + appVersion + " " + vendor;
var detector = new Detector(WebRules);
function IEMode(ua) {
  if (!WebRules.re_msie.test(ua)) {
    return null;
  }
  var m;
  var engineMode;
  var engineVersion;
  var browserMode;
  var browserVersion;
  if (ua.indexOf("trident/") !== -1) {
    m = /\btrident\/([0-9.]+)/.exec(ua);
    if (m && m.length >= 2) {
      engineVersion = m[1];
      var v_version = m[1].split(".");
      v_version[0] = parseInt(v_version[0], 10) + 4;
      browserVersion = v_version.join(".");
    }
  }
  m = WebRules.re_msie.exec(ua);
  browserMode = m[1];
  var v_mode = m[1].split(".");
  if (typeof browserVersion === "undefined") {
    browserVersion = browserMode;
  }
  v_mode[0] = parseInt(v_mode[0], 10) - 4;
  engineMode = v_mode.join(".");
  if (typeof engineVersion === "undefined") {
    engineVersion = engineMode;
  }
  return {
    browserVersion: browserVersion,
    browserMode: browserMode,
    engineVersion: engineVersion,
    engineMode: engineMode,
    compatible: engineVersion !== engineMode
  };
}
function WebParse(ua) {
  var d = detector.parse(ua);
  var ieCore = IEMode(ua);
  if (ieCore) {
    var engineName = d.engine.name;
    var engineVersion = ieCore.engineVersion || ieCore.engineMode;
    var ve = parseFloat(engineVersion);
    var engineMode = ieCore.engineMode;
    d.engine = {
      name: engineName,
      version: ve,
      fullVersion: engineVersion,
      mode: parseFloat(engineMode),
      fullMode: engineMode,
      compatible: ieCore ? ieCore.compatible : false
    };
    d.engine[d.engine.name] = ve;
    var browserName = d.browser.name;
    var browserVersion = d.browser.fullVersion;
    if (browserName === "ie") {
      browserVersion = ieCore.browserVersion;
    }
    var browserMode = ieCore.browserMode;
    var vb = parseFloat(browserVersion);
    d.browser = {
      name: browserName,
      version: vb,
      fullVersion: browserVersion,
      mode: parseFloat(browserMode),
      fullMode: browserMode,
      compatible: ieCore ? ieCore.compatible : false
    };
    d.browser[browserName] = vb;
  }
  return d;
}
var Tan = WebParse(ua);
Tan.parse = WebParse;
module.exports = Tan;