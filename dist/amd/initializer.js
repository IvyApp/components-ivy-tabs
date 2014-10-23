define(
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