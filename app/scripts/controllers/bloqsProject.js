'use strict';

/**
 * @ngdoc function
 * @name bitbloqOffline.controller:BloqsProjectCtrl
 * @description
 * # BloqsProjectCtrl
 * Controller of the bitbloqOffline
 */
angular.module('bitbloqOffline')
  .controller('BloqsProjectCtrl', function($scope, $rootScope, bloqsUtils, common, _, $log) {
    console.log('bloqsproject ctrl', $scope.$parent.$id);

    function _emptyComponentsArray() {
      return {
        leds: [],
        rgbs: [],
        sensors: [],
        buzzers: [],
        servos: [],
        continuousServos: [],
        oscillators: [],
        lcds: [],
        serialElements: [],
        clocks: [],
        hts221: [],
        robot: []
      };
    }


    $scope.updateBloqs = function() {

      // if ($scope.bloqs.varsBloq) {
      //
      //   var allBloqs = bloqs.bloqs;
      //   var allComponents = [];
      //
      //   //Why?
      //   for (var bloq in allBloqs) {
      //     allBloqs[bloq].componentsArray = $scope.componentsArray;
      //   }
      //
      //   var updateBloq = function(element, list) {
      //
      //     var tempValue,
      //       tempRef;
      //
      //     tempRef = element.dataset.reference;
      //     tempValue = element.dataset.value;
      //
      //     bloqsUtils.drawDropdownOptions($(element), list);
      //
      //     if (tempRef && tempValue) {
      //
      //       var componentRef = list.find(function(comp) {
      //         return comp.uid === tempRef;
      //       });
      //
      //       if (componentRef) {
      //         element.value = componentRef.name;
      //         element.dataset.reference = componentRef.uid;
      //         element.dataset.value = componentRef.name;
      //       }
      //
      //     } else {
      //       $log.debug('dropdown not selected');
      //       element.selectedIndex = 0;
      //     }
      //
      //   };
      //   var bloqCanvasEl = null;
      //   //Update dropdowns values from bloqs canvas
      //   for (var type in $scope.componentsArray) {
      //     if (!$scope.componentsArray[type].length) {
      //       continue;
      //     }
      //     bloqCanvasEl = document.getElementsByClassName('bloqs-tab')[0];
      //     var nodeList = bloqCanvasEl.querySelectorAll('select[data-dropdowncontent="' + type + '"]');
      //     for (var i = 0, len = nodeList.length; i < len; i++) {
      //       updateBloq(nodeList[i], $scope.componentsArray[type]);
      //     }
      //     allComponents = allComponents.concat($scope.componentsArray[type]);
      //   }
      //   //Update dropdowns from bloqs of toolbox
      //   if (bloqCanvasEl) {
      //     var toolboxNodeList = bloqCanvasEl.querySelectorAll('select[data-dropdowncontent="varComponents"]');
      //     for (var j = 0, len2 = toolboxNodeList.length; j < len2; j++) {
      //       updateBloq(toolboxNodeList[j], allComponents, true);
      //     }
      //   }
      //
      // }
    };


    $scope.refreshComponentsArray = function() {

      var newComponentsArray = _emptyComponentsArray();
      var newHardwareTags = [];
      var readyToSave = false;

      var plainComponentListTemporal = [];
      var plainComponentList = [];

      $scope.project.hardware.components.forEach(function(comp) {
        if (!!comp.connected) {
          if (comp.oscillator === true || comp.oscillator === 'true') {
            newComponentsArray.oscillators.push(_.cloneDeep(comp));
          } else {
            newComponentsArray[comp.category].push(_.cloneDeep(comp));
          }
          plainComponentListTemporal.push({
            'uid': comp.uid,
            'name': comp.name
          });
          newHardwareTags.push(comp.id);
        }
      });

      $scope.project.hardwareTags = _.uniq(newHardwareTags); //Regenerate hw tags

      if ($scope.project.hardware.robot) {
        newComponentsArray.robot.push($scope.project.hardware.robot);
        $scope.project.hardwareTags.push($scope.project.hardware.robot);
      }

      if ($scope.project.hardware.board) {
        $scope.project.hardwareTags.push($scope.project.hardware.board);
      }

      if ($scope.componentsArray.robot.length > 0) {
        plainComponentList = $scope.componentsArray.robot;
      } else {
        _.forEach($scope.componentsArray, function(n, key) {
          var compUidList = _.map($scope.componentsArray[key], function(item) {
            return {
              'uid': item.uid,
              'name': item.name
            };
          });
          if (compUidList && compUidList.length > 0) {
            plainComponentList = plainComponentList.concat(compUidList);
          }
        });
      }

      //Has changed componentsArray?
      if (plainComponentListTemporal.length > 0 || (plainComponentList.length > 0 && plainComponentList.indexOf('zowi') === -1)) {
        if (!_.isEqual(plainComponentList, plainComponentListTemporal) && !$scope.hardware.firstLoad) {
          $log.debug('componentsArray has changed');
          readyToSave = true;
        }
      }

      $scope.componentsArray = newComponentsArray;
      $scope.updateBloqs();

      if (!$scope.hardware.firstLoad && readyToSave) {
        $scope.startAutosave();
      }

    };
    $scope.componentsArray = bloqsUtils.getEmptyComponentsArray();
    $scope.arduinoMainBloqs = {
      varsBloq: null,
      setupBloq: null,
      loopBloq: null
    };

    $scope.hardware = {
      boardList: null,
      componentList: null,
      robotList: null,
      cleanSchema: null,
      firstLoad: true,
      sortToolbox: null
    };

    $scope.project = {
      creatorId: '',
      name: common.translate('new-project'),
      description: '',
      userTags: [],
      hardwareTags: [],
      compiled: false,
      imageType: '',
      videoUrl: '',
      defaultTheme: 'infotab_option_colorTheme',
      software: {
        vars: {
          enable: true,
          name: 'varsBloq',
          childs: [],
          content: [
            []
          ]
        },
        setup: {
          enable: true,
          name: 'setupBloq',
          childs: [],
          content: [
            []
          ]
        },
        loop: {
          enable: true,
          name: 'loopBloq',
          childs: [],
          content: [
            []
          ]
        },
        freeBloqs: []
      },

      hardware: {
        board: null,
        robot: null,
        components: [],
        connections: []
      }
    };
  });