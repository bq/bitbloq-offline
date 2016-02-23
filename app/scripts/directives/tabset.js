angular.module('bitbloqOffline')
  .directive('tabset', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      templateUrl: 'file://' + __dirname + '/views/components/tabset.html',
      bindToController: true,
      controllerAs: 'tabset',
      controller: function() {

        var self = this;
        self.tabs = [];

        self.addTab = function addTab(tab) {
          self.tabs.push(tab);
          if (self.tabs.length === 1) {
            tab.active = true;
          }
        };

        self.select = function(selectedTab) {
          if (selectedTab.disabled) {
            return;
          }

          angular.forEach(self.tabs, function(tab) {
            if (tab.active && tab !== selectedTab) {
              tab.active = false;
            }
          });
          selectedTab.active = true;
        };

      }
    };
  });