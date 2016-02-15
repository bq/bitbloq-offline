/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementInputBloq = require('./../../statementInputBloq');

/**
 * Bloq name: whileAdvanced
 *
 * Bloq type: Statement-Input
 *
 * Description: It repeats the following code until the condition is true.
 *
 * Return type: none
 */

var whileAdvanced = _.merge(_.clone(StatementInputBloq, true), {

    name: 'whileAdvanced',
    bloqClass: 'bloq-while',
    content: [
        [{
            alias: 'text',
            value: 'bloq-while-while'
        }, {
            bloqInputId: 'CONDITION',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-while-exec'
        }]
    ],
    code: 'while ({CONDITION}){{STATEMENTS}}'
});

utils.generateBloqInputConnectors(whileAdvanced);

module.exports = whileAdvanced;