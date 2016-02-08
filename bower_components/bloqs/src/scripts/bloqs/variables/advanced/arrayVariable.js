/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    OutputBloq = require('./../../outputBloq');

/**
 * Bloq name: arrayVariableAdvanced
 *
 * Bloq type: Output
 *
 * Description: It returns the element of a specific array
 *              variable, selectable from a drop-down, of
 *              the given position.
 *
 * Return type: array's element type
 */

var arrayVariableAdvanced = _.merge(_.clone(OutputBloq, true), {

    name: 'arrayVariableAdvanced',
    bloqClass: 'bloq-array-variable',
    content: [
        [{
            alias: 'text',
            value: 'bloq-array-variable-variable'
        }, {
            id: 'VAR',
            alias: 'dynamicDropdown',
            options: 'softwareVars'
        }, {
            alias: 'text',
            value: '['
        }, {
            bloqInputId: 'POSITION',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: ']'
        }]
    ],
    code: '{VAR}[{POSITION}]',
    returnType: {
        type: 'fromDynamicDropdown',
        idDropdown: 'VAR',
        pointer: 'true',
        options: 'softwareVars'
    }
});

utils.generateBloqInputConnectors(arrayVariableAdvanced);

module.exports = arrayVariableAdvanced;