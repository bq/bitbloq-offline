'use strict';
(function(bloqsUtils, _) {



    var isNumeric = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };
    /**
     * If the param is not a number, we set it to ''
     * @param  number
     */

    var validNumber = function(number) {
        var temp = number;
        var removedChar = 0;
        var i = 0;
        if (number[0] === '-') {
            temp = number.substring(1);
            i = 1;
        }
        // var count = occurrencesInString(number, '.', false);
        var index = number.indexOf('.');
        while (i < number.length) {
            if ((number[i] === '.' && index < i) || (!isNumeric(number[i]) && number[i] !== '.')) {
                number = number.slice(0, i) + number.slice(i + 1, number.length);
                removedChar += 1;
            } else {
                i++;
            }
        }

        return {
            value: number,
            removedChar: removedChar
        };
    };

    var getCaretPosition = function(el) {
        if (el.selectionStart) {
            return el.selectionStart;
        } else if (document.selection) {
            el.focus();

            var r = document.selection.createRange();
            if (r === null) {
                return 0;
            }

            var re = el.createTextRange(),
                rc = re.duplicate();
            re.moveToBookmark(r.getBookmark());
            rc.setEndPoint('EndToStart', re);

            return rc.text.length;
        }
        return 0;
    };

    var setCaretPosition = function(ctrl, pos) {
        if (ctrl.setSelectionRange) {
            ctrl.focus();
            ctrl.setSelectionRange(pos, pos);
        } else if (ctrl.createTextRange) {
            var range = ctrl.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    };

    /**
     * If the param has non escaped characters, escape them
     * @param  value
     */
    var validString = function(value) {
        value = value.replace(/(^|\b|[^\\])(\\\\)*\\$/g, '$&\\');
        value = value.replace(/(^|\b|[^\\])((\\\\)*\")/g, '$1\\$2');
        value = value.replace(/(^|\b|[^\\])((\\\\)*\/\*)/g, '$1\\$2');
        value = value.replace(/(^|\b|[^\\])((\\\\)*\/\/)/g, '$1\\$2');
        value = value.replace(/\$\'/g, '\$\\\'');
        value = value.replace(/\$\&/g, '\$\\\&');

        return value;
    };

    /**
     * Return the first valid char from a string
     * @param  value
     */
    var validChar = function(value) {
        value = value.replace(/\$*/g, '');
        if (/^\\/g.test(value)) {
            if (/^\\([0-7]{1,3}|x[0-9A-F]{1,2}|u[0-9A-F]{1,4})/g.test(value)) {
                value = value.match(/^\\([0-7]{1,3}|x[0-9A-F]{1,2}|u[0-9A-F]{1,4})/g)[0];
            } else if (/^\\[bfnrtv0']/g.test(value)) {
                value = value.substring(0, 2);
            } else if (/^\\[%#!|"@~&?\/()=^`[+\]*,{};.:-]/g.test(value)) {
                value = value.charAt(1);
            } else {
                value = '\\\\';
            }
        } else if (/^(\')/g.test(value)) {
            value = '\\\'';
        } else {
            value = value.charAt(0);
        }

        return value;
    };

    /**
     * If the param has a comment end, omit it
     * @param  value
     */
    var validComment = function(value) {
        value = value.replace(/\*\//g, '');
        value = value.replace(/\$\'/g, '\$\\\'');
        value = value.replace(/\$\&/g, '\$\\\&');

        return value;
    };

    /**
     * Transform a function or variable name to make it "legal" in Arduino coding language
     * @param  name
     */
    var validName = function(name, softwareArrays) {
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
            //Remove all diacritics
            name = removeDiacritics(name);
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
            var counter = [];
            if (softwareArrays) {
                var softwareVars = softwareArrays.softwareVars.concat(softwareArrays.voidFunctions, softwareArrays.returnFunctions);
                for (j = 0; j < softwareVars.length; j++) {
                    if (name === softwareVars[j].name) {
                        counter.push(j);

                    }
                }
                if (counter.length === 2) {
                    j = counter[1];
                    console.log('name === softwareVars[j].name', name === softwareVars[j].name, name, softwareVars[j].name);
                    if (isNaN(name[name.length - 1])) {
                        name += '1';
                    } else {
                        i = 0;
                        var number, it;
                        while (isNaN(name[i])) {
                            it = i;
                            i++;
                        }
                        number = parseInt(name.substring(it + 1, name.length), 10);
                        number += 1;
                        name = name.substring(0, it + 1);
                        name += number.toString();
                    }
                }
            }
        }
        return name;
    };

    var appendArrayInOneTime = function($container, $items) {
        var rawArray = $.map(
            $items,
            function(value) {

                // Return the unwrapped version. This will return
                // the underlying DOM nodes contained within each
                // jQuery value.
                return (value.get());

            }
        );

        // Add the raw DOM array to the current collection.
        $container.append(rawArray);
    };

    var generateUUID = function() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };
    var getNumericStyleProperty = function(style, prop) {
        return parseInt(style.getPropertyValue(prop), 10);
    };

    var drawDropdownOptions = function($element, arrayOptions) {
        var $tempElement, i,
            $items = [];

        $element.html('');
        for (i = 0; i < arrayOptions.length; i++) {
            $tempElement = $('<option>').attr({
                'data-var-id': arrayOptions[i].id,
                value: arrayOptions[i].name,
                'data-reference': arrayOptions[i].uid
            }).html(arrayOptions[i].name);
            $items.push($tempElement);
        }
        appendArrayInOneTime($element, $items);
    };

    var itsOver = function(dragConnector, dropConnector, margin) {
        margin = margin || 0;
        var dragConnectorOffset = dragConnector.offset(),
            dropConnectorOffset = dropConnector.offset();
        return dragConnectorOffset.left < (dropConnectorOffset.left + dropConnector[0].clientWidth + margin) && (dragConnectorOffset.left + dragConnector[0].clientWidth) > (dropConnectorOffset.left - margin) && dragConnectorOffset.top < (dropConnectorOffset.top + dropConnector[0].clientHeight + margin) && (dragConnectorOffset.top + dragConnector[0].clientHeight) > (dropConnectorOffset.top - margin);
    };

    var sameConnectionType = function(dragBloq, dropBloq, dropConnectorAcceptType, bloqs, IOConnectors, softwareArrays) {
        var dragConnectorType = getTypeFromBloq(dragBloq, bloqs, IOConnectors, softwareArrays);
        if (typeof(dropConnectorAcceptType) === 'object') {
            dropConnectorAcceptType = getTypeFromDynamicDropdown(dropBloq, dropConnectorAcceptType, softwareArrays);
        }
        return (dragConnectorType === 'all') || (dropConnectorAcceptType === 'all') || (dragConnectorType === dropConnectorAcceptType);
    };

    var getTypeFromDynamicDropdown = function(bloq, typeObject, softwareArrays) {
        var attributeValue = bloq.$bloq.find('select[data-content-id="' + typeObject.idDropdown + '"][data-dropdowncontent="' + typeObject.options + '"]').attr('data-value');
        var selectedValue = bloq.$bloq.find('select[data-content-id="' + typeObject.idDropdown + '"][data-dropdowncontent="' + typeObject.options + '"]').val();
        var selectedVarNameOnDropdown = attributeValue || selectedValue;

        if (!selectedVarNameOnDropdown) {
            //rare bug, maybe the timeout, cant get the value of a options create disabled and enabled later
            //selectedVarNameOnDropdown = bloq.$bloq.find('select[data-content-id="' + typeObject.idDropdown + '"][data-dropdowncontent="' + typeObject.options + '"] option:first-child').val();
            ////or maybe a empty set var bloq :D
            //throw 'check this!';
        }

        var varData = _.find(softwareArrays[typeObject.options], {
            name: selectedVarNameOnDropdown
        });
        if (varData) {
            if (typeObject.pointer) {
                varData.type = varData.type.replace(' *', '');
            }
            return varData.type;
        }
        return '';

    };
    var getFromDynamicDropdownType = function(bloq, idDropdown, options, softwareArrays, componentsArray) {
        var attributeValue = bloq.$bloq.find('select[data-content-id="' + idDropdown + '"][data-dropdowncontent="' + options + '"]').attr('data-value');
        var selectedValue = bloq.$bloq.find('select[data-content-id="' + idDropdown + '"][data-dropdowncontent="' + options + '"]').val();
        var varName = attributeValue || selectedValue;

        var softVar = _.find(softwareArrays[options], {
            name: varName
        });
        if (!softVar) {
            for (var j in componentsArray.sensors) {
                if (componentsArray.sensors[j].name === varName) {
                    if (componentsArray.sensors[j].type === 'Joystick' || componentsArray.sensors[j].type === 'LineFollower') {
                        return 'float *';
                    } else if (componentsArray.sensors[j].type === 'ButtonPad') {
                        return 'char';
                    } else {
                        return 'float';
                    }
                }
            }
        }
        if (softVar) {
            if (bloq.bloqData && bloq.bloqData.returnType && bloq.bloqData.returnType.pointer) {
                softVar.type = softVar.type.replace(' *', '');
            }
            return softVar.type;
        }
        return '';
    };

    /**
     * Get the extreme of the tree, the root or the leaf
     * @param  bloqUuid
     * @param  connectors
     * @param  bloqs
     * @param  connectorPosition 0: tipical position of the top-connector, 1: bottom-connector
     * @return
     */
    var getTreeExtreme = function(bloqUuid, bloqs, connectors, connectorPosition) {
        if (connectors[bloqs[bloqUuid].connectors[connectorPosition]].connectedTo) {
            return getTreeExtreme(connectors[connectors[bloqs[bloqUuid].connectors[connectorPosition]].connectedTo].bloqUuid, bloqs, connectors, connectorPosition);
        } else {
            return bloqs[bloqUuid].connectors[connectorPosition];
        }
    };
    /**
     * From a bloq, this function get the bottom Connector of the branch.
     * @param  {[type]} bloqUuid   [description]
     * @param  {[type]} connectors [description]
     * @param  {[type]} bloqs      [description]
     * @return {[type]}            [description]
     */
    var getLastBottomConnectorUuid = function(bloqUuid, bloqs, connectors) {
        return getTreeExtreme(bloqUuid, bloqs, connectors, 1);
    };
    /**
     * From a bloq, this function get the top Connector of the branch.
     * @param  {[type]} bloqUuid   [description]
     * @param  {[type]} connectors [description]
     * @param  {[type]} bloqs      [description]
     * @return {[type]}            [description]
     */
    var getFirstTopConnectorUuid = function(bloqUuid, bloqs, connectors) {
        return getTreeExtreme(bloqUuid, bloqs, connectors, 0);
    };
    /**
     * Get the output connector from a output bloq
     * @param  bloq
     * @param  IOConnectors
     * @return              the connector
     */
    var getOutputConnector = function(bloq, IOConnectors) {
        var i = 0,
            outputConnector = null;
        while (!outputConnector && (i < bloq.IOConnectors.length)) {
            if (IOConnectors[bloq.IOConnectors[i]].data.type === 'connector--output') {
                outputConnector = IOConnectors[bloq.IOConnectors[i]];
            }
            i++;
        }
        if (!outputConnector) {
            throw 'outputBloq has no connector-output';
        } else {
            return outputConnector;
        }
    };
    /**
     * Receive a bloq, and if is top go to the bottom connector until the end, and gice the size
     * @param  {[type]} bloqUuid   [description]
     * @param  {[type]} bloqIsTop  [description]
     * @param  {[type]} bloqs      [description]
     * @param  {[type]} connectors [description]
     * @return {[type]}            [description]
     */
    var getNodesHeight = function(bloqUuid, bloqIsTop, bloqs, connectors) {
        var bloq = bloqs[bloqUuid];
        var connectorPosition;
        if (bloqIsTop) {
            connectorPosition = 1;
        } else {
            connectorPosition = 0;
        }
        if (connectors[bloq.connectors[connectorPosition]].connectedTo) {
            return bloq.$bloq.outerHeight(true) + getNodesHeight(connectors[connectors[bloq.connectors[connectorPosition]].connectedTo].bloqUuid, bloqIsTop, bloqs, connectors);
        } else {
            return bloq.$bloq.outerHeight(true);
        }
    };
    /**
     * You can give any node of the tree, and return the size in px
     * @param  {[type]} bloqUuid   [description]
     * @param  {[type]} bloqs      [description]
     * @param  {[type]} connectors [description]
     * @return {[type]}            [description]
     */
    var getTreeHeight = function(bloqUuid, bloqs, connectors) {
        var bloq = bloqs[bloqUuid];
        var topConnectorUuid = connectors[bloq.connectors[0]].connectedTo,
            bottomConnectorUuid = connectors[bloq.connectors[1]].connectedTo;
        var height = bloq.$bloq.outerHeight(true);
        if (topConnectorUuid) {
            height += getNodesHeight(connectors[topConnectorUuid].bloqUuid, false, bloqs, connectors);
        }
        if (bottomConnectorUuid) {
            height += getNodesHeight(connectors[bottomConnectorUuid].bloqUuid, true, bloqs, connectors);
        }
        return height;
    };
    /**
     * draw in console a branch
     * @param  {[type]} bloqs            [description]
     * @param  {[type]} connectors       [description]
     * @param  {[type]} topConnectorUuid [description]
     * @return {[type]}                  [description]
     */
    var drawBranch = function(bloqs, connectors, topConnectorUuid) {
        var branchUuid = connectors[topConnectorUuid].bloqUuid;
        console.log('          ******* - branch - *********', branchUuid);
        console.log('          connector--top:', bloqs[branchUuid].connectors[0], 'connectedTo', connectors[bloqs[branchUuid].connectors[0]].connectedTo);
        console.log('          connector--bottom:', bloqs[branchUuid].connectors[1], 'connectedTo', connectors[bloqs[branchUuid].connectors[1]].connectedTo);
        if (bloqs[branchUuid].connectors[2]) {
            console.log('       connector--root:', bloqs[branchUuid].connectors[2], 'connectedTo', connectors[bloqs[branchUuid].connectors[2]].connectedTo);
            console.log('                       ******* -  content **********');
            if (connectors[bloqs[branchUuid].connectors[2]].connectedTo) {
                drawBranch(bloqs, connectors, connectors[bloqs[branchUuid].connectors[2]].connectedTo);
            }
            console.log('                       ******* - end content **********');
        }
        if (connectors[bloqs[branchUuid].connectors[1]].connectedTo) {
            drawBranch(bloqs, connectors, connectors[bloqs[branchUuid].connectors[1]].connectedTo);
        }
    };
    /**
     * Draw in console the tree
     * @param  {[type]} bloqs      [description]
     * @param  {[type]} connectors [description]
     * @return {[type]}            [description]
     */
    var drawTree = function(bloqs, connectors) {
        console.log('drawtree');
        //buscamos los tipo statement q no tienen un top conectado
        for (var uuid in bloqs) {
            //console.log(bloqs[uuid]);
            if (bloqs[uuid].droppable && bloqs[uuid].connectors[0] && !connectors[bloqs[uuid].connectors[0]].connectedTo) {
                switch (bloqs[uuid].bloqData.type) {
                    case 'statement':
                    case 'statement-input':
                        console.log('******* - tree - *********', uuid);
                        console.log('connector--top:', bloqs[uuid].connectors[0], 'connectedTo', connectors[bloqs[uuid].connectors[0]].connectedTo);
                        console.log('connector--bottom:', bloqs[uuid].connectors[1], 'connectedTo', connectors[bloqs[uuid].connectors[1]].connectedTo);
                        if (bloqs[uuid].connectors[2]) {
                            console.log('connector--root:', bloqs[uuid].connectors[2], 'connectedTo', connectors[bloqs[uuid].connectors[2]].connectedTo);
                            console.log('           ccccccc -  content ccccccc');
                            if (connectors[bloqs[uuid].connectors[2]].connectedTo) {
                                drawBranch(bloqs, connectors, connectors[bloqs[uuid].connectors[2]].connectedTo);
                            }
                            console.log('           ccccccc - end content ccccccc');
                        }
                        if (connectors[bloqs[uuid].connectors[1]].connectedTo) {
                            drawBranch(bloqs, connectors, connectors[bloqs[uuid].connectors[1]].connectedTo);
                        }
                        break;
                    case 'group':
                        console.log('******* - Group - *********', uuid);
                        console.log('connector--root:', bloqs[uuid].connectors[2], 'connectedTo', connectors[bloqs[uuid].connectors[2]].connectedTo);
                        console.log('           ccccccc -  content ccccccc');
                        if (connectors[bloqs[uuid].connectors[2]].connectedTo) {
                            drawBranch(bloqs, connectors, connectors[bloqs[uuid].connectors[2]].connectedTo);
                        }
                        console.log('           ccccccc - end content ccccccc');
                        break;
                }
            }
        }
    };
    /**
     * get all the connectors of a branch
     * @param  {[type]} bloqUuid   [description]
     * @param  {[type]} connectors [description]
     * @param  {[type]} bloqs      [description]
     * @return {[type]}            [description]
     */
    var getBranchsConnectors = function(bloqUuid, bloqs, connectors) {
        var bloq = bloqs[bloqUuid];
        var result = [];
        result = result.concat(bloq.connectors);
        //console.log('tiene un hijo', connectors[bloq.connectors[1]].connectedTo);
        if (connectors[bloq.connectors[1]].connectedTo) {
            var bloqBranchUuid = connectors[connectors[bloq.connectors[1]].connectedTo].bloqUuid;
            result = result.concat(getBranchsConnectors(bloqBranchUuid, connectors, bloqs));
        }
        //si tiene hijos
        if (bloq.connectors[2] && connectors[bloq.connectors[2]].connectedTo) {
            var bloqChildUuid = connectors[connectors[bloq.connectors[2]].connectedTo].bloqUuid;
            result = result.concat(getBranchsConnectors(bloqChildUuid, connectors, bloqs));
        }
        return result;
    };
    var getBranchsConnectorsNoChildren = function(bloqUuid, connectors, bloqs) {
        var bloq = bloqs[bloqUuid];
        var result = [];
        result = result.concat(bloq.connectors);
        //console.log('tiene un hijo', connectors[bloq.connectors[1]].connectedTo);
        if (connectors[bloq.connectors[1]].connectedTo) {
            var bloqBranchUuid = connectors[connectors[bloq.connectors[1]].connectedTo].bloqUuid;
            result = result.concat(getBranchsConnectorsNoChildren(bloqBranchUuid, connectors, bloqs));
        }
        return result;
    };

    var getConnectorsUuidByAcceptType = function(IOConnectors, type) {
        var result = [];
        for (var key in IOConnectors) {
            if (IOConnectors[key].data.acceptType === type) {
                result.push(IOConnectors[key].uuid);
            }
        }
        return result;
    };
    var getNotConnected = function(IOConnectors, uuids) {
        var result = [];
        for (var i = 0; i < uuids.length; i++) {
            if (!IOConnectors[uuids[i]].connectedTo) {
                result.push(uuids[i]);
            }
        }
        return result;
    };
    var getInputsConnectorsFromBloq = function(IOConnectors, bloqs, bloq) {
        var result = [];
        var uuid;
        // connectedBloq;
        for (var i = 0; i < bloq.IOConnectors.length; i++) {
            uuid = bloq.IOConnectors[i];
            if (IOConnectors[bloq.IOConnectors[i]] && IOConnectors[uuid].data.type === 'connector--input') {
                result.push(uuid);
            }
        }
        return result;
    };

    var removeInputsConnectorsFromBloq = function(IOConnectors, bloq) {
        //remove visually all bloqInputs
        bloq.$contentContainer.children('.bloqinput').remove();
        bloq.$contentContainer.children('.removabletext').remove();
        //remove all IOConnectors
        for (var i = 0; i < bloq.IOConnectors.length; i++) {
            if (IOConnectors[bloq.IOConnectors[i]].data.type === 'connector--input') {
                delete IOConnectors[bloq.IOConnectors[i]];
            }
        }
    };
    var generateBloqInputConnectors = function(bloq) {
        var uuid;
        for (var i = 0; i < bloq.content.length; i++) {
            for (var j = 0; j < bloq.content[i].length; j++) {
                if (bloq.content[i][j].alias === 'bloqInput') {
                    uuid = generateUUID();
                    bloq.content[i][j].name = uuid;
                    bloq.connectors.push({
                        type: 'connector--input',
                        accept: 'connector--output',
                        name: uuid
                    });
                }
            }
        }
    };
    var getBloqByConnectorUuid = function(connectorUuid, bloqs, connectors) {
        return bloqs[connectors[connectorUuid].bloqUuid];
    };

    var translateRegExp = /translate\(((-)*(\d|\.)*)px, ((-)*(\d|\.)*)px\)/;
    var redrawTree = function(bloq, bloqs, connectors) {
        var rootBloq = getBloqByConnectorUuid(getFirstTopConnectorUuid(bloq.uuid, bloqs, connectors), bloqs, connectors);

        var somethingConnectedInBottomUuid = connectors[rootBloq.connectors[1]].connectedTo,
            transformProperties = translateRegExp.exec(rootBloq.$bloq[0].style.transform),
            top,
            left,
            branchBloq;

        if (transformProperties) {
            top = parseInt(transformProperties[4]);
            left = transformProperties[1];
        } else {
            top = parseInt(rootBloq.$bloq[0].style.top) || rootBloq.$bloq.position().top;
            left = parseInt(rootBloq.$bloq[0].style.left) || rootBloq.$bloq.position().left;
        }
        top += rootBloq.$bloq.outerHeight(true);

        while (somethingConnectedInBottomUuid) {
            branchBloq = bloqs[connectors[somethingConnectedInBottomUuid].bloqUuid];
            branchBloq.$bloq[0].style.transform = 'translate(' + left + 'px,' + top + 'px)';
            top += branchBloq.$bloq.outerHeight(true);
            somethingConnectedInBottomUuid = connectors[branchBloq.connectors[1]].connectedTo;
        }

    };

    var itsARootConnector = function(connector) {
        return connector.data.type === 'connector--root';
    };

    var itsInsideAConnectorRoot = function(bloq, bloqs, connectors) {

        var topConnector = connectors[bloq.connectors[0]];
        if (connectors[topConnector.connectedTo]) {
            var connectedWithTopConnector = connectors[topConnector.connectedTo];
            return itsARootConnector(connectedWithTopConnector) || itsInsideAConnectorRoot(getBloqByConnectorUuid(connectedWithTopConnector.uuid, bloqs, connectors), bloqs, connectors);

        } else {
            return false;
        }
    };

    var getClassName = function(bloq, bloqs, connectors) {
        var topConnector = connectors[bloq.connectors[0]];
        if (connectors[topConnector.connectedTo]) {
            var connectedWithTopConnector = connectors[topConnector.connectedTo];
            var bloqConnected = getBloqByConnectorUuid(connectedWithTopConnector.uuid, bloqs, connectors);
            if (itsARootConnector(connectedWithTopConnector) && (bloqConnected.bloqData.name === 'classChildren' || bloqConnected.bloqData.name === 'class')) {
                return bloqConnected.$bloq.find('[data-content-id="NAME"]').val();
            } else {
                return getClassName(getBloqByConnectorUuid(connectedWithTopConnector.uuid, bloqs, connectors), bloqs, connectors);
            }
        } else {
            return undefined;
        }
    };

    var jqueryObjectsArrayToHtmlToInsert = function(arrayToTransform) {
        var rawArray = $.map(
            arrayToTransform,
            function(value) {

                // Return the unwrapped version. This will return
                // the underlying DOM nodes contained within each
                // jQuery value.
                return (value.get());

            }
        );
        return rawArray;
    };

    var connectorIsInBranch = function(connectorUuid, topBloqUuid, bloqs, connectors) {
        var isInBloq = false;
        var i = 0;
        //miro si es uno de mis conectores
        while (!isInBloq && (i < bloqs[topBloqUuid].connectors.length)) {
            if (bloqs[topBloqUuid].connectors[i] === connectorUuid) {
                isInBloq = true;
            } else {
                i++;
            }
        }
        i = 0;
        while (!isInBloq && (i < bloqs[topBloqUuid].IOConnectors.length)) {
            if (bloqs[topBloqUuid].IOConnectors[i] === connectorUuid) {
                isInBloq = true;
            } else {
                i++;
            }
        }
        //si tengo hijos miro en ellos
        if (!isInBloq && bloqs[topBloqUuid].connectors[2] && connectors[bloqs[topBloqUuid].connectors[2]].connectedTo) {
            isInBloq = connectorIsInBranch(connectorUuid, connectors[connectors[bloqs[topBloqUuid].connectors[2]].connectedTo].bloqUuid, bloqs, connectors);
        }
        //si tengo enganchado algo abajo miro en ellos
        if (!isInBloq && bloqs[topBloqUuid].connectors[1] && connectors[bloqs[topBloqUuid].connectors[1]].connectedTo) {
            isInBloq = connectorIsInBranch(connectorUuid, connectors[connectors[bloqs[topBloqUuid].connectors[1]].connectedTo].bloqUuid, bloqs, connectors);
        }
        return isInBloq;
    };

    var hasClass = function(el, selector) {
        var className = ' ' + selector + ' ';

        if ((' ' + el.className + ' ').replace(/[\n\t]/g, ' ').indexOf(className) > -1) {
            return true;
        }

        return false;
    };

    var getTypeFromBloq = function(bloq, bloqs, IOConnectors, softwareArrays) {
        var result;
        if (!bloq) {
            console.error('We cant get the type if we dont have a bloq');
        }
        if (!bloq.bloqData.returnType) {
            console.error('we cant get the type from a bloq without returnType ' + bloq.bloqData.name);
        }
        switch (bloq.bloqData.returnType.type) {
            case 'simple':
                result = bloq.bloqData.returnType.value;
                break;
            case 'fromInput':
                var contentData = _.find(bloq.bloqData.content[0], {
                    bloqInputId: bloq.bloqData.returnType.bloqInputId
                });
                var connector = _.find(IOConnectors, {
                    bloqUuid: bloq.uuid,
                    data: {
                        name: contentData.name
                    }
                });
                if (connector && connector.connectedTo) {
                    result = getTypeFromBloq(getBloqByConnectorUuid(connector.connectedTo, bloqs, IOConnectors), bloqs, IOConnectors, softwareArrays);
                } else {
                    result = '';
                }
                break;
            case 'fromDynamicDropdown':
                result = getFromDynamicDropdownType(bloq, bloq.bloqData.returnType.idDropdown, bloq.bloqData.returnType.options, softwareArrays, bloq.componentsArray);
                break;
            case 'fromDropdown':
                result = bloq.$bloq.find('[data-content-id="' + bloq.bloqData.returnType.idDropdown + '"]').val();
                break;
            default:
                throw 'we cant get the type from this bloq: ' + bloq.bloqData.name + ' ' + JSON.stringify(bloq.bloqData.returnType);
        }
        return result;
    };
    var occurrencesInString = function(string, subString, allowOverlapping) {
        string += '';
        subString += '';
        if (subString.length <= 0) {
            return string.length + 1;
        }

        var n = 0,
            pos = 0;
        var step = (allowOverlapping) ? (1) : (subString.length);

        while (true) {
            pos = string.indexOf(subString, pos);
            if (pos >= 0) {
                n++;
                pos += step;
            } else {
                break;
            }
        }
        return (n);
    };

    var getParent = function(bloq, bloqs, IOConnectors) {
        var connector = getOutputConnector(bloq, IOConnectors);
        return getBloqByConnectorUuid(connector.connectedTo, bloqs, IOConnectors);

    };

    var getArgsFromBloq = function(bloq, bloqs, IOConnectors) {
        var result;
        if (!bloq) {
            throw 'wadafak';
        }

        while (!bloq.bloqData.arguments) {
            bloq = getParent(bloq, bloqs, IOConnectors);
        }
        var contentData = _.find(bloq.bloqData.content[0], {
            bloqInputId: bloq.bloqData.arguments.bloqInputId
        });
        var connector = _.find(IOConnectors, {
            bloqUuid: bloq.uuid,
            data: {
                name: contentData.name
            }
        });
        if (connector && connector.connectedTo) {
            var childBloq = getBloqByConnectorUuid(connector.connectedTo, bloqs, IOConnectors);
            var code = childBloq.getCode();
            result = {
                code: code,
                bloq: childBloq.uuid,
                funcName: '',
                size: occurrencesInString(code, ',', false) + 1
            };
        } else {
            result = {
                code: '',
                bloq: '',
                funcName: '',
                size: 0
            };
        }
        return result;
    };

    var drawSoftwareVars = function(softwareArrays) {
        for (var i = 0; i < softwareArrays.softwareVars.length; i++) {
            console.log('name: ', softwareArrays.softwareVars[i].name, 'type: ', softwareArrays.softwareVars[i].type);
        }
    };

    var drawSoftwareArray = function(softwareArrays) {
        console.info('drawSoftwareArray');
        drawSoftwareVars(softwareArrays);
        console.info('returnFunctions');
        for (var i = 0; i < softwareArrays.returnFunctions.length; i++) {
            console.log('name: ', softwareArrays.returnFunctions[i].name, 'type: ', softwareArrays.returnFunctions[i].type);
        }
    };

    var fillSchemaWithContent = function(originalBloqSchema, data) {
        var bloqSchema = _.clone(originalBloqSchema, true),
            k,
            found;

        if (data && data.content) {
            for (var i = 0; i < data.content[0].length; i++) {

                switch (data.content[0][i].alias) {
                    case 'varInput':
                    case 'numberInput':
                    case 'stringInput':
                    case 'charInput':
                    case 'dynamicDropdown':
                    case 'staticDropdown':
                    case 'multilineCodeInput':
                    case 'multilineCommentInput':
                        k = 0;
                        found = false;
                        while (!found && (k < bloqSchema.content[0].length)) {
                            if (data.content[0][i].id === bloqSchema.content[0][k].id) {
                                found = true;
                                bloqSchema.content[0][k].value = data.content[0][i].value;
                            }
                            k++;
                        }
                        if (!found) {
                            throw 'Attribute on bloqStructure not found in definition';
                        }
                        break;
                    case 'bloqInput':
                        //we do nothing here
                        break;
                    default:
                        throw 'we cant build that option ' + data.content[0][i].alias;
                }
            }
        }

        return bloqSchema;
    };

    var getCode = function(componentsArray, bloqs) {
        var includeCode = '',
            globalVars = '',
            code = '',
            setupCode = '',
            bitbloqLibs = false,
            finalFunctions = '';
        if (bloqs.varsBloq && bloqs.setupBloq && bloqs.loopBloq && componentsArray) {
            //TODO: put this initialization inside bloqs somehow
            //*******INCLUDES*******//
            if (componentsArray.robot.length >= 1) {
                if (componentsArray.robot[0] === 'zowi') {
                    includeCode += '#include <BitbloqZowi.h>\n#include <BitbloqUS.h>\n#include <BitbloqBatteryReader.h>\n#include <BitbloqLedMatrix.h>\n#include <Servo.h>\n#include <BitbloqOscillator.h>\n#include <EEPROM.h>\n';
                    globalVars += 'Zowi zowi;';
                    setupCode += 'zowi.init();';
                }
                if (componentsArray.robot[0] === 'evolution') {
                    includeCode += '#include <BitbloqEvolution.h>\n#include <BitbloqUS.h>\n#include <Servo.h>\n#include <BitbloqOscillator.h>\n';
                    globalVars += 'Evolution evolution;';
                    setupCode += 'evolution.init();';
                }
            }
            if (componentsArray.continuousServos.length >= 1 || componentsArray.servos.length >= 1 || componentsArray.oscillators.length >= 1) {
                includeCode += '#include <Servo.h>\n';
            }
            if (componentsArray.oscillators.length >= 1) {
                if (includeCode.indexOf('#include <Wire.h>') === -1) {
                    includeCode += '#include <Wire.h>\n';
                }
                includeCode += '#include <BitbloqOscillator.h>\n';
                bitbloqLibs = true;
            }
            if (componentsArray.lcds.length >= 1) {
                if (includeCode.indexOf('#include <Wire.h>') === -1) {
                    includeCode += '#include <Wire.h>\n';
                }
                includeCode += '#include <BitbloqLiquidCrystal.h>\n';
                bitbloqLibs = true;
            }
            if (componentsArray.serialElements.length >= 1) {
                includeCode += '#include <SoftwareSerial.h>\n#include <BitbloqSoftwareSerial.h>\n';
                bitbloqLibs = true;
            }
            if (componentsArray.clocks.length >= 1) {
                if (includeCode.indexOf('#include <Wire.h>') === -1) {
                    includeCode += '#include <Wire.h>\n';
                }
                includeCode += '#include <BitbloqRTC.h>\n';
                bitbloqLibs = true;
            }
            if (componentsArray.hts221.length >= 1) {
                if (includeCode.indexOf('#include <Wire.h>') === -1) {
                    includeCode += '#include <Wire.h>\n';
                }
                includeCode += '#include <BitbloqHTS221.h>\n#include <HTS221_Registers.h>\n';
                bitbloqLibs = true;

                componentsArray.hts221.forEach(function(sensor) {
                    globalVars += 'HTS221 ' + sensor.name + ';';
                    setupCode += 'Wire.begin();' + sensor.name + '.begin();';
                });
            }
            if (componentsArray.sensors.length >= 1) {
                componentsArray.sensors.forEach(function(sensor) {
                    if (sensor.type === 'Joystick') {
                        includeCode += '#include <BitbloqJoystick.h>\n#include <Wire.h>\n';
                        bitbloqLibs = true;
                    } else if (sensor.type === 'ButtonPad') {
                        includeCode += '#include <BitbloqButtonPad.h>\n';
                        bitbloqLibs = true;
                    } else if (sensor.type === 'LineFollower') {
                        includeCode += '#include <BitbloqLineFollower.h>\n';
                        bitbloqLibs = true;
                    } else if (sensor.type === 'US') {
                        includeCode += '#include <BitbloqUS.h>\n';
                        bitbloqLibs = true;
                    } else if (sensor.type === 'encoder') {
                        includeCode += '#include <BitbloqEncoder.h>\n';
                        bitbloqLibs = true;
                    }
                });
            }
            //*******BUZZERS*******//
            if (componentsArray.buzzers.length >= 1) {
                componentsArray.buzzers.forEach(function(buzzer) {
                    globalVars += 'int ' + buzzer.name + ' = ' + (buzzer.pin.s || '') + ';';
                });
            }
            //*******CLOCKS*******//
            if (componentsArray.clocks.length >= 1) {
                componentsArray.clocks.forEach(function(clock) {
                    globalVars += 'RTC_DS1307 ' + clock.name + ';';
                });
            }
            //*******CONTINUOUSSERVOS*******//
            if (componentsArray.continuousServos.length >= 1) {
                componentsArray.continuousServos.forEach(function(continuousServo) {
                    globalVars += 'Servo ' + continuousServo.name + ';';
                    setupCode += continuousServo.name + '.attach(' + (continuousServo.pin.s || '') + ');';
                });
            }
            if (componentsArray.servos.length >= 1) {
                componentsArray.servos.forEach(function(servo) {
                    globalVars += 'Servo ' + servo.name + ';';
                    setupCode += servo.name + '.attach(' + (servo.pin.s || '') + ');';
                });
            }
            if (componentsArray.lcds.length >= 1) {
                componentsArray.lcds.forEach(function(lcd) {
                    globalVars += 'LiquidCrystal ' + lcd.name + '(0);';
                    setupCode += lcd.name + '.begin(16, 2);' + lcd.name + '.clear();';
                });
            }
            if (componentsArray.leds.length >= 1) {
                componentsArray.leds.forEach(function(leds) {
                    globalVars += 'int ' + leds.name + ' = ' + (leds.pin.s || '') + ';';
                    setupCode += 'pinMode(' + leds.name + ', OUTPUT);';
                });
            }
            if (componentsArray.rgbs.length >= 1) {
                componentsArray.rgbs.forEach(function(rgbs) {
                    if (includeCode.indexOf('#include <BitbloqRGB.h>') === -1) {
                        includeCode += '#include <BitbloqRGB.h>\n';
                    }
                    globalVars += 'ZumRGB ' + rgbs.name + '(' + (rgbs.pin.r || '') + ',' + (rgbs.pin.g || '') + ',' + (rgbs.pin.b || '') + ');';
                });
            }
            if (componentsArray.oscillators.length >= 1) {
                componentsArray.oscillators.forEach(function(oscillator) {
                    globalVars += 'Oscillator ' + oscillator.name + ';';
                    setupCode += oscillator.name + '.attach(' + (oscillator.pin.s || '') + ');';
                });
            }
            if (componentsArray.sensors.length >= 1) {
                componentsArray.sensors.forEach(function(sensor) {
                    if (sensor.type === 'analog' || sensor.type === 'digital') {
                        globalVars += 'int ' + sensor.name + ' = ' + (sensor.pin.s || '') + ';';
                        setupCode += 'pinMode(' + sensor.name + ', INPUT);';
                    } else if (sensor.type === 'Joystick') {
                        globalVars += 'Joystick ' + sensor.name + '(' + (sensor.pin.x || '') + ',' + (sensor.pin.y || '') + ',' + (sensor.pin.k || '') + ');';
                    } else if (sensor.type === 'ButtonPad') {
                        globalVars += 'ButtonPad ' + sensor.name + '(' + (sensor.pin.s || '') + ');';
                    } else if (sensor.type === 'LineFollower') {
                        globalVars += 'LineFollower ' + sensor.name + '(' + (sensor.pin.s1 || '') + ',' + (sensor.pin.s2 || '') + ');';
                    } else if (sensor.type === 'US') {
                        globalVars += 'US ' + sensor.name + '(' + (sensor.pin.trigger || '') + ',' + (sensor.pin.echo || '') + ');';
                    } else if (sensor.type === 'encoder') {
                        globalVars += 'Encoder ' + sensor.name + '(encoderUpdaterWrapper,' + (sensor.pin.k || '') + ',' + (sensor.pin.sa || '') + ',' + (sensor.pin.sb || '') + ');';
                        finalFunctions += 'void encoderUpdaterWrapper(){' + sensor.name + '.update();}';
                    }
                });
            }
            if (componentsArray.serialElements.length >= 1) {
                componentsArray.serialElements.forEach(function(serialElement) {
                    if (serialElement.pin.s === 'serial') {
                        serialElement.pin.rx = '0';
                        serialElement.pin.tx = '1';
                    }
                    globalVars += 'bqSoftwareSerial ' + serialElement.name + '(' + (serialElement.pin.rx || '') + ',' + (serialElement.pin.tx || '') + ',' + (serialElement.baudRate || '') + ');';
                });
            }
            code = '\n/***   Included libraries  ***/\n' + includeCode + '\n\n/***   Global variables and function definition  ***/\n' + globalVars + bloqs.varsBloq.getCode() + '\n\n/***   Setup  ***/\n' + bloqs.setupBloq.getCode(setupCode) + '\n\n/***   Loop  ***/\n' + bloqs.loopBloq.getCode() + '' + finalFunctions;
        } else {
            console.log('cant generate code');
        }
        return code;
    };

    var splice = function(string, idx, rem, s) {

        return (string.slice(0, idx) + s + string.slice(idx + Math.abs(rem)));
    };

    var executeFunctionOnConnectedStatementBloqs = function(functionToExecute, bloq, bloqs, connectors) {
        var connector = connectors[bloq.connectors[1]].connectedTo,
            tempBloq;

        while (connector) {
            tempBloq = getBloqByConnectorUuid(connector, bloqs, connectors);
            tempBloq[functionToExecute]();
            connector = connectors[tempBloq.connectors[1]].connectedTo;
        }
    };

    var delay = (function() {
        var timer = 0;
        return function(callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    var defaultDiacriticsRemovalap = [{
        'base': 'A',
        'letters': '\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F'
    }, {
        'base': 'AA',
        'letters': '\uA732'
    }, {
        'base': 'AE',
        'letters': '\u00C6\u01FC\u01E2'
    }, {
        'base': 'AO',
        'letters': '\uA734'
    }, {
        'base': 'AU',
        'letters': '\uA736'
    }, {
        'base': 'AV',
        'letters': '\uA738\uA73A'
    }, {
        'base': 'AY',
        'letters': '\uA73C'
    }, {
        'base': 'B',
        'letters': '\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181'
    }, {
        'base': 'C',
        'letters': '\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E'
    }, {
        'base': 'D',
        'letters': '\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779'
    }, {
        'base': 'DZ',
        'letters': '\u01F1\u01C4'
    }, {
        'base': 'Dz',
        'letters': '\u01F2\u01C5'
    }, {
        'base': 'E',
        'letters': '\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E'
    }, {
        'base': 'F',
        'letters': '\u0046\u24BB\uFF26\u1E1E\u0191\uA77B'
    }, {
        'base': 'G',
        'letters': '\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E'
    }, {
        'base': 'H',
        'letters': '\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D'
    }, {
        'base': 'I',
        'letters': '\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197'
    }, {
        'base': 'J',
        'letters': '\u004A\u24BF\uFF2A\u0134\u0248'
    }, {
        'base': 'K',
        'letters': '\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2'
    }, {
        'base': 'L',
        'letters': '\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780'
    }, {
        'base': 'LJ',
        'letters': '\u01C7'
    }, {
        'base': 'Lj',
        'letters': '\u01C8'
    }, {
        'base': 'M',
        'letters': '\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C'
    }, {
        'base': 'N',
        'letters': '\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4'
    }, {
        'base': 'NJ',
        'letters': '\u01CA'
    }, {
        'base': 'Nj',
        'letters': '\u01CB'
    }, {
        'base': 'O',
        'letters': '\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C'
    }, {
        'base': 'OI',
        'letters': '\u01A2'
    }, {
        'base': 'OO',
        'letters': '\uA74E'
    }, {
        'base': 'OU',
        'letters': '\u0222'
    }, {
        'base': 'OE',
        'letters': '\u008C\u0152'
    }, {
        'base': 'oe',
        'letters': '\u009C\u0153'
    }, {
        'base': 'P',
        'letters': '\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754'
    }, {
        'base': 'Q',
        'letters': '\u0051\u24C6\uFF31\uA756\uA758\u024A'
    }, {
        'base': 'R',
        'letters': '\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782'
    }, {
        'base': 'S',
        'letters': '\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784'
    }, {
        'base': 'T',
        'letters': '\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786'
    }, {
        'base': 'TZ',
        'letters': '\uA728'
    }, {
        'base': 'U',
        'letters': '\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244'
    }, {
        'base': 'V',
        'letters': '\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245'
    }, {
        'base': 'VY',
        'letters': '\uA760'
    }, {
        'base': 'W',
        'letters': '\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72'
    }, {
        'base': 'X',
        'letters': '\u0058\u24CD\uFF38\u1E8A\u1E8C'
    }, {
        'base': 'Y',
        'letters': '\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE'
    }, {
        'base': 'Z',
        'letters': '\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762'
    }, {
        'base': 'a',
        'letters': '\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250'
    }, {
        'base': 'aa',
        'letters': '\uA733'
    }, {
        'base': 'ae',
        'letters': '\u00E6\u01FD\u01E3'
    }, {
        'base': 'ao',
        'letters': '\uA735'
    }, {
        'base': 'au',
        'letters': '\uA737'
    }, {
        'base': 'av',
        'letters': '\uA739\uA73B'
    }, {
        'base': 'ay',
        'letters': '\uA73D'
    }, {
        'base': 'b',
        'letters': '\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253'
    }, {
        'base': 'c',
        'letters': '\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184'
    }, {
        'base': 'd',
        'letters': '\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A'
    }, {
        'base': 'dz',
        'letters': '\u01F3\u01C6'
    }, {
        'base': 'e',
        'letters': '\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD'
    }, {
        'base': 'f',
        'letters': '\u0066\u24D5\uFF46\u1E1F\u0192\uA77C'
    }, {
        'base': 'g',
        'letters': '\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F'
    }, {
        'base': 'h',
        'letters': '\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265'
    }, {
        'base': 'hv',
        'letters': '\u0195'
    }, {
        'base': 'i',
        'letters': '\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131'
    }, {
        'base': 'j',
        'letters': '\u006A\u24D9\uFF4A\u0135\u01F0\u0249'
    }, {
        'base': 'k',
        'letters': '\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3'
    }, {
        'base': 'l',
        'letters': '\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747'
    }, {
        'base': 'lj',
        'letters': '\u01C9'
    }, {
        'base': 'm',
        'letters': '\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F'
    }, {
        'base': 'n',
        'letters': '\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5'
    }, {
        'base': 'nj',
        'letters': '\u01CC'
    }, {
        'base': 'o',
        'letters': '\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275'
    }, {
        'base': 'oi',
        'letters': '\u01A3'
    }, {
        'base': 'ou',
        'letters': '\u0223'
    }, {
        'base': 'oo',
        'letters': '\uA74F'
    }, {
        'base': 'p',
        'letters': '\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755'
    }, {
        'base': 'q',
        'letters': '\u0071\u24E0\uFF51\u024B\uA757\uA759'
    }, {
        'base': 'r',
        'letters': '\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783'
    }, {
        'base': 's',
        'letters': '\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B'
    }, {
        'base': 't',
        'letters': '\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787'
    }, {
        'base': 'tz',
        'letters': '\uA729'
    }, {
        'base': 'u',
        'letters': '\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289'
    }, {
        'base': 'v',
        'letters': '\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C'
    }, {
        'base': 'vy',
        'letters': '\uA761'
    }, {
        'base': 'w',
        'letters': '\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73'
    }, {
        'base': 'x',
        'letters': '\u0078\u24E7\uFF58\u1E8B\u1E8D'
    }, {
        'base': 'y',
        'letters': '\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF'
    }, {
        'base': 'z',
        'letters': '\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763'
    }];

    var diacriticsMap = {};
    for (var i = 0; i < defaultDiacriticsRemovalap.length; i++) {
        var letters = defaultDiacriticsRemovalap[i].letters;
        for (var j = 0; j < letters.length; j++) {
            diacriticsMap[letters[j]] = defaultDiacriticsRemovalap[i].base;
        }
    }

    var removeDiacritics = function(str) {
        return str.replace(/[^\u0000-\u007E]/g, function(a) {
            return diacriticsMap[a] || a;
        }).replace(/[^\w\s]/gi, '').replace(/ /g, '_');
    };

    var getEmptyComponentsArray = function() {
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
    };

    var getArduinoCode = function(componentsArray, program) {
        var varCode = getArduinoCodeFromBloq(program.vars),
            setupCode = getArduinoCodeFromBloq(program.setup),
            loopCode = getArduinoCodeFromBloq(program.loop);
        return varCode + setupCode + loopCode;
    };

    var getArduinoCodeFromBloq = function(bloq) {
        var code = '';
        if (bloq.enable) {
            var contentRegExp = new RegExp('{([A-Z0-9]+)}', 'g'),
                contentConnectionTypeRegExp = new RegExp('{([A-Z0-9]+\.connectionType)}', 'g'),
                regExpResult,
                contents = [];
            code = bloq.code;
            while (regExpResult = contentRegExp.exec(code)) {
                console.log(regExpResult);
                contents.push(getContentFromBloq(regExpResult[1], bloq));
            }
            //twice bucle because regexp are not working fine
            for (var i = 0; i < contents.length; i++) {
                console.log('+++');
                console.log(contents[i].value);
                console.log((contents[i].value || '').replace(/ \*/g, ''));
                code = code.replace(new RegExp('{' + contents[i].id + '\.withoutAsterisk}', 'g'), (contents[i].value || '').replace(/ \*/g, ''));
                code = code.replace(new RegExp('{' + contents[i].id + '\.connectionType}', 'g'), contents[i].connectionType || '');
                code = code.replace(new RegExp('{' + contents[i].id + '}( )*', 'g'), contents[i].value || '');
            };

            //search for regular expressions:
            var reg = /(.*)\?(.*):(.*)/g;
            if (reg.test(code)) {
                code = eval(code); // jshint ignore:line
            }
            console.log(code);
        }
        return code;
    };

    var getContentFromBloq = function(contentId, bloq) {
        var content = {
            value: ''
        };

        if (contentId === 'STATEMENTS') {
            content.id = 'STATEMENTS';
            for (var i = 0; i < bloq.childs.length; i++) {
                content.value += getArduinoCodeFromBloq(bloq.childs[i]);
            }
        } else {
            content = _.filter(bloq.content[0], function(elem) {
                if (elem.id === contentId) {
                    return true;
                } else if (elem.bloqInputId === contentId) {
                    elem.id = contentId;
                    return true;
                }
            })[0];
        }
        if (content.alias === 'bloqInput' && content.value) {
            content.connectionType = getTypeFromBloqStructure(content.value);
            content.value = getArduinoCodeFromBloq(content.value);
        }
        return content;
    };

    var getTypeFromBloqStructure = function(bloq) {
        var type = '',
            content = null;
        if (bloq.returnType) {
            switch (bloq.returnType.type) {
                case 'simple':
                    type = bloq.returnType.value;
                    break;
                case 'fromDropdown':
                    content = getContentFromBloq(bloq.returnType.idDropdown, bloq);
                    type = content.value;
                    break;
                case 'fromDynamicDropdown':
                    //type = bloq.returnType.value;
                    break;
                case 'fromInput':
                    //type = bloq.returnType.value;
                    break;
                default:
                    throw 'Return type undefined';
            }
        } else {
            throw 'We cant get type from a bloq witouth a returnType';
        }
        return type;
    };

    bloqsUtils.validString = validString;
    bloqsUtils.validChar = validChar;
    bloqsUtils.validComment = validComment;
    bloqsUtils.delay = delay;
    bloqsUtils.validNumber = validNumber;
    bloqsUtils.validName = validName;
    bloqsUtils.generateUUID = generateUUID;
    bloqsUtils.getNumericStyleProperty = getNumericStyleProperty;
    bloqsUtils.itsOver = itsOver;
    bloqsUtils.getLastBottomConnectorUuid = getLastBottomConnectorUuid;
    bloqsUtils.getFirstTopConnectorUuid = getFirstTopConnectorUuid;
    bloqsUtils.getOutputConnector = getOutputConnector;
    bloqsUtils.getTreeHeight = getTreeHeight;
    bloqsUtils.getNodesHeight = getNodesHeight;
    bloqsUtils.drawTree = drawTree;
    bloqsUtils.drawBranch = drawBranch;
    bloqsUtils.getBranchsConnectors = getBranchsConnectors;
    bloqsUtils.getBranchsConnectorsNoChildren = getBranchsConnectorsNoChildren;
    bloqsUtils.getConnectorsUuidByAcceptType = getConnectorsUuidByAcceptType;
    bloqsUtils.getNotConnected = getNotConnected;
    bloqsUtils.getInputsConnectorsFromBloq = getInputsConnectorsFromBloq;
    bloqsUtils.generateBloqInputConnectors = generateBloqInputConnectors;
    bloqsUtils.getBloqByConnectorUuid = getBloqByConnectorUuid;
    bloqsUtils.redrawTree = redrawTree;
    bloqsUtils.itsARootConnector = itsARootConnector;
    bloqsUtils.itsInsideAConnectorRoot = itsInsideAConnectorRoot;
    bloqsUtils.jqueryObjectsArrayToHtmlToInsert = jqueryObjectsArrayToHtmlToInsert;
    bloqsUtils.connectorIsInBranch = connectorIsInBranch;
    bloqsUtils.hasClass = hasClass;
    bloqsUtils.appendArrayInOneTime = appendArrayInOneTime;
    bloqsUtils.drawDropdownOptions = drawDropdownOptions;
    bloqsUtils.getTypeFromBloq = getTypeFromBloq;
    bloqsUtils.drawSoftwareVars = drawSoftwareVars;
    bloqsUtils.drawSoftwareArray = drawSoftwareArray;
    bloqsUtils.sameConnectionType = sameConnectionType;
    bloqsUtils.getFromDynamicDropdownType = getFromDynamicDropdownType;
    bloqsUtils.fillSchemaWithContent = fillSchemaWithContent;
    bloqsUtils.getArgsFromBloq = getArgsFromBloq;
    bloqsUtils.removeInputsConnectorsFromBloq = removeInputsConnectorsFromBloq;
    bloqsUtils.getParent = getParent;
    bloqsUtils.getCode = getCode;
    bloqsUtils.splice = splice;
    bloqsUtils.translateRegExp = translateRegExp;
    bloqsUtils.executeFunctionOnConnectedStatementBloqs = executeFunctionOnConnectedStatementBloqs;
    bloqsUtils.getClassName = getClassName;
    bloqsUtils.getCaretPosition = getCaretPosition;
    bloqsUtils.setCaretPosition = setCaretPosition;
    bloqsUtils.getEmptyComponentsArray = getEmptyComponentsArray;
    bloqsUtils.getArduinoCode = getArduinoCode;

    return bloqsUtils;

})(window.bloqsUtils = window.bloqsUtils || {}, _, undefined);