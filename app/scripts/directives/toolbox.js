angular.module('bitbloqOffline')
  .directive('toolbox', function($parse, $timeout) {
    return {
      restrict: 'E',
      templateUrl: 'file://' + __dirname + '/views/components/toolbox.html',
      scope: {
        tree: '=',
        type: '@',
        showComponents: '=',
        componentsArray: '=',
        showCommunications: '=',
        showRobots: '='
      },
      controllerAs: 'toolbox',
      controller: function($scope, $element, $attrs) {
        var self = this;
        var mainContent;
        self.activeMenu = null;
        self.menuLevel = 0;

        self.select = function(menuId, advanced) {
          if (advanced) {
            return self.menuLevel = 2;
          } else {
            self.menuLevel = 1;
          }
          if (self.activeMenu === menuId) {
            self.activeMenu = null;
            self.menuLevel = 0;
          } else {
            self.activeMenu = menuId;
          }
        };

        self.closeDropdown = function() {
          $timeout(function() {
            self.activeMenu = null;
            self.menuLevel = 0;
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