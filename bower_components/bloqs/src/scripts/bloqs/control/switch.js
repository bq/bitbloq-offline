/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementInputBloq = require('./../statementInputBloq');

/**
 * Bloq name: switch
 *
 * Bloq type: Statement-Input
 *
 * Description: It establishes the variable with which compare,
 *              selectable from a drop-down.
 *
 * Return type: none
 */

var bloqSwitch = _.merge(_.clone(StatementInputBloq, true), {

    name: 'switch',
    bloqClass: 'bloq-switch',
    content: [
        [{
            alias: 'text',
            value: 'bloq-switch-check'
        }, {
            id: 'VAR',
            alias: 'dynamicDropdown',
            options: 'softwareVars'
        }]
    ],
    code: 'switch (int({VAR})) {{STATEMENTS}}'
});

utils.generateBloqInputConnectors(bloqSwitch);

module.exports = bloqSwitch;