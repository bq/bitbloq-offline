'use strict';

/**
 * @ngdoc function
 * @name bitbloqOffline.controller:toolboxSW
 * @description
 * # toolboxSW
 * Controller of the bitbloqOffline
 */
angular.module('bitbloqOffline')
  .controller('toolboxSW', function($scope, $http) {
    $http.get('res/menus/swtoolbox.json').then(function(res) {
      $scope.swToolboxMenu = res.data;
      console.log(res.data);
    }, function(err) {
      console.log('Hubo un error: ', err);
    });
  });