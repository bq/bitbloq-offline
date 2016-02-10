'use strict';

/**
 * @ngdoc service
 * @name bitbloqOffline.projectApi
 * @description
 * # projectApi
 * Service in the bitbloqOffline.
 */
angular.module('bitbloqOffline')
    .service('projectApi', function(utils, nodeUtils) {
        var exports = {};

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

        exports.download = function(projectRef) {
            var project = exports.getCleanProject(projectRef);
            var filename = utils.removeDiacritics(projectRef.name);

            nodeUtils.downloadFile(filename.substring(0, 30) + '.json', JSON.stringify(project));
        };
        return exports;
    });