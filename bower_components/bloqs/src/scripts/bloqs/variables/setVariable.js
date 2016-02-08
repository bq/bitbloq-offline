/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: setVariable
 *
 * Bloq type: Statement
 *
 * Description: It assigns the given value to a specific variable,
 *              selectable from a drop-down.
 *
 * Return type: none
 */

var setVariable = _.merge(_.clone(StatementBloq, true), {

    name: 'setVariable',
    bloqClass: 'bloq-set-variable',
    content: [
        [{
            alias: 'text',
            value: 'bloq-set-variable-variable'
        }, {
            id: 'NAME',
            alias: 'dynamicDropdown',
            options: 'softwareVars'
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
    code: '{NAME} = {VALUE};'
});

utils.generateBloqInputConnectors(setVariable);

module.exports = setVariable;