/* global angular */
'use strict';

angular.module('bitbloqOffline')
    .factory('OpenWindow', function($location) {
        var BrowserWindow = require('electron').remote.BrowserWindow;
        return {
            open: function(windowArguments, onUnload) {
                var win = new BrowserWindow(windowArguments);
                win.on('closed', onUnload);
                console.log($location);
                win.loadURL('file://' + __dirname + '/index.html#/' + windowArguments.url);
                win.show();
                // win.webContents.openDevTools();
                return win;
            }
        };
    });