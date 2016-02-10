'use strict';

/**
 * @ngdoc function
 * @name bitbloqOffline.controller:toolboxHW
 * @description
 * # toolboxHW
 * Controller of the bitbloqOffline
 */
angular.module('bitbloqOffline')
  .controller('toolboxHW', function($scope, common) {
    $scope.hwToolboxMenu = common.hardware;
    $scope.hwToolboxMenu.componentSorteded = $scope.hardware.componentSortered;
  });