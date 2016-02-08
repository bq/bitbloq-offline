/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    OutputBloq = require('./../../outputBloq');

/**
 * Bloq name: argument
 *
 * Bloq type: Output
 *
 * Description: It declares a variable with a specific type,
 *              selectable from a drop-down, and with a given name
 *              to be used as argument in functions.
 *
 * Return type: var
 */

var argument = _.merge(_.clone(OutputBloq, true), {

    name: 'argument',
    bloqClass: 'bloq-argument',
    content: [
        [{
            alias: 'text',
            value: 'bloq-argument-var'
        }, {
            id: 'TYPE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-argument-int',
                value: 'int'
            }, {
                label: 'bloq-argument-float',
                value: 'float'
            }, {
                label: 'bloq-argument-string',
                value: 'String'
            }, {
                label: 'bloq-argument-char',
                value: 'char'
            }, {
                label: 'bloq-argument-bool',
                value: 'bool'
            }]
        }, {
            id: 'VARNAME',
            alias: 'varInput',
            value: ''
        }]
    ],
    createDynamicContent: 'softwareVars',
    code: '{TYPE} {VARNAME}',
    returnType: {
        type: 'fromDropdown',
        idDropdown: 'TYPE',
        options: 'softwareVars'
    }
});

utils.generateBloqInputConnectors(argument);

module.exports = argument;