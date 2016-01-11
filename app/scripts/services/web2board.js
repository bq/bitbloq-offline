'use strict';

/**
 * @ngdoc service
 * @name bitbloqOffline.web2board
 * @description
 * # web2board
 * Service in the bitbloqOffline.
 */
angular.module('bitbloqOffline')
    .factory('web2board', function($rootScope, $websocket, $log, $q, _, $timeout, common) {

        var web2board = this,
            ws, modalObj;

        web2board.config = {
            wsHost: 'localhost',
            wsPort: 9876,
            serialPort: ''
        };
        /**
         * [connect ws connecting]
         * @param  {[object]} config [{port:myport,host:myhost}]
         * @return {[boolean]}        [Is connection OK?]
         */
        web2board._connect = function() {

            var dfd = $q.defer();

            if (!ws || ws.readyState !== 1) { // It's already connected

                ws = $websocket('ws://' + web2board.config.wsHost + ':' + web2board.config.wsPort);
                ws.onOpen(function(evt) {
                    if (ws.readyState === 1) {
                        $log.debug('web2board:connected');
                        dfd.resolve(evt);
                    } else {
                        dfd.reject(evt);
                    }
                });

                //Socket events handlers
                ws.onClose(function(evt) {
                    web2board._notify(evt);
                });
                ws.onMessage(function(evt) {
                    web2board._notify(evt);
                });
                ws.onError(function(evt) {
                    dfd.reject(evt);
                });

            } else {
                $log.debug('web2board is already connected');
                dfd.resolve(true);
            }

            return dfd.promise;
        };

        web2board._send = function(message) {
            $log.debug('web2board:send::', message);
            return ws.send(message);
        };

        var boardReadyPromise = null;
        web2board._setBoard = function(boardMCU) {
            boardReadyPromise = $q.defer();
            var defaultBoard = boardMCU || 'uno';
            this._send('setBoard ' + defaultBoard);
            return boardReadyPromise.promise;
        };

        web2board._disconnect = function() {
            $log.error('web2board disconnected');
            return ws.close();
        };

        web2board._notify = function(evt) {

            $log.debug('web2board:response::', evt.type);

            /**
             * [
             * msgDecoded[0]:message
             * msgDecoded[1]:value
             * ]
             * @type {Array}
             */
            var msgDecoded = [],
                msgParsed;

            if (evt.type === 'message' && evt.data) {
                $log.debug(evt.data);
                msgDecoded = evt.data.split(/\s->\s/);

                if (msgDecoded.length > 1) {
                    msgParsed = msgDecoded[1];
                    $log.debug('MSG: ', msgParsed);
                }
                switch (msgDecoded[0]) {
                    case 'SETTING BOARD':
                        $rootScope.$emit('web2board:settingBoard');
                        break;
                    case 'SETTING PORT':
                        var ports = JSON.parse(msgParsed);
                        if (ports.length > 0) {
                            web2board.serialPort = ports[0];
                            $log.debug('web2board', web2board.serialPort);
                        }
                        $rootScope.$emit('web2board:boardReady', msgParsed);
                        break;
                    case 'COMPILING':
                        $rootScope.$emit('web2board:compiling');
                        break;
                    case 'COMPILED':
                        $log.debug('compiled?:', evt.data.indexOf('KO'));
                        if (evt.data.indexOf('KO') !== -1) {
                            $rootScope.$emit('web2board:compile-error', msgParsed);
                        } else {
                            $rootScope.$emit('web2board:compile-verified', msgParsed);
                        }
                        break;
                    case 'UPLOADING':
                        $rootScope.$emit('web2board:uploading', web2board.serialPort);
                        break;
                    case 'UPLOADED':
                        if (evt.data.indexOf('KO') !== -1) {
                            $rootScope.$emit('web2board:upload-error', msgParsed);
                        } else {
                            $rootScope.$emit('web2board:code-uploaded', msgParsed);
                        }
                        break;
                    case 'NO PORT FOUND':
                        $rootScope.$emit('web2board:no-port-found');
                        break;
                    case 'VERSION':
                        $rootScope.$emit('web2board:version', msgParsed);
                        break;
                    case 'SERIALMONITOROPENED':
                        $rootScope.$emit('web2board:serial-monitor-opened', msgParsed);
                        break;
                    default:
                        throw 'WTF?!? ' + evt.data;
                }

            } else if (evt.type === 'close') {
                $rootScope.$emit('web2board:disconnected');
            } else if (evt.type === 'error') {
                $rootScope.$emit('web2board:disconnected');
            }

            return true;
        };

        /**
         * $on listeners
         */

        $rootScope.$on('web2board:boardReady', function(evt, data) {
            var dataParsed = [];
            if (data) {
                dataParsed = JSON.parse(data);
            }

            if (dataParsed.length > 0) {
                //Take the first board
                web2board.config.serialPort = dataParsed[0];
                boardReadyPromise.resolve(dataParsed[0]);
            } else {
                web2board.config.serialPort = '';
                boardReadyPromise.reject();
            }
        });

        $rootScope.$on('web2board:code-verified', function(evt, data) {
            $log.debug(evt.name);
            if (data && data.charAt(0) === '{') {
                $log.debug(JSON.parse(data));
            }
        });

        $rootScope.$on('web2board:code-uploaded', function(evt, data) {
            $log.debug(evt.name);
            if (data && data.charAt(0) === '{') {
                $log.debug(JSON.parse(data));
            }
        });

        var dfd = $q.defer();
        $rootScope.$on('web2board:version', function(evt, data) {
            if (parseInt(data.replace(/\./g, ''), 10) < parseInt(common.properties.web2boardVersion.replace(/\./g, ''), 10)) {
                dfd.reject();
                var parent = $rootScope,
                    modalOptions = parent.$new();
                _.extend(modalOptions, {
                    contentTemplate: '/views/modals/download-web2board.html',
                    modalTitle: 'modal-update-web2board-title',
                    modalText: 'modal-download-web2board-text'
                });
                //modalOptions.envData = envData;
                ngDialog.closeAll();
                ngDialog.open({
                    template: '/views/modals/modal.html',
                    className: 'modal--container modal--download-web2board',
                    scope: modalOptions,
                    showClose: false
                });
                $rootScope.$emit('web2board:wrong-version');
            } else {
                dfd.resolve();
            }
        });

        web2board._checkVersion = function() {
            web2board._send('version');
            return dfd.promise;
        };

        web2board._openCommunication = function(instructions) {
            //It is not mandatory to have a board connected to verify the code
            web2board._connect().then(
                function() {
                    web2board._checkVersion().then(
                        function() {
                            instructions();
                        });
                }).catch(function(evt) {
                if (evt.target.readyState === 3) {
                    // Create link.
                    var tempA = document.createElement('a');
                    tempA.setAttribute('href', 'web2board://');
                    document.body.appendChild(tempA);
                    tempA.click();
                    document.body.removeChild(tempA);

                    $timeout(function() {
                        web2board._connect().then(
                            function() {
                                web2board._checkVersion().then(
                                    function() {
                                        instructions();
                                    });
                            }).catch(function(evt) {
                            if (evt.target.readyState === 3) {
                                var parent = $rootScope,
                                    modalOptions = parent.$new();
                                _.extend(modalOptions, {
                                    contentTemplate: '/views/modals/download-web2board.html',
                                    modalTitle: 'modal-download-web2board-title',
                                    modalText: 'modal-download-web2board-text'
                                });
                                //modalOptions.envData = envData;
                                if (!modalObj || !ngDialog.isOpen(modalObj.id)) {
                                    modalObj = ngDialog.open({
                                        template: '/views/modals/modal.html',
                                        className: 'modal--container modal--download-web2board',
                                        scope: modalOptions,
                                        showClose: false
                                    });
                                }
                            }
                        });
                    }, 3000);
                }
            });
        };

        /** Public functions */

        web2board.verify = function(code) {
            //It is not mandatory to have a board connected to verify the code
            web2board._openCommunication(function() {
                return web2board._send('compile ' + code);
            });
        };
        web2board.upload = function(board, code) {
            if (!code || !board) {
                $rootScope.$emit('web2board:boardNotReady');
                return false;
            }
            //It is not mandatory to have a board connected to verify the code
            web2board._openCommunication(function() {
                return web2board._setBoard(board.mcu).then(function() {
                    web2board._send('upload ' + code);
                });
            });
        };

        web2board.serialMonitor = function(board) {
            web2board._openCommunication(function() {
                return web2board._setBoard(board.mcu).then(function() {
                    web2board._send('SerialMonitor ' + web2board.serialPort);
                });
            });
        };

        return {
            verify: web2board.verify,
            upload: web2board.upload,
            serialMonitor: web2board.serialMonitor
        };

    });