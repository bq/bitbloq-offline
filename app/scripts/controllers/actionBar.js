'use strict';

/**
 * @ngdoc function
 * @name bitbloqOffline.controller:ActionBarCtrl
 * @description
 * # ActionBarCtrl
 * Controller of the bitbloqOffline
 */
angular.module('bitbloqOffline')
    .controller('ActionBarCtrl', function($scope, $route, web2board, clipboard, bloqsUtils) {
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


        function newProject() {
            $route.reload();
        }

        function openProject() {
            console.log(this.name);
            var remote = require('remote'),
                dialog = remote.require('dialog'),
                fs = require('fs'),
                filePath = dialog.showOpenDialog({
                    properties: ['openFile', 'openDirectory']
                });
            console.log(filePath);
            fs.readFile(filePath[0], function(err, data) {
                if (err) {
                    throw err;
                } else {
                    $scope.setProject(JSON.parse(data));
                    $scope.$apply();
                }
            });
        }

        function exportArduinoCode() {
            console.log(this.name);
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
            clipboard.copyText(code);
        }

        function loadToBoard() {
            console.log(this);
        }

        function verifyCode(code) {
            code = code || '';
            web2board.verify(code);
        }
    });