'use strict';

/**
 * @ngdoc function
 * @name bitbloqOffline.controller:ActionBarCtrl
 * @description
 * # ActionBarCtrl
 * Controller of the bitbloqOffline
 */
angular.module('bitbloqOffline')
    .controller('ActionBarCtrl', function($rootScope, $scope, $route, $log, web2board, _, clipboard, bloqsUtils, utils, hw2Bloqs, projectApi, nodeDialog, nodeFs, nodeUtils, common, commonModals, alertsService) {
        $log.debug('ActionBarCtrl', $scope.$parent.$id);

        $scope.actions = {
            newProject: newProject,
            openProject: openProject,
            changeLanguage: changeLanguage,
            copyCodeToClipboard: copyCodeToClipboard,
            verifyCode: verifyCode,
            loadToBoard: loadToBoard
        };


        $scope.isInProcess = web2board.isInProcess;

        function newProject() {
            if (projectApi.hasChanged($scope.getCurrentProject())) {
                commonModals.launchNotSavedModal(function(confirmed) {
                    if (confirmed === 0) {
                        $scope.saveProject($scope.getCurrentProject());
                        $route.reload();
                    } else if (confirmed === -1) {
                        projectApi.projectChanged = false;
                        projectApi.savedProjectPath = false;
                        if ($scope.arduinoMainBloqs.varsBloq) {
                            bloqs.removeBloq($scope.arduinoMainBloqs.varsBloq.uuid, true);
                            $scope.arduinoMainBloqs.varsBloq = null;
                            bloqs.removeBloq($scope.arduinoMainBloqs.setupBloq.uuid, true);
                            $scope.arduinoMainBloqs.setupBloq = null;
                            bloqs.removeBloq($scope.arduinoMainBloqs.loopBloq.uuid, true);
                            $scope.arduinoMainBloqs.loopBloq = null;
                        }
                        $route.reload();
                    }
                });

                // WARN THE USER.
                // If continues, newProject(), else, cancel
            } else {
                projectApi.savedProjectPath = false;
                $route.reload();
            }
        }

        function redirect(url) {
            var BrowserWindow = require('electron').remote.BrowserWindow;

            var win = new BrowserWindow({
                width: 800,
                height: 600,
                show: false
            });
            win.on('closed', function() {
                win = null;
            });

            win.loadURL(url);
            win.show();
        }

        function openProject(force) {
            if (projectApi.hasChanged($scope.getCurrentProject()) && !force) {
                commonModals.launchNotSavedModal(function(confirmed) {
                    if (confirmed === 0) {
                        projectApi.save($scope.getCurrentProject(), function() {
                            console.log('saved');
                            openProject(true);
                        });
                    } else if (confirmed === -1) {
                        openProject(true);
                    }
                });
            } else {
                var filePath = nodeDialog.showOpenDialog({
                    properties: ['openFile', 'createDirectory'],
                    filters: [{
                        name: 'Bitbloq',
                        extensions: ['json']
                    }, {
                        name: 'All Files',
                        extensions: ['*']
                    }]
                });

                if (filePath) {
                    nodeFs.readFile(filePath[0], function(err, data) {
                        if (err) {
                            throw err;
                        } else {
                            var project = JSON.parse(data);

                            if (project.bloqsVersion > common.bloqsVersion) {
                                alertsService.add('offline-load-project-error', 'error', 'error', 5000, null, false, false, 'offline-update', redirect, 'http://bitbloq.bq.com/#/');
                            } else {
                                if (project.bloqsVersion < common.bloqsVersion) {
                                    alertsService.add('offline-new-version-available', 'info', 'info', 5000, null, false, false, 'offline-update', redirect, 'http://bitbloq.bq.com/#/');
                                }
                                $scope.setProject(project);
                                projectApi.savedProjectPath = filePath[0];
                                projectApi.projectChanged = false;
                                hw2Bloqs.repaint();
                                $scope.$apply();
                                projectApi.save(project);
                                projectApi.oldProject = projectApi.getCleanProject($scope.getCurrentProject());
                                $rootScope.$emit('refreshScroll');
                            }
                        }
                    });
                }
            }
        }

        function changeLanguage() {
            commonModals.launchChangeLanguageModal();
        }

        function copyCodeToClipboard() {
            var code = utils.prettyCode(bloqsUtils.getCode($scope.componentsArray, $scope.arduinoMainBloqs));
            $log.debug(code);
            alertsService.add('make-code-clipboard', 'code-clipboard', 'ok', 3000);
            clipboard.copyText(code);
        }

        function loadToBoard() {
            var code = bloqsUtils.getCode($scope.componentsArray, $scope.arduinoMainBloqs);
            var pretty = utils.prettyCode(code);
            var boardReference = _.find($scope.hardware.boardList, function(b) {
                return b.name === $scope.project.hardware.board;
            });
            web2board.upload(boardReference, pretty);
        }

        function verifyCode() {
            var code = bloqsUtils.getCode($scope.componentsArray, $scope.arduinoMainBloqs);
            var pretty = utils.prettyCode(code);
            web2board.verify(pretty);
        }

        function startSM() {
            var boardReference = _.find($scope.hardware.boardList, function(b) {
                return b.name === $scope.project.hardware.board;
            });
            web2board.serialMonitor(boardReference);
        }

        function showWeb2board() {
            web2board.showWeb2board();
        }

        $scope.menuTree = {
            fileMenuItems: {
                name: 'file',
                items: [{
                    name: 'create-new-project',
                    icon: '#nuevoProyecto',
                    action: newProject,
                    disabled: false
                }, {
                    name: 'open-project',
                    icon: '#abrirProyecto',
                    action: openProject,
                    disabled: false
                }, {
                    name: 'save',
                    icon: '#guardar',
                    action: $scope.saveProject,
                    disabled: false
                }, {
                    name: 'offline-save-as',
                    icon: '#guardar',
                    action: $scope.saveProjectAs,
                    disabled: false
                }, {
                    name: 'export-arduino-code',
                    icon: '#exportcode',
                    action: $scope.saveIno,
                    disabled: false
                }, {
                    name: 'change-language',
                    icon: '#cambiarIdioma',
                    action: changeLanguage,
                    disabled: false
                }]
            },
            editMenuItems: {
                name: 'edit',
                items: [{
                    name: 'makeActions_copyCode',
                    icon: '#copiarTexto',
                    action: copyCodeToClipboard,
                    disabled: false
                }]
            },
            viewMenuItems: {
                name: 'see',
                items: [{
                    name: 'show-console',
                    icon: '#Ver_verSerialMonitor',
                    action: startSM,
                    disabled: false
                }, {
                    name: 'show-web2board',
                    icon: '#web2board',
                    action: showWeb2board,
                    disabled: false
                }]
            }

        };
    });
