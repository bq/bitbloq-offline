'use strict';

/**
 * @ngdoc function
 * @name bitbloqOffline.controller:BloqsTabCtrl
 * @description
 * # BloqsTabCtrl
 * Controller of the bitbloqOffline
 */
angular.module('bitbloqOffline')
    .controller('SoftwareTabCtrl', function($scope, common, bloqs, $translate, $rootScope, $document, $log, $window, web2board) {
        $log.debug('SoftwareTabCtrl', $scope.$parent.$id);

        $scope.init = function() {
            if ($scope.arduinoMainBloqs.varsBloq) {
                bloqs.removeBloq($scope.arduinoMainBloqs.varsBloq.uuid, true);
                $scope.arduinoMainBloqs.varsBloq = null;
                bloqs.removeBloq($scope.arduinoMainBloqs.setupBloq.uuid, true);
                $scope.arduinoMainBloqs.setupBloq = null;
                bloqs.removeBloq($scope.arduinoMainBloqs.loopBloq.uuid, true);
                $scope.arduinoMainBloqs.loopBloq = null;
            }

            $scope.arduinoMainBloqs.varsBloq = bloqs.buildBloqWithContent($scope.project.software.vars, $scope.componentsArray, bloqsSchemas, $scope.$field);
            $scope.arduinoMainBloqs.setupBloq = bloqs.buildBloqWithContent($scope.project.software.setup, $scope.componentsArray, bloqsSchemas);
            $scope.arduinoMainBloqs.loopBloq = bloqs.buildBloqWithContent($scope.project.software.loop, $scope.componentsArray, bloqsSchemas);

            $scope.$field.append($scope.arduinoMainBloqs.varsBloq.$bloq, $scope.arduinoMainBloqs.setupBloq.$bloq, $scope.arduinoMainBloqs.loopBloq.$bloq);
            $scope.arduinoMainBloqs.varsBloq.enable(true);
            $scope.arduinoMainBloqs.varsBloq.doConnectable();

            $scope.arduinoMainBloqs.setupBloq.enable(true);
            $scope.arduinoMainBloqs.setupBloq.doConnectable();

            $scope.arduinoMainBloqs.loopBloq.enable(true);
            $scope.arduinoMainBloqs.loopBloq.doConnectable();

            bloqs.translateBloqs($translate.use());

            $rootScope.$on('$translateChangeStart', function(evt, key) {
                bloqs.translateBloqs(key.language);
            });
            $scope.updateBloqs();
        };

        $scope.onFieldKeyUp = function(event) {
            $log.debug('event.keyCode', event.keyCode);
            var bloq;

            switch (event.keyCode) {
                case 46:
                case 8:
                    if ($document[0].activeElement.attributes['data-bloq-id']) {
                        event.preventDefault();
                        bloq = bloqs.bloqs[$document[0].activeElement.attributes['data-bloq-id'].value];
                        if (bloq.bloqData.type !== 'group' && bloqs.bloqs[bloq.uuid].isConnectable()) {
                            bloqs.removeBloq($document[0].activeElement.attributes['data-bloq-id'].value, true);
                            $scope.$field.focus();
                        } else {
                            $log.debug('we cant delete group bloqs');
                        }
                    }
                    break;
                case 67:
                    //$log.debug('ctrl + c');
                    if (event.ctrlKey && $document[0].activeElement.attributes['data-bloq-id']) {
                        bloq = bloqs.bloqs[$document[0].activeElement.attributes['data-bloq-id'].value];
                        var position = bloq.$bloq[0].getBoundingClientRect();
                        if (bloq.bloqData.type !== 'group') {
                            var bloqInClipboard = {
                                structure: bloq.getBloqsStructure(),
                                top: position.top,
                                left: position.left
                            };
                            clipboard.writeText(JSON.stringify(bloqInClipboard), 'bloq');
                        }
                    }

                    break;
                case 86:
                    //$log.debug('ctrl + v');
                    bloq = clipboard.readText('bloq');
                    if (event.ctrlKey && bloq.indexOf('{') > -1) {
                        copyBloq(JSON.parse(bloq));
                        $scope.$field.focus();
                    }
                    break;
                    // case 89:
                    // $log.debug('ctrl + y');
                    // if (event.ctrlKey) {
                    //   $scope.redo();
                    //   $window.document.getElementById('bloqs--field').focus();
                    // }
                    // break;
                    // case 90:
                    // $log.debug('ctrl + z');
                    // if (event.ctrlKey) {
                    // $scope.undo();
                    // $window.document.getElementById('bloqs--field').focus();
                    // }
                    // break;
            }
        };

        $scope.enableBloqFromContextMenu = function(bloq) {
            bloq.enable();
            // $scope.saveBloqStep();
        };
        $scope.disableBloqFromContextMenu = function(bloq) {
            bloq.disable();
            // $scope.saveBloqStep();
        };
        $scope.removeBloqFromContextMenu = function(bloq) {
            bloqs.removeBloq(bloq.uuid, true);
            //saveBloqStep from here to not listen remove event from children and store one step for children
            // $scope.saveBloqStep();
        };

        $scope.duplicateBloqFromContextMenu = function(bloq) {
            var position = bloq.$bloq[0].getBoundingClientRect();
            copyBloq({
                structure: bloq.getBloqsStructure(),
                top: position.top,
                left: position.left
            });
        };

        function contextMenuDocumentHandler(event) {
            var bloq = $(event.target).closest('.bloq');
            var bloqUuid = bloq.attr('data-bloq-id');

            if (bloqUuid && !bloq.hasClass('bloq--group') && bloqs.bloqs[bloqUuid].isConnectable()) {
                event.preventDefault();
                $scope.$apply(function() {
                    $scope.contextMenuBloq = bloqs.bloqs[bloqUuid];
                });
                if ((angular.element($window).height() - event.pageY) > $contextMenu.height()) {
                    $contextMenu.css({
                        display: 'block',
                        left: event.pageX + 'px',
                        top: event.pageY + 'px'
                    });
                } else {
                    $contextMenu.css({
                        display: 'block',
                        left: event.pageX + 'px',
                        top: (event.pageY - $contextMenu.height()) + 'px'
                    });
                }

            } else {
                $contextMenu.css({
                    display: 'none'
                });
            }
        }

        function clickDocumentHandler() {
            $contextMenu.css({
                display: 'none'
            });
        }

        function copyBloq(bloq) {

            var newBloq = bloqs.buildBloqWithContent(bloq.structure, $scope.componentsArray, common.bloqsSchemas);

            newBloq.doConnectable();
            newBloq.disable();

            newBloq.$bloq[0].style.transform = 'translate(' + (bloq.left - 50) + 'px,' + (bloq.top - 100) + 'px)';
            $scope.$field.append(newBloq.$bloq);
            var i = 0;
            if (newBloq.varInputs) {
                for (i = 0; i < newBloq.varInputs.length; i++) {
                    newBloq.varInputs[i].keyup();
                }
            }
        }
        bloqs.updateDropdowns();

        const clipboard = require('electron').clipboard;
        var fs = require('fs'),
            bloqsSchemas = null,
            $contextMenu = $('#bloqs-context-menu');
        $scope.$field = $('#bloqs--field').last();
        //load Bloqs
        // console.log(common.appPath);
        // console.log(common.webPath);
        // console.log(common.resourcesPath);

        $scope.resetZowi = function() {
            fs.readFile(common.appPath + '/app/res/zowi.hex', 'utf8', function(err, data) {
                if (err) {
                    throw err;
                } else {
                    web2board.uploadHex('uno', data);
                }
            });
        };

        function initBloqs(schemas) {
            bloqsSchemas = JSON.parse(schemas.toString());
            bloqs.setOptions({
                fieldOffsetLeft: 48,
                fieldOffsetTopForced: 41,
                forcedScrollTop: 0,
                bloqSchemas: bloqsSchemas,
                suggestionWindowParent: document.getElementById('bloqs--field')
            });

            $scope.$watch('project.software', function(newValue) {
                if (newValue) {
                    $scope.init();
                }
            });
            $scope.init();
        }

        fs.readFile(common.resourcesPath + '/app/bower_components/bloqs/dist/bloqsmap.json', function(err, data) {
            if (err) {
                fs.readFile(common.appPath + '/bower_components/bloqs/dist/bloqsmap.json', function(err, data) {
                    if (err) {
                        throw err;
                    } else {
                        initBloqs(data);

                    }
                });
            } else {
                initBloqs(data);
            }
        });
        $document.on('contextmenu', contextMenuDocumentHandler);
        $document.on('click', clickDocumentHandler);
    });