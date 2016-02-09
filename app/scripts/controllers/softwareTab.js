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
            if (mainBloqs.varsBloq) {
                bloqs.removeBloq(mainBloqs.varsBloq.uuid, true);
                mainBloqs.varsBloq = null;
                bloqs.removeBloq(mainBloqs.setupBloq.uuid, true);
                mainBloqs.setupBloq = null;
                bloqs.removeBloq(mainBloqs.loopBloq.uuid, true);
                mainBloqs.loopBloq = null;
            }

            mainBloqs.varsBloq = bloqs.buildBloqWithContent($scope.project.software.vars, $scope.componentsArray, bloqsSchemas, $field);
            mainBloqs.setupBloq = bloqs.buildBloqWithContent($scope.project.software.setup, $scope.componentsArray, bloqsSchemas);
            mainBloqs.loopBloq = bloqs.buildBloqWithContent($scope.project.software.loop, $scope.componentsArray, bloqsSchemas);

            $field.append(mainBloqs.varsBloq.$bloq, mainBloqs.setupBloq.$bloq, mainBloqs.loopBloq.$bloq);
            mainBloqs.varsBloq.enable(true);
            mainBloqs.varsBloq.doConnectable();

            mainBloqs.setupBloq.enable(true);
            mainBloqs.setupBloq.doConnectable();

            mainBloqs.loopBloq.enable(true);
            mainBloqs.loopBloq.doConnectable();

            bloqs.updateDropdowns();
        };

        var fs = require('fs'),
            bloqsSchemas = null,
            mainBloqs = {
                varsBloq: null,
                setupBloq: null,
                loopBloq: null
            },
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