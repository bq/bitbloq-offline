'use strict';
angular.module('bitbloqOffline')
    .service('serialHandler', function (web2board, _) {
        var serialHub = web2board.api.SerialMonitorHub,
            subscribedScopes = [];

        function closeConnectionIfUnused(port) {
            var usedPorts = _.find(subscribedScopes, function (scope) {
                return scope.port === port;
            });
            if (!usedPorts) {
                serialHub.server.unsubscribeFromPort(port)
                    .then(function () {
                        return serialHub.server.closeUnusedConnections();
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            }
        }

        serialHub.client.received = function (port, data) {
            subscribedScopes.forEach(function (scope) {
                if (scope.onReceived && scope.port === port) {
                    scope.onReceived(port, data);
                }
            });
        };

        serialHub.client.baudrateChanged = function (port, baudrate) {
            subscribedScopes.forEach(function (scope) {
                if (scope.onExternalBaudrateChanged && scope.port === port) {
                    scope.onExternalBaudrateChanged(port, baudrate);
                }
            });
        };

        serialHub.client.written = function (message, port) {
            subscribedScopes.forEach(function (scope) {
                if (scope.onWritten && scope.port === port) {
                    scope.onWritten(message);
                }
            });
        };

        this.baudrateOptions = [300, 1200, 2400, 4800, 9600, 14400, 19200, 28800, 38400, 57600, 115200];
        this.defaultBaudrate = 9600;

        this.subscribeToSerialEvents = function (scope) {
            if (subscribedScopes.indexOf(scope) < 0) {
                subscribedScopes.push(scope);
                serialHub.server.isPortConnected(scope.port)
                    .then(function (connected) {
                        if (!connected) {
                            return serialHub.server.startConnection(scope.port, 9600);
                        }
                    })
                    .then(function () {
                        serialHub.server.subscribeToPort(scope.port);
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
                scope.$on('$destroy', function () {
                    subscribedScopes = _.without(subscribedScopes, scope);
                    closeConnectionIfUnused(scope.port);
                });
            }
        };
    });

