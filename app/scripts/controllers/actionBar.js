'use strict';

/**
 * @ngdoc function
 * @name bitbloqOffline.controller:ActionBarCtrl
 * @description
 * # ActionBarCtrl
 * Controller of the bitbloqOffline
 */
angular.module('bitbloqOffline')
    .controller('ActionBarCtrl', function($rootScope, $scope, $route, bloqs, $log, web2board, _,
        clipboard, bloqsUtils, utils, hw2Bloqs, projectApi, nodeDialog, nodeFs, nodeUtils, common,
        commonModals, alertsService, nodeSequest) {
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
                        resetVars();
                        $route.reload();
                    } else if (confirmed === -1) {
                        projectApi.projectChanged = false;
                        projectApi.savedProjectPath = false;
                        resetVars();
                        $route.reload();
                    }
                });

                // WARN THE USER.
                // If continues, newProject(), else, cancel
            } else {
                projectApi.savedProjectPath = false;
                resetVars();
                $route.reload();
            }
        }

        function resetVars() {
            if ($scope.arduinoMainBloqs.varsBloq) {
                bloqs.removeBloq($scope.arduinoMainBloqs.varsBloq.uuid, true);
                $scope.arduinoMainBloqs.varsBloq = null;
                bloqs.removeBloq($scope.arduinoMainBloqs.setupBloq.uuid, true);
                $scope.arduinoMainBloqs.setupBloq = null;
                bloqs.removeBloq($scope.arduinoMainBloqs.loopBloq.uuid, true);
                $scope.arduinoMainBloqs.loopBloq = null;
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

        function isANewerVersion(projectVersion, currentVersion) {
            projectVersion = projectVersion || "0.0.0";
            currentVersion = currentVersion || "0.0.0";
            projectVersion = projectVersion.split('.');
            currentVersion = currentVersion.split('.');
            for (var i = 0; i < projectVersion.length; i++) {
                if (parseInt(projectVersion[i]) > parseInt(currentVersion[i])) {
                    return true;
                }
            }
            return false;
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
                        extensions: ['json', 'bitbloq']
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

                            //project.bloqsVersion > common.bloqsVersion
                            if (isANewerVersion(project.bloqsVersion, common.bloqsVersion)) {
                                alertsService.add('offline-load-project-error', 'warning', 'warning', 5000, null, false, false);
                            }
                            if (isANewerVersion(project.bitbloqOfflineVersion, common.version)) {
                                alertsService.add('offline-new-version-available', 'info', 'info', 5000, null, false, false);
                            }
                            $scope.setProject(project);
                            projectApi.savedProjectPath = filePath[0];
                            projectApi.projectChanged = false;
                            hw2Bloqs.repaint();
                            $scope.refreshCode();
                            $scope.refreshComponentsArray();
                            $scope.$apply();
                            projectApi.save(project);
                            $rootScope.$emit('refreshScroll');
                            bloqs.updateDropdowns();
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
            deleteFolder('pythonCode');
            var bloqFullDefinition = $scope.pythonBloqs.pythonMainBloq.getBloqsStructure(true);
            var code = pythonGeneration.getCode(bloqFullDefinition);
            var robot = _.find($scope.hardware.robotList, { id: $scope.project.hardware.robot });
            copyFile('app/res/botbloq/' + robot.class, 'pythonCode/class.py', function(err) {
                if (err) {
                    alertsService.add('Error al copiar la clase', 'python', 'error', 10000);
                } else {
                    nodeFs.writeFile('pythonCode/program.py', code, (err) => {
                        if (err) {
                            alertsService.add('Error al copiar el fichero del programa', 'python', 'error', 10000);
                        } else {
                            alertsService.add('Proyecto copiado', 'python', 'ok', 5000);
                        }
                        var client = require('scp2');
                        client.scp('/<ruta>/bitbloq-offline/pythonCode/class.py', {
                            host: '192.168.1.130',
                            username: 'root',
                            password: 'edison',
                            path: '/home/robind/BOTBLOQ/'
                        }, function(err) {
                            console.log('ok', err);
                        });
                        client.scp('/<ruta>/bitbloq-offline/pythonCode/program.py', {
                            host: '192.168.1.130',
                            username: 'root',
                            password: 'edison',
                            path: '/home/robind/BOTBLOQ/'
                        }, function(err) {
                            console.log('ok', err);
                        });
                    });
                }
            });

        }

        function copyFile(source, target, cb) {
            var cbCalled = false;

            var rd = nodeFs.createReadStream(source);
            rd.on("error", function(err) {
                done(err);
            });
            var wr = nodeFs.createWriteStream(target);
            wr.on("error", function(err) {
                done(err);
            });
            wr.on("close", function(ex) {
                done();
            });
            rd.pipe(wr);

            function done(err) {
                if (!cbCalled) {
                    cb(err);
                    cbCalled = true;
                }
            }
        }

        function deleteFolder(dirPath) {
            try {
                var files = nodeFs.readdirSync(dirPath);
            } catch (e) {
                return;
            }
            if (files.length > 0) {
                for (var i = 0; i < files.length; i++) {
                    var filePath = dirPath + '/' + files[i];
                    if (nodeFs.statSync(filePath).isFile())
                        nodeFs.unlinkSync(filePath);
                    else
                        deleteFolder(filePath);
                }
            }

        };

        function verifyCode() {
            var bloqFullDefinition = $scope.pythonBloqs.pythonMainBloq.getBloqsStructure(true);
            var code = pythonGeneration.getCode(bloqFullDefinition);
            nodeFs.writeFile('pythonCode/program.py', code, (err) => {
                const spawn = require('child_process').spawn;
                const python = spawn('python', ['-m', 'py_compile', 'pythonCode/program.py']);

                python.stdout.on('data', (data) => {
                    console.log('stdout:', data.toString('utf8'));
                });

                python.stderr.on('data', (data) => {
                    console.log('stderr:', data.toString('utf8'));
                    alertsService.add('alert-web2board-compile-error', 'python', 'warning', undefined, data.toString('utf8'));
                });

                python.on('close', (code) => {
                    console.log('child process exited with code:', code);
                    if (code === 0) {
                        alertsService.add('alert-web2board-compile-verified', 'python', 'ok', 5000);
                    }
                });
            });

        }

        function startSM() {
            var boardReference = _.find($scope.hardware.boardList, function(b) {
                return b.name === $scope.project.hardware.board;
            });
            web2board.serialMonitor(boardReference);
        }

        function showPlotter() {
            var boardReference = _.find($scope.hardware.boardList, function(b) {
                return b.name === $scope.project.hardware.board;
            });
            web2board.showPlotter(boardReference);
        }

        $scope.$watch(function() {
                return $scope.isInProcess();
            },
            function(newValue) {
                $scope.menuTree.viewMenuItems.items.forEach(function(item) {
                    item.disabled = newValue;
                })
            }
        );

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
                    action: web2board.showWeb2board,
                    disabled: false
                }, {
                    name: 'Ver plotter',
                    icon: '#Ver_verSerialMonitor',
                    action: showPlotter,
                    disabled: false
                }]
            }

        };
    });