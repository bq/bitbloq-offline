'use strict';

/**
 * @ngdoc service
 * @name bitbloqOffline.common
 * @description
 * # common
 * Service in the bitbloqOffline.
 */
angular.module('bitbloqOffline')
    .service('common', function() {

        var exports = {};

        exports.webPath = process.mainModule.filename.substring(0, process.mainModule.filename.lastIndexOf("/"));
        exports.appPath = exports.webPath.substring(0, exports.webPath.lastIndexOf("/"));
        return exports;

    });