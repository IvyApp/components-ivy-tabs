define("ivy-tabs/components/ivy-tab-list",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    __exports__["default"] = Ember.Component.extend({
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
        var tabs = this.get('tabs');
        var index = tab.get('index');

        tabs.removeObject(tab);

        if (tab.get('_isActive')) {
          if (tabs.get('length') === 0) { return; }
          if (index > 0) { index--; }
          tabs.objectAt(index).select();
        }
      },

      unregisterWithTabsContainer: Ember.on('willDestroyElement', function() {
        this.get('tabsContainer').unregisterTabList(this);
      })
    });
  });
define("ivy-tabs/components/ivy-tab-panel",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    __exports__["default"] = Ember.Component.extend({
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
  });
define("ivy-tabs/components/ivy-tab",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    __exports__["default"] = Ember.Component.extend({
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

      index: Ember.computed(function() {
        return this.get('tabs').indexOf(this);
      }).property('tabs.@each'),

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
        return this.get('tabPanels').objectAt(this.get('index'));
      }).property('tabPanels.@each', 'index'),

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
  });
define("ivy-tabs/components/ivy-tabs",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    __exports__["default"] = Ember.Component.extend({
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
  });
define("ivy-tabs/initializer",
  ["./components/ivy-tab","./components/ivy-tab-list","./components/ivy-tab-panel","./components/ivy-tabs","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var IvyTabComponent = __dependency1__["default"] || __dependency1__;
    var IvyTabListComponent = __dependency2__["default"] || __dependency2__;
    var IvyTabPanelComponent = __dependency3__["default"] || __dependency3__;
    var IvyTabsComponent = __dependency4__["default"] || __dependency4__;

    __exports__["default"] = {
      name: 'ivy-tabs',

      initialize: function(container) {
        container.register('component:ivy-tab', IvyTabComponent);
        container.register('component:ivy-tab-list', IvyTabListComponent);
        container.register('component:ivy-tab-panel', IvyTabPanelComponent);
        container.register('component:ivy-tabs', IvyTabsComponent);
      }
    };
  });
define("ivy-tabs",
  ["./components/ivy-tab","./components/ivy-tab-list","./components/ivy-tab-panel","./components/ivy-tabs","./initializer","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __exports__) {
    "use strict";
    var IvyTabComponent = __dependency1__["default"] || __dependency1__;
    var IvyTabListComponent = __dependency2__["default"] || __dependency2__;
    var IvyTabPanelComponent = __dependency3__["default"] || __dependency3__;
    var IvyTabsComponent = __dependency4__["default"] || __dependency4__;
    var initializer = __dependency5__["default"] || __dependency5__;

    __exports__.IvyTabComponent = IvyTabComponent;
    __exports__.IvyTabListComponent = IvyTabListComponent;
    __exports__.IvyTabPanelComponent = IvyTabPanelComponent;
    __exports__.IvyTabsComponent = IvyTabsComponent;
    __exports__.initializer = initializer;
  });