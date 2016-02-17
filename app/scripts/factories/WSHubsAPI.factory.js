'use strict';

angular.module('bitbloqOffline')
    // I provide an injectable (and exteded) version of the underscore / lodash lib.
    .factory('WSHubsAPI', function($window) {
        // Get a local handle on the global lodash reference.
        // Return the [formerly global] reference so that it can be injected into other aspects of the AngularJS application.
        return $window.WSHubsAPI;
    });