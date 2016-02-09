/* global jsPlumbUtil */
(function() {
  'use strict';

  var throttle = function(type, name, obj) {
    obj = obj || window;
    var running = false;
    var func = function() {
      if (running) {
        return;
      }
      running = true;
      requestAnimationFrame(function() {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    obj.addEventListener(type, func);
  };

  /* init - you can init any event */
  throttle('resize', 'optimizedResize');

  var app = angular.module('bitbloqOffline');

  // I provide an injectable (and exteded) version of the jsPlumb lib.
  app.factory('jsPlumb', function($window) {
    // Get a local handle on the global lodash reference.
    // Return the [formerly global] reference so that it can be injected into other aspects of the AngularJS application.
    return $window.jsPlumb;
  });

  /**
   * @ngdoc service
   * @name bitbloqOffline.protoBoLa
   * @description
   * # protoBoLa
   * Service in the bitbloqOffline.
   */
  app.service('hw2Bloqs', function($rootScope, jsPlumb) {
    var exports = {};

    var jsPlumbInstance = null;

    var config = {
      color: '#F1C933',
      colorHover: '#F19833'
    };

    var containerDefault = null,
      boardContainerId = null,
      robotContainerId = null,
      boardDOMElement = null,
      robotDOMElement = null,
      componentDragging = null;

    var board = null;

    var connectionEvent = new CustomEvent('connectionEvent');

    /*jshint validthis:true */
    exports.initialize = function(container, boardContainerIdRef, robotContainerIdRef) {

      if (!container) {
        throw Error;
      }

      containerDefault = container;
      boardContainerId = boardContainerIdRef;
      robotContainerId = robotContainerIdRef;

      jsPlumbInstance = jsPlumb.getInstance();
      jsPlumbInstance.setContainer(container);

      jsPlumbInstance.importDefaults({
        DragOptions: {
          cursor: 'pointer',
          zIndex: 2000
        },
        DropOptions: {
          tolerance: 'touch',
          cursor: 'crosshair',
          hoverClass: 'dropHover',
          activeClass: 'dragActive'
        },
        Connector: ['Flowchart', {
          cornerRadius: 5,
          alwaysRespectStubs: false,
          midpoint: 1,
          stub: [10, 40],
          gap: 2
        }],
        EndpointStyle: {
          fillStyle: config.color,
          strokeStyle: config.colorHover
        },
        EndpointHoverStyle: {
          fillStyle: config.colorHover
        },
        PaintStyle: {
          fillStyle: config.color,
          strokeStyle: config.color
        },
        HoverPaintStyle: {
          fillStyle: config.colorHover,
          strokeStyle: config.colorHover
        },
        MaxConnections: 1
      });

      _registerJsPlumbTypes();
      _connectionListeners();

      // window.removeEventListener('optimizedResize');
      window.addEventListener('optimizedResize', function() {
        exports.repaint();
      }, false);

      // window.removeEventListener('focus');
      window.addEventListener('focus', function() {
        exports.repaint();
      }, false);

      document.addEventListener('mouseup', function() {
        if (componentDragging) {
          //Transforms absolute coordinates to relative coordinates
          componentDragging.style.left = ((componentDragging.offsetLeft * 100) / containerDefault.offsetWidth) + '%';
          componentDragging.style.top = ((componentDragging.offsetTop * 100) / containerDefault.offsetHeight) + '%';
          componentDragging = null;
        }
      });

    };

    exports.addRobot = function(newRobot) {
      robotDOMElement = document.getElementById(robotContainerId);
      robotDOMElement.classList.remove('zowi');
      robotDOMElement.classList.remove('evolution');
      robotDOMElement.classList.add(newRobot.id);
      robotDOMElement.classList.add('opaque');
      boardDOMElement = document.getElementById(boardContainerId);
      boardDOMElement.classList.remove('opaque');
    };

    exports.addBoard = function(newBoard) {

      exports.removeBoard();

      board = newBoard;

      boardDOMElement = document.getElementById(boardContainerId);
      boardDOMElement.classList.add(board.id);

      boardDOMElement.classList.add('opaque');
      robotDOMElement = document.getElementById(robotContainerId);
      robotDOMElement.classList.remove('opaque');

      var _addBoardEndpoints = function() {

        function addEP(pin) {

          var overLayLocation = [];
          if (type === 'digital') {
            overLayLocation = [0.5, 1.5];
          } else if (type === 'analog') {
            overLayLocation = [0.5, -0.5];
          } else {
            overLayLocation = [0.5, -0.5];
          }

          //Create a 'basic' endpoint
          var epBoard = jsPlumbInstance.addEndpoint(boardDOMElement, {
            anchor: [pin.x, pin.y, 0, -1, 0, 0],
            endpoint: ['Rectangle', {
              width: board.pinSize[type].w,
              height: board.pinSize[type].h
            }],
            overlays: [
              ['Label', {
                label: 'Pin ' + pin.name,
                labelStyle: {
                  color: 'black'
                },
                location: overLayLocation
              }]
            ],
            parameters: {
              pinBoard: pin.name
            },
            cssClass: 'board_ep board_ep-' + type + ' pin-' + pin.name.toLowerCase(),
            isTarget: true,
            isSource: false,
            scope: type,
            uuid: pin.uid
          });

          epBoard.unbind('click');
          epBoard.bind('click', function(ep) {
            if (ep.hasType('selected')) {
              return false;
            }
            //Remove other connections & ep selected
            jsPlumbInstance.getAllConnections().forEach(function(con) {
              con.removeType('selected');
              con.endpoints.forEach(function(elem) {
                elem.removeType('selected');
              });
            });
            ep.connections.forEach(function(con) {
              con.setType('selected');
              con.endpoints.forEach(function(epAdjacent) {
                epAdjacent.setType('selected');
              });
            });
          });

        }

        for (var type in board.pins) {
          board.pins[type].forEach(addEP);
        }

      };

      _addBoardEndpoints();

    };

    exports.removeBoard = function() {
      if (jsPlumbInstance && board && boardDOMElement) {
        boardDOMElement.classList.remove(board.id);
        jsPlumbInstance.removeAllEndpoints(boardDOMElement);
      }
      board = null;
    };

    exports.addComponent = function(newComponent) {

      if (!newComponent) {
        throw new Error('You need provide a component element :: addComponent');
      }
      if (!newComponent.uid) {
        newComponent.uid = jsPlumbUtil.uuid();
      }

      var DOMComponent = document.createElement('img');

      containerDefault.appendChild(DOMComponent);

      DOMComponent.dataset.uid = newComponent.uid;
      DOMComponent.dataset.target = 'component-context-menu';
      DOMComponent.dataset.name = newComponent.name;
      DOMComponent.setAttribute('context-menu', true);
      DOMComponent.classList.add('component');
      DOMComponent.style.top = newComponent.coordinates.y + '%';
      DOMComponent.style.left = newComponent.coordinates.x + '%';
      DOMComponent.src = '/images/components/' + newComponent.id + '.svg';
      DOMComponent.style.width = newComponent.width + 'px';
      DOMComponent.style.height = newComponent.height + 'px';
      DOMComponent.draggable = true;

      $('.component_ep').removeClass('selected');

      DOMComponent.addEventListener('mousedown', function() {
        var comp = this;
        componentDragging = comp;

        exports.unselectAllConnections();

        var connectionsArray = jsPlumbInstance.getConnections().filter(function(el) {
          return el.sourceId === comp.id;
        });

        $('.component_ep').removeClass('selected');
        jsPlumbInstance.selectEndpoints({
          source: this
        }).addClass('selected');

        connectionsArray.forEach(function(c) {
          _selectConnection(c);
        });

      });

      _loadComponent(DOMComponent);
      exports.repaint();

      return DOMComponent;

      //Adds a raw svg for a component
      function _loadComponent() {

        var spaceInterPin;
        if (newComponent.pins.digital && newComponent.pins.analog) {
          spaceInterPin = {
            digital: {
              x: newComponent.pins.digital && newComponent.width / (newComponent.pins.digital.length + 1) / newComponent.width,
              y: 0
            },
            analog: {
              x: newComponent.pins.analog && newComponent.width / (newComponent.pins.analog.length + 1) / newComponent.width,
              y: 1
            },
            serial: {
              x: 1,
              y: 0.5
            }
          };
        } else {
          spaceInterPin = {
            digital: {
              x: newComponent.pins.digital && newComponent.width / (newComponent.pins.digital.length + 1) / newComponent.width,
              y: 1
            },
            analog: {
              x: newComponent.pins.analog && newComponent.width / (newComponent.pins.analog.length + 1) / newComponent.width,
              y: 0
            },
            serial: {
              x: 1,
              y: 0.5
            }
          };
        }

        var mandatoryPins = {};

        function createEP(element, index) {
          var el = element,
            isMandatoryPin = false;
          if (!newComponent.pin) {
            newComponent.pin = {};
          }
          if (!(element in newComponent.pin)) {
            newComponent.pin[element] = null;
          } else {
            if (!mandatoryPins[type]) {
              mandatoryPins[type] = {};
            }
            mandatoryPins[type][element] = newComponent.pin[element];
            isMandatoryPin = true;
          }

          if (typeof element !== 'string') {
            el = Object.keys(element)[0];
          }
          var anchorValue = [spaceInterPin[type].x * (index + 1), spaceInterPin[type].y, 0, 0, 0, 0];

          if (!newComponent.endpoints) {
            newComponent.endpoints = {};
          }
          if (!newComponent.endpoints[el]) {
            newComponent.endpoints[el] = {
              type: type,
              uid: jsPlumbUtil.uuid()
            };
          }

          var epComponent = jsPlumbInstance.addEndpoint(DOMComponent, {
            // connectionType: 'default',
            anchor: anchorValue,
            uuid: newComponent.endpoints[el].uid,
            parameters: {
              pinComponent: el,
              type: type
            },
            endpoint: ['Dot', {
              radius: 7
            }],
            isSource: true,
            isTarget: false,
            cssClass: 'component_ep pin-' + el,
            hoverClass: 'component_ep--hover',
            connectorStyle: {
              strokeStyle: config.color,
              fillStyle: 'transparent',
              lineWidth: 5,
              joinstyle: 'round',
              outlineWidth: 1,
              outlineColor: '#EBEBEB'
            },
            connectorHoverStyle: {
              strokeStyle: config.colorHover
            }
          }, {
            scope: type
          });

          epComponent.canvas.classList.add('selected');

          epComponent.unbind('click');
          epComponent.bind('click', function(ep) {

            ep.canvas.classList.add('selected');

            exports.unselectAllConnections();

            if (ep.hasType('selected')) {
              return false;
            }

            ep.connections.forEach(function(con) {
              _selectConnection(con);
            });

          });

          //Connect automaticaly these pins
          if (isMandatoryPin) {
            if (mandatoryPins[type][element]) {
              var epBoardDOM = document.querySelector('.pin-' + mandatoryPins[type][element].toLowerCase());

              if (epBoardDOM) {
                var epBoardReference = epBoardDOM._jsPlumb;
                epBoardReference.detachAll();
                var uidEPBoard = epBoardReference.getUuid();
                var uidEPComponent = epComponent.getUuid();
                jsPlumbInstance.connect({
                  uuids: [uidEPComponent, uidEPBoard],
                  type: 'automatic'
                });
              } else {
                console.warn('Unable to recover board endpoints');
              }

            } else {
              console.warn('mandatoryPins. Some reference lost', mandatoryPins);
            }
          }

        }

        for (var type in newComponent.pins) {
          if (newComponent.pins[type]) {
            newComponent.pins[type].forEach(createEP);
          }
        }

        jsPlumbInstance.draggable(DOMComponent, {
          containment: true
        });

      }

    };

    exports.disconnectComponent = function(component) {
      var el = document.querySelector('[data-uid="' + component.uid + '"]');
      jsPlumbInstance.select({
        source: el.id
      }).detach();
    };

    exports.disconnectAllComponents = function() {
      jsPlumbInstance.detachAllConnections(boardDOMElement);
    };

    exports.removeComponent = function(component) {
      component.removeEventListener('mousedown');
      component.removeEventListener('mouseup');
      jsPlumbInstance.getConnections(component).forEach(function(conn) {
        conn.setType('removing');
      });
      jsPlumbInstance.detachAllConnections(component);
      jsPlumbInstance.remove(component);
    };

    exports.removeAllComponents = function() {
      jsPlumbInstance.deleteEveryEndpoint();
      var nodeList = containerDefault.querySelectorAll('.component');
      [].forEach.call(nodeList, function(el) {
        el.removeEventListener('mousedown');
        el.removeEventListener('mouseup');
        jsPlumb.remove(el);
      });
    };

    exports.removeSelectedConnection = function() {
      jsPlumbInstance.getAllConnections().forEach(function(con) {
        if (con.hasType('selected')) {
          con.endpoints.forEach(function(elem) {
            elem.removeType('selected');
            elem.removeClass('selected');
          });
          jsPlumbInstance.detach(con);
        }
      });
    };

    /**
     * [loadSchema It loads a board schema]
     * @param  {[type]} schema [description]
     * @return {[type]}        [description]
     */
    exports.loadSchema = function(newSchema) {

      this.schema = newSchema;
      var ref = this;

      if (ref.schema.robot) {
        exports.addRobot(ref.schema.robot);
      } else if (ref.schema.board) {

        //Add board
        exports.addBoard(ref.schema.board);

        //Add components
        this.schema.components.forEach(function(component) {
          exports.addComponent(component);
        });

        //Add connections
        this.schema.connections.forEach(function(connection) {
          if (jsPlumbInstance.getEndpoint(connection.pinSourceUid).isFull()) {
            return false;
          }

          jsPlumbInstance.connect({
            uuids: [connection.pinSourceUid, connection.pinTargetUid],
            type: 'automatic'
          });

        });
      } else {
        console.warn('Unable to add board', ref.schema);
      }

      exports.repaint();

    };

    exports.saveSchema = function() {

      var schema = {
        components: [],
        connections: []
      };
      var endpointsRef = {};

      function _setParameters(ep) {
        endpointsRef[ep.getParameter('pinComponent')] = {
          uid: ep.getUuid(),
          type: ep.scope
        };
      }

      var componentList = [].slice.call(containerDefault.querySelectorAll('.component'));
      componentList.forEach(function(item) {

        var endpoints = jsPlumbInstance.getEndpoints(item);

        if (endpoints && endpoints.length > 0) {

          endpointsRef = {};
          endpoints.forEach(_setParameters);

          var connections = jsPlumbInstance.getConnections({
            source: item
          });

          if (connections.length) { //components disconnected are not saving
            schema.components.push({
              endpoints: endpointsRef,
              uid: item.dataset.uid,
              connected: connections.length > 0
            });
          }
        }
      });

      function _getConnections() {
        return jsPlumbInstance.getAllConnections().map(function(connection) {

          var connectionParams = connection.getParameters();
          return ({
            pinSourceUid: connectionParams.pinSourceUid,
            pinTargetUid: connectionParams.pinTargetUid
          });

        }) || [];
      }

      //Store connections data
      schema.connections = _getConnections();

      return schema;
    };

    function _connectionListeners() {

      jsPlumbInstance.unbind('click');
      jsPlumbInstance.unbind('connection');
      jsPlumbInstance.unbind('connectionDetached');

      jsPlumbInstance.bind('connection', function(connection) {

        connection.targetEndpoint.setType('connected');
        connection.sourceEndpoint.setType('connected');

        connection.connection.setParameters({
          pinSourceUid: connection.sourceEndpoint.getUuid(),
          pinTargetUid: connection.targetEndpoint.getUuid()
        });
        var pinAssignation = {};
        pinAssignation[connection.sourceEndpoint.getParameter('pinComponent')] = connection.targetEndpoint.getParameter('pinBoard');

        var componentData = {
          uid: connection.source.dataset.uid,
          connections: [connection.connection],
          pin: pinAssignation
        };

        connection.connection.bind('click', function(c) {
          exports.unselectAllConnections();
          _selectConnection(c);
        });

        connectionEvent.componentData = componentData;
        connectionEvent.protoBoLaAction = 'attach';
        connectionEvent.protoBoLaActionParent =
          connection.connection.hasType('undoredo') || connection.connection.hasType('removing') || connection.connection.getData().undoredo;

        if (connection.target.classList.contains('board')) {
          containerDefault.dispatchEvent(connectionEvent);
        }

      });

      jsPlumbInstance.bind('connectionDetached', function(connection) {

        connection.targetEndpoint.removeType('connected');
        connection.sourceEndpoint.removeType('connected');

        var pinAssignation = {};
        pinAssignation[connection.sourceEndpoint.getParameter('pinComponent')] = undefined;

        var componentData = {
          uid: connection.source.dataset.uid,
          id: connection.source.dataset.id,
          category: connection.source.dataset.category,
          pin: pinAssignation,
          connections: [connection.connection]
        };

        _unselectConnection(connection.connection);

        connection.connection.unbind('click');

        connectionEvent.componentData = componentData;
        connectionEvent.protoBoLaAction = 'detach';
        connectionEvent.protoBoLaActionParent =
          connection.connection.hasType('undoredo') || connection.connection.hasType('removing') || connection.connection.getData().undoredo;

        if (connection.target.classList.contains('board')) {
          containerDefault.dispatchEvent(connectionEvent);
        }

      });

      jsPlumbInstance.bind('connectionMoved', function(connection) {
        connection.originalTargetEndpoint.removeType('selected');
        connection.originalTargetEndpoint.removeClass('selected');
        connection.originalTargetEndpoint.removeClass('endpointDrag');
      });

    }

    function _selectConnection(element) {
      if (element.hasType('selected')) {
        return false;
      }
      element.setType('selected');
      element.canvas.classList.add('selected');

      element.endpoints.forEach(function(ep) {
        ep.setType('selected');
        ep.canvas.classList.add('selected');
      });
    }

    function _unselectConnection(element) {
      element.removeType('selected');

      element.canvas.classList.remove('selected');

      element.endpoints.forEach(function(ep) {
        ep.removeType('selected');
        ep.canvas.classList.remove('selected');
      });
    }

    exports.unselectAllConnections = function() {
      jsPlumbInstance.getAllConnections().forEach(function(con) {
        con.removeType('selected');

        con.canvas.classList.remove('selected');

        con.endpoints.forEach(function(ep) {
          ep.removeType('selected');
          ep.canvas.classList.remove('selected');
        });
      });
    };

    exports.repaint = function() {
      setTimeout(function() {
        try {
          jsPlumbInstance.repaintEverything();
        } catch (e) {
          console.warn('protoboard container reference lost!. Re-engage', e);
        }
      }, 100);
    };

    function _registerJsPlumbTypes() {

      // Register connection types
      var commonConnectionType = {

      };

      jsPlumbInstance.registerConnectionTypes({
        'selected': {
          paintStyle: {
            strokeStyle: config.colorHover
          },
          hoverPaintStyle: {
            strokeStyle: config.colorHover
          }
        },
        'default': commonConnectionType
      });

      // Register endpoints types
      jsPlumbInstance.registerEndpointTypes({
        'selected': {
          paintStyle: {
            strokeStyle: config.colorHover,
            fillStyle: config.colorHover
          },
          hoverPaintStyle: {
            fillStyle: config.colorHover
          }
        }
      });

      jsPlumbInstance.registerEndpointTypes({
        'connected': {
          paintHoverStyle: {
            fillStyle: config.colorHover
          },
          endpointHoverStyle: {
            fillStyle: config.colorHover
          }
        }
      });
    }

    return exports;

  });

})();