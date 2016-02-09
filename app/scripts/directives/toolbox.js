angular.module('bitbloqOffline')
  .directive('toolbox', function($parse, $timeout) {
    return {
      restrict: 'E',
      templateUrl: 'file://' + __dirname + '/views/components/toolbox.html',
      scope: {
        tree: '=',
        type: '@'
      },
      controllerAs: 'toolbox',
      controller: function($scope, $element, $attrs) {
        var self = this;
        var mainContent;
        self.activeMenu = null;

        self.select = function(menuId) {
          if (self.activeMenu === menuId) {
            self.activeMenu = null;
          } else {
            self.activeMenu = menuId;
          }
        };

        self.closeDropdown = function() {
          $timeout(function() {
            self.activeMenu = null;
          }, 0);
        };
        $(document).on('click', function() {
          if ($(event.target).closest('toolbox').length > 0) {
            return false;
          }
          self.closeDropdown();
        });
      }
    };
  });