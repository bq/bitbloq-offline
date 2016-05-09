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
            data_parser = {
                buf: '',
                separator: '\r\n',
                retrieve_messages: function (data) {
                    data = this.buf + data;
                    var split_data = data.split(this.separator);
                    this.buf = split_data.pop();
                    return split_data;
                }
            };
        $scope.baudrateOptions = [9600, 19200, 115200];
        $scope.serial = {
            dataReceived: '',
            port: $scope.serial.port || '',
            baudrate: 9600,
            board: $scope.serial.board || 'bt328'
        };
        $scope.pause = false;
        $scope.pauseText = "Pause";

        $scope.labels = [];
        $scope.series = ['Data received'];
        $scope.data = [
            []
        ];

        $scope.chartOptions = {
            animation: false,
            pointDot: true,
            pointHitDetectionRadius : 0.1
        };
        
        web2board.api.callbacks.onClientFunctionNotFound = function (hub, func) {
            console.error(hub, func);
        };

        serialHub.client.received = function (port, data) {
            if($scope.pause) {
                return;
            }
            var messages = data_parser.retrieve_messages(data);
            messages.forEach(function(message) {
                var number = parseInt(message);
                if (!isNaN(number)) {
                    $scope.data[0].push(number);
                    $scope.labels.push('');
                    if ($scope.labels.length > 20) {
                        $scope.chartOptions.pointDot = false;
                    }
                    if($scope.labels.length > 300) {
                        $scope.labels.shift();
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
            if(port === $scope.serial.port){
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
            $scope.data = [
                []
            ];
        };

        $scope.onPause = function () {
            $scope.pause = !$scope.pause;
            $scope.pauseText = $scope.pause? "Continue": "Pause";
        };

        web2board.api.connect().done(function () {
            serialHub.server.subscribeToHub().done(function () {
                console.log('subscribed');
            });
            serialHub.server.isPortConnected($scope.serial.port).done(function (connected) {
                if (!connected) {
                    serialHub.server.startConnection($scope.serial.port, $scope.serial.baudrate);
                } else {
                    $scope.onBaudrateChanged();
                }
            });
        });
    });