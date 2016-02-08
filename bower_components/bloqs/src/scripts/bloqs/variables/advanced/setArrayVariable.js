/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementBloq = require('./../../statementBloq');

/**
 * Bloq name: setArrayVariableAdvanced
 *
 * Bloq type: Statement
 *
 * Description: It assigns the given value to the element in the given
 *              position of a specific array variable, selectable from
 *              a drop-down.
 *
 * Return type: none
 */

var setArrayVariableAdvanced = _.merge(_.clone(StatementBloq, true), {

    name: 'setArrayVariableAdvanced',
    bloqClass: 'bloq-set-variableArray',
    content: [
        [{
            alias: 'text',
            value: 'bloq-set-variableArray-variable'
        }, {
            id: 'NAME',
            alias: 'dynamicDropdown',
            options: 'softwareVars'
        }, {
            alias: 'text',
            value: '['
        }, {
            bloqInputId: 'ITERATOR',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: ']'
        }, {
            alias: 'text',
            value: '='
        }, {
            bloqInputId: 'VALUE',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '{NAME}[{ITERATOR}] = {VALUE};'
});

utils.generateBloqInputConnectors(setArrayVariableAdvanced);

module.exports = setArrayVariableAdvanced;