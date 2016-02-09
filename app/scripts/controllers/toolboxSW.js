'use strict';

/**
 * @ngdoc function
 * @name bitbloqOffline.controller:toolboxSW
 * @description
 * # toolboxSW
 * Controller of the bitbloqOffline
 */
angular.module('bitbloqOffline')
  .controller('toolboxSW', function($scope, common) {
    var fs = require('fs');
    $scope.swToolboxMenu = JSON.parse(fs.readFileSync(common.appPath + '/app/res/menus/swtoolbox.json', 'utf8'));
  });