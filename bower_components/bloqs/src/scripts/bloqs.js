'use strict';
(function(exports, _, bloqsUtils, bloqsLanguages) {
    /**
     * Events
     * bloqs:connect
     * bloqs:dragend
     * bloqs:bloqremoved
     * bloqs:change
     */

    var utils = bloqsUtils,
        lang = 'es-ES',
        connectors = {},
        IOConnectors = {},
        bloqs = {},
        availableConnectors = [],
        availableIOConnectors = [],
        $field = null,
        scrollTop = 0,
        softwareArrays = {
            voidFunctions: [],
            returnFunctions: [],
            softwareVars: [],
            classes: [],
            objects: []
        },
        dragPreviousTopPosition,
        dragPreviousLeftPosition,
        dragBloqMousePositionX,
        dragBloqMousePositionY,
        //we cant get the offset if the element its not visible, to avoid calc them on each drag, set them here
        fieldOffsetTop,
        //to relative fields
        fieldOffsetLeft = 0, //Bitbloq value 70,
        fieldOffsetTopSource = [], //bitbloq value['header', 'nav--make', 'actions--make', 'tabs--title'],
        fieldOffsetTopForced = 0,
        mouseDownBloq = null,
        draggingBloq = null,
        startPreMouseMove = null,
        preMouseMoveX,
        preMouseMoveY;

    var setOptions = function(options) {
        fieldOffsetTopSource = options.fieldOffsetTopSource || [];
        fieldOffsetLeft = options.fieldOffsetLeft || 0;
        fieldOffsetTopForced = options.fieldOffsetTopForced || 0;
        lang = options.lang || 'es-ES';
    };

    var getFieldOffsetTop = function(source) {
        var fieldOffsetTop = 0;
        if (fieldOffsetTopForced) {
            fieldOffsetTop = fieldOffsetTopForced;
        } else {
            var tempElement;
            for (var i = 0; i < source.length; i++) {
                tempElement = document.getElementsByClassName(source[i]);
                if (tempElement[0]) {
                    fieldOffsetTop += tempElement[0].clientHeight;
                }
            }
        }

        return fieldOffsetTop;
    };

    var bloqMouseDown = function(evt) {
        //console.log('bloqMouseDown');
        //console.log(evt.target.tagName);
        if (evt.target.tagName !== 'SELECT') {
            //to avoid mousemove event on children and parents at the same time
            evt.stopPropagation();

            mouseDownBloq = evt.currentTarget;
            startPreMouseMove = true;
            document.addEventListener('mousemove', bloqPreMouseMove);
            document.addEventListener('mouseup', bloqMouseUpBeforeMove);
        }
    };

    var bloqMouseUpBeforeMove = function() {
        //console.log('bloqMouseUpBeforeMove');
        mouseDownBloq = null;
        document.removeEventListener('mousemove', bloqPreMouseMove);
        document.removeEventListener('mouseup', bloqMouseUpBeforeMove);
    };

    //to avoid move bloqs with a 1 px movement
    var bloqPreMouseMove = function(evt) {
        if (startPreMouseMove) {
            preMouseMoveX = evt.pageX;
            preMouseMoveY = evt.pageY;
            startPreMouseMove = false;

            //we take values to the bloqsMouseMove from the first move
            var position = mouseDownBloq.getBoundingClientRect();

            //mouse position respect bloq
            dragBloqMousePositionX = evt.pageX - position.left;
            dragBloqMousePositionY = evt.pageY - position.top;

            //the mouse position its relative to the document, we need the top offset from header
            fieldOffsetTop = getFieldOffsetTop(fieldOffsetTopSource);

            //position to control the translate and the distance
            dragPreviousTopPosition = position.top;
            dragPreviousLeftPosition = position.left;

            //to add the scroll to the mouse positions
            scrollTop = $field[0].scrollTop;
        } else {

            var distanceX = evt.pageX - preMouseMoveX,
                distanceY = evt.pageY - preMouseMoveY;

            //console.log('distance', Math.abs(distanceX), Math.abs(distanceY));
            if ((Math.abs(distanceX) >= 5) || (Math.abs(distanceY) >= 5)) {
                document.removeEventListener('mousemove', bloqPreMouseMove);
                document.addEventListener('mousemove', bloqMouseMove);
            }
        }
    };

    var bloqMouseMove = function(evt) {
        //console.log('bloqMouseMove');
        var bloq = null;
        //actions to do before start to move
        if (mouseDownBloq) {
            bloq = bloqs[mouseDownBloq.getAttribute('data-bloq-id')];

            if (!bloq.isConnectable()) {
                //console.log('its not connectable');
                bloq.doConnectable();
                $field.append(bloq.$bloq);
            }
            document.removeEventListener('mouseup', bloqMouseUpBeforeMove);
            document.addEventListener('mouseup', bloqMouseUp);

            mouseDownBloq.className = mouseDownBloq.className.concat(' dragging');

            switch (bloq.bloqData.type) {
                case 'statement':
                case 'statement-input':
                    statementDragStart(bloq);
                    break;
                case 'output':
                    outputDragStart(bloq);
                    break;
                case 'group':
                    throw 'Group cant be moved';
                default:
                    throw 'Not defined bloq dragstart!!';
            }
            mouseDownBloq = null;
            draggingBloq = bloq;
        }

        bloq = bloq || draggingBloq;
        var distance = moveBloq(bloq, evt.clientX, evt.clientY);

        switch (bloq.bloqData.type) {
            case 'statement':
            case 'statement-input':
                utils.redrawTree(bloq, bloqs, connectors);
                if (distance > 10) {
                    handleCollisions([bloq.connectors[0], utils.getLastBottomConnectorUuid(bloq.uuid, bloqs, connectors)], evt);
                }
                break;
            case 'output':
                if (distance > 10) {
                    handleIOCollisions(bloq, availableIOConnectors);
                }
                break;
            default:
                throw 'Not defined bloq drag!!';
        }

    };

    var bloqMouseUp = function() {
        //console.log('bloqMouseUp');
        scrollTop = 0;
        var $dropConnector = $('.connector.available').first(),
            bloq = draggingBloq;

        if ($dropConnector[0]) {

            switch (bloq.bloqData.type) {
                case 'statement':
                case 'statement-input':
                    statementDragEnd(bloq, $dropConnector);
                    break;
                case 'output':
                    outputDragEnd(bloq, $dropConnector);
                    break;
                default:
                    throw 'Not defined bloq drag!!';
            }
            window.dispatchEvent(new Event('bloqs:connect'));

            if (!bloq.$bloq.closest('.bloq--group')[0]) {
                bloq.disable();
                if ((bloq.bloqData.type === 'statement') || (bloq.bloqData.type === 'statement-input')) {
                    utils.executeFunctionOnConnectedStatementBloqs('disable', bloq, bloqs, connectors);
                }
            } else {
                bloq.enable();
                if ((bloq.bloqData.type === 'statement') || (bloq.bloqData.type === 'statement-input')) {
                    utils.executeFunctionOnConnectedStatementBloqs('enable', bloq, bloqs, connectors);
                }
            }
        } else {
            bloq.disable();
            if ((bloq.bloqData.type === 'statement') || (bloq.bloqData.type === 'statement-input')) {
                utils.executeFunctionOnConnectedStatementBloqs('disable', bloq, bloqs, connectors);
            }

        }
        availableConnectors = [];
        availableIOConnectors = [];
        $('.bloq').removeClass('dragging');
        $('.connector.available').removeClass('available');
        $('.bloq--dragging').removeClass('bloq--dragging');
        $field.focus();
        window.dispatchEvent(new Event('bloqs:dragend'));

        draggingBloq = null;
        dragPreviousTopPosition = 0;
        dragPreviousLeftPosition = 0;

        document.removeEventListener('mousemove', bloqMouseMove);
        document.removeEventListener('mouseup', bloqMouseUp);
    };

    var statementDragStart = function(bloq) {

        var previousConnector = connectors[bloq.connectors[0]].connectedTo;

        if (previousConnector) {
            var previousBloq = bloqs[connectors[previousConnector].bloqUuid];

            var itsInsideAConnectorRoot = utils.itsInsideAConnectorRoot(bloq, bloqs, connectors);

            //desenganchamos
            connectors[previousConnector].connectedTo = null;
            connectors[bloq.connectors[0]].connectedTo = null;

            //miramos si estaba enganchado a un connector-root para sacarlo del parent
            if (itsInsideAConnectorRoot) {

                //setTimeout(function() {
                if (previousBloq.bloqData.type === 'group') {
                    //remove class that show help on group bloqs
                    previousBloq.$bloq.removeClass('with--content');
                }
                removeFromStatementInput(bloq);
                utils.redrawTree(previousBloq, bloqs, connectors);
                // }, 0);

            }
        }

        availableConnectors = [];

        for (var connectorUuid in connectors) {

            if (connectors[connectorUuid].data.type !== 'connector--empty') {
                if (utils.getBloqByConnectorUuid(connectorUuid, bloqs, connectors).isConnectable()) {
                    if (!utils.connectorIsInBranch(connectorUuid, bloq.uuid, bloqs, connectors)) {
                        availableConnectors.push(connectorUuid);
                    }
                }
            }
        }
    };

    var removeFromStatementInput = function(firstBloqToRemove) {
        var $totalBloqsToRemove = [firstBloqToRemove.$bloq];
        var childConnectorUuid = connectors[firstBloqToRemove.connectors[1]].connectedTo,
            bloqToRemove,
            top = firstBloqToRemove.$bloq.outerHeight(true);

        firstBloqToRemove.$bloq.removeClass('inside-bloq');
        while (childConnectorUuid) {
            bloqToRemove = bloqs[connectors[childConnectorUuid].bloqUuid];
            $totalBloqsToRemove.push(bloqToRemove.$bloq);
            bloqToRemove.$bloq.removeClass('inside-bloq');
            bloqToRemove.$bloq[0].style.transform = 'translate(' + 0 + 'px,' + top + 'px)';
            top += bloqToRemove.$bloq.outerHeight(true);
            childConnectorUuid = connectors[bloqToRemove.connectors[1]].connectedTo;
        }
        utils.appendArrayInOneTime($field, $totalBloqsToRemove);

    };

    var outputDragStart = function(bloq) {
        var outputConnector = utils.getOutputConnector(bloq, IOConnectors);
        if (outputConnector.connectedTo) {
            bloq.$bloq.removeClass('nested-bloq');

            var bloqConnector = IOConnectors[outputConnector.connectedTo],
                oldBloq = bloqs[bloqConnector.bloqUuid];

            //remove the logical conexions
            bloqConnector.connectedTo = null;
            outputConnector.connectedTo = null;

            if (oldBloq.bloqData.returnType && (oldBloq.bloqData.returnType.type === 'fromInput')) {
                updateSoftVar(oldBloq);
            }

            $field[0].appendChild(bloq.$bloq[0]);
        }

        //store the available connectors
        availableIOConnectors = [];
        for (var connectorUuid in IOConnectors) {
            if (IOConnectors[connectorUuid].data.type === 'connector--input') {
                if (utils.getBloqByConnectorUuid(connectorUuid, bloqs, IOConnectors).isConnectable()) {
                    if (!IOConnectors[connectorUuid].connectedTo) {
                        if (utils.sameConnectionType(bloq, utils.getBloqByConnectorUuid(connectorUuid, bloqs, IOConnectors), IOConnectors[connectorUuid].data.acceptType, bloqs, IOConnectors, softwareArrays)) {
                            if (!utils.connectorIsInBranch(connectorUuid, bloq.uuid, bloqs, IOConnectors)) {
                                availableIOConnectors.push(connectorUuid);
                            }
                        }
                    }
                }
            }
        }

        // console.log('availableIOConnectors',availableIOConnectors);
    };

    var moveBloq = function(bloq, clientX, clientY) {
        var position = bloq.$bloq[0].getBoundingClientRect(),
            distance = Math.round(Math.sqrt(Math.pow(dragPreviousTopPosition - position.top, 2) + Math.pow(dragPreviousLeftPosition - position.left, 2))),
            x,
            y,
            destinationX,
            destinationY;
        if (scrollTop !== $field[0].scrollTop) {
            scrollTop = $field[0].scrollTop;
        }

        x = clientX - fieldOffsetLeft;
        y = clientY - fieldOffsetTop + scrollTop;

        destinationX = (x - dragBloqMousePositionX);
        destinationY = (y - dragBloqMousePositionY);

        bloq.$bloq[0].style.transform = 'translate(' + destinationX + 'px,' + destinationY + 'px)';
        if (distance > 10) {
            dragPreviousTopPosition = position.top;
            dragPreviousLeftPosition = position.left;
        }
        if (bloq.bloqData.type === 'statement-input') {
            utils.redrawTree(bloq, bloqs, connectors);
        }

        return distance;
    };

    var statementDragEnd = function(bloq, $dropConnector) {

        var dropConnectorUuid = $dropConnector.attr('data-connector-id');
        var dragConnectorUuid = $('[data-connector-id="' + dropConnectorUuid + '"]').attr('data-canconnectwith');

        //console.log('dragConnectorUuid', dragConnectorUuid);
        //console.log('dropUuid', dropConnectorUuid);
        var areDroppingInsideABloq = utils.itsARootConnector(connectors[dropConnectorUuid]) || utils.itsInsideAConnectorRoot(utils.getBloqByConnectorUuid(dropConnectorUuid, bloqs, connectors), bloqs, connectors);

        //console.log('areDroppingInsideABloq?', areDroppingInsideABloq);

        setLogicalConnections(dropConnectorUuid, dragConnectorUuid);
        if (areDroppingInsideABloq) {
            connectorRootDragEnd(bloq, $dropConnector);
        } else {
            placeNestedBloq(dropConnectorUuid, dragConnectorUuid);
        }

    };

    var connectorRootDragEnd = function(dragBloq, $dropConnector) {
        //console.log('connectorRootDragEnd');
        var dropConnectorUuid = $dropConnector.attr('data-connector-id');
        var dropBloq = bloqs[connectors[dropConnectorUuid].bloqUuid];

        dragBloq.$bloq.addClass('inside-bloq');
        dragBloq.$bloq.removeAttr('style');

        if (utils.itsARootConnector(connectors[dropConnectorUuid])) {
            var $dropContainer = dropBloq.$bloq.find('.bloq--extension__content');
            $dropContainer.first().append(dragBloq.$bloq);
            dropBloq.$bloq.addClass('with--content');
        } else {
            dropBloq.$bloq.after(dragBloq.$bloq);
        }

        //var childNodes

        var somethingConnectedInBottomUuid = connectors[dragBloq.connectors[1]].connectedTo;
        var branchBloq;
        var childNodes = [];
        while (somethingConnectedInBottomUuid) {
            branchBloq = bloqs[connectors[somethingConnectedInBottomUuid].bloqUuid];
            childNodes.push(branchBloq.$bloq);
            branchBloq.$bloq.addClass('inside-bloq');
            branchBloq.$bloq.removeAttr('style');

            somethingConnectedInBottomUuid = connectors[branchBloq.connectors[1]].connectedTo;

        }
        dragBloq.$bloq.after(utils.jqueryObjectsArrayToHtmlToInsert(childNodes));

        //se repinta el arbol donde esta el dropbloq, porq cambiara de tamaño
        utils.redrawTree(dropBloq, bloqs, connectors);
    };

    var outputDragEnd = function(bloq, $dropConnector) {
        var dropConnectorUuid = $dropConnector.attr('data-connector-id');
        var dragConnectorUuid = utils.getOutputConnector(bloq, IOConnectors).uuid;

        $dropConnector.append(bloq.$bloq);
        bloq.$bloq.addClass('nested-bloq').removeAttr('style');

        IOConnectors[dropConnectorUuid].connectedTo = dragConnectorUuid;
        IOConnectors[dragConnectorUuid].connectedTo = dropConnectorUuid;

        var dropBloq = utils.getBloqByConnectorUuid(dropConnectorUuid, bloqs, IOConnectors);
        var dragBloq = utils.getBloqByConnectorUuid(dragConnectorUuid, bloqs, IOConnectors);

        if (dropBloq.bloqData.returnType && (dropBloq.bloqData.returnType.type === 'fromInput')) {
            if (!dragBloq.bloqData.returnType.pointer) {
                updateSoftVar(dropBloq);
            }
        }
    };

    var handleCollisions = function(dragConnectors) {
        var i,
            found,
            $dropConnector,
            $dragConnector,
            tempBloq;

        // For each available connector
        availableConnectors.forEach(function(dropConnectorUuid) {
            $dropConnector = connectors[dropConnectorUuid].jqueryObject;
            i = 0;
            found = false;
            while (!found && (i < dragConnectors.length)) {
                $dragConnector = connectors[dragConnectors[i]].jqueryObject;

                if ((connectors[dragConnectors[i]].data.type === connectors[dropConnectorUuid].data.accept) && utils.itsOver($dragConnector, $dropConnector, 20)) {
                    found = true;
                } else {
                    i++;
                }
            }
            tempBloq = utils.getBloqByConnectorUuid(dropConnectorUuid, bloqs, connectors);
            if (found) {
                $dropConnector.addClass('available');
                $dropConnector.attr('data-canconnectwith', dragConnectors[i]);

                if (tempBloq.bloqData.type === 'group') {
                    tempBloq.$bloq.addClass('bloq--dragging');
                }
            } else {
                if (tempBloq.bloqData.type === 'group') {
                    tempBloq.$bloq.removeClass('bloq--dragging');
                }
                $dropConnector.removeClass('available');
                $dropConnector.removeAttr('data-canconnectwith');
            }
        });
    };

    var handleIOCollisions = function(bloq, availableIOConnectors) {
        var dropConnector;
        var dragConnector = utils.getOutputConnector(bloq, IOConnectors);
        availableIOConnectors.forEach(function(dropConnectorUuid) {
            dropConnector = IOConnectors[dropConnectorUuid];
            if (utils.itsOver(dragConnector.jqueryObject, dropConnector.jqueryObject, 0) && utils.sameConnectionType(bloqs[dragConnector.bloqUuid], bloqs[dropConnector.bloqUuid], dropConnector.data.acceptType, bloqs, IOConnectors, softwareArrays)) {
                dropConnector.jqueryObject.addClass('available');
            } else {
                dropConnector.jqueryObject.removeClass('available');

            }
        });
    };

    var setLogicalConnections = function(dropConnectorUuid, dragConnectorUUid) {
        //console.log('conectamos', dropConnectorUuid, connectors[dropConnectorUuid].data.type, 'con ', dragConnectorUUid, connectors[dragConnectorUUid].data.type);
        //console.log('conectado con', connectors[dropConnectorUuid].connectedTo, 'y el otro con', connectors[dragConnectorUUid].connectedTo);
        if (connectors[dropConnectorUuid].connectedTo) {
            var dropBottomConnectorUuid, dragBloqLastBottomConnectorUuid, dropTopConnectorUuid, dragBloqFirstTopConnectorUuid;
            switch (connectors[dropConnectorUuid].data.type) {
                case 'connector--bottom':
                    dropBottomConnectorUuid = connectors[dropConnectorUuid].connectedTo;
                    dragBloqLastBottomConnectorUuid = utils.getLastBottomConnectorUuid(connectors[dragConnectorUUid].bloqUuid, bloqs, connectors);
                    connectors[dragBloqLastBottomConnectorUuid].connectedTo = dropBottomConnectorUuid;
                    connectors[dropBottomConnectorUuid].connectedTo = dragBloqLastBottomConnectorUuid;
                    break;
                case 'connector--top':
                    dropTopConnectorUuid = connectors[dropConnectorUuid].connectedTo;
                    dragBloqFirstTopConnectorUuid = utils.getFirstTopConnectorUuid(connectors[dragConnectorUUid].bloqUuid, bloqs, connectors);
                    connectors[dropTopConnectorUuid].connectedTo = dragBloqFirstTopConnectorUuid;
                    connectors[dragBloqFirstTopConnectorUuid].connectedTo = dropTopConnectorUuid;
                    break;
                case 'connector--root':
                    dropBottomConnectorUuid = connectors[dropConnectorUuid].connectedTo;
                    dragBloqLastBottomConnectorUuid = utils.getLastBottomConnectorUuid(connectors[dragConnectorUUid].bloqUuid, bloqs, connectors);
                    connectors[dragBloqLastBottomConnectorUuid].connectedTo = dropBottomConnectorUuid;
                    connectors[dropBottomConnectorUuid].connectedTo = dragBloqLastBottomConnectorUuid;
                    break;
                default:
                    throw 'connector on setLogicalConnections no handled ' + connectors[dropConnectorUuid].data.type;
            }
        }
        connectors[dropConnectorUuid].connectedTo = dragConnectorUUid;
        connectors[dragConnectorUUid].connectedTo = dropConnectorUuid;
    };

    var placeNestedBloq = function(dropConnectorUuid, dragConnectorUuid) {
        //console.log('Nest');

        var dropBloq = bloqs[connectors[dropConnectorUuid].bloqUuid];
        //console.log(dropBloq, dragBloq);

        switch (dropBloq.bloqData.type) {
            case 'statement':
            case 'statement-input':
                utils.redrawTree(utils.getBloqByConnectorUuid(dragConnectorUuid, bloqs, connectors), bloqs, connectors);
                break;
            case 'output':
                break;
            default:
                throw 'bloqtype not defined in nesting ' + dropBloq.bloqData.type;
        }
    };

    var updateSoftVar = function(bloq, name, type, args) {
        var dynamicContentType = bloq.bloqData.createDynamicContent;
        //console.log('updating softVar', dynamicContentType);
        if (!dynamicContentType) {
            throw 'We are adding a softVar on a bloq that not defined the dynamic content';
        }
        if (!softwareArrays[dynamicContentType]) {
            throw 'dynamicContentType not defined ' + bloq.bloqData.name;
        }
        var found = false,
            i = 0;
        while (!found && (i < softwareArrays[dynamicContentType].length)) {
            if (softwareArrays[dynamicContentType][i].bloqUuid === bloq.uuid) {
                found = true;
            }
            i++;
        }
        type = type || utils.getTypeFromBloq(bloq, bloqs, IOConnectors, softwareArrays);
        //arguments if any:
        if (bloq.bloqData.type === 'statement-input' && bloq.bloqData.arguments) {
            args = args || utils.getArgsFromBloq(bloq, bloqs, IOConnectors);
        } else {
            args = '';
        }
        var softVar;
        if (found) {
            softVar = softwareArrays[dynamicContentType][i - 1];
            softVar.name = name || softVar.name;
            softVar.type = type;
            softVar.args = args;
            if (softVar.name) {
                //cambiar data-value cuando el valor sea el mismo que el de la variable que se cambia
                // $('select[data-varreference=' + softVar.id + ']').attr({
                //     'data-value': softVar.name
                // });
                $('option[data-var-id="' + softVar.id + '"]').attr({
                    value: softVar.name
                }).html(softVar.name);

            } else {
                removeSoftVar(bloq);
            }

        } else {
            if (name) {
                softVar = {
                    name: name,
                    id: utils.generateUUID(),
                    bloqUuid: bloq.uuid,
                    type: type,
                    args: args
                };
                softwareArrays[dynamicContentType].push(softVar);
                $('select[data-dropdowncontent="' + dynamicContentType + '"]').append($('<option>').attr({
                    'data-var-id': softVar.id,
                    value: softVar.name
                }).html(softVar.name));
            }
        }
        //update type of all vars
        updateSoftVarTypes(softwareArrays, dynamicContentType, bloqs, IOConnectors);
        // console.log('afterUpdating: ', softwareArrays);
    };

    var removeSoftVar = function(bloq) {
        var dynamicContentType = bloq.bloqData.createDynamicContent;
        var found = false,
            i = 0;
        while (!found && (i < softwareArrays[dynamicContentType].length)) {
            if (softwareArrays[dynamicContentType][i].bloqUuid === bloq.uuid) {
                found = true;
            }
            i++;
        }
        if (found) {
            var softVar = softwareArrays[dynamicContentType][i - 1];
            softwareArrays[dynamicContentType].splice(i - 1, 1);
            $('option[data-var-id="' + softVar.id + '"]').remove();
        }
        updateSoftVarTypes(softwareArrays, dynamicContentType, bloqs, IOConnectors);
    };

    var updateSoftVarTypes = function(softwareArrays, dynamicContentType, bloqs, IOConnectors) {

        var tempSoftVar;
        for (var i = 0; i < softwareArrays[dynamicContentType].length; i++) {
            tempSoftVar = softwareArrays[dynamicContentType][i];
            tempSoftVar.type = utils.getTypeFromBloq(bloqs[tempSoftVar.bloqUuid], bloqs, IOConnectors, softwareArrays);
        }
        //utils.drawSoftwareArray(softwareArrays);
    };

    var removeBloq = function(bloqUuid, redraw) {
        //console.log('remove:', bloqUuid);
        var bloq = bloqs[bloqUuid],
            i;
        if (bloq) {
            //disconnect
            var topConnector, bottomConnector, outputConnector;
            window.dispatchEvent(new Event('bloqs:bloqremoved'));
            bloq.$bloq[0].removeEventListener('mousedown', bloqMouseDown);
            //if its moving remove all listener
            if ((mouseDownBloq && mouseDownBloq.getAttribute('data-bloq-id') === bloqUuid) ||
                (draggingBloq && draggingBloq.uuid)) {

                document.removeEventListener('mouseup', bloqMouseUpBeforeMove);
                document.removeEventListener('mousemove', bloqPreMouseMove);
                document.removeEventListener('mousemove', bloqMouseMove);
                document.removeEventListener('mouseup', bloqMouseUp);
            }
            switch (bloq.bloqData.type) {
                case 'statement-input':
                case 'group':
                    var tempBloq,
                        childConnector = connectors[bloq.connectors[2]].connectedTo;

                    while (childConnector) {
                        tempBloq = utils.getBloqByConnectorUuid(childConnector, bloqs, connectors);
                        childConnector = connectors[tempBloq.connectors[1]].connectedTo;
                        removeBloq(tempBloq.uuid);
                    }
                    /* falls through */
                case 'statement':

                    topConnector = connectors[bloq.connectors[0]].connectedTo;
                    bottomConnector = connectors[bloq.connectors[1]].connectedTo;

                    if (topConnector && bottomConnector) {
                        connectors[topConnector].connectedTo = bottomConnector;
                        connectors[bottomConnector].connectedTo = topConnector;

                        if (redraw) {
                            utils.redrawTree(utils.getBloqByConnectorUuid(topConnector, bloqs, connectors), bloqs, connectors);
                        }

                    } else if (topConnector) {
                        connectors[topConnector].connectedTo = null;
                        var previousBloq = bloqs[connectors[topConnector].bloqUuid];
                        if (previousBloq.bloqData.type === 'group') {
                            previousBloq.$bloq.removeClass('with--content');
                        }

                        if (redraw) {
                            utils.redrawTree(utils.getBloqByConnectorUuid(topConnector, bloqs, connectors), bloqs, connectors);
                        }
                    } else if (bottomConnector) {
                        connectors[bottomConnector].connectedTo = null;
                    }
                    //remove the inputs bloqs inside in 1 level
                    var uuid;
                    for (i = 0; i < bloq.IOConnectors.length; i++) {
                        uuid = bloq.IOConnectors[i];
                        if ((IOConnectors[uuid].data.type === 'connector--input') && IOConnectors[uuid].connectedTo) {
                            removeBloq(IOConnectors[IOConnectors[uuid].connectedTo].bloqUuid);
                        }
                    }
                    break;
                case 'output':
                    outputConnector = IOConnectors[bloq.IOConnectors[0]].connectedTo;

                    if (outputConnector) {
                        IOConnectors[outputConnector].connectedTo = null;
                    }
                    break;
                default:
                    throw 'we dont know how to delete: ' + bloq.bloqData.type;
            }

            //remove visual
            bloq.$bloq.remove();
            //removeLogical
            var key;
            for (i = 0; i < bloq.connectors.length; i++) {
                delete connectors[bloq.connectors[i]];
            }
            for (i = 0; i < bloq.IOConnectors.length; i++) {
                delete IOConnectors[bloq.IOConnectors[i]];
            }

            //si es un bloq que genera dinmayc content
            if (bloq.bloqData.createDynamicContent) {
                removeSoftVar(bloq);
            } else {
                for (key in softwareArrays) {
                    updateSoftVarTypes(softwareArrays, key, bloqs, IOConnectors);
                }
            }

            //remove the bloq
            delete bloqs[bloqUuid];

        } else {
            throw 'Cant delete this bloq: ' + bloqUuid;
        }

    };

    var buildContent = function(bloq) {

        var componentsArray = bloq.componentsArray,
            bloqData = bloq.bloqData;
        var $tempElement;
        for (var j = 0; j < bloqData.content.length; j++) {
            for (var k = 0; k < bloqData.content[j].length; k++) {
                $tempElement = createBloqElement(bloq, bloqData.content[j][k], componentsArray, softwareArrays);
                if (bloqData.content[j][k].position === 'DOWN') {
                    bloq.$contentContainerDown.addClass('with-content');
                    bloq.$contentContainerDown.append($tempElement);
                } else {
                    bloq.$contentContainer.append($tempElement);
                }
            }
        }
    };

    var buildStatementConnector = function(tempUuid, bloqConnectors, bloq, tempConnector, $container) {
        var $connector = $('<div>').attr({
            'data-connector-id': tempUuid
        });

        $connector.addClass('connector connector--offline ' + bloqConnectors.type);

        $container.append($connector);

        connectors[tempUuid] = tempConnector;

        bloq.connectors.push(tempUuid);
        return $connector;
    };

    var buildConnectors = function(bloqConnectors, bloq) {
        //connectors
        var $connector, tempUuid, tempConnector, $container;
        for (var i = 0; i < bloqConnectors.length; i++) {

            tempUuid = 'connector:' + utils.generateUUID();

            tempConnector = {
                uuid: tempUuid,
                data: bloqConnectors[i],
                bloqUuid: bloq.uuid,
                connectedTo: null
            };

            switch (bloqConnectors[i].type) {
                case 'connector--top':
                    if (bloq.bloqData.type === 'statement-input') {
                        $container = bloq.$bloq.children('.bloq--statement-input__header');
                    } else {
                        $container = bloq.$bloq.children('.bloq--fixed');
                    }
                    $connector = buildStatementConnector(tempUuid, bloqConnectors[i], bloq, tempConnector, $container);
                    break;
                case 'connector--bottom':
                    if (bloq.bloqData.type === 'statement-input') {
                        $container = bloq.$bloq.find('.bloq--extension--end');
                    } else {
                        $container = bloq.$bloq.children('.bloq--fixed');
                    }
                    $connector = buildStatementConnector(tempUuid, bloqConnectors[i], bloq, tempConnector, $container);
                    break;
                case 'connector--root':
                    if (bloq.bloqData.type === 'statement-input') {
                        $container = bloq.$bloq.children('.bloq--statement-input__header');
                    } else {
                        $container = bloq.$bloq;
                    }
                    $connector = buildStatementConnector(tempUuid, bloqConnectors[i], bloq, tempConnector, $container);

                    break;
                case 'connector--input':
                    $connector = $(bloq.$bloq.find('.bloqinput[data-connector-name="' + bloqConnectors[i].name + '"]'));

                    $connector.attr({
                        'data-connector-id': tempUuid
                    }).addClass('connector ' + bloqConnectors[i].type);
                    tempConnector.contentId = $connector.attr('data-content-id');
                    IOConnectors[tempUuid] = tempConnector;
                    bloq.IOConnectors.push(tempUuid);
                    break;
                case 'connector--output':
                    $connector = $('<div>').attr({
                        'data-connector-id': tempUuid
                    }).addClass('connector connector--offline ' + bloqConnectors[i].type);

                    bloq.$bloq.append($connector);

                    tempConnector.returnType = bloq.bloqData.returnType;
                    IOConnectors[tempUuid] = tempConnector;

                    bloq.IOConnectors.push(tempUuid);
                    break;
                case 'connector--empty':
                    $connector = $('<div>');
                    connectors[tempUuid] = tempConnector;

                    bloq.connectors.push(tempUuid);
                    break;
                default:
                    throw 'Connector not defined to build';
            }
            tempConnector.jqueryObject = $connector;
        }
    };

    var createBloqElement = function(bloq, elementSchema, componentsArray, softwareArrays) {
        var i,
            $tempElement,
            $element = null,
            arrayOptions,
            key;
        switch (elementSchema.alias) {
            case 'staticDropdown':
                //component
                $element = $('<select>');
                $element.attr({
                    name: '',
                    'data-content-id': elementSchema.id
                });

                var childs = [];
                for (i = 0; i < elementSchema.options.length; i++) {
                    $tempElement = $('<option>').attr({
                        value: elementSchema.options[i].value,
                        'data-i18n': elementSchema.options[i].label
                    }).html(translateBloq(lang, elementSchema.options[i].label));
                    childs.push($tempElement);
                }
                utils.appendArrayInOneTime($element, childs);
                if (elementSchema.value) {
                    $element.val(elementSchema.value);
                }

                $element.change(function() {
                    window.dispatchEvent(new Event('bloqs:change'));
                });

                if (bloq.bloqData.returnType && bloq.bloqData.returnType.type === 'fromDropdown') {
                    $element.change(function() {
                        updateSoftVar(bloq);
                    });
                }

                break;
            case 'dynamicDropdown':
                $element = $('<select>');
                $element.attr({
                    name: '',
                    'data-content-id': elementSchema.id,
                    'data-dropdowncontent': elementSchema.options,
                    'data-value': elementSchema.value
                });

                switch (elementSchema.options) {
                    case 'voidFunctions':
                    case 'returnFunctions':
                    case 'softwareVars':
                    case 'classes':
                    case 'objects':
                        arrayOptions = softwareArrays[elementSchema.options];
                        $element.change(function() {
                            //if we change a dynamicDropdown, can be for two reasons
                            // We are a output and we refresh vars of the old BLoq
                            // We are selecting a variable in a statement, and we update the dont change type
                            if (bloq.bloqData.type === 'output') {
                                var outputConnector = utils.getOutputConnector(bloq, IOConnectors);
                                //if its connected to another bloq, we update the vars of the old bloq
                                if (outputConnector.connectedTo) {

                                    var bloqConnector = IOConnectors[outputConnector.connectedTo],
                                        oldBloq = bloqs[bloqConnector.bloqUuid];

                                    if (oldBloq.bloqData.returnType && (oldBloq.bloqData.returnType.type === 'fromInput')) {
                                        updateSoftVar(oldBloq);
                                    }
                                }
                            }
                        });
                        break;
                    case 'varComponents':
                        arrayOptions = [];

                        for (key in componentsArray) {
                            if (componentsArray[key].length >= 1) {
                                arrayOptions = arrayOptions.concat(componentsArray[key]);
                            }
                        }
                        break;
                    case 'clocks':
                        arrayOptions = [];
                        arrayOptions = componentsArray.clocks;
                        break;
                    case 'hts221':
                        arrayOptions = [];
                        arrayOptions = componentsArray.hts221;
                        break;
                    default:
                        arrayOptions = componentsArray[elementSchema.options];
                }
                if (!arrayOptions) {
                    throw 'Dropdowns not defined in array: ' + elementSchema.options;
                }

                //content
                utils.drawDropdownOptions($element, arrayOptions);

                if (elementSchema.value) {
                    $element.val(elementSchema.value);
                    var componentRef = arrayOptions.find(function(item) {
                        return item.name === elementSchema.value;
                    });
                    $element[0].dataset.reference = componentRef ? componentRef.uid : '';
                    $element[0].dataset.value = elementSchema.value;
                    $element.val(elementSchema.value);
                }

                $element.change(function(evt) {
                    $element[0].dataset.value = evt.currentTarget.value;
                    $element[0].dataset.reference = evt.currentTarget.selectedOptions[0].dataset.reference;
                    //$element[0].dataset.varreference = evt.currentTarget.selectedOptions[0].dataset.varId;
                    window.dispatchEvent(new Event('bloqs:change'));
                });

                break;
            case 'text':
                $element = $('<span>').attr({
                    'data-i18n': elementSchema.value
                }).html(translateBloq(lang, elementSchema.value));
                break;
            case 'removableText':
                $element = $('<span>').html(elementSchema.value);
                $element.addClass('removabletext');

                break;
            case 'numberInput':
                $element = $('<input>').attr({
                    type: 'text',
                    'data-content-id': elementSchema.id,
                    'data-placeholder-i18n': elementSchema.placeholder,
                    placeholder: translateBloq(lang, elementSchema.placeholder)
                }).val(elementSchema.value);
                //Check that the characters are numbers
                $element.bind('input', function() {
                    var position = utils.getCaretPosition(this);
                    var a = utils.validNumber($(this).val());
                    $(this).val(a.value);
                    utils.setCaretPosition(this, position - a.removedChar);
                });
                $element.on('keyup', function(evt) {
                    $(evt.currentTarget).autoGrowInput({
                        minWidth: 60,
                        comfortZone: 30
                    });
                });
                $element.change(function() {
                    //console.log('change number!');
                    window.dispatchEvent(new Event('bloqs:change'));
                });
                break;
            case 'stringInput':
                $element = $('<input>').attr({
                    type: 'text',
                    'data-content-id': elementSchema.id,
                    'data-content-type': elementSchema.alias,
                    'data-placeholder-i18n': elementSchema.placeholder,
                    placeholder: translateBloq(lang, elementSchema.placeholder)
                }).val(elementSchema.value || translateBloq(lang, elementSchema.defaultValue));
                $element.on('keyup', function(evt) {
                    $(evt.currentTarget).autoGrowInput({
                        minWidth: 100,
                        comfortZone: 30
                    });
                });
                $element.change(function() {
                    $element.val(utils.validString($element.val()));
                    console.log('change String!');
                    window.dispatchEvent(new Event('bloqs:change'));
                });
                break;
            case 'charInput':
                $element = $('<input>').attr({
                    type: 'text',
                    'data-content-id': elementSchema.id,
                    'data-content-type': elementSchema.alias,
                    'data-placeholder-i18n': elementSchema.placeholder,
                    placeholder: translateBloq(lang, elementSchema.placeholder)
                }).val(elementSchema.value);
                $element.on('keyup', function(evt) {
                    $(evt.currentTarget).autoGrowInput({
                        minWidth: 100,
                        comfortZone: 30
                    });
                });
                $element.change(function() {
                    $element.val(utils.validChar($element.val()));
                    console.log('change Char!');
                    window.dispatchEvent(new Event('bloqs:change'));
                });
                break;
            case 'codeInput':
                $element = $('<input>').attr({
                    type: 'text',
                    'data-content-id': elementSchema.id,
                    'data-content-type': elementSchema.alias,
                    'data-placeholder-i18n': elementSchema.placeholder,
                    placeholder: translateBloq(lang, elementSchema.placeholder)
                }).val(elementSchema.value);
                $element.on('keyup', function(evt) {
                    $(evt.currentTarget).autoGrowInput({
                        minWidth: 100,
                        comfortZone: 30
                    });
                });
                $element.change(function() {
                    console.log('change SCinput!');
                    window.dispatchEvent(new Event('bloqs:change'));
                });
                break;
            case 'multilineCodeInput':
                $element = $('<textarea class="msd-elastic: \n;" ng-model="bar" cols="40" rows="1"></textarea>').attr({
                    'data-content-id': elementSchema.id,
                    'data-content-type': elementSchema.alias,
                    'name': elementSchema.id,
                    'data-placeholder-i18n': elementSchema.placeholder,
                    placeholder: translateBloq(lang, elementSchema.placeholder)
                }).val(elementSchema.value);
                setTimeout(function() {
                    $('[name="' + elementSchema.id + '"]').autogrow({
                        onInitialize: true
                    });
                }, 0);
                $element.change(function() {
                    console.log('change multilineCode!');
                    window.dispatchEvent(new Event('bloqs:change'));
                });
                break;
            case 'multilineCommentInput':
                $element = $('<textarea class="msd-elastic: \n;" ng-model="bar" cols="40" rows="1"></textarea>').attr({
                    'data-content-id': elementSchema.id,
                    'data-content-type': elementSchema.alias,
                    'name': elementSchema.id,
                    'data-placeholder-i18n': elementSchema.placeholder,
                    placeholder: translateBloq(lang, elementSchema.placeholder)
                }).val(elementSchema.value);
                setTimeout(function() {
                    $('[name="' + elementSchema.id + '"]').autogrow({
                        onInitialize: true
                    });
                }, 0);

                $element.keyup(function() {
                    bloqsUtils.delay(function() {
                        $element.val(utils.validComment($element.val()));
                    }, 1000);
                });

                $element.change(function() {
                    $element.val(utils.validComment($element.val()));
                    console.log('change multilineComment!');
                    window.dispatchEvent(new Event('bloqs:change'));
                });
                break;
            case 'varInput':
                $element = $('<input>').attr({
                    type: 'text',
                    'data-content-id': elementSchema.id,
                    'data-placeholder-i18n': elementSchema.placeholder,
                    placeholder: translateBloq(lang, elementSchema.placeholder)
                }).val(elementSchema.value);

                bloq.varInputs = [];
                bloq.varInputs.push($element);
                $element.addClass('var--input');
                $element.on('keyup', function(evt) {
                    $(evt.currentTarget).autoGrowInput({
                        minWidth: 100,
                        comfortZone: 30
                    });
                });
                //Transform the name to create valid function / variables names
                $element.keyup(function() {
                    bloqsUtils.delay(function() {
                        var name = utils.validName($element.val(), softwareArrays);
                        $element.val(name);
                        if (name) {
                            updateSoftVar(bloq, name);
                        } else {
                            removeSoftVar(bloq, name);
                        }
                    }, 1000);
                });

                $element.change(function() {
                    console.log('change varInput!');
                    window.dispatchEvent(new Event('bloqs:change'));
                });
                break;
            case 'bloqInput':
                $element = $('<div>').attr({
                    'data-connector-name': elementSchema.name,
                    'data-content-id': elementSchema.bloqInputId
                });
                $element.addClass('bloqinput');
                break;
            case 'headerText':
                $element = $('<h3>').html(elementSchema.value);
                $element.addClass('headerText');
                break;
            case 'descriptionText':
                $element = $('<p>').html(elementSchema.value);
                $element.addClass('descriptionText');
                break;
            default:
                throw 'elementSchema not defined: ' + elementSchema.alias;
        }

        return $element;
    };

    var translateBloqs = function(newLang) {
        if (newLang !== lang) {
            lang = newLang;
            var bloqElements, bloqPlaceholders, i18nKey;
            for (var currentBloq in bloqs) {

                bloqPlaceholders = bloqs[currentBloq].$bloq.find('[data-placeholder-i18n]');

                bloqElements = bloqs[currentBloq].$bloq.find('[data-i18n]');

                for (var i = 0; i < bloqPlaceholders.length; i++) {
                    i18nKey = bloqPlaceholders[i].getAttribute('data-placeholder-i18n');
                    bloqPlaceholders[i].placeholder = translateBloq(lang, i18nKey);
                }

                for (var j = 0; j < bloqElements.length; j++) {
                    i18nKey = bloqElements[j].getAttribute('data-i18n');
                    bloqElements[j].innerHTML = translateBloq(lang, i18nKey);
                }

            }
        }
    };

    var destroyFreeBloqs = function() {
        var uuid, bloq;
        for (uuid in bloqs) {
            bloq = bloqs[uuid];
            if (bloq.isConnectable()) {
                switch (bloq.bloqData.type) {
                    case 'statement':
                    case 'statement-input':
                        if (!connectors[bloq.connectors[0]].connectedTo) {
                            removeBloq(uuid);
                        }
                        break;
                    case 'output':
                        if (!IOConnectors[bloq.IOConnectors[0]].connectedTo) {
                            removeBloq(uuid);
                        }
                        break;
                    case 'group':
                        break;
                    default:
                        throw 'its free? ' + bloq.bloqData.type;
                }
            }
        }
    };

    /**
     * Get bloqs that are not connected
     *
     */
    var getFreeBloqs = function() {
        var bloq,
            result = [],
            bloqGroup,
            tempBloq,
            connectedConnector;
        for (var uuid in bloqs) {
            bloq = bloqs[uuid];
            if (bloq.isConnectable()) {
                switch (bloq.bloqData.type) {
                    case 'statement':
                    case 'statement-input':
                        if (!connectors[bloq.connectors[0]].connectedTo) {
                            bloqGroup = [bloq.getBloqsStructure()];
                            connectedConnector = connectors[bloq.connectors[1]].connectedTo;
                            while (connectedConnector) {
                                tempBloq = utils.getBloqByConnectorUuid(connectedConnector, bloqs, connectors);
                                bloqGroup.push(tempBloq.getBloqsStructure());
                                connectedConnector = connectors[tempBloq.connectors[1]].connectedTo;
                            }
                            result.push({
                                position: bloq.$bloq.position(),
                                bloqGroup: bloqGroup
                            });
                        }
                        break;
                    case 'output':
                        if (!IOConnectors[bloq.IOConnectors[0]].connectedTo) {
                            bloqGroup = [bloq.getBloqsStructure()];
                            result.push({
                                position: bloq.$bloq[0].getBoundingClientRect(),
                                bloqGroup: bloqGroup
                            });
                        }
                        break;
                    case 'group':
                        break;
                    default:
                        throw 'its free? ' + bloq.bloqData.type;
                }
            }
        }
        return result;
    };

    var updateDropdowns = function() {
        var key;
        for (key in softwareArrays) {
            updateDropdown(key);
        }
    };

    var updateDropdown = function(softwareArrayKey) {
        var $element, tempValue;
        $('select[data-dropdownContent="' + softwareArrayKey + '"]').each(function(index, element) {
            $element = $(element);
            tempValue = $element.attr('data-value');
            bloqsUtils.drawDropdownOptions($element, softwareArrays[softwareArrayKey]);
            if (tempValue) {
                $element.val(tempValue);
            }
        });
    };

    var translateBloq = function(lang, key) {
        return bloqsLanguages.texts[lang][key] || bloqsLanguages.texts['en-GB'][key] || bloqsLanguages.texts['es-ES'][key] || key;
    };

    // Block Constructor
    var Bloq = function Bloq(params) {
        this.uuid = 'bloq:' + utils.generateUUID();

        $field = params.$field || $field;

        this.bloqData = params.bloqData;
        this.componentsArray = params.componentsArray;
        this.connectors = [];
        this.IOConnectors = [];

        var enable = false,
            connectable,
            that = this;

        this.collapseGroupContent = function() {

            var $fieldContent = that.$bloq.children('.field--content');
            //$fieldContent = $(e.currentTarget).parent().find('.field--content');
            $fieldContent.toggleClass('field--collapsed');
            that.connectable = !that.connectable;
            $fieldContent.parent().toggleClass('collapsed--field');
        };

        this.enable = function(onlyParent) {
            if (!enable) {
                this.$bloq.removeClass('disabled');
                //console.log('activamos', this.uuid, this.bloqData.name);
                if (this.bloqData.content && this.bloqData.content[0]) {
                    for (var i = 0; i < this.bloqData.content[0].length; i++) {
                        if (this.bloqData.content[0][i].alias === 'bloqInput') {
                            var uuid;
                            for (var j = 0; j < this.IOConnectors.length; j++) {
                                uuid = this.IOConnectors[j];
                                if ((IOConnectors[uuid].data.type === 'connector--input') && IOConnectors[uuid].connectedTo) {
                                    utils.getBloqByConnectorUuid(IOConnectors[uuid].connectedTo, bloqs, IOConnectors).enable();
                                }
                            }
                        }
                    }
                }

                enable = true;

                if (this.connectors[2] && !onlyParent) {
                    var connector = connectors[this.connectors[2]].connectedTo,
                        tempBloq;
                    while (connector) {
                        tempBloq = utils.getBloqByConnectorUuid(connector, bloqs, connectors);
                        tempBloq.enable();
                        connector = connectors[tempBloq.connectors[1]].connectedTo;
                    }
                }
            }
        };

        this.disable = function(onlyParent) {
            this.$bloq.addClass('disabled');
            if (enable) {

                //console.log('activamos', this.uuid, this.bloqData.name);
                if (this.bloqData.content && this.bloqData.content[0]) {
                    for (var i = 0; i < this.bloqData.content[0].length; i++) {
                        switch (this.bloqData.content[0][i].alias) {
                            case 'bloqInput':
                                //disable the inputs bloqs inside in 1 level
                                var uuid;
                                for (var j = 0; j < this.IOConnectors.length; j++) {
                                    uuid = this.IOConnectors[j];
                                    if ((IOConnectors[uuid].data.type === 'connector--input') && IOConnectors[uuid].connectedTo) {
                                        utils.getBloqByConnectorUuid(IOConnectors[uuid].connectedTo, bloqs, IOConnectors).disable();
                                    }
                                }
                                break;
                            default:
                        }
                    }
                }

                enable = false;

                if (this.connectors[2] && !onlyParent) {
                    var connector = connectors[this.connectors[2]].connectedTo,
                        tempBloq;
                    while (connector) {
                        tempBloq = utils.getBloqByConnectorUuid(connector, bloqs, connectors);
                        tempBloq.disable();
                        connector = connectors[tempBloq.connectors[1]].connectedTo;
                    }
                }
            }
        };

        this.itsEnabled = function() {
            return enable;
        };

        this.doConnectable = function() {
            if (!connectable) {
                // console.log('make them connectable', this.uuid, this.bloqData.name);
                if (this.bloqData.content && this.bloqData.content[0]) {
                    for (var i = 0; i < this.bloqData.content[0].length; i++) {
                        if (this.bloqData.content[0][i].alias === 'bloqInput') {
                            var uuid;
                            for (var j = 0; j < this.IOConnectors.length; j++) {
                                uuid = this.IOConnectors[j];
                                if ((IOConnectors[uuid].data.type === 'connector--input') && IOConnectors[uuid].connectedTo) {
                                    utils.getBloqByConnectorUuid(IOConnectors[uuid].connectedTo, bloqs, IOConnectors).doConnectable();
                                }
                            }
                        }
                    }
                }
                if (this.connectors[2]) {
                    var connector = connectors[this.connectors[2]].connectedTo,
                        tempBloq;
                    while (connector) {
                        tempBloq = utils.getBloqByConnectorUuid(connector, bloqs, connectors);
                        tempBloq.doConnectable();
                        connector = connectors[tempBloq.connectors[1]].connectedTo;
                    }
                }
                connectable = true;
                this.$bloq[0].dispatchEvent(new Event('bloq:connectable'));
            }
        };

        this.doNotConnectable = function() {
            connectable = false;
        };

        this.isConnectable = function() {
            return connectable;
        };

        this.itsFree = function() {
            return (this.$bloq.closest('.bloq--group').length === 0);
        };

        //creation
        this.$bloq = $('<div>').attr({
            'data-bloq-id': this.uuid,
            tabIndex: 0
        });

        this.$bloq.addClass('bloq bloq--' + this.bloqData.type + ' ' + this.bloqData.bloqClass);

        bloqs[this.uuid] = this;

        //this.disable();
        this.doNotConnectable();

        switch (this.bloqData.type) {
            case 'statement-input':
                this.$bloq.append('<div class="bloq--statement-input__header"></div><div class="bloq--extension"><div class="bloq--extension__content"></div> <div class="bloq--extension--end"></div></div>');
                this.$contentContainer = this.$bloq.find('.bloq--statement-input__header');
                this.$contentContainerDown = this.$bloq.find('.bloq--extension--end');
                //this.$bloq.attr('draggable', true);
                buildContent(this);
                this.$bloq[0].addEventListener('mousedown', bloqMouseDown);
                buildConnectors(params.bloqData.connectors, this);
                this.$contentContainer.children().children().not('.connector.connector--offline').first().addClass('bloq__inner--first');
                this.$contentContainer.children().children().not('.connector.connector--offline').last().addClass('bloq__inner--last');
                this.$contentContainer.children().not('.connector.connector--offline').last().addClass('bloq__inner--last');
                this.$contentContainerDown.children().not('.connector.connector--offline').first().addClass('bloq__inner--first');
                this.$contentContainerDown.children().not('.connector.connector--offline').last().addClass('bloq__inner--last');
                break;
            case 'statement':
                this.$bloq.append('<div class="bloq--fixed">');
                this.$contentContainer = this.$bloq.find('.bloq--fixed');
                //this.$bloq.attr('draggable', true);
                buildContent(this);
                this.$bloq[0].addEventListener('mousedown', bloqMouseDown);
                buildConnectors(params.bloqData.connectors, this);
                this.$bloq.children().children().not('.connector.connector--offline').first().addClass('bloq__inner--first');
                this.$bloq.children().children().not('.connector.connector--offline').last().addClass('bloq__inner--last');
                break;
            case 'output':
                this.$contentContainer = this.$bloq;
                //this.$bloq.attr('draggable', true);
                buildContent(this);
                this.$bloq[0].addEventListener('mousedown', bloqMouseDown);
                buildConnectors(params.bloqData.connectors, this);
                this.$bloq.children().not('.connector.connector--offline').first().addClass('bloq__inner--first');
                this.$bloq.children().not('.connector.connector--offline').last().addClass('bloq__inner--last');
                break;
            case 'group':
                this.$bloq.append('<div class="field--header"><button class="btn btn--collapsefield"></button><h3 data-i18n="' + this.bloqData.headerText + '">' + translateBloq(lang, this.bloqData.headerText) + '</h3></div><div class="field--content"><p data-i18n="' + this.bloqData.descriptionText + '">' + translateBloq(lang, this.bloqData.descriptionText) + '</p><div class="bloq--extension--info" data-i18n="drag-bloq" > ' + translateBloq(lang, 'drag-bloq') + '</div><div class="bloq--extension__content"></div></div>');

                buildConnectors(params.bloqData.connectors, this);
                this.$bloq.find('.connector--root').addClass('connector--root--group');
                this.$bloq.find('.field--header .btn').on('click', this.collapseGroupContent);
                this.$bloq.find('.field--header h3').on('click', this.collapseGroupContent);
                break;
            default:
                throw 'bloqData ' + this.bloqData.type + 'not defined in bloq construction';
        }

        if (this.bloqData.createDynamicContent) {
            var name = utils.validName(this.$bloq.find('input.var--input').val());
            if (name) {
                updateSoftVar(this, name);
            } else {
                removeSoftVar(this, name);
            }
        }

        this.getIOConnectorUuidByContentId = function(contentId) {
            var found = false,
                i = 0,
                result = null;

            while (!found && (i < this.IOConnectors.length)) {
                if (IOConnectors[this.IOConnectors[i]].contentId === contentId) {
                    found = true;
                    result = this.IOConnectors[i];
                }
                i++;
            }
            return result;
        };

        /**
         * Get the bloq's code, substituting each input's value
         * @return {[type]} code            [description]
         */
        this.getCode = function(previousCode) {
            var code = this.bloqData.code;
            var childBloq, childConnectorId;
            var elementTags = _.without(_.pluck(this.bloqData.content[0], 'id'), undefined);
            var childrenTags = _.without(_.pluck(this.bloqData.content[0], 'bloqInputId'), undefined);
            var value = '',
                type = '';
            var connectionType = '';

            elementTags.forEach(function(elem) {
                var element = this.$contentContainer.find('> [data-content-id="' + elem + '"]');
                if (element.length === 0) {
                    element = this.$contentContainer.find('[data-content-id="' + elem + '"]');
                }
                value = element.val() || '';
                //hardcoded!!
                for (var j = 0; j < this.componentsArray.sensors.length; j++) {

                    if (value === this.componentsArray.sensors[j].name) {
                        type = this.componentsArray.sensors[j].type;
                        if (type === 'analog') {
                            value = 'analogRead(' + this.componentsArray.sensors[j].pin.s + ')';
                        } else if (type === 'digital') {
                            value = 'digitalRead(' + this.componentsArray.sensors[j].pin.s + ')';
                        } else if (type === 'LineFollower') { // patch. When the new Web2Board is launched with float * as return, remove this
                            value = '(float *)' + this.componentsArray.sensors[j].name + '.read()';

                        } else {
                            value = this.componentsArray.sensors[j].name + '.read()';
                        }
                        code = code.replace(new RegExp('{' + elem + '.type}', 'g'), value);
                    }

                }
                if (element.attr('data-content-type') === 'stringInput') {
                    value = utils.validString(value);
                } else if (element.attr('data-content-type') === 'charInput') {
                    value = utils.validChar(value);
                } else if (element.attr('data-content-type') === 'multilineCommentInput') {
                    value = utils.validComment(value);
                }
                var valueWithoutAsterisk = value.replace(' *', '');
                code = code.replace(new RegExp('{' + elem + '}.withoutAsterisk', 'g'), valueWithoutAsterisk);
                code = code.replace(new RegExp('{' + elem + '}', 'g'), value);
            }.bind(this));

            var bloqInputConnectors = utils.getInputsConnectorsFromBloq(IOConnectors, bloqs, this);
            if (childrenTags.length > 0) {
                // search for child bloqs:
                for (var k = 0; k < bloqInputConnectors.length; k++) {

                    value = '';
                    connectionType = '';
                    type = '';
                    var a = IOConnectors[bloqInputConnectors[k]];
                    if (a) {
                        childConnectorId = a.connectedTo;
                        if (childConnectorId !== null) {
                            childBloq = utils.getBloqByConnectorUuid(childConnectorId, bloqs, IOConnectors);
                            value = childBloq.getCode();
                            type = childBloq.bloqData.returnType;
                        }
                        if (type.type === 'fromDynamicDropdown') {
                            connectionType = utils.getFromDynamicDropdownType(childBloq || this, type.idDropdown, type.options, softwareArrays, this.componentsArray);
                        } else if (type.type === 'fromDropdown') {
                            connectionType = utils.getTypeFromBloq(childBloq || this, bloqs, IOConnectors, softwareArrays);
                        } else {
                            connectionType = type.value;
                            if (connectionType === 'string') {
                                connectionType = 'String';
                            }
                        }
                    }
                    if (connectionType === undefined) {
                        connectionType = '';
                    }
                    code = code.replace(new RegExp('{' + childrenTags[k] + '.connectionType}', 'g'), connectionType);
                    code = code.replace(new RegExp('{' + childrenTags[k] + '}', 'g'), value);

                }
            }
            //search for regular expressions:
            var reg = /(.*)\?(.*):(.*)/g;
            if (reg.test(code)) {
                code = eval(code); // jshint ignore:line
            }
            var children = [];
            if (this.connectors[2]) {
                value = '';
                childConnectorId = connectors[this.connectors[2]].connectedTo;
                if (childConnectorId) {
                    childBloq = utils.getBloqByConnectorUuid(childConnectorId, bloqs, connectors);
                    var branchConnectors = utils.getBranchsConnectorsNoChildren(childBloq.uuid, connectors, bloqs);

                    branchConnectors.forEach(function(branchConnector) {
                        if (utils.itsInsideAConnectorRoot(bloqs[connectors[branchConnector].bloqUuid], bloqs, connectors)) {
                            var bloqId = connectors[branchConnector].bloqUuid;
                            if (bloqId !== children[children.length - 1]) {
                                children.push(bloqId);
                            }
                        }
                    });
                }
                children.forEach(function(elem) {
                    value += bloqs[elem].getCode();
                });
                // if (children.length >= 1) {
                //     for (i in children) {
                //         value += bloqs[children[i]].getCode();
                //     }
                // }
                code = code.replace(new RegExp('{STATEMENTS}', 'g'), value);
            }
            if (code.indexOf('{CLASS-OUTSIDE}') >= 0) {
                var rootParentName = utils.getClassName(this, bloqs, connectors);
                if (rootParentName) {
                    code = code.replace(new RegExp('{CLASS-OUTSIDE}', 'g'), rootParentName);
                }
                code = code.replace(new RegExp('{CLASS-OUTSIDE}', 'g'), '');
            }
            if (previousCode === undefined) {
                previousCode = '';
            } else { //the previousCode is always (from now) inserted after the void setup(){ string
                code = bloqsUtils.splice(code, code.indexOf('{') + 1, 0, previousCode);
            }
            if (!this.itsEnabled()) {
                //TODO: search highest parent disabled and add the comment characters
                // code = '/*' + code + '*/';
                code = '';
            }
            return code;
        };

        this.getBloqsStructure = function(fullStructure) {
            var result,
                tempBloq;

            if (fullStructure) {
                result = _.cloneDeep(this.bloqData);
            } else {
                result = {
                    name: this.bloqData.name,
                    content: [
                        []
                    ]
                };
            }
            result.enable = this.itsEnabled();

            var rootConnector = this.connectors[2];
            if (rootConnector) {
                result.childs = [];
                var connectedConnector = connectors[rootConnector].connectedTo;
                while (connectedConnector) {
                    tempBloq = utils.getBloqByConnectorUuid(connectedConnector, bloqs, connectors);
                    result.childs.push(tempBloq.getBloqsStructure(fullStructure));
                    connectedConnector = connectors[tempBloq.connectors[1]].connectedTo;
                }
            }

            var tempObject, value, selectedValue, attributeValue;
            if (this.bloqData.content[0]) {

                for (var i = 0; i < this.bloqData.content[0].length; i++) {
                    tempObject = null;
                    switch (this.bloqData.content[0][i].alias) {
                        case 'varInput':
                        case 'stringInput':
                        case 'numberInput':
                        case 'multilineCodeInput':
                        case 'multilineCommentInput':
                        case 'codeInput':
                        case 'charInput':
                            value = this.$bloq.find('[data-content-id="' + this.bloqData.content[0][i].id + '"]').val();
                            if (value) {
                                tempObject = {
                                    alias: this.bloqData.content[0][i].alias,
                                    id: this.bloqData.content[0][i].id,
                                    value: value
                                };
                            }
                            break;
                        case 'bloqInput':
                            //get the inputs bloqs inside in 1 level
                            var uuid,
                                connectedBloq;
                            uuid = this.getIOConnectorUuidByContentId(this.bloqData.content[0][i].bloqInputId);
                            if ((IOConnectors[uuid].data.type === 'connector--input') && IOConnectors[uuid].connectedTo) {
                                connectedBloq = utils.getBloqByConnectorUuid(IOConnectors[uuid].connectedTo, bloqs, IOConnectors);
                                tempObject = {
                                    alias: this.bloqData.content[0][i].alias,
                                    bloqInputId: this.bloqData.content[0][i].bloqInputId,
                                    value: connectedBloq.getBloqsStructure(fullStructure)
                                };
                            }

                            break;
                        case 'dynamicDropdown':
                            attributeValue = this.$bloq.find('select[data-content-id="' + this.bloqData.content[0][i].id + '"][data-dropdowncontent="' + this.bloqData.content[0][i].options + '"]').attr('data-value');
                            selectedValue = this.$bloq.find('select[data-content-id="' + this.bloqData.content[0][i].id + '"][data-dropdowncontent="' + this.bloqData.content[0][i].options + '"]').val();
                            //only software Vars get value from val(), hardware, use attribute or val()
                            var variableType = this.bloqData.content[0][i].options;
                            var itsSoftwareValue = Object.keys(softwareArrays).indexOf(variableType);

                            if (itsSoftwareValue !== -1) {
                                value = selectedValue;
                            } else {
                                value = attributeValue || selectedValue;
                            }

                            // console.log('val', attributeValue, selectedValue);
                            if (value) {
                                tempObject = {
                                    alias: this.bloqData.content[0][i].alias,
                                    id: this.bloqData.content[0][i].id,
                                    value: value
                                };
                            }
                            break;
                        case 'staticDropdown':
                            //value = this.$bloq.find('select[data-content-id="' + this.bloqData.content[0][i].id + '"]').val();
                            value = this.$contentContainer.find('> select[data-content-id="' + this.bloqData.content[0][i].id + '"]').val();
                            if (value) {
                                tempObject = {
                                    alias: this.bloqData.content[0][i].alias,
                                    id: this.bloqData.content[0][i].id,
                                    value: value
                                };
                            }
                            break;
                        case 'text':
                            //we dont catch this field
                            break;
                        default:
                            throw 'I dont know how to get the structure from this contentType :( ' + this.bloqData.content[0][i].alias;
                    }
                    if (tempObject) {
                        if (fullStructure) {
                            result.content[0][i].value = tempObject.value;
                        } else {
                            result.content[0].push(tempObject);
                        }
                    }

                }
            }

            return result;
        };

        return this;
    };


    var buildBloqWithContent = function(data, componentsArray, schemas, $field) {

        var tempBloq,
            originalBloqSchema = schemas[data.name],
            bloqSchema,
            lastBottomConnector,
            tempNodeBloq,
            tempOutputBloq,
            inputConnectorUuid,
            $dropContainer,
            i;


        if (!originalBloqSchema) {
            console.error('no original schema', data);
        }
        //fill the schema with content
        bloqSchema = bloqsUtils.fillSchemaWithContent(originalBloqSchema, data);
        tempBloq = new Bloq({
            bloqData: bloqSchema,
            componentsArray: componentsArray,
            $field: $field
        });

        if (data.content) {
            for (i = 0; i < data.content[0].length; i++) {
                if (data.content[0][i].alias === 'bloqInput') {
                    inputConnectorUuid = tempBloq.getIOConnectorUuidByContentId(data.content[0][i].bloqInputId);
                    $dropContainer = tempBloq.$bloq.find('[data-connector-id="' + inputConnectorUuid + '"]').first();
                    //console.debug($dropContainer);
                    //inputConnectorUuid = $dropContainer.attr('data-connector-id');
                    //console.debug(inputConnectorUuid);
                    tempOutputBloq = buildBloqWithContent(data.content[0][i].value, componentsArray, schemas, $field);
                    tempOutputBloq.$bloq.addClass('nested-bloq');
                    //Connections in bloqInput
                    //logical
                    if (!IOConnectors[inputConnectorUuid]) {
                        console.debug('not connector?', originalBloqSchema);
                    }
                    IOConnectors[inputConnectorUuid].connectedTo = tempOutputBloq.IOConnectors[0];
                    IOConnectors[tempOutputBloq.IOConnectors[0]].connectedTo = inputConnectorUuid;
                    //visual
                    //$dropContainer[0].appendChild(tempOutputBloq.$bloq[0])
                    $dropContainer.append(tempOutputBloq.$bloq);
                }
            }
        }

        if (data.childs) {

            $dropContainer = tempBloq.$bloq.find('.bloq--extension__content');
            lastBottomConnector = tempBloq.connectors[2];

            if (data.childs.length > 0) {
                tempBloq.$bloq.addClass('with--content');
            }
            for (i = 0; i < data.childs.length; i++) {
                tempNodeBloq = buildBloqWithContent(data.childs[i], componentsArray, schemas, $field);
                //Connections in statement
                //logical
                connectors[lastBottomConnector].connectedTo = tempNodeBloq.connectors[0];
                connectors[tempNodeBloq.connectors[0]].connectedTo = lastBottomConnector;
                lastBottomConnector = tempNodeBloq.connectors[1];

                //visual
                tempNodeBloq.$bloq.addClass('inside-bloq');
                $dropContainer.append(tempNodeBloq.$bloq);
            }
        }

        if (data.enable) {
            tempBloq.enable(true);
        } else {

            tempBloq.disable();
        }
        if (tempBloq.bloqData.createDynamicContent) {
            updateSoftVar(tempBloq);
        }

        return tempBloq;
    };

    exports.Bloq = Bloq;
    exports.updateSoftVar = updateSoftVar;
    exports.connectors = connectors;
    exports.IOConnectors = IOConnectors;
    exports.bloqs = bloqs;
    exports.removeBloq = removeBloq;
    exports.translateBloqs = translateBloqs;
    exports.getFreeBloqs = getFreeBloqs;
    exports.destroyFreeBloqs = destroyFreeBloqs;
    exports.updateDropdowns = updateDropdowns;
    exports.setOptions = setOptions;
    exports.buildBloqWithContent = buildBloqWithContent;

    return exports;

})(window.bloqs = window.bloqs || {}, _, bloqsUtils, bloqsLanguages, undefined);