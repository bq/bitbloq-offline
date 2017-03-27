'use strict';
angular.module('bitbloqOffline')
    .factory('bloqs', function($window) {
        return $window.bloqs;
    }).factory('bloqsUtils', function($window) {
        return $window.bloqsUtils;
    }).factory('bloqsLanguages', function($window) {
        return $window.bloqsLanguages;
    }).factory('pythonGeneration', function($window) {
        return $window.pythonGeneration;
    }).factory('arduinoGeneration', function($window) {
        return $window.arduinoGeneration;
    });