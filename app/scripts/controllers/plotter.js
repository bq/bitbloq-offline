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
    .controller('PlotterCtrl', function ($scope, _, web2board) {
        // todo: create a serialHandler service to remove duplicated code
        var serialHub = web2board.api.SerialMonitorHub,
            lastIter = -1,
            dataParser = {
                buf: '',
                separator: '\r\n',
                retrieve_messages: function (data) {
                    data = this.buf + data;
                    var split_data = data.split(this.separator);
                    this.buf = split_data.pop();
                    return split_data;
                }
            },
            clearClicked = false,
            receivedDataCount = 0,
            plotterLength = 300,
            plotterStepper = 20;
        $scope.baudrateOptions = [9600, 19200, 115200, 115201, 115202, 115203, 115204];
        $scope.serial = {
            dataReceived: '',
            port: $scope.serial.port || '',
            baudrate: 9600,
            board: $scope.serial.board || 'bt328'
        };
        $scope.pause = false;
        $scope.pauseText = "Pause";

        $scope.series = ['Data received'];

        $scope.chartOptions = {
            animation: false,
            pointDot: true,
            pointHitDetectionRadius: 1
        };

        web2board.api.callbacks.onClientFunctionNotFound = function (hub, func) {
            console.error(hub, func);
        };

        serialHub.client.received = function (port, data) {
            if (!$scope.pause && clearClicked) {
                $scope.data = [[]];
                clearClicked = false;
            }

            var messages = dataParser.retrieve_messages(data);
            messages.forEach(function (message) {
                var number = parseInt(message);
                if (!$scope.pause && !isNaN(number)) {
                    $scope.data[0].push(number);

                    if ($scope.data[0] > 20) {
                        $scope.chartOptions.pointDot = false;
                    }

                    if ($scope.data[0].length > plotterLength) {
                        $scope.labels.shift();
                        $scope.labels.push(receivedDataCount % plotterStepper ? '' : receivedDataCount);
                        receivedDataCount++;
                        $scope.data[0].shift();
                    }
                }
            });
            $scope.$apply();
        };

        serialHub.client.written = function (message) {
            $scope.serial.dataReceived += message;
        };

        serialHub.client.baudrateChanged = function (port, baudrate) {
            if (port === $scope.serial.port) {
                $scope.serial.baudrate = baudrate;
            }
        };

        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };

        $scope.onBaudrateChanged = function () {
            serialHub.server.changeBaudrate($scope.serial.port, $scope.serial.baudrate);
        };

        $scope.onClear = function () {
            $scope.labels = [];
            for (receivedDataCount = 0; receivedDataCount < plotterLength; receivedDataCount++) {
                $scope.labels[receivedDataCount] = receivedDataCount % plotterStepper ? '' : receivedDataCount;
            }
            $scope.data = [[0]];
            clearClicked = true;
        };

        $scope.onPause = function () {
            $scope.pause = !$scope.pause;
            $scope.pauseText = $scope.pause ? "Continue" : "Pause";
        };

        $scope.onClear();

        serialHub.server.getSubscribedClientsToHub().done(function (subscribedClients) {
            if(subscribedClients.indexOf("Bitbloq") <= -1){
                serialHub.server.subscribeToHub();
                console.log("subscribed");
            }
        });

        serialHub.server.isPortConnected($scope.serial.port).done(function (connected) {
            if (!connected) {
                serialHub.server.startConnection($scope.serial.port, $scope.serial.baudrate);
            } else {
                $scope.onBaudrateChanged();
            }
        });
    });