/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: selectClassVariable
 *
 * Bloq type: Output
 *
 * Description: It returns a variable, selectable from a first drop-down,
 *              of an specific object, selectable from a second drop-down.
 *
 * Return type: variable's type
 */

var selectClassVariable = _.merge(_.clone(OutputBloq, true), {

    name: 'selectClassVariable',
    bloqClass: 'bloq-select-class-variable',
    content: [
        [{
            alias: 'text',
            value: 'bloq-select-class-variable-variable'
        }, {
            id: 'VAR',
            alias: 'dynamicDropdown',
            options: 'softwareVars'
        }, {
            alias: 'text',
            value: 'bloq-invoke-class-function-class'
        }, {
            id: 'CLASS',
            alias: 'dynamicDropdown',
            options: 'objects'
        }]
    ],
    code: '{CLASS}.{VAR}',
    returnType: {
        type: 'fromDynamicDropdown',
        idDropdown: 'VAR',
        options: 'softwareVars'
    }
});

utils.generateBloqInputConnectors(selectClassVariable);

module.exports = selectClassVariable;