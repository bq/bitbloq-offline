angular.module('bitbloqOffline')
  .directive('dropdown', function($parse, $timeout) {
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
          event.stopPropagation();
          if (menu.disabled) {
            return;
          }
          if (self.activeMenu === menu) {
            self.activeMenu = null;
          } else {
            self.activeMenu = menu;
          }
        };

        self.closeDropdown = function(noQuestions) {
          if (noQuestions) {
            self.activeMenu = null;
          }
          var target = event.target;
          console.log(target.closest('dropdown'));

          if (!target.closest('dropdown')) {
            $scope.$apply(function() {
              self.activeMenu = null;
            });

          }
        };

        $timeout(function() {
          // Timeout is to prevent the click handler from immediately
          // firing upon opening the popover.
          $(document).on("click", self.closeDropdown);
        });
        $scope.$on("$destroy", function() {
          $(document).off("click", self.closeDropdown);
        });
      }
    };
  });