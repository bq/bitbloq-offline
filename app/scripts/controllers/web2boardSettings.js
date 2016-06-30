/*jshint camelcase: false */
'use strict';

/**
 * @ngdoc function
 * @name bitbloqApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the bitbloqApp
 */
angular.module('bitbloqOffline')
    .controller('Web2boardSettingsCtrl', function ($scope, _, web2board, alertsService) {
        var configHub = web2board.api.ConfigHub,
            versionHub = web2board.api.VersionsHandlerHub;

        $scope.settings = {
            libraries_path: '',
            proxy: '',
            check_online_updates: false,
            check_libraries_updates: false
        };
        $scope.proxyTestIcon = null;
        $scope.proxyError = false;
        $scope.libsPathIcon = null;
        $scope.libsError = null;
        $scope.focus = false;

        $scope.testLibrariesPath = function () {
            $scope.libsPathIcon = '#loading';
            $scope.libsPathClass = 'w2b__settings_w2b__settings_loading';
            return configHub.server.isPossibleLibrariesPath($scope.settings.libraries_path)
                .then(function (isPossible) {
                    $scope.libsPathIcon = isPossible ? '#ok' : '#error';
                    $scope.libsError = !isPossible;
                });
        };

        /*
        NO NEEDED IN OFFLINE
        $scope.testProxy = function () {
            $scope.proxyTestIcon = '#loading';
            $scope.proxyTestClass = 'w2b__settings_w2b__settings_loading';
            return configHub.server.testProxy($scope.settings.proxy)
                .then(function () {
                    $scope.proxyTestIcon = '#ok';
                    $scope.proxyError = false;
                })
                .catch(function () {
                    $scope.proxyTestIcon = '#error';
                    $scope.proxyError = true;
                });
        };*/

        $scope.confirmAction = function () {
            $scope.settings.proxy = $scope.settings.proxy === '' ? null : $scope.settings.proxy;
            $scope.testProxy()
                .then(function () {
                    return $scope.testLibrariesPath();
                })
                .then(function () {
                    $scope.closeThisDialog();
                })
                .catch(function (error) {
                    alertsService.add('web2board-settings-savingError ', 'web2board', 'error');
                });
        };

        configHub.server.getConfig().then(function (config) {
            $scope.settings = config;
            $scope.settings.proxy = $scope.settings.proxy || ''; //if null use empty string (w2b will consider it as no proxy)
            return versionHub.server.getLibVersion();
        }).then(function (version) {
            $scope.libsVersion = {version: version};
            return versionHub.server.getVersion();
        }).then(function (version) {
            $scope.web2boardVersion = {version: version};
        });

    });
