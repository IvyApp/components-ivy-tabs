define("ivy-tabs/components/ivy-tab-list",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    /**
     * @module ivy-tabs
     */

    /**
     * @class IvyTabListComponent
     * @namespace ivy.tabs
     * @extends Ember.Component
     */
    __exports__["default"] = Ember.Component.extend({
      tagName: 'ul',
      attributeBindings: ['aria-multiselectable', 'role'],
      classNames: ['ivy-tab-list'],

      /**
       * Tells screenreaders that only one tab can be selected at a time.
       *
       * @property aria-multiselectable
       * @type String
       * @default 'false'
       */
      'aria-multiselectable': 'false',

      /**
       * The `role` attribute of the tab list element.
       *
       * See http://www.w3.org/TR/wai-aria/roles#tablist
       *
       * @property role
       * @type String
       * @default 'tablist'
       */
      role: 'tablist',

      /**
       * Adds a tab to the `tabs` array.
       *
       * @method registerTab
       * @param {ivy.tabs.IvyTabComponent} tab
       */
      registerTab: function(tab) {
        this.get('tabs').pushObject(tab);
      },

      /**
       * Selects the previous tab in the list, if any.
       *
       * @method selectPreviousTab
       */
      selectPreviousTab: function() {
        var index = this.get('selectedIndex');
        if (index > 0) { this.selectTabByIndex(index - 1); }
      },

      selectedIndex: Ember.computed.alias('tabsContainer.selectedIndex'),

      /**
       * The currently-selected `ivy-tab` instance.
       *
       * @property selectedTab
       * @type ivy.tabs.IvyTabComponent
       */
      selectedTab: Ember.computed(function() {
        return this.get('tabs').objectAt(this.get('selectedIndex'));
      }).property('selectedIndex', 'tabs.[]'),

      /**
       * Select the given tab.
       *
       * @method selectTab
       * @param {ivy.tabs.IvyTabComponent} tab
       */
      selectTab: function(tab) {
        this.selectTabByIndex(this.get('tabs').indexOf(tab));
      },

      /**
       * Select the tab at `index`.
       *
       * @method selectTabByIndex
       * @param {Number} index
       */
      selectTabByIndex: function(index) {
        this.set('selectedIndex', index);
      },

      /**
       * The `ivy-tabs` component.
       *
       * @property tabsContainer
       * @type ivy.tabs.IvyTabsComponent
       * @readOnly
       */
      tabsContainer: Ember.computed.alias('parentView').readOnly(),

      /**
       * Removes a tab from the `tabs` array.
       *
       * @method unregisterTab
       * @param {ivy.tabs.IvyTabComponent} tab
       */
      unregisterTab: function(tab) {
        this.get('tabs').removeObject(tab);
        if (tab.get('isSelected')) { this.selectPreviousTab(); }
      },

      _initTabs: Ember.on('init', function() {
        this.set('tabs', Ember.A());
      }),

      _registerWithTabsContainer: Ember.on('didInsertElement', function() {
        this.get('tabsContainer').registerTabList(this);
      }),

      _unregisterWithTabsContainer: Ember.on('willDestroyElement', function() {
        this.get('tabsContainer').unregisterTabList(this);
      })
    });
  });
define("ivy-tabs/components/ivy-tab-panel",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    /**
     * @module ivy-tabs
     */

    /**
     * @class IvyTabPanelComponent
     * @namespace ivy.tabs
     * @extends Ember.Component
     */
    __exports__["default"] = Ember.Component.extend({
      attributeBindings: ['aria-labeledby', 'role'],
      classNames: ['ivy-tab-panel'],
      classNameBindings: ['active'],

      /**
       * Tells screenreaders which tab labels this panel.
       *
       * See http://www.w3.org/TR/wai-aria/states_and_properties#aria-labelledby
       *
       * @property aria-labeledby
       * @type String
       * @readOnly
       */
      'aria-labeledby': Ember.computed.alias('tab.elementId').readOnly(),

      /**
       * See http://www.w3.org/TR/wai-aria/roles#tabpanel
       *
       * @property role
       * @type String
       * @default 'tabpanel'
       */
      role: 'tabpanel',

      /**
       * Accessed as a className binding to apply the panel's `activeClass` CSS
       * class to the element when the panel's `isSelected` property is true.
       *
       * @property active
       * @type String
       * @readOnly
       */
      active: Ember.computed(function() {
        if (this.get('isSelected')) { return this.get('activeClass'); }
      }).property('isSelected'),

      /**
       * The CSS class to apply to a panel's element when its `isSelected` property
       * is `true`.
       *
       * @property activeClass
       * @type String
       * @default 'active'
       */
      activeClass: 'active',

      /**
       * The index of this panel in the `ivy-tabs` component.
       *
       * @property index
       * @type Number
       */
      index: Ember.computed(function() {
        return this.get('tabPanels').indexOf(this);
      }).property('tabPanels.[]'),

      /**
       * Whether or not this panel's associated tab is selected.
       *
       * @property isSelected
       * @type Boolean
       * @readOnly
       */
      isSelected: Ember.computed.alias('tab.isSelected').readOnly(),

      /**
       * If `false`, this panel will appear hidden in the DOM. This is an alias to
       * `isSelected`.
       *
       * @property isVisible
       * @type Boolean
       * @readOnly
       */
      isVisible: Ember.computed.alias('isSelected').readOnly(),

      /**
       * The `ivy-tab` associated with this panel.
       *
       * @property tab
       * @type ivy.tabs.IvyTabComponent
       */
      tab: Ember.computed(function() {
        var tabs = this.get('tabs');
        if (tabs) { return tabs.objectAt(this.get('index')); }
      }).property('tabs.[]', 'index'),

      /**
       * The `ivy-tab-list` component this panel belongs to.
       *
       * @property tabList
       * @type ivy.tabs.IvyTabListComponent
       * @readOnly
       */
      tabList: Ember.computed.alias('tabsContainer.tabList').readOnly(),

      /**
       * The array of all `ivy-tab-panel` instances within the `ivy-tabs`
       * component.
       *
       * @property tabPanels
       * @type Array | ivy.tabs.IvyTabPanelComponent
       * @readOnly
       */
      tabPanels: Ember.computed.alias('tabsContainer.tabPanels').readOnly(),

      /**
       * The array of all `ivy-tab` instances within the `ivy-tab-list` component.
       *
       * @property tabs
       * @type Array | ivy.tabs.IvyTabComponent
       * @readOnly
       */
      tabs: Ember.computed.alias('tabList.tabs').readOnly(),

      /**
       * The `ivy-tabs` component.
       *
       * @property tabsContainer
       * @type ivy.tabs.IvyTabsComponent
       * @readOnly
       */
      tabsContainer: Ember.computed.alias('parentView').readOnly(),

      _registerWithTabsContainer: Ember.on('didInsertElement', function() {
        this.get('tabsContainer').registerTabPanel(this);
      }),

      _unregisterWithTabsContainer: Ember.on('willDestroyElement', function() {
        this.get('tabsContainer').unregisterTabPanel(this);
      })
    });
  });
define("ivy-tabs/components/ivy-tab",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    /**
     * @module ivy-tabs
     */

    /**
     * @class IvyTabComponent
     * @namespace ivy.tabs
     * @extends Ember.Component
     */
    __exports__["default"] = Ember.Component.extend({
      tagName: 'li',
      attributeBindings: ['aria-controls', 'aria-expanded', 'aria-selected', 'role', 'selected', 'tabindex'],
      classNames: ['ivy-tab'],
      classNameBindings: ['active'],

      /**
       * Tells screenreaders which panel this tab controls.
       *
       * See http://www.w3.org/TR/wai-aria/states_and_properties#aria-controls
       *
       * @property aria-controls
       * @type String
       * @readOnly
       */
      'aria-controls': Ember.computed.alias('tabPanel.elementId').readOnly(),

      /**
       * Tells screenreaders whether or not this tab's panel is expanded.
       *
       * See http://www.w3.org/TR/wai-aria/states_and_properties#aria-expanded
       *
       * @property aria-expanded
       * @type String
       * @readOnly
       */
      'aria-expanded': Ember.computed.alias('aria-selected').readOnly(),

      /**
       * Tells screenreaders whether or not this tab is selected.
       *
       * See http://www.w3.org/TR/wai-aria/states_and_properties#aria-selected
       *
       * @property aria-selected
       * @type String
       */
      'aria-selected': Ember.computed(function() {
        return this.get('isSelected') + ''; // coerce to 'true' or 'false'
      }).property('isSelected'),

      /**
       * The `role` attribute of the tab element.
       *
       * See http://www.w3.org/TR/wai-aria/roles#tab
       *
       * @property role
       * @type String
       * @default 'tab'
       */
      role: 'tab',

      /**
       * The `selected` attribute of the tab element. If the tab's `isSelected`
       * property is `true` this will be the literal string 'selected', otherwise
       * it will be `undefined`.
       *
       * @property selected
       * @type String
       */
      selected: Ember.computed(function() {
        if (this.get('isSelected')) { return 'selected'; }
      }).property('isSelected'),

      /**
       * Makes the selected tab keyboard tabbable, and prevents tabs from getting
       * focus when clicked with a mouse.
       *
       * @property tabindex
       * @type Number
       */
      tabindex: Ember.computed(function() {
        if (this.get('isSelected')) { return 0; }
      }).property('isSelected'),

      /**
       * Accessed as a className binding to apply the tab's `activeClass` CSS class
       * to the element when the tab's `isSelected` property is true.
       *
       * @property active
       * @type String
       * @readOnly
       */
      active: Ember.computed(function() {
        if (this.get('isSelected')) { return this.get('activeClass'); }
      }).property('isSelected'),

      /**
       * The CSS class to apply to a tab's element when its `isSelected` property
       * is `true`.
       *
       * @property activeClass
       * @type String
       * @default 'active'
       */
      activeClass: 'active',

      /**
       * The index of this tab in the `ivy-tab-list` component.
       *
       * @property index
       * @type Number
       */
      index: Ember.computed(function() {
        return this.get('tabs').indexOf(this);
      }).property('tabs.[]'),

      /**
       * Whether or not this tab is selected.
       *
       * @property isSelected
       * @type Boolean
       */
      isSelected: Ember.computed(function() {
        return this.get('tabList.selectedTab') === this;
      }).property('tabList.selectedTab'),

      /**
       * Called when the user clicks on the tab. Selects this tab.
       *
       * @method select
       */
      select: Ember.on('click', function() {
        this.get('tabList').selectTab(this);
      }),

      /**
       * The `ivy-tab-list` component this tab belongs to.
       *
       * @property tabList
       * @type ivy.tabs.IvyTabListComponent
       * @readOnly
       */
      tabList: Ember.computed.alias('parentView').readOnly(),

      /**
       * The `ivy-tab-panel` associated with this tab.
       *
       * @property tabPanel
       * @type ivy.tabs.IvyTabPanelComponent
       */
      tabPanel: Ember.computed(function() {
        return this.get('tabPanels').objectAt(this.get('index'));
      }).property('tabPanels.[]', 'index'),

      /**
       * The array of all `ivy-tab-panel` instances within the `ivy-tabs`
       * component.
       *
       * @property tabPanels
       * @type Array | ivy.tabs.IvyTabPanelComponent
       * @readOnly
       */
      tabPanels: Ember.computed.alias('tabsContainer.tabPanels').readOnly(),

      /**
       * The array of all `ivy-tab` instances within the `ivy-tab-list` component.
       *
       * @property tabs
       * @type Array | ivy.tabs.IvyTabComponent
       * @readOnly
       */
      tabs: Ember.computed.alias('tabList.tabs').readOnly(),

      /**
       * The `ivy-tabs` component.
       *
       * @property tabsContainer
       * @type ivy.tabs.IvyTabsComponent
       * @readOnly
       */
      tabsContainer: Ember.computed.alias('tabList.tabsContainer').readOnly(),

      _registerWithTabList: Ember.on('didInsertElement', function() {
        this.get('tabList').registerTab(this);
      }),

      _unregisterWithTabList: Ember.on('willDestroyElement', function() {
        this.get('tabList').unregisterTab(this);
      })
    });
  });
define("ivy-tabs/components/ivy-tabs",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    /**
     * @module ivy-tabs
     */

    /**
     * @class IvyTabsComponent
     * @namespace ivy.tabs
     * @extends Ember.Component
     */
    __exports__["default"] = Ember.Component.extend({
      classNames: ['ivy-tabs'],

      /**
       * Set this to the index of the tab you'd like to be selected. Usually it is
       * bound to a controller property that is used as a query parameter, but can
       * be bound to anything.
       *
       * @property selectedIndex
       * @type Number
       * @default 0
       */
      selectedIndex: 0,

      /**
       * Registers the `ivy-tab-list` instance.
       *
       * @method registerTabList
       * @param {ivy.tabs.IvyTabListComponent} tabList
       */
      registerTabList: function(tabList) {
        this.set('tabList', tabList);
      },

      /**
       * Adds a panel to the `tabPanels` array.
       *
       * @method registerTabPanel
       * @param {ivy.tabs.IvyTabPanelComponent} tabPanel
       */
      registerTabPanel: function(tabPanel) {
        this.get('tabPanels').pushObject(tabPanel);
      },

      /**
       * Removes the `ivy-tab-list` component.
       *
       * @method unregisterTabList
       * @param {ivy.tabs.IvyTabListComponent} tabList
       */
      unregisterTabList: function(tabList) {
        this.set('tabList', null);
      },

      /**
       * Removes a panel from the `tabPanels` array.
       *
       * @method unregisterTabPanel
       * @param {ivy.tabs.IvyTabPanelComponent} tabPanel
       */
      unregisterTabPanel: function(tabPanel) {
        this.get('tabPanels').removeObject(tabPanel);
      },

      _initTabPanels: Ember.on('init', function() {
        this.set('tabPanels', Ember.A());
      })
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