/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: continue
 *
 * Bloq type: Statement
 *
 * Description: It skips the rest of the current iteration of a loop.
 *
 * Return type: none
 */

var bloqContinue = _.merge(_.clone(StatementBloq, true), {

    name: 'continue',
    bloqClass: 'bloq-continue',
    content: [
        [{
            alias: 'text',
            value: 'bloq-continue-continue'
        }]
    ],
    code: 'continue;'
});

utils.generateBloqInputConnectors(bloqContinue);

module.exports = bloqContinue;