/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementInputBloq = require('./../statementInputBloq');

/**
 * Bloq name: while
 *
 * Bloq type: Statement-Input
 *
 * Description: It repeats the following code until the condition is met.
 *
 * Return type: none
 */

var bloqWhile = _.merge(_.clone(StatementInputBloq, true), {

    name: 'while',
    bloqClass: 'bloq-while',
    content: [
        [{
            alias: 'text',
            value: 'bloq-while-while'
        }, {
            bloqInputId: 'ARG1',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            id: 'OPERATOR',
            alias: 'staticDropdown',
            options: [{
                    label: '=',
                    value: '=='
                }, {
                    label: '!=',
                    value: '!='
                }, {
                    label: '>',
                    value: '>'
                }, {
                    label: '>=',
                    value: '>='
                }, {
                    label: '<',
                    value: '<'
                }, {
                    label: '<=',
                    value: '<='
                }] //'=', '≠', '>', '≥', '<', '≤']
        }, {
            bloqInputId: 'ARG2',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-while-exec'
        }]
    ],
    code: 'while ({ARG1} {OPERATOR} {ARG2}){{STATEMENTS}}'
});

utils.generateBloqInputConnectors(bloqWhile);

module.exports = bloqWhile;