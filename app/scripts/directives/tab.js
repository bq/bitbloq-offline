angular.module('bitbloqOffline')
  .directive('tab', function() {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'file://' + __dirname + '/views/components/tab.html',
      require: '^tabset',
      scope: {
        heading: '=',
        icon: '=',
        iconSize: '='
      },
      link: function(scope, elem, attr, tabsetCtrl) {
        scope.active = false;
        scope.disabled = false;
        if (attr.disable) {
          attr.$observe('disable', function(value) {
            scope.disabled = (value !== 'false');
          });
        }
        tabsetCtrl.addTab(scope);
      }
    };
  });