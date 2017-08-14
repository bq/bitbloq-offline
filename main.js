'use strict';
const electron = require('electron');
const pjson = require('./package.json');
const PRODUCT_NAME = 'Bitbloq Offline';
const PRODUCT_NAME_WITH_VERSION = PRODUCT_NAME + ' v' + pjson.version;
const app = electron.app; // Module to control application life.
const BrowserWindow = electron.BrowserWindow; // Module to create native browser window.

// Report crashes to our server.
electron.crashReporter.start({
    productName: PRODUCT_NAME,
    companyName: 'BQ',
    submitURL: 'https://bitbloq.bq.com/bitbloq-offline',
    autoSubmit: false
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        show: false,
        minWidth: 800,
        minHeight: 600,
        width: 1440,
        height: 800,
        center: true,
        minimizable: true,
        maximizable: true,
        movable: true,
        closable: true,
        fullscreen: false,
        fullscreenable: true,
        title: PRODUCT_NAME_WITH_VERSION,
        icon: __dirname + '/app/images/bitbloq_ico.png'
    });
    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/app/index.html');
    // mainWindow.center();
    mainWindow.show();

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.setTitle(PRODUCT_NAME_WITH_VERSION);
    });


    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        mainWindow = null;
        if (process.platform === 'darwin') {
            app.quit();
        }
    });
    // mainWindow.setMenu(null);
});