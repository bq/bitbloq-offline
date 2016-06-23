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
    .controller('Web2boardSettingsCtrl', function ($scope, _, web2boardV2, alertsService) {
        var configHub = web2boardV2.api.ConfigHub,
            versionHub = web2boardV2.api.VersionsHandlerHub;
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

        web2boardV2.api.callbacks.onClientFunctionNotFound = function (hub, func) {
            console.error(hub, func);
        };

        $scope.testLibrariesPath = function () {
            $scope.libsPathIcon = '#loading';
            $scope.libsPathClass = 'w2b__settings_w2b__settings_loading';
            return configHub.server.isPossibleLibrariesPath($scope.settings.libraries_path)
                .then(function (isPossible) {
                    $scope.libsPathIcon = isPossible ? '#ok' : '#error';
                    $scope.libsError = !isPossible;
                });
        };

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
        };

        $scope.confirmAction = function () {
            $scope.testProxy()
                .then(function () {
                    return $scope.testLibrariesPath();
                })
                .then(function () {
                    if (!$scope.proxyError && !$scope.libsError) {
                        return configHub.server.setValues($scope.settings)
                            .then(function () {
                                alertsService.add('web2board-settings-confirmSaved', 'web2board', 'ok', 2000);
                                $scope.closeThisDialog();
                            });
                    }
                })
                .catch(function () {
                    alertsService.add('web2board-settings-savingError ', 'web2board', 'error');
                });
        };

        configHub.server.getConfig().then(function (config) {
            $scope.settings = config;
            return versionHub.server.getLibVersion();
        }).then(function (version) {
            $scope.libsVersion = {version: version};
            return versionHub.server.getVersion();
        }).then(function (version) {
            $scope.web2boardVersion = {version: version};
        });

    });
