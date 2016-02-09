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
    var fs = require('fs');
    $scope.hwToolboxMenu = JSON.parse(fs.readFileSync(common.appPath + '/app/res/menus/hwtoolbox.json', 'utf8'));
  });