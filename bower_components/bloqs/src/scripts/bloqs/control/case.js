/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementInputBloq = require('./../statementInputBloq');

/**
 * Bloq name: case
 *
 * Bloq type: Statement-Input
 *
 * Description: It executes the following code only if the variable
 *              compared in the switch bloq is equal to the given value.
 *
 * Return type: none
 */

var bloqCase = _.merge(_.clone(StatementInputBloq, true), {
    name: 'case',
    bloqClass: 'bloq-case',
    content: [
        [{
            alias: 'text',
            value: 'bloq-case-ifSameTo'
        }, {
            id: 'VAR',
            alias: 'numberInput',
            value: 0
        }, {
            alias: 'text',
            value: 'bloq-case-exec'
        }]
    ],
    code: 'case {VAR}:{{STATEMENTS}break;}'
});

utils.generateBloqInputConnectors(bloqCase);

module.exports = bloqCase;