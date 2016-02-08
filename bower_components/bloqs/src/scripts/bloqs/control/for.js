/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementInputBloq = require('./../statementInputBloq');

/**
 * Bloq name: for-v1
 *
 * Bloq type: Statement-Input
 *
 * Description: It repeats the following code, iterating a specific variable,
 *              selectable from a drop-down, from and until two given values,
 *              adding or subtracting a determined quantity in each iteration.
 *
 * Return type: none
 */

var forV1 = _.merge(_.clone(StatementInputBloq, true), {

    name: 'for-v1',
    bloqClass: 'bloq-for',
    content: [
        [{
            alias: 'text',
            value: 'bloq-for-count'
        }, {
            id: 'VAR',
            alias: 'dynamicDropdown',
            options: 'softwareVars'
        }, {
            alias: 'text',
            value: 'bloq-for-from'
        }, {
            id: 'INIT',
            alias: 'numberInput',
            value: 0
        }, {
            alias: 'text',
            value: 'bloq-for-to'
        }, {
            id: 'FINAL',
            alias: 'numberInput',
            value: 10
        }, {
            id: 'MODE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-for-add',
                value: '+'
            }, {
                label: 'bloq-for-subtract',
                value: '-'
            }]
        }, {
            id: 'ADD',
            alias: 'numberInput',
            value: 1
        }, {
            alias: 'text',
            value: 'bloq-for-exec'
        }]
    ],
    code: '\'for({VAR}={INIT};{VAR}\' + (\'{MODE}\' === \'+\'?\'<=\':\'>=\' ) + \'{FINAL};{VAR}{MODE}={ADD}){{STATEMENTS}}\''
});

utils.generateBloqInputConnectors(forV1);

module.exports = forV1;