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
    .controller('PlotterCtrl', function ($scope, _, web2board, $route, $translate, $interval) {
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
        // refactor port param to get "/"
        $route.current.params.port = $route.current.params.port.split("_").join("/");

        web2board.api.callbacks.onClientFunctionNotFound = function (hub, func) {
            console.error(hub, func);
        };

        serialHub.client.received = function (port, data) {
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

        serialHub.client.written = function (message) {
            $scope.serial.dataReceived += message;
        };

        serialHub.client.baudrateChanged = function (port, baudrate) {
            if (port === $scope.serial.port && baudrate) {
                $scope.serial.baudrate = baudrate;
            }
        };

        $scope.baudrateOptions = [300, 1200, 2400, 4800, 9600, 14400, 19200, 28800, 38400, 57600, 115200];

        $scope.serial = {
            dataReceived: '',
            port: $route.current.params.port,
            baudrate: 9600,
            board: $route.current.params.board
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
                serialHub.server.changeBaudrate($scope.serial.port, baudrate);
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

        web2board.api.connect().done(function () {
            web2board.api.UtilsAPIHub.server.setId("Plotter").done(function () {
                serialHub.server.getSubscribedClientsToHub().done(function (subscribedClients) {
                    if (subscribedClients.indexOf("Plotter") <= -1) {
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
        });

        $interval(function () {
            serialHub.server.isPortConnected($scope.serial.port)
                .done(function (connected) {
                    if (!connected) {
                        serialHub.server.startConnection($scope.serial.port, $scope.serial.baudrate)
                    }
                })
        }, 2000)

    });