'use strict';

/**
 * @ngdoc function
 * @name bitbloqOffline.controller:BloqsProjectCtrl
 * @description
 * # BloqsProjectCtrl
 * Controller of the bitbloqOffline
 */
angular.module('bitbloqOffline')
    .controller('BloqsProjectCtrl', function($scope, $rootScope, $timeout, $translate, hw2Bloqs, alertsService, commonModals, $window, $document, bloqsUtils, projectApi, nodeFs, common, _, $log, bloqs) {
        $log.debug('bloqsproject ctrl', $scope.$parent.$id);
        $scope.hw2Bloqs = hw2Bloqs;
        this.common = common;

        $scope.setProject = function(project) {
            hw2Bloqs.removeAllComponents();
            $scope.deleteBoard();
            $scope.refreshComponentsArray();
            $scope.project = project;
            $scope.refreshComponentsArray();
        };

        $scope.deleteBoard = function() {
            hw2Bloqs.removeBoard();
            $scope.boardSelected = false;
            $scope.project.hardware.board = null;
            $scope.refreshComponentsArray();
        };

        $scope.tabsClick = function() {
            // todo: remove after refactor (reference problem)
            window.bloqs.componentsArray = $scope.componentsArray;
            $scope.refreshCode();
            $timeout(function() {
                $rootScope.$emit('bloqs:updated');
            }, 10);
        };

        $scope.refreshCode = function() {
            $scope.updateBloqs();
            $scope.project.code = $scope.code = $scope.getCurrentProject().code;


            // var codeContainer = $('code');
            // codeContainer.text(js_beautify($scope.project.code || ''));
            // Prism.highlightElement(codeContainer[0]);
        };

        $scope.updateBloqs = function() {
            if ($scope.arduinoMainBloqs.varsBloq) {

                var allBloqs = bloqs.bloqs;
                var allComponents = [];

                //Why?
                for (var bloq in allBloqs) {
                    allBloqs[bloq].componentsArray = $scope.componentsArray;
                }

                var updateBloq = function(element, list) {

                    var tempValue,
                        tempRef;

                    tempRef = element.dataset.reference;
                    tempValue = element.dataset.value;

                    bloqsUtils.drawDropdownOptions($(element), list);

                    if (tempRef && tempValue) {

                        var componentRef = list.find(function(comp) {
                            return comp.uid === tempRef;
                        });

                        if (componentRef) {
                            element.value = componentRef.name;
                            element.dataset.reference = componentRef.uid;
                            element.dataset.value = componentRef.name;
                        }

                    } else {
                        element.selectedIndex = 0;
                    }

                };
                var bloqCanvasEl = document.getElementsByClassName('bloqs-tab')[0];
                //Update dropdowns values from bloqs canvas
                for (var type in $scope.componentsArray) {
                    if (!$scope.componentsArray[type].length) {
                        continue;
                    }
                    var nodeList = bloqCanvasEl.querySelectorAll('select[data-dropdowncontent="' + type + '"]');
                    for (var i = 0, len = nodeList.length; i < len; i++) {
                        updateBloq(nodeList[i], $scope.componentsArray[type]);
                    }
                    allComponents = allComponents.concat($scope.componentsArray[type]);
                }
                //Update dropdowns from bloqs of toolbox
                if (bloqCanvasEl) {
                    var toolboxNodeList = bloqCanvasEl.querySelectorAll('select[data-dropdowncontent="varComponents"]');
                    for (var j = 0, len2 = toolboxNodeList.length; j < len2; j++) {
                        updateBloq(toolboxNodeList[j], allComponents, true);
                    }
                }
            }
        };
        $scope.showRobots = function(robot) {
            if ($scope.project.hardware.robot === robot) {
                return true;
            }
            return false;
        };

        $scope.showComponents = function(item) {
            var stopWord = ['analogWrite', 'digitalWrite', 'pinReadAdvanced', 'pinWriteAdvanced', 'turnOnOffAdvanced', 'digitalReadAdvanced', 'analogReadAdvanced'];
            if (stopWord.indexOf(item) === -1) {
                var result = false;
                if ($scope.componentsArray.robot.length === 0) {
                    var userComponents = _.keys(_.pick($scope.componentsArray, function(value) {
                        return value.length > 0;
                    }));
                    if (item === 'hwVariable' && userComponents.length !== 0) {
                        result = true;
                    } else {
                        userComponents.forEach(function(value) {
                            if (item.indexOf('serial') > -1) {
                                result = $scope.showCommunications(item);
                            } else {
                                if (value[value.length - 1] === 's') {
                                    value = value.substring(0, value.length - 1);
                                }
                                if (value === 'servo') {
                                    value = 'servoNormal';
                                }
                                item = item.toUpperCase();
                                value = value.toUpperCase();
                                if (item.includes('RGBLED')) {
                                    if (value.includes('RGB')) {
                                        result = true;
                                    }
                                } else if ((value.includes('SERVO') || value === 'OSCILLATOR') && (item === 'SERVOATTACH' || item === 'SERVODETACH')) {
                                    result = true;
                                } else if (item.includes('MOTORSETSPEED')) {
                                    if (value.includes('DRIVEGEARMOTOR')) {
                                        result = true;
                                    }
                                } else if (item.includes(value) || value.includes(item)) {
                                    result = true;
                                }
                            }
                        });
                    }
                }
                return result;
            } else {
                return true;
            }
        };

        $scope.refreshComponentsArray = function() {
            projectApi.projectChanged = true;
            projectApi.oldProject = $scope.project;
            var newComponentsArray = bloqsUtils.getEmptyComponentsArray();
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
            // todo: remove after refactor (reference problem)
            window.bloqs.componentsArray = $scope.componentsArray;
            $scope.updateBloqs();

            if (!$scope.hardware.firstLoad && readyToSave) {
                // $scope.startAutosave();
            }

        };
        $scope.showCommunications = function(item) {
            var stopWord = ['convert'];
            if ($scope.componentsArray.serialElements) {
                return !(stopWord.indexOf(item) === -1 && $scope.componentsArray.serialElements.length === 0);
            } else {
                return false;
            }
        };

        $scope.getIntegratedComponents = function(board) {
            var componentsList = [];
            if (board && board.integratedComponents) {
                var tempComponent;
                for (var i = 0; i < board.integratedComponents.length; i++) {

                    tempComponent = _.find($scope.hardware.componentList[board.integratedComponents[i].category], function(component) {
                        return component.uuid === board.integratedComponents[i].id;
                    });
                    tempComponent = _.clone(tempComponent, true);
                    _.extend(tempComponent, board.integratedComponents[i]);

                    tempComponent.name = $translate.instant(board.integratedComponents[i].name);
                    tempComponent.integratedComponent = true;
                    tempComponent.connected = true;
                    componentsList.push(tempComponent);
                    //$scope.currentProject.hardware.components.push(tempComponent);
                    //$scope.project.hardware.components.push(tempComponent);
                    //currentProjectService.addComponentInComponentsArray(tempComponent.category, tempComponent);
                }
            }
            return componentsList;
        }

        $scope.getHardwareSchema = function() {
            var schema = hw2Bloqs.saveSchema();
            if (schema) { //If project is loaded on protocanvas
                schema.components = schema.components.map(function(elem) {
                    var newElem = _.find($scope.project.hardware.components, {
                        uid: elem.uid
                    });
                    newElem.connected = elem.connected;
                    return newElem;
                });
                schema.board = $scope.project.hardware.board;
                schema.robot = $scope.project.hardware.robot;
                var board = _.find($scope.hardware.boardList, {
                    'name': schema.board
                });
                if (!board) {
                    board = _.find($scope.hardware.boardList, {
                        'uuid': schema.board
                    });
                }
                schema.components = schema.components.concat($scope.getIntegratedComponents(board));
                return schema;
            } else { //If project is not loading yet on protocanvas
                return _.cloneDeep($scope.project.hardware);
            }
        };

        $scope.getCurrentProject = function() {
            var project = _.cloneDeep($scope.project);
            if ($scope.arduinoMainBloqs.varsBloq) {
                project.software = {
                    vars: $scope.arduinoMainBloqs.varsBloq.getBloqsStructure(),
                    setup: $scope.arduinoMainBloqs.setupBloq.getBloqsStructure(),
                    loop: $scope.arduinoMainBloqs.loopBloq.getBloqsStructure()
                };
            }
            project.hardware = $scope.getHardwareSchema();
            $scope.project.code = arduinoGeneration.getCode({
                varsBloq: $scope.arduinoMainBloqs.varsBloq.getBloqsStructure(true),
                setupBloq: $scope.arduinoMainBloqs.setupBloq.getBloqsStructure(true),
                loopBloq: $scope.arduinoMainBloqs.loopBloq.getBloqsStructure(true)
            }, project.hardware);

            project.code = $scope.project.code;

            return project;
        };

        $scope.saveProject = function(project, callback) {
            project = project || $scope.getCurrentProject();

            if (projectApi.hasChanged(project)) {
                return projectApi.save(project, function() {
                    alertsService.add('make-saved-project', 'project-saved', 'ok', 3000);
                    if (callback) {
                        return callback();
                    }
                });
            }
        };

        $scope.saveProjectAs = function(project, callback) {
            project = project || $scope.getCurrentProject();
            return projectApi.saveAs(project, function() {
                alertsService.add('make-saved-project', 'project-saved', 'ok', 3000);
                if (callback) {
                    return callback();
                }
            });
        };

        $scope.saveIno = function() {
            projectApi.exportArduinoCode($scope.componentsArray, $scope.arduinoMainBloqs);
        };

        $window.onbeforeunload = function(e) {
            var remote = require('electron').remote;
            var currentWindow = remote.getCurrentWindow();
            if (projectApi.hasChanged($scope.getCurrentProject())) {
                e.returnValue = false;
                commonModals.launchNotSavedModal(function(confirmed) {
                    if (confirmed === 0) {
                        projectApi.save($scope.getCurrentProject(), function() {
                            common.sendAnalyticsEvent('Close app');
                            currentWindow.destroy();
                        });
                    } else if (confirmed === -1) {
                        common.sendAnalyticsEvent('Close app');
                        currentWindow.destroy();
                    }
                });
            } else {
                common.sendAnalyticsEvent('Close app');
                currentWindow.destroy();
            }
        };

        $document.on('keyup', function() {
            console.log(event);
            if (event.ctrlKey && event.which === 83) {
                $scope.saveProject();
            }
        });


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
                }
            },

            hardware: {
                board: null,
                robot: null,
                components: [],
                connections: []
            }
        };
        projectApi.oldProject = projectApi.getCleanProject($scope.project);
    });