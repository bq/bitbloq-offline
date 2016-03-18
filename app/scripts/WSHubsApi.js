(function(WSHubsAPI) {

    /* jshint ignore:start */
    /* ignore jslint start */
    function HubsAPI(url, serverTimeout) {
        'use strict';

        var messageID = 0,
            returnFunctions = {},
            defaultRespondTimeout = (serverTimeout || 5) * 1000,
            thisApi = this,
            messagesBeforeOpen = [],
            onOpenTriggers = [];
        url = url || '';

        this.clearTriggers = function () {
            messagesBeforeOpen = [];
            onOpenTriggers = [];
        };

        this.connect = function (reconnectTimeout) {
            var WebSocket = require('ws');

            reconnectTimeout = reconnectTimeout || -1;
            var openPromise = {
                onSuccess : function() {},
                onError : function(error) {}
            };
            function reconnect(error) {
                if (reconnectTimeout !== -1) {
                    window.setTimeout(function () {
                        thisApi.connect(reconnectTimeout);
                        thisApi.callbacks.onReconnecting(error);
                    }, reconnectTimeout * 1000);
                }
            }
            try {
                this.wsClient = new WebSocket(url);
            } catch (exception) {
                console.error(exception);
                window.setTimeout(function () {
                    openPromise.onError(exception)
                }, 10);
                return { done: function (onSuccess, onError) {
                    openPromise.onSuccess = onSuccess;
                    openPromise.onError = onError;
                }}
            }

            this.wsClient.onopen = function () {
                openPromise.onSuccess();
                openPromise.onError = function () {};
                thisApi.callbacks.onOpen(thisApi);
                onOpenTriggers.forEach(function (trigger) {
                    trigger();
                });
                messagesBeforeOpen.forEach(function (message) {
                    thisApi.wsClient.send(message);
                });
            };

            this.wsClient.onclose = function (error) {
                openPromise.onError(error);
                thisApi.callbacks.onClose(error);
                reconnect(error);
            };

            this.wsClient.addOnOpenTrigger = function (trigger) {
                if (thisApi.wsClient.readyState === 0) {
                    onOpenTriggers.push(trigger);
                } else if (thisApi.wsClient.readyState === 1) {
                    trigger();
                } else {
                    throw new Error("web socket is closed");
                }
            };

            this.wsClient.onmessage = function (ev) {
                try {
                    var f,
                        msgObj = JSON.parse(ev.data);
                    if (msgObj.hasOwnProperty('replay')) {
                        f = returnFunctions[msgObj.ID];
                        if (msgObj.success && f !== undefined && f.onSuccess !== undefined) {
                            f.onSuccess(msgObj.replay);
                        }
                        if (!msgObj.success) {
                            if (f !== undefined && f.onError !== undefined) {
                                f.onError(msgObj.replay);
                            }
                        }
                    } else {
                        f = thisApi[msgObj.hub].client[msgObj.function];
                        if (f!== undefined) {
                            f.apply(f, msgObj.args);
                        } else {
                            this.onClientFunctionNotFound(msgObj.hub, msgObj.function);
                        }
                    }
                } catch (err) {
                    this.onMessageError(err);
                }
            };

            this.wsClient.onerror = function () {
                thisApi.callbacks.onMessageError(error)
            };

            this.wsClient.onMessageError = function (error) {
                openPromise.onError(error.message);
                thisApi.callbacks.onMessageError(error);
            };

            //this.wsClient.on('open', this.wsClient.onopen);
            //
            //this.wsClient.on('close', this.wsClient.onclose);
            //
            //this.wsClient.on('message', this.wsClient.onmessage);

            this.wsClient.on('error', this.wsClient.onMessageError);

            return { done: function (onSuccess, onError) {
                openPromise.onSuccess = onSuccess;
                openPromise.onError = onError;
            }
            };
        };

        this.callbacks = {
            onClose: function (error) {},
            onOpen: function () {},
            onReconnecting: function () {},
            onMessageError: function (error){},
            onClientFunctionNotFound: function (hub, func) {}
        };

        this.defaultErrorHandler = null;

        var constructMessage = function (hubName, functionName, args) {
            if(thisApi.wsClient === undefined) {
                throw Error('ws not connected');
            }
            args = Array.prototype.slice.call(args);
            var id = messageID++,
                body = {'hub': hubName, 'function': functionName, 'args': args, 'ID': id};
            if(thisApi.wsClient.readyState === WebSocket.CONNECTING) {
                messagesBeforeOpen.push(JSON.stringify(body));
            } else if (thisApi.wsClient.readyState !== WebSocket.OPEN) {
                window.setTimeout(function () {
                    var f = returnFunctions[id];
                    if (f !== undefined && f.onError !== undefined) {
                        f.onError('webSocket not connected');
                    }
                }, 0);
                return {done: getReturnFunction(id, {hubName: hubName, functionName: functionName, args: args})};
            }
            else {
                thisApi.wsClient.send(JSON.stringify(body));
            }
            return getReturnFunction(id, {hubName: hubName, functionName: functionName, args: args});
        };

        var getReturnFunction = function (ID, callInfo) {

            function Future (ID, callInfo) {
                var self = this;
                this.done = function(onSuccess, onError, respondsTimeout) {
                    if (returnFunctions[ID] === undefined) {
                        returnFunctions[ID] = {};
                    }
                    var f = returnFunctions[ID];
                    f.onSuccess = function () {
                        try{
                            if(onSuccess !== undefined) {
                                onSuccess.apply(onSuccess, arguments);
                            }
                        } finally {
                            delete returnFunctions[ID];
                            self._finally();
                        }
                    };
                    f.onError = function () {
                        try{
                            if(onError !== undefined) {
                                onError.apply(onError, arguments);
                            } else if (thisApi.defaultErrorHandler !== null){
                                var argumentsArray = [callInfo].concat(arguments);
                                thisApi.defaultErrorHandler.apply(thisApi.defaultErrorHandler.apply, argumentsArray);
                            }
                        } finally {
                            delete returnFunctions[ID];
                            self._finally();
                        }
                    };
                    //check returnFunctions, memory leak
                    respondsTimeout = respondsTimeout ? respondsTimeout : defaultRespondTimeout;
                    if(respondsTimeout >=0) {
                        setTimeout(function () {
                            if (returnFunctions[ID] && returnFunctions[ID].onError) {
                                returnFunctions[ID].onError('timeOut Error');
                            }
                        }, respondsTimeout);
                    }
                    return self;
                };
                this.finally = function (finallyCallback) {
                    self._finally = finallyCallback;
                };
                this._finally = function () {};
            };
            return new Future(ID, callInfo)
        };


        this.CodeHub = {};
        this.CodeHub.server = {
            __HUB_NAME : 'CodeHub',

            uploadHex : function (hexText, board, port){
                arguments[0] = hexText === undefined ? null : hexText;
                return constructMessage('CodeHub', 'uploadHex', arguments);
            },

            getSubscribedClientsToHub : function (){

                return constructMessage('CodeHub', 'getSubscribedClientsToHub', arguments);
            },

            unsubscribeFromHub : function (){

                return constructMessage('CodeHub', 'unsubscribeFromHub', arguments);
            },

            upload : function (code, board, port){
                arguments[0] = code === undefined ? null : code;
                return constructMessage('CodeHub', 'upload', arguments);
            },

            compile : function (code){

                return constructMessage('CodeHub', 'compile', arguments);
            },

            subscribeToHub : function (){

                return constructMessage('CodeHub', 'subscribeToHub', arguments);
            },

            uploadHexFile : function (hexFilePath, board, port){
                arguments[0] = hexFilePath === undefined ? null : hexFilePath;
                return constructMessage('CodeHub', 'uploadHexFile', arguments);
            },

            tryToTerminateSerialCommProcess : function (){

                return constructMessage('CodeHub', 'tryToTerminateSerialCommProcess', arguments);
            }
        };
        this.CodeHub.client = {};
        this.VersionsHandlerHub = {};
        this.VersionsHandlerHub.server = {
            __HUB_NAME : 'VersionsHandlerHub',

            setLibVersion : function (version){

                return constructMessage('VersionsHandlerHub', 'setLibVersion', arguments);
            },

            getSubscribedClientsToHub : function (){

                return constructMessage('VersionsHandlerHub', 'getSubscribedClientsToHub', arguments);
            },

            unsubscribeFromHub : function (){

                return constructMessage('VersionsHandlerHub', 'unsubscribeFromHub', arguments);
            },

            subscribeToHub : function (){

                return constructMessage('VersionsHandlerHub', 'subscribeToHub', arguments);
            },

            getVersion : function (){

                return constructMessage('VersionsHandlerHub', 'getVersion', arguments);
            },

            setWeb2boardVersion : function (version){

                return constructMessage('VersionsHandlerHub', 'setWeb2boardVersion', arguments);
            }
        };
        this.VersionsHandlerHub.client = {};
        this.WindowHub = {};
        this.WindowHub.server = {
            __HUB_NAME : 'WindowHub',

            cleanConsole : function (){

                return constructMessage('WindowHub', 'cleanConsole', arguments);
            },

            getSubscribedClientsToHub : function (){

                return constructMessage('WindowHub', 'getSubscribedClientsToHub', arguments);
            },

            unsubscribeFromHub : function (){

                return constructMessage('WindowHub', 'unsubscribeFromHub', arguments);
            },

            showApp : function (){

                return constructMessage('WindowHub', 'showApp', arguments);
            },

            closeApp : function (){

                return constructMessage('WindowHub', 'closeApp', arguments);
            },

            subscribeToHub : function (){

                return constructMessage('WindowHub', 'subscribeToHub', arguments);
            },

            forceClose : function (){

                return constructMessage('WindowHub', 'forceClose', arguments);
            }
        };
        this.WindowHub.client = {};
        this.UtilsAPIHub = {};
        this.UtilsAPIHub.server = {
            __HUB_NAME : 'UtilsAPIHub',

            getSubscribedClientsToHub : function (){

                return constructMessage('UtilsAPIHub', 'getSubscribedClientsToHub', arguments);
            },

            getId : function (){

                return constructMessage('UtilsAPIHub', 'getId', arguments);
            },

            isClientConnected : function (clientId){

                return constructMessage('UtilsAPIHub', 'isClientConnected', arguments);
            },

            unsubscribeFromHub : function (){

                return constructMessage('UtilsAPIHub', 'unsubscribeFromHub', arguments);
            },

            subscribeToHub : function (){

                return constructMessage('UtilsAPIHub', 'subscribeToHub', arguments);
            },

            setId : function (clientId){

                return constructMessage('UtilsAPIHub', 'setId', arguments);
            },

            getHubsStructure : function (){

                return constructMessage('UtilsAPIHub', 'getHubsStructure', arguments);
            }
        };
        this.UtilsAPIHub.client = {};
        this.SerialMonitorHub = {};
        this.SerialMonitorHub.server = {
            __HUB_NAME : 'SerialMonitorHub',

            findBoardPort : function (board){

                return constructMessage('SerialMonitorHub', 'findBoardPort', arguments);
            },

            changeBaudrate : function (port, baudrate){

                return constructMessage('SerialMonitorHub', 'changeBaudrate', arguments);
            },

            getSubscribedClientsToHub : function (){

                return constructMessage('SerialMonitorHub', 'getSubscribedClientsToHub', arguments);
            },

            unsubscribeFromHub : function (){

                return constructMessage('SerialMonitorHub', 'unsubscribeFromHub', arguments);
            },

            startApp : function (port, board){

                return constructMessage('SerialMonitorHub', 'startApp', arguments);
            },

            write : function (port, data){

                return constructMessage('SerialMonitorHub', 'write', arguments);
            },

            closeConnection : function (port){

                return constructMessage('SerialMonitorHub', 'closeConnection', arguments);
            },

            subscribeToHub : function (){

                return constructMessage('SerialMonitorHub', 'subscribeToHub', arguments);
            },

            getAvailablePorts : function (){

                return constructMessage('SerialMonitorHub', 'getAvailablePorts', arguments);
            },

            startConnection : function (port, baudrate){
                arguments[0] = port === undefined ? 9600 : port;
                return constructMessage('SerialMonitorHub', 'startConnection', arguments);
            },

            isPortConnected : function (port){

                return constructMessage('SerialMonitorHub', 'isPortConnected', arguments);
            }
        };
        this.SerialMonitorHub.client = {};
        this.ConfigHub = {};
        this.ConfigHub.server = {
            __HUB_NAME : 'ConfigHub',

            restorePlatformioIniFile : function (){

                return constructMessage('ConfigHub', 'restorePlatformioIniFile', arguments);
            },

            setWebSocketInfo : function (IP, port){

                return constructMessage('ConfigHub', 'setWebSocketInfo', arguments);
            },

            getLibrariesPath : function (){

                return constructMessage('ConfigHub', 'getLibrariesPath', arguments);
            },

            setLogLevel : function (logLevel){

                return constructMessage('ConfigHub', 'setLogLevel', arguments);
            },

            getSubscribedClientsToHub : function (){

                return constructMessage('ConfigHub', 'getSubscribedClientsToHub', arguments);
            },

            unsubscribeFromHub : function (){

                return constructMessage('ConfigHub', 'unsubscribeFromHub', arguments);
            },

            changePlatformioIniFile : function (content){

                return constructMessage('ConfigHub', 'changePlatformioIniFile', arguments);
            },

            setLibrariesPath : function (libDir){

                return constructMessage('ConfigHub', 'setLibrariesPath', arguments);
            },

            subscribeToHub : function (){

                return constructMessage('ConfigHub', 'subscribeToHub', arguments);
            },

            getConfig : function (){

                return constructMessage('ConfigHub', 'getConfig', arguments);
            },

            setValues : function (configDic){

                return constructMessage('ConfigHub', 'setValues', arguments);
            }
        };
        this.ConfigHub.client = {};
    }
    /* jshint ignore:end */
    /* ignore jslint end */



    WSHubsAPI.construct = function (url, serverTimeout){
        return new HubsAPI(url, serverTimeout)
    };
    return WSHubsAPI;
})(window.WSHubsAPI = window.WSHubsAPI || {}, undefined);
    