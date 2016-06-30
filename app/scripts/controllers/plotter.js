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
    .controller('PlotterCtrl', function ($scope, _, web2board, $route, $translate, serialHandler) {
        var serialHub = web2board.api.SerialMonitorHub,
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
            plotterLength = 500,
            receivedDataCount = 0;

        $scope.onReceived = function (port, data) {
            var messages = dataParser.retrieve_messages(data);
            messages.forEach(function (message) {
                var number = parseFloat(message);
                if (!$scope.pause && !isNaN(number)) {
                    $scope.data[0].values.push({x: receivedDataCount++, y: number});

                    if ($scope.data[0].values.length > plotterLength) {
                        $scope.data[0].values.shift();
                    }
                }
            });
            $scope.$apply();
        };

        $scope.onWritten = function (message) {
            $scope.serial.dataReceived += message;
        };

        $scope.onExternalBaudrateChanged = function (port, baudrate) {
            if (baudrate) {
                $scope.serial.baudrate = baudrate;
            }
        };

        $scope.baudrateOptions = serialHandler.baudrateOptions;

        $scope.serial = {
            dataReceived: '',
            baudrate: serialHandler.defaultBaudrate
        };
        
        $scope.pause = false;
        $scope.pauseText = $translate.instant('plotter-pause');
        $scope.data = [{
            values: [],
            color: '#6a8d2f'
        }];

        $scope.chartOptions = {
            chart: {
                type: 'lineChart',
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                duration: 0,
                x: function (d) {
                    return d.x;
                },
                y: function (d) {
                    return d.y;
                },
                useInteractiveGuideline: true,
                yAxis: {
                    tickFormat: function (d) {
                        return d3.format('.02f')(d);
                    }
                }
            },
            title: {
                enable: true,
                text: $translate.instant('plotter')
            }
        };

        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };

        $scope.onBaudrateChanged = function (baudrate) {
            if (baudrate) {
                $scope.serial.baudrate = baudrate;
                serialHub.server.changeBaudrate($scope.port, baudrate);
            }
        };

        $scope.onClear = function () {
            receivedDataCount = 0;
            $scope.data[0].values = [];
        };

        $scope.onPause = function () {
            $scope.pause = !$scope.pause;
            $scope.pauseText = $scope.pause ? $translate.instant('plotter-play') : $translate.instant('plotter-pause');
        };

        serialHandler.subscribeToSerialEvents($scope);
    });