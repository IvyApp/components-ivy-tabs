"use strict";
var IvyTabComponent = require("./components/ivy-tab")["default"] || require("./components/ivy-tab");
var IvyTabListComponent = require("./components/ivy-tab-list")["default"] || require("./components/ivy-tab-list");
var IvyTabPanelComponent = require("./components/ivy-tab-panel")["default"] || require("./components/ivy-tab-panel");
var IvyTabsComponent = require("./components/ivy-tabs")["default"] || require("./components/ivy-tabs");
var initializer = require("./initializer")["default"] || require("./initializer");

exports.IvyTabComponent = IvyTabComponent;
exports.IvyTabListComponent = IvyTabListComponent;
exports.IvyTabPanelComponent = IvyTabPanelComponent;
exports.IvyTabsComponent = IvyTabsComponent;
exports.initializer = initializer;