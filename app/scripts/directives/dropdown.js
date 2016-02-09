angular.module('bitbloqOffline')
  .directive('dropdown', function($parse, $timeout) {
    return {
      restrict: 'E',
      templateUrl: 'file://' + __dirname + '/views/components/dropdown.html',
      scope: {
        tree: '='
      },
      controllerAs: 'dropdown',
      controller: function($scope, $element, $attrs) {
        var self = this;
        var mainContent;
        self.activeMenu = null;

        self.select = function(menu) {
          if (self.activeMenu === menu) {
            self.activeMenu = null;
          } else {
            self.activeMenu = menu;
          }
        };

        self.closeDropdown = function() {
          $timeout(function() {
            self.activeMenu = null;
          }, 0);
        };


        $(document).on('click', function() {
          if ($(event.target).closest('dropdown').length > 0) {
            return false;
          }
          self.closeDropdown();
        });
      }
    };
  });