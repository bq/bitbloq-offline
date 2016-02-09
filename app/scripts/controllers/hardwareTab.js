'use strict';

/**
 * @ngdoc function
 * @name bitbloqOffline.controller:hardwareTabCtrl
 * @description
 * # hardwareTabCtrl
 * Controller of the bitbloqOffline
 */
angular.module('bitbloqOffline')
  .controller('hardwareTabCtrl', function($scope) {
    var self = this;
    self.posi = true;
    console.log('hardwareTabCtrl controller', $scope.$parent.$id);
  });