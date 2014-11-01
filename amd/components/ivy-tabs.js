define(
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