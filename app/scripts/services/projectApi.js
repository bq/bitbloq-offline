'use strict';

/**
 * @ngdoc service
 * @name bitbloqOffline.projectApi
 * @description
 * # projectApi
 * Service in the bitbloqOffline.
 */
angular.module('bitbloqOffline')
    .service('projectApi', function(utils, nodeUtils, common, _, nodeFs, alertsService) {
        var exports = {};
        exports.savedProjectPath = null;
        exports.oldProject = null;
        exports.projectChanged = false;
        exports.getCleanProject = function(projectRef) {
            var cleanProject = _.cloneDeep(projectRef);
            delete cleanProject.id;
            delete cleanProject._acl;
            delete cleanProject.creatorId;
            delete cleanProject.creatorUsername;
            delete cleanProject._createdAt;
            delete cleanProject._updatedAt;
            delete cleanProject.links;

            return cleanProject;
        };

        function download(projectRef, callback) {
            var project = exports.getCleanProject(projectRef),
                filename = utils.removeDiacritics(common.translate('new-project'));

            project.exportedFromBitbloqOffline = true;
            project.bitbloqOfflineVersion = common.version;
            project.bloqsVersion = common.bloqsVersion;
            nodeUtils.downloadFile(filename.substring(0, 30) + '.bitbloq', JSON.stringify(project), '.bitbloq', function(path) {
                exports.savedProjectPath = path;
                exports.oldProject = project;
                exports.projectChanged = false;
                callback(true);
            });
        }

        exports.exportArduinoCode = function(componentsArray, arduinoMainBloqs) {
            var code = utils.prettyCode(bloqsUtils.getCode(componentsArray, arduinoMainBloqs)),
                filename = utils.removeDiacritics(common.translate('new-project'));

            nodeUtils.downloadFile(filename.substring(0, 30) + '.ino', code, '.ino', function(path) {
                alertsService.add('make-saved-project', 'project-saved', 'ok', 3000);
                exports.savedInoPath = path;
            });
        };

        exports.save = function(projectRef, callback) {
            if (exports.savedProjectPath) {
                var project = exports.getCleanProject(projectRef);
                project.exportedFromBitbloqOffline = true;
                project.bitbloqOfflineVersion = common.version;
                nodeFs.writeFile(exports.savedProjectPath, JSON.stringify(project), 'utf8', function(err) {
                    if (err) {
                        throw err;
                    } else {
                        exports.oldProject = project;
                        exports.projectChanged = false;
                        if (callback) {
                            callback(true);
                        }
                    }
                });
            } else {
                download(projectRef, function() {
                    if (callback) {
                        callback(true);
                    }
                });
            }
        };

        exports.saveAs = function(projectRef, callback) {
            download(projectRef, function() {
                if (callback) {
                    callback(true);
                }
            });
        };

        exports.hasChanged = function(project) {
            if (exports.oldProject && _.isEqual(project.hardware, exports.oldProject.hardware) && _.isEqual(project.software, exports.oldProject.software) && !exports.projectChanged) {
                return false;
            } else {
                return true;
            }
        };


        return exports;
    });