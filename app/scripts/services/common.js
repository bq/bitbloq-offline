'use strict';

/**
 * @ngdoc service
 * @name bitbloqOffline.common
 * @description
 * # common
 * Service in the bitbloqOffline.
 */
angular.module('bitbloqOffline')
    .service('common', function($http, $filter, $rootScope, $translate, utils) {

        var exports = {};
        var settings = {};
        var fs = require('fs');
        var ua = require('universal-analytics');
        exports.analyticsVisitor;



        exports.webPath = process.mainModule.filename.substring(0, process.mainModule.filename.lastIndexOf('/'));

        var app = exports.webPath.substring(0, exports.webPath.lastIndexOf('/'));
        var resources = process.resourcesPath + '/app/';
        exports.appPath = app || resources;

        exports.bloqsSchemas = JSON.parse(fs.readFileSync(exports.appPath + '/bower_components/bloqs/dist/bloqsmap.json', 'utf8'));
        exports.hardware = JSON.parse(fs.readFileSync(exports.appPath + '/app/res/hw.json', 'utf8'));
        exports.version = JSON.parse(fs.readFileSync(exports.appPath + '/package.json', 'utf8')).version;
        exports.bloqsVersion = JSON.parse(fs.readFileSync(exports.appPath + '/bower.json', 'utf8')).dependencies.bloqs;
        exports.translate = $filter('translate');

        _startAnalytics();

        settings.language = JSON.parse(fs.readFileSync(exports.appPath + '/app/res/config.json', 'utf8')).language;
        $translate.use(settings.language);

        exports.translateTo = function(lang) {
            settings.language = lang;

            fs.writeFile(exports.appPath + '/app/res/config.json', JSON.stringify(settings), 'utf8', function(err) {
                if (err) {
                    throw err;
                }
            });
            $translate.use(lang);
        };

        function _startAnalytics() {
            if (!localStorage.analyticsVisitorUUID) {
                localStorage.analyticsVisitorUUID = utils.generateUUID();
            }
            if (!exports.analyticsVisitor) {
                exports.analyticsVisitor = ua('UA-77651241-1', localStorage.analyticsVisitorUUID);
            }

            exports.analyticsVisitor.pageview('/', 'Bloqs Project').send();
            //240000 = 4 mins
            setInterval(_preventAnalitycsToLoseUserActivity, 240000);
        }

        function _preventAnalitycsToLoseUserActivity() {
            exports.analyticsVisitor.event('still working', 'im alive').send();
        }

        exports.sendAnalyticsEvent = function(eventName, eventData) {
            exports.analyticsVisitor.pageview(eventName + '-' + eventData).send();
        };

        return exports;
    });