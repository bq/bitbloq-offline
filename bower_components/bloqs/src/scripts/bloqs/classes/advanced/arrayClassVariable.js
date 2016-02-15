/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    OutputBloq = require('./../../outputBloq');

/**
 * Bloq name: arrayClassVariable
 *
 * Bloq type: Output
 *
 * Description: It returns an specific element of an array-type variable,
 *              selectable from a first drop-down, of an object, selectable
 *              from a second drop-down.
 *
 * Return type: element's type of the array variable
 */

var arrayClassVariable = _.merge(_.clone(OutputBloq, true), {

    name: 'arrayClassVariable',
    bloqClass: 'bloq-array-class-variable',
    content: [
        [{
            alias: 'text',
            value: 'bloq-array-class-variable-variable'
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
        }, {
            alias: 'text',
            value: 'bloq-invoke-class-function-class'
        }, {
            id: 'CLASS',
            alias: 'dynamicDropdown',
            options: 'objects'
        }]
    ],
    code: '{CLASS}.{VAR}[{POSITION}]',
    returnType: {
        type: 'fromDynamicDropdown',
        idDropdown: 'VAR',
        pointer: 'true',
        options: 'softwareVars'
    }
});

utils.generateBloqInputConnectors(arrayClassVariable);

module.exports = arrayClassVariable;