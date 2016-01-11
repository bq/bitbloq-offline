'use strict';

/**
 * @ngdoc function
 * @name bitbloqOffline.controller:BloqsProjectCtrl
 * @description
 * # BloqsProjectCtrl
 * Controller of the bitbloqOffline
 */
angular.module('bitbloqOffline')
    .controller('BloqsProjectCtrl', function($scope, bloqsUtils) {
        console.log('bloqsproject ctrl');
        $scope.componentsArray = bloqsUtils.getEmptyComponentsArray();
        $scope.arduinoMainBloqs = {
            varsBloq: null,
            setupBloq: null,
            loopBloq: null
        };
    });