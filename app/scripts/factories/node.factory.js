'use strict';

angular.module('bitbloqOffline').factory('nodeRemote', function() {
    return require('remote');
}).factory('nodeDialog', function(nodeRemote) {
    return nodeRemote.require('dialog');
}).factory('nodeFs', function() {
    return require('fs');
});