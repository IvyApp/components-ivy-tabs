!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),(f.ivy||(f.ivy={})).tabs=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

exports["default"] = Ember.Component.extend({
  tagName: 'ul',
  attributeBindings: ['aria-multiselectable', 'role'],
  classNames: ['ivy-tab-list'],

  'aria-multiselectable': 'false',

  role: 'tablist',

  initTabs: Ember.on('init', function() {
    this.set('tabs', Ember.A());
  }),

  registerTab: function(tab) {
    this.get('tabs').pushObject(tab);
  },

  registerWithTabsContainer: Ember.on('didInsertElement', function() {
    this.get('tabsContainer').registerTabList(this);
  }),

  selectPreviousTab: function() {
    var index = this.get('selectedIndex');
    if (index > 0) { this.selectTabByIndex(index - 1); }
  },

  selectedIndex: Ember.computed.alias('tabsContainer.selectedIndex'),

  selectedTab: Ember.computed(function() {
    return this.get('tabs').objectAt(this.get('selectedIndex'));
  }).property('selectedIndex', 'tabs.[]'),

  selectTab: function(tab) {
    this.selectTabByIndex(this.get('tabs').indexOf(tab));
  },

  selectTabByIndex: function(index) {
    this.set('selectedIndex', index);
  },

  tabsContainer: Ember.computed.alias('parentView').readOnly(),

  unregisterTab: function(tab) {
    this.get('tabs').removeObject(tab);
    if (tab.get('isSelected')) { this.selectPreviousTab(); }
  },

  unregisterWithTabsContainer: Ember.on('willDestroyElement', function() {
    this.get('tabsContainer').unregisterTabList(this);
  })
});
},{}],2:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

exports["default"] = Ember.Component.extend({
  attributeBindings: ['aria-labeledby', 'role'],
  classNames: ['ivy-tab-panel'],
  classNameBindings: ['active'],

  'aria-labeledby': Ember.computed.alias('tab.elementId').readOnly(),

  role: 'tabpanel',

  active: Ember.computed(function() {
    if (this.get('isSelected')) { return this.get('activeClass'); }
  }).property('isSelected'),

  activeClass: 'active',

  index: Ember.computed(function() {
    return this.get('tabPanels').indexOf(this);
  }).property('tabPanels.[]'),

  isSelected: Ember.computed.alias('tab.isSelected').readOnly(),

  isVisible: Ember.computed.alias('isSelected').readOnly(),

  registerWithTabsContainer: Ember.on('didInsertElement', function() {
    this.get('tabsContainer').registerTabPanel(this);
  }),

  tab: Ember.computed(function() {
    var tabs = this.get('tabs');
    if (tabs) { return tabs.objectAt(this.get('index')); }
  }).property('tabs.[]', 'index'),

  tabList: Ember.computed.alias('tabsContainer.tabList').readOnly(),

  tabPanels: Ember.computed.alias('tabsContainer.tabPanels').readOnly(),

  tabs: Ember.computed.alias('tabList.tabs').readOnly(),

  tabsContainer: Ember.computed.alias('parentView').readOnly(),

  unregisterWithTabsContainer: Ember.on('willDestroyElement', function() {
    this.get('tabsContainer').unregisterTabPanel(this);
  }),
});
},{}],3:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

exports["default"] = Ember.Component.extend({
  tagName: 'li',
  attributeBindings: ['aria-controls', 'aria-expanded', 'aria-selected', 'role', 'selected', 'tabindex'],
  classNames: ['ivy-tab'],
  classNameBindings: ['active'],

  'aria-controls': Ember.computed.alias('tabPanel.elementId').readOnly(),

  'aria-expanded': Ember.computed.alias('aria-selected').readOnly(),

  'aria-selected': Ember.computed(function() {
    return this.get('isSelected') + ''; // coerce to 'true' or 'false'
  }).property('isSelected'),

  role: 'tab',

  selected: Ember.computed(function() {
    if (this.get('isSelected')) { return 'selected'; }
  }).property('isSelected'),

  tabindex: Ember.computed(function() {
    if (this.get('isSelected')) { return 0; }
  }).property('isSelected'),

  active: Ember.computed(function() {
    if (this.get('isSelected')) { return this.get('activeClass'); }
  }).property('isSelected'),

  activeClass: 'active',

  index: Ember.computed(function() {
    return this.get('tabs').indexOf(this);
  }).property('tabs.[]'),

  isSelected: Ember.computed(function() {
    return this.get('tabList.selectedTab') === this;
  }).property('tabList.selectedTab'),

  registerWithTabList: Ember.on('didInsertElement', function() {
    this.get('tabList').registerTab(this);
  }),

  select: Ember.on('click', function() {
    this.get('tabList').selectTab(this);
  }),

  tabList: Ember.computed.alias('parentView').readOnly(),

  tabPanel: Ember.computed(function() {
    return this.get('tabPanels').objectAt(this.get('index'));
  }).property('tabPanels.[]', 'index'),

  tabPanels: Ember.computed.alias('tabsContainer.tabPanels').readOnly(),

  tabs: Ember.computed.alias('tabList.tabs').readOnly(),

  tabsContainer: Ember.computed.alias('tabList.tabsContainer').readOnly(),

  unregisterWithTabList: Ember.on('willDestroyElement', function() {
    this.get('tabList').unregisterTab(this);
  })
});
},{}],4:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

exports["default"] = Ember.Component.extend({
  classNames: ['ivy-tabs'],

  selectedIndex: 0,

  initTabPanels: Ember.on('init', function() {
    this.set('tabPanels', Ember.A());
  }),

  registerTabList: function(tabList) {
    this.set('tabList', tabList);
  },

  registerTabPanel: function(tabPanel) {
    this.get('tabPanels').pushObject(tabPanel);
  },

  unregisterTabList: function(tabList) {
    this.set('tabList', null);
  },

  unregisterTabPanel: function(tabPanel) {
    this.get('tabPanels').removeObject(tabPanel);
  }
});
},{}],5:[function(_dereq_,module,exports){
"use strict";
var IvyTabComponent = _dereq_("./components/ivy-tab")["default"] || _dereq_("./components/ivy-tab");
var IvyTabListComponent = _dereq_("./components/ivy-tab-list")["default"] || _dereq_("./components/ivy-tab-list");
var IvyTabPanelComponent = _dereq_("./components/ivy-tab-panel")["default"] || _dereq_("./components/ivy-tab-panel");
var IvyTabsComponent = _dereq_("./components/ivy-tabs")["default"] || _dereq_("./components/ivy-tabs");

exports["default"] = {
  name: 'ivy-tabs',

  initialize: function(container) {
    container.register('component:ivy-tab', IvyTabComponent);
    container.register('component:ivy-tab-list', IvyTabListComponent);
    container.register('component:ivy-tab-panel', IvyTabPanelComponent);
    container.register('component:ivy-tabs', IvyTabsComponent);
  }
};
},{"./components/ivy-tab":3,"./components/ivy-tab-list":1,"./components/ivy-tab-panel":2,"./components/ivy-tabs":4}],6:[function(_dereq_,module,exports){
"use strict";
var IvyTabComponent = _dereq_("./components/ivy-tab")["default"] || _dereq_("./components/ivy-tab");
var IvyTabListComponent = _dereq_("./components/ivy-tab-list")["default"] || _dereq_("./components/ivy-tab-list");
var IvyTabPanelComponent = _dereq_("./components/ivy-tab-panel")["default"] || _dereq_("./components/ivy-tab-panel");
var IvyTabsComponent = _dereq_("./components/ivy-tabs")["default"] || _dereq_("./components/ivy-tabs");
var initializer = _dereq_("./initializer")["default"] || _dereq_("./initializer");

exports.IvyTabComponent = IvyTabComponent;
exports.IvyTabListComponent = IvyTabListComponent;
exports.IvyTabPanelComponent = IvyTabPanelComponent;
exports.IvyTabsComponent = IvyTabsComponent;
exports.initializer = initializer;
},{"./components/ivy-tab":3,"./components/ivy-tab-list":1,"./components/ivy-tab-panel":2,"./components/ivy-tabs":4,"./initializer":5}]},{},[6])
(6)
});