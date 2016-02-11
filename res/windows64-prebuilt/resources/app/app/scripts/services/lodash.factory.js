'use strict';
/**
 * @ngdoc function
 * @name bitbloqApp.controller:hardwareTabCtrl
 * @description
 * # hardwareTabCtrl
 * Controller of the components list
 */
angular.module('bitbloqOffline')
    // I provide an injectable (and exteded) version of the underscore / lodash lib.
    .factory('_', function($window) {
        // Get a local handle on the global lodash reference.
        var _ = $window._;
        // ---
        // CUSTOM LODASH METHODS.
        // ---
        // I return the given collection as a natural language list.
        _.foo = function() {
            return ('foo function');
        };
        // Return the [formerly global] reference so that it can be injected
        // into other aspects of the AngularJS application.
        return (_);
    });