'use strict';

/**
 * @ngdoc function
 * @name bitbloqOffline.controller:ActionBarCtrl
 * @description
 * # ActionBarCtrl
 * Controller of the bitbloqOffline
 */
angular.module('bitbloqOffline')
    .controller('ActionBarCtrl', function($scope, $route, web2board, clipboard, bloqsUtils, utils, projectApi, nodeDialog, nodeFs, nodeUtils) {
        console.log('ActionBarCtrl', $scope.$parent.$id);

        $scope.actions = {
            newProject: newProject,
            openProject: openProject,
            exportArduinoCode: exportArduinoCode,
            changeLanguage: changeLanguage,
            undo: undo,
            redo: redo,
            copyCodeToClipboard: copyCodeToClipboard,
            verifyCode: verifyCode,
            loadToBoard: loadToBoard
        };


        function newProject() {
            $route.reload();
        }

        function openProject() {
            console.log(this.name);
            var filePath = nodeDialog.showOpenDialog({
                properties: ['openFile', 'openDirectory', 'createDirectory'],
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
                        $scope.setProject(JSON.parse(data));
                        $scope.$apply();
                    }
                });
            }
        }

        function saveProject() {
            projectApi.download($scope.getCurrentProject());
        }


        function exportArduinoCode() {
            var code = bloqsUtils.getCode($scope.componentsArray, $scope.arduinoMainBloqs),
                filename = utils.removeDiacritics($scope.project.name).substring(0, 30) + '.ino';
            nodeUtils.downloadFile(filename, code);
        }

        function changeLanguage() {
            console.log(this.name);
        }

        function undo() {
            console.log(this.name);
        }

        function redo() {
            console.log(this.name);
        }

        function copyCodeToClipboard() {
            console.log(this.name);
            var code = bloqsUtils.getCode($scope.componentsArray, $scope.arduinoMainBloqs);
            console.log(code);
            clipboard.copyText(code);
        }

        function loadToBoard() {
            console.log(this);
        }

        function verifyCode(code) {
            code = code || '';
            web2board.verify(code);
        }


        $scope.menuTree = {
            fileMenuItems: {
                name: 'Archivo',
                items: [{
                    name: 'Nuevo Proyecto',
                    icon: '#nuevoProyecto',
                    action: newProject,
                    disabled: false
                }, {
                    name: 'Abrir Proyecto',
                    icon: '#abrirProyecto',
                    action: openProject,
                    disabled: false
                }, {
                    name: 'Guardar Proyecto',
                    icon: '#guardar',
                    action: saveProject,
                    disabled: false
                }, {
                    name: 'Exportar código Arduino',
                    icon: '#exportcode',
                    action: exportArduinoCode,
                    disabled: false
                }, {
                    name: 'Cambiar idioma',
                    icon: '#cambiarIdioma',
                    action: changeLanguage,
                    disabled: false
                }]
            },
            editMenuItems: {
                name: 'Editar',
                items: [{
                    name: 'Deshacer',
                    icon: '#deshacer',
                    action: undo,
                    disabled: false
                }, {
                    name: 'Rehacer',
                    icon: '#rehacer',
                    action: redo,
                    disabled: false
                }, {
                    name: 'Copiar código al portapapeles',
                    icon: '#copiarTexto',
                    action: copyCodeToClipboard,
                    disabled: false
                }]
            }

        };
    });