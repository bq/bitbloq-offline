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

        exports.downloadFile = function(fileName, data) {
            var filePath = nodeDialog.showSaveDialog({
                defaultPath: fileName
            });
            if (filePath) {
                nodeFs.writeFileSync(filePath, data);
            }
        };
        return exports;
    });