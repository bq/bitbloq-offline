/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../build-utils'),
    StatementInputBloq = require('./../statementInputBloq');

/**
 * Bloq name: else
 *
 * Bloq type: Statement-Input
 *
 * Description: It executes the following code only if no one of the previous
 *              conditions are met.
 *
 * Return type: none
 */

var bloqElse = _.merge(_.clone(StatementInputBloq, true), {

    name: 'else',
    bloqClass: 'bloq-else',
    content: [
        [{
            alias: 'text',
            value: 'bloq-else-else'
        }]
    ],
    code: 'else {{STATEMENTS}}'
});

utils.generateBloqInputConnectors(bloqElse);

module.exports = bloqElse;