"use strict";
var IvyTabComponent = require("./components/ivy-tab")["default"] || require("./components/ivy-tab");
var IvyTabListComponent = require("./components/ivy-tab-list")["default"] || require("./components/ivy-tab-list");
var IvyTabPanelComponent = require("./components/ivy-tab-panel")["default"] || require("./components/ivy-tab-panel");
var IvyTabsComponent = require("./components/ivy-tabs")["default"] || require("./components/ivy-tabs");

exports["default"] = {
  name: 'ivy-tabs',

  initialize: function(container) {
    container.register('component:ivy-tab', IvyTabComponent);
    container.register('component:ivy-tab-list', IvyTabListComponent);
    container.register('component:ivy-tab-panel', IvyTabPanelComponent);
    container.register('component:ivy-tabs', IvyTabsComponent);
  }
};