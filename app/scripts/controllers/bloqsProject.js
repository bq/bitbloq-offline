'use strict';

/**
 * @ngdoc function
 * @name bitbloqOffline.controller:BloqsProjectCtrl
 * @description
 * # BloqsProjectCtrl
 * Controller of the bitbloqOffline
 */
angular.module('bitbloqOffline')
  .controller('BloqsProjectCtrl', function($scope, bloqsUtils, web2board) {
    console.log('bloqsproject ctrl');

    $scope.componentsArray = bloqsUtils.getEmptyComponentsArray();
    $scope.arduinoMainBloqs = {
      varsBloq: null,
      setupBloq: null,
      loopBloq: null
    };

    $scope.verifyCode = function(code) {
      code = code || '';
      web2board.verify(code);
    };
  });