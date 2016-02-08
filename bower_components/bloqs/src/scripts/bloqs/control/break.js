/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementBloq = require('./../statementBloq');

/**
 * Bloq name: break
 *
 * Bloq type: Statement
 *
 * Description: It skips the rest of the current loop.
 *
 * Return type: none
 */

var bloqBreak = _.merge(_.clone(StatementBloq, true), {

    name: 'break',
    bloqClass: 'bloq-break',
    content: [
        [{
            alias: 'text',
            value: 'bloq-break-stopLoop'
        }]
    ],
    code: 'break;'
});

utils.generateBloqInputConnectors(bloqBreak);

module.exports = bloqBreak;