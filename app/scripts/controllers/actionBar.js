'use strict';

/**
 * @ngdoc function
 * @name bitbloqOffline.controller:ActionBarCtrl
 * @description
 * # ActionBarCtrl
 * Controller of the bitbloqOffline
 */
angular.module('bitbloqOffline')
  .controller('ActionBarCtrl', function($scope, $route, web2board, clipboard, bloqsUtils, utils, projectApi, nodeDialog, nodeFs, nodeUtils, commonModals) {
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
      commonModals.launchChangeLanguageModal();
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
          action: saveProject,
          disabled: false
        }, {
          name: 'export-arduino-code',
          icon: '#exportcode',
          action: exportArduinoCode,
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
          name: 'undo',
          icon: '#deshacer',
          action: undo,
          disabled: false
        }, {
          name: 'redo',
          icon: '#rehacer',
          action: redo,
          disabled: false
        }, {
          name: 'makeActions_copyCode',
          icon: '#copiarTexto',
          action: copyCodeToClipboard,
          disabled: false
        }]
      }

    };
  });