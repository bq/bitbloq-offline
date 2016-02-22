'use strict';

/**
 * @ngdoc service
 * @name bitbloqOffline.common
 * @description
 * # common
 * Service in the bitbloqOffline.
 */
angular.module('bitbloqOffline')
  .service('common', function($http, $filter, $rootScope, $translate) {

    var exports = {};

    var fs = require('fs');
    exports.webPath = process.mainModule.filename.substring(0, process.mainModule.filename.lastIndexOf('/'));

    var app = exports.webPath.substring(0, exports.webPath.lastIndexOf('/'));
    var resources = process.resourcesPath + '/app/';
    exports.appPath = app || resources;

    exports.bloqsSchemas = JSON.parse(fs.readFileSync(exports.appPath + '/bower_components/bloqs/dist/bloqsmap.json', 'utf8'));
    exports.hardware = JSON.parse(fs.readFileSync(exports.appPath + '/app/res/hw.json', 'utf8'));
    exports.version = JSON.parse(fs.readFileSync(exports.appPath + '/package.json', 'utf8')).version;
    exports.bloqsVersion = JSON.parse(fs.readFileSync(exports.appPath + '/bower.json', 'utf8')).dependencies.bloqs;
    exports.translate = $filter('translate');
    exports.translateTo = function(lang) {
      $translate.use(lang);
    };
    return exports;

  });
