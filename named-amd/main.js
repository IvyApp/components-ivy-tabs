define("ivy-tabs/components/ivy-tab-list",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    __exports__["default"] = Ember.Component.extend({
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
  });
define("ivy-tabs/components/ivy-tab-panel",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    __exports__["default"] = Ember.Component.extend({
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
  });
define("ivy-tabs/components/ivy-tab",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    __exports__["default"] = Ember.Component.extend({
      tagName: 'li',
      attributeBindings: ['aria-controls', 'aria-expanded', 'aria-selected', 'role', 'selected', 'tabindex'],
      classNames: ['ivy-tab'],
      classNameBindings: ['active'],

      'aria-controls': Ember.computed.alias('tabPanel.elementId').readOnly(),

      'aria-expanded': Ember.computed.alias('aria-selected'),

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
  });
define("ivy-tabs/components/ivy-tabs",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    __exports__["default"] = Ember.Component.extend({
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