'use strict';

/**
 * @ngdoc function
 * @name bitbloqOffline.controller:hardwareTabCtrl
 * @description
 * # hardwareTabCtrl
 * Controller of the bitbloqOffline
 */
angular.module('bitbloqOffline')
    .controller('hardwareTabCtrl', function($scope, $q, $timeout, $log, $window, $rootScope, $translate, $document, utils, common, hw2Bloqs, _, alertsService, bloqsUtils) {
        var container = utils.getDOMElement('.protocanvas');
        var $componentContextMenu = $('#component-context-menu');
        var $boardContextMenu = $('#board-context-menu');
        var $robotContextMenu = $('#robot-context-menu');
        var hwJSON = common.hardware;

        function _initialize() {
            $scope.hardware.componentList = hwJSON.components;
            $scope.hardware.boardList = hwJSON.boards;
            $scope.hardware.robotList = hwJSON.robots;
            $scope.hardware.sortToolbox($scope.hardware.componentList);
            generateFullComponentList(hwJSON);
            hw2Bloqs.initialize(container, 'boardSchema', 'robotSchema');
            container.addEventListener('mousedown', _mouseDownHandler, true);
            $document.on('contextmenu', _contextMenuDocumentHandler);
            $document.on('click', _clickDocumentHandler);
            container.addEventListener('connectionEvent', connectionEventHandler);
        }

        function generateFullComponentList(resources) {
            $scope.allHwElements = [];
            _.each(resources.boards, function(item) {
                item.dragtype = 'boards';
            });
            $scope.allHwElements = $scope.allHwElements.concat(resources.boards);
            _.each(resources.robots, function(item) {
                item.dragtype = 'robots';
            });
            $scope.allHwElements = $scope.allHwElements.concat(resources.robots);
            _.each(resources.components, function(item, cat) {
                if (cat !== 'oscillators') {
                    _.each(item, function(el) {
                        el.dragtype = 'components';
                    });
                    $scope.allHwElements = $scope.allHwElements.concat(item);
                }
            });
        }

        function _mouseDownHandler(e) {
            if (e.target.classList.contains('component')) {
                _focusComponent(e.target);
                if (!$scope.$$phase) {
                    $scope.$digest();
                }
            }
        }

        function _closeContextMenu() {
            $('.hw-context-menu').css({
                display: 'none'
            });
        }

        function _contextMenuDocumentHandler(ev) {
            if (ev.target.classList.contains('component')) {
                if (($window.innerHeight - event.pageY) > $componentContextMenu.height()) {
                    $componentContextMenu.css({
                        display: 'block',
                        left: event.pageX + 'px',
                        top: event.pageY + 'px'
                    });
                } else {
                    $componentContextMenu.css({
                        display: 'block',
                        left: event.pageX + 'px',
                        top: (event.pageY - $componentContextMenu.height()) + 'px'
                    });
                }
                _focusComponent(ev.target);
            } else if (ev.target.classList.contains('board') || $(ev.target).closest('.board').length) {
                if ($scope.project.hardware.board) {
                    $boardContextMenu.css({
                        display: 'block',
                        left: event.pageX + 'px',
                        top: event.pageY + 'px'
                    });
                }
            } else if (ev.target.classList.contains('robot')) {
                $robotContextMenu.css({
                    display: 'block',
                    left: event.pageX + 'px',
                    top: event.pageY + 'px'
                });
            } else {
                _closeContextMenu();
            }

            ev.preventDefault();
            return false;
        }

        function _clickDocumentHandler() {
            _closeContextMenu();
        }
        var connectionEventHandler = function(e) {
            var componentReference, pinKey;
            /* HW Connection listeners */

            function _detectConnected(pins) {
                var filtered = _.filter(pins, function(pin) {
                    return !!pin;
                });
                return filtered.length > 0;
            }

            componentReference = _.find($scope.project.hardware.components, {
                'uid': e.componentData.uid
            });
            if (componentReference) {

                if (e.protoBoLaAction === 'attach') {

                    pinKey = Object.keys(e.componentData.pin)[0];
                    if (componentReference.pin.hasOwnProperty(pinKey)) {
                        componentReference.pin[pinKey] = e.componentData.pin[pinKey];
                    }

                    $rootScope.$emit('component-connected');

                } else if (e.protoBoLaAction === 'detach') {

                    pinKey = Object.keys(e.componentData.pin)[0];
                    if (componentReference.pin.hasOwnProperty(pinKey)) {
                        componentReference.pin[pinKey] = undefined;
                    }

                }

                if (_detectConnected(componentReference.pin)) {
                    componentReference.connected = true;
                } else {
                    componentReference.connected = false;
                }

                $scope.refreshComponentsArray();

            } else {
                $log.debug('Unable to find this component or component is already removed');
            }
        };

        var _addBoard = function(board) {
            if ($scope.project.hardware.board === board.name && !$scope.project.hardware.robot) {
                return false;
            }
            $scope.project.hardware.robot = null;

            hw2Bloqs.addBoard(board);

            $scope.project.hardware.board = board.name;

            $scope.refreshComponentsArray();

            $rootScope.$broadcast('toolboxSelect', 'components');
            common.sendAnalyticsEvent('Add Board', board.name);

        };

        var _addRobot = function(robot) {

            var robotReference = _.find($scope.hardware.robotList, function(r) {
                return r.id === robot.id;
            });
            $scope.project.hardware.robot = robot.id;
            hw2Bloqs.addRobot(robotReference);

            $scope.project.hardware.board = 'Arduino UNO';

            $scope.componentSelected = null;
            $scope.project.hardware.components = [];

            $scope.refreshComponentsArray();
            common.sendAnalyticsEvent('Add Robot', robot.id);
        };

        $scope.hardware.sortToolbox = function() {
            var componentListLocal = _.cloneDeep($scope.hardware.componentList);
            var list = [];
            _.each(componentListLocal, function(item, category) {
                item.forEach(function(elem) {
                    elem.category = category;
                });
                list.push(item);
            });
            var translatedList = _.each(_.flatten(list), function(item) {
                item.name = $translate.instant(item.id);
            });
            common.hardware.componentSortered = _.sortBy(translatedList, 'name');
        };
        $scope.deleteRobot = function() {
            $scope.project.hardware.robot = null;
            $scope.project.hardware.board = null;
            $scope.robotSelected = false;
            $scope.refreshComponentsArray();
        };

        function _addComponent(data) {
            var component = _.find($scope.hardware.componentList[data.category], function(component) {
                return component.id === data.id;
            });

            var newComponent = _.cloneDeep(component);
            $scope.project.hardware.components.push(newComponent);

            var relativeCoordinates = {
                x: ((data.coordinates.x / container.clientWidth) * 100),
                y: ((data.coordinates.y / container.clientHeight) * 100)
            };

            newComponent.coordinates = relativeCoordinates;
            newComponent.category = data.category;
            newComponent.name = _createUniqueVarName(newComponent); //Generate unique name
            newComponent.connected = false;

            var componentDOMRef = hw2Bloqs.addComponent(newComponent);
            _focusComponent(componentDOMRef);
            $scope.boardSelected = false;
            hw2Bloqs.unselectAllConnections();
            common.sendAnalyticsEvent('Add Component', data.id);
        }

        $scope.deleteBoard = function() {
            hw2Bloqs.removeBoard();
            $scope.boardSelected = false;
            $scope.project.hardware.board = null;
            $scope.refreshComponentsArray();
        };

        function _focusComponent(component) {

            $('.component').removeClass('component-selected');

            var componentSelected = _.find($scope.project.hardware.components, function(c) {
                return c.uid === component.dataset.uid;
            });
            $(component).addClass('component-selected');

            container.focus();

            $scope.componentSelected = componentSelected;
            $scope.boardSelected = false;

            $log.debug('focusComponent', $scope.componentSelected);

        }

        function _createUniqueVarName(component) {
            var usedNames = {},
                componentBasicName = $translate.instant('default-var-name-' + component.id);
            var componentcategoryList = _.filter($scope.project.hardware.components, function(item) {
                return item.category === component.category;
            });
            for (var i = 0; i < componentcategoryList.length; i++) {
                usedNames[componentcategoryList[i].name] = true;
            }

            var j = 0,
                finalName = null;
            while (!finalName) {
                if (!usedNames[componentBasicName + '_' + j]) {
                    finalName = componentBasicName + '_' + j;
                }
                j++;
            }
            return finalName;
        }

        var _removeElementFromKeyboard = function() {
            if ($scope.componentSelected) {
                $scope.deleteComponent();
                $scope.componentSelected = false;
            } else if ($scope.boardSelected) {
                $scope.deleteBoard();
            } else if ($scope.robotSelected) {
                $scope.deleteRobot();
            } else { //No component or board selected
                hw2Bloqs.removeSelectedConnection();
            }
        };

        /* Initialize jsplumb */
        _initialize();

        $scope.baudRates = ['300', '1200', '2400', '4800', '9600', '14400', '19200', '28800', '38400', '57600', '115200'];
        $scope.componentSelected = null;
        $scope.inputFocus = false;

        $scope.offsetTop = ['header', 'nav--make', 'actions--make', 'tabs--title'];

        $scope.setBaudRate = function(baudRate) {
            $scope.componentSelected.baudRate = baudRate;
        };

        $scope.setInputFocus = function() {
            $scope.inputFocus = true;
        };

        $scope.unsetInputFocus = function() {
            $scope.inputFocus = false;
            container.focus();
        };

        $scope.detectElement = function(ev) {
            //If component, check it out if component has been moved
            if (ev.target.classList.contains('component')) {
                $scope.unsetInputFocus();
                var componentDOM = ev.target;
                var componentReference = _.find($scope.project.hardware.components, function(c) {
                    return c.uid === componentDOM.dataset.uid;
                });
                var newCoordinates = {
                    x: (componentDOM.offsetLeft / container.offsetWidth) * 100,
                    y: (componentDOM.offsetTop / container.offsetHeight) * 100
                };
                if (!_.isEqual(newCoordinates, componentReference.coordinates) && componentReference.connected) {
                    componentReference.coordinates = newCoordinates;
                }
            } else if ($(ev.target).closest('.jsplumb-connector', container).length ||
                $(ev.target).closest('.board_ep', container).length ||
                $(ev.target).closest('.component_ep', container).length
            ) {
                $scope.componentSelected = null;
                $('.component').removeClass('component-selected');
            } else if (ev.target.classList.contains('robot')) {
                $scope.robotSelected = true;
            } else if (ev.target.classList.contains('board') || $(ev.target).closest('.board').length) {
                $scope.boardSelected = true;

                //Unselect selected components
                $scope.componentSelected = null;
                $('.component').removeClass('component-selected');
                hw2Bloqs.unselectAllConnections();

                if ($scope.project.hardware.board) {
                    // $scope.subMenuHandler('hwcomponents', 'open', 1);
                } else {
                    // $scope.subMenuHandler('boards', 'open', 1);
                }
            } else if (ev.target.classList.contains('component__container')) {
                if (!$scope.project.hardware.robot && $scope.project.hardware.components.length === 0) {
                    // $scope.subMenuHandler('hwcomponents', 'open', 1);
                }
            } else if (ev.target.classList.contains('oscillator--checkbox')) {
                $scope.unsetInputFocus();
            } else if ($(ev.target).closest('.baudrate__dropdown').length) {
                $scope.unsetInputFocus();
                ev.preventDefault();
            } else if (ev.target.classList.contains('component-name__input')) {
                $scope.setInputFocus();
            } else if ($(ev.target).closest('.component-name__container').length) {
                $scope.unsetInputFocus();
            } else {
                $scope.robotSelected = $scope.boardSelected = $scope.componentSelected = false;
                $('.component').removeClass('component-selected');
                hw2Bloqs.unselectAllConnections();
            }
        };

        $scope.duplicateComponent = function(component) {
            if (!$scope.componentSelected) {
                throw Error('componentSelected undefined');
            }
            var newComponent = _.cloneDeep(component);
            delete newComponent.endpoints;
            delete newComponent.pin;
            delete newComponent.uid;
            newComponent.connected = false;
            $scope.project.hardware.components.push(newComponent);

            var coordinates = {
                x: $scope.componentSelected.coordinates.x > 85 ? 85 + 3 : $scope.componentSelected.coordinates.x + 3,
                y: $scope.componentSelected.coordinates.y > 85 ? 85 + 3 : $scope.componentSelected.coordinates.y + 3,
            };
            newComponent.coordinates = coordinates;
            newComponent.name = _createUniqueVarName(newComponent); //Generate unique name

            var componentDOM = hw2Bloqs.addComponent(newComponent);
            if (!$scope.$$phase) {
                $scope.$digest();
            }
            _focusComponent(componentDOM);
            hw2Bloqs.unselectAllConnections();

        };

        $scope.disconnectComponent = function(component) {
            hw2Bloqs.disconnectComponent(component || $scope.componentSelected);
            $scope.refreshComponentsArray();
            _closeContextMenu();
        };

        $scope.disconnectAllComponents = function() {
            hw2Bloqs.disconnectAllComponents();
            $scope.refreshComponentsArray();
            _closeContextMenu();
        };

        $scope.deleteComponent = function() {
            $scope.disconnectComponent();
            var c = _.remove($scope.project.hardware.components, function(el) {
                return $scope.componentSelected.uid === el.uid;
            });
            var componenetToRemove = $('[data-uid="' + c[0].uid + '"]')[0];
            $scope.componentSelected = false;
            hw2Bloqs.removeComponent(componenetToRemove);
            $scope.refreshComponentsArray();
        };

        $scope.hardware.cleanSchema = function() {
            hw2Bloqs.removeAllComponents();
            $scope.deleteBoard();
            $scope.refreshComponentsArray();
        };

        $scope.anyComponent = function() {
            if (_.isEqual($scope.componentsArray, _emptyComponentsArray())) {
                return false;
            }
            var compCategories = _.pick($scope.componentsArray, function(item) {
                return item.length > 0;
            });
            var tmpCompCategories = _.cloneDeep(compCategories);
            if (tmpCompCategories.serialElements) {
                delete tmpCompCategories.serialElements;
            }
            if (tmpCompCategories.robot) {
                delete tmpCompCategories.robot;
            }

            if (tmpCompCategories.board) {
                delete tmpCompCategories.board;
            }

            return (Object.keys(tmpCompCategories).length > 0);
        };

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

        $scope.drop = function(data) {
            if (data.type === 'boards') {
                var board = _.find($scope.hardware.boardList, function(board) {
                    return board.id === data.id;
                });
                _addBoard(board);
            } else if (data.type === 'components') {
                if (!$scope.project.hardware.board) {
                    alertsService.add('bloqs-project_alert_no-board', 'error_noboard', 'error');
                    return false;
                } else if ($scope.project.hardware.robot) {
                    alertsService.add('bloqs-project_alert_component_on_robot', 'error_noboard', 'error');
                    return false;
                }
                _addComponent(data);
            } else if (data.type === 'robots') {
                $scope.hardware.cleanSchema();
                _addRobot(data);
            }
        };

        function loadHardwareProject(hardwareProject) {

            if (hardwareProject.anonymousTransient) {
                delete hardwareProject.anonymousTransient;
            }

            var hwSchema = {};
            hwSchema.components = _.cloneDeep($scope.project.hardware.components);
            hwSchema.connections = _.cloneDeep($scope.project.hardware.connections);

            // hwBasicsLoaded.promise.then(function() {
            if ($scope.project.hardware.robot) {
                var robotReference = _.find($scope.hardware.robotList, function(robot) {
                    return robot.id === $scope.project.hardware.robot;
                });
                hwSchema.robot = robotReference; //The whole board object is passed
            } else if ($scope.project.hardware.board) {
                var boardReference = _.find($scope.hardware.boardList, function(board) {
                    return board.name === $scope.project.hardware.board;
                });
                hwSchema.board = boardReference; //The whole board object is passed
            }

            if (hwSchema.robot || hwSchema.board) {
                hw2Bloqs.removeAllComponents();
                hw2Bloqs.loadSchema(hwSchema);
                hw2Bloqs.repaint();
                $scope.refreshComponentsArray();
                $scope.hardware.firstLoad = false;
                //Fix components dimensions
                _.forEach($scope.project.hardware.components, function(item) {
                    item = bloqsUtils.checkPins(item);
                    _fixComponentsDimension(item);
                });
            } else {
                $log.debug('robot is undefined');
            }
            // });
        }




        $scope.$watch('project.hardware', function(newVal, oldVal) {
            if (newVal && (newVal !== oldVal || newVal.anonymousTransient)) {
                loadHardwareProject(newVal);
            }
        });



        $scope.checkName = function() {
            var isNameDuplicated = _.filter($scope.project.hardware.components, {
                name: $scope.componentSelected.name
            });
            if (isNameDuplicated instanceof Array && isNameDuplicated.length > 1) {
                $scope.componentSelected.name += '_copy';
            }
            var nameFixed = _validName($scope.componentSelected.name);
            if (nameFixed !== $scope.componentSelected.name) {
                $scope.componentSelected.name = nameFixed;
            }
            if ($scope.componentSelected.connected) {
                $scope.refreshComponentsArray();
            }
        };

        function _fixComponentsDimension(compRef) {
            var c = _.find($scope.hardware.componentList[compRef.category], {
                'id': compRef.id
            });
            var componentDOM = document.querySelector('[data-uid="' + compRef.uid + '"]');
            componentDOM.style.width = c.width + 'px';
            componentDOM.style.height = c.height + 'px';
        }

        function _validName(name) {
            var reservedWords = 'setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,interger, constants,floating,point,void,bool,char,unsigned,byte,int,word,long,float,double,string,String,array,static, volatile,const,sizeof,pinMode,digitalWrite,digitalRead,analogReference,analogRead,analogWrite,tone,noTone,shiftOut,shitIn,pulseIn,millis,micros,delay,delayMicroseconds,min,max,abs,constrain,map,pow,sqrt,sin,cos,tan,randomSeed,random,lowByte,highByte,bitRead,bitWrite,bitSet,bitClear,bit,attachInterrupt,detachInterrupt,interrupts,noInterrupts';
            reservedWords = reservedWords.split(',');
            if (name && name.length > 0) {
                var i = 0,
                    j = 0;
                while (i < name.length) {
                    if (!isNaN(parseFloat(name[i]))) {
                        name = name.substring(1, name.length);
                    } else {
                        break;
                    }
                }
                //Remove all accents
                name = name.replace(/([áàâä])/g, 'a').replace(/([éèêë])/g, 'e').replace(/([íìîï])/g, 'i').replace(/([óòôö])/g, 'o').replace(/([úùûü])/g, 'u');
                name = name.replace(/([ÁÀÂÄ])/g, 'A').replace(/([ÉÈÊË])/g, 'E').replace(/([ÍÌÎÏ])/g, 'I').replace(/([ÓÒÔÖ])/g, 'O').replace(/([ÚÙÛÜ])/g, 'U');
                //Remove spaces and ñ
                name = name.replace(/([ ])/g, '_')
                    .replace(/([ñ])/g, 'n');
                //Remove all symbols
                name = name.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|<>\-\&\Ç\%\=\~\{\}\¿\¡\"\@\:\;\-\"\·\|\º\ª\¨\'\·\̣\─\ç\`\´\¨\^])/g, '');
                i = 0;
                while (i < name.length) {
                    if (!isNaN(parseFloat(name[i]))) {
                        name = name.substring(1, name.length);
                    } else {
                        break;
                    }
                }
                for (j = 0; j < reservedWords.length; j++) {
                    if (name === reservedWords[j]) {
                        name += '_';
                        break;
                    }
                }
            }
            return name;
        }

        $scope.$watch('componentSelected.oscillator', function(newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.refreshComponentsArray();
            }
        });

        $scope.$watch('componentSelected.name', function(newVal, oldVal) {

            if (oldVal === '' && newVal !== '') {
                $timeout.cancel($scope.timeoutCode);
            } else {
                if (newVal && oldVal && (newVal !== oldVal)) {
                    $scope.checkName();
                } else if (newVal === '') {
                    $timeout.cancel($scope.timeoutCode);
                    $scope.timeoutCode = $timeout(function() {
                        $scope.componentSelected.name = _createUniqueVarName($scope.componentSelected);
                    }, 3000);
                }
            }
        });

        $scope.$watch('componentSelected.baudRate', function(newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.refreshComponentsArray();
                $scope.refreshCode();
            }
        });

        $rootScope.$on('$translateChangeEnd', function() {
            $scope.hardware.sortToolbox();
        });

        var _getClonComponent = function() {
            $scope.hardware.clonComponent = $scope.componentSelected;
        };

        var _setClonComponent = function() {
            if ($scope.hardware.clonComponent) {
                $scope.duplicateComponent($scope.hardware.clonComponent);
                $scope.hardware.clonComponent = $scope.componentSelected;
            }
        };

        /*************************************************
         Shortcuts
         *************************************************/
        $scope.onHwKeyPress = function($event) {
            switch ($event.which) {

                case 67:
                    //ctrl+c
                    if ($event.ctrlKey) {
                        if ($scope.inputFocus) {
                            return false;
                        }
                        _getClonComponent();
                        $event.preventDefault();
                    }
                    break;
                case 86:
                    //ctrl+v
                    if ($event.ctrlKey) {
                        if ($scope.inputFocus) {
                            return false;
                        }
                        _setClonComponent();
                        $event.preventDefault();
                    }
                    break;
                    // case 90:
                    //     //ctr+z
                    //     if ($event.ctrlKey) {
                    //         $scope.undo();
                    //         $event.preventDefault();
                    //     }
                    //     break;
                    // case 89:
                    //     //ctr+y
                    //     if ($event.ctrlKey) {
                    //         $scope.redo();
                    //         $event.preventDefault();
                    //     }
                    //     break;
                case 8:
                    //backspace
                    if ($scope.inputFocus) {
                        return false;
                    }
                    _removeElementFromKeyboard();
                    $event.preventDefault();
                    break;
                case 46:
                    //Supr
                    if ($scope.inputFocus) {
                        return false;
                    }
                    _removeElementFromKeyboard();
                    $event.preventDefault();
                    break;
            }
        };

        // toolbox filter components
        $scope.searchText = '';
        $scope.filterSearch = function(criteria) {
            return function(item) {
                if (criteria === '') {
                    return false;
                }
                var translatedNameNormalized = utils.removeDiacritics($translate.instant(item.id), {
                    spaces: false
                }).toLowerCase();
                var criteriaNormalized = utils.removeDiacritics(criteria, {
                    spaces: false
                }).toLowerCase();
                return translatedNameNormalized.indexOf(criteriaNormalized) > -1;
            };
        };
        $scope.$on('$destroy', function() {
            container.removeEventListener('connectionEvent', connectionEventHandler);
            container.removeEventListener('mousedown', _mouseDownHandler);
            $document.off('contextmenu', _contextMenuDocumentHandler);
            $document.off('click', _clickDocumentHandler);
        });


        $log.debug('hardwareTabCtrl controller', $scope.$parent.$id);
    });