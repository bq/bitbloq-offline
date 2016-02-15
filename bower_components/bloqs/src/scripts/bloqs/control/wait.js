/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: wait
 *
 * Bloq type: Statement
 *
 * Description: It delays the progression of the program
 *              the given time.
 *
 * Return type: none
 */

var wait = _.merge(_.clone(StatementBloq, true), {

    name: 'wait',
    bloqClass: 'bloq-wait',
    content: [
        [{
            alias: 'text',
            value: 'bloq-wait-wait'
        }, {
            id: 'TIME',
            alias: 'numberInput',
            value: 2000,
        }, {
            alias: 'text',
            value: 'bloq-wait-ms'
        }]
    ],
    code: 'delay({TIME});'
});

utils.generateBloqInputConnectors(wait);

module.exports = wait;