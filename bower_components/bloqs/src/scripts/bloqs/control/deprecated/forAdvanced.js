/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementInputBloq = require('./../../statementInputBloq');

/**
 * Bloq name: forAdvanced
 *
 * Bloq type: Statement-Input
 *
 * Description: It repeats the following code, iterating a specific variable,
 *              from and until two given values, adding or subtracting one in
 *              each iteration.
 *
 * Return type: none
 */

var forAdvanced = _.merge(_.clone(StatementInputBloq, true), {

    name: 'forAdvanced',
    bloqClass: 'bloq-for deprecated',
    content: [
        [{
            alias: 'text',
            value: 'bloq-for-count'
        }, {
            bloqInputId: 'VAR',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-for-from'
        }, {
            bloqInputId: 'INIT',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-for-to'
        }, {
            bloqInputId: 'FINAL',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            id: 'MODE',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-for-add',
                value: '++'
            }, {
                label: 'bloq-for-subtract',
                value: '--'
            }]
        }, {
            alias: 'text',
            value: 'bloq-for-exec'
        }]
    ],
    code: 'for({VAR}={INIT};{VAR}<{FINAL};{VAR}{MODE}){{STATEMENTS}}'
});

utils.generateBloqInputConnectors(forAdvanced);

module.exports = forAdvanced;