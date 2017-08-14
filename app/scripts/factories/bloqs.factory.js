'use strict';
angular.module('bitbloqOffline')
    .factory('bloqs', function($window) {
        return $window.bloqs;
    });

angular.module('bitbloqOffline')
    .factory('bloqsUtils', function($window) {
        return $window.bloqsUtils;
    });

angular.module('bitbloqOffline')
    .factory('bloqsLanguages', function($window) {
        return $window.bloqsLanguages;
    });

angular.module('bitbloqOffline')
    .factory('arduinoGeneration', function($window) {
        return $window.arduinoGeneration;
    });