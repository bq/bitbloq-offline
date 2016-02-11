'use strict';

/**
 * @ngdoc function
 * @name bitbloqOffline.controller:AlertsCtrl
 * @description
 * # AlertsCtrl
 * Controller of the bitbloqOffline
 */
angular.module('bitbloqOffline')
  .controller('AlertsCtrl', function($scope, alertsService) {
    $scope.alerts = alertsService.getInstance();
    $scope.generateSvgUrl = function(id) {
      return 'images/sprite.svg#' + id;
    };
  });