angular.module('bitbloqOffline')
  .directive('bitbloqBloqCreator', function($log, bloqs, common) {
    return {
      restrict: 'A',
      name: 'bitbloq-bloq-creator',
      scope: {
        componentsArray: '=',
        bloqSchema: '='
      },
      link: function(scope, element) {

        function generateBloq() {
          bloq = new bloqs.Bloq({
            bloqData: common.bloqsSchemas[scope.bloqSchema],
            componentsArray: scope.componentsArray
          });
          element.append(bloq.$bloq);
          bloq.$bloq[0].addEventListener('bloq:connectable', bloqItsConnectable);

        }

        function bloqItsConnectable() {
          bloq.$bloq[0].removeEventListener('bloq:connectable', bloqItsConnectable);
          generateBloq();
        }

        var bloq,
          cleanWatcherSchema;

        if (scope.bloqSchema) {
          generateBloq();
        } else {
          cleanWatcherSchema = scope.$watch('bloqSchema', function(newValue) {
            if (newValue) {
              cleanWatcherSchema();
              generateBloq();
            }
          });
        }

      }
    };
  });