/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: setClassVariable
 *
 * Bloq type: Statement
 *
 * Description: It sets a variable, selectable from a first drop-down,
 *              of an specific object, selectable from a second drop-down,
 *              with a given input.
 *
 * Return type: none
 */

var setClassVariable = _.merge(_.clone(StatementBloq, true), {

    name: 'setClassVariable',
    bloqClass: 'bloq-set-class-variable',
    content: [
        [{
            alias: 'text',
            value: 'bloq-set-class-variable-variable'
        }, {
            id: 'NAME',
            alias: 'dynamicDropdown',
            options: 'softwareVars'
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
                options: 'softwareVars'
            }
        }]
    ],
    code: '{CLASS}.{NAME} = {VALUE};'
});

utils.generateBloqInputConnectors(setClassVariable);

module.exports = setClassVariable;