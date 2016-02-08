/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: setClassArrayVariable
 * 
 * Bloq type: Statement
 * 
 * Description: It sets an specific element of an array-type variable,
 *              selectable from a first drop-down, of an object, selectable
 *              from a second drop-down.
 * 
 * Return type: none
 */

var setClassArrayVariable = _.merge(_.clone(StatementBloq, true), {

    name: 'setClassArrayVariable',
    bloqClass: 'bloq-set-class-variableArray',
    content: [
        [{
            alias: 'text',
            value: 'bloq-set-class-variableArray-variable'
        }, {
            id: 'NAME',
            alias: 'dynamicDropdown',
            options: 'softwareVars'
        }, {
            alias: 'text',
            value: '['
        }, {
            id: 'ITERATOR',
            alias: 'numberInput',
            value: 0
        }, {
            alias: 'text',
            value: ']'
        }, {
            alias: 'text',
            value: 'bloq-invoke-class-function-class'
        }, {
            id: 'CLASS',
            alias: 'dynamicDropdown',
            options: 'objects'
        }, {
            alias: 'text',
            value: '='
        }, {
            bloqInputId: 'VALUE',
            alias: 'bloqInput',
            acceptType: {
                type: 'fromDynamicDropdown',
                idDropdown: 'NAME',
                pointer: 'true',
                options: 'softwareVars'
            }
        }]
    ],
    code: '{CLASS}.{NAME}[{ITERATOR}] = {VALUE};'
});

utils.generateBloqInputConnectors(setClassArrayVariable);

module.exports = setClassArrayVariable;