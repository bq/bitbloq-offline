/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    OutputBloq = require('./../outputBloq');

/**
 * Bloq name: logicOperations
 *
 * Bloq type: Output
 *
 * Description: It returns the result of a logic comparison between two given values.
 *
 * Return type: bool
 */

var logicOperations = _.merge(_.clone(OutputBloq, true), {

    name: 'logicOperations',
    bloqClass: 'bloq-logic-operations',
    content: [
        [{
            bloqInputId: 'ARG1',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            id: 'OPERATOR',
            alias: 'staticDropdown',
            options: [{
                label: 'bloq-logic-operations-and',
                value: '&&'
            }, {
                label: 'bloq-logic-operations-or',
                value: '||'
            }]
        }, {
            bloqInputId: 'ARG2',
            alias: 'bloqInput',
            acceptType: 'all'
        }]
    ],
    code: '{ARG1} {OPERATOR} {ARG2}',
    returnType: {
        type: 'simple',
        value: 'bool'
    }
});

utils.generateBloqInputConnectors(logicOperations);

module.exports = logicOperations;