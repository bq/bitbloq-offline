'use strict';

/**
 * @ngdoc service
 * @name bitbloqOffline.web2board
 * @description
 * # web2board
 * Service in the bitbloqOffline.
 */
angular.module('bitbloqOffline')
    .factory('web2board', function ($rootScope, $log, $q, _, $timeout, common, alertsService) {

        /** Variables */
        var web2board = this,
            ws,
            inProgress = false,
            TIME_FOR_WEB2BOARD_TO_START = 500; //ms

        web2board.config = {
            wsHost: 'localhost',
            wsPort: 9876,
            serialPort: ''
        };

        function getWeb2boardCommand() {
            var platformOs = process.platform;
            if (platformOs === 'win32') {
                return common.appPath + "/app/res/web2board/win32/web2board.exe";
            }
            if (platformOs === 'darwin') {
                return common.appPath + "/app/res/web2board/darwin/web2board";
            }
            return common.appPath + "/app/res/web2board/linux/web2board";
        }

        //function isWeb2boardUpToDate(version) {
        //    return true;
        //    //return parseInt(version.replace(/\./g, ''), 10) >= parseInt(common.properties.web2boardVersion.replace(/\./g, ''), 10);
        //}

        function showUpdateModal() {
            alert("W2b not detected");
            //var parent = $rootScope,
            //    modalOptions = parent.$new();
            //_.extend(modalOptions, {
            //    contentTemplate: '/views/modals/download-web2board.html',
            //    modalTitle: 'modal-update-web2board-title',
            //    modalText: 'modal-download-web2board-text'
            //});
            //modalOptions.envData = envData;
            //ngDialog.closeAll();
            //ngDialog.open({
            //    template: '/views/modals/modal.html',
            //    className: 'modal--container modal--download-web2board',
            //    scope: modalOptions,
            //    showClose: false
            //});
        }

        function startWeb2board() {
            console.log('starting Web2board...');
            var spawn = require('child_process').spawn,
                web2boardProcess = spawn(getWeb2boardCommand());
            web2boardProcess.on("close", function (code) {
                console.log("Web2board closed with code: " + code);
            });
            web2boardProcess.stderr.on("data", function (data) {
                console.error(data);
            });
        }

        //function onOpenConnectionTrigger(callback) {
        //    ws.BoardConfigHub.server.getVersion().done(function (version) {
        //        if (!isWeb2boardUpToDate(version)) {
        //            inProgress = false;
        //            showUpdateModal();
        //        } else {
        //            var libVersion = common.properties.bitbloqLibsVersion || '0.0.1';
        //            ws.BoardConfigHub.server.setLibVersion(libVersion).done(function () {
        //                callback();
        //            }, function (error) {
        //                $log.error('Unable to update libraries due to: ' + error);
        //            });
        //        }
        //    }, function (error) {
        //        $log.error('unable to get version due to : ' + error);
        //    });
        //}

        function openCommunication(callback, showUpdateModalFlag, tryCount) {
            tryCount = tryCount || 0;
            tryCount++;
            showUpdateModalFlag = showUpdateModalFlag === true && tryCount >= 12;
            callback = callback || function () {
                };
            if (!ws.wsClient || (ws.wsClient.readyState !== WebSocket.CONNECTING && ws.wsClient.readyState !== WebSocket.OPEN)) {
                ws.connect().done(function () {
                    debugger;
                        ws.UtilsAPIHub.server.setId("Bitbloq").done(callback);
                    },
                    function () { //on error
                        if (showUpdateModalFlag) {
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
            } else {
                callback();
            }
        }

        function handleUploadError(error) {
            inProgress = false;
            if (error.title === 'COMPILE_ERROR') {
                alertsService.add('alert-web2board-compile-error', 'compile', 'warning', undefined, error.stdErr);
            } else if (error.title === 'BOARD_NOT_READY') {
                alertsService.add('alert-web2board-boardNotReady', 'upload', 'warning', undefined);
            } else {
                var errorTag = 'alert-web2board-upload-error';
                inProgress = false;
                if (error) {
                    alertsService.add(errorTag, 'upload', 'warning', undefined, error);
                } else {
                    alertsService.add(errorTag, 'upload', 'warning', undefined);
                }
            }
        }

        ws = new HubsAPI('ws:\\' + web2board.config.wsHost + ':' + web2board.config.wsPort, 45);

        ws.defaultErrorHandler = function (error){
            $log.error('Error receiving message: ' + error);
        };

        ws.callbacks.onClose = function (error) {
            $log.error('web2board disconnected with error: ' + error.reason);
            ws.clearTriggers();
            inProgress = false;
        };

        ws.callbacks.onMessageError = function (error) {
            $log.error('Error receiving message: ' + error);
        };

        ws.CodeHub.client.isCompiling = function () {
            alertsService.add('alert-web2board-compiling', 'compile', 'loading', undefined);
        };

        ws.CodeHub.client.isUploading = function (port) {
            alertsService.add('alert-web2board-uploading', 'upload', 'loading', undefined, port);
        };

        ws.CodeHub.client.isSettingPort = function (port) {
            $log.debug('is setting port in: ' + port);
            web2board.serialPort = port;
        };

        web2board.verify = function (code) {
            //It is not mandatory to have a board connected to verify the code
            if (!inProgress) {
                inProgress = true;
                openCommunication(function () {
                    ws.CodeHub.server.compile(code).done(function () {
                        inProgress = false;
                        alertsService.add('alert-web2board-compile-verified', 'compile', 'ok', 5000);
                    }, function (error) {
                        inProgress = false;
                        alertsService.add('alert-web2board-compile-error', 'compile', 'warning', undefined, error);
                    });
                });
            }
        };

        web2board.upload = function (board, code) {
            if (!inProgress) {
                if (!code || !board) {
                    alertsService.add('alert-web2board-boardNotReady', 'upload', 'warning');
                    return;
                }
                inProgress = true;
                openCommunication(function () {
                    alertsService.add('alert-web2board-settingBoard', 'upload', 'loading');
                    ws.CodeHub.server.upload(code, board.mcu).done(function () {
                        inProgress = false;
                        alertsService.add('alert-web2board-code-uploaded', 'upload', 'ok', 5000);
                    }, handleUploadError);
                });
            }
        };

        web2board.serialMonitor = function (board) {
            if (!inProgress) {
                inProgress = true;
                openCommunication(function () {
                    var serialMonitorAlert = alertsService.add('alert-web2board-openSerialMonitor', 'serialmonitor', 'loading');
                    ws.BoardConfigHub.server.setBoard(board.mcu).done(function () {
                        inProgress = false;
                        if (!alertsService.isVisible('uid', serialMonitorAlert)) {
                            alertsService.add('alert-web2board-boardReady', 'upload', 'ok', 5000, board.name);
                        }
                        ws.SerialMonitorHub.server.startApp(web2board.serialPort).done(function () {
                            alertsService.close(serialMonitorAlert);
                        });
                    }, function () {
                        inProgress = false;
                        alertsService.close(serialMonitorAlert);
                        alertsService.add('alert-web2board-boardNotReady', 'upload', 'warning');
                    });
                });
            }
        };

        web2board.version = function () {
            openCommunication();
        };

        web2board.uploadHex = function (board, hexText) {
            openCommunication(function () {
                alertsService.add('alert-web2board-settingBoard', 'upload', 'loading');
                ws.CodeHub.server.uploadHex(hexText, board.mcu).done(function () {
                    alertsService.add('alert-web2board-boardReady', 'upload', 'ok', 5000, board.name);
                }, handleUploadError);
            });
        };

        return {
            verify: web2board.verify,
            upload: web2board.upload,
            serialMonitor: web2board.serialMonitor,
            version: web2board.version,
            uploadHex: web2board.uploadHex,
            isInProcess: function () {
                return inProgress;
            }
        };
    });
