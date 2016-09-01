'use strict';
angular.module('bitbloqOffline')
    // I provide an injectable (and exteded) version of the underscore / lodash lib.
    .factory('bloqs', function($window) {
        // Get a local handle on the global lodash reference.
        // Return the [formerly global] reference so that it can be injected into other aspects of the AngularJS application.
        return $window.bloqs;
    });

angular.module('bitbloqOffline')
    // I provide an injectable (and exteded) version of the underscore / lodash lib.
    .factory('bloqsUtils', function($window) {
        // Get a local handle on the global lodash reference.
        // Return the [formerly global] reference so that it can be injected into other aspects of the AngularJS application.
        return $window.bloqsUtils;
    });

angular.module('bitbloqOffline')
    // I provide an injectable (and exteded) version of the underscore / lodash lib.
    .factory('bloqsLanguages', function($window) {
        // Get a local handle on the global lodash reference.
        // Return the [formerly global] reference so that it can be injected into other aspects of the AngularJS application.
        return $window.bloqsLanguages;
    });
angular.module('bitbloqOffline')
    // I provide an injectable (and exteded) version of the underscore / lodash lib.
    .factory('pythonGeneration', function($window) {
        // Get a local handle on the global lodash reference.
        // Return the [formerly global] reference so that it can be injected into other aspects of the AngularJS application.
        return $window.pythonGeneration;
    });