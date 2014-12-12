(function(){;
var define, requireModule, require, requirejs;

(function() {

  var _isArray;
  if (!Array.isArray) {
    _isArray = function (x) {
      return Object.prototype.toString.call(x) === "[object Array]";
    };
  } else {
    _isArray = Array.isArray;
  }
  
  var registry = {}, seen = {}, state = {};
  var FAILED = false;

  define = function(name, deps, callback) {
  
    if (!_isArray(deps)) {
      callback = deps;
      deps     =  [];
    }
  
    registry[name] = {
      deps: deps,
      callback: callback
    };
  };

  function reify(deps, name, seen) {
    var length = deps.length;
    var reified = new Array(length);
    var dep;
    var exports;

    for (var i = 0, l = length; i < l; i++) {
      dep = deps[i];
      if (dep === 'exports') {
        exports = reified[i] = seen;
      } else {
        reified[i] = require(resolve(dep, name));
      }
    }

    return {
      deps: reified,
      exports: exports
    };
  }

  requirejs = require = requireModule = function(name) {
    if (state[name] !== FAILED &&
        seen.hasOwnProperty(name)) {
      return seen[name];
    }

    if (!registry[name]) {
      throw new Error('Could not find module ' + name);
    }

    var mod = registry[name];
    var reified;
    var module;
    var loaded = false;

    seen[name] = { }; // placeholder for run-time cycles

    try {
      reified = reify(mod.deps, name, seen[name]);
      module = mod.callback.apply(this, reified.deps);
      loaded = true;
    } finally {
      if (!loaded) {
        state[name] = FAILED;
      }
    }

    return reified.exports ? seen[name] : (seen[name] = module);
  };

  function resolve(child, name) {
    if (child.charAt(0) !== '.') { return child; }

    var parts = child.split('/');
    var nameParts = name.split('/');
    var parentBase;

    if (nameParts.length === 1) {
      parentBase = nameParts;
    } else {
      parentBase = nameParts.slice(0, -1);
    }

    for (var i = 0, l = parts.length; i < l; i++) {
      var part = parts[i];

      if (part === '..') { parentBase.pop(); }
      else if (part === '.') { continue; }
      else { parentBase.push(part); }
    }

    return parentBase.join('/');
  }

  requirejs.entries = requirejs._eak_seen = registry;
  requirejs.clear = function(){
    requirejs.entries = requirejs._eak_seen = registry = {};
    seen = state = {};
  };
})();

;define("ivy-tabs/index", 
  ["ivy-tabs/components/ivy-tab","ivy-tabs/components/ivy-tab-list","ivy-tabs/components/ivy-tab-panel","ivy-tabs/components/ivy-tabs","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var IvyTabComponent = __dependency1__["default"];
    var IvyTabListComponent = __dependency2__["default"];
    var IvyTabPanelComponent = __dependency3__["default"];
    var IvyTabsComponent = __dependency4__["default"];

    __exports__.IvyTabComponent = IvyTabComponent;
    __exports__.IvyTabListComponent = IvyTabListComponent;
    __exports__.IvyTabPanelComponent = IvyTabPanelComponent;
    __exports__.IvyTabsComponent = IvyTabsComponent;
  });
;define("ivy-tabs/components/ivy-tab", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    /**
     * @module ivy-tabs
     */

    /**
     * @class IvyTabComponent
     * @namespace IvyTabs
     * @extends Ember.Component
     */
    __exports__["default"] = Ember.Component.extend({
      tagName: 'li',
      attributeBindings: ['aria-controls', 'aria-expanded', 'aria-selected', 'role', 'selected', 'tabindex'],
      classNames: ['ivy-tab'],
      classNameBindings: ['active'],

      init: function() {
        this._super();
        Ember.run.once(this, this._registerWithTabList);
      },

      willDestroy: function() {
        this._super();
        Ember.run.once(this, this._unregisterWithTabList);
      },

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
       * @type IvyTabs.IvyTabListComponent
       * @readOnly
       */
      tabList: Ember.computed.alias('parentView').readOnly(),

      /**
       * The `ivy-tab-panel` associated with this tab.
       *
       * @property tabPanel
       * @type IvyTabs.IvyTabPanelComponent
       */
      tabPanel: Ember.computed(function() {
        return this.get('tabPanels').objectAt(this.get('index'));
      }).property('tabPanels.[]', 'index'),

      /**
       * The array of all `ivy-tab-panel` instances within the `ivy-tabs`
       * component.
       *
       * @property tabPanels
       * @type Array | IvyTabs.IvyTabPanelComponent
       * @readOnly
       */
      tabPanels: Ember.computed.alias('tabsContainer.tabPanels').readOnly(),

      /**
       * The array of all `ivy-tab` instances within the `ivy-tab-list` component.
       *
       * @property tabs
       * @type Array | IvyTabs.IvyTabComponent
       * @readOnly
       */
      tabs: Ember.computed.alias('tabList.tabs').readOnly(),

      /**
       * The `ivy-tabs` component.
       *
       * @property tabsContainer
       * @type IvyTabs.IvyTabsComponent
       * @readOnly
       */
      tabsContainer: Ember.computed.alias('tabList.tabsContainer').readOnly(),

      _registerWithTabList: function() {
        this.get('tabList').registerTab(this);
      },

      _unregisterWithTabList: function() {
        this.get('tabList').unregisterTab(this);
      }
    });
  });
;define("ivy-tabs/components/ivy-tab-list", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    /**
     * @module ivy-tabs
     */

    /**
     * @class IvyTabListComponent
     * @namespace IvyTabs
     * @extends Ember.Component
     */
    __exports__["default"] = Ember.Component.extend({
      tagName: 'ul',
      attributeBindings: ['aria-multiselectable', 'role'],
      classNames: ['ivy-tab-list'],

      init: function() {
        this._super();
        Ember.run.once(this, this._registerWithTabsContainer);
      },

      willDestroy: function() {
        this._super();
        Ember.run.once(this, this._unregisterWithTabsContainer);
      },

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
       * Gives focus to the selected tab.
       *
       * @method focusSelectedTab
       */
      focusSelectedTab: function() {
        this.get('selectedTab').$().focus();
      },

      /**
       * Event handler for navigating tabs via arrow keys. The left (or up) arrow
       * selects the previous tab, while the right (or down) arrow selects the next
       * tab.
       *
       * @method navigateOnKeyDown
       * @param {Event} event
       */
      navigateOnKeyDown: Ember.on('keyDown', function(event) {
        switch (event.keyCode) {
        case 37: /* left */
        case 38: /* up */
          this.selectPreviousTab();
          break;
        case 39: /* right */
        case 40: /* down */
          this.selectNextTab();
          break;
        default:
          return;
        }

        event.preventDefault();
        Ember.run.scheduleOnce('afterRender', this, this.focusSelectedTab);
      }),

      /**
       * Adds a tab to the `tabs` array.
       *
       * @method registerTab
       * @param {IvyTabs.IvyTabComponent} tab
       */
      registerTab: function(tab) {
        this.get('tabs').pushObject(tab);
      },

      /**
       * Selects the next tab in the list, if any.
       *
       * @method selectNextTab
       */
      selectNextTab: function() {
        var index = this.get('selected-index') + 1;
        if (index === this.get('tabs.length')) { index = 0; }
        this.selectTabByIndex(index);
      },

      /**
       * Selects the previous tab in the list, if any.
       *
       * @method selectPreviousTab
       */
      selectPreviousTab: function() {
        var index = this.get('selected-index') - 1;
        if (index === -1) { index = this.get('tabs.length') - 1; }
        this.selectTabByIndex(index);
      },

      'selected-index': Ember.computed.alias('tabsContainer.selected-index'),

      /**
       * The currently-selected `ivy-tab` instance.
       *
       * @property selectedTab
       * @type IvyTabs.IvyTabComponent
       */
      selectedTab: Ember.computed(function() {
        return this.get('tabs').objectAt(this.get('selected-index'));
      }).property('selected-index', 'tabs.[]'),

      /**
       * Select the given tab.
       *
       * @method selectTab
       * @param {IvyTabs.IvyTabComponent} tab
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
        this.set('selected-index', index);
      },

      /**
       * The `ivy-tabs` component.
       *
       * @property tabsContainer
       * @type IvyTabs.IvyTabsComponent
       * @readOnly
       */
      tabsContainer: Ember.computed.alias('parentView').readOnly(),

      /**
       * Removes a tab from the `tabs` array.
       *
       * @method unregisterTab
       * @param {IvyTabs.IvyTabComponent} tab
       */
      unregisterTab: function(tab) {
        this.get('tabs').removeObject(tab);
        if (tab.get('isSelected')) { this.selectPreviousTab(); }
      },

      _initTabs: Ember.on('init', function() {
        this.set('tabs', Ember.A());
      }),

      _registerWithTabsContainer: function() {
        this.get('tabsContainer').registerTabList(this);
      },

      _unregisterWithTabsContainer: function() {
        this.get('tabsContainer').unregisterTabList(this);
      }
    });
  });
;define("ivy-tabs/components/ivy-tab-panel", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    /**
     * @module ivy-tabs
     */

    /**
     * @class IvyTabPanelComponent
     * @namespace IvyTabs
     * @extends Ember.Component
     */
    __exports__["default"] = Ember.Component.extend({
      attributeBindings: ['aria-labelledby', 'role'],
      classNames: ['ivy-tab-panel'],
      classNameBindings: ['active'],

      init: function() {
        this._super();
        Ember.run.once(this, this._registerWithTabsContainer);
      },

      willDestroy: function() {
        this._super();
        Ember.run.once(this, this._unregisterWithTabsContainer);
      },

      /**
       * Tells screenreaders which tab labels this panel.
       *
       * See http://www.w3.org/TR/wai-aria/states_and_properties#aria-labelledby
       *
       * @property aria-labelledby
       * @type String
       * @readOnly
       */
      'aria-labelledby': Ember.computed.alias('tab.elementId').readOnly(),

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
       * @type IvyTabs.IvyTabComponent
       */
      tab: Ember.computed(function() {
        var tabs = this.get('tabs');
        if (tabs) { return tabs.objectAt(this.get('index')); }
      }).property('tabs.[]', 'index'),

      /**
       * The `ivy-tab-list` component this panel belongs to.
       *
       * @property tabList
       * @type IvyTabs.IvyTabListComponent
       * @readOnly
       */
      tabList: Ember.computed.alias('tabsContainer.tabList').readOnly(),

      /**
       * The array of all `ivy-tab-panel` instances within the `ivy-tabs`
       * component.
       *
       * @property tabPanels
       * @type Array | IvyTabs.IvyTabPanelComponent
       * @readOnly
       */
      tabPanels: Ember.computed.alias('tabsContainer.tabPanels').readOnly(),

      /**
       * The array of all `ivy-tab` instances within the `ivy-tab-list` component.
       *
       * @property tabs
       * @type Array | IvyTabs.IvyTabComponent
       * @readOnly
       */
      tabs: Ember.computed.alias('tabList.tabs').readOnly(),

      /**
       * The `ivy-tabs` component.
       *
       * @property tabsContainer
       * @type IvyTabs.IvyTabsComponent
       * @readOnly
       */
      tabsContainer: Ember.computed.alias('parentView').readOnly(),

      _registerWithTabsContainer: function() {
        this.get('tabsContainer').registerTabPanel(this);
      },

      _unregisterWithTabsContainer: function() {
        this.get('tabsContainer').unregisterTabPanel(this);
      }
    });
  });
;define("ivy-tabs/components/ivy-tabs", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    /**
     * @module ivy-tabs
     */

    /**
     * @class IvyTabsComponent
     * @namespace IvyTabs
     * @extends Ember.Component
     */
    __exports__["default"] = Ember.Component.extend({
      classNames: ['ivy-tabs'],

      init: function() {
        this._super();
        this._initTabPanels();
      },

      /**
       * Set this to the index of the tab you'd like to be selected. Usually it is
       * bound to a controller property that is used as a query parameter, but can
       * be bound to anything.
       *
       * @property selected-index
       * @type Number
       * @default 0
       */
      'selected-index': 0,

      /**
       * Registers the `ivy-tab-list` instance.
       *
       * @method registerTabList
       * @param {IvyTabs.IvyTabListComponent} tabList
       */
      registerTabList: function(tabList) {
        this.set('tabList', tabList);
      },

      /**
       * Adds a panel to the `tabPanels` array.
       *
       * @method registerTabPanel
       * @param {IvyTabs.IvyTabPanelComponent} tabPanel
       */
      registerTabPanel: function(tabPanel) {
        this.get('tabPanels').pushObject(tabPanel);
      },

      /**
       * Removes the `ivy-tab-list` component.
       *
       * @method unregisterTabList
       * @param {IvyTabs.IvyTabListComponent} tabList
       */
      unregisterTabList: function(/* tabList */) {
        this.set('tabList', null);
      },

      /**
       * Removes a panel from the `tabPanels` array.
       *
       * @method unregisterTabPanel
       * @param {IvyTabs.IvyTabPanelComponent} tabPanel
       */
      unregisterTabPanel: function(tabPanel) {
        this.get('tabPanels').removeObject(tabPanel);
      },

      _initTabPanels: function() {
        this.set('tabPanels', Ember.A());
      }
    });
  });
;define("app/components/ivy-tab-list", 
  ["ivy-tabs/components/ivy-tab-list","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var IvyTabListComponent = __dependency1__["default"];

    __exports__["default"] = IvyTabListComponent;
  });
;define("app/components/ivy-tab-panel", 
  ["ivy-tabs/components/ivy-tab-panel","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var IvyTabPanelComponent = __dependency1__["default"];

    __exports__["default"] = IvyTabPanelComponent;
  });
;define("app/components/ivy-tab", 
  ["ivy-tabs/components/ivy-tab","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var IvyTabComponent = __dependency1__["default"];

    __exports__["default"] = IvyTabComponent;
  });
;define("app/components/ivy-tabs", 
  ["ivy-tabs/components/ivy-tabs","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var IvyTabsComponent = __dependency1__["default"];

    __exports__["default"] = IvyTabsComponent;
  });
;/* global define, require */
define('ivy-tabs-shim', ['exports'], function(__exports__) {
  'use strict';
  __exports__['default'] = function(container) {
    container.register('component:ivy-tab-list', require('ivy-tabs/components/ivy-tab-list')['default']);
    container.register('component:ivy-tab-panel', require('ivy-tabs/components/ivy-tab-panel')['default']);
    container.register('component:ivy-tab', require('ivy-tabs/components/ivy-tab')['default']);
    container.register('component:ivy-tabs', require('ivy-tabs/components/ivy-tabs')['default']);
  };
});
;/* global define, require, window */
var addonName = 'ivy-tabs';

define('ember', ['exports'], function(__exports__) {
  __exports__['default'] = window.Ember;
});

var index = addonName + '/index';
define(addonName, ['exports'], function(__exports__) {
  var library = require(index);
  Object.keys(library).forEach(function(key) {
    __exports__[key] = library[key];
  });
});

// Glue library to a global var
window.IvyTabs = require(index);

// Register library items in the container
var shim = addonName + '-shim';
window.Ember.Application.initializer({
  name: shim,

  initialize: function(container) {
    require(shim)['default'](container);
  }
});
})();