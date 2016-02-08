/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: stringArrayAdvanced
 *
 * Bloq type: Output
 *
 * Description: It returns the element of a specific array
 *              variable, selectable from a drop-down, of
 *              the given position.
 *
 * Return type: array's element type
 */

var bloq = _.merge(_.clone(OutputBloq, true), {

    name: 'arrayVariable',
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
            id: 'POSITION',
            alias: 'numberInput',
            value: 0
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

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;