/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../build-utils'),
    StatementInputBloq = require('./../../statementInputBloq');

/**
 * Bloq name: switchAdvanced
 *
 * Bloq type: Statement-Input
 *
 * Description: It establishes the variable with which compare.
 *
 * Return type: none
 */

var switchAdvanced = _.merge(_.clone(StatementInputBloq, true), {

    name: 'switchAdvanced',
    bloqClass: 'bloq-switch',
    content: [
        [{
            alias: 'text',
            value: 'bloq-switch-check'
        }, {
            bloqInputId: 'VAR',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: 'switch (int({VAR})) {{STATEMENTS}}'
});

utils.generateBloqInputConnectors(switchAdvanced);

module.exports = switchAdvanced;