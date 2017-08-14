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
        exports.settings = {};
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

        exports.settings = JSON.parse(fs.readFileSync(exports.appPath + '/app/res/config.json', 'utf8'));
        exports.settings.zoomFactor = exports.settings.zoomFactor || 1;
        $translate.use(exports.settings.language);

        exports.translateTo = function(lang) {
            exports.settings.language = lang;

            exports.saveSettings();
            $translate.use(lang);
        };

        exports.saveSettings = function() {
            fs.writeFile(exports.appPath + '/app/res/config.json', JSON.stringify(exports.settings), 'utf8', function(err) {
                if (err) {
                    throw err;
                }
            });
        };

        function _startAnalytics() {
            if (!localStorage.analyticsVisitorUUID) {
                localStorage.analyticsVisitorUUID = utils.generateUUID();
            }
            if (!exports.analyticsVisitor) {
                exports.analyticsVisitor = ua('UA-20299199-1', localStorage.analyticsVisitorUUID);
            }

            exports.analyticsVisitor.pageview('/', 'bitbloqoffline.bq.com', 'Bitbloq offline start').send();
            //240000 = 4 mins
            setInterval(_preventAnalitycsToLoseUserActivity, 240000);
        }

        function _preventAnalitycsToLoseUserActivity() {
            exports.analyticsVisitor.event({
                documentHostName: 'bitbloqoffline.bq.com',
                eventAction: 'Bitbloq offline still working',
                eventCategory: 'im alive'
            }).send();
        }

        exports.sendAnalyticsEvent = function(eventName, eventData) {
            exports.analyticsVisitor.pageview(eventName + '-' + eventData, 'bitbloqoffline.bq.com', 'Bitbloq offline event').send();
        };

        return exports;
    });