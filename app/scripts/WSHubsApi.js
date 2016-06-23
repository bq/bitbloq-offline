(function(WSHubsAPI) {

    /* jshint ignore:start */
    /* ignore jslint start */
    function HubsAPI(serverTimeout, wsClientClass, PromiseClass) {

        var messageID = 0,
            promisesHandler = {},
            defaultRespondTimeout = serverTimeout || 5000,
            thisApi = this,
            messagesBeforeOpen = [],
            emptyFunction = function () {},
            onOpenTriggers = [];

        PromiseClass = PromiseClass || Promise;
        if (!PromiseClass.prototype.finally) {
            PromiseClass.prototype.finally = function (callback) {
                var p = this.constructor;
                return this.then(
                    function (value) {
                        return p.resolve(callback()).then(function () {
                            return value;
                        });
                    },
                    function (reason) {
                        return p.resolve(callback()).then(function () {
                            throw reason;
                        });
                    });
            };
        }

        if (!PromiseClass.prototype.setTimeout) {
            PromiseClass.prototype.setTimeout = function (timeout) {
                clearTimeout(this._timeoutID);
                setTimeout(timeoutError(this._reject), timeout);
                return this;
            };
        }

        function timeoutError(reject) {
            return function () {
                reject(new Error('timeout error'));
            };
        }

        function toCamelCase(str) {
            return str.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
        }

        this.clearTriggers = function () {
            messagesBeforeOpen = [];
            onOpenTriggers = [];
        };

        this.connect = function (url, reconnectTimeout) {
            return new PromiseClass(function (resolve, reject) {
                reconnectTimeout = reconnectTimeout || -1;
                function reconnect(error) {
                    if (reconnectTimeout !== -1) {
                        window.setTimeout(function () {
                            thisApi.connect(url, reconnectTimeout);
                            thisApi.callbacks.onReconnecting(error);
                        }, reconnectTimeout * 1000);
                    }
                }

                try {
                    thisApi.wsClient = wsClientClass === undefined ? new WebSocket(url) : new wsClientClass(url);
                } catch (error) {
                    reconnect(error);
                    return reject(error);
                }

                thisApi.wsClient.onopen = function () {
                    resolve();
                    thisApi.callbacks.onOpen(thisApi);
                    onOpenTriggers.forEach(function (trigger) {
                        trigger();
                    });
                    messagesBeforeOpen.forEach(function (message) {
                        thisApi.wsClient.send(message);
                    });
                };

                thisApi.wsClient.onclose = function (error) {
                    reject(error);
                    thisApi.callbacks.onClose(error);
                    reconnect(error);
                };

                thisApi.wsClient.addOnOpenTrigger = function (trigger) {
                    if (thisApi.wsClient.readyState === 0) {
                        onOpenTriggers.push(trigger);
                    } else if (thisApi.wsClient.readyState === 1) {
                        trigger();
                    } else {
                        throw new Error('web socket is closed');
                    }
                };

                thisApi.wsClient.onmessage = function (ev) {
                    try {
                        var promiseHandler,
                            msgObj = JSON.parse(ev.data);
                        if (msgObj.hasOwnProperty('reply')) {
                            promiseHandler = promisesHandler[msgObj.ID];
                            msgObj.success ? promiseHandler.resolve(msgObj.reply) : promiseHandler.reject(msgObj.reply);
                        } else {
                            msgObj.function = toCamelCase(msgObj.function);
                            var executor = thisApi[msgObj.hub].client[msgObj.function];
                            if (executor !== undefined) {
                                var replayMessage = {ID: msgObj.ID};
                                try {
                                    replayMessage.reply = executor.apply(executor, msgObj.args);
                                    replayMessage.success = true;
                                } catch (e) {
                                    replayMessage.success = false;
                                    replayMessage.reply = e.toString();
                                } finally {
                                    if (replayMessage.reply instanceof PromiseClass) {
                                        replayMessage.reply.then(function (result) {
                                            replayMessage.success = true;
                                            replayMessage.reply = result;
                                            thisApi.wsClient.send(JSON.stringify(replayMessage));
                                        }, function (error) {
                                            replayMessage.success = false;
                                            replayMessage.reply = error;
                                            thisApi.wsClient.send(JSON.stringify(replayMessage));
                                        });
                                    } else {
                                        replayMessage.reply = replayMessage.reply === undefined ? null : replayMessage.reply;
                                        thisApi.wsClient.send(JSON.stringify(replayMessage));
                                    }
                                }
                            } else {
                                thisApi.callbacks.onClientFunctionNotFound(msgObj.hub, msgObj.function);
                            }
                        }
                    } catch (err) {
                        thisApi.wsClient.onMessageError(err);
                    }
                };

                thisApi.wsClient.onMessageError = function (error) {
                    thisApi.callbacks.onMessageError(error);
                };
            });
        };

        this.callbacks = {
            onClose: emptyFunction,
            onOpen: emptyFunction,
            onReconnecting: emptyFunction,
            onMessageError: emptyFunction,
            onClientFunctionNotFound: emptyFunction
        };

        this.defaultErrorHandler = null;

        var constructMessage = function (hubName, functionName, args) {
            if (thisApi.wsClient === undefined) {
                throw new Error('ws not connected');
            }
            var promise,
                timeoutID = null,
                _reject;
            promise = new PromiseClass(function (resolve, reject) {
                args = Array.prototype.slice.call(args);
                var id = messageID++,
                    body = {'hub': hubName, 'function': functionName, 'args': args, 'ID': id};
                promisesHandler[id] = {};
                promisesHandler[id].resolve = resolve;
                promisesHandler[id].reject = reject;
                timeoutID = setTimeout(timeoutError(reject), defaultRespondTimeout);
                _reject = reject;

                if (thisApi.wsClient.readyState === WebSocket.CONNECTING) {
                    messagesBeforeOpen.push(JSON.stringify(body));
                } else if (thisApi.wsClient.readyState !== WebSocket.OPEN) {
                    reject('webSocket not connected');
                } else {
                    thisApi.wsClient.send(JSON.stringify(body));
                }
            });
            promise._timeoutID = timeoutID;
            promise._reject = _reject;
            return promise;
        };

        this.CodeHub = {};
        this.CodeHub.server = {
            __HUB_NAME : 'CodeHub',

            getHexData : function (code){

                return constructMessage('CodeHub', 'get_hex_data', arguments);
            },

            uploadHex : function (hexText, board, port){
                arguments[2] = port === undefined ? null : port;
                return constructMessage('CodeHub', 'upload_hex', arguments);
            },

            upload : function (code, board, port){
                arguments[2] = port === undefined ? null : port;
                return constructMessage('CodeHub', 'upload', arguments);
            },

            compile : function (code){

                return constructMessage('CodeHub', 'compile', arguments);
            },

            getSubscribedClientsIds : function (){

                return constructMessage('CodeHub', 'get_subscribed_clients_ids', arguments);
            },

            subscribeToHub : function (){

                return constructMessage('CodeHub', 'subscribe_to_hub', arguments);
            },

            uploadHexFile : function (hexFilePath, board, port){
                arguments[2] = port === undefined ? null : port;
                return constructMessage('CodeHub', 'upload_hex_file', arguments);
            },

            unsubscribeFromHub : function (){

                return constructMessage('CodeHub', 'unsubscribe_from_hub', arguments);
            }
        };
        this.CodeHub.client = {};
        this.VersionsHandlerHub = {};
        this.VersionsHandlerHub.server = {
            __HUB_NAME : 'VersionsHandlerHub',

            setLibVersion : function (version){

                return constructMessage('VersionsHandlerHub', 'set_lib_version', arguments);
            },

            getLibVersion : function (){

                return constructMessage('VersionsHandlerHub', 'get_lib_version', arguments);
            },

            setWeb2boardVersion : function (version){

                return constructMessage('VersionsHandlerHub', 'set_web2board_version', arguments);
            },

            getSubscribedClientsIds : function (){

                return constructMessage('VersionsHandlerHub', 'get_subscribed_clients_ids', arguments);
            },

            subscribeToHub : function (){

                return constructMessage('VersionsHandlerHub', 'subscribe_to_hub', arguments);
            },

            getVersion : function (){

                return constructMessage('VersionsHandlerHub', 'get_version', arguments);
            },

            unsubscribeFromHub : function (){

                return constructMessage('VersionsHandlerHub', 'unsubscribe_from_hub', arguments);
            }
        };
        this.VersionsHandlerHub.client = {};
        this.LoggingHub = {};
        this.LoggingHub.server = {
            __HUB_NAME : 'LoggingHub',

            subscribeToHub : function (){

                return constructMessage('LoggingHub', 'subscribe_to_hub', arguments);
            },

            getAllBufferedRecords : function (){

                return constructMessage('LoggingHub', 'get_all_buffered_records', arguments);
            },

            unsubscribeFromHub : function (){

                return constructMessage('LoggingHub', 'unsubscribe_from_hub', arguments);
            },

            getSubscribedClientsIds : function (){

                return constructMessage('LoggingHub', 'get_subscribed_clients_ids', arguments);
            }
        };
        this.LoggingHub.client = {};
        this.WindowHub = {};
        this.WindowHub.server = {
            __HUB_NAME : 'WindowHub',

            subscribeToHub : function (){

                return constructMessage('WindowHub', 'subscribe_to_hub', arguments);
            },

            forceClose : function (){

                return constructMessage('WindowHub', 'forceClose', arguments);
            },

            unsubscribeFromHub : function (){

                return constructMessage('WindowHub', 'unsubscribe_from_hub', arguments);
            },

            getSubscribedClientsIds : function (){

                return constructMessage('WindowHub', 'get_subscribed_clients_ids', arguments);
            }
        };
        this.WindowHub.client = {};
        this.UtilsAPIHub = {};
        this.UtilsAPIHub.server = {
            __HUB_NAME : 'UtilsAPIHub',

            getHubsStructure : function (){

                return constructMessage('UtilsAPIHub', 'get_hubs_structure', arguments);
            },

            isClientConnected : function (clientId){

                return constructMessage('UtilsAPIHub', 'is_client_connected', arguments);
            },

            getId : function (){

                return constructMessage('UtilsAPIHub', 'get_id', arguments);
            },

            unsubscribeFromHub : function (){

                return constructMessage('UtilsAPIHub', 'unsubscribe_from_hub', arguments);
            },

            getSubscribedClientsIds : function (){

                return constructMessage('UtilsAPIHub', 'get_subscribed_clients_ids', arguments);
            },

            subscribeToHub : function (){

                return constructMessage('UtilsAPIHub', 'subscribe_to_hub', arguments);
            },

            setId : function (clientId){

                return constructMessage('UtilsAPIHub', 'set_id', arguments);
            }
        };
        this.UtilsAPIHub.client = {};
        this.SerialMonitorHub = {};
        this.SerialMonitorHub.server = {
            __HUB_NAME : 'SerialMonitorHub',

            getAllConnectedPorts : function (){

                return constructMessage('SerialMonitorHub', 'get_all_connected_ports', arguments);
            },

            unsubscribeFromPort : function (port){

                return constructMessage('SerialMonitorHub', 'unsubscribe_from_port', arguments);
            },

            getSubscribedClientsIdsToPort : function (port){

                return constructMessage('SerialMonitorHub', 'get_subscribed_clients_ids_to_port', arguments);
            },

            findBoardPort : function (board){

                return constructMessage('SerialMonitorHub', 'find_board_port', arguments);
            },

            isPortConnected : function (port){

                return constructMessage('SerialMonitorHub', 'is_port_connected', arguments);
            },

            getAvailablePorts : function (){

                return constructMessage('SerialMonitorHub', 'get_available_ports', arguments);
            },

            write : function (port, data){

                return constructMessage('SerialMonitorHub', 'write', arguments);
            },

            startConnection : function (port, baudrate){
                arguments[1] = baudrate === undefined ? 9600 : baudrate;
                return constructMessage('SerialMonitorHub', 'start_connection', arguments);
            },

            closeUnusedConnections : function (){

                return constructMessage('SerialMonitorHub', 'close_unused_connections', arguments);
            },

            subscribeToPort : function (port){

                return constructMessage('SerialMonitorHub', 'subscribe_to_port', arguments);
            },

            getSubscribedClientsIds : function (){

                return constructMessage('SerialMonitorHub', 'get_subscribed_clients_ids', arguments);
            },

            subscribeToHub : function (){

                return constructMessage('SerialMonitorHub', 'subscribe_to_hub', arguments);
            },

            changeBaudrate : function (port, baudrate){

                return constructMessage('SerialMonitorHub', 'change_baudrate', arguments);
            },

            closeAllConnections : function (){

                return constructMessage('SerialMonitorHub', 'close_all_connections', arguments);
            },

            unsubscribeFromHub : function (){

                return constructMessage('SerialMonitorHub', 'unsubscribe_from_hub', arguments);
            },

            closeConnection : function (port){

                return constructMessage('SerialMonitorHub', 'close_connection', arguments);
            }
        };
        this.SerialMonitorHub.client = {};
        this.ConfigHub = {};
        this.ConfigHub.server = {
            __HUB_NAME : 'ConfigHub',

            changePlatformioIniFile : function (content){

                return constructMessage('ConfigHub', 'change_platformio_ini_file', arguments);
            },

            setLibrariesPath : function (libDir){

                return constructMessage('ConfigHub', 'set_libraries_path', arguments);
            },

            testProxy : function (proxyUrl){

                return constructMessage('ConfigHub', 'test_proxy', arguments);
            },

            setProxy : function (proxyUrl){

                return constructMessage('ConfigHub', 'set_proxy', arguments);
            },

            setWebSocketInfo : function (iP, port){

                return constructMessage('ConfigHub', 'set_web_socket_info', arguments);
            },

            setLogLevel : function (logLevel){

                return constructMessage('ConfigHub', 'set_log_level', arguments);
            },

            restorePlatformioIniFile : function (){

                return constructMessage('ConfigHub', 'restore_platformio_ini_file', arguments);
            },

            subscribeToHub : function (){

                return constructMessage('ConfigHub', 'subscribe_to_hub', arguments);
            },

            getConfig : function (){

                return constructMessage('ConfigHub', 'get_config', arguments);
            },

            getSubscribedClientsIds : function (){

                return constructMessage('ConfigHub', 'get_subscribed_clients_ids', arguments);
            },

            getLibrariesPath : function (){

                return constructMessage('ConfigHub', 'get_libraries_path', arguments);
            },

            isPossibleLibrariesPath : function (path){

                return constructMessage('ConfigHub', 'is_possible_libraries_path', arguments);
            },

            setValues : function (configDic){

                return constructMessage('ConfigHub', 'set_values', arguments);
            },

            unsubscribeFromHub : function (){

                return constructMessage('ConfigHub', 'unsubscribe_from_hub', arguments);
            }
        };
        this.ConfigHub.client = {};
    }
    /* jshint ignore:end */
    /* ignore jslint end */



    WSHubsAPI.construct = function(serverTimeout, wsClientClass, promiseClass) {
        return new HubsAPI(serverTimeout, wsClientClass, promiseClass);
    };
    return WSHubsAPI;
})(window.WSHubsAPI = window.WSHubsAPI || {}, undefined);
    