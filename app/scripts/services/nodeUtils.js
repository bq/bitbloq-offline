'use strict';

/**
 * @ngdoc service
 * @name bitbloqApp.utils
 * @description
 * # utils
 * Service in the bitbloqApp.
 */
angular.module('bitbloqOffline')
    .service('nodeUtils', function(nodeDialog, nodeFs) {
        var exports = {};

        exports.downloadFile = function(fileName, data, defaultExtension, callback) {
            var filePath = nodeDialog.showSaveDialog({
                defaultPath: fileName
            });
            if (filePath) {
                if (defaultExtension && filePath.indexOf('.') === -1) {
                    filePath += defaultExtension;
                }
                nodeFs.writeFileSync(filePath, data);
                callback(filePath);
            }
        };

        return exports;
    });