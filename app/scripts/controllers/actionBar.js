'use strict';

/**
 * @ngdoc function
 * @name bitbloqOffline.controller:ActionBarCtrl
 * @description
 * # ActionBarCtrl
 * Controller of the bitbloqOffline
 */
angular.module('bitbloqOffline')
  .controller('ActionBarCtrl', function($scope, $route, web2board, _, clipboard, bloqsUtils, utils, hw2Bloqs, projectApi, nodeDialog, nodeFs, nodeUtils, common, commonModals, alertsService) {
    console.log('ActionBarCtrl', $scope.$parent.$id);

    $scope.actions = {
      newProject: newProject,
      openProject: openProject,
      exportArduinoCode: exportArduinoCode,
      changeLanguage: changeLanguage,
      copyCodeToClipboard: copyCodeToClipboard,
      verifyCode: verifyCode,
      loadToBoard: loadToBoard
    };


    $scope.isInProcess = web2board.isInProcess;

    function newProject() {
      $route.reload();
    }

    function openProject() {
      console.log(this.name);
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

            if (project.bitbloqOfflineVersion < common.version) {
              alertsService.add('Hay una nueva version. Actualiza', 'info', 'info', 3000);
            }

            $scope.setProject(project);
            hw2Bloqs.repaint();
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

    function copyCodeToClipboard() {
      console.log(this.name);
      var code = bloqsUtils.getCode($scope.componentsArray, $scope.arduinoMainBloqs);
      console.log(code);
      alertsService.add('make-code-clipboard', 'code-clipboard', 'info', 3000);
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
      console.log(web2board.isInProcess())
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