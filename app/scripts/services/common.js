'use strict';

/**
 * @ngdoc service
 * @name bitbloqOffline.common
 * @description
 * # common
 * Service in the bitbloqOffline.
 */
angular.module('bitbloqOffline')
  .service('common', function($http) {

    var exports = {};

    $http.get('../bower_components/bloqs/dist/bloqsmap.json').then(function(res) {
      exports.bloqsSchemas = res.data;
    }, function(err) {
      console.log('Hubo un error: ', err);
    });
    
    exports.webPath = process.mainModule.filename.substring(0, process.mainModule.filename.lastIndexOf("/"));
    exports.appPath = exports.webPath.substring(0, exports.webPath.lastIndexOf("/"));
    exports.resourcesPath = process.resourcesPath;
    return exports;

  });
