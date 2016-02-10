'use strict';
angular.module('bitbloqOffline')
    // I provide an injectable (and exteded) version of the underscore / lodash lib.
    .factory('nodeRemote', function() {
        // Get a local handle on the global lodash reference.
        // Return the [formerly global] reference so that it can be injected into other aspects of the AngularJS application.
        return require('remote');
    });
angular.module('bitbloqOffline')
    // I provide an injectable (and exteded) version of the underscore / lodash lib.
    .factory('nodeDialog', function(nodeRemote) {
        // Get a local handle on the global lodash reference.
        // Return the [formerly global] reference so that it can be injected into other aspects of the AngularJS application.
        return nodeRemote.require('dialog');
    });
angular.module('bitbloqOffline')
    // I provide an injectable (and exteded) version of the underscore / lodash lib.
    .factory('nodeFs', function() {
        // Get a local handle on the global lodash reference.
        // Return the [formerly global] reference so that it can be injected into other aspects of the AngularJS application.
        return require('fs');
    });