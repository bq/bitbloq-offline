/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementInputBloq = require('./../../statementInputBloq');

/**
 * Bloq name: ifAdvanced
 *
 * Bloq type: Statement-Input
 *
 * Description: It executes the following code only if the condition
 *              is true.
 *
 * Return type: none
 */

var ifAdvanced = _.merge(_.clone(StatementInputBloq, true), {

    name: 'ifAdvanced',
    bloqClass: 'bloq-if',
    content: [
        [{
            alias: 'text',
            value: 'bloq-if-if'
        }, {
            bloqInputId: 'CONDITION',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'bloq-if-exec'
        }]
    ],
    code: 'if({CONDITION}){{STATEMENTS}}'
});

utils.generateBloqInputConnectors(ifAdvanced);

module.exports = ifAdvanced;