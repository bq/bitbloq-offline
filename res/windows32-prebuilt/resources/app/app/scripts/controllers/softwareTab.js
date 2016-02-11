'use strict';

/**
 * @ngdoc function
 * @name bitbloqOffline.controller:BloqsTabCtrl
 * @description
 * # BloqsTabCtrl
 * Controller of the bitbloqOffline
 */
angular.module('bitbloqOffline')
    .controller('SoftwareTabCtrl', function($scope, common, bloqs) {
        console.log('SoftwareTabCtrl', $scope.$parent.$id);

        $scope.init = function() {
            if ($scope.arduinoMainBloqs.varsBloq) {
                bloqs.removeBloq($scope.arduinoMainBloqs.varsBloq.uuid, true);
                $scope.arduinoMainBloqs.varsBloq = null;
                bloqs.removeBloq($scope.arduinoMainBloqs.setupBloq.uuid, true);
                $scope.arduinoMainBloqs.setupBloq = null;
                bloqs.removeBloq($scope.arduinoMainBloqs.loopBloq.uuid, true);
                $scope.arduinoMainBloqs.loopBloq = null;
            }

            $scope.arduinoMainBloqs.varsBloq = bloqs.buildBloqWithContent($scope.project.software.vars, $scope.componentsArray, bloqsSchemas, $field);
            $scope.arduinoMainBloqs.setupBloq = bloqs.buildBloqWithContent($scope.project.software.setup, $scope.componentsArray, bloqsSchemas);
            $scope.arduinoMainBloqs.loopBloq = bloqs.buildBloqWithContent($scope.project.software.loop, $scope.componentsArray, bloqsSchemas);

            $field.append($scope.arduinoMainBloqs.varsBloq.$bloq, $scope.arduinoMainBloqs.setupBloq.$bloq, $scope.arduinoMainBloqs.loopBloq.$bloq);
            $scope.arduinoMainBloqs.varsBloq.enable(true);
            $scope.arduinoMainBloqs.varsBloq.doConnectable();

            $scope.arduinoMainBloqs.setupBloq.enable(true);
            $scope.arduinoMainBloqs.setupBloq.doConnectable();

            $scope.arduinoMainBloqs.loopBloq.enable(true);
            $scope.arduinoMainBloqs.loopBloq.doConnectable();

            bloqs.updateDropdowns();
        };

        var fs = require('fs'),
            bloqsSchemas = null,
            $field = $('#bloqs--field').last();
        //load Bloqs
        // console.log(common.appPath);
        // console.log(common.webPath);
        // console.log(common.resourcesPath);
        fs.readFile(common.resourcesPath + '/app/bower_components/bloqs/dist/bloqsmap.json', function(err, data) {
            if (err) {
                fs.readFile(common.appPath + '/bower_components/bloqs/dist/bloqsmap.json', function(err, data) {
                    if (err) {
                        throw err;
                    } else {
                        bloqsSchemas = JSON.parse(data.toString());
                        $scope.$watch('project.software', function(newValue) {
                            if (newValue) {
                                console.log('refersh project software');
                                $scope.init();
                            }
                        });
                        $scope.init();

                    }
                });
            } else {
                bloqsSchemas = JSON.parse(data.toString());
                $scope.$watch('project.software', function(newValue) {
                    if (newValue) {
                        console.log('refersh project software');
                        $scope.init();
                    }
                });
                $scope.init();
            }
        });
    });