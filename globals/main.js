!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),(f.ivy||(f.ivy={})).tabs=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

exports["default"] = Ember.Component.extend({
  classNames: ['ivy-tab-list'],
  tagName: 'ul',
  attributeBindings: ['aria-multiselectable', 'role'],

  /**
   * See http://www.w3.org/TR/wai-aria/roles#tablist
   *
   * @property role
   * @type {String}
   */
  role: 'tablist',

  'aria-multiselectable': 'false',

  init: function() {
    this._super();
    this.set('tabs', Ember.A());
  },

  registerTab: function(tab) {
    this.get('tabs').pushObject(tab);
  },

  registerWithTabsContainer: Ember.on('didInsertElement', function() {
    this.get('tabsContainer').registerTabList(this);
  }),


  selectTab: function(tab) {
    this.get('tabsContainer').selectTab(tab);
  },

  selectTabAtIndex: function(index) {
    var tab = this.get('tabs').objectAt(index);
    if (tab) { tab.select(); }
  },

  tabsContainer: Ember.computed.readOnly('parentView'),

  unregisterTab: function(tab) {
    this.get('tabs').removeObject(tab);
  },

  unregisterWithTabsContainer: Ember.on('willDestroyElement', function() {
    this.get('tabsContainer').unregisterTabList(this);
  })
});
},{}],2:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

exports["default"] = Ember.Component.extend({
  classNames: ['ivy-tab-panel'],
  classNameBindings: ['active'],
  attributeBindings: ['aria-labeledby', 'role'],

  /**
   * See http://www.w3.org/TR/wai-aria/roles#tabpanel
   *
   * @property role
   * @type {String}
   */
  role: 'tabpanel',

  activeClass: 'active',

  _isActive: Ember.computed.readOnly('tab._isActive'),

  active: Ember.computed(function() {
    return this.get('_isActive') ? this.get('activeClass') : false;
  }).property('_isActive', 'activeClass'),

  'aria-labeledby': Ember.computed.readOnly('tab.elementId'),

  isVisible: Ember.computed.readOnly('_isActive'),

  registerWithTabsContainer: Ember.on('didInsertElement', function() {
    this.get('tabsContainer').registerTabPanel(this);
  }),

  tab: Ember.computed(function() {
    var tabs = this.get('tabs');
    if (tabs) { return tabs.objectAt(this.get('tabPanels').indexOf(this)); }
  }).property('tabs.@each', 'tabPanels.@each'),

  tabList: Ember.computed.readOnly('tabsContainer.tabList'),

  tabPanels: Ember.computed.readOnly('tabsContainer.tabPanels'),

  tabs: Ember.computed.readOnly('tabList.tabs'),

  tabsContainer: Ember.computed.readOnly('parentView'),

  unregisterWithTabsContainer: Ember.on('willDestroyElement', function() {
    this.get('tabsContainer').unregisterTabPanel(this);
  })
});
},{}],3:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

exports["default"] = Ember.Component.extend({
  classNames: ['ivy-tab'],
  classNameBindings: ['active'],
  tagName: 'li',
  attributeBindings: ['aria-controls', 'aria-expanded', 'aria-selected',
                      'role', 'selected', 'tabindex'],

  /**
   * See http://www.w3.org/TR/wai-aria/roles#tab
   *
   * @property role
   * @type {String}
   */
  role: 'tab',

  activeClass: 'active',

  'aria-controls': Ember.computed.readOnly('tabPanel.elementId'),

  'aria-expanded': Ember.computed.readOnly('aria-selected'),

  'aria-selected': Ember.computed(function() {
    return this.get('_isActive') + ''; // coerce to 'true' or 'false'
  }).property('_isActive'),

  active: Ember.computed(function() {
    return this.get('_isActive') ? this.get('activeClass') : false;
  }).property('_isActive', 'activeClass'),

  _isActive: Ember.computed(function() {
    return this.get('tabsContainer.activeTab') === this;
  }).property('tabsContainer.activeTab'),

  registerWithTabList: Ember.on('didInsertElement', function() {
    this.get('tabList').registerTab(this);
  }),

  select: Ember.on('click', function() {
    this.get('tabList').selectTab(this);
  }),

  selected: Ember.computed(function() {
    if (this.get('_isActive')) { return 'selected'; }
  }).property('_isActive'),

  tabList: Ember.computed.readOnly('parentView'),

  tabPanel: Ember.computed(function() {
    return this.get('tabPanels').objectAt(this.get('tabs').indexOf(this));
  }).property('tabPanels.@each'),

  tabPanels: Ember.computed.readOnly('tabsContainer.tabPanels'),

  tabindex: Ember.computed(function() {
    if (this.get('_isActive')) { return 0; }
  }).property('_isActive'),

  tabs: Ember.computed.readOnly('tabList.tabs'),

  tabsContainer: Ember.computed.readOnly('tabList.tabsContainer'),

  unregisterWithTabList: Ember.on('willDestroyElement', function() {
    this.get('tabList').unregisterTab(this);
  })
});
},{}],4:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

exports["default"] = Ember.Component.extend({
  activeTab: null,

  classNames: ['ivy-tabs'],

  init: function() {
    this._super();
    this.set('tabPanels', Ember.A());
  },

  registerTabList: function(tabList) {
    this.set('tabList', tabList);
    this.addObserver('selectedIndex', this, this._selectedIndexDidChange);
    Ember.run.once(this, this._selectedIndexDidChange);
  },

  registerTabPanel: function(tabPanel) {
    this.get('tabPanels').pushObject(tabPanel);
  },

  selectTab: function(tab) {
    this.set('activeTab', tab);
  },

  selectedIndex: 0,

  tabList: null,

  tabPanels: null,

  unregisterTabList: function(tabList) {
    this.removeObserver('selectedIndex', this, this._selectedIndexDidChange);
  },

  unregisterTabPanel: function(tabPanel) {
    this.get('tabPanels').removeObject(tabPanel);
  },

  _selectedIndexDidChange: function() {
    this.get('tabList').selectTabAtIndex(this.get('selectedIndex'));
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