'use strict';

/**
 * @ngdoc function
 * @name bitbloqOffline.controller:toolboxHW
 * @description
 * # toolboxHW
 * Controller of the bitbloqOffline
 */
angular.module('bitbloqOffline')
  .controller('toolboxHW', function($scope, $http) {
    $http.get('res/menus/hwtoolbox.json').then(function(res) {
      $scope.hwToolboxMenu = res.data;
      console.log(res.data);
    }, function(err) {
      console.log('Hubo un error: ', err);
    });
  });