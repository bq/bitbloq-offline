angular.module('bitbloqOffline')
  .directive('dropdown', function() {
    return {
      restrict: 'E',
      templateUrl: 'file://' + __dirname + '/views/dropdown.html',
      scope: {
        tree: '='
      },
      controllerAs: 'dropdown',
      controller: function($scope, $element, $attrs) {
        var self = this;
        self.activeMenu = null;

        self.select = function(menu) {
          if (menu.disabled) {
            return;
          }
          if (self.activeMenu === menu) {
            self.activeMenu = null;
          } else {
            self.activeMenu = menu;
          }
        };

      }
    };
  });