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
    .controller('SerialMonitorCtrl', function ($scope, _, web2board, $translate, $timeout, $element, serialHandler) {
        /*Private vars*/
        var serialHub = web2board.api.SerialMonitorHub,
            textArea = $element.find('#serialData'),
            textAreaMaxLength = 20000;


        /*Private functions*/
        function scrollTextAreaToBottom() {
            $timeout(function () {
                textArea.scrollTop(textArea[0].scrollHeight - textArea.height());
            }, 0);
        }

        /* SerialHandler events definition */
        $scope.onReceived = function (port, data) {
            if (port === $scope.port && !$scope.pause && angular.isString(data)) {
                $scope.serial.dataReceived += data;
                var dataLen = $scope.serial.dataReceived.length;
                if (dataLen > textAreaMaxLength) {
                    $scope.serial.dataReceived = $scope.serial.dataReceived.slice(dataLen - textAreaMaxLength);
                }
                scrollTextAreaToBottom();
            }
        };

        $scope.onExternalBaudrateChanged = function (port, baudrate) {
            if (baudrate) {
                $scope.serial.baudrate = baudrate;
            }
        };

        /*public vars*/
        $scope.baudrateOptions = serialHandler.baudrateOptions;
        $scope.serial = {
            dataReceived: '',
            input: '',
            baudrate: serialHandler.defaultBaudrate
        };
        $scope.pause = false;
        $scope.pauseText = $translate.instant('serial-pause');

        /*Public functions*/
        $scope.send = function () {
            serialHub.server.write($scope.port, $scope.serial.input);
            $scope.serial.input = '';
        };

        $scope.onKeyPressedInInput = function (event) {
            if (event.which === 13) {
                $scope.send();
            }
        };

        $scope.onBaudrateChanged = function (baudrate) {
            $scope.serial.baudrate = baudrate;
            serialHub.server.changeBaudrate($scope.port, baudrate);
        };

        $scope.onPause = function () {
            $scope.pause = !$scope.pause;
            if ($scope.pause) {
                $scope.serial.dataReceived += '\n\nSerial Monitor paused\n\n';
                scrollTextAreaToBottom();
            }
            $scope.pauseText = $scope.pause ? $translate.instant('serial-play') : $translate.instant('serial-pause');
        };

        $scope.onClear = function () {
            $scope.serial.dataReceived = '';
        };

        /*Init functions*/
        $scope.setOnUploadFinished(function () {
            $scope.onBaudrateChanged($scope.serial.baudrate);
        });

        serialHandler.subscribeToSerialEvents($scope);
    });
