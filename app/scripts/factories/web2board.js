'use strict';

/**
 * @ngdoc service
 * @name bitbloqOffline.web2board
 * @description
 * # web2board
 * Service in the bitbloqOffline.
 */
angular.module('bitbloqOffline')
    .factory('web2board', function ($rootScope, $log, $q, _, $timeout, common, alertsService, WSHubsAPI, OpenWindow,
                                    ngDialog, consoleMessageParser, $translate, $compile) {

        /** Variables */
        var web2board = this,
            api,
            inProgress = false,
            TIME_FOR_WEB2BOARD_TO_START = 700,
            w2bToast = null,
            w2bProcess,
            serialMonitorPanel = null,
            plotterPanel = null;

        function MessageWrapper() {
            this.send = function (message) {
                w2bProcess.stdin.write(consoleMessageParser.INIT + message + consoleMessageParser.END + '\n');
            };
        }

        function getWeb2boardCommand() {
            var platformOs = process.platform;
            if (platformOs === 'win32') {
                return common.appPath + '/app/res/web2board/win32/web2boardLauncher.exe';
            }
            if (platformOs === 'darwin') {
                return common.appPath + '/app/res/web2board/darwin/Web2Board.app/Contents/MacOS/web2boardLauncher';
            }
            if (process.arch === 'x64') {
                return common.appPath + '/app/res/web2board/linux/web2board';
            }
            return common.appPath + '/app/res/web2board/linux32/web2boardLauncher';
        }

        function showUpdateModal() {
            alert('W2b not detected');
        }

        function startW2bProcess() {
            console.log('starting Web2board...');
            var spawn = require('child_process').spawn;
            w2bProcess = spawn(getWeb2boardCommand(), ['--offline', '--logLevel', 'DEBUG']);
            w2bProcess.stdout.setEncoding('utf8');
            w2bProcess.stdin.setEncoding('utf8');
            w2bProcess.ready = false;
        }

        function startWeb2board() {
            new $q(function (resolve, reject) {
                var watchdog = $timeout(function () {
                    reject();
                }, 5000);
                startW2bProcess();
                w2bProcess.stdout.on('data', function (data) {
                    var str = data.toString();
                    if (!w2bProcess.ready && str.indexOf('listening console...') > -1) {
                        $timeout.cancel(watchdog);
                        w2bProcess.ready = true;
                        api.wsClient.onopen();
                        api.wsClient.readyState = WebSocket.OPEN;
                        resolve();
                    } else if (w2bProcess.ready) {
                        var messages = consoleMessageParser.addData(str);
                        messages.forEach(function (msg) {
                            api.wsClient.onmessage({data: msg});
                        });
                    }
                    // console.log(str);
                });

                w2bProcess.on('close', function (code) {
                    $log.error('web2board disconnected with error: ' + code);
                    api.clearTriggers();
                    inProgress = false;
                    alertsService.add('web2board_toast_closedUnexpectedly', 'web2board', 'warning');
                });
            });
        }

        function openCommunication(callback, showUpdateModalFlag, tryCount) {
            tryCount = tryCount || 0;
            tryCount++;
            if (tryCount === 1) {
                w2bToast = alertsService.add('web2board_toast_startApp', 'web2board', 'loading');
            }

            showUpdateModalFlag = showUpdateModalFlag === true && tryCount >= 2;
            callback = callback || angular.noop;

            if (!w2bProcess) {
                api.connect().then(function () {
                        api.wsClient.couldSuccessfullyConnect = true;
                        alertsService.close(w2bToast);
                        api.UtilsAPIHub.server.setId('Bitbloq').then(callback);
                    },
                    function () { //on error
                        if (showUpdateModalFlag) {
                            alertsService.close(w2bToast);
                            showUpdateModal();
                        } else {
                            if (tryCount === 1) {
                                // we only need to start web2board once
                                startWeb2board();
                            }
                            $timeout(function () {
                                openCommunication(callback, true, tryCount);
                            }, TIME_FOR_WEB2BOARD_TO_START);
                        }
                    }
                );
                startWeb2board();
            } else {
                api.UtilsAPIHub.server.getId().then(callback, function () {
                    api.wsClient = null;
                    startWeb2board();
                    openCommunication(callback, showUpdateModalFlag, 0);
                }, 2000);
            }
        }

        function handleUploadError(error) {
            if (error.title === 'COMPILE_ERROR') {
                alertsService.add('alert-web2board-compile-error', 'web2board', 'warning', undefined, error.stdErr);
            } else if (error.title === 'BOARD_NOT_READY') {
                alertsService.add('alert-web2board-no-port-found', 'web2board', 'warning');
            } else {
                var errorTag = 'alert-web2board-upload-error';
                alertsService.add(errorTag, 'web2board', 'warning', undefined, error);
            }
        }

        function removeInProgressFlag() {
            inProgress = false;
        }

        function isBoardReady(board) {
            if (!board) {
                alertsService.add('alert-web2board-boardNotReady', 'web2board', 'warning');
            }
            return board;
        }

        function prepareSerialConnectionScope(board, toastId) {
            if (!isBoardReady(board)){
                return new $q(function (result, reject){
                    inProgress = false;
                    reject();
                });
            }
            return api.SerialMonitorHub.server.findBoardPort(board.mcu)
                .then(function (port) {
                    alertsService.close(toastId);
                    var scope = $rootScope.$new();
                    scope.port = port;
                    scope.setOnUploadFinished = function (callback) {
                        scope.uploadFinished = callback;
                    };
                    return scope;
                }, function (error) {
                    alertsService.add('alert-web2board-no-port-found', 'web2board', 'warning');
                    console.error(error);
                })
                .finally(function () {
                    inProgress = false;
                });
        }

        function openSerialMonitorPanel(scope) {
            serialMonitorPanel = $.jsPanel({
                position: 'center',
                size: {width: 500, height: 500},
                onclosed: function () {
                    scope.$destroy();
                    serialMonitorPanel = null;
                },
                title: $translate.instant('serial'),
                ajax: {
                    url: 'views/serialMonitor.html',
                    done: function () {
                        this.html($compile(this.html())(scope));
                    }
                }
            });
            serialMonitorPanel.scope = scope;
        }

        function openPlotterPanel(scope) {
            plotterPanel = $.jsPanel({
                position: 'center',
                size: {width: 600, height: 600},
                onclosed: function () {
                    scope.$destroy();
                    serialMonitorPanel = null;
                },
                title: $translate.instant('serial'),
                ajax: {
                    url: 'views/plotter.html',
                    done: function () {
                        this.html($compile(this.html())(scope));
                    }
                }
            });
            plotterPanel.scope = scope;
        }

        function normalizePanelIfExists(panel) {
            if (panel) {
                try {
                    panel.normalize();
                    panel.reposition('center');
                    return true;
                } catch (error) {
                    console.error(error);
                }
            }
            return false;
        }

        api = WSHubsAPI.construct(45000, MessageWrapper, $q);

        // api.connect('ws://' + web2board.config.wsHost + ':' + web2board.config.wsPort + '/Bitbloq');

        api.defaultErrorHandler = function (error) {
            $log.error('Error receiving message: ' + error);
        };

        api.onClose = function (error) {
            $log.error('web2board disconnected with error: ' + error.reason);
            api.clearTriggers();
            inProgress = false;
            if (api.wsClient.couldSuccessfullyConnect) {
                alertsService.add('web2board_toast_closedUnexpectedly', 'web2board', 'warning');
            }
        };

        api.onMessageError = function (error) {
            $log.error('Error receiving message: ' + error);
        };

        api.onClientFunctionNotFound = function (hub, func) {
            console.error(hub, func);
        };

        api.CodeHub.client.isCompiling = function () {
            alertsService.add('alert-web2board-compiling', 'web2board', 'loading', undefined);
        };

        api.CodeHub.client.isUploading = function (port) {
            alertsService.add('alert-web2board-uploading', 'web2board', 'loading', undefined, port);
        };

        api.CodeHub.client.isSettingPort = function (port) {
            $log.debug('is setting port in: ' + port);
            web2board.serialPort = port;
        };

        web2board.verify = function (code) {
            //It is not mandatory to have a board connected to verify the code
            if (!inProgress) {
                inProgress = true;
                openCommunication(function () {
                    api.CodeHub.server.compile(code).then(function () {
                        alertsService.add('alert-web2board-compile-verified', 'web2board', 'ok', 5000);
                    }, function (error) {
                        alertsService.add('alert-web2board-compile-error', 'web2board', 'warning', undefined, error);
                    }).finally(removeInProgressFlag);
                });
            }
        };

        web2board.upload = function (board, code) {
            if (!inProgress) {
                if (!code || !board) {
                    alertsService.add('alert-web2board-boardNotReady', 'web2board', 'warning');
                    return;
                }
                inProgress = true;
                openCommunication(function () {
                    alertsService.add('alert-web2board-settingBoard', 'web2board', 'loading');
                    api.CodeHub.server.upload(code, board.mcu).then(function () {
                        alertsService.add('alert-web2board-code-uploaded', 'web2board', 'ok', 5000);
                    }, handleUploadError).finally(removeInProgressFlag);
                });
            }
        };

        web2board.serialMonitor = function (board) {
            if (normalizePanelIfExists(serialMonitorPanel)) {
                return;
            }
            openCommunication(function () {
                inProgress = true;
                var toast = alertsService.add('alert-web2board-openSerialMonitor', 'web2board', 'loading');
                prepareSerialConnectionScope(board, toast)
                    .then(function (scope){
                        openSerialMonitorPanel(scope);
                    });
            });
        };

        web2board.version = function () {
            openCommunication();
        };

        web2board.uploadHex = function (boardMcu, hexText) {
            openCommunication(function () {
                alertsService.add('alert-web2board-settingBoard', 'web2board', 'loading');
                api.CodeHub.server.uploadHex(hexText, boardMcu).then(function (port) {
                    alertsService.add('alert-web2board-code-uploaded', 'web2board', 'ok', 5000, port);
                }, handleUploadError).finally(removeInProgressFlag);
            });
        };

        web2board.showApp = function () {
            if (!inProgress) {
                openCommunication(function () {
                    inProgress = false;
                    var parent = $rootScope,
                        modalOptions = parent.$new();
                    _.extend(modalOptions, {
                        contentTemplate: 'file://' + __dirname + '/views/modals/web2boardSettings.html',
                        modalTitle: 'modal-update-web2board-title',
                        modalText: 'modal-download-web2board-text',
                        confirmButton: 'save',
                        rejectButton: 'cancel',
                        modalButtons: true
                    });
                    // modalOptions.envData = envData;
                    ngDialog.closeAll();
                    ngDialog.open({
                        template: 'file://' + __dirname + '/views/modals/modal.html',
                        className: 'modal--container modal--download-web2board',
                        scope: modalOptions,
                        showClose: false,
                        controller: 'Web2boardSettingsCtrl'
                    });
                });
            }
        };

        web2board.showPlotter = function (board) {
            if (normalizePanelIfExists(plotterPanel)) {
                return;
            }
            openCommunication(function () {
                inProgress = true;
                var toast = alertsService.add('alert-web2board-openPlotter', 'web2board', 'loading');
                prepareSerialConnectionScope(board, toast)
                    .then(function (scope){
                        openPlotterPanel(scope);
                    });
            });
        };

        return {
            verify: web2board.verify,
            upload: web2board.upload,
            serialMonitor: web2board.serialMonitor,
            version: web2board.version,
            uploadHex: web2board.uploadHex,
            showWeb2board: web2board.showApp,
            showPlotter: web2board.showPlotter,
            isInProcess: function () {
                return inProgress;
            },
            api: api
        };

    });